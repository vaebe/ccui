import type { App } from 'vue'
import Affix from './src/affix'

Affix.install = function (app: App): void {
  app.component(Affix.name!, Affix)
}

export { Affix }

export default {
  title: 'Affix 固钉',
  category: '其他',
  status: '100%',
  install(app: App): void {
    app.component(Affix.name!, Affix)
  },
}
