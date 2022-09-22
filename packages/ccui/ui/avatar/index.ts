import type { App } from 'vue';
import Avatar from './src/avatar';

Avatar.install = function (app: App): void {
  app.component(Avatar.name, Avatar);
};

export { Avatar };

export default {
  title: 'Avatar 头像',
  category: '数据展示',
  status: '100%', // TODO: 组件若开发完成则填入"100%"，并删除该注释
  install(app: App): void {
    app.component(Avatar.name, Avatar);
  }
};
