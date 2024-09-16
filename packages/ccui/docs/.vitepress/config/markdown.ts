import { demoBlockPlugin } from 'vitepress-theme-demoblock'

const markdown = {
  config: (md) => {
    md.use(demoBlockPlugin, {
      cssPreprocessor: 'scss',
    })
  },
}
export default markdown
