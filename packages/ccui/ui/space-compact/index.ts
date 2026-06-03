import type { App } from 'vue'
import SpaceCompact from './src/space-compact'

SpaceCompact.install = function (app: App): void {
  app.component(SpaceCompact.name!, SpaceCompact)
}

export { SpaceCompact }

export type { SpaceCompactDirection, SpaceCompactProps, SpaceCompactSize } from './src/space-compact-types'

export default {
  title: 'SpaceCompact 紧凑组合',
  category: '布局',
  status: '90%',
  install(app: App): void {
    app.component(SpaceCompact.name!, SpaceCompact)
  },
}
