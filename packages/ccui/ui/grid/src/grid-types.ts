import type { ExtractPropTypes, PropType } from 'vue'

export type Justify = 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'
export type Align = 'top' | 'middle' | 'bottom' | 'stretch'

export type Gutter = number | [number, number] | Partial<Record<Breakpoint, number | [number, number]>>
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export interface ColSize {
  span?: number
  order?: number
  offset?: number
  push?: number
  pull?: number
  flex?: string | number
}

export type ColSizeProp = number | string | ColSize

export const rowProps = {
  justify: {
    type: String as PropType<Justify>,
    default: 'start',
  },
  align: {
    type: String as PropType<Align>,
    default: 'top',
  },
  gutter: {
    type: [Number, Array, Object] as PropType<Gutter>,
    default: 0,
  },
  wrap: {
    type: Boolean,
    default: true,
  },
} as const

export const colProps = {
  span: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },
  order: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },
  offset: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },
  push: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },
  pull: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },
  flex: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },
  xs: { type: [Number, Object] as PropType<ColSizeProp>, default: undefined },
  sm: { type: [Number, Object] as PropType<ColSizeProp>, default: undefined },
  md: { type: [Number, Object] as PropType<ColSizeProp>, default: undefined },
  lg: { type: [Number, Object] as PropType<ColSizeProp>, default: undefined },
  xl: { type: [Number, Object] as PropType<ColSizeProp>, default: undefined },
  xxl: { type: [Number, Object] as PropType<ColSizeProp>, default: undefined },
} as const

export type RowProps = ExtractPropTypes<typeof rowProps>
export type ColProps = ExtractPropTypes<typeof colProps>

export const BREAKPOINT_PX: Record<Breakpoint, number> = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
}

export const BREAKPOINTS: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']

export const ROW_INJECT_KEY = Symbol('ccui-row')

export interface RowContext {
  gutter: [number, number]
}
