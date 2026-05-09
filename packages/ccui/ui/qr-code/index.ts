import type { App } from 'vue'
import QRCode from './src/qr-code'

QRCode.install = function (app: App): void {
  app.component(QRCode.name!, QRCode)
}

export { QRCode }

export default {
  title: 'QRCode 二维码',
  category: '数据展示',
  status: '80%',
  install(app: App): void {
    app.component(QRCode.name!, QRCode)
  },
}
