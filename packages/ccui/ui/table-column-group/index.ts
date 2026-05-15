import type { App } from 'vue'
import TableColumnGroup from './src/table-column-group'

TableColumnGroup.install = function (app: App): void {
  app.component(TableColumnGroup.name!, TableColumnGroup)
}

export { TableColumnGroup }

export type { TableColumnGroupProps } from './src/table-column-group-types'

export default {
  title: 'TableColumnGroup 表格列分组',
  category: '数据展示',
  status: '90%',
  install(app: App): void {
    app.component(TableColumnGroup.name!, TableColumnGroup)
  },
}
