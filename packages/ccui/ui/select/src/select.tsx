import type { VNode } from 'vue'
import type { FormItemInjectedContext } from '../../form/src/form-types'
import type { ResolvedSelectOption, SelectProps } from './select-types'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  inject,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  Teleport,
  Transition,
  watch,
} from 'vue'
import { formItemInjectionKey } from '../../form/src/form-types'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { useVirtualList } from '../../shared/hooks/use-virtual-list'
import { useSelect } from './composables/use-select'
import { selectProps } from './select-types'
import './select.scss'

let uniqueIdCounter = 0

function highlightLabel(label: unknown, keyword: string): VNode | string {
  if (!keyword) return labelAsString(label)
  const str = labelAsString(label)
  const idx = str.toLowerCase().indexOf(keyword.toLowerCase())
  if (idx < 0) return str
  return h('span', null, [
    str.slice(0, idx),
    h('mark', { class: 'ccui-select__highlight' }, str.slice(idx, idx + keyword.length)),
    str.slice(idx + keyword.length),
  ])
}

function labelAsString(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return ''
}

export default defineComponent({
  name: 'CSelect',
  props: selectProps,
  emits: ['update:modelValue', 'change', 'search', 'visible-change', 'clear', 'focus', 'blur'],
  setup(props: SelectProps, { emit, slots }) {
    const ns = useNamespace('select')
    const instance = getCurrentInstance()
    uniqueIdCounter += 1
    const uid = `${instance?.uid ?? uniqueIdCounter}-${uniqueIdCounter}`
    const listboxId = `ccui-select-listbox-${uid}`
    const optionId = (index: number) => `ccui-select-option-${uid}-${index}`

    const rootRef = ref<HTMLElement | null>(null)
    const popupRef = ref<HTMLElement | null>(null)
    const listRef = ref<HTMLElement | null>(null)
    const inputRef = ref<HTMLInputElement | null>(null)
    const open = shallowRef(false)
    const activeIndex = shallowRef(0)
    const searchText = shallowRef('')
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)

    const {
      addTagValue,
      clearValue,
      displayLabelOf,
      isMultiple,
      mode,
      removeValue,
      reorderTagValue,
      selectOption,
      selectedLabel,
      selectedOptions,
      selectedValueSet,
      visibleFlatOptions,
      visibleOptions,
    } = useSelect(props, searchText, emit)
    const draggingTagValue = shallowRef<string | number | null>(null)
    const dragOverTagValue = shallowRef<string | number | null>(null)

    const hasValue = computed(() => selectedOptions.value.length > 0)
    const visibleTags = computed(() => selectedOptions.value.slice(0, props.maxTagCount))
    const hiddenTagCount = computed(() => Math.max(selectedOptions.value.length - visibleTags.value.length, 0))
    const filteringEnabled = computed(() => props.filterable || props.showSearch)
    const showsSearchInput = computed(() => filteringEnabled.value || mode.value === 'tags')

    const placement = computed(() => (props.placement === 'auto' ? 'bottom-start' : `${props.placement}-start`))

    const popupContainer = computed<HTMLElement | null>(() => {
      if (typeof document === 'undefined') return null
      if (props.getPopupContainer) {
        return props.getPopupContainer(rootRef.value)
      }
      if (props.popupAppendToBody) {
        return document.body
      }
      return null
    })

    const teleported = computed(() => popupContainer.value !== null)

    const { floatingStyles } = useFloating(rootRef, popupRef, {
      placement: placement as never,
      open,
      whileElementsMounted: autoUpdate,
      middleware: [offset(4), flip(), shift({ padding: 8 })],
      strategy: computed(() => (teleported.value ? 'fixed' : 'absolute')) as never,
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

    const virtualEnabled = computed(
      () => props.virtualScroll && visibleFlatOptions.value.filter((item) => item.type === 'option').length > 0,
    )

    const virtualItems = computed(() => visibleFlatOptions.value)
    const virtual = useVirtualList(virtualItems, {
      itemHeight: props.virtualItemHeight,
      maxHeight: props.virtualMaxHeight,
    })

    const setOpen = (value: boolean) => {
      if (props.disabled || open.value === value) {
        return
      }
      open.value = value
      emit('visible-change', value)
      if (value) {
        if (props.defaultActiveFirstOption) {
          activeIndex.value = firstEnabledIndex()
        }
        if (showsSearchInput.value) {
          nextTick(() => inputRef.value?.focus())
        }
      }
      if (!value) {
        searchText.value = ''
        if (formItem) {
          void formItem.validate('blur')
        }
      }
    }

    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (rootRef.value?.contains(target)) return
      if (popupRef.value?.contains(target)) return
      setOpen(false)
    }

    onMounted(() => {
      document.addEventListener('mousedown', onDocumentClick)
      if (props.autoFocus) {
        nextTick(() => rootRef.value?.focus())
      }
    })

    onUnmounted(() => {
      document.removeEventListener('mousedown', onDocumentClick)
    })

    const firstEnabledIndex = () => {
      const idx = visibleOptions.value.findIndex((option) => !option.disabled)
      return idx < 0 ? 0 : idx
    }

    watch(
      () => visibleOptions.value.length,
      () => {
        if (props.defaultActiveFirstOption) {
          activeIndex.value = firstEnabledIndex()
        } else {
          activeIndex.value = 0
        }
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

    const getEdgeEnabledIndex = (direction: 1 | -1) => {
      const options = visibleOptions.value
      if (options.length === 0) return 0
      if (direction === 1) {
        for (let i = options.length - 1; i >= 0; i -= 1) {
          if (!options[i].disabled) return i
        }
      } else {
        for (let i = 0; i < options.length; i += 1) {
          if (!options[i].disabled) return i
        }
      }
      return activeIndex.value
    }

    const movePage = (direction: 1 | -1) => {
      const pageStep = Math.max(1, Math.floor(props.virtualMaxHeight / props.virtualItemHeight))
      const options = visibleOptions.value
      if (options.length === 0) return activeIndex.value
      let target = activeIndex.value + direction * pageStep
      target = Math.max(0, Math.min(options.length - 1, target))
      while (target >= 0 && target < options.length && options[target].disabled) {
        target += direction
      }
      if (target < 0 || target >= options.length) target = activeIndex.value
      return target
    }

    const scrollActiveIntoView = () => {
      if (!virtualEnabled.value || !listRef.value) return
      // map activeIndex (which is into visibleOptions) to position in flat items
      const flat = visibleFlatOptions.value
      let optCounter = -1
      let flatIdx = 0
      for (let i = 0; i < flat.length; i += 1) {
        if (flat[i].type === 'option') {
          optCounter += 1
          if (optCounter === activeIndex.value) {
            flatIdx = i
            break
          }
        }
      }
      virtual.scrollToIndex(flatIdx, listRef.value)
    }

    watch(activeIndex, () => {
      void nextTick(scrollActiveIntoView)
    })

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
      if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault()
        setOpen(true)
        activeIndex.value = getEdgeEnabledIndex(event.key === 'Home' ? -1 : 1)
        return
      }
      if (event.key === 'PageUp' || event.key === 'PageDown') {
        event.preventDefault()
        setOpen(true)
        activeIndex.value = movePage(event.key === 'PageDown' ? 1 : -1)
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

    const onFocus = (event: FocusEvent) => {
      emit('focus', event)
    }
    const onBlur = (event: FocusEvent) => {
      emit('blur', event)
    }

    const renderSearchInput = (placeholder: string) =>
      h('input', {
        ref: inputRef,
        class: ns.e('search'),
        value: searchText.value,
        placeholder,
        disabled: props.disabled,
        'aria-autocomplete': 'list',
        'aria-controls': listboxId,
        onInput: onSearchInput,
        onKeydown,
      })

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

    const onTagDragStart = (event: DragEvent, option: ResolvedSelectOption) => {
      if (!props.tagsDraggable || option.disabled) {
        event.preventDefault()
        return
      }
      draggingTagValue.value = option.value
      event.dataTransfer?.setData('text/plain', String(option.value))
    }

    const onTagDragOver = (event: DragEvent, option: ResolvedSelectOption) => {
      if (!props.tagsDraggable || draggingTagValue.value === null) return
      event.preventDefault()
      dragOverTagValue.value = option.value
    }

    const onTagDrop = (event: DragEvent, option: ResolvedSelectOption) => {
      if (!props.tagsDraggable || draggingTagValue.value === null) return
      event.preventDefault()
      const fromValue = draggingTagValue.value
      if (fromValue !== option.value) {
        reorderTagValue(fromValue, option.value)
      }
      draggingTagValue.value = null
      dragOverTagValue.value = null
    }

    const onTagDragEnd = () => {
      draggingTagValue.value = null
      dragOverTagValue.value = null
    }

    const renderTag = (option: ResolvedSelectOption) => {
      if (slots.tag) {
        return slots.tag({
          option,
          onClose: (event: MouseEvent) => onRemoveTag(option.value, event),
        })
      }
      const tagLabel = displayLabelOf(option)
      return h(
        'span',
        {
          class: [
            ns.e('tag'),
            props.tagsDraggable && ns.em('tag', 'draggable'),
            dragOverTagValue.value === option.value && ns.em('tag', 'drop-over'),
            draggingTagValue.value === option.value && ns.em('tag', 'dragging'),
          ],
          key: option.value,
          draggable: props.tagsDraggable && !option.disabled ? true : undefined,
          onDragstart: (event: DragEvent) => onTagDragStart(event, option),
          onDragover: (event: DragEvent) => onTagDragOver(event, option),
          onDrop: (event: DragEvent) => onTagDrop(event, option),
          onDragend: onTagDragEnd,
        },
        [
          h('span', { class: ns.e('tag-label') }, tagLabel as never),
          h(
            'span',
            {
              class: ns.e('tag-close'),
              onClick: (event: MouseEvent) => onRemoveTag(option.value, event),
            },
            'x',
          ),
        ],
      )
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
      const labelContent = props.highlightMatch
        ? highlightLabel(option.label, searchText.value.trim())
        : (option.label as VNode | string)
      const optionContent = slots.option
        ? slots.option({ option, selected })
        : [h('span', null, labelContent as never), selected ? h('span', { class: ns.e('check') }, '*') : null]

      return h(
        'li',
        {
          key: option.value,
          id: optionId(index),
          class: [
            ns.e('option'),
            index === activeIndex.value && ns.em('option', 'active'),
            selected && ns.em('option', 'selected'),
            option.disabled && ns.em('option', 'disabled'),
          ],
          role: 'option',
          'aria-selected': selected,
          'aria-disabled': option.disabled || undefined,
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
          const indent = item.group.depth * 12
          nodes.push(
            h(
              'li',
              {
                class: ns.e('group-label'),
                key: `__group_${i}`,
                role: 'presentation',
                style: indent > 0 ? { paddingLeft: `${indent}px` } : undefined,
              },
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

    const renderVirtualItems = () => {
      const flat = visibleFlatOptions.value
      let optionIndex = -1
      // pre-compute optionIndex offsets for each flat index
      const optionIndexByFlat: number[] = []
      for (const item of flat) {
        optionIndex += item.type === 'option' ? 1 : 0
        optionIndexByFlat.push(item.type === 'option' ? optionIndex : -1)
      }

      return virtual.visible.value.map(({ index, data, top }) => {
        const style = {
          position: 'absolute' as const,
          left: 0,
          right: 0,
          top: `${top}px`,
          height: `${props.virtualItemHeight}px`,
        }
        if (data.type === 'group' && data.group) {
          const indent = data.group.depth * 12
          return h(
            'li',
            {
              key: `__group_${index}`,
              class: ns.e('group-label'),
              role: 'presentation',
              style: indent > 0 ? { ...style, paddingLeft: `${indent}px` } : style,
            },
            data.group.label as never,
          )
        }
        if (data.type === 'option' && data.option) {
          const optIdx = optionIndexByFlat[index]
          const optNode = renderOption(data.option, optIdx)
          // wrap with absolute positioning style on the rendered <li>
          if (optNode.props) {
            optNode.props.style = style
          }
          return optNode
        }
        return null
      })
    }

    const renderListContent = () => {
      if (virtualEnabled.value) {
        return h(
          'div',
          {
            ref: listRef,
            class: ns.e('virtual'),
            style: { height: `${virtual.containerHeight.value}px`, overflow: 'auto', position: 'relative' },
            onScroll: virtual.onScroll,
          },
          h(
            'ul',
            {
              id: listboxId,
              class: ns.e('list'),
              role: 'listbox',
              style: { height: `${virtual.totalHeight.value}px`, position: 'relative' },
            },
            renderVirtualItems(),
          ),
        )
      }
      return h(
        'ul',
        {
          id: listboxId,
          class: ns.e('list'),
          role: 'listbox',
          ref: listRef,
        },
        renderListItems(),
      )
    }

    const buildPopup = (): VNode => {
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
      return h('div', { ref: popupRef, class: popupCls, style: floatingStyles.value }, renderListContent())
    }

    const renderDropdown = () => {
      const popup = open.value ? buildPopup() : null
      const transitioned = h(
        Transition as never,
        { name: props.transitionName, appear: true },
        { default: () => popup },
      )
      if (teleported.value && popupContainer.value) {
        return h(Teleport, { to: popupContainer.value }, [transitioned])
      }
      return transitioned
    }

    const activeDescendant = computed(() => {
      if (!open.value || visibleOptions.value.length === 0) return undefined
      return optionId(activeIndex.value)
    })

    return () =>
      h(
        'div',
        {
          ref: rootRef,
          class: cls.value,
          tabindex: props.disabled ? undefined : 0,
          role: 'combobox',
          'aria-expanded': open.value,
          'aria-haspopup': 'listbox',
          'aria-controls': listboxId,
          'aria-disabled': props.disabled || undefined,
          'aria-activedescendant': activeDescendant.value,
          onClick: () => setOpen(true),
          onKeydown,
          onFocus,
          onBlur,
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
