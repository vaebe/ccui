import Theme from 'vitepress/theme';
import './styles/index.scss';
import 'vitepress-theme-demoblock/theme/styles/index.css';
import { registerComponents } from './register-components.js';
import vue_ui from '../../../ui/vue-ccui';

export default {
  ...Theme,
  enhanceApp({ app }) {
    app.use(vue_ui);
    registerComponents(app);
  }
};
