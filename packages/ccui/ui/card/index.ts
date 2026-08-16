import type { App } from 'vue'
import Card from './src/card'
import type { CardProps } from './src/card-types'

// 作为插件引入
Card.install = function (app: App): void {
  app.component(Card.name!, Card)
}

// 按需
export { Card }

// 公共入口同步导出组件属性类型，确保类型消费者无需依赖内部路径。
export type { CardProps }

// 内部统一注册
export default {
  title: 'Card 卡片',
  category: '数据展示',
  status: '100%',
  install(app: App): void {
    app.component(Card.name!, Card)
  },
}
