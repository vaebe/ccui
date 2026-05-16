import type { App } from 'vue'
import UploadDragger from './src/upload-dragger'

UploadDragger.install = function (app: App): void {
  app.component(UploadDragger.name!, UploadDragger)
}

export { UploadDragger }

export default {
  title: 'UploadDragger 拖拽上传',
  category: '数据录入',
  status: '70%',
  install(app: App): void {
    app.component(UploadDragger.name!, UploadDragger)
  },
}
