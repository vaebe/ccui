import type { InputNumberProps } from './input-number-types'
import { computed, defineComponent, nextTick, ref, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { inputNumberProps } from './input-number-types'
import './input-number.scss'

export default defineComponent({
  name: 'CInputNumber',
  props: inputNumberProps,
  emits: ['update:modelValue', 'change', 'blur', 'focus', 'input'],
  setup(props: InputNumberProps, { emit, expose }) {
    const ns = useNamespace('input-number')
    const inputRef = ref<HTMLInputElement>()

    // 内部值状态
    const innerValue = ref<number | undefined>(props.modelValue)
    const focused = ref(false)

    // 计算显示值
    const displayValue = computed(() => {
      if (innerValue.value === undefined || innerValue.value === null) {
        return props.allowEmpty ? '' : '0'
      }

      if (props.precision !== undefined) {
        return Number(innerValue.value).toFixed(props.precision)
      }

      return String(innerValue.value)
    })

    // 计算是否禁用增加按钮
    const maxDisabled = computed(() => {
      if (innerValue.value === undefined)
        return false
      return innerValue.value >= props.max
    })

    // 计算是否禁用减少按钮
    const minDisabled = computed(() => {
      if (innerValue.value === undefined)
        return false
      return innerValue.value <= props.min
    })

    // 数值处理函数
    const formatValue = (value: number | string | undefined): number | undefined => {
      if (value === '' || value === undefined || value === null) {
        return props.allowEmpty ? undefined : 0
      }

      let numValue = typeof value === 'string' ? Number.parseFloat(value) : value

      if (Number.isNaN(numValue)) {
        return props.allowEmpty ? undefined : 0
      }

      // 应用精度
      if (props.precision !== undefined) {
        numValue = Number.parseFloat(numValue.toFixed(props.precision))
      }

      // 应用范围限制
      numValue = Math.max(props.min, Math.min(props.max, numValue))

      return numValue
    }

    // 更新值
    const updateValue = (newValue: number | undefined, triggerChange = true) => {
      const oldValue = innerValue.value
      innerValue.value = newValue

      emit('update:modelValue', newValue)
      emit('input', newValue)

      if (triggerChange && oldValue !== newValue) {
        emit('change', newValue, oldValue)
      }
    }

    // 输入处理
    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement
      const value = target.value

      // 正则限制
      if (props.reg) {
        const regex = typeof props.reg === 'string' ? new RegExp(props.reg) : props.reg
        if (!regex.test(value)) {
          target.value = displayValue.value
          return
        }
      }

      // 空值处理
      if (value === '') {
        if (props.allowEmpty) {
          updateValue(undefined, false)
        }
        else {
          target.value = displayValue.value
        }
        return
      }

      const numValue = formatValue(value)
      updateValue(numValue, false)
    }

    // 输入变化处理
    const handleInputChange = (event: Event) => {
      const target = event.target as HTMLInputElement
      const numValue = formatValue(target.value)
      updateValue(numValue)

      // 更新显示值
      nextTick(() => {
        if (inputRef.value) {
          inputRef.value.value = displayValue.value
        }
      })
    }

    // 焦点处理
    const handleFocus = (event: Event) => {
      focused.value = true
      emit('focus', event)
    }

    const handleBlur = (event: Event) => {
      focused.value = false
      emit('blur', event)

      // 失焦时格式化值
      if (inputRef.value) {
        inputRef.value.value = displayValue.value
      }
    }

    // 增加值
    const increase = () => {
      if (props.disabled || maxDisabled.value)
        return

      const currentValue = innerValue.value ?? 0
      const newValue = formatValue(currentValue + props.step)
      updateValue(newValue)
    }

    // 减少值
    const decrease = () => {
      if (props.disabled || minDisabled.value)
        return

      const currentValue = innerValue.value ?? 0
      const newValue = formatValue(currentValue - props.step)
      updateValue(newValue)
    }

    // 键盘事件处理
    const handleKeydown = (event: KeyboardEvent) => {
      if (props.disabled || props.readonly)
        return

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault()
          increase()
          break
        case 'ArrowDown':
          event.preventDefault()
          decrease()
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

    const select = () => {
      inputRef.value?.select()
    }

    expose({
      focus,
      blur,
      select,
    })

    // 监听 modelValue 变化
    watch(
      () => props.modelValue,
      (newValue) => {
        if (newValue !== innerValue.value) {
          innerValue.value = newValue
        }
      },
      { immediate: true },
    )

    return () => {
      const controlsAtRight = props.controlsPosition === 'right'

      return (
        <div
          class={[
            ns.b(),
            {
              [ns.m('disabled')]: props.disabled,
              [ns.m('readonly')]: props.readonly,
              [ns.m('without-controls')]: !props.controls,
              [ns.m('controls-right')]: controlsAtRight,
              [ns.m(props.size)]: props.size !== 'md',
              [ns.m('focused')]: focused.value,
              [ns.m('glow')]: props.showGlowStyle && focused.value,
            },
          ]}
        >
          {/* 左侧控制按钮 */}
          {props.controls && !controlsAtRight && (
            <span
              class={[
                ns.e('decrease'),
                { [ns.is('disabled')]: minDisabled.value || props.disabled },
              ]}
              role="button"
              onClick={decrease}
            >
              <svg viewBox="0 0 1024 1024" width="1em" height="1em">
                <path d="M128 544h768a32 32 0 1 0 0-64H128a32 32 0 0 0 0 64z" />
              </svg>
            </span>
          )}

          {/* 输入框 */}
          <div class={ns.e('input')}>
            <input
              ref={inputRef}
              type="number"
              step={props.step}
              class={ns.e('inner')}
              value={displayValue.value}
              placeholder={props.placeholder}
              disabled={props.disabled}
              readonly={props.readonly}
              min={props.min}
              max={props.max}
              onInput={handleInput}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeydown={handleKeydown}
            />
          </div>

          {/* 左侧增加按钮 */}
          {props.controls && !controlsAtRight && (
            <span
              class={[
                ns.e('increase'),
                { [ns.is('disabled')]: maxDisabled.value || props.disabled },
              ]}
              role="button"
              onClick={increase}
            >
              <svg viewBox="0 0 1024 1024" width="1em" height="1em">
                <path d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64h352z" />
              </svg>
            </span>
          )}

          {/* 右侧控制按钮 */}
          {props.controls && controlsAtRight && (
            <div class={ns.e('controls')}>
              <span
                class={[
                  ns.e('increase'),
                  { [ns.is('disabled')]: maxDisabled.value || props.disabled },
                ]}
                role="button"
                onClick={increase}
              >
                <svg viewBox="0 0 1024 1024" width="1em" height="1em">
                  <path d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64h352z" />
                </svg>
              </span>
              <span
                class={[
                  ns.e('decrease'),
                  { [ns.is('disabled')]: minDisabled.value || props.disabled },
                ]}
                role="button"
                onClick={decrease}
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
