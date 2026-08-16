import type { App } from 'vue'
import Image from './src/image'
export type { ImageFit, ImageProps } from './src/image-types'

Image.install = function (app: App): void {
  app.component(Image.name!, Image)
}

export { Image }

export default {
  title: 'Image 图片',
  category: '数据展示',
  status: '100%',
  install(app: App): void {
    app.component(Image.name!, Image)
  },
}
