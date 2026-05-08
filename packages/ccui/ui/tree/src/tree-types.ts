import type { ExtractPropTypes, PropType, VNodeChild } from 'vue'

export type TreeNodeKey = string | number

export interface TreeNodeData {
  key?: TreeNodeKey
  title?: VNodeChild | string
  children?: TreeNodeData[]
  disabled?: boolean
  disableCheckbox?: boolean
  selectable?: boolean
  isLeaf?: boolean
  icon?: VNodeChild
  [key: string]: unknown
}

export interface TreeFieldNames {
  key?: string
  title?: string
  children?: string
  disabled?: string
  disableCheckbox?: string
  isLeaf?: string
  selectable?: string
}

export interface FlattenedTreeNode {
  key: TreeNodeKey
  raw: TreeNodeData
  title: VNodeChild | string
  level: number
  parentKeys: TreeNodeKey[]
  isLeaf: boolean
  disabled: boolean
  disableCheckbox: boolean
  selectable: boolean
  hasChildren: boolean
  childKeys: TreeNodeKey[]
}

export interface TreeSelectInfo {
  selectedKeys: TreeNodeKey[]
  selected: boolean
  node: FlattenedTreeNode
  event: MouseEvent
}

export interface TreeCheckInfo {
  checkedKeys: TreeNodeKey[]
  halfCheckedKeys: TreeNodeKey[]
  checked: boolean
  node: FlattenedTreeNode
  event: MouseEvent
}

export interface TreeExpandInfo {
  expandedKeys: TreeNodeKey[]
  expanded: boolean
  node: FlattenedTreeNode
}

export type TreeDropPosition = 'before' | 'inside' | 'after'

export interface TreeDropInfo {
  event: DragEvent
  node: FlattenedTreeNode
  dragNode: FlattenedTreeNode
  dropPosition: TreeDropPosition
}

export interface TreeFilterPredicate {
  (node: TreeNodeData, parentKeys: TreeNodeKey[]): boolean
}

export const treeProps = {
  data: {
    type: Array as PropType<TreeNodeData[]>,
    default: () => [],
  },
  fieldNames: {
    type: Object as PropType<TreeFieldNames>,
    default: () => ({}),
  },
  selectable: {
    type: Boolean,
    default: true,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  selectedKeys: {
    type: Array as PropType<TreeNodeKey[]>,
    default: undefined,
  },
  defaultSelectedKeys: {
    type: Array as PropType<TreeNodeKey[]>,
    default: () => [],
  },
  checkable: {
    type: Boolean,
    default: false,
  },
  checkedKeys: {
    type: Array as PropType<TreeNodeKey[]>,
    default: undefined,
  },
  defaultCheckedKeys: {
    type: Array as PropType<TreeNodeKey[]>,
    default: () => [],
  },
  checkStrictly: {
    type: Boolean,
    default: false,
  },
  expandedKeys: {
    type: Array as PropType<TreeNodeKey[]>,
    default: undefined,
  },
  defaultExpandedKeys: {
    type: Array as PropType<TreeNodeKey[]>,
    default: () => [],
  },
  defaultExpandAll: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loadData: {
    type: Function as PropType<(node: TreeNodeData) => Promise<void>>,
    default: undefined,
  },
  draggable: {
    type: Boolean,
    default: false,
  },
  showLine: {
    type: Boolean,
    default: false,
  },
  blockNode: {
    type: Boolean,
    default: false,
  },
  searchValue: {
    type: String,
    default: '',
  },
  filterTreeNode: {
    type: Function as PropType<TreeFilterPredicate>,
    default: undefined,
  },
  indentSize: {
    type: Number,
    default: 24,
  },
  virtualScroll: {
    type: Boolean,
    default: false,
  },
  virtualItemHeight: {
    type: Number,
    default: 32,
  },
  virtualMaxHeight: {
    type: Number,
    default: 320,
  },
  focusedKey: {
    type: [String, Number] as PropType<TreeNodeKey>,
    default: undefined,
  },
} as const

export type TreeProps = ExtractPropTypes<typeof treeProps>
