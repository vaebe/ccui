import type { ExtractPropTypes, PropType } from 'vue'

export const affixProps = {
  offsetTop: {
    type: Number,
    default: undefined,
  },
  offsetBottom: {
    type: Number,
    default: undefined,
  },
  target: {
    type: [String, Object, Function] as PropType<string | HTMLElement | (() => HTMLElement | Window | null)>,
    default: undefined,
  },
  zIndex: {
    type: Number,
    default: 10,
  },
} as const

export type AffixProps = ExtractPropTypes<typeof affixProps>
