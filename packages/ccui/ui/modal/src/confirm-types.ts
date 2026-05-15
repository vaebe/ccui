import type { VNode } from 'vue'
import type { ModalGetContainer } from './modal-types'

export type ModalFuncType = 'confirm' | 'info' | 'success' | 'error' | 'warning'

export interface ModalFuncOptions {
  title?: string | VNode
  content?: string | VNode
  type?: ModalFuncType
  icon?: string | VNode
  width?: number | string
  centered?: boolean
  mask?: boolean
  maskClosable?: boolean
  keyboard?: boolean
  closable?: boolean
  okText?: string
  cancelText?: string
  okType?: 'primary' | 'danger' | 'default'
  okButtonProps?: Record<string, unknown>
  cancelButtonProps?: Record<string, unknown>
  // Promise / void 返回；返回 Promise 时按钮 loading 直到 resolve；reject 阻止关闭
  onOk?: () => void | Promise<unknown>
  onCancel?: () => void | Promise<unknown>
  afterClose?: () => void
  zIndex?: number
  wrapClassName?: string
  getContainer?: ModalGetContainer
}

export interface ModalFuncReturn {
  /** 强制销毁此 modal */
  destroy: () => void
  /** 更新 modal 的 options，可传部分字段做合并；或传函数返回新对象 */
  update: (updater: Partial<ModalFuncOptions> | ((prev: ModalFuncOptions) => Partial<ModalFuncOptions>)) => void
}
