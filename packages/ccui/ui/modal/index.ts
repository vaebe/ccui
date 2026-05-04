import type { App } from 'vue'
import Modal from './src/modal'

Modal.install = function (app: App): void {
  app.component(Modal.name!, Modal)
}

export { Modal }

export default {
  title: 'Modal 对话框',
  category: '反馈',
  status: '100%',
  install(app: App): void {
    app.component(Modal.name!, Modal)
  },
}
