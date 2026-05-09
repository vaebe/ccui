import type { App } from 'vue'
import Carousel from './src/carousel'

Carousel.install = function (app: App): void {
  app.component(Carousel.name!, Carousel)
}

export { Carousel }

export default {
  title: 'Carousel 走马灯',
  category: '数据展示',
  status: '80%',
  install(app: App): void {
    app.component(Carousel.name!, Carousel)
  },
}
