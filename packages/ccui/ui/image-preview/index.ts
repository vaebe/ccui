import type { App } from 'vue'
import ImagePreview from './src/image-preview'

ImagePreview.install = function (app: App): void {
  app.component(ImagePreview.name!, ImagePreview)
}

export { ImagePreview }

export type { ImagePreviewControl, ImagePreviewProps, ImagePreviewItem } from './src/image-preview-types'

export default {
  title: 'ImagePreview 图片预览',
  category: '数据展示',
  status: '80%',
  install(app: App): void {
    app.component(ImagePreview.name!, ImagePreview)
  },
}
