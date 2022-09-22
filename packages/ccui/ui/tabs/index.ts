import type { App } from 'vue';
import Tabs from './src/tabs';
import Tab from './src/components/tab/tab';

Tabs.install = function (app: App): void {
  app.component(Tabs.name, Tabs);
  app.component(Tab.name, Tab);
};

export { Tabs, Tab };

export default {
  title: 'Tabs 选项卡',
  category: '导航',
  status: undefined, // TODO: 组件若开发完成则填入"100%"，并删除该注释
  install(app: App): void {
    app.component(Tabs.name, Tabs);
    app.component(Tab.name, Tab);
  }
};
