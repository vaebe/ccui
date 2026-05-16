import type { ExtractPropTypes, PropType, VNode } from 'vue'
import type { CcSemanticClasses, CcSemanticStyles } from '../../shared/hooks/use-semantic'

export type MessageType = 'info' | 'success' | 'warning' | 'error' | 'loading'

export type MessagePlacement = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight'

export type MessageAriaRole = 'alert' | 'status'

export interface MessageOptions {
  content: string | VNode
  type?: MessageType
  // 单位优先「秒」（与 ant 一致），>100 自动按 ms 兼容；0 表示不自动关闭
  duration?: number
  showClose?: boolean
  onClose?: () => void
  icon?: string
  key?: string | number
  customClass?: string
  placement?: MessagePlacement
  role?: MessageAriaRole
  pauseOnHover?: boolean
  // 语义化 DOM 钩子
  classNames?: CcSemanticClasses
  styles?: CcSemanticStyles
}

// 模块级全局配置（message.config(...) 设置）
export interface MessageGlobalConfig {
  top?: number | string
  bottom?: number | string
  duration?: number
  maxCount?: number
  stack?: boolean
  pauseOnHover?: boolean
  role?: MessageAriaRole
  getContainer?: () => HTMLElement
}

export const messageItemProps = {
  id: {
    type: String,
    required: true,
  },
  content: {
    type: [String, Object] as PropType<string | VNode>,
    default: '',
  },
  type: {
    type: String as PropType<MessageType>,
    default: 'info' as MessageType,
  },
  // 内部已归一化为 ms
  duration: {
    type: Number,
    default: 3000,
  },
  showClose: {
    type: Boolean,
    default: false,
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
    type: String as PropType<MessageAriaRole>,
    default: 'alert' as MessageAriaRole,
  },
  pauseOnHover: {
    type: Boolean,
    default: true,
  },
  /**
   * 语义化 DOM className 注入。可用 key：`root` / `icon` / `content`。
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

export type MessageItemProps = ExtractPropTypes<typeof messageItemProps>

export interface MessageHandle {
  close: () => void
}
