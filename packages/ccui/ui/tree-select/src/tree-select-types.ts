import type { ExtractPropTypes, PropType } from 'vue'
import type { TreeNodeData, TreeNodeKey } from '../../tree/src/tree-types'

/**
 * 对标 ant `TreeSelect.SHOW_PARENT` / `.SHOW_CHILD` / `.SHOW_ALL`：`showCheckedStrategy` 取值。
 *
 * - `TREE_SELECT_SHOW_PARENT`：父子都选中时只输出父节点（默认与 Tree.SHOW_PARENT 一致）
 * - `TREE_SELECT_SHOW_CHILD`：只输出叶子节点
 * - `TREE_SELECT_SHOW_ALL`：输出所有选中节点（父 + 子全集）
 *
 * 与 ant 的 `TreeSelect.SHOW_*` 静态属性等价，**不挂命名空间**，从 `vue3-ccui` 顶层 export。
 * 当前 ccui TreeSelect 尚未接入 `showCheckedStrategy` 这条 API；常量先 export 出去，方便外部代码
 * 提前按 ant 习惯引用，待后续 batch 接入实际逻辑时直接对接。
 */
export const TREE_SELECT_SHOW_PARENT = 'SHOW_PARENT' as const
export const TREE_SELECT_SHOW_CHILD = 'SHOW_CHILD' as const
export const TREE_SELECT_SHOW_ALL = 'SHOW_ALL' as const
export type TreeSelectShowCheckedStrategy =
  | typeof TREE_SELECT_SHOW_PARENT
  | typeof TREE_SELECT_SHOW_CHILD
  | typeof TREE_SELECT_SHOW_ALL

export type TreeSelectSize = 'large' | 'default' | 'small'
export type TreeSelectStatus = '' | 'error' | 'warning' | 'success' | 'validating'
export type TreeSelectPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
export type TreeSelectModelValue = TreeNodeKey | TreeNodeKey[] | null
export type GetPopupContainer = (triggerNode: HTMLElement | null) => HTMLElement | null

// TreeSelect 自己的 fieldNames（label/value/children/disabled）— 与 Cascader / Select 一致；
// 内部会转成 c-tree 期望的 (title/key/children/disabled)。
export interface TreeSelectFieldNames {
  label?: string
  value?: string
  children?: string
  disabled?: string
}

export const treeSelectProps = {
  modelValue: {
    type: [String, Number, Array] as PropType<TreeSelectModelValue>,
    default: undefined,
  },
  treeData: {
    type: Array as PropType<TreeNodeData[]>,
    default: () => [],
  },
  fieldNames: {
    type: Object as PropType<TreeSelectFieldNames>,
    default: () => ({}),
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  // 多选模式下，是否在 Tree 节点前展示 checkbox（默认开启）。
  // false 时多选走 c-tree 的 multiple selectable 模式（不显示 checkbox）。
  treeCheckable: {
    type: Boolean,
    default: true,
  },
  treeCheckStrictly: {
    type: Boolean,
    default: false,
  },
  treeDefaultExpandAll: {
    type: Boolean,
    default: false,
  },
  treeDefaultExpandedKeys: {
    type: Array as PropType<TreeNodeKey[]>,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String as PropType<TreeSelectSize>,
    default: 'default',
  },
  status: {
    type: String as PropType<TreeSelectStatus>,
    default: '',
  },
  placement: {
    type: String as PropType<TreeSelectPlacement>,
    default: 'bottomLeft',
  },
  popupClassName: {
    type: String,
    default: '',
  },
  popupAppendToBody: {
    type: Boolean,
    default: false,
  },
  getPopupContainer: {
    type: Function as PropType<GetPopupContainer>,
    default: undefined,
  },
  autoFocus: {
    type: Boolean,
    default: false,
  },
  inputReadOnly: {
    type: Boolean,
    default: true,
  },
  transitionName: {
    type: String,
    default: 'ccui-tree-select-fade',
  },
  // 多选模式下输入框最多展示几个 tag，溢出折叠为 "+N"
  maxTagCount: {
    type: Number,
    default: 3,
  },
  notFoundContent: {
    type: String,
    // 默认从 ConfigProvider.locale.TreeSelect.notFoundContent 取值；显式 prop 仍优先。
    default: '',
  },
  // popup 最大高度
  popupMaxHeight: {
    type: Number,
    default: 280,
  },
  /**
   * Ant Design v5.13+ 录入组件统一 variant 形态。
   * `'outlined' | 'filled' | 'borderless' | 'underlined'`，默认 `'outlined'`。
   */
  variant: {
    type: String as PropType<TreeSelectVariant>,
    default: 'outlined',
  },
} as const

export type TreeSelectProps = ExtractPropTypes<typeof treeSelectProps>

/**
 * Ant Design v5.13+ 录入组件统一 variant 形态。
 */
export type TreeSelectVariant = 'outlined' | 'filled' | 'borderless' | 'underlined'
