import type { App } from 'vue'
import CardMeta from './src/card-meta'

CardMeta.install = function (app: App): void {
  app.component(CardMeta.name!, CardMeta)
}

export { CardMeta }

export type { CardMetaProps } from './src/card-meta-types'

export default {
  title: 'CardMeta 卡片元信息',
  category: '数据展示',
  status: '90%',
  install(app: App): void {
    app.component(CardMeta.name!, CardMeta)
  },
}
