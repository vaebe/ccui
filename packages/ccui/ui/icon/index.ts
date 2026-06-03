import type { App } from 'vue'
import Icon from './src/icon'
import { clearIconRegistry, registerIcon, resolveIcon, unregisterIcon } from './src/icon-registry'

export { addAPIProvider, addCollection, addIcon, loadIcon, loadIcons } from '@iconify/vue'

Icon.install = function (app: App): void {
  app.component(Icon.name!, Icon)
}

export { clearIconRegistry, Icon, registerIcon, resolveIcon, unregisterIcon }

export default {
  title: 'Icon 图标',
  category: '通用',
  status: '100%',
  install(app: App): void {
    app.component(Icon.name!, Icon)
  },
}
