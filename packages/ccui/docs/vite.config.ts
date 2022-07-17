import { defineConfig } from 'vite';

// jsx 依赖
import vueJsx from '@vitejs/plugin-vue-jsx';
import svgLoader from 'vite-svg-loader';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vueJsx(), svgLoader()]
});
