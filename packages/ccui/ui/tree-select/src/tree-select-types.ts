import type { ExtractPropTypes, PropType } from 'vue'
import type { TreeNodeData, TreeNodeKey } from '../../tree/src/tree-types'

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
    default: '暂无数据',
  },
  // popup 最大高度
  popupMaxHeight: {
    type: Number,
    default: 280,
  },
} as const

export type TreeSelectProps = ExtractPropTypes<typeof treeSelectProps>
