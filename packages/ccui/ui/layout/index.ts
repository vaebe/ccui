import type { App } from 'vue'
import { Content, Footer, Header, Layout, Sider } from './src/layout'

const components = [Layout, Header, Footer, Content, Sider]

;(Layout as any).install = function (app: App): void {
  components.forEach((c) => app.component((c as any).name, c))
}

export { Content, Footer, Header, Layout, Sider }

export default {
  title: 'Layout 布局',
  category: '布局',
  status: '100%',
  install(app: App): void {
    components.forEach((c) => app.component((c as any).name, c))
  },
}
