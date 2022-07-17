import nav from './nav';
import markdown from './markdown';
import {defineConfig} from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  title: 'vue-cc-ui',
  description: ' vue-cc-ui 组件库',
  lastUpdated: true,
  head: [
    ['link', {rel: 'icon', type: 'image/svg+xml', href: '/logo.svg'}],
  ],
  markdown,
  themeConfig: {
    nav,
    logo: '/logo.svg'
  }
})
