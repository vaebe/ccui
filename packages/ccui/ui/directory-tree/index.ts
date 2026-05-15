import type { App } from 'vue'
import DirectoryTree from './src/directory-tree'

DirectoryTree.install = function (app: App): void {
  app.component(DirectoryTree.name!, DirectoryTree)
}

export { DirectoryTree }

export type { DirectoryTreeExpandAction, DirectoryTreeProps } from './src/directory-tree-types'

export default {
  title: 'DirectoryTree 目录树',
  category: '数据展示',
  status: '90%',
  install(app: App): void {
    app.component(DirectoryTree.name!, DirectoryTree)
  },
}
