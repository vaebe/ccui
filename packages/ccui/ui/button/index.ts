import type { App } from 'vue'
import Button from './src/button'
import ButtonGroup from './src/button-group'

// 把 Group 作为静态属性挂到 Button 上，对齐 Ant Design 的 `Button.Group` 命名空间用法
type ButtonWithGroup = typeof Button & {
  Group: typeof ButtonGroup
  install: (app: App) => void
}

const ButtonInstall = Button as ButtonWithGroup
ButtonInstall.Group = ButtonGroup

ButtonInstall.install = function (app: App): void {
  app.component(Button.name!, Button)
  app.component(ButtonGroup.name!, ButtonGroup)
}

export { ButtonInstall as Button, ButtonGroup }

export type {
  ButtonColor,
  ButtonGroupProps,
  ButtonIconPosition,
  ButtonLoading,
  ButtonLoadingObject,
  ButtonNativeType,
  ButtonProps,
  ButtonShape,
  ButtonSizeType,
  ButtonType,
  ButtonVariant,
} from './src/button-types'

export default {
  title: 'Button 按钮',
  category: '通用',
  status: '100%',
  install(app: App): void {
    app.component(Button.name!, Button)
    app.component(ButtonGroup.name!, ButtonGroup)
  },
}
