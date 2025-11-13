import type { App } from 'vue'
import Timeline from './src/timeline'
import TimelineItem from './src/timeline-item'

Timeline.install = function (app: App): void {
  app.component(Timeline.name || 'CTimeline', Timeline)
  app.component(TimelineItem.name || 'CTimelineItem', TimelineItem)
}

TimelineItem.install = function (app: App): void {
  app.component(TimelineItem.name || 'CTimelineItem', TimelineItem)
}

export { Timeline, TimelineItem }

export default {
  title: 'Timeline 时间线',
  category: '数据展示',
  status: '100%',
  install(app: App): void {
    app.component(Timeline.name || 'CTimeline', Timeline)
    app.component(TimelineItem.name || 'CTimelineItem', TimelineItem)
  },
}
