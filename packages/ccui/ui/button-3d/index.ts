import type { App } from 'vue'
import Button3d from './src/button-3d'

export { Button3d }

export default {
  install(app: App) {
    app.component(Button3d.name, Button3d)
  },
}
