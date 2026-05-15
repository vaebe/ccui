import type { App } from 'vue'
import BadgeRibbon from './src/badge-ribbon'

BadgeRibbon.install = function (app: App): void {
  app.component(BadgeRibbon.name!, BadgeRibbon)
}

export { BadgeRibbon }

export type { BadgeRibbonPlacement, BadgeRibbonProps } from './src/badge-ribbon-types'

export { isRibbonPresetColor } from './src/badge-ribbon-types'

export default {
  title: 'BadgeRibbon 缎带徽标',
  category: '数据展示',
  status: '90%',
  install(app: App): void {
    app.component(BadgeRibbon.name!, BadgeRibbon)
  },
}
