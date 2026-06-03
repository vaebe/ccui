import type { App } from 'vue'
import Transfer from './src/transfer'

Transfer.install = function (app: App): void {
  app.component(Transfer.name!, Transfer)
}

export { Transfer }

export default {
  title: 'Transfer 穿梭框',
  category: '数据录入',
  status: '80%',
  install(app: App): void {
    app.component(Transfer.name!, Transfer)
  },
}
