import type { ExtractPropTypes, PropType } from 'vue'

export type SpinSize = 'small' | 'default' | 'large'

export const spinProps = {
  spinning: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String as PropType<SpinSize>,
    default: 'default',
  },
  tip: {
    type: String,
    default: '',
  },
  delay: {
    type: Number,
    default: 0,
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
} as const

export type SpinProps = ExtractPropTypes<typeof spinProps>
