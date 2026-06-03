import type { ExtractPropTypes, PropType } from 'vue'

export type FloatButtonShape = 'circle' | 'square'
export type FloatButtonType = 'default' | 'primary'

export const floatButtonProps = {
  shape: {
    type: String as PropType<FloatButtonShape>,
    default: 'circle' as FloatButtonShape,
  },
  type: {
    type: String as PropType<FloatButtonType>,
    default: 'default' as FloatButtonType,
  },
  description: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  badge: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },
  href: {
    type: String,
    default: '',
  },
  target: {
    type: String,
    default: '',
  },
  tooltip: {
    type: String,
    default: '',
  },
} as const

export type FloatButtonProps = ExtractPropTypes<typeof floatButtonProps>

export const backTopProps = {
  visibilityHeight: {
    type: Number,
    default: 400,
  },
  duration: {
    type: Number,
    default: 450,
  },
  target: {
    type: [String, Object, Function] as PropType<string | HTMLElement | (() => HTMLElement | Window)>,
    default: undefined,
  },
  shape: {
    type: String as PropType<FloatButtonShape>,
    default: 'circle' as FloatButtonShape,
  },
  type: {
    type: String as PropType<FloatButtonType>,
    default: 'default' as FloatButtonType,
  },
  icon: {
    type: String,
    default: '',
  },
} as const

export type BackTopProps = ExtractPropTypes<typeof backTopProps>
