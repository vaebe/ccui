import type { App } from 'vue'
import InputSearch from './src/input-search'

InputSearch.install = function (app: App): void {
  app.component(InputSearch.name!, InputSearch)
}

export { InputSearch }

export type { InputSearchEnterButton, InputSearchProps } from './src/input-search-types'

export default {
  title: 'InputSearch 搜索框',
  category: '数据录入',
  status: '80%',
  install(app: App): void {
    app.component(InputSearch.name!, InputSearch)
  },
}
