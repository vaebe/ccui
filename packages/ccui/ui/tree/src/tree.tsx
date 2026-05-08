import type { CSSProperties, VNode } from 'vue'
import type { FlattenedTreeNode, TreeDropInfo, TreeDropPosition, TreeNodeKey, TreeProps } from './tree-types'
import { computed, defineComponent, h, ref, shallowRef, toRef } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
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
    'select',
    'check',
    'expand',
    'load',
    'drop',
    'dragstart',
    'dragenter',
    'dragover',
    'dragleave',
  ],
  setup(props: TreeProps, { emit, slots }) {
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
    const dragState = shallowRef<{ key: TreeNodeKey; position: TreeDropPosition } | null>(null)
    const draggingKey = shallowRef<TreeNodeKey | null>(null)

    const triggerExpand = async (node: FlattenedTreeNode, event?: Event) => {
      if (props.disabled) return
      const isExpanded = expandedKeys.value.has(node.key)
      const next = new Set(expandedKeys.value)
      if (isExpanded) {
        next.delete(node.key)
      } else {
        next.add(node.key)
        if (props.loadData && !node.hasChildren && !node.isLeaf && !loadedKeys.value.has(node.key)) {
          loadingKeys.value.add(node.key)
          try {
            await props.loadData(node.raw)
            loadedKeys.value.add(node.key)
            emit('load', Array.from(loadedKeys.value), { event, node })
          } finally {
            loadingKeys.value.delete(node.key)
            loadingKeys.value = new Set(loadingKeys.value)
          }
        }
      }
      const nextArray = Array.from(next)
      setExpandedKeys(nextArray)
      emit('expand', nextArray, { expanded: !isExpanded, node })
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
      const offsetY = event.clientY - rect.top
      const ratio = offsetY / rect.height
      if (ratio < 0.25) return 'before'
      if (ratio > 0.75) return 'after'
      return 'inside'
    }

    const onDragOver = (event: DragEvent, node: FlattenedTreeNode) => {
      if (!props.draggable || draggingKey.value === null) return
      event.preventDefault()
      const position = computePosition(event, event.currentTarget as HTMLElement)
      dragState.value = { key: node.key, position }
      emit('dragover', { event, node })
    }

    const onDragEnter = (event: DragEvent, node: FlattenedTreeNode) => {
      if (!props.draggable) return
      emit('dragenter', { event, node })
    }

    const onDragLeave = (event: DragEvent, node: FlattenedTreeNode) => {
      if (!props.draggable) return
      emit('dragleave', { event, node })
    }

    const onDrop = (event: DragEvent, node: FlattenedTreeNode) => {
      if (!props.draggable || draggingKey.value === null) return
      event.preventDefault()
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
        return slots.switcher({ expanded: expandedKeys.value.has(node.key), node })
      }
      const expanded = expandedKeys.value.has(node.key)
      const loading = loadingKeys.value.has(node.key)
      if (loading) {
        return h('span', { class: ns.e('switcher-loading') }, '○')
      }
      if (node.isLeaf && !node.hasChildren) {
        return h('span', { class: ns.e('switcher-leaf') })
      }
      return h(
        'span',
        {
          class: [ns.e('switcher'), expanded && ns.em('switcher', 'open')],
        },
        expanded ? '▾' : '▸',
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

    const renderNode = (node: FlattenedTreeNode) => {
      const indentStyle: CSSProperties = { paddingLeft: `${props.indentSize * node.level}px` }
      const isSelected = selectedKeys.value.has(node.key)
      const dropOver = dragState.value?.key === node.key
      const dropPos = dropOver ? dragState.value!.position : null

      return h(
        'div',
        {
          key: node.key,
          class: [
            ns.e('node'),
            isSelected && ns.em('node', 'selected'),
            node.disabled && ns.em('node', 'disabled'),
            dropOver && dropPos === 'inside' && ns.em('node', 'drop-inside'),
            dropOver && dropPos === 'before' && ns.em('node', 'drop-before'),
            dropOver && dropPos === 'after' && ns.em('node', 'drop-after'),
            props.blockNode && ns.em('node', 'block'),
          ],
          role: 'treeitem',
          'aria-selected': isSelected,
          'aria-expanded': node.hasChildren ? expandedKeys.value.has(node.key) : undefined,
          'aria-disabled': node.disabled || undefined,
          'data-key': node.key,
          style: indentStyle,
          draggable: props.draggable && !node.disabled ? true : undefined,
          onDragstart: (event: DragEvent) => onDragStart(event, node),
          onDragover: (event: DragEvent) => onDragOver(event, node),
          onDragenter: (event: DragEvent) => onDragEnter(event, node),
          onDragleave: (event: DragEvent) => onDragLeave(event, node),
          onDrop: (event: DragEvent) => onDrop(event, node),
        },
        [
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
              class: ns.e('content'),
              onClick: (event: MouseEvent) => triggerSelect(node, event),
            },
            [renderIcon(node), h('span', { class: ns.e('title') }, renderTitle(node) as never)],
          ),
        ],
      )
    }

    return () => {
      const cls = [
        ns.b(),
        props.disabled && ns.m('disabled'),
        props.showLine && ns.m('show-line'),
        props.draggable && ns.m('draggable'),
      ]

      if (visibleNodes.value.length === 0) {
        return h('div', { class: cls, role: 'tree' }, h('div', { class: ns.e('empty') }, 'No data'))
      }

      return h('div', { class: cls, role: 'tree' }, visibleNodes.value.map(renderNode))
    }
  },
})
