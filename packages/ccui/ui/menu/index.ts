import type { App } from 'vue'
import Menu from './src/menu'

Menu.install = function (app: App): void {
  app.component(Menu.name!, Menu)
}

export { Menu }

export default {
  title: 'Menu 导航菜单',
  category: '导航',
  status: '100%',
  install(app: App): void {
    app.component(Menu.name!, Menu)
  },
}
