import type { App } from 'vue'
import StatisticCountdown from './src/countdown'
import Statistic from './src/statistic'

Statistic.install = function (app: App): void {
  app.component(Statistic.name!, Statistic)
  app.component(StatisticCountdown.name!, StatisticCountdown)
}

export { Statistic, StatisticCountdown }

export default {
  title: 'Statistic 统计数值',
  category: '数据展示',
  status: '100%',
  install(app: App): void {
    app.component(Statistic.name!, Statistic)
    app.component(StatisticCountdown.name!, StatisticCountdown)
  },
}
