import type { ExtractPropTypes, PropType } from 'vue'

export type StepStatus = 'wait' | 'process' | 'finish' | 'error'
export type StepsDirection = 'horizontal' | 'vertical'
export type StepsSize = 'default' | 'small'
export type StepsType = 'default' | 'navigation'

export interface StepItem {
  title?: string
  description?: string
  icon?: string
  status?: StepStatus
  disabled?: boolean
  subTitle?: string
}

export const stepsProps = {
  current: {
    type: Number,
    default: 0,
  },
  items: {
    type: Array as PropType<StepItem[]>,
    default: () => [],
  },
  direction: {
    type: String as PropType<StepsDirection>,
    default: 'horizontal',
  },
  size: {
    type: String as PropType<StepsSize>,
    default: 'default',
  },
  type: {
    type: String as PropType<StepsType>,
    default: 'default',
  },
  status: {
    type: String as PropType<StepStatus>,
    default: 'process',
  },
  labelPlacement: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: 'horizontal',
  },
  progressDot: {
    type: Boolean,
    default: false,
  },
} as const

export type StepsProps = ExtractPropTypes<typeof stepsProps>
