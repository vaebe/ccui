import type { ExtractPropTypes, PropType } from 'vue'

export type PopoverPlacement
  = | 'top'
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

export type PopoverTrigger = 'hover' | 'click' | 'focus' | 'manual'

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
  trigger: {
    type: String as PropType<PopoverTrigger>,
    default: 'click' as PopoverTrigger,
  },
  showAfter: {
    type: Number,
    default: 0,
  },
  hideAfter: {
    type: Number,
    default: 200,
  },
  popperClass: {
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
} as const

export type PopoverProps = ExtractPropTypes<typeof popoverProps>
