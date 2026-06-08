import vueJsx from '@vitejs/plugin-vue-jsx'
import { viteDemoPreviewPlugin } from '@vitepress-code-preview/plugin'
import UnoCSS from 'unocss/vite'
import type { PluginOption } from 'vite'
import { defineConfig } from 'vite-plus'

import svgLoader from 'vite-svg-loader'

export default defineConfig({
  // vueJsx 内置的 @vitejs/plugin-vue 把 vite peer 浮动到了 vite-plus-core@0.1.21，
  // 与 defineConfig 期望的 0.1.20 Plugin 类型族冲突，触发 TS2321 堆栈过深。
  // 归一到 vite 导出的 PluginOption（= core 0.1.20）即可，其余插件保持类型推断。
  plugins: [viteDemoPreviewPlugin(), vueJsx() as PluginOption, svgLoader(), UnoCSS()],
})
