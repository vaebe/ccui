import DemoPreview, { useComponents } from '@vitepress-code-preview/container'
import DefaultTheme from 'vitepress/theme'
import ccui from '../../../ccui/ui/vue-ccui'
import './styles/index.css'
import '@vitepress-code-preview/container/dist/style.css'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx)

    ctx.app.use(ccui)

    useComponents(ctx.app, DemoPreview)
  },
}
