import type { ExtractPropTypes, PropType, VNode } from 'vue'

export type TourPlacement =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'
  | 'left'
  | 'leftTop'
  | 'leftBottom'
  | 'right'
  | 'rightTop'
  | 'rightBottom'

export type TourTarget = HTMLElement | (() => HTMLElement | null) | null | undefined

export interface TourStep {
  target?: TourTarget
  title: string | VNode
  description?: string | VNode
  placement?: TourPlacement
  mask?: boolean
}

export const tourProps = {
  // 是否打开 Tour，支持 v-model:open
  open: {
    type: Boolean,
    default: false,
  },
  // 当前步骤索引，支持 v-model:current
  current: {
    type: Number,
    default: 0,
  },
  steps: {
    type: Array as PropType<TourStep[]>,
    default: () => [],
  },
  // 全局蒙层开关（每步可单独覆盖）
  mask: {
    type: Boolean,
    default: true,
  },
  // 默认浮层方位
  placement: {
    type: String as PropType<TourPlacement>,
    default: 'bottom',
  },
  prevText: {
    type: String,
    default: '上一步',
  },
  nextText: {
    type: String,
    default: '下一步',
  },
  finishText: {
    type: String,
    default: '完成',
  },
  // 浮层最大宽度
  panelWidth: {
    type: Number,
    default: 320,
  },
  // 是否在 Esc 键按下时关闭
  closeOnEsc: {
    type: Boolean,
    default: true,
  },
} as const

export type TourProps = ExtractPropTypes<typeof tourProps>

export function resolveTarget(target: TourTarget): HTMLElement | null {
  if (!target) return null
  if (typeof target === 'function') return target() ?? null
  return target
}
