import type { App } from 'vue'
import Skeleton from './src/skeleton'

Skeleton.install = function (app: App): void {
  app.component(Skeleton.name!, Skeleton)
}

export { Skeleton }

export default {
  title: 'Skeleton 骨架屏',
  category: '反馈',
  status: '100%',
  install(app: App): void {
    app.component(Skeleton.name!, Skeleton)
  },
}
