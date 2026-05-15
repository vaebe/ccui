import type { App } from 'vue'
import DropdownButton from './src/dropdown-button'

DropdownButton.install = function (app: App): void {
  app.component(DropdownButton.name!, DropdownButton)
}

export { DropdownButton }

export type { DropdownButtonProps } from './src/dropdown-button-types'

export default {
  title: 'DropdownButton 下拉按钮',
  category: '通用',
  status: '90%',
  install(app: App): void {
    app.component(DropdownButton.name!, DropdownButton)
  },
}
