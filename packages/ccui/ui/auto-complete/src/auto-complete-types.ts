import type { ExtractPropTypes, PropType } from 'vue'

export type AutoCompleteSize = 'large' | 'default' | 'small'
export type AutoCompleteStatus = '' | 'error' | 'warning' | 'success' | 'validating'
export type AutoCompletePlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
export type GetPopupContainer = (triggerNode: HTMLElement | null) => HTMLElement | null

export interface AutoCompleteOption {
  value: string | number
  label?: string
  disabled?: boolean
  // 业务自定义字段（透传，不参与匹配 / 显示）
  [key: string]: unknown
}

// options 既支持 string[]（label === value）也支持 {value,label}[]
export type AutoCompleteSourceItem = string | number | AutoCompleteOption

export type FilterOption = boolean | ((inputValue: string, option: AutoCompleteOption) => boolean)

export const autoCompleteProps = {
  modelValue: {
    type: [String, Number] as PropType<string | number | null>,
    default: undefined,
  },
  defaultValue: {
    type: [String, Number] as PropType<string | number>,
    default: '',
  },
  options: {
    type: Array as PropType<AutoCompleteSourceItem[]>,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  allowClear: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<AutoCompleteSize>,
    default: 'default',
  },
  status: {
    type: String as PropType<AutoCompleteStatus>,
    default: '',
  },
  // 过滤逻辑：true=默认包含匹配；false=不过滤（全部展示）；function=自定义
  filterOption: {
    type: [Boolean, Function] as PropType<FilterOption>,
    default: true,
  },
  // 是否大小写敏感（默认 false）
  caseSensitive: {
    type: Boolean,
    default: false,
  },
  notFoundContent: {
    type: String,
    default: '暂无数据',
  },
  placement: {
    type: String as PropType<AutoCompletePlacement>,
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
  transitionName: {
    type: String,
    default: 'ccui-auto-complete-fade',
  },
  // 浮层最大高度
  popupMaxHeight: {
    type: Number,
    default: 256,
  },
  // 打开浮层时是否默认高亮第一项
  defaultActiveFirstOption: {
    type: Boolean,
    default: false,
  },
  // 键盘高亮时是否把 active 项写回 input
  backfill: {
    type: Boolean,
    default: false,
  },
  // 搜索防抖延迟（毫秒），0 = 不防抖
  searchDebounce: {
    type: Number,
    default: 0,
  },
} as const

export type AutoCompleteProps = ExtractPropTypes<typeof autoCompleteProps>

// 内部规范化的 option 形态
export interface NormalizedOption {
  value: string | number
  label: string
  disabled: boolean
  raw: AutoCompleteOption
}

export function normalizeOption(item: AutoCompleteSourceItem): NormalizedOption {
  if (typeof item === 'string' || typeof item === 'number') {
    return {
      value: item,
      label: String(item),
      disabled: false,
      raw: { value: item, label: String(item) },
    }
  }
  return {
    value: item.value,
    label: item.label !== undefined ? String(item.label) : String(item.value),
    disabled: !!item.disabled,
    raw: item,
  }
}
