import type { ExtractPropTypes, PropType } from 'vue'

export type SplitterLayout = 'horizontal' | 'vertical'

export const splitterProps = {
  layout: {
    type: String as PropType<SplitterLayout>,
    default: 'horizontal',
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
}
