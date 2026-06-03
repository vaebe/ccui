import type { App } from 'vue'
import Spin from './src/spin'

Spin.install = function (app: App): void {
  app.component(Spin.name!, Spin)
}

export { Spin }

export default {
  title: 'Spin 加载中',
  category: '反馈',
  status: '100%',
  install(app: App): void {
    app.component(Spin.name!, Spin)
  },
}
