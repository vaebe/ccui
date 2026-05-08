import type { ExtractPropTypes, PropType } from 'vue'

export type SelectRawValue = string | number
export type SelectModelValue = SelectRawValue | SelectRawValue[] | null | undefined
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
  options: SelectOption[]
  [key: string]: unknown
}

export type SelectRawOption = SelectOption | SelectGroupOption

export type SelectFilterOption = boolean | ((input: string, option: SelectOption) => boolean)

export interface ResolvedSelectOption {
  raw: SelectOption
  label: unknown
  value: SelectRawValue
  disabled: boolean
  groupLabel?: unknown
}

export const selectProps = {
  modelValue: {
    type: [String, Number, Array] as PropType<SelectModelValue>,
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
  status: {
    type: String as PropType<'' | 'error' | 'warning' | 'success' | 'validating'>,
    default: '',
  },
} as const

export type SelectProps = ExtractPropTypes<typeof selectProps>
