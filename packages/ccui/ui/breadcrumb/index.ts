import type { App } from 'vue'
import { Breadcrumb, BreadcrumbItem } from './src/breadcrumb'

;(Breadcrumb as any).install = function (app: App): void {
  app.component((Breadcrumb as any).name, Breadcrumb)
  app.component((BreadcrumbItem as any).name, BreadcrumbItem)
}

export { Breadcrumb, BreadcrumbItem }

export default {
  title: 'Breadcrumb 面包屑',
  category: '导航',
  status: '100%',
  install(app: App): void {
    app.component((Breadcrumb as any).name, Breadcrumb)
    app.component((BreadcrumbItem as any).name, BreadcrumbItem)
  },
}
