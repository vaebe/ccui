import type { ExtractPropTypes, PropType, VNode } from 'vue'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'
export type NotificationPlacement = 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft'

export interface NotificationOptions {
  title?: string
  description?: string | VNode
  type?: NotificationType
  duration?: number
  placement?: NotificationPlacement
  showClose?: boolean
  onClose?: () => void
  icon?: string
  customClass?: string
}

export const notificationItemProps = {
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: [String, Object] as PropType<string | VNode>,
    default: '',
  },
  type: {
    type: String as PropType<NotificationType>,
    default: 'info' as NotificationType,
  },
  duration: {
    type: Number,
    default: 4500,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  icon: {
    type: String,
    default: '',
  },
  customClass: {
    type: String,
    default: '',
  },
} as const

export type NotificationItemProps = ExtractPropTypes<typeof notificationItemProps>

export interface NotificationHandle {
  close: () => void
}
