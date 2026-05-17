import type { EnhanceAppContext } from 'vitepress'
import DemoPreview, { useComponents } from '@vitepress-code-preview/container'
import DefaultTheme from 'vitepress/theme'
import ccui from '@vaebe/ccui/ui/vue-ccui'
import IconShowcase from './components/IconShowcase.vue'
import './styles/index.css'
import '@vitepress-code-preview/container/dist/style.css'
import 'virtual:uno.css'

export default {
  ...DefaultTheme,
  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp(ctx)

    ctx.app.use(ccui as Parameters<typeof ctx.app.use>[0])
    ctx.app.component('IconShowcase', IconShowcase)

    useComponents(ctx.app, DemoPreview)
  },
}
