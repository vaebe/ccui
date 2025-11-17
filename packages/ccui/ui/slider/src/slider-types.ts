import type { ExtractPropTypes, PropType } from 'vue'

export type SliderSize = 'large' | 'default' | 'small'
export type SliderPlacement = 'top' | 'right' | 'bottom' | 'left'
export type SliderMarks = Record<number, string | { style?: Record<string, any>, label?: any }>

export interface SliderMark {
  style?: Record<string, any>
  label?: any
}

export const sliderProps = {
  modelValue: {
    type: [Number, Array] as PropType<number | number[]>,
    default: 0,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  step: {
    type: Number,
    default: 1,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showInput: {
    type: Boolean,
    default: false,
  },
  showInputControls: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String as PropType<SliderSize>,
    default: 'default',
  },
  inputSize: {
    type: String as PropType<SliderSize>,
    default: 'default',
  },
  label: {
    type: String,
  },
  precision: {
    type: Number,
  },
  showStops: {
    type: Boolean,
    default: false,
  },
  showTooltip: {
    type: Boolean,
    default: true,
  },
  formatTooltip: {
    type: Function as PropType<(value: number) => string>,
  },
  range: {
    type: Boolean,
    default: false,
  },
  vertical: {
    type: Boolean,
    default: false,
  },
  height: {
    type: String,
    default: '200px',
  },
  ariaLabel: {
    type: String,
  },
  rangeStartLabel: {
    type: String,
  },
  rangeEndLabel: {
    type: String,
  },
  formatValueText: {
    type: Function as PropType<(value: number) => string>,
  },
  tooltipClass: {
    type: String,
  },
  placement: {
    type: String as PropType<SliderPlacement>,
    default: 'top',
  },
  marks: {
    type: Object as PropType<SliderMarks>,
  },
  validateEvent: {
    type: Boolean,
    default: true,
  },
  persistent: {
    type: Boolean,
    default: true,
  },
  tipsRenderer: {
    type: [Function, null] as PropType<((value: number) => string) | null>,
  },
  showDefaultTooltip: {
    type: Boolean,
    default: false,
  },
} as const

export type SliderProps = ExtractPropTypes<typeof sliderProps>
