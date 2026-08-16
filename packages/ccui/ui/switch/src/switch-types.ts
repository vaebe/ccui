import type { ExtractPropTypes, PropType } from 'vue'

/**
 * Switch 尺寸。`'default'` 与 `'medium'` 等价。
 */
export type SwitchSize = 'default' | 'medium' | 'small'
/** Switch 选中和未选中状态允许绑定的值类型。 */
export type SwitchValue = boolean | string | number
/** 切换前守卫；返回或解析为 `true` 时才提交新值。 */
export type SwitchBeforeChange = (value: SwitchValue) => boolean | Promise<boolean>

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
  beforeChange: {
    type: Function as PropType<SwitchBeforeChange>,
    default: null,
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
