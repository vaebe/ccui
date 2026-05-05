import type { App } from 'vue'
import Select from './src/select'

Select.install = function (app: App): void {
  app.component(Select.name!, Select)
}

export { Select }

export default {
  title: 'Select',
  category: 'Data Entry',
  status: '35%',
  install(app: App): void {
    app.component(Select.name!, Select)
  },
}
