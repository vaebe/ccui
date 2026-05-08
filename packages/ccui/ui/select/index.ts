import type { App } from 'vue'
import Select from './src/select'

Select.install = function (app: App): void {
  app.component(Select.name!, Select)
}

export { Select }

export default {
  title: 'Select 选择器',
  category: '数据录入',
  status: '80%',
  install(app: App): void {
    app.component(Select.name!, Select)
  },
}
