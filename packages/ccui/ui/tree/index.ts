import type { App } from 'vue';
import Tree from './src/tree';

// 作为插件引入
Tree.install = function (app: App): void {
  app.component(Tree.name, Tree);
};

export { Tree };

// 按需
export default {
  title: 'Tree 树',
  category: '数据展示',
  status: '20%',
  install(app: App): void {
    app.component(Tree.name, Tree);
  }
};
