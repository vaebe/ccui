import vueJsx from '@vitejs/plugin-vue-jsx'
import { viteDemoPreviewPlugin } from '@vitepress-code-preview/plugin'
import { defineConfig } from 'vite'

import svgLoader from 'vite-svg-loader'

export default defineConfig({
  plugins: [viteDemoPreviewPlugin(), vueJsx(), svgLoader()],
})
