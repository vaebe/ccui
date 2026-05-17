import type { ExtractPropTypes, PropType } from 'vue'

export type TooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

export type TooltipEffect = 'dark' | 'light'

export type TooltipTrigger = 'hover' | 'click' | 'focus' | 'manual'

/**
 * `arrow` 复合配置：
 *
 * - `boolean`：是否显示箭头
 * - `{ pointAtCenter }`：是否对齐触发节点中心（默认 false 时贴 edge）
 */
export interface TooltipArrowObject {
  pointAtCenter?: boolean
}
export type TooltipArrow = boolean | TooltipArrowObject

/**
 * `align` 偏移配置（浮层细调）。当前 prop 已接收，`targetOffset` 等暂未接入 floating-ui middleware。
 */
export interface TooltipAlign {
  offset?: [number, number]
  targetOffset?: [number, number]
  overflow?: { adjustX?: boolean; adjustY?: boolean }
}

/**
 * `getPopupContainer` 函数。返回 null 时不 Teleport。
 */
export type TooltipGetPopupContainer = (trigger: HTMLElement | null) => HTMLElement | null

export const tooltipProps = {
  // ── 内容 ───────────────────────────────────────────────
  /**
   * @deprecated 请改用 `title`；同名 `title` slot 也优先。
   */
  content: {
    type: String,
    default: '',
  },
  /**
   * tooltip 内容。显式 `title` 优先于 `content`。
   * 同名 slot 优先级最高。
   */
  title: {
    type: String,
    default: '',
  },

  placement: {
    type: String as PropType<TooltipPlacement>,
    default: 'bottom' as TooltipPlacement,
  },
  /**
   * 主题：dark / light。色值由 `color` 表达时优先级更高。
   */
  effect: {
    type: String as PropType<TooltipEffect>,
    default: 'dark' as TooltipEffect,
  },
  /**
   * 浮层背景色（任意 CSS color 字符串）。显式 color 会覆盖 effect 的内置背景。
   */
  color: {
    type: String,
    default: '',
  },

  // ── 显示控制 ─────────────────────────────────────────
  /**
   * 受控显示。支持 `v-model:visible`。
   */
  visible: {
    type: Boolean,
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },

  // ── 箭头 ─────────────────────────────────────────────
  /**
   * @deprecated 请改用 `arrow`（支持复合对象）。
   */
  showArrow: {
    type: Boolean,
    default: true,
  },
  /**
   * `bool | { pointAtCenter }` 复合。显式 `arrow` 优先于 `showArrow`。
   */
  arrow: {
    type: [Boolean, Object] as PropType<TooltipArrow>,
    default: undefined,
  },

  // ── 交互 ─────────────────────────────────────────────
  trigger: {
    type: String as PropType<TooltipTrigger>,
    default: 'hover' as TooltipTrigger,
  },
  /**
   * @deprecated 请改用 `mouseEnterDelay`。单位仍为 ms（ccui 全局约定）。
   */
  showAfter: {
    type: Number,
    default: 0,
  },
  /**
   * @deprecated 请改用 `mouseLeaveDelay`。单位 ms。
   */
  hideAfter: {
    type: Number,
    default: 200,
  },
  /**
   * mouseenter 后多少 **毫秒**显示。
   * 显式 `mouseEnterDelay` 优先于 `showAfter`。
   */
  mouseEnterDelay: {
    type: Number,
    default: undefined,
  },
  /**
   * mouseleave 后多少 ms 隐藏。
   */
  mouseLeaveDelay: {
    type: Number,
    default: undefined,
  },

  // ── 样式定制 ─────────────────────────────────────────
  /**
   * @deprecated 请改用 `overlayClassName`。
   */
  popperClass: {
    type: String,
    default: '',
  },
  /**
   * 浮层根节点 class。显式 `overlayClassName` 优先于 `popperClass`。
   */
  overlayClassName: {
    type: String,
    default: '',
  },
  offset: {
    type: Number,
    default: 8,
  },

  // ── 高级行为 ─────────────────────────────────────────
  rawContent: {
    type: Boolean,
    default: false,
  },
  enterable: {
    type: Boolean,
    default: true,
  },
  /**
   * 每次关闭时强制重置内容（不缓存上次渲染）。
   */
  fresh: {
    type: Boolean,
    default: false,
  },
  /**
   * 每次隐藏后销毁浮层 DOM。默认 false 时浮层 DOM 保留以备复用。
   */
  destroyTooltipOnHide: {
    type: Boolean,
    default: false,
  },
  /**
   * 浮层是否随触发节点自动调整方向以避免溢出（默认开启）。
   * 当前接受 prop，floating-ui 的 flip middleware 已实现该行为。
   */
  autoAdjustOverflow: {
    type: Boolean,
    default: true,
  },
  /**
   * 浮层细调配置：offset / targetOffset / overflow。
   */
  align: {
    type: Object as PropType<TooltipAlign>,
    default: undefined,
  },
  /**
   * 浮层容器函数。返回 null 时不 Teleport（即贴近触发节点同 DOM 流）。
   */
  getPopupContainer: {
    type: Function as PropType<TooltipGetPopupContainer>,
    default: undefined,
  },

  // ── 可访问性 ─────────────────────────────────────────
  ariaLabel: {
    type: String,
    default: '',
  },
} as const

export type TooltipProps = ExtractPropTypes<typeof tooltipProps>

export interface TooltipEmits {
  /** 显示前触发 */
  'before-show': () => void
  /** 显示时触发 */
  show: () => void
  /** 隐藏前触发 */
  'before-hide': () => void
  /** 隐藏时触发 */
  hide: () => void
  /** 当 visible 状态改变时触发 */
  'update:visible': (visible: boolean) => void
}
