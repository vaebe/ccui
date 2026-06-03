import type { App } from 'vue'
import Table from './src/table'

Table.install = function (app: App): void {
  app.component(Table.name!, Table)
}

export { Table }
export type {
  TableCellRenderProps,
  TableColumn,
  TableExpandable,
  TableFilterOption,
  TableFilters,
  TableRowSelection,
  TableSelectionKey,
  TableSelectionType,
  TableSorter,
  TableSortOrder,
} from './src/table-types'

export default {
  title: 'Table 表格',
  category: '数据展示',
  status: '95%',
  install(app: App): void {
    app.component(Table.name!, Table)
  },
}
