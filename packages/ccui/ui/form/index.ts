import type { App } from 'vue'
import Form from './src/form'
import FormItem from './src/form-item'

const FormInstall = Form as typeof Form & { install: (app: App) => void }

FormInstall.install = function (app: App): void {
  app.component(Form.name!, Form)
  app.component(FormItem.name!, FormItem)
}

export { Form, FormItem }
export type { FormRule, FormRules, FormValidateError, FormValidateTrigger } from './src/form-types'

export default {
  title: 'Form 表单',
  category: '数据录入',
  status: '35%',
  install(app: App): void {
    app.component(Form.name!, Form)
    app.component(FormItem.name!, FormItem)
  },
}
