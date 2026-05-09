import type { App } from 'vue'
import Mentions from './src/mentions'

Mentions.install = function (app: App): void {
  app.component(Mentions.name!, Mentions)
}

export { Mentions }

export default {
  title: 'Mentions 提及',
  category: '数据录入',
  status: '80%',
  install(app: App): void {
    app.component(Mentions.name!, Mentions)
  },
}
