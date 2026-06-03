import type { App } from 'vue'
import AutoComplete from './src/auto-complete'

AutoComplete.install = function (app: App): void {
  app.component(AutoComplete.name!, AutoComplete)
}

export { AutoComplete }

export default {
  title: 'AutoComplete 自动完成',
  category: '数据录入',
  status: '80%',
  install(app: App): void {
    app.component(AutoComplete.name!, AutoComplete)
  },
}
