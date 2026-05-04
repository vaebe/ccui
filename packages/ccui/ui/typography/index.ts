import type { App } from 'vue'
import { Link, Paragraph, Text, Title, Typography } from './src/typography'

const components = [Typography, Text, Paragraph, Title, Link]

;(Typography as any).install = function (app: App): void {
  components.forEach(c => app.component((c as any).name, c))
}

export { Link, Paragraph, Text, Title, Typography }

export default {
  title: 'Typography 排版',
  category: '通用',
  status: '100%',
  install(app: App): void {
    components.forEach(c => app.component((c as any).name, c))
  },
}
