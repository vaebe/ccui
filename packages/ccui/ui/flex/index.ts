import type { App } from 'vue'
import Flex from './src/flex'

Flex.install = function (app: App): void {
  app.component(Flex.name!, Flex)
}

export { Flex }

export default {
  title: 'Flex 弹性布局',
  category: '布局',
  status: '100%',
  install(app: App): void {
    app.component(Flex.name!, Flex)
  },
}
