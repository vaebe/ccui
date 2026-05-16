import type { CSSProperties, VNode } from 'vue'
import type { FlattenedTreeNode, TreeDropInfo, TreeDropPosition, TreeNodeKey, TreeProps } from './tree-types'
import { computed, defineComponent, h, nextTick, onUnmounted, ref, shallowRef, toRef, watch } from 'vue'
import { CaretRightOutlined } from '@vaebe/ccui-icons'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { useVirtualList } from '../../shared/hooks/use-virtual-list'
import { computeNextCheckedKeys, useCheckedDerived } from './composables/use-tree-check'
import { resolveFieldNames, useTreeFlattenAll, useTreeVisible } from './composables/use-tree-flatten'
import { useTreeState } from './composables/use-tree-state'
import { treeProps } from './tree-types'
import './tree.scss'

function gatherAllExpandableKeys(nodes: ReturnType<typeof useTreeFlattenAll>['value']['flatAll']): TreeNodeKey[] {
  return nodes.filter((node) => node.hasChildren).map((node) => node.key)
}

function titleToString(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return ''
}

function highlightTitle(title: unknown, keyword: string): VNode | string {
  const str = titleToString(title)
  if (!keyword) {
    return str
  }
  const lowerStr = str.toLowerCase()
  const lowerKeyword = keyword.toLowerCase()
  const idx = lowerStr.indexOf(lowerKeyword)
  if (idx < 0) {
    return str
  }
  return h('span', null, [
    str.slice(0, idx),
    h('span', { class: 'ccui-tree__highlight' }, str.slice(idx, idx + keyword.length)),
    str.slice(idx + keyword.length),
  ])
}

export default defineComponent({
  name: 'CTree',
  props: treeProps,
  emits: [
    'update:selectedKeys',
    'update:checkedKeys',
    'update:expandedKeys',
    'update:focusedKey',
    'select',
    'check',
    'expand',
    'load',
    'drop',
    'dragstart',
    'dragenter',
    'dragover',
    'dragleave',
    'focus-change',
    'load-error',
  ],
  setup(props: TreeProps, { emit, expose, slots }) {
    const ns = useNamespace('tree')
    const fieldNames = computed(() => resolveFieldNames(props.fieldNames))
    const data = toRef(props, 'data')
    const searchValue = toRef(props, 'searchValue')
    const filterTreeNode = computed(() => props.filterTreeNode)

    const flatAll = useTreeFlattenAll(data, fieldNames)
    const initialExpandedAll = ref<TreeNodeKey[]>([])

    if (props.defaultExpandAll && props.expandedKeys === undefined && (props.defaultExpandedKeys ?? []).length === 0) {
      initialExpandedAll.value = gatherAllExpandableKeys(flatAll.value.flatAll)
    }

    const { selectedKeys, setSelectedKeys, checkedKeys, setCheckedKeys, expandedKeys, setExpandedKeys } = useTreeState(
      props,
      initialExpandedAll,
      emit,
    )

    const checkStrictly = computed(() => props.checkStrictly)
    const checkedDerived = useCheckedDerived(flatAll, checkedKeys, checkStrictly)

    const visibleNodes = useTreeVisible(flatAll, expandedKeys, searchValue, filterTreeNode)

    const loadingKeys = ref(new Set<TreeNodeKey>())
    const loadedKeys = ref(new Set<TreeNodeKey>())
    const loadErrorKeys = ref(new Set<TreeNodeKey>())
    const dragState = shallowRef<{ key: TreeNodeKey; position: TreeDropPosition } | null>(null)
    const draggingKey = shallowRef<TreeNodeKey | null>(null)
    const dragHoverTimer = shallowRef<ReturnType<typeof setTimeout> | null>(null)
    const dragHoverKey = shallowRef<TreeNodeKey | null>(null)
    const autoScrollFrame = shallowRef<number | null>(null)
    const autoScrollDelta = shallowRef(0)

    const internalFocusedKey = ref<TreeNodeKey | undefined>(props.focusedKey)
    const focusedKey = computed<TreeNodeKey | undefined>(() => {
      if (props.focusedKey !== undefined) return props.focusedKey
      return internalFocusedKey.value
    })
    const setFocusedKey = (key: TreeNodeKey | undefined) => {
      if (props.focusedKey === undefined) {
        internalFocusedKey.value = key
      }
      emit('update:focusedKey', key)
      emit('focus-change', key)
    }
    const treeRootRef = ref<HTMLElement | null>(null)
    const scrollContainerRef = ref<HTMLElement | null>(null)

    const visibleKeyToIndex = computed(() => {
      const map = new Map<TreeNodeKey, number>()
      visibleNodes.value.forEach((node, idx) => map.set(node.key, idx))
      return map
    })

    const virtualEnabled = computed(() => props.virtualScroll && visibleNodes.value.length > 0)
    const virtual = useVirtualList(visibleNodes, {
      itemHeight: props.virtualItemHeight,
      maxHeight: props.virtualMaxHeight,
    })

    const runLoadData = async (node: FlattenedTreeNode, event?: Event) => {
      if (!props.loadData) return
      loadErrorKeys.value.delete(node.key)
      loadErrorKeys.value = new Set(loadErrorKeys.value)
      loadingKeys.value.add(node.key)
      loadingKeys.value = new Set(loadingKeys.value)
      try {
        await props.loadData(node.raw)
        loadedKeys.value.add(node.key)
        loadedKeys.value = new Set(loadedKeys.value)
        emit('load', Array.from(loadedKeys.value), { event, node })
      } catch (error) {
        loadErrorKeys.value.add(node.key)
        loadErrorKeys.value = new Set(loadErrorKeys.value)
        emit('load-error', { error, node })
      } finally {
        loadingKeys.value.delete(node.key)
        loadingKeys.value = new Set(loadingKeys.value)
      }
    }

    const triggerExpand = async (node: FlattenedTreeNode, event?: Event) => {
      if (props.disabled) return
      const isExpanded = expandedKeys.value.has(node.key)
      const next = new Set(expandedKeys.value)
      if (isExpanded) {
        next.delete(node.key)
      } else {
        next.add(node.key)
        if (props.loadData && !node.hasChildren && !node.isLeaf && !loadedKeys.value.has(node.key)) {
          await runLoadData(node, event)
        }
      }
      const nextArray = Array.from(next)
      setExpandedKeys(nextArray)
      emit('expand', nextArray, { expanded: !isExpanded, node })
    }

    const retryLoad = async (key: TreeNodeKey) => {
      const node = flatAll.value.byKey.get(key)
      if (!node || !props.loadData) return
      await runLoadData(node)
    }

    const triggerSelect = (node: FlattenedTreeNode, event: MouseEvent) => {
      if (props.disabled || !props.selectable || !node.selectable || node.disabled) {
        return
      }
      const isSelected = selectedKeys.value.has(node.key)
      let nextKeys: TreeNodeKey[]
      if (props.multiple) {
        if (isSelected) {
          nextKeys = Array.from(selectedKeys.value).filter((key) => key !== node.key)
        } else {
          nextKeys = [...selectedKeys.value, node.key]
        }
      } else {
        nextKeys = isSelected ? [] : [node.key]
      }
      setSelectedKeys(nextKeys)
      emit('select', nextKeys, {
        selectedKeys: nextKeys,
        selected: !isSelected,
        node,
        event,
      })
    }

    const triggerCheck = (node: FlattenedTreeNode, event: MouseEvent) => {
      if (props.disabled || !props.checkable || node.disableCheckbox || node.disabled) {
        return
      }
      const wasChecked = checkedDerived.value.checked.has(node.key)
      const baseSet = props.checkStrictly ? checkedKeys.value : checkedDerived.value.checked
      const nextKeys = computeNextCheckedKeys(flatAll.value, baseSet, node.key, props.checkStrictly)
      setCheckedKeys(nextKeys)
      const halfArray = Array.from(checkedDerived.value.halfChecked)
      emit('check', nextKeys, {
        checkedKeys: nextKeys,
        halfCheckedKeys: halfArray,
        checked: !wasChecked,
        node,
        event,
      })
    }

    // Drag & drop
    const onDragStart = (event: DragEvent, node: FlattenedTreeNode) => {
      if (!props.draggable || node.disabled) {
        event.preventDefault()
        return
      }
      draggingKey.value = node.key
      event.dataTransfer?.setData('text/plain', String(node.key))
      emit('dragstart', { event, node })
    }

    const computePosition = (event: DragEvent, target: HTMLElement): TreeDropPosition => {
      const rect = target.getBoundingClientRect()
      if (!rect.height) return 'inside'
      const offsetY = event.clientY - rect.top
      const ratio = offsetY / rect.height
      if (ratio < 0.25) return 'before'
      if (ratio > 0.75) return 'after'
      return 'inside'
    }

    const clearHoverExpandTimer = () => {
      if (dragHoverTimer.value) {
        clearTimeout(dragHoverTimer.value)
        dragHoverTimer.value = null
      }
      dragHoverKey.value = null
    }

    const scheduleHoverExpand = (node: FlattenedTreeNode, event: DragEvent) => {
      if (!props.dragHoverExpandDelay || props.dragHoverExpandDelay <= 0) return
      if (!node.hasChildren && (!props.loadData || node.isLeaf)) return
      if (expandedKeys.value.has(node.key)) return
      if (dragHoverKey.value === node.key) return
      clearHoverExpandTimer()
      dragHoverKey.value = node.key
      dragHoverTimer.value = setTimeout(() => {
        if (draggingKey.value !== null && dragHoverKey.value === node.key) {
          void triggerExpand(node, event)
        }
        dragHoverTimer.value = null
      }, props.dragHoverExpandDelay)
    }

    const stopAutoScroll = () => {
      autoScrollDelta.value = 0
      if (autoScrollFrame.value !== null && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(autoScrollFrame.value)
      }
      autoScrollFrame.value = null
    }

    const stepAutoScroll = () => {
      const container = scrollContainerRef.value
      if (!container || autoScrollDelta.value === 0) {
        autoScrollFrame.value = null
        return
      }
      container.scrollTop += autoScrollDelta.value
      if (typeof requestAnimationFrame === 'function') {
        autoScrollFrame.value = requestAnimationFrame(stepAutoScroll)
      } else {
        autoScrollFrame.value = null
      }
    }

    const updateAutoScroll = (event: DragEvent) => {
      if (!props.dragAutoScroll) return
      const container = scrollContainerRef.value
      if (!container) return
      const rect = container.getBoundingClientRect()
      const edge = props.dragAutoScrollEdge
      const speed = props.dragAutoScrollSpeed
      const distanceFromTop = event.clientY - rect.top
      const distanceFromBottom = rect.bottom - event.clientY
      let delta = 0
      if (distanceFromTop < edge && distanceFromTop > 0) {
        delta = -speed
      } else if (distanceFromBottom < edge && distanceFromBottom > 0) {
        delta = speed
      }
      const wasZero = autoScrollDelta.value === 0
      autoScrollDelta.value = delta
      if (delta !== 0 && wasZero && typeof requestAnimationFrame === 'function') {
        autoScrollFrame.value = requestAnimationFrame(stepAutoScroll)
      } else if (delta === 0) {
        stopAutoScroll()
      }
    }

    const onDragOver = (event: DragEvent, node: FlattenedTreeNode) => {
      if (!props.draggable || draggingKey.value === null) return
      event.preventDefault()
      const position = computePosition(event, event.currentTarget as HTMLElement)
      dragState.value = { key: node.key, position }
      if (position === 'inside') {
        scheduleHoverExpand(node, event)
      } else if (dragHoverKey.value !== null) {
        clearHoverExpandTimer()
      }
      updateAutoScroll(event)
      emit('dragover', { event, node })
    }

    const onDragEnter = (event: DragEvent, node: FlattenedTreeNode) => {
      if (!props.draggable) return
      emit('dragenter', { event, node })
    }

    const onDragLeave = (event: DragEvent, node: FlattenedTreeNode) => {
      if (!props.draggable) return
      if (dragHoverKey.value === node.key) {
        clearHoverExpandTimer()
      }
      emit('dragleave', { event, node })
    }

    const onDrop = (event: DragEvent, node: FlattenedTreeNode) => {
      if (!props.draggable || draggingKey.value === null) return
      event.preventDefault()
      clearHoverExpandTimer()
      stopAutoScroll()
      const dragNode = flatAll.value.byKey.get(draggingKey.value)
      if (!dragNode || dragNode.key === node.key) {
        draggingKey.value = null
        dragState.value = null
        return
      }
      const position = dragState.value?.key === node.key ? dragState.value.position : 'inside'
      const info: TreeDropInfo = { event, node, dragNode, dropPosition: position }
      emit('drop', info)
      draggingKey.value = null
      dragState.value = null
    }

    const renderSwitcher = (node: FlattenedTreeNode) => {
      if (slots.switcher) {
        return slots.switcher({
          expanded: expandedKeys.value.has(node.key),
          node,
          loading: loadingKeys.value.has(node.key),
          loadFailed: loadErrorKeys.value.has(node.key),
        })
      }
      const expanded = expandedKeys.value.has(node.key)
      const loading = loadingKeys.value.has(node.key)
      const failed = loadErrorKeys.value.has(node.key)
      if (loading) {
        return h('span', { class: ns.e('switcher-loading') }, '○')
      }
      if (failed) {
        return h(
          'span',
          {
            class: ns.e('switcher-error'),
            role: 'button',
            title: 'Click to retry',
            onClick: (event: MouseEvent) => {
              event.stopPropagation()
              void retryLoad(node.key)
            },
          },
          '!',
        )
      }
      if (node.isLeaf && !node.hasChildren) {
        return h('span', { class: ns.e('switcher-leaf') })
      }
      return h(
        'span',
        {
          class: [ns.e('switcher'), expanded && ns.em('switcher', 'open'), props.classNames?.switcher],
          style: props.styles?.switcher,
        },
        h(CaretRightOutlined, { size: 12 }),
      )
    }

    const renderCheckbox = (node: FlattenedTreeNode) => {
      if (!props.checkable) return null
      const isChecked = checkedDerived.value.checked.has(node.key)
      const isHalf = checkedDerived.value.halfChecked.has(node.key)
      return h(
        'span',
        {
          class: [
            ns.e('checkbox'),
            isChecked && ns.em('checkbox', 'checked'),
            isHalf && ns.em('checkbox', 'indeterminate'),
            (node.disabled || node.disableCheckbox) && ns.em('checkbox', 'disabled'),
          ],
          role: 'checkbox',
          'aria-checked': isHalf ? 'mixed' : isChecked,
          onClick: (event: MouseEvent) => {
            event.stopPropagation()
            triggerCheck(node, event)
          },
        },
        isChecked ? '✓' : isHalf ? '–' : '',
      )
    }

    const renderTitle = (node: FlattenedTreeNode) => {
      if (slots.title) {
        return slots.title({ node, data: node.raw, expanded: expandedKeys.value.has(node.key) })
      }
      return highlightTitle(node.title, searchValue.value)
    }

    const renderIcon = (node: FlattenedTreeNode) => {
      if (slots.icon) {
        return h('span', { class: ns.e('icon') }, slots.icon({ node, expanded: expandedKeys.value.has(node.key) }))
      }
      if (node.raw.icon) {
        return h('span', { class: ns.e('icon') }, node.raw.icon as never)
      }
      return null
    }

    const renderGuides = (node: FlattenedTreeNode) => {
      if (!props.showLine || node.level === 0) return null
      const guides: VNode[] = []
      for (let i = 0; i < node.level; i += 1) {
        if (slots.connector) {
          guides.push(
            h(
              'span',
              {
                key: `guide-${i}`,
                class: ns.e('guide'),
                style: { left: `${i * props.indentSize + props.indentSize / 2}px` },
              },
              slots.connector({ depth: i, node }) as never,
            ),
          )
        } else {
          guides.push(
            h('span', {
              key: `guide-${i}`,
              class: ns.e('guide'),
              style: { left: `${i * props.indentSize + props.indentSize / 2}px` },
            }),
          )
        }
      }
      return guides
    }

    const onDragEnd = () => {
      clearHoverExpandTimer()
      stopAutoScroll()
      draggingKey.value = null
      dragState.value = null
    }

    const renderNode = (node: FlattenedTreeNode, extraStyle?: CSSProperties) => {
      const indentStyle: CSSProperties = {
        paddingLeft: `${props.indentSize * node.level}px`,
        ...extraStyle,
      }
      const isSelected = selectedKeys.value.has(node.key)
      const isFocused = focusedKey.value === node.key
      const dropOver = dragState.value?.key === node.key
      const dropPos = dropOver ? dragState.value!.position : null
      const isHoverExpand = dragHoverKey.value === node.key

      return h(
        'div',
        {
          key: node.key,
          class: [
            ns.e('node'),
            isSelected && ns.em('node', 'selected'),
            isFocused && ns.em('node', 'focused'),
            node.disabled && ns.em('node', 'disabled'),
            dropOver && dropPos === 'inside' && ns.em('node', 'drop-inside'),
            dropOver && dropPos === 'before' && ns.em('node', 'drop-before'),
            dropOver && dropPos === 'after' && ns.em('node', 'drop-after'),
            props.blockNode && ns.em('node', 'block'),
            isHoverExpand && ns.em('node', 'hover-expand'),
            props.classNames?.node,
          ],
          role: 'treeitem',
          tabindex: isFocused ? 0 : -1,
          'aria-selected': isSelected,
          'aria-expanded': node.hasChildren ? expandedKeys.value.has(node.key) : undefined,
          'aria-disabled': node.disabled || undefined,
          'data-key': node.key,
          style: [indentStyle, props.styles?.node] as any,
          draggable: props.draggable && !node.disabled ? true : undefined,
          onDragstart: (event: DragEvent) => onDragStart(event, node),
          onDragover: (event: DragEvent) => onDragOver(event, node),
          onDragenter: (event: DragEvent) => onDragEnter(event, node),
          onDragleave: (event: DragEvent) => onDragLeave(event, node),
          onDrop: (event: DragEvent) => onDrop(event, node),
          onDragend: onDragEnd,
          onFocus: () => {
            if (focusedKey.value !== node.key) {
              setFocusedKey(node.key)
            }
          },
        },
        [
          ...(renderGuides(node) || []),
          h(
            'span',
            {
              class: ns.e('switcher-wrap'),
              onClick: (event: MouseEvent) => {
                event.stopPropagation()
                if (node.hasChildren || (props.loadData && !node.isLeaf)) {
                  void triggerExpand(node, event)
                }
              },
            },
            renderSwitcher(node),
          ),
          renderCheckbox(node),
          h(
            'span',
            {
              class: [ns.e('content'), props.classNames?.label],
              style: props.styles?.label,
              onClick: (event: MouseEvent) => {
                triggerSelect(node, event)
                if (
                  props.expandAction === 'click' &&
                  !props.disabled &&
                  !node.disabled &&
                  (node.hasChildren || (props.loadData && !node.isLeaf))
                ) {
                  void triggerExpand(node, event)
                }
              },
            },
            [renderIcon(node), h('span', { class: ns.e('title') }, renderTitle(node) as never)],
          ),
        ],
      )
    }

    const moveFocus = (delta: number) => {
      const items = visibleNodes.value
      if (items.length === 0) return
      const currentKey = focusedKey.value
      const currentIdx = currentKey !== undefined ? (visibleKeyToIndex.value.get(currentKey) ?? -1) : -1
      const nextIdx = Math.max(0, Math.min(items.length - 1, currentIdx + delta))
      if (currentIdx === nextIdx && currentKey !== undefined) return
      const nextKey = items[nextIdx].key
      setFocusedKey(nextKey)
    }

    const moveFocusToEdge = (direction: 1 | -1) => {
      const items = visibleNodes.value
      if (items.length === 0) return
      const idx = direction === 1 ? items.length - 1 : 0
      setFocusedKey(items[idx].key)
    }

    const onKeydown = (event: KeyboardEvent) => {
      if (props.disabled) return
      const items = visibleNodes.value
      if (items.length === 0) return
      const currentKey = focusedKey.value ?? items[0].key
      const currentIdx = visibleKeyToIndex.value.get(currentKey) ?? 0
      const node = items[currentIdx]

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          moveFocus(1)
          break
        case 'ArrowUp':
          event.preventDefault()
          moveFocus(-1)
          break
        case 'ArrowRight':
          event.preventDefault()
          if (node.hasChildren && !expandedKeys.value.has(node.key)) {
            void triggerExpand(node, event)
          } else if (node.hasChildren) {
            // already expanded: move into first child
            const firstChild = items[currentIdx + 1]
            if (firstChild && firstChild.parentKeys.includes(node.key)) {
              setFocusedKey(firstChild.key)
            }
          } else if (props.loadData && !node.isLeaf && !loadedKeys.value.has(node.key)) {
            void triggerExpand(node, event)
          }
          break
        case 'ArrowLeft':
          event.preventDefault()
          if (node.hasChildren && expandedKeys.value.has(node.key)) {
            void triggerExpand(node, event)
          } else if (node.parentKeys.length > 0) {
            const parentKey = node.parentKeys[node.parentKeys.length - 1]
            setFocusedKey(parentKey)
          }
          break
        case 'Home':
          event.preventDefault()
          moveFocusToEdge(-1)
          break
        case 'End':
          event.preventDefault()
          moveFocusToEdge(1)
          break
        case 'Enter':
        case ' ': {
          event.preventDefault()
          const mouseEvent = new MouseEvent('click') as MouseEvent
          if (props.checkable) {
            triggerCheck(node, mouseEvent)
          } else {
            triggerSelect(node, mouseEvent)
          }
          break
        }
      }
    }

    const escapeAttrValue = (value: string): string => {
      if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
        return CSS.escape(value)
      }
      return value.replace(/(["\\])/g, '\\$1')
    }

    const scrollFocusedIntoView = () => {
      const key = focusedKey.value
      if (key === undefined) return
      const idx = visibleKeyToIndex.value.get(key)
      if (idx === undefined) return
      if (virtualEnabled.value) {
        virtual.scrollToIndex(idx, scrollContainerRef.value)
      } else if (treeRootRef.value) {
        const el = treeRootRef.value.querySelector<HTMLElement>(`[data-key="${escapeAttrValue(String(key))}"]`)
        el?.focus({ preventScroll: false })
      }
    }

    watch(focusedKey, () => {
      void nextTick(scrollFocusedIntoView)
    })

    onUnmounted(() => {
      clearHoverExpandTimer()
      stopAutoScroll()
    })

    expose({
      retryLoad,
      isNodeLoading: (key: TreeNodeKey) => loadingKeys.value.has(key),
      hasLoadError: (key: TreeNodeKey) => loadErrorKeys.value.has(key),
    })

    return () => {
      const cls = [
        ns.b(),
        props.disabled && ns.m('disabled'),
        props.showLine && ns.m('show-line'),
        props.draggable && ns.m('draggable'),
        props.classNames?.root,
      ]
      const rootStyle = props.styles?.root

      if (visibleNodes.value.length === 0) {
        return h(
          'div',
          { ref: treeRootRef, class: cls, style: rootStyle, role: 'tree', onKeydown },
          h('div', { class: ns.e('empty') }, 'No data'),
        )
      }

      if (virtualEnabled.value) {
        const renderedItems = virtual.visible.value.map(({ data, top }) =>
          renderNode(data, {
            position: 'absolute',
            top: `${top}px`,
            left: 0,
            right: 0,
            height: `${props.virtualItemHeight}px`,
          }),
        )
        return h(
          'div',
          {
            ref: treeRootRef,
            class: cls,
            style: rootStyle,
            role: 'tree',
            onKeydown,
          },
          h(
            'div',
            {
              ref: scrollContainerRef,
              class: ns.e('virtual'),
              style: {
                height: `${virtual.containerHeight.value}px`,
                overflow: 'auto',
                position: 'relative',
              },
              onScroll: virtual.onScroll,
            },
            h('div', { style: { height: `${virtual.totalHeight.value}px`, position: 'relative' } }, renderedItems),
          ),
        )
      }

      return h(
        'div',
        {
          ref: treeRootRef,
          class: cls,
          style: rootStyle,
          role: 'tree',
          onKeydown,
          tabindex: focusedKey.value === undefined ? 0 : -1,
        },
        visibleNodes.value.map((node) => renderNode(node)),
      )
    }
  },
})
