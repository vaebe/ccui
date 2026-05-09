import type { App } from 'vue'
import TreeSelect from './src/tree-select'

TreeSelect.install = function (app: App): void {
  app.component(TreeSelect.name!, TreeSelect)
}

export { TreeSelect }

export default {
  title: 'TreeSelect 树选择',
  category: '数据录入',
  status: '80%',
  install(app: App): void {
    app.component(TreeSelect.name!, TreeSelect)
  },
}
