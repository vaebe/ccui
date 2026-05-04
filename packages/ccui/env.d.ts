declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, unknown>
  export default component
}

declare module '*.scss'
declare module '*.css'
declare module '*.svg'
declare module 'virtual:uno.css'
declare module '@vitepress-code-preview/container/dist/style.css'
