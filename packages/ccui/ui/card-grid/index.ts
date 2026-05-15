import type { App } from 'vue'
import CardGrid from './src/card-grid'

CardGrid.install = function (app: App): void {
  app.component(CardGrid.name!, CardGrid)
}

export { CardGrid }

export type { CardGridProps } from './src/card-grid-types'

export default {
  title: 'CardGrid 卡片网格',
  category: '数据展示',
  status: '90%',
  install(app: App): void {
    app.component(CardGrid.name!, CardGrid)
  },
}
