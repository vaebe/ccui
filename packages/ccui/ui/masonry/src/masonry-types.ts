import type { ExtractPropTypes, PropType } from 'vue'

export type MasonryColumns = number | Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', number>>

export const masonryProps = {
  columns: {
    type: [Number, Object] as PropType<MasonryColumns>,
    default: 3,
  },
  gutter: {
    type: [Number, Array] as PropType<number | [number, number]>,
    default: 16,
  },
  sequential: {
    type: Boolean,
    default: false,
  },
} as const

export type MasonryProps = ExtractPropTypes<typeof masonryProps>

export const BREAKPOINT_PX: Record<string, number> = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
}

export const BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const
