import type { VNode } from 'vue'
import type { ResolvedSelectOption, SelectProps } from './select-types'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import { computed, defineComponent, h, inject, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { formItemInjectionKey } from '../../form/src/form-types'
import { useSelect } from './composables/use-select'
import { selectProps } from './select-types'
import './select.scss'

export default defineComponent({
  name: 'CSelect',
  props: selectProps,
  emits: ['update:modelValue', 'change', 'search', 'visible-change', 'clear'],
  setup(props: SelectProps, { emit, slots }) {
    const ns = useNamespace('select')
    const rootRef = ref<HTMLElement | null>(null)
    const popupRef = ref<HTMLElement | null>(null)
    const inputRef = ref<HTMLInputElement | null>(null)
    const open = shallowRef(false)
    const activeIndex = shallowRef(0)
    const searchText = shallowRef('')
    const formItem = inject(formItemInjectionKey, null)

    const {
      addTagValue,
      clearValue,
      isMultiple,
      mode,
      removeValue,
      selectOption,
      selectedLabel,
      selectedOptions,
      selectedValueSet,
      visibleFlatOptions,
      visibleOptions,
    } = useSelect(props, searchText, emit)

    const hasValue = computed(() => selectedOptions.value.length > 0)
    const visibleTags = computed(() => selectedOptions.value.slice(0, props.maxTagCount))
    const hiddenTagCount = computed(() => Math.max(selectedOptions.value.length - visibleTags.value.length, 0))
    const showsSearchInput = computed(() => props.filterable || mode.value === 'tags')

    const placement = computed(() => (props.placement === 'auto' ? 'bottom-start' : `${props.placement}-start`))

    const { floatingStyles } = useFloating(rootRef, popupRef, {
      placement: placement as never,
      open,
      whileElementsMounted: autoUpdate,
      middleware: [offset(4), flip(), shift({ padding: 8 })],
    })

    const validationStatus = computed(() => formItem?.validateStatus.value ?? '')
    const mergedStatus = computed(() => props.status || validationStatus.value)

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m(props.size)]: !!props.size,
      [ns.m('open')]: open.value,
      [ns.m('disabled')]: props.disabled,
      [ns.m('multiple')]: isMultiple.value,
      [ns.m('tags')]: mode.value === 'tags',
      [ns.m(mergedStatus.value)]: !!mergedStatus.value,
    }))

    const setOpen = (value: boolean) => {
      if (props.disabled || open.value === value) {
        return
      }
      open.value = value
      emit('visible-change', value)
      if (value && showsSearchInput.value) {
        setTimeout(() => inputRef.value?.focus())
      }
      if (!value) {
        searchText.value = ''
        if (formItem) {
          void formItem.validate('blur')
        }
      }
    }

    const onDocumentClick = (event: MouseEvent) => {
      if (!rootRef.value?.contains(event.target as Node) && !popupRef.value?.contains(event.target as Node)) {
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

    watch(
      () => props.modelValue,
      () => {
        if (formItem) {
          void formItem.validate('change')
        }
      },
    )

    const getNextEnabledIndex = (direction: 1 | -1) => {
      const options = visibleOptions.value
      if (options.length === 0) {
        return 0
      }

      const start = activeIndex.value
      for (let offsetIdx = 1; offsetIdx <= options.length; offsetIdx += 1) {
        const index = (start + offsetIdx * direction + options.length) % options.length
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

    const onSelectOption = (option: ResolvedSelectOption) => {
      if (option.disabled) {
        return
      }

      selectOption(option)
      if (!isMultiple.value) {
        setOpen(false)
      }
      if (showsSearchInput.value) {
        searchText.value = ''
      }
    }

    const onClear = (event: MouseEvent) => {
      event.stopPropagation()
      clearValue()
      emit('clear')
      setOpen(false)
    }

    const onRemoveTag = (value: ResolvedSelectOption['value'], event: MouseEvent) => {
      event.stopPropagation()
      removeValue(value)
    }

    const tryCreateTag = () => {
      if (mode.value !== 'tags') {
        return false
      }
      const created = addTagValue(searchText.value)
      if (created) {
        searchText.value = ''
      }
      return created
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
        if (option && (visibleOptions.value.length > 0 || mode.value !== 'tags')) {
          onSelectOption(option)
          return
        }
        if (mode.value === 'tags' && tryCreateTag()) {
          return
        }
        return
      }
      if (event.key === 'Backspace' && isMultiple.value && !searchText.value && hasValue.value) {
        const lastValue = selectedOptions.value[selectedOptions.value.length - 1]?.value
        if (lastValue !== undefined) {
          removeValue(lastValue)
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

    const labelAsString = (value: unknown) => {
      if (value === null || value === undefined) {
        return ''
      }
      if (typeof value === 'string') {
        return value
      }
      if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value)
      }
      return ''
    }

    const renderSingleSelection = () => {
      if (showsSearchInput.value && open.value) {
        return renderSearchInput(hasValue.value ? labelAsString(selectedLabel.value) : props.placeholder)
      }
      const labelContent = hasValue.value
        ? slots.selected
          ? slots.selected({ option: selectedOptions.value[0] })
          : (selectedLabel.value as VNode | string)
        : props.placeholder

      return h(
        'span',
        {
          class: hasValue.value ? ns.e('single') : ns.e('placeholder'),
        },
        labelContent as never,
      )
    }

    const renderTag = (option: ResolvedSelectOption) => {
      if (slots.tag) {
        return slots.tag({
          option,
          onClose: (event: MouseEvent) => onRemoveTag(option.value, event),
        })
      }
      return h('span', { class: ns.e('tag'), key: option.value }, [
        h('span', { class: ns.e('tag-label') }, option.label as never),
        h(
          'span',
          {
            class: ns.e('tag-close'),
            onClick: (event: MouseEvent) => onRemoveTag(option.value, event),
          },
          'x',
        ),
      ])
    }

    const renderTags = (extraChildren: VNode[] = []) =>
      h('div', { class: ns.e('tags') }, [
        ...visibleTags.value.map(renderTag),
        ...(hiddenTagCount.value > 0
          ? [h('span', { class: ns.e('tag'), key: '__more' }, `+${hiddenTagCount.value}`)]
          : []),
        ...extraChildren,
      ])

    const renderMultipleSelection = () => {
      if (hasValue.value) {
        return renderTags(showsSearchInput.value && open.value ? [renderSearchInput('')] : [])
      }
      if (showsSearchInput.value && open.value) {
        return renderSearchInput(props.placeholder)
      }
      return h('span', { class: ns.e('placeholder') }, props.placeholder)
    }

    const renderOption = (option: ResolvedSelectOption, index: number) => {
      const selected = selectedValueSet.value.has(option.value)
      const optionContent = slots.option
        ? slots.option({ option, selected })
        : [h('span', null, option.label as never), selected ? h('span', { class: ns.e('check') }, '*') : null]

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
        optionContent as never,
      )
    }

    const renderListItems = () => {
      const items = visibleFlatOptions.value
      let optionIndex = -1
      const nodes: VNode[] = []
      for (let i = 0; i < items.length; i += 1) {
        const item = items[i]
        if (item.type === 'group' && item.group) {
          nodes.push(
            h(
              'li',
              { class: ns.e('group-label'), key: `__group_${i}`, role: 'presentation' },
              item.group.label as never,
            ),
          )
        } else if (item.type === 'option' && item.option) {
          optionIndex += 1
          nodes.push(renderOption(item.option, optionIndex))
        }
      }
      return nodes
    }

    const renderDropdown = () => {
      if (!open.value) {
        return null
      }
      const popupCls = [ns.e('dropdown'), props.popupClassName].filter(Boolean)
      if (props.loading) {
        return h(
          'div',
          { ref: popupRef, class: popupCls, style: floatingStyles.value },
          h('div', { class: ns.e('loading') }, props.loadingText),
        )
      }
      if (visibleOptions.value.length === 0) {
        const emptyContent = slots.empty ? slots.empty() : props.noDataText
        return h(
          'div',
          { ref: popupRef, class: popupCls, style: floatingStyles.value },
          h('div', { class: ns.e('empty') }, emptyContent as never),
        )
      }
      return h(
        'div',
        { ref: popupRef, class: popupCls, style: floatingStyles.value },
        h('ul', { class: ns.e('list'), role: 'listbox' }, renderListItems()),
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
          slots.prefix ? h('span', { class: ns.e('prefix') }, slots.prefix()) : null,
          h('div', { class: ns.e('selector') }, [
            h(
              'div',
              { class: ns.e('selection') },
              isMultiple.value ? renderMultipleSelection() : renderSingleSelection(),
            ),
            props.clearable && hasValue.value && !props.disabled
              ? h('span', { class: ns.e('clear'), onClick: onClear }, 'x')
              : h('span', { class: ns.e('arrow') }, 'v'),
          ]),
          slots.suffix ? h('span', { class: ns.e('suffix') }, slots.suffix()) : null,
          renderDropdown(),
        ],
      )
  },
})
