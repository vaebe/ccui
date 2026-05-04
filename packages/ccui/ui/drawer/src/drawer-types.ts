import type { ExtractPropTypes, PropType } from 'vue'

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom'

export const drawerProps = {
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  placement: {
    type: String as PropType<DrawerPlacement>,
    default: 'right' as DrawerPlacement,
  },
  size: {
    type: [Number, String] as PropType<number | string>,
    default: 378,
  },
  closable: {
    type: Boolean,
    default: true,
  },
  maskClosable: {
    type: Boolean,
    default: true,
  },
  closeOnEsc: {
    type: Boolean,
    default: true,
  },
  mask: {
    type: Boolean,
    default: true,
  },
  showFooter: {
    type: Boolean,
    default: false,
  },
  destroyOnClose: {
    type: Boolean,
    default: false,
  },
  zIndex: {
    type: Number,
    default: 1000,
  },
  appendToBody: {
    type: Boolean,
    default: true,
  },
} as const

export type DrawerProps = ExtractPropTypes<typeof drawerProps>
