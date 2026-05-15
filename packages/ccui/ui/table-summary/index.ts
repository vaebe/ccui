import type { App } from 'vue'
import TableSummary from './src/table-summary'

TableSummary.install = function (app: App): void {
  app.component(TableSummary.name!, TableSummary)
}

export { TableSummary }

export type { TableSummaryProps } from './src/table-summary-types'

export default {
  title: 'TableSummary 表格汇总',
  category: '数据展示',
  status: '90%',
  install(app: App): void {
    app.component(TableSummary.name!, TableSummary)
  },
}
