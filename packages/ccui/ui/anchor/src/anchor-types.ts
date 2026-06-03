import type { ExtractPropTypes, PropType } from 'vue'

export interface AnchorLink {
  href: string
  title?: string
  children?: AnchorLink[]
}

export const anchorProps = {
  items: {
    type: Array as PropType<AnchorLink[]>,
    default: () => [],
  },
  affix: {
    type: Boolean,
    default: true,
  },
  bounds: {
    type: Number,
    default: 5,
  },
  offsetTop: {
    type: Number,
    default: 0,
  },
  scrollContainer: {
    type: [String, Object] as PropType<string | HTMLElement>,
    default: undefined,
  },
  showInkInFixed: {
    type: Boolean,
    default: false,
  },
  targetOffset: {
    type: Number,
    default: undefined,
  },
} as const

export type AnchorProps = ExtractPropTypes<typeof anchorProps>
