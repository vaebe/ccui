import type { ExtractPropTypes, PropType } from 'vue'

export type SplitterLayout = 'horizontal' | 'vertical'

export const splitterProps = {
  /**
   * 布局方向。默认值为 `undefined`，让 `orientation` 别名得以生效。
   * 实际方向 = `layout` 显式 ?? `orientation` 别名 ?? `'horizontal'`。
   */
  layout: {
    type: String as PropType<SplitterLayout>,
    default: undefined,
  },
  /**
   * `layout` 的别名。
   * 显式传 `layout` 时优先；同时传时 `layout` 胜出。
   */
  orientation: {
    type: String as PropType<SplitterLayout>,
    default: undefined,
  },
} as const

export const panelProps = {
  size: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },
  defaultSize: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },
  min: {
    type: [Number, String] as PropType<number | string>,
    default: 0,
  },
  max: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },
  collapsible: {
    type: [Boolean, Object] as PropType<boolean | { start?: boolean; end?: boolean }>,
    default: false,
  },
  resizable: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否在 resizer 上渲染折叠 / 展开图标。
   * 需配合 `collapsible` 一起使用（不设 collapsible 时该图标无意义，不渲染）。
   * `true` 时基于 `collapsible` 的方向（`start` / `end`）渲染对应箭头按钮。
   */
  showCollapsibleIcon: {
    type: Boolean,
    default: false,
  },
} as const

export type SplitterProps = ExtractPropTypes<typeof splitterProps>
export type PanelProps = ExtractPropTypes<typeof panelProps>

export const SPLITTER_INJECT_KEY = Symbol('ccui-splitter')

export interface SplitterContext {
  layout: SplitterLayout
  registerPanel: (id: number, props: PanelProps) => void
  unregisterPanel: (id: number) => void
  getSize: (id: number) => number | undefined
  startResize: (id: number, e: PointerEvent) => void
  // 折叠 / 展开。
  isCollapsed: (id: number) => boolean
  toggleCollapse: (id: number) => void
}
