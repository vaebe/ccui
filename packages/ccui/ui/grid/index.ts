import type { App } from 'vue'
import { Col, Row } from './src/grid'

;(Row as any).install = function (app: App): void {
  app.component((Row as any).name, Row)
  app.component((Col as any).name, Col)
}

export { Col, Row }

export default {
  title: 'Grid 栅格',
  category: '布局',
  status: '100%',
  install(app: App): void {
    app.component((Row as any).name, Row)
    app.component((Col as any).name, Col)
  },
}
