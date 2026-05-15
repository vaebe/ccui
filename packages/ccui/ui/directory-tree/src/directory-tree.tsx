import type { VNode } from 'vue'
import type { FlattenedTreeNode, TreeFieldNames, TreeNodeData, TreeNodeKey } from '../../tree/src/tree-types'
import type { DirectoryTreeProps } from './directory-tree-types'
import { computed, defineComponent, h, ref, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import Tree from '../../tree/src/tree'
import { directoryTreeProps } from './directory-tree-types'

// 计算所有「带子节点」的 key（用于 defaultExpandAll 初始展开）。
function collectExpandableKeys(data: TreeNodeData[], fieldNames: TreeFieldNames | undefined): TreeNodeKey[] {
  const keyField = fieldNames?.key ?? 'key'
  const childrenField = fieldNames?.children ?? 'children'
  const result: TreeNodeKey[] = []
  let auto = 0
  const walk = (nodes: TreeNodeData[]) => {
    nodes.forEach((node) => {
      const children = node[childrenField] as TreeNodeData[] | undefined
      if (Array.isArray(children) && children.length > 0) {
        const rawKey = node[keyField] as TreeNodeKey | undefined
        result.push(rawKey ?? (`__auto_${auto++}` as TreeNodeKey))
        walk(children)
      }
    })
  }
  walk(data ?? [])
  return result
}

// 三个内置 SVG 图标：folder closed / folder open / file。
// 24×24 viewBox，简化 filled 形态，视觉与 Ant DirectoryTree 一致风格。
function folderClosedIcon(): VNode {
  return h(
    'svg',
    { viewBox: '0 0 24 24', width: '14', height: '14', 'aria-hidden': 'true' },
    h('path', {
      fill: 'currentColor',
      d: 'M3 5h6l2 2h10v12H3z',
    }),
  )
}

function folderOpenIcon(): VNode {
  return h(
    'svg',
    { viewBox: '0 0 24 24', width: '14', height: '14', 'aria-hidden': 'true' },
    h('path', {
      fill: 'currentColor',
      d: 'M3 5h6l2 2h10v3H6l-3 9z',
    }),
  )
}

function fileIcon(): VNode {
  return h(
    'svg',
    { viewBox: '0 0 24 24', width: '14', height: '14', 'aria-hidden': 'true' },
    h('path', {
      fill: 'currentColor',
      d: 'M6 3h8l4 4v14H6z M14 3v4h4',
    }),
  )
}

export default defineComponent({
  name: 'CDirectoryTree',
  props: directoryTreeProps,
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
  setup(props: DirectoryTreeProps, { emit, slots, attrs, expose }) {
    const ns = useNamespace('directory-tree')

    // 内部 ref 镜像 expandedKeys，用于 expandAction='click' 触发的展开切换。
    // 受控优先：父级 v-model:expandedKeys 非 undefined 时走受控分支。
    const isControlledExpanded = computed(() => props.expandedKeys !== undefined)

    // 初始展开：受控值 > defaultExpandedKeys > defaultExpandAll 计算的全部带子节点 > 空。
    const initialExpanded = (): TreeNodeKey[] => {
      if (props.expandedKeys !== undefined) return [...props.expandedKeys]
      const explicit = props.defaultExpandedKeys ?? []
      if (explicit.length > 0) return [...explicit]
      if (props.defaultExpandAll) return collectExpandableKeys(props.data, props.fieldNames)
      return []
    }
    const innerExpandedKeys = ref<TreeNodeKey[]>(initialExpanded())
    const currentExpandedKeys = computed<TreeNodeKey[]>(() =>
      isControlledExpanded.value ? props.expandedKeys! : innerExpandedKeys.value,
    )

    watch(
      () => props.expandedKeys,
      (next) => {
        if (next !== undefined) innerExpandedKeys.value = [...next]
      },
    )

    const updateExpanded = (nextKeys: TreeNodeKey[], expanded: boolean, node: FlattenedTreeNode) => {
      if (!isControlledExpanded.value) {
        innerExpandedKeys.value = nextKeys
      }
      emit('update:expandedKeys', nextKeys)
      emit('expand', nextKeys, { expanded, node })
    }

    const handleTreeExpand = (nextKeys: TreeNodeKey[], info: { expanded: boolean; node: FlattenedTreeNode }) => {
      // 来自 Tree switcher 图标点击；同步内部 + 转发。
      updateExpanded(nextKeys, info.expanded, info.node)
    }

    // expandAction='click' 时拦截 select，把 folder 同步切换展开。
    const handleTreeSelect = (
      selectedKeys: TreeNodeKey[],
      info: { selected: boolean; node: FlattenedTreeNode; event: MouseEvent },
    ) => {
      emit('update:selectedKeys', selectedKeys)
      emit('select', selectedKeys, info)
      if (props.expandAction !== 'click') return
      const node = info.node
      const isFolder = node.hasChildren || (props.loadData !== undefined && !node.isLeaf)
      if (!isFolder) return
      const current = currentExpandedKeys.value
      const has = current.includes(node.key)
      const nextKeys = has ? current.filter((k) => k !== node.key) : [...current, node.key]
      updateExpanded(nextKeys, !has, node)
    }

    // 暴露底层 Tree 引用，方便父组件调用其暴露的方法。
    const treeRef = ref<InstanceType<typeof Tree> | null>(null)
    expose({
      get tree() {
        return treeRef.value
      },
    })

    // 计算把哪些 props 透传到底层 Tree。
    // 注意：把 expandedKeys 始终透传为 currentExpandedKeys，让 Tree 走受控分支，避免内部状态分裂。
    const treeForwardProps = computed(() => ({
      data: props.data,
      fieldNames: props.fieldNames,
      selectable: props.selectable,
      multiple: props.multiple,
      selectedKeys: props.selectedKeys,
      defaultSelectedKeys: props.defaultSelectedKeys,
      checkable: props.checkable,
      checkedKeys: props.checkedKeys,
      defaultCheckedKeys: props.defaultCheckedKeys,
      checkStrictly: props.checkStrictly,
      expandedKeys: currentExpandedKeys.value,
      defaultExpandedKeys: props.defaultExpandedKeys,
      defaultExpandAll: props.defaultExpandAll,
      disabled: props.disabled,
      loadData: props.loadData,
      draggable: props.draggable,
      showLine: props.showLine,
      blockNode: props.blockNode,
      searchValue: props.searchValue,
      filterTreeNode: props.filterTreeNode,
      indentSize: props.indentSize,
      virtualScroll: props.virtualScroll,
      virtualItemHeight: props.virtualItemHeight,
      virtualMaxHeight: props.virtualMaxHeight,
      focusedKey: props.focusedKey,
      dragHoverExpandDelay: props.dragHoverExpandDelay,
      dragAutoScroll: props.dragAutoScroll,
      dragAutoScrollEdge: props.dragAutoScrollEdge,
      dragAutoScrollSpeed: props.dragAutoScrollSpeed,
    }))

    // Tree 事件转发。select / expand 已被本组件拦截。
    const treeEventHandlers = {
      onSelect: handleTreeSelect,
      onExpand: handleTreeExpand,
      'onUpdate:checkedKeys': (keys: TreeNodeKey[]) => emit('update:checkedKeys', keys),
      'onUpdate:focusedKey': (key: TreeNodeKey | undefined) => emit('update:focusedKey', key),
      onCheck: (keys: TreeNodeKey[], info: unknown) => emit('check', keys, info),
      onLoad: (keys: TreeNodeKey[], info: unknown) => emit('load', keys, info),
      onDrop: (info: unknown) => emit('drop', info),
      onDragstart: (info: unknown) => emit('dragstart', info),
      onDragenter: (info: unknown) => emit('dragenter', info),
      onDragover: (info: unknown) => emit('dragover', info),
      onDragleave: (info: unknown) => emit('dragleave', info),
      'onFocus-change': (key: TreeNodeKey | undefined) => emit('focus-change', key),
      'onLoad-error': (key: TreeNodeKey, error: unknown) => emit('load-error', key, error),
    }

    // 内置 icon slot：用户 slot 优先，其次 node.raw.icon，最后 folder/file 内置。
    const builtinIcon = (scope: { node: FlattenedTreeNode; expanded: boolean }) => {
      if (!props.showIcon) return null
      if (scope.node.raw.icon !== undefined && scope.node.raw.icon !== null) {
        return scope.node.raw.icon as never
      }
      if (scope.node.hasChildren) {
        return scope.expanded ? folderOpenIcon() : folderClosedIcon()
      }
      return fileIcon()
    }

    return () =>
      h('div', { class: ns.b() }, [
        h(
          Tree,
          {
            ...treeForwardProps.value,
            ...treeEventHandlers,
            ...attrs,
            ref: treeRef as any,
          },
          {
            ...slots,
            icon: slots.icon ?? builtinIcon,
          },
        ),
      ])
  },
})
