import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { demoPreviewPlugin } from '@vitepress-code-preview/plugin'
import { defineConfig } from 'vitepress'
import nav from './config/nav'
import sidebar from './config/sidebar'

const prod = process.env.NODE_ENV === 'production'

export default defineConfig({
  base: prod ? '/ccui/' : '/',
  lang: 'zh-CN',
  title: '@vaebe/ccui',
  description: 'vue3-ccui 组件库',
  vite: {
    resolve: {
      alias: [
        {
          find: /^@vaebe\/ccui$/,
          replacement: fileURLToPath(new URL('../../ccui/ui/vue-ccui.ts', import.meta.url)),
        },
      ],
    },
  },
  lastUpdated: true,
  ignoreDeadLinks: true, // 忽略死链接
  head: [
    // 这里的路径没有被自动更改 手动更改路径
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${prod ? '/ccui/' : '/'}logo.svg` }],
    // darkTheme.css 通过 theme/index.ts 作为 workspace 源码侧引入，不再走
    // unpkg CDN——CDN 既无 SRI 完整性校验、又会和 workspace 源码版本错位。
  ],
  markdown: {
    config(md) {
      const docRoot = fileURLToPath(new URL('../', import.meta.url))
      md.use(demoPreviewPlugin, { docRoot })
    },
  },
  themeConfig: {
    sidebar,
    nav,
    logo: '/logo.svg',
    search: {
      provider: 'algolia',
      options: {
        appId: 'K0NNJA38K6',
        apiKey: '0b6d20552d2073390d2bbb0a84fb49dd',
        indexName: 'ccui',
      },
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/vaebe/ccui.git' }],
    outlineTitle: '快速前往',
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present vaebe',
    },
  },
})
