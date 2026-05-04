import type { ExtractPropTypes, PropType } from 'vue'

export type SwitchSize = 'default' | 'small'
export type SwitchValue = boolean | string | number

export const switchProps = {
  modelValue: {
    type: [Boolean, String, Number] as PropType<SwitchValue>,
    default: false,
  },
  checkedValue: {
    type: [Boolean, String, Number] as PropType<SwitchValue>,
    default: true,
  },
  uncheckedValue: {
    type: [Boolean, String, Number] as PropType<SwitchValue>,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<SwitchSize>,
    default: 'default',
  },
  checkedChildren: {
    type: String,
    default: '',
  },
  uncheckedChildren: {
    type: String,
    default: '',
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
} as const

export type SwitchProps = ExtractPropTypes<typeof switchProps>
