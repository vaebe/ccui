import type { App } from 'vue'
import InputOtp from './src/input-otp'

InputOtp.install = function (app: App): void {
  app.component(InputOtp.name!, InputOtp)
}

export { InputOtp }

export type { InputOtpFormatter, InputOtpProps, InputOtpSize, InputOtpStatus } from './src/input-otp-types'

export default {
  title: 'InputOtp 一次性密码',
  category: '数据录入',
  status: '85%',
  install(app: App): void {
    app.component(InputOtp.name!, InputOtp)
  },
}
