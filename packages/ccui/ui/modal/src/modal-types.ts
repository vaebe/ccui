import type { ExtractPropTypes, PropType } from 'vue'

export type ModalType = 'info' | 'success' | 'warning' | 'error' | 'confirm'

export const modalProps = {
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  width: {
    type: [Number, String] as PropType<number | string>,
    default: 520,
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
  centered: {
    type: Boolean,
    default: false,
  },
  mask: {
    type: Boolean,
    default: true,
  },
  // 不设字面量默认；运行时从 ConfigProvider.locale.Modal.okText / cancelText 取值。
  // 用户显式传 okText 仍按 explicit 值优先。
  okText: {
    type: String,
    default: '',
  },
  cancelText: {
    type: String,
    default: '',
  },
  okType: {
    type: String as PropType<'primary' | 'danger' | 'default'>,
    default: 'primary' as const,
  },
  okLoading: {
    type: Boolean,
    default: false,
  },
  hideFooter: {
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

export type ModalProps = ExtractPropTypes<typeof modalProps>
