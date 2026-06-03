import type { ExtractPropTypes, PropType, VNode } from 'vue'
import type { CcSemanticClasses, CcSemanticStyles } from '../../shared/hooks/use-semantic'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'
// 补 top / bottom 居中位
export type NotificationPlacement = 'top' | 'topRight' | 'topLeft' | 'bottom' | 'bottomRight' | 'bottomLeft'

export type NotificationAriaRole = 'alert' | 'status'

export interface NotificationOptions {
  title?: string
  description?: string | VNode
  type?: NotificationType
  // 单位优先「秒」，>100 自动按 ms 兼容；0 表示不自动关闭
  duration?: number
  placement?: NotificationPlacement
  showClose?: boolean
  onClose?: () => void
  icon?: string
  customClass?: string
  role?: NotificationAriaRole
  pauseOnHover?: boolean
  // 语义化 DOM 钩子
  classNames?: CcSemanticClasses
  styles?: CcSemanticStyles
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
  /**
   * 语义化 DOM className 注入。可用 key：`root` / `icon` / `content` / `close`。
   */
  classNames: {
    type: Object as PropType<CcSemanticClasses>,
    default: undefined,
  },
  /**
   * 语义化 DOM style 注入。可用 key 与 classNames 一致。
   */
  styles: {
    type: Object as PropType<CcSemanticStyles>,
    default: undefined,
  },
} as const

export type NotificationItemProps = ExtractPropTypes<typeof notificationItemProps>

export interface NotificationHandle {
  close: () => void
}
