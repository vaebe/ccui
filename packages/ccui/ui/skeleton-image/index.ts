import type { App } from 'vue'
import SkeletonImage from './src/skeleton-image'

SkeletonImage.install = function (app: App): void {
  app.component(SkeletonImage.name!, SkeletonImage)
}

export { SkeletonImage }

export type { SkeletonImageProps } from './src/skeleton-image-types'

export default {
  title: 'SkeletonImage 图片骨架',
  category: '反馈',
  status: '90%',
  install(app: App): void {
    app.component(SkeletonImage.name!, SkeletonImage)
  },
}
