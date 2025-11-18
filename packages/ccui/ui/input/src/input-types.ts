import type { ExtractPropTypes, PropType } from 'vue'

export type InputType = 'text' | 'password'
export type InputSize = 'large' | 'default' | 'small'

export const inputProps = {
  type: {
    type: String as PropType<InputType>,
    default: 'text',
  },
  size: {
    type: String as PropType<InputSize>,
    default: 'default',
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  showPassword: {
    type: Boolean,
    default: false,
  },
  prepend: {
    type: String,
    default: '',
  },
  append: {
    type: String,
    default: '',
  },
  value: {
    type: String,
    default: '',
  },
} as const

export type InputProps = ExtractPropTypes<typeof inputProps>
