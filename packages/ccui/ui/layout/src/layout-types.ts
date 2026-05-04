import type { ExtractPropTypes, PropType } from 'vue'

export type SiderTheme = 'light' | 'dark'

export const layoutProps = {
  hasSider: {
    type: Boolean,
    default: undefined,
  },
} as const

export const headerProps = {} as const
export const footerProps = {} as const
export const contentProps = {} as const

export const siderProps = {
  width: {
    type: [Number, String] as PropType<number | string>,
    default: 200,
  },
  collapsedWidth: {
    type: [Number, String] as PropType<number | string>,
    default: 80,
  },
  collapsed: {
    type: Boolean,
    default: undefined,
  },
  defaultCollapsed: {
    type: Boolean,
    default: false,
  },
  collapsible: {
    type: Boolean,
    default: false,
  },
  reverseArrow: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String as PropType<SiderTheme>,
    default: 'dark',
  },
  trigger: {
    type: [String, Object] as PropType<string | object>,
    default: undefined,
  },
  breakpoint: {
    type: String as PropType<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'>,
    default: undefined,
  },
} as const

export type LayoutProps = ExtractPropTypes<typeof layoutProps>
export type SiderProps = ExtractPropTypes<typeof siderProps>

export const LAYOUT_INJECT_KEY = Symbol('ccui-layout')

export interface LayoutContext {
  addSider: (id: number) => void
  removeSider: (id: number) => void
}
