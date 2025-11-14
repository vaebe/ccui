import type { App } from 'vue'
import Slider from './src/slider'

Slider.install = function (app: App): void {
  app.component(Slider.name, Slider)
}

export { Slider }

export default {
  title: 'Slider 滑块',
  category: '数据录入',
  status: undefined, // TODO: 组件若开发完成则填入"100%"，并删除该注释
  install(app: App): void {
    app.component(Slider.name, Slider)
  },
}
