import type { VNode } from 'vue'
import type { FormItemInjectedContext } from '../../form/src/form-types'
import type { InputAllowClearObject, InputProps, InputShowCountObject } from './input-types'
import { Icon as IconifyIcon } from '@iconify/vue'
import { computed, defineComponent, getCurrentInstance, inject, ref, watch } from 'vue'
import { formItemInjectionKey } from '../../form/src/form-types'
import { isPropExplicit, warnDeprecated } from '../../shared/utils/deprecated'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { inputProps } from './input-types'
import './input.scss'

function isIconifyName(name: string): boolean {
  return name.includes(':')
}

function isAllowClearObject(value: unknown): value is InputAllowClearObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

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

    // M-A5：旧 prop 一次性 deprecation warn（全局 per-key 一次）
    const rawProps = getCurrentInstance()?.vnode.props as Record<string, unknown> | undefined
    if (isPropExplicit(rawProps, 'clearable', 'clearable')) {
      warnDeprecated('clearable', 'allowClear', 'Input')
    }
    if (isPropExplicit(rawProps, 'prepend', 'prepend')) {
      warnDeprecated('prepend', 'addonBefore', 'Input')
    }
    if (isPropExplicit(rawProps, 'append', 'append')) {
      warnDeprecated('append', 'addonAfter', 'Input')
    }

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

    // allowClear：显式 prop > clearable 旧布尔
    const allowClearResolved = computed(() => {
      if (props.allowClear !== undefined) return props.allowClear
      return props.clearable
    })
    const allowClearEnabled = computed(() => {
      const v = allowClearResolved.value
      if (typeof v === 'boolean') return v
      return v !== undefined && v !== null
    })
    const customClearIcon = computed<VNode | string | undefined>(() => {
      const v = allowClearResolved.value
      return isAllowClearObject(v) ? v.clearIcon : undefined
    })

    // addonBefore / addonAfter 优先，回退到 prepend / append
    const addonBeforeText = computed(() => props.addonBefore || props.prepend)
    const addonAfterText = computed(() => props.addonAfter || props.append)
    const hasAddonBefore = computed(() => !!addonBeforeText.value || !!slots['addon-before'] || !!slots.prepend)
    const hasAddonAfter = computed(() => !!addonAfterText.value || !!slots['addon-after'] || !!slots.append)

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
      const hasInteractiveSuffix = isInteractive && (allowClearEnabled.value || showPasswordVisible.value)
      const hasSuffix = hasInteractiveSuffix || !!slots.suffix || showCountEnabled.value
      const hasPrefix = !!slots.prefix

      return {
        [ns.b()]: true,
        [ns.m(props.size)]: !!props.size,
        [ns.m('disabled')]: props.disabled,
        [ns.m('readonly')]: props.readonly,
        [ns.m('clearable')]: allowClearEnabled.value,
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

    // ── 渲染辅助 ──────────────────────────────────────────
    const renderClearIcon = () => {
      const custom = customClearIcon.value
      if (!custom) return <i class={ns.e('clear')} onClick={clearInput}></i>
      if (typeof custom === 'string') {
        return isIconifyName(custom) ? (
          <span class={ns.e('clear')} onClick={clearInput}>
            <IconifyIcon icon={custom} />
          </span>
        ) : (
          <i class={[ns.e('clear'), custom]} onClick={clearInput}></i>
        )
      }
      return (
        <span class={ns.e('clear')} onClick={clearInput}>
          {custom as VNode}
        </span>
      )
    }

    const renderAddonBefore = () => {
      if (!hasAddonBefore.value) return null
      // slot 优先：addon-before 主名 > prepend 旧名 > string prop
      const slotContent = slots['addon-before'] ? slots['addon-before']() : slots.prepend?.()
      return <div class={ns.e('prepend')}>{slotContent ?? <span>{addonBeforeText.value}</span>}</div>
    }

    const renderAddonAfter = () => {
      if (!hasAddonAfter.value) return null
      const slotContent = slots['addon-after'] ? slots['addon-after']() : slots.append?.()
      return <div class={ns.e('append')}>{slotContent ?? <span>{addonAfterText.value}</span>}</div>
    }

    const renderSuffix = () => {
      const isInteractive = !props.disabled && !props.readonly
      const hasClear = isInteractive && allowClearEnabled.value && !!inputValue.value
      const hasPasswordToggle = isInteractive && showPasswordVisible.value
      const hasSuffixSlot = !!slots.suffix
      const hasCount = showCountEnabled.value

      if (!hasClear && !hasPasswordToggle && !hasSuffixSlot && !hasCount) return null

      return (
        <div class={ns.e('suffix')}>
          {hasClear && renderClearIcon()}
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
