import type { App } from 'vue'
import Drawer from './src/drawer'

Drawer.install = function (app: App): void {
  app.component(Drawer.name!, Drawer)
}

export { Drawer }

export default {
  title: 'Drawer 抽屉',
  category: '反馈',
  status: '100%',
  install(app: App): void {
    app.component(Drawer.name!, Drawer)
  },
}
