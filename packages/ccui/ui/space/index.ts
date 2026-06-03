import type { App } from 'vue'
import Space from './src/space'

Space.install = function (app: App): void {
  app.component(Space.name!, Space)
}

export { Space }

export default {
  title: 'Space 间距',
  category: '布局',
  status: '100%',
  install(app: App): void {
    app.component(Space.name!, Space)
  },
}
