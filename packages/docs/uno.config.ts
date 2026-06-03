import { defineConfig } from 'unocss'

export default defineConfig({
  // 强化默认 pipeline 排除：避免扫到 node_modules 嵌套深层 .d.ts（@iconify-icons/mdi
  // 上千个 icon 各自带 .d.ts，UnoCSS transformers:post 阶段并发 open 直接撞 EMFILE）。
  // 同时排掉构建中间产物（.vitepress/cache、dist、build）避免重复扫。
  content: {
    pipeline: {
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/.vitepress/cache/**',
        '**/.vitepress/dist/**',
        '**/coverage/**',
      ],
    },
  },
})
