import type { App } from 'vue'
import Timeline from './src/timeline'
import TimelineItem from './src/timeline-item'

Timeline.install = function (app: App) {
  app.component(Timeline.name!, Timeline)
  app.component(TimelineItem.name!, TimelineItem)
}

export { Timeline, TimelineItem }

export default {
  title: 'Timeline 时间线',
  category: '数据展示',
  status: '100%',
  install(app: App) {
    Timeline.install(app)
  },
}
