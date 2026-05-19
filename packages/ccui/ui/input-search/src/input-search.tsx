import type { VNode } from 'vue'
import type { InputSearchProps } from './input-search-types'
import { Icon as IconifyIcon } from '@iconify/vue'
import { computed, defineComponent, Fragment, h, ref, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { inputSearchProps } from './input-search-types'
import './input-search.scss'

function isVNode(value: unknown): value is VNode {
  return value !== null && typeof value === 'object' && '__v_isVNode' in (value as object)
}

export default defineComponent({
  name: 'CInputSearch',
  props: inputSearchProps,
  emits: ['update:modelValue', 'input', 'change', 'focus', 'blur', 'clear', 'press-enter', 'search'],
  setup(props: InputSearchProps, { emit, slots }) {
    const ns = useNamespace('input-search')

    const initial = props.modelValue !== '' ? props.modelValue : (props.defaultValue ?? '')
    const innerValue = ref(initial)

    watch(
      () => props.modelValue,
      (newVal) => {
        if (newVal !== innerValue.value) innerValue.value = newVal
      },
    )

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
    }

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      updateValue(target.value)
    }

    const handleChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      emit('change', target.value)
    }

    const handleFocus = (e: FocusEvent) => emit('focus', e)
    const handleBlur = (e: FocusEvent) => emit('blur', e)

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        emit('press-enter', e)
        triggerSearch(e)
      }
    }

    const handleClear = () => {
      updateValue('')
      emit('clear')
      emit('search', '', undefined)
    }

    const renderLoadingIcon = () => h('i', { class: ns.e('loading-icon'), 'aria-label': 'loading' })
    const renderSearchIcon = () => h(IconifyIcon, { icon: 'mdi:magnify', class: ns.e('search-icon') })

    const renderClear = () => {
      const isInteractive = !props.disabled && !props.readonly
      const showClear = isInteractive && !!props.clearable && !!innerValue.value
      if (!showClear) return null
      return h('i', { class: ns.e('clear'), onClick: handleClear, 'aria-label': 'clear' }, '×')
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
      return h(
        'button',
        {
          type: 'button',
          class: [
            ns.e('button'),
            {
              [ns.em('button', 'icon-only')]: props.enterButton === true && !slots['enter-button'],
              [ns.em('button', 'disabled')]: props.disabled || props.loading,
            },
          ],
          disabled: props.disabled || props.loading,
          onClick: (e: Event) => triggerSearch(e),
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
        : h('span', { class: ns.e('inline-icon'), onClick: (e: Event) => triggerSearch(e) }, renderSearchIcon())
      return h('span', { class: ns.e('suffix') }, [renderClear(), slots.suffix?.(), tail])
    }

    const wrapperCls = computed(() => ({
      [ns.b()]: true,
      [ns.m(props.size)]: !!props.size,
      [ns.m('disabled')]: props.disabled,
      [ns.m('readonly')]: props.readonly,
      [ns.m(`status-${props.status}`)]: !!props.status,
      [ns.m('with-button')]: hasEnterButton.value,
    }))

    return () =>
      h('div', { class: wrapperCls.value }, [
        h('div', { class: ns.e('input-wrap') }, [
          slots.prefix ? h('span', { class: ns.e('prefix') }, slots.prefix()) : null,
          h('input', {
            class: ns.e('inner'),
            type: props.type === 'password' ? 'password' : 'text',
            placeholder: props.placeholder,
            disabled: props.disabled,
            readonly: props.readonly,
            maxlength: props.maxLength,
            value: innerValue.value,
            onInput: handleInput,
            onChange: handleChange,
            onFocus: handleFocus,
            onBlur: handleBlur,
            onKeydown: handleKeydown,
          }),
          renderSuffix(),
        ]),
        renderEnterButton(),
      ])
  },
})
