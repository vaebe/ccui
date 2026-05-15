import type { App } from 'vue'
import SkeletonButton from './src/skeleton-button'

SkeletonButton.install = function (app: App): void {
  app.component(SkeletonButton.name!, SkeletonButton)
}

export { SkeletonButton }

export type { SkeletonButtonProps, SkeletonButtonShape, SkeletonButtonSize } from './src/skeleton-button-types'

export default {
  title: 'SkeletonButton 按钮骨架',
  category: '反馈',
  status: '90%',
  install(app: App): void {
    app.component(SkeletonButton.name!, SkeletonButton)
  },
}
