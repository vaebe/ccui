import nav from './nav';
import markdown from './markdown';
import sidebar from './sidebar';

export default ({ mode }) => {
  const basePath = mode === 'development' ? '/' : '/ccui/';

  return {
    base: basePath,
    lang: 'en-US',
    title: 'vue3-ccui',
    description: 'vue3-ccui 组件库',
    lastUpdated: true,
    ignoreDeadLinks: true, // 忽略死链接
    head: [
      // 这里的路径没有被自动更改 手动更改路径
      [
        'link',
        { rel: 'icon', type: 'image/svg+xml', href: `${basePath}logo.svg` }
      ],
      [
        'link',
        {
          rel: 'stylesheet',
          href: 'https://unpkg.com/vue3-ccui/theme/darkTheme.css'
        }
      ]
    ],
    markdown,
    themeConfig: {
      sidebar,
      nav,
      logo: '/logo.svg',
      socialLinks: [
        { icon: 'github', link: 'https://github.com/vaebe/ccui.git' }
      ],
      outlineTitle: '快速前往',
      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © 2019-present vaebe'
      }
    }
  };
};
