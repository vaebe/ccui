# 简介
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
