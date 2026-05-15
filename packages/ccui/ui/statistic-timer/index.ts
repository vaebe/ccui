import type { App } from 'vue'
import StatisticTimer from './src/statistic-timer'

StatisticTimer.install = function (app: App): void {
  app.component(StatisticTimer.name!, StatisticTimer)
}

export { StatisticTimer }

export type { StatisticTimerProps, StatisticTimerType } from './src/statistic-timer-types'

export default {
  title: 'StatisticTimer 计时器',
  category: '数据展示',
  status: '90%',
  install(app: App): void {
    app.component(StatisticTimer.name!, StatisticTimer)
  },
}
