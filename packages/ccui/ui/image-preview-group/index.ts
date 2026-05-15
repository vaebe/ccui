import type { App } from 'vue'
import ImagePreviewGroup from './src/image-preview-group'

ImagePreviewGroup.install = function (app: App): void {
  app.component(ImagePreviewGroup.name!, ImagePreviewGroup)
}

export { ImagePreviewGroup }

export type { ImagePreviewControl, ImagePreviewGroupProps, ImagePreviewItem } from './src/image-preview-group-types'

export default {
  title: 'ImagePreviewGroup 图片预览组',
  category: '数据展示',
  status: '80%',
  install(app: App): void {
    app.component(ImagePreviewGroup.name!, ImagePreviewGroup)
  },
}
