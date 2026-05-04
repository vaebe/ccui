import type { App } from 'vue'
import Segmented from './src/segmented'

Segmented.install = function (app: App): void {
  app.component(Segmented.name!, Segmented)
}

export { Segmented }

export default {
  title: 'Segmented 分段控制器',
  category: '数据展示',
  status: '100%',
  install(app: App): void {
    app.component(Segmented.name!, Segmented)
  },
}
