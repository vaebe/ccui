import type { App } from 'vue'
import Badge from './src/badge'

Badge.install = function (app: App): void {
  app.component(Badge.name!, Badge)
}

export { Badge }

export default {
  title: 'Badge 徽标数',
  category: '数据展示',
  status: '100%',
  install(app: App): void {
    app.component(Badge.name!, Badge)
  },
}
