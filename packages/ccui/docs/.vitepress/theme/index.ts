import DefaultTheme from 'vitepress/theme';
import 'vitepress-theme-demoblock/dist/theme/styles/index.css';
import './styles/index.scss';
import { useComponents } from './useComponents.js';
import ccui from '../../../ui/vue-ccui';

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
    ctx.app.use(ccui);
    useComponents(ctx.app);
  }
};
