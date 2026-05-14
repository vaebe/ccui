import type { ExtractPropTypes, PropType } from 'vue'

/**
 * Switch 尺寸。`'medium'` 是 Ant Design 的命名，`'default'` 是 ccui 旧名，两者等价。
 */
export type SwitchSize = 'default' | 'medium' | 'small'
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
