import type { App } from 'vue'
import Masonry from './src/masonry'

Masonry.install = function (app: App): void {
  app.component(Masonry.name!, Masonry)
}

export { Masonry }

export default {
  title: 'Masonry 瀑布流',
  category: '布局',
  status: '100%',
  install(app: App): void {
    app.component(Masonry.name!, Masonry)
  },
}
