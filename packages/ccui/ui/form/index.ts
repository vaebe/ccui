import type { App } from 'vue'
import Form from './src/form'
import FormItem from './src/form-item'
import FormList from './src/form-list'
import FormProvider from './src/form-provider'

const FormInstall = Form as typeof Form & { install: (app: App) => void }

FormInstall.install = function (app: App): void {
  app.component(Form.name!, Form)
  app.component(FormItem.name!, FormItem)
  app.component(FormList.name!, FormList)
  app.component(FormProvider.name!, FormProvider)
}

export { Form, FormItem, FormList, FormProvider }
export type {
  FormChangeInfo,
  FormFinishInfo,
  FormInstance,
  FormLayout,
  FormListField,
  FormListOperation,
  FormNamePath,
  FormRequiredMark,
  FormRule,
  FormRules,
  FormValidateError,
  FormValidateMessages,
  FormValidateTrigger,
} from './src/form-types'

export default {
  title: 'Form 表单',
  category: '数据录入',
  status: '95%',
  install(app: App): void {
    app.component(Form.name!, Form)
    app.component(FormItem.name!, FormItem)
    app.component(FormList.name!, FormList)
    app.component(FormProvider.name!, FormProvider)
  },
}
