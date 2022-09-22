# 简介
[从零到一建立属于自己的前端组件库](https://juejin.cn/post/7124487017588588574)

## 快速开始
### 安装
```shell
# NPM
$ npm install vue3-ccui --save

# Yarn
$ yarn add vue3-ccui

# pnpm
$ pnpm install vue3-ccui
```

### 完整引入
```ts
import {createApp} from 'vue'
import './style.css'
import App from './App.vue'

import ccui from 'vue3-ccui'
import 'vue3-ccui/style.css'

createApp(App).use(ccui).mount('#app')
```
