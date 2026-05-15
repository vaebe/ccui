import type { ExtractPropTypes, PropType, VNode } from 'vue'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'
// L-3.5：补 top / bottom 居中位
export type NotificationPlacement = 'top' | 'topRight' | 'topLeft' | 'bottom' | 'bottomRight' | 'bottomLeft'

export type NotificationAriaRole = 'alert' | 'status'

export interface NotificationOptions {
  title?: string
  description?: string | VNode
  type?: NotificationType
  // 单位优先「秒」（与 ant 一致），>100 自动按 ms 兼容；0 表示不自动关闭
  duration?: number
  placement?: NotificationPlacement
  showClose?: boolean
  onClose?: () => void
  icon?: string
  customClass?: string
  // L-3.5 新增
  role?: NotificationAriaRole
  pauseOnHover?: boolean
}

// 模块级全局配置（notification.config(...) 设置）
export interface NotificationGlobalConfig {
  top?: number | string
  bottom?: number | string
  duration?: number
  maxCount?: number
  stack?: boolean
  pauseOnHover?: boolean
  role?: NotificationAriaRole
  placement?: NotificationPlacement
  getContainer?: () => HTMLElement
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
  // 内部已归一化为 ms
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
  role: {
    type: String as PropType<NotificationAriaRole>,
    default: 'alert' as NotificationAriaRole,
  },
  pauseOnHover: {
    type: Boolean,
    default: true,
  },
} as const

export type NotificationItemProps = ExtractPropTypes<typeof notificationItemProps>

export interface NotificationHandle {
  close: () => void
}
