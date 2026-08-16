import type { App } from 'vue'
import Popover from './src/popover'
export type { PopoverAlign, PopoverEffect, PopoverPlacement, PopoverProps, PopoverTrigger } from './src/popover-types'

Popover.install = function (app: App): void {
  app.component(Popover.name!, Popover)
}

export { Popover }

export default {
  title: 'Popover 弹出框',
  category: '反馈',
  status: '100%',
  install(app: App): void {
    app.component(Popover.name!, Popover)
  },
}
