import type { App } from 'vue'
import Descriptions from './src/descriptions'
import DescriptionsItem from './src/descriptions-item'

Descriptions.install = function (app: App): void {
  app.component(Descriptions.name!, Descriptions)
  app.component(DescriptionsItem.name!, DescriptionsItem)
}

export { Descriptions, DescriptionsItem }

// Export documented contracts from the public entry so consumers do not import internals.
export type {
  DescriptionsItem as DescriptionsItemData,
  DescriptionsItemProps,
  DescriptionsLayout,
  DescriptionsProps,
  DescriptionsSize,
} from './src/descriptions-types'

export default {
  title: 'Descriptions 描述列表',
  category: '数据展示',
  status: '100%',
  install(app: App): void {
    app.component(Descriptions.name!, Descriptions)
    app.component(DescriptionsItem.name!, DescriptionsItem)
  },
}
