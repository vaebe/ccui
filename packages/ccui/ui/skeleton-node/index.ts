import type { App } from 'vue'
import SkeletonNode from './src/skeleton-node'

SkeletonNode.install = function (app: App): void {
  app.component(SkeletonNode.name!, SkeletonNode)
}

export { SkeletonNode }

export type { SkeletonNodeProps } from './src/skeleton-node-types'

export default {
  title: 'SkeletonNode 自定义骨架',
  category: '反馈',
  status: '90%',
  install(app: App): void {
    app.component(SkeletonNode.name!, SkeletonNode)
  },
}
