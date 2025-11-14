import type { ExtractPropTypes, PropType } from 'vue'

export type ISize = 'lg' | 'md' | 'sm'

export const inputNumberProps = {
  modelValue: {
    type: Number as PropType<number | undefined>,
    default: undefined,
  },
  step: {
    type: Number,
    default: 1,
  },
  placeholder: {
    type: String,
    default: '',
  },
  max: {
    type: Number,
    default: Infinity,
  },
  min: {
    type: Number,
    default: -Infinity,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  precision: {
    type: Number as PropType<number | undefined>,
    default: undefined,
  },
  size: {
    type: String as PropType<ISize>,
    default: 'md',
  },
  reg: {
    type: [RegExp, String] as PropType<RegExp | string | undefined>,
    default: undefined,
  },
  allowEmpty: {
    type: Boolean,
    default: false,
  },
  showGlowStyle: {
    type: Boolean,
    default: true,
  },
  controls: {
    type: Boolean,
    default: true,
  },
  controlsPosition: {
    type: String as PropType<'right' | 'both'>,
    default: 'both',
  },
} as const

export type InputNumberProps = ExtractPropTypes<typeof inputNumberProps>

export interface InputNumberEmits {
  'update:modelValue': [value: number | undefined]
  'change': [currentVal: number | undefined, oldVal: number | undefined]
  'blur': [event: Event]
  'focus': [event: Event]
  'input': [currentValue: number | undefined]
}
