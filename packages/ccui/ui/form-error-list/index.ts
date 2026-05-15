import type { App } from 'vue'
import FormErrorList from './src/form-error-list'

FormErrorList.install = function (app: App): void {
  app.component(FormErrorList.name!, FormErrorList)
}

export { FormErrorList }

export type { FormErrorListProps, FormErrorListStatus } from './src/form-error-list-types'

export default {
  title: 'FormErrorList 表单错误列表',
  category: '数据录入',
  status: '90%',
  install(app: App): void {
    app.component(FormErrorList.name!, FormErrorList)
  },
}
