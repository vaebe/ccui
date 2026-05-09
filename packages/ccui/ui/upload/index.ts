import type { App } from 'vue'
import Upload from './src/upload'

Upload.install = function (app: App): void {
  app.component(Upload.name!, Upload)
}

export { Upload }

export default {
  title: 'Upload 上传',
  category: '数据录入',
  status: '80%',
  install(app: App): void {
    app.component(Upload.name!, Upload)
  },
}
