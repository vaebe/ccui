import type { App } from 'vue'
import Anchor from './src/anchor'

Anchor.install = function (app: App): void {
  app.component(Anchor.name!, Anchor)
}

export { Anchor }

export default {
  title: 'Anchor 锚点',
  category: '导航',
  status: '100%',
  install(app: App): void {
    app.component(Anchor.name!, Anchor)
  },
}
