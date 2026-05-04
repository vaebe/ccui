import type { App } from 'vue'
import notification from './src/notification'

export { notification }
export const Notification = notification

export default {
  title: 'Notification 通知',
  category: '反馈',
  status: '100%',
  install(app: App): void {
    app.config.globalProperties.$notification = notification
  },
}
