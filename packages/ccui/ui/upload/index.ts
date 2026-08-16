import type { App } from 'vue'
import Upload from './src/upload'

Upload.install = function (app: App): void {
  app.component(Upload.name!, Upload)
}

export { Upload }

/** Upload 的公开文件、请求与拒收原因类型。 */
export type {
  BeforeUpload,
  CustomRequest,
  CustomRequestOptions,
  UploadFile,
  UploadDefaultStatus,
  UploadListType,
  UploadProps,
  UploadRejectReason,
  UploadRequestHandle,
  UploadStatus,
} from './src/upload-types'

export default {
  title: 'Upload 上传',
  category: '数据录入',
  status: '80%',
  install(app: App): void {
    app.component(Upload.name!, Upload)
  },
}
