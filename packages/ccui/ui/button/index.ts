import type { App } from 'vue'
import Button from './src/button'
import ButtonGroup from './src/button-group'

// 平铺导出：模板用 <c-button-group>，TSX 用 import { ButtonGroup }
// 不做 React 风格的 Button.Group 静态属性挂载（详见 docs-notes/roadmap.md「对标原则」节）
Button.install = function (app: App): void {
  app.component(Button.name!, Button)
  app.component(ButtonGroup.name!, ButtonGroup)
}

export { Button, ButtonGroup }

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
