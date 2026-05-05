import type { ExtractPropTypes, PropType } from 'vue'

export type SelectRawValue = string | number
export type SelectModelValue = SelectRawValue | SelectRawValue[] | undefined
export type SelectSize = 'large' | 'default' | 'small'

export interface SelectOption {
  label: string
  value: SelectRawValue
  disabled?: boolean
}

export const selectProps = {
  modelValue: {
    type: [String, Number, Array] as PropType<SelectModelValue>,
    default: undefined,
  },
  options: {
    type: Array as PropType<SelectOption[]>,
    default: () => [],
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
} as const

export type SelectProps = ExtractPropTypes<typeof selectProps>
