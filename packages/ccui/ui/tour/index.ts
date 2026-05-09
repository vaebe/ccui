import type { App } from 'vue'
import Tour from './src/tour'

Tour.install = function (app: App): void {
  app.component(Tour.name!, Tour)
}

export { Tour }

export default {
  title: 'Tour 漫游引导',
  category: '反馈',
  status: '80%',
  install(app: App): void {
    app.component(Tour.name!, Tour)
  },
}
