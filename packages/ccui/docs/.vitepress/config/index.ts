import nav from './nav';
import markdown from './markdown';
import sidebar from './sidebar';

export default {
  base: '/ccui/',
  lang: 'en-US',
  title: 'vue3-ccui',
  description: 'vue3-ccui 组件库',
  lastUpdated: true,
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],
  markdown,
  themeConfig: {
    sidebar,
    nav,
    logo: '/logo.svg'
  }
};
