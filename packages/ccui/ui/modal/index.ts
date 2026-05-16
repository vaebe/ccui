import type { App } from 'vue'
import type { ModalFuncOptions, ModalFuncReturn } from './src/confirm-types'
import { createTypedFunc, modalDestroyAll, modalFunc } from './src/confirm'
import ModalComp from './src/modal'
import { useModal } from './src/use-modal'

interface ModalNamespace extends Record<string, unknown> {
  install?: (app: App) => void
  confirm: (options?: ModalFuncOptions) => ModalFuncReturn
  info: (options?: ModalFuncOptions) => ModalFuncReturn
  success: (options?: ModalFuncOptions) => ModalFuncReturn
  error: (options?: ModalFuncOptions) => ModalFuncReturn
  warning: (options?: ModalFuncOptions) => ModalFuncReturn
  destroyAll: () => void
}

// 把命令式静态方法挂到 Modal 组件对象上（不挂子组件命名空间，只挂函数）
const Modal = ModalComp as typeof ModalComp & ModalNamespace
Modal.confirm = (options: ModalFuncOptions = {}) => modalFunc({ type: 'confirm', ...options })
Modal.info = createTypedFunc('info')
Modal.success = createTypedFunc('success')
Modal.error = createTypedFunc('error')
Modal.warning = createTypedFunc('warning')
Modal.destroyAll = modalDestroyAll
Modal.install = function (app: App): void {
  app.component(ModalComp.name!, ModalComp)
}

export { Modal, useModal }
export type { ModalFuncOptions, ModalFuncReturn } from './src/confirm-types'
export type { UseModalReturn } from './src/use-modal'

export default {
  title: 'Modal 对话框',
  category: '反馈',
  status: '100%',
  install(app: App): void {
    app.component(ModalComp.name!, ModalComp)
  },
}
