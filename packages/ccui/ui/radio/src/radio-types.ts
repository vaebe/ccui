import type { ExtractPropTypes, InjectionKey, PropType, Ref } from 'vue'

export type RadioValue = string | number | boolean
export type BeforeChangeType = (value: RadioValue) => boolean | Promise<boolean>
export type DirectionType = 'row' | 'column'

export const radioProps = {
  modelValue: {
    type: [String, Number, Boolean] as PropType<RadioValue>,
    default: null,
  },
  label: {
    type: [String, Number, Boolean] as PropType<RadioValue>,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  beforeChange: {
    type: Function as PropType<BeforeChangeType>,
    default: null,
  },
} as const

export type RadioProps = ExtractPropTypes<typeof radioProps>

// 单选框组
export const radioGroupProps = {
  modelValue: {
    type: [String, Number, Boolean] as PropType<RadioValue>,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: '',
  },
  beforeChange: {
    type: Function as PropType<BeforeChangeType>,
    default: null,
  },
  direction: {
    type: String as PropType<DirectionType>,
    default: 'column',
  },
} as const

export type RadioGroupProps = ExtractPropTypes<typeof radioGroupProps>

/** radio-group 注入字段的接口 */
interface RadioGroupInjection {
  modelValue: Ref<RadioValue | null>
  disabled: Ref<boolean>
  name: Ref<string>
  requestVersion: Ref<number>
  registerRadio: (input: HTMLInputElement, isChecked: () => boolean) => () => void
  restoreCheckedState: () => void
  requestChange: (value: RadioValue, fallback?: BeforeChangeType | null) => Promise<boolean>
  emitChangeValue: (value: RadioValue) => void
}

/** radio-group 注入 radio 的 key 值 */
export const radioGroupInjectionKey: InjectionKey<RadioGroupInjection> = Symbol('CRadioGroup')
