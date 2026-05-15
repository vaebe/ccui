import type { CSSProperties, ExtractPropTypes, PropType } from 'vue'

export type SiderTheme = 'light' | 'dark'

export type SiderBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

/**
 * L-2.21：ant breakpoint 取值对应的最大宽度（px）。
 * `(max-width: {N}px)` 命中时认为「破点」，Sider 自动 collapse。
 */
export const SIDER_BREAKPOINT_PX: Record<SiderBreakpoint, number> = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
}

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
    type: String as PropType<SiderBreakpoint>,
    default: undefined,
  },
  /**
   * L-2.21：collapsedWidth=0 时（Sider 完全隐藏）触发器的 inline style。
   * 用于把折叠按钮定位为浮动按钮（如 `{ position: 'fixed', top: 16, left: 0 }`）。
   */
  zeroWidthTriggerStyle: {
    type: Object as PropType<CSSProperties>,
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
