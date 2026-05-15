import type { App } from 'vue'
import SkeletonAvatar from './src/skeleton-avatar'

SkeletonAvatar.install = function (app: App): void {
  app.component(SkeletonAvatar.name!, SkeletonAvatar)
}

export { SkeletonAvatar }

export type { SkeletonAvatarProps, SkeletonAvatarShape, SkeletonAvatarSize } from './src/skeleton-avatar-types'

export default {
  title: 'SkeletonAvatar 头像骨架',
  category: '反馈',
  status: '90%',
  install(app: App): void {
    app.component(SkeletonAvatar.name!, SkeletonAvatar)
  },
}
