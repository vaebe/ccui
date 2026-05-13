import type { ExtractPropTypes, PropType } from 'vue'

export type CascaderRawValue = string | number
export type CascaderValuePath = CascaderRawValue[]
export type CascaderModelValue = CascaderValuePath | CascaderValuePath[] | null
export type CascaderExpandTrigger = 'click' | 'hover'
export type CascaderSize = 'large' | 'default' | 'small'
export type CascaderStatus = '' | 'error' | 'warning' | 'success' | 'validating'
export type CascaderPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
export type GetPopupContainer = (triggerNode: HTMLElement | null) => HTMLElement | null

export interface CascaderOption {
  label?: unknown
  value?: CascaderRawValue
  disabled?: boolean
  children?: CascaderOption[]
  // 显式标记节点是否是叶子。配合 loadData：isLeaf=false 即使无 children 也按可加载处理。
  isLeaf?: boolean
  // 配合 multiple：true 表示该节点视为选中（受控）
  checked?: boolean
  [key: string]: unknown
}

export interface CascaderFieldNames {
  label?: string
  value?: string
  children?: string
  disabled?: string
}

export type CascaderDisplayRender = (labels: string[], selectedOptions: CascaderOption[]) => string

export interface CascaderColumnItem {
  raw: CascaderOption
  value: CascaderRawValue
  label: string
  disabled: boolean
  isLeaf: boolean
  children: CascaderOption[]
}

export const cascaderProps = {
  modelValue: {
    type: Array as unknown as PropType<CascaderModelValue>,
    default: undefined,
  },
  options: {
    type: Array as PropType<CascaderOption[]>,
    default: () => [],
  },
  fieldNames: {
    type: Object as PropType<CascaderFieldNames>,
    default: () => ({}),
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
  separator: {
    type: String,
    default: ' / ',
  },
  // 中间节点（非叶子）也可以选中并提交
  changeOnSelect: {
    type: Boolean,
    default: false,
  },
  // 列展开触发方式
  expandTrigger: {
    type: String as PropType<CascaderExpandTrigger>,
    default: 'click',
  },
  // 多选模式：modelValue 变 CascaderValuePath[]；勾选叶子节点聚合提交
  multiple: {
    type: Boolean,
    default: false,
  },
  // 搜索匹配。true → 默认 includes 匹配；函数 → 自定义 (input, path) => boolean
  showSearch: {
    type: [Boolean, Object] as PropType<boolean | { filter?: (input: string, path: CascaderOption[]) => boolean }>,
    default: false,
  },
  // 异步加载非叶子节点的 children。返回 Promise，组件按 path 调用并 swap loading 状态。
  loadData: {
    type: Function as PropType<(path: CascaderOption[]) => Promise<void> | void>,
    default: undefined,
  },
  // 自定义路径展示
  displayRender: {
    type: Function as PropType<CascaderDisplayRender>,
    default: undefined,
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
    type: String as PropType<CascaderSize>,
    default: 'default',
  },
  status: {
    type: String as PropType<CascaderStatus>,
    default: '',
  },
  placement: {
    type: String as PropType<CascaderPlacement>,
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
    default: 'ccui-cascader-fade',
  },
  expandIcon: {
    type: String,
    default: '›',
  },
  notFoundContent: {
    type: String,
    // 默认从 ConfigProvider.locale.Cascader.notFoundContent 取值；显式 prop 仍优先。
    default: '',
  },
} as const

export type CascaderProps = ExtractPropTypes<typeof cascaderProps>
