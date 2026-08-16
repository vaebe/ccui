import type { App } from 'vue'
import Skeleton from './src/skeleton'

Skeleton.install = function (app: App): void {
  app.component(Skeleton.name!, Skeleton)
}

export { Skeleton }
export type {
  SkeletonAvatarShape,
  SkeletonParagraphShape,
  SkeletonProps,
  SkeletonTitleShape,
} from './src/skeleton-types'

export default {
  title: 'Skeleton 骨架屏',
  category: '反馈',
  status: '100%',
  install(app: App): void {
    app.component(Skeleton.name!, Skeleton)
  },
}
