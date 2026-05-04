import type { App } from 'vue'
import Empty from './src/empty'

Empty.install = function (app: App): void {
  app.component(Empty.name!, Empty)
}

export { Empty }

export default {
  title: 'Empty 空状态',
  category: '数据展示',
  status: '100%',
  install(app: App): void {
    app.component(Empty.name!, Empty)
  },
}
