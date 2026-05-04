import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  plugins: [vue(), vueJsx()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
