import type { App } from 'vue'
import Watermark from './src/watermark'

Watermark.install = function (app: App): void {
  app.component(Watermark.name!, Watermark)
}

export { Watermark }

export default {
  title: 'Watermark 水印',
  category: '数据展示',
  status: '100%',
  install(app: App): void {
    app.component(Watermark.name!, Watermark)
  },
}
