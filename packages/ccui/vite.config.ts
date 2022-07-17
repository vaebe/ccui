import { defineConfig } from 'vite';

// jsx 依赖
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  plugins: [vueJsx()],
  test: {
    globals: true,
    environment: 'jsdom',
    transformMode: {
      web: [/.[tj]sx$/]
    }
  }
});
