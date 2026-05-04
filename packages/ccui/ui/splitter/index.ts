import type { App } from 'vue'
import { Panel, Splitter } from './src/splitter'

;(Splitter as any).install = function (app: App): void {
  app.component((Splitter as any).name, Splitter)
  app.component((Panel as any).name, Panel)
}

export { Panel, Splitter }

export default {
  title: 'Splitter 分隔面板',
  category: '布局',
  status: '100%',
  install(app: App): void {
    app.component((Splitter as any).name, Splitter)
    app.component((Panel as any).name, Panel)
  },
}
