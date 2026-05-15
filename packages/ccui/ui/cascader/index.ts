import type { App } from 'vue'
import Cascader from './src/cascader'

Cascader.install = function (app: App): void {
  app.component(Cascader.name!, Cascader)
}

export { Cascader }

export { CASCADER_SHOW_CHILD, CASCADER_SHOW_PARENT } from './src/cascader-types'
export type { CascaderShowCheckedStrategy } from './src/cascader-types'

export default {
  title: 'Cascader 级联选择',
  category: '数据录入',
  status: '80%',
  install(app: App): void {
    app.component(Cascader.name!, Cascader)
  },
}
