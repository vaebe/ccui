import type { ExtractPropTypes, PropType } from 'vue'

export type BadgeStatus = 'success' | 'processing' | 'default' | 'error' | 'warning'

export const badgeProps = {
  count: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },
  showZero: {
    type: Boolean,
    default: false,
  },
  overflowCount: {
    type: Number,
    default: 99,
  },
  dot: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String as PropType<BadgeStatus>,
    default: undefined,
  },
  text: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
  offset: {
    type: Array as PropType<[number, number]>,
    default: undefined,
  },
} as const

export type BadgeProps = ExtractPropTypes<typeof badgeProps>
