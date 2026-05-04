import type { App } from 'vue'
import message from './src/message'

export { message }
export const Message = message

export default {
  title: 'Message 全局提示',
  category: '反馈',
  status: '100%',
  install(app: App): void {
    app.config.globalProperties.$message = message
  },
}
