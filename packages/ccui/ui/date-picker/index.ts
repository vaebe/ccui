import type { App } from 'vue'
import DatePicker from './src/date-picker'

DatePicker.install = function (app: App): void {
  app.component(DatePicker.name!, DatePicker)
}

export { DatePicker }

export default {
  title: 'DatePicker 日期选择框',
  category: '数据录入',
  status: '80%',
  install(app: App): void {
    app.component(DatePicker.name!, DatePicker)
  },
}
