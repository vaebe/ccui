import type { ExtractPropTypes, PropType } from 'vue'

export type TooltipPlacement
  = | 'top' | 'top-start' | 'top-end'
    | 'bottom' | 'bottom-start' | 'bottom-end'
    | 'left' | 'left-start' | 'left-end'
    | 'right' | 'right-start' | 'right-end'

export type TooltipEffect = 'dark' | 'light'

export type TooltipTrigger = 'hover' | 'click' | 'focus' | 'manual'

export const tooltipProps = {
  // 基础属性
  content: {
    type: String,
    default: '',
  },
  placement: {
    type: String as PropType<TooltipPlacement>,
    default: 'bottom' as TooltipPlacement,
  },
  effect: {
    type: String as PropType<TooltipEffect>,
    default: 'dark' as TooltipEffect,
  },

  // 显示控制
  visible: {
    type: Boolean,
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showArrow: {
    type: Boolean,
    default: true,
  },

  // 交互控制
  trigger: {
    type: String as PropType<TooltipTrigger>,
    default: 'hover' as TooltipTrigger,
  },
  showAfter: {
    type: Number,
    default: 0,
  },
  hideAfter: {
    type: Number,
    default: 200,
  },

  // 样式定制
  popperClass: {
    type: String,
    default: '',
  },
  offset: {
    type: Number,
    default: 8,
  },

  // 高级功能
  rawContent: {
    type: Boolean,
    default: false,
  },
  enterable: {
    type: Boolean,
    default: true,
  },

  // 可访问性
  ariaLabel: {
    type: String,
    default: '',
  },
} as const

export type TooltipProps = ExtractPropTypes<typeof tooltipProps>

export interface TooltipEmits {
  'before-show': () => void
  'show': () => void
  'before-hide': () => void
  'hide': () => void
  'update:visible': (visible: boolean) => void
}
