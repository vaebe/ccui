import type { App } from 'vue'
import Button3d from './src/button-3d'

Button3d.install = function (app: App): void {
  app.component(Button3d.name!, Button3d)
}

export { Button3d }
export type { Button3dProps, Button3DNativeType, Button3DSizeType, Button3DType } from './src/button-3d-types'

export default {
  title: 'Button3d 按钮',
  category: '通用',
  status: '100%',
  install(app: App): void {
    app.component(Button3d.name!, Button3d)
  },
}
