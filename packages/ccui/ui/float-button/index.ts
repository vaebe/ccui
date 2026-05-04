import type { App } from 'vue'
import BackTop from './src/back-top'
import FloatButton from './src/float-button'

FloatButton.install = function (app: App): void {
  app.component(FloatButton.name!, FloatButton)
  app.component(BackTop.name!, BackTop)
}

export { BackTop, FloatButton }

export default {
  title: 'FloatButton 悬浮按钮',
  category: '通用',
  status: '100%',
  install(app: App): void {
    app.component(FloatButton.name!, FloatButton)
    app.component(BackTop.name!, BackTop)
  },
}
