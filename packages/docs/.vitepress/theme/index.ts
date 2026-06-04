import type { EnhanceAppContext } from 'vitepress'
import DemoPreview, { useComponents } from '@vitepress-code-preview/container'
import DefaultTheme from 'vitepress/theme'
import ccui from '@vaebe/ccui/ui/vue-ccui'
import IconShowcase from './components/IconShowcase.vue'
import { setupDemoDarkToggle } from './demoDarkToggle'
import './styles/index.css'
// 暗色主题：从 workspace 源码 (@vaebe/ccui-theme) 引入，规则用 `.dark`
// 选择器作用域，与 VitePress 默认 html.dark 切换约定一致；替代了之前从
// unpkg 拉的远程 CSS（无 SRI、易与 workspace 源码版本错位）。
import '@vaebe/ccui-theme/darkTheme.css'
import '@vitepress-code-preview/container/dist/style.css'
import 'virtual:uno.css'

export default {
  ...DefaultTheme,
  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp(ctx)

    ctx.app.use(ccui as Parameters<typeof ctx.app.use>[0])
    ctx.app.component('IconShowcase', IconShowcase)

    useComponents(ctx.app, DemoPreview)

    // 仅客户端：给每个 demo 容器注入「浅色 / 深色」就地切换按钮。
    // VitePress SSR 阶段 enhanceApp 也会跑，用浏览器环境守卫；
    // 内部再用 MutationObserver 兜住路由切换后新渲染的 demo。
    if (typeof window !== 'undefined') setupDemoDarkToggle()
  },
}
