import type { ExtractPropTypes, PropType } from 'vue'

export type SelectRawValue = string | number
export type SelectModelValue =
  | SelectRawValue
  | SelectRawValue[]
  | LabelInValuePayload
  | LabelInValuePayload[]
  | null
  | undefined
export type SelectSize = 'large' | 'default' | 'small'
export type SelectMode = 'default' | 'multiple' | 'tags'
export type SelectPlacement = 'bottom' | 'top' | 'auto'

export interface SelectFieldNames {
  label?: string
  value?: string
  disabled?: string
  options?: string
}

export interface SelectOption {
  label?: unknown
  value?: SelectRawValue
  disabled?: boolean
  [key: string]: unknown
}

export interface SelectGroupOption {
  label?: unknown
  options: SelectRawOption[]
  [key: string]: unknown
}

export type SelectRawOption = SelectOption | SelectGroupOption

export type SelectFilterOption = boolean | ((input: string, option: SelectOption) => boolean)

export interface ResolvedSelectOption {
  raw: SelectOption
  label: unknown
  value: SelectRawValue
  disabled: boolean
  groupPath: unknown[]
}

export interface LabelInValuePayload {
  value: SelectRawValue
  label: unknown
}

export type GetPopupContainer = (triggerNode: HTMLElement | null) => HTMLElement | null

export const selectProps = {
  modelValue: {
    type: [String, Number, Array, Object] as PropType<SelectModelValue>,
    default: undefined,
  },
  options: {
    type: Array as PropType<SelectRawOption[]>,
    default: () => [],
  },
  fieldNames: {
    type: Object as PropType<SelectFieldNames>,
    default: () => ({}),
  },
  mode: {
    type: String as PropType<SelectMode>,
    default: undefined,
  },
  placement: {
    type: String as PropType<SelectPlacement>,
    default: 'bottom',
  },
  filterOption: {
    type: [Boolean, Function] as PropType<SelectFilterOption>,
    default: true,
  },
  popupClassName: {
    type: String,
    default: '',
  },
  getPopupContainer: {
    type: Function as PropType<GetPopupContainer>,
    default: undefined,
  },
  popupAppendToBody: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: 'Please select',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  filterable: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<SelectSize>,
    default: 'default',
  },
  noDataText: {
    type: String,
    default: 'No data',
  },
  loadingText: {
    type: String,
    default: 'Loading...',
  },
  maxTagCount: {
    type: Number,
    default: 3,
  },
  maxCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String as PropType<'' | 'error' | 'warning' | 'success' | 'validating'>,
    default: '',
  },
  labelInValue: {
    type: Boolean,
    default: false,
  },
  autoFocus: {
    type: Boolean,
    default: false,
  },
  defaultActiveFirstOption: {
    type: Boolean,
    default: true,
  },
  highlightMatch: {
    type: Boolean,
    default: false,
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
    default: 240,
  },
  optionLabelProp: {
    type: String,
    default: '',
  },
  showSearch: {
    type: Boolean,
    default: false,
  },
  transitionName: {
    type: String,
    default: 'ccui-select-fade',
  },
  tagsDraggable: {
    type: Boolean,
    default: false,
  },
  /**
   * Ant Design v5.13+ 录入组件统一 variant 形态。
   * `'outlined' | 'filled' | 'borderless' | 'underlined'`，默认 `'outlined'`。
   */
  variant: {
    type: String as PropType<SelectVariant>,
    default: 'outlined',
  },
} as const

/**
 * Ant Design v5.13+ 录入组件统一 variant 形态。
 */
export type SelectVariant = 'outlined' | 'filled' | 'borderless' | 'underlined'

export type SelectProps = ExtractPropTypes<typeof selectProps>
