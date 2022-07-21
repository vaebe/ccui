# 简介
## 版本
+ vue3-ccui 目前还处于快速开发迭代中。

## 使用包管理器
```shell
# NPM
$ npm install vue3-ccui --save

# Yarn
$ yarn add vue3-ccui

# pnpm
$ pnpm install vue3-ccui
```

## 浏览器直接引入
```html
<head>
  <!-- 导入样式 -->
  <link
      rel="stylesheet"
      href="https://unpkg.com/vue3-ccui/style.css"
  />
  <!-- 导入 Vue 3 -->
  <script src="//cdn.jsdelivr.net/npm/vue@next"></script>
  <!-- 导入组件库 -->
  <script src="https://unpkg.com/vue3-ccui"></script>
</head>

<script>
  const App = {
    data() {
      return {
        message: "Hello vue3-ccui",
      };
    },
  };
  const app = Vue.createApp(App);
  app.use(VueCcui.default);
  app.mount("#app");
</script>
```

## 快速开始
### 完整引入
```ts
import {createApp} from 'vue'
import './style.css'
import App from './App.vue'

import ccui from 'vue3-ccui'
import 'vue3-ccui/style.css'

createApp(App).use(ccui).mount('#app')
```
