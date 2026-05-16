import type { ExtractPropTypes, PropType, VNodeChild } from 'vue'
import type { CcSemanticClasses, CcSemanticStyles } from '../../shared/hooks/use-semantic'

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

export type TreeExpandAction = 'click' | false

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
  // 点击节点正文是否同时切换展开：
  // - `'click'`（默认）：单击行（标题区域）切换展开 / 收起
  // - `false`：仅 switcher 图标点击触发展开
  expandAction: {
    type: [String, Boolean] as PropType<TreeExpandAction>,
    default: 'click',
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
  dragHoverExpandDelay: {
    type: Number,
    default: 600,
  },
  dragAutoScroll: {
    type: Boolean,
    default: true,
  },
  dragAutoScrollEdge: {
    type: Number,
    default: 32,
  },
  dragAutoScrollSpeed: {
    type: Number,
    default: 12,
  },
  /**
   * 语义化 DOM className 注入。可用 key：`root` / `node` / `switcher` / `label`。
   */
  classNames: {
    type: Object as PropType<CcSemanticClasses>,
    default: undefined,
  },
  /**
   * 语义化 DOM style 注入。可用 key 与 classNames 一致。
   */
  styles: {
    type: Object as PropType<CcSemanticStyles>,
    default: undefined,
  },
} as const

export type TreeProps = ExtractPropTypes<typeof treeProps>
