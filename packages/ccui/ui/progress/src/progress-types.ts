import type { ExtractPropTypes, PropType } from 'vue'

export type ProgressType = 'line' | 'circle' | 'dashboard'
export type ProgressStatus = 'success' | 'exception' | 'normal' | 'active'
export type ProgressSize = 'default' | 'small'

export const progressProps = {
  percent: {
    type: Number,
    default: 0,
  },
  type: {
    type: String as PropType<ProgressType>,
    default: 'line',
  },
  status: {
    type: String as PropType<ProgressStatus>,
    default: 'normal',
  },
  showInfo: {
    type: Boolean,
    default: true,
  },
  strokeColor: {
    type: String,
    default: '',
  },
  trailColor: {
    type: String,
    default: '',
  },
  strokeWidth: {
    type: Number,
    default: undefined,
  },
  width: {
    type: Number,
    default: 120,
  },
  size: {
    type: String as PropType<ProgressSize>,
    default: 'default',
  },
  format: {
    type: Function as PropType<(percent: number) => string>,
    default: undefined,
  },
} as const

export type ProgressProps = ExtractPropTypes<typeof progressProps>

export function clampPercent(p: number): number {
  if (Number.isNaN(p)) {
    return 0
  }
  return Math.min(100, Math.max(0, p))
}
