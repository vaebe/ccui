import type { FormItemInjectedContext } from '../../form/src/form-types'
import type { InputNumberInstance, InputNumberProps, InputNumberValue } from './input-number-types'
import { computed, defineComponent, inject, mergeProps, nextTick, ref, watch } from 'vue'
import { formItemInjectionKey } from '../../form/src/form-types'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { inputNumberProps } from './input-number-types'
import './input-number.scss'

function getDecimalPlaces(value: number): number {
  const [coefficient, exponentText] = value.toString().toLowerCase().split('e')
  const fractionLength = coefficient.split('.')[1]?.length ?? 0
  const exponent = Number(exponentText ?? 0)
  return Math.min(15, Math.max(0, fractionLength - exponent))
}

function addStep(value: number, step: number, direction: 1 | -1): number {
  const factor = 10 ** Math.max(getDecimalPlaces(value), getDecimalPlaces(step))
  const result = (Math.round(value * factor) + direction * Math.round(step * factor)) / factor
  return Number.isFinite(result) ? result : value + direction * step
}

export default defineComponent({
  name: 'CInputNumber',
  inheritAttrs: false,
  props: inputNumberProps,
  emits: ['update:modelValue', 'change', 'blur', 'focus', 'input'],
  setup(props: InputNumberProps, { attrs, emit, expose }) {
    const ns = useNamespace('input-number')
    const inputRef = ref<HTMLInputElement>()
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)
    const validationStatus = computed(() => formItem?.validateStatus.value ?? '')
    const mergedStatus = computed(() => props.status || validationStatus.value)

    const normalizedPrecision = computed(() => {
      if (props.precision === undefined || !Number.isFinite(props.precision)) return undefined
      return Math.min(100, Math.max(0, Math.trunc(props.precision)))
    })
    const normalizedMin = computed(() => (Number.isFinite(props.min) ? props.min : -Infinity))
    const normalizedMax = computed(() => {
      const max = Number.isFinite(props.max) ? props.max : Infinity
      return Math.max(normalizedMin.value, max)
    })
    const normalizedStep = computed(() => (Number.isFinite(props.step) && props.step > 0 ? props.step : 1))

    const formatValue = (value: number | string | undefined | null): InputNumberValue => {
      if (value === '' || value === undefined || value === null) {
        return props.allowEmpty ? undefined : 0
      }

      let numValue = typeof value === 'string' ? Number.parseFloat(value) : value
      if (!Number.isFinite(numValue)) return props.allowEmpty ? undefined : 0

      if (normalizedPrecision.value !== undefined) {
        numValue = Number.parseFloat(numValue.toFixed(normalizedPrecision.value))
      }

      return Math.max(normalizedMin.value, Math.min(normalizedMax.value, numValue))
    }

    // 内部值状态；committedValue 用于让原生 change 保留本次编辑前的旧值。
    const innerValue = ref<InputNumberValue>(formatValue(props.modelValue))
    const committedValue = ref<InputNumberValue>(innerValue.value)
    const focused = ref(false)
    const composing = ref(false)
    let composedInputValue: string | undefined

    // 计算显示值
    const displayValue = computed(() => {
      if (innerValue.value === undefined || innerValue.value === null) {
        return props.allowEmpty ? '' : '0'
      }

      if (normalizedPrecision.value !== undefined) {
        return Number(innerValue.value).toFixed(normalizedPrecision.value)
      }

      return String(innerValue.value)
    })

    // 计算是否禁用增加按钮
    const maxDisabled = computed(() => {
      if (innerValue.value === undefined || innerValue.value === null) return false
      return innerValue.value >= normalizedMax.value
    })

    // 计算是否禁用减少按钮
    const minDisabled = computed(() => {
      if (innerValue.value === undefined || innerValue.value === null) return false
      return innerValue.value <= normalizedMin.value
    })

    // 更新值
    const updateValue = (newValue: InputNumberValue, triggerChange = true, forceEmit = false) => {
      newValue = formatValue(newValue)
      const oldValue = innerValue.value
      if (oldValue === newValue) {
        if (forceEmit) {
          emit('update:modelValue', newValue)
          emit('input', newValue)
          formItem?.validate('change')
        }
        if (triggerChange) committedValue.value = newValue
        return
      }
      innerValue.value = newValue

      emit('update:modelValue', newValue)
      emit('input', newValue)

      if (triggerChange && oldValue !== newValue) {
        emit('change', newValue, oldValue)
        committedValue.value = newValue
      }

      formItem?.validate('change')
    }

    // 输入处理
    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement
      const value = target.value

      if (composing.value) return
      if (composedInputValue !== undefined) {
        const shouldSkip = value === composedInputValue
        composedInputValue = undefined
        if (shouldSkip) return
      }

      // 正则限制
      if (props.reg) {
        let regex: RegExp
        try {
          regex = typeof props.reg === 'string' ? new RegExp(props.reg) : props.reg
        } catch {
          regex = /(?:)/
        }
        regex.lastIndex = 0
        if (!regex.test(value)) {
          target.value = displayValue.value
          return
        }
      }

      // 空值处理
      if (value === '') {
        if (props.allowEmpty) {
          updateValue(undefined, false, true)
        } else {
          target.value = displayValue.value
        }
        return
      }

      const numValue = formatValue(value)
      updateValue(numValue, false, true)
    }

    const handleCompositionStart = () => {
      composing.value = true
      composedInputValue = undefined
    }

    const handleCompositionEnd = (event: CompositionEvent) => {
      if (!composing.value) return
      composing.value = false
      handleInput(event)
      // 浏览器通常在 compositionend 后再派发一次相同最终值的 input；吞掉该尾随事件。
      composedInputValue = (event.target as HTMLInputElement).value
    }

    // 输入变化处理
    const handleInputChange = (event: Event) => {
      composedInputValue = undefined
      const target = event.target as HTMLInputElement
      const numValue = formatValue(target.value)
      if (numValue !== innerValue.value) updateValue(numValue, false)
      if (numValue !== committedValue.value) {
        emit('change', numValue, committedValue.value)
        committedValue.value = numValue
      }

      // 更新显示值
      void nextTick(() => {
        if (inputRef.value) {
          inputRef.value.value = displayValue.value
        }
      })
    }

    // 焦点处理
    const handleFocus = (event: FocusEvent) => {
      focused.value = true
      emit('focus', event)
    }

    const handleBlur = (event: FocusEvent) => {
      handleInputChange(event)
      focused.value = false
      emit('blur', event)

      // 失焦时格式化值
      if (inputRef.value) {
        inputRef.value.value = displayValue.value
      }

      formItem?.validate('blur')
    }

    // 增加值
    const increase = () => {
      if (props.disabled || props.readonly || maxDisabled.value) return

      const currentValue = innerValue.value ?? 0
      const newValue = formatValue(addStep(currentValue, normalizedStep.value, 1))
      updateValue(newValue)
    }

    // 减少值
    const decrease = () => {
      if (props.disabled || props.readonly || minDisabled.value) return

      const currentValue = innerValue.value ?? 0
      const newValue = formatValue(addStep(currentValue, normalizedStep.value, -1))
      updateValue(newValue)
    }

    // 键盘事件处理
    const handleKeydown = (event: KeyboardEvent) => {
      if (props.disabled || props.readonly) return

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault()
          increase()
          break
        case 'ArrowDown':
          event.preventDefault()
          decrease()
          break
        case 'Enter':
          handleInputChange(event)
          break
      }
    }

    // 暴露的方法
    const focus = () => {
      inputRef.value?.focus()
    }

    const blur = () => {
      inputRef.value?.blur()
    }

    // 实例方法
    const instance: InputNumberInstance = {
      getValue: () => innerValue.value,
      setValue: (value: InputNumberValue) => updateValue(value),
      focus,
      blur,
      increase,
      decrease,
    }

    expose(instance)

    // 监听 modelValue 变化
    watch(
      () => props.modelValue,
      (newValue) => {
        const normalizedValue = formatValue(newValue)
        if (normalizedValue !== innerValue.value) {
          innerValue.value = normalizedValue
          committedValue.value = normalizedValue
        }
      },
      { immediate: true },
    )

    watch(
      () => [props.min, props.max, props.precision, props.allowEmpty] as const,
      () => {
        const normalizedValue = formatValue(innerValue.value)
        if (normalizedValue !== innerValue.value) {
          updateValue(normalizedValue)
        }
      },
    )

    watch(
      () => props.disabled,
      (disabled) => {
        if (disabled && focused.value) inputRef.value?.blur()
      },
    )

    return () => {
      const controlsAtRight = props.controlsPosition === 'right'
      const { class: rootClass, style: rootStyle, 'aria-describedby': describedBy, ...nativeAttrs } = attrs
      const descriptionIds = [describedBy, formItem?.messageId?.value]
        .filter((value): value is string => typeof value === 'string' && value.length > 0)
        .flatMap((value) => value.split(/\s+/))
      const ariaDescribedBy = [...new Set(descriptionIds)].join(' ') || undefined
      const min = Number.isFinite(normalizedMin.value) ? normalizedMin.value : undefined
      const max = Number.isFinite(normalizedMax.value) ? normalizedMax.value : undefined
      const controlDisabled = props.disabled || props.readonly
      const inputAttrs = mergeProps(nativeAttrs, {
        ref: inputRef,
        type: 'number',
        step: normalizedStep.value,
        class: ns.e('inner'),
        value: displayValue.value,
        placeholder: props.placeholder,
        disabled: props.disabled,
        readonly: props.readonly,
        min,
        max,
        role: 'spinbutton',
        'aria-valuenow': innerValue.value,
        'aria-valuetext': innerValue.value === undefined ? undefined : displayValue.value,
        'aria-valuemin': min,
        'aria-valuemax': max,
        'aria-describedby': ariaDescribedBy,
        'aria-disabled': props.disabled ? true : undefined,
        'aria-readonly': props.readonly ? true : undefined,
        'aria-invalid': mergedStatus.value === 'error' ? true : undefined,
        onInput: handleInput,
        onCompositionstart: handleCompositionStart,
        onCompositionend: handleCompositionEnd,
        onChange: handleInputChange,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onKeydown: handleKeydown,
      })

      return (
        <div
          class={[
            ns.b(),
            {
              [ns.m('disabled')]: props.disabled,
              [ns.m('readonly')]: props.readonly,
              [ns.m('without-controls')]: !props.controls,
              [ns.m('controls-right')]: controlsAtRight,
              [ns.m(props.size)]: props.size !== 'default',
              [ns.m('focused')]: focused.value,
              [ns.m('glow')]: props.showGlowStyle && focused.value,
              [ns.m(`variant-${props.variant}`)]: !!props.variant,
              [ns.m(`status-${mergedStatus.value}`)]: !!mergedStatus.value,
            },
            props.classNames?.root,
            rootClass,
          ]}
          style={[props.styles?.root, rootStyle]}
        >
          {/* 左侧控制按钮 */}
          {props.controls && !controlsAtRight && (
            <span
              class={[ns.e('decrease'), { [ns.is('disabled')]: minDisabled.value || props.disabled }]}
              role="button"
              tabindex="-1"
              aria-label="减少"
              aria-disabled={minDisabled.value || controlDisabled || undefined}
              onClick={decrease}
              onKeydown={(e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  decrease()
                }
              }}
            >
              <svg viewBox="0 0 1024 1024" width="1em" height="1em">
                <path d="M128 544h768a32 32 0 1 0 0-64H128a32 32 0 0 0 0 64z" />
              </svg>
            </span>
          )}

          {/* 输入框 */}
          <div class={[ns.e('input'), props.classNames?.input]} style={props.styles?.input}>
            <input {...inputAttrs} />
          </div>

          {/* 左侧增加按钮 */}
          {props.controls && !controlsAtRight && (
            <span
              class={[ns.e('increase'), { [ns.is('disabled')]: maxDisabled.value || props.disabled }]}
              role="button"
              tabindex="-1"
              aria-label="增加"
              aria-disabled={maxDisabled.value || controlDisabled || undefined}
              onClick={increase}
              onKeydown={(e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  increase()
                }
              }}
            >
              <svg viewBox="0 0 1024 1024" width="1em" height="1em">
                <path d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64h352z" />
              </svg>
            </span>
          )}

          {/* 右侧控制按钮 */}
          {props.controls && controlsAtRight && (
            <div class={[ns.e('controls'), props.classNames?.controls]} style={props.styles?.controls}>
              <span
                class={[ns.e('increase'), { [ns.is('disabled')]: maxDisabled.value || props.disabled }]}
                role="button"
                tabindex="-1"
                aria-label="增加"
                aria-disabled={maxDisabled.value || controlDisabled || undefined}
                onClick={increase}
                onKeydown={(e: KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    increase()
                  }
                }}
              >
                <svg viewBox="0 0 1024 1024" width="1em" height="1em">
                  <path d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64h352z" />
                </svg>
              </span>
              <span
                class={[ns.e('decrease'), { [ns.is('disabled')]: minDisabled.value || props.disabled }]}
                role="button"
                tabindex="-1"
                aria-label="减少"
                aria-disabled={minDisabled.value || controlDisabled || undefined}
                onClick={decrease}
                onKeydown={(e: KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    decrease()
                  }
                }}
              >
                <svg viewBox="0 0 1024 1024" width="1em" height="1em">
                  <path d="M128 544h768a32 32 0 1 0 0-64H128a32 32 0 0 0 0 64z" />
                </svg>
              </span>
            </div>
          )}
        </div>
      )
    }
  },
})
