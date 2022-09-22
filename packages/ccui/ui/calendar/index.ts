import type { App } from 'vue';
import Calendar from './src/calendar';

Calendar.install = function (app: App): void {
  app.component(Calendar.name, Calendar);
};

export { Calendar };

export default {
  title: 'Calendar 日历',
  category: '数据展示',
  status: '100%',
  install(app: App): void {
    app.component(Calendar.name, Calendar);
  }
};
