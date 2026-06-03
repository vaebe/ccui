import type { App } from 'vue'
import TimeRangePicker from './src/time-range-picker'

TimeRangePicker.install = function (app: App): void {
  app.component(TimeRangePicker.name!, TimeRangePicker)
}

export { TimeRangePicker }

export default {
  title: 'TimeRangePicker 时间范围选择',
  category: '数据录入',
  status: '60%',
  install(app: App): void {
    app.component(TimeRangePicker.name!, TimeRangePicker)
  },
}
