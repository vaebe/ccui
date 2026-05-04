import type { ExtractPropTypes, PropType, VNode } from 'vue'

export type MessageType = 'info' | 'success' | 'warning' | 'error' | 'loading'

export interface MessageOptions {
  content: string | VNode
  type?: MessageType
  duration?: number
  showClose?: boolean
  onClose?: () => void
  icon?: string
  key?: string | number
  customClass?: string
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
} as const

export type MessageItemProps = ExtractPropTypes<typeof messageItemProps>

export interface MessageHandle {
  close: () => void
}
