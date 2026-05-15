import type { App } from 'vue'
import TreeSelect from './src/tree-select'

TreeSelect.install = function (app: App): void {
  app.component(TreeSelect.name!, TreeSelect)
}

export { TreeSelect }

export { TREE_SELECT_SHOW_ALL, TREE_SELECT_SHOW_CHILD, TREE_SELECT_SHOW_PARENT } from './src/tree-select-types'
export type { TreeSelectShowCheckedStrategy } from './src/tree-select-types'

export default {
  title: 'TreeSelect 树选择',
  category: '数据录入',
  status: '80%',
  install(app: App): void {
    app.component(TreeSelect.name!, TreeSelect)
  },
}
