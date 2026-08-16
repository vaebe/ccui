import type { ExtractPropTypes, PropType } from 'vue'

export type ProgressType = 'line' | 'circle' | 'dashboard'
export type ProgressStatus = 'success' | 'exception' | 'normal' | 'active'
/** Line progress preset, thickness, or `[width, thickness]` in pixels. */
export type ProgressSize = 'default' | 'small' | number | [number, number]

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
    type: [String, Number, Array] as PropType<ProgressSize>,
    default: 'default',
  },
  format: {
    type: Function as PropType<(percent: number) => string>,
    default: undefined,
  },
} as const

export type ProgressProps = ExtractPropTypes<typeof progressProps>

export function clampPercent(p: number): number {
  // Progress is a finite percentage; reject infinities as well as NaN so CSS never receives invalid widths.
  if (!Number.isFinite(p)) {
    return 0
  }
  return Math.min(100, Math.max(0, p))
}
