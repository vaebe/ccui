import type { App } from 'vue'
import { ConfigProvider, useConfig } from './src/config-provider'

;(ConfigProvider as any).install = function (app: App): void {
  app.component((ConfigProvider as any).name, ConfigProvider)
}

export { ConfigProvider, useConfig }

export default {
  title: 'ConfigProvider 全局配置',
  category: '其他',
  status: '100%',
  install(app: App): void {
    app.component((ConfigProvider as any).name, ConfigProvider)
  },
}
