import type { App } from 'vue'
import Textarea from './src/textarea'

Textarea.install = function (app: App): void {
  app.component(Textarea.name!, Textarea)
}

export { Textarea }

export type {
  TextareaAllowClear,
  TextareaAllowClearObject,
  TextareaAutoSize,
  TextareaAutoSizeObject,
  TextareaProps,
  TextareaShowCount,
  TextareaShowCountObject,
  TextareaSize,
  TextareaStatus,
} from './src/textarea-types'

export default {
  title: 'Textarea 多行文本',
  category: '数据录入',
  status: '80%',
  install(app: App): void {
    app.component(Textarea.name!, Textarea)
  },
}
