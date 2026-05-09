import type { ExtractPropTypes, PropType } from 'vue'

export type CascaderRawValue = string | number
export type CascaderValuePath = CascaderRawValue[]
export type CascaderModelValue = CascaderValuePath | null
export type CascaderSize = 'large' | 'default' | 'small'
export type CascaderStatus = '' | 'error' | 'warning' | 'success' | 'validating'
export type CascaderPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
export type GetPopupContainer = (triggerNode: HTMLElement | null) => HTMLElement | null

export interface CascaderOption {
  label?: unknown
  value?: CascaderRawValue
  disabled?: boolean
  children?: CascaderOption[]
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
    default: '暂无数据',
  },
} as const

export type CascaderProps = ExtractPropTypes<typeof cascaderProps>
