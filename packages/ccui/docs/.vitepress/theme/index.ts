import DefaultTheme from 'vitepress/theme'
import ccui from '../../../ui/vue-ccui'
import { useComponents } from './useComponents'
import 'vitepress-theme-demoblock/dist/theme/styles/index.css'
import './styles/index.scss'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx)
    ctx.app.use(ccui)
    useComponents(ctx.app)
  },
}
