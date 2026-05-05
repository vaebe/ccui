import type { VNode } from 'vue'
import type { SelectOption, SelectProps } from './select-types'
import { computed, defineComponent, h, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { useSelect } from './composables/use-select'
import { selectProps } from './select-types'
import './select.scss'

export default defineComponent({
  name: 'CSelect',
  props: selectProps,
  emits: ['update:modelValue', 'change', 'search', 'visible-change', 'clear'],
  setup(props: SelectProps, { emit }) {
    const ns = useNamespace('select')
    const rootRef = ref<HTMLElement | null>(null)
    const inputRef = ref<HTMLInputElement | null>(null)
    const open = shallowRef(false)
    const activeIndex = shallowRef(0)
    const searchText = shallowRef('')

    const { clearValue, removeValue, selectOption, selectedLabel, selectedOptions, selectedValueSet, visibleOptions } =
      useSelect(props, searchText, emit)

    const hasValue = computed(() => selectedOptions.value.length > 0)
    const visibleTags = computed(() => selectedOptions.value.slice(0, props.maxTagCount))
    const hiddenTagCount = computed(() => Math.max(selectedOptions.value.length - visibleTags.value.length, 0))

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m(props.size)]: !!props.size,
      [ns.m('open')]: open.value,
      [ns.m('disabled')]: props.disabled,
      [ns.m('multiple')]: props.multiple,
    }))

    const setOpen = (value: boolean) => {
      if (props.disabled || open.value === value) {
        return
      }
      open.value = value
      emit('visible-change', value)
      if (value && props.filterable) {
        setTimeout(() => inputRef.value?.focus())
      }
      if (!value) {
        searchText.value = ''
      }
    }

    const onDocumentClick = (event: MouseEvent) => {
      if (!rootRef.value?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    onMounted(() => {
      document.addEventListener('mousedown', onDocumentClick)
    })

    onUnmounted(() => {
      document.removeEventListener('mousedown', onDocumentClick)
    })

    const firstEnabledIndex = () => {
      const index = visibleOptions.value.findIndex((option) => !option.disabled)
      return index < 0 ? 0 : index
    }

    watch(
      () => visibleOptions.value.length,
      () => {
        activeIndex.value = firstEnabledIndex()
      },
    )

    const getNextEnabledIndex = (direction: 1 | -1) => {
      const options = visibleOptions.value
      if (options.length === 0) {
        return 0
      }

      const start = activeIndex.value
      for (let offset = 1; offset <= options.length; offset += 1) {
        const index = (start + offset * direction + options.length) % options.length
        if (!options[index].disabled) {
          return index
        }
      }

      return start
    }

    const onSearchInput = (event: Event) => {
      const value = (event.target as HTMLInputElement).value
      searchText.value = value
      emit('search', value)
      setOpen(true)
    }

    const onSelectOption = (option: SelectOption) => {
      if (option.disabled) {
        return
      }

      selectOption(option)
      if (!props.multiple) {
        setOpen(false)
      }
      if (props.filterable) {
        searchText.value = ''
      }
    }

    const onClear = (event: MouseEvent) => {
      event.stopPropagation()
      clearValue()
      emit('clear')
      setOpen(false)
    }

    const onRemoveTag = (value: SelectOption['value'], event: MouseEvent) => {
      event.stopPropagation()
      removeValue(value)
    }

    const onKeydown = (event: KeyboardEvent) => {
      if (props.disabled) {
        return
      }
      if (event.key === 'Escape') {
        setOpen(false)
        return
      }
      if (event.key === 'Enter') {
        if (!open.value) {
          setOpen(true)
          return
        }
        const option = visibleOptions.value[activeIndex.value]
        if (option) {
          onSelectOption(option)
        }
        return
      }
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
        return
      }
      event.preventDefault()
      setOpen(true)
      if (visibleOptions.value.length === 0) {
        return
      }
      activeIndex.value = getNextEnabledIndex(event.key === 'ArrowDown' ? 1 : -1)
    }

    const renderSearchInput = (placeholder: string) =>
      h('input', {
        ref: inputRef,
        class: ns.e('search'),
        value: searchText.value,
        placeholder,
        disabled: props.disabled,
        onInput: onSearchInput,
        onKeydown,
      })

    const renderSingleSelection = () => {
      if (props.filterable && open.value) {
        return renderSearchInput(hasValue.value ? selectedLabel.value : props.placeholder)
      }

      return h(
        'span',
        {
          class: hasValue.value ? ns.e('single') : ns.e('placeholder'),
        },
        hasValue.value ? selectedLabel.value : props.placeholder,
      )
    }

    const renderTags = (extraChildren: VNode[] = []) =>
      h('div', { class: ns.e('tags') }, [
        ...visibleTags.value.map((option) =>
          h('span', { class: ns.e('tag'), key: option.value }, [
            h('span', { class: ns.e('tag-label') }, option.label),
            h(
              'span',
              {
                class: ns.e('tag-close'),
                onClick: (event: MouseEvent) => onRemoveTag(option.value, event),
              },
              'x',
            ),
          ]),
        ),
        ...(hiddenTagCount.value > 0
          ? [h('span', { class: ns.e('tag'), key: '__more' }, `+${hiddenTagCount.value}`)]
          : []),
        ...extraChildren,
      ])

    const renderMultipleSelection = () => {
      if (hasValue.value) {
        return renderTags(props.filterable && open.value ? [renderSearchInput('')] : [])
      }
      if (props.filterable && open.value) {
        return renderSearchInput(props.placeholder)
      }
      return h('span', { class: ns.e('placeholder') }, props.placeholder)
    }

    const renderOption = (option: SelectOption, index: number) => {
      const selected = selectedValueSet.value.has(option.value)
      return h(
        'li',
        {
          key: option.value,
          class: [
            ns.e('option'),
            index === activeIndex.value && ns.em('option', 'active'),
            selected && ns.em('option', 'selected'),
            option.disabled && ns.em('option', 'disabled'),
          ],
          role: 'option',
          'aria-selected': selected,
          onMouseenter: () => {
            if (!option.disabled) {
              activeIndex.value = index
            }
          },
          onClick: (event: MouseEvent) => {
            event.stopPropagation()
            onSelectOption(option)
          },
        },
        [h('span', null, option.label), selected ? h('span', { class: ns.e('check') }, '*') : null],
      )
    }

    const renderDropdown = () => {
      if (!open.value) {
        return null
      }
      if (props.loading) {
        return h('div', { class: ns.e('dropdown') }, h('div', { class: ns.e('loading') }, props.loadingText))
      }
      if (visibleOptions.value.length === 0) {
        return h('div', { class: ns.e('dropdown') }, h('div', { class: ns.e('empty') }, props.noDataText))
      }
      return h(
        'div',
        { class: ns.e('dropdown') },
        h('ul', { class: ns.e('list'), role: 'listbox' }, visibleOptions.value.map(renderOption)),
      )
    }

    return () =>
      h(
        'div',
        {
          ref: rootRef,
          class: cls.value,
          tabindex: props.disabled ? undefined : 0,
          onClick: () => setOpen(true),
          onKeydown,
        },
        [
          h('div', { class: ns.e('selector') }, [
            h(
              'div',
              { class: ns.e('selection') },
              props.multiple ? renderMultipleSelection() : renderSingleSelection(),
            ),
            props.clearable && hasValue.value && !props.disabled
              ? h('span', { class: ns.e('clear'), onClick: onClear }, 'x')
              : h('span', { class: ns.e('arrow') }, 'v'),
          ]),
          renderDropdown(),
        ],
      )
  },
})
