import type { App } from 'vue'
import ErrorBoundary from './src/error-boundary'

ErrorBoundary.install = function (app: App): void {
  app.component(ErrorBoundary.name!, ErrorBoundary)
}

export { ErrorBoundary }

export type { ErrorBoundaryProps } from './src/error-boundary-types'

export default {
  title: 'ErrorBoundary 错误边界',
  category: '反馈',
  status: '90%',
  install(app: App): void {
    app.component(ErrorBoundary.name!, ErrorBoundary)
  },
}
