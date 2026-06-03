import type { App } from 'vue'
import CheckableTag from './src/checkable-tag'
import CheckableTagGroup from './src/checkable-tag-group'

const install = (app: App): void => {
  app.component(CheckableTag.name!, CheckableTag)
  app.component(CheckableTagGroup.name!, CheckableTagGroup)
}

CheckableTag.install = install

export { CheckableTag, CheckableTagGroup }

export type {
  CheckableTagGroupContext,
  CheckableTagGroupProps,
  CheckableTagOption,
  CheckableTagProps,
  CheckableTagSize,
  CheckableTagValue,
} from './src/checkable-tag-types'

export { checkableTagGroupInjectionKey } from './src/checkable-tag-types'

export default {
  title: 'CheckableTag 可勾选标签',
  category: '通用',
  status: '90%',
  install,
}
