import nav from './nav';
import markdown from './markdown';
import sidebar from './sidebar';

export default {
  lang: 'en-US',
  title: 'vue-cc-ui',
  description: ' vue-cc-ui 组件库',
  lastUpdated: true,
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],
  markdown,
  themeConfig: {
    sidebar,
    nav,
    logo: '/logo.svg'
  }
};
