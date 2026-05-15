import type { ExtractPropTypes, PropType } from 'vue'

export type SplitterLayout = 'horizontal' | 'vertical'

export const splitterProps = {
  /**
   * 布局方向。**L-2.23 起：默认值改为 undefined**（之前是 'horizontal'），让 `orientation` 别名得以生效。
   * 实际方向 = `layout` 显式 ?? `orientation` 别名 ?? `'horizontal'`。
   */
  layout: {
    type: String as PropType<SplitterLayout>,
    default: undefined,
  },
  /**
   * L-2.23：`layout` 的别名（对标 ant `Splitter`，无歧义可读性更好）。
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
   * L-2.23：是否在 resizer 上渲染折叠 / 展开图标。
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
  // L-2.23：折叠 / 展开。
  isCollapsed: (id: number) => boolean
  toggleCollapse: (id: number) => void
}
