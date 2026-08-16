import type { App } from 'vue'
import Segmented from './src/segmented'

export type { SegmentedOption, SegmentedProps, SegmentedSize } from './src/segmented-types'

Segmented.install = function (app: App): void {
  app.component(Segmented.name!, Segmented)
}

export { Segmented }

export default {
  title: 'Segmented 分段控制器',
  category: '数据录入',
  status: '100%',
  install(app: App): void {
    app.component(Segmented.name!, Segmented)
  },
}
