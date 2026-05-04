import type { App as VueApp } from 'vue'
import { App, useApp } from './src/app'

;(App as any).install = function (app: VueApp): void {
  app.component((App as any).name, App)
}

export { App, useApp }

export default {
  title: 'App 包裹组件',
  category: '通用',
  status: '100%',
  install(app: VueApp): void {
    app.component((App as any).name, App)
  },
}
