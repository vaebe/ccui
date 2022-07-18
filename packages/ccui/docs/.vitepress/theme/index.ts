import Theme from 'vitepress/theme';
import './styles/index.scss';
import 'vitepress-theme-demoblock/theme/styles/index.css';
import { registerComponents } from './register-components.js';
import ccui from '../../../ui/ccui';

export default {
  ...Theme,
  enhanceApp({ app }) {
    app.use(ccui);
    registerComponents(app);
  }
};
