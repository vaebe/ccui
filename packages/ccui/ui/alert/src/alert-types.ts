import type { ExtractPropTypes, PropType } from 'vue'

export type AlertType = 'success' | 'info' | 'warning' | 'error'

export const alertProps = {
  type: {
    type: String as PropType<AlertType>,
    default: 'info',
  },
  message: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  showIcon: {
    type: Boolean,
    default: false,
  },
  closable: {
    type: Boolean,
    default: false,
  },
  closeText: {
    type: String,
    default: '',
  },
  banner: {
    type: Boolean,
    default: false,
  },
} as const

export type AlertProps = ExtractPropTypes<typeof alertProps>
