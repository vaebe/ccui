import type { FormItemInjectedContext } from '../../form/src/form-types'
import type { InputProps, InputShowCountObject } from './input-types'
import { computed, defineComponent, inject, ref, watch } from 'vue'
import { formItemInjectionKey } from '../../form/src/form-types'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { inputProps } from './input-types'
import './input.scss'

function isShowCountObject(value: unknown): value is InputShowCountObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export default defineComponent({
  name: 'CInput',
  props: inputProps,
  emits: ['update:modelValue', 'input', 'change', 'focus', 'blur', 'clear', 'press-enter'],
  setup(props: InputProps, { emit, slots }) {
    const ns = useNamespace('input')
    const inputRef = ref<HTMLInputElement | null>(null)
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)
    const validationStatus = computed(() => formItem?.validateStatus.value ?? '')
    const mergedStatus = computed(() => props.status || validationStatus.value)

    // ── 受控 / 非受控值（defaultValue 仅在首次取） ─────────
    const initial = props.modelValue !== '' ? props.modelValue : (props.defaultValue ?? '')
    const inputValue = ref(initial)
    const isFocused = ref(false)
    const isPasswordVisible = ref(false)

    // ── 计算属性 ─────────────────────────────────────────
    const showPasswordVisible = computed(() => props.type === 'password' && props.showPassword)

    const currentType = computed(() => {
      if (props.type === 'password' && showPasswordVisible.value && isPasswordVisible.value) {
        return 'text'
      }
      return props.type
    })

    const hasAddonBefore = computed(() => !!props.prepend || !!slots.prepend)
    const hasAddonAfter = computed(() => !!props.append || !!slots.append)

    // showCount：boolean | { formatter }
    const showCountEnabled = computed(() => {
      const v = props.showCount
      return typeof v === 'boolean' ? v : v !== undefined && v !== null
    })
    const showCountFormatter = computed<InputShowCountObject['formatter'] | undefined>(() => {
      const v = props.showCount
      return isShowCountObject(v) ? v.formatter : undefined
    })
    const countText = computed(() => {
      if (!showCountEnabled.value) return ''
      const value = inputValue.value ?? ''
      const count = value.length
      const maxLength = props.maxLength
      if (showCountFormatter.value) {
        return showCountFormatter.value({ value, count, maxLength })
      }
      return maxLength !== undefined ? `${count} / ${maxLength}` : `${count}`
    })

    // ── class ──────────────────────────────────────────
    const getBaseClass = computed(() => {
      const isInteractive = !props.disabled && !props.readonly
      const hasInteractiveSuffix = isInteractive && (props.clearable || showPasswordVisible.value)
      const hasSuffix = hasInteractiveSuffix || !!slots.suffix || showCountEnabled.value
      const hasPrefix = !!slots.prefix

      return {
        [ns.b()]: true,
        [ns.m(props.size)]: !!props.size,
        [ns.m('disabled')]: props.disabled,
        [ns.m('readonly')]: props.readonly,
        [ns.m('clearable')]: props.clearable,
        [ns.m('suffix')]: hasSuffix,
        [ns.m('prefix')]: hasPrefix,
        [ns.m(`status-${mergedStatus.value}`)]: !!mergedStatus.value,
        [ns.m(`variant-${props.variant}`)]: !!props.variant,
      }
    })

    const getWrapperClass = computed(() => ({
      [ns.e('wrapper')]: true,
      [ns.em('wrapper', props.size)]: !!props.size,
      [ns.em('wrapper', 'disabled')]: props.disabled,
      [ns.em('wrapper', `status-${mergedStatus.value}`)]: !!mergedStatus.value,
      [ns.em('wrapper', `variant-${props.variant}`)]: !!props.variant,
    }))

    const inputClass = computed(() => ({
      [ns.e('inner')]: true,
      [ns.m(props.size)]: !!props.size,
      [ns.m('disabled')]: props.disabled,
      [ns.m('readonly')]: props.readonly,
    }))

    // ── 事件 ────────────────────────────────────────────
    const updateValue = (value: string) => {
      inputValue.value = value
      emit('update:modelValue', value)
      emit('input', value)
      formItem?.validate('change')
    }

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      updateValue(target.value)
    }

    const handleChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      emit('change', target.value)
    }

    const handleFocus = (e: FocusEvent) => {
      isFocused.value = true
      emit('focus', e)
    }

    const handleBlur = (e: FocusEvent) => {
      isFocused.value = false
      emit('blur', e)
      formItem?.validate('blur')
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        emit('press-enter', e)
      }
    }

    const clearInput = () => {
      updateValue('')
      emit('clear')
    }

    const togglePasswordVisible = () => {
      isPasswordVisible.value = !isPasswordVisible.value
    }

    watch(
      () => props.modelValue,
      (newVal) => {
        if (newVal !== inputValue.value) {
          inputValue.value = newVal
        }
      },
    )

    // 当密码显隐能力关闭（type 离开 'password' 或 showPassword 关闭）时，
    // 复位 isPasswordVisible，避免残留显隐态在下次进入 password 模式时直接以明文展示
    watch(
      () => showPasswordVisible.value,
      (v) => {
        if (!v) isPasswordVisible.value = false
      },
    )

    const renderAddonBefore = () => {
      if (!hasAddonBefore.value) return null
      const slotContent = slots.prepend?.()
      return <div class={ns.e('prepend')}>{slotContent ?? <span>{props.prepend}</span>}</div>
    }

    const renderAddonAfter = () => {
      if (!hasAddonAfter.value) return null
      const slotContent = slots.append?.()
      return <div class={ns.e('append')}>{slotContent ?? <span>{props.append}</span>}</div>
    }

    const renderSuffix = () => {
      const isInteractive = !props.disabled && !props.readonly
      const hasClear = isInteractive && props.clearable && !!inputValue.value
      const hasPasswordToggle = isInteractive && showPasswordVisible.value
      const hasSuffixSlot = !!slots.suffix
      const hasCount = showCountEnabled.value

      if (!hasClear && !hasPasswordToggle && !hasSuffixSlot && !hasCount) return null

      return (
        <div class={ns.e('suffix')}>
          {hasClear && <i class={ns.e('clear')} onClick={clearInput}></i>}
          {hasPasswordToggle && (
            <i
              class={isPasswordVisible.value ? ns.e('password-visible') : ns.e('password-hidden')}
              onClick={togglePasswordVisible}
            />
          )}
          {hasSuffixSlot && slots.suffix!()}
          {hasCount && <span class={ns.e('count')}>{countText.value}</span>}
        </div>
      )
    }

    const getInputAttrs = () => ({
      ref: inputRef,
      class: [inputClass.value, props.classNames?.input],
      style: props.styles?.input,
      placeholder: props.placeholder,
      disabled: props.disabled,
      readonly: props.readonly,
      maxlength: props.maxLength,
      value: inputValue.value,
      'aria-invalid': mergedStatus.value === 'error' ? true : undefined,
      'aria-disabled': props.disabled ? true : undefined,
      'aria-readonly': props.readonly ? true : undefined,
      onInput: handleInput,
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onKeydown: handleKeydown,
    })

    return () => {
      const prependContent = renderAddonBefore()
      const appendContent = renderAddonAfter()

      const inputElement = <input {...getInputAttrs()} type={currentType.value} />

      const mainContent = (
        <>
          {slots.prefix && <div class={ns.e('prefix')}>{slots.prefix()}</div>}
          {inputElement}
          {renderSuffix()}
        </>
      )

      if (prependContent || appendContent) {
        return (
          <div class={[getBaseClass.value, props.classNames?.root]} style={props.styles?.root}>
            {prependContent}
            <div class={[getWrapperClass.value, props.classNames?.wrapper]} style={props.styles?.wrapper}>
              {mainContent}
            </div>
            {appendContent}
          </div>
        )
      }

      const combinedClass = {
        ...getBaseClass.value,
        ...getWrapperClass.value,
      }
      return (
        <div
          class={[combinedClass, props.classNames?.root, props.classNames?.wrapper]}
          style={[props.styles?.root, props.styles?.wrapper] as any}
        >
          {mainContent}
        </div>
      )
    }
  },
})
