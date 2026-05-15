import type { App } from 'vue'
import SkeletonInput from './src/skeleton-input'

SkeletonInput.install = function (app: App): void {
  app.component(SkeletonInput.name!, SkeletonInput)
}

export { SkeletonInput }

export type { SkeletonInputProps, SkeletonInputSize } from './src/skeleton-input-types'

export default {
  title: 'SkeletonInput 输入框骨架',
  category: '反馈',
  status: '90%',
  install(app: App): void {
    app.component(SkeletonInput.name!, SkeletonInput)
  },
}
