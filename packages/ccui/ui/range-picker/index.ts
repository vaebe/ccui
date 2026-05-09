import type { App } from 'vue'
import RangePicker from './src/range-picker'

RangePicker.install = function (app: App): void {
  app.component(RangePicker.name!, RangePicker)
}

export { RangePicker }

export default {
  title: 'RangePicker 日期范围',
  category: '数据录入',
  status: '80%',
  install(app: App): void {
    app.component(RangePicker.name!, RangePicker)
  },
}
