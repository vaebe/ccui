import { fileURLToPath } from 'node:url'
import { demoPreviewPlugin } from '@vitepress-code-preview/plugin'
import nav from './config/nav'
import sidebar from './config/sidebar'

export default ({ mode }) => {
  const basePath = mode === 'development' ? '/' : '/ccui/'

  return {
    base: basePath,
    lang: 'zh-CN',
    title: 'vue3-ccui',
    description: 'vue3-ccui 组件库',
    lastUpdated: true,
    ignoreDeadLinks: true, // 忽略死链接
    head: [
      // 这里的路径没有被自动更改 手动更改路径
      [
        'link',
        { rel: 'icon', type: 'image/svg+xml', href: `${basePath}logo.svg` },
      ],
      [
        'link',
        {
          rel: 'stylesheet',
          href: 'https://unpkg.com/vue3-ccui/theme/darkTheme.css',
        },
      ],
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
      algolia: {
        appId: 'K0NNJA38K6',
        apiKey: '0b6d20552d2073390d2bbb0a84fb49dd',
        indexName: 'ccui',
      },
      socialLinks: [
        { icon: 'github', link: 'https://github.com/vaebe/ccui.git' },
      ],
      outlineTitle: '快速前往',
      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © 2022-present vaebe',
      },
    },
  }
}
