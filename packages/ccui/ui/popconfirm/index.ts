import type { App } from 'vue'
import Popconfirm from './src/popconfirm'

Popconfirm.install = function (app: App): void {
  app.component(Popconfirm.name!, Popconfirm)
}

export { Popconfirm }

export default {
  title: 'Popconfirm 气泡确认',
  category: '反馈',
  status: '100%',
  install(app: App): void {
    app.component(Popconfirm.name!, Popconfirm)
  },
}
