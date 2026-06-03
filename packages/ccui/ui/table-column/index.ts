import type { App } from 'vue'
import TableColumn from './src/table-column'

TableColumn.install = function (app: App): void {
  app.component(TableColumn.name!, TableColumn)
}

export { TableColumn }

export type { TableColumnProps } from './src/table-column-types'

export default {
  title: 'TableColumn 表格列',
  category: '数据展示',
  status: '90%',
  install(app: App): void {
    app.component(TableColumn.name!, TableColumn)
  },
}
