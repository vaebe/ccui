import type { App } from 'vue'
import List from './src/list'
import ListItem from './src/list-item'

List.install = function (app: App): void {
  app.component(List.name!, List)
  app.component(ListItem.name!, ListItem)
}

export { List, ListItem }

export default {
  title: 'List 列表',
  category: '数据展示',
  status: '100%',
  install(app: App): void {
    app.component(List.name!, List)
    app.component(ListItem.name!, ListItem)
  },
}
