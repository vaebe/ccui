import Theme from 'vitepress/theme';
import './styles/vars.css';
import { registerComponents } from './register-components.js';
import CardInstall from '../../../ui/card/index';

export default {
  ...Theme,
  enhanceApp({ app }) {
    app.use(CardInstall);
    registerComponents(app);
  }
};