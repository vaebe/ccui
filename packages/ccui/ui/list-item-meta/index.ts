import type { App } from 'vue'
import ListItemMeta from './src/list-item-meta'

ListItemMeta.install = function (app: App): void {
  app.component(ListItemMeta.name!, ListItemMeta)
}

export { ListItemMeta }

export type { ListItemMetaProps } from './src/list-item-meta-types'

export default {
  title: 'ListItemMeta 列表项元信息',
  category: '数据展示',
  status: '90%',
  install(app: App): void {
    app.component(ListItemMeta.name!, ListItemMeta)
  },
}
