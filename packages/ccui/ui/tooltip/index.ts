import type { App } from 'vue'
import Tooltip from './src/tooltip'

Tooltip.install = function (app: App): void {
  app.component(Tooltip.name!, Tooltip)
}

export { Tooltip }

export default {
  title: 'Tooltip 文字提示',
  category: '反馈',
  status: '100%',
  install(app: App): void {
    app.component(Tooltip.name!, Tooltip)
  },
}
