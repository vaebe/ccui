import type { VNode } from 'vue'
import type { FormItemInjectedContext } from '../../form/src/form-types'
import type { InputSearchProps } from './input-search-types'
import { Icon as IconifyIcon } from '@iconify/vue'
import {
  computed,
  defineComponent,
  Fragment,
  getCurrentInstance,
  h,
  inject,
  nextTick,
  onBeforeUpdate,
  onUpdated,
  ref,
  watch,
} from 'vue'
import { formItemInjectionKey } from '../../form/src/form-types'
import { renderIconNode } from '../../shared/hooks/use-icon'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { inputSearchProps } from './input-search-types'
import './input-search.scss'

function isVNode(value: unknown): value is VNode {
  return value !== null && typeof value === 'object' && '__v_isVNode' in (value as object)
}

export default defineComponent({
  name: 'CInputSearch',
  inheritAttrs: false,
  props: inputSearchProps,
  emits: ['update:modelValue', 'input', 'change', 'focus', 'blur', 'clear', 'press-enter', 'search'],
  setup(props: InputSearchProps, { attrs, emit, slots }) {
    const ns = useNamespace('input-search')
    const instance = getCurrentInstance()
    const inputRef = ref<HTMLInputElement | null>(null)
    const rootRef = ref<HTMLElement | null>(null)
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)
    const validationStatus = computed(() => formItem?.validateStatus.value ?? '')
    const mergedStatus = computed(() => props.status || validationStatus.value)

    const hasModelValue = () => {
      const vnodeProps = instance?.vnode.props
      return !!vnodeProps && ('modelValue' in vnodeProps || 'model-value' in vnodeProps)
    }
    let modelValueWasProvided = hasModelValue()
    const initial = modelValueWasProvided ? props.modelValue : (props.defaultValue ?? '')
    const innerValue = ref(initial)
    const isComposing = ref(false)
    let compositionValueToIgnore: string | null = null
    let focusWithin = false
    let focusedElement: EventTarget | null = null

    watch(
      () => props.modelValue,
      (newVal) => {
        if (newVal !== innerValue.value) innerValue.value = newVal
      },
    )

    onBeforeUpdate(() => {
      const modelValueIsProvided = hasModelValue()
      if (modelValueIsProvided && !modelValueWasProvided && props.modelValue !== innerValue.value) {
        innerValue.value = props.modelValue
      }
      modelValueWasProvided = modelValueIsProvided
    })

    const hasEnterButton = computed(() => {
      const v = props.enterButton
      if (v === false || v === '' || v === undefined || v === null) return !!slots['enter-button']
      return true
    })

    const triggerSearch = (e?: Event) => {
      if (props.disabled || props.loading) return
      emit('search', innerValue.value, e)
    }

    const updateValue = (value: string) => {
      innerValue.value = value
      emit('update:modelValue', value)
      emit('input', value)
      void formItem?.validate('change')
    }

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (props.disabled || props.readonly || isComposing.value) return
      if (compositionValueToIgnore === target.value) {
        compositionValueToIgnore = null
        return
      }
      updateValue(target.value)
    }

    const handleCompositionStart = () => {
      if (props.disabled || props.readonly) return
      isComposing.value = true
      compositionValueToIgnore = null
    }

    const handleCompositionEnd = (e: CompositionEvent) => {
      if (!isComposing.value) return
      isComposing.value = false
      if (props.disabled || props.readonly) return
      const target = e.target as HTMLInputElement
      compositionValueToIgnore = target.value
      queueMicrotask(() => {
        compositionValueToIgnore = null
      })
      updateValue(target.value)
    }

    const handleChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      emit('change', target.value)
    }

    const handleFocus = (e: FocusEvent) => {
      focusedElement = e.currentTarget
      if (focusWithin) return
      focusWithin = true
      emit('focus', e)
    }
    const settleBlur = (e: FocusEvent) => {
      if (!focusWithin) return
      focusWithin = false
      focusedElement = null
      emit('blur', e)
      void formItem?.validate('blur')
    }
    const handleBlur = (e: FocusEvent) => {
      const next = e.relatedTarget as Node | null
      if (next && rootRef.value?.contains(next)) return
      void nextTick(() => {
        if (rootRef.value?.contains(document.activeElement)) return
        settleBlur(e)
      })
    }

    // 浏览器不会可靠地为被 Vue 直接卸载的已聚焦节点派发 blur。动态 loading、modelValue
    // 或 disabled 可能移除 inline-search / clear，因此在 patch 后主动结算聚合焦点状态。
    onUpdated(() => {
      if (!focusWithin) return
      const focusedNode = focusedElement instanceof Node ? focusedElement : null
      if (focusedNode?.isConnected && rootRef.value?.contains(focusedNode)) return
      settleBlur(new FocusEvent('blur'))
    })

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !isComposing.value && !e.isComposing && e.keyCode !== 229) {
        emit('press-enter', e)
        triggerSearch(e)
      }
    }

    const handleClear = () => {
      if (props.disabled || props.readonly || !innerValue.value) return
      updateValue('')
      emit('clear')
      triggerSearch()
      inputRef.value?.focus()
    }

    const renderLoadingIcon = () => h('i', { class: ns.e('loading-icon'), 'aria-hidden': 'true' })
    const renderSearchIcon = () => h(IconifyIcon, { icon: 'mdi:magnify', class: ns.e('search-icon') })

    const renderClear = () => {
      const isInteractive = !props.disabled && !props.readonly
      const showClear = isInteractive && !!props.clearable && !!innerValue.value
      if (!showClear) return null
      return h(
        'span',
        {
          class: ns.e('clear'),
          role: 'button',
          tabindex: 0,
          onMousedown: (e: MouseEvent) => e.preventDefault(),
          onClick: handleClear,
          onFocus: handleFocus,
          onBlur: handleBlur,
          onKeydown: (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleClear()
            }
          },
          'aria-label': '清除输入',
        },
        [renderIconNode('mdi:close-circle')],
      )
    }

    const renderEnterButtonContent = () => {
      if (slots['enter-button']) {
        return h(Fragment, null, slots['enter-button']!())
      }
      const v = props.enterButton
      if (v === true) {
        return props.loading ? renderLoadingIcon() : renderSearchIcon()
      }
      if (typeof v === 'string') return v
      if (isVNode(v)) return v
      return null
    }

    const renderEnterButton = () => {
      if (!hasEnterButton.value) return null
      const isIconOnly = props.enterButton === true && !slots['enter-button']
      return h(
        'button',
        {
          type: 'button',
          class: [
            ns.e('button'),
            {
              [ns.em('button', 'icon-only')]: isIconOnly,
              [ns.em('button', 'disabled')]: props.disabled || props.loading,
            },
          ],
          disabled: props.disabled || props.loading,
          'aria-label': isIconOnly ? '搜索' : undefined,
          'aria-busy': props.loading ? 'true' : undefined,
          onMousedown: (e: MouseEvent) => e.preventDefault(),
          onClick: (e: Event) => triggerSearch(e),
          onFocus: handleFocus,
          onBlur: handleBlur,
        },
        [renderEnterButtonContent()],
      )
    }

    const renderSuffix = () => {
      if (hasEnterButton.value) {
        return h('span', { class: ns.e('suffix') }, [renderClear(), slots.suffix?.()])
      }
      const tail = props.loading
        ? renderLoadingIcon()
        : h(
            'span',
            {
              class: ns.e('inline-icon'),
              role: 'button',
              tabindex: props.disabled ? -1 : 0,
              'aria-label': '搜索',
              'aria-disabled': props.disabled ? 'true' : undefined,
              onMousedown: (e: MouseEvent) => e.preventDefault(),
              onClick: (e: Event) => triggerSearch(e),
              onFocus: handleFocus,
              onBlur: handleBlur,
              onKeydown: (e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  triggerSearch(e)
                }
              },
            },
            renderSearchIcon(),
          )
      return h('span', { class: ns.e('suffix') }, [renderClear(), slots.suffix?.(), tail])
    }

    const wrapperCls = computed(() => ({
      [ns.b()]: true,
      [ns.m(props.size)]: !!props.size,
      [ns.m('disabled')]: props.disabled,
      [ns.m('readonly')]: props.readonly,
      [ns.m(`status-${mergedStatus.value}`)]: !!mergedStatus.value,
      [ns.m('with-button')]: hasEnterButton.value,
    }))

    const getInputAttrs = () => {
      const { class: _class, style: _style, 'aria-describedby': describedBy, ...nativeAttrs } = attrs
      const descriptionIds = [describedBy, formItem?.messageId?.value]
        .filter((value): value is string => typeof value === 'string' && value.length > 0)
        .flatMap((value) => value.split(/\s+/))
      return {
        ...nativeAttrs,
        ref: inputRef,
        class: [ns.e('inner'), props.classNames?.input],
        style: props.styles?.input,
        type: props.type === 'password' ? 'password' : 'text',
        placeholder: props.placeholder,
        disabled: props.disabled,
        readonly: props.readonly,
        maxlength: props.maxLength,
        value: innerValue.value,
        'aria-invalid': mergedStatus.value === 'error' ? 'true' : undefined,
        'aria-describedby': [...new Set(descriptionIds)].join(' ') || undefined,
        'aria-disabled': props.disabled ? 'true' : undefined,
        'aria-readonly': props.readonly ? 'true' : undefined,
        onInput: handleInput,
        onChange: handleChange,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onKeydown: handleKeydown,
        onCompositionstart: handleCompositionStart,
        onCompositionend: handleCompositionEnd,
      }
    }

    return () =>
      h(
        'div',
        {
          ref: rootRef,
          class: [wrapperCls.value, props.classNames?.root, attrs.class],
          style: [props.styles?.root, attrs.style],
        },
        [
          h('div', { class: [ns.e('input-wrap'), props.classNames?.wrapper], style: props.styles?.wrapper }, [
            slots.prefix ? h('span', { class: ns.e('prefix') }, slots.prefix()) : null,
            h('input', getInputAttrs()),
            renderSuffix(),
          ]),
          renderEnterButton(),
        ],
      )
  },
})
