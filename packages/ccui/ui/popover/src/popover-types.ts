import type { ExtractPropTypes, PropType } from 'vue'

/**
 * `arrow` 复合：`bool \| { pointAtCenter }`
 */
export interface PopoverArrowObject {
  pointAtCenter?: boolean
}
export type PopoverArrow = boolean | PopoverArrowObject

/**
 * `getPopupContainer` 函数。返回 null 时不 Teleport。
 */
export type PopoverGetPopupContainer = (trigger: HTMLElement | null) => HTMLElement | null

/**
 * `align` 浮层细调（offset / targetOffset / overflow）。
 */
export interface PopoverAlign {
  offset?: [number, number]
  targetOffset?: [number, number]
  overflow?: { adjustX?: boolean; adjustY?: boolean }
}

export type PopoverPlacement =
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

export type PopoverEffect = 'dark' | 'light'

export type PopoverTrigger = 'hover' | 'click' | 'focus' | 'manual' | 'contextmenu'

export const popoverProps = {
  title: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
  placement: {
    type: String as PropType<PopoverPlacement>,
    default: 'bottom' as PopoverPlacement,
  },
  effect: {
    type: String as PropType<PopoverEffect>,
    default: 'light' as PopoverEffect,
  },
  /**
   * @deprecated 请改用 `open`（支持 `v-model:open`）。
   */
  visible: {
    type: Boolean,
    default: undefined,
  },
  /**
   * 受控显示。显式 `open` 优先于 `visible`。
   */
  open: {
    type: Boolean,
    default: undefined,
  },
  /**
   * 浮层背景色（任意 CSS 字符串），覆盖 `effect` 的内置色。
   */
  color: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * @deprecated 请改用 `arrow`（支持复合对象）。
   */
  showArrow: {
    type: Boolean,
    default: true,
  },
  /**
   * `bool \| { pointAtCenter }`。显式 `arrow` 优先于 `showArrow`。
   */
  arrow: {
    type: [Boolean, Object] as PropType<PopoverArrow>,
    default: undefined,
  },
  trigger: {
    type: String as PropType<PopoverTrigger>,
    default: 'click' as PopoverTrigger,
  },
  /**
   * @deprecated 请改用 `mouseEnterDelay`。单位 ms。
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
   * mouseenter 后多少 ms 显示。显式 `mouseEnterDelay` 优先于 `showAfter`。
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
  /**
   * @deprecated 请改用 `overlayClassName`。
   */
  popperClass: {
    type: String,
    default: '',
  },
  /**
   * 浮层根 class。显式 `overlayClassName` 优先于 `popperClass`。
   */
  overlayClassName: {
    type: String,
    default: '',
  },
  offset: {
    type: Number,
    default: 4,
  },
  rawContent: {
    type: Boolean,
    default: false,
  },
  enterable: {
    type: Boolean,
    default: true,
  },
  hideOnClickOutside: {
    type: Boolean,
    default: true,
  },
  closeOnEsc: {
    type: Boolean,
    default: true,
  },
  ariaLabel: {
    type: String,
    default: '',
  },
  width: {
    type: [Number, String] as PropType<number | string>,
    default: '',
  },
  transition: {
    type: String,
    default: 'ccui-popover-fade',
  },
  autoClose: {
    type: Number,
    default: 0,
  },
  tabindex: {
    type: [Number, String] as PropType<number | string>,
    default: 0,
  },
  /**
   * @deprecated 请改用 `getPopupContainer` 函数形。
   */
  teleported: {
    type: Boolean,
    default: true,
  },
  /**
   * 浮层容器函数。返回 null 时不 Teleport（同 teleported=false）。
   */
  getPopupContainer: {
    type: Function as PropType<PopoverGetPopupContainer>,
    default: undefined,
  },
  /**
   * 每次关闭后强制重置内容。
   */
  fresh: {
    type: Boolean,
    default: false,
  },
  /**
   * 隐藏后销毁浮层 DOM（默认 false，复用 DOM）。
   */
  destroyTooltipOnHide: {
    type: Boolean,
    default: false,
  },
  /**
   * 浮层是否自动调整以避免溢出（默认开启，由 floating-ui flip 实现）。
   */
  autoAdjustOverflow: {
    type: Boolean,
    default: true,
  },
  /**
   * 浮层细调对象：offset / targetOffset / overflow。
   */
  align: {
    type: Object as PropType<PopoverAlign>,
    default: undefined,
  },
  persistent: {
    type: Boolean,
    default: true,
  },
  virtualTriggering: {
    type: Boolean,
    default: false,
  },
  virtualRef: {
    type: Object as PropType<HTMLElement>,
    default: undefined,
  },
  triggerKeys: {
    type: Array as PropType<string[]>,
    default: () => ['Enter', ' '],
  },
} as const

export type PopoverProps = ExtractPropTypes<typeof popoverProps>
