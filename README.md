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
import { createApp } from 'vue'
import ccui from 'vue3-ccui'
import App from './App.vue'

import './style.css'
import 'vue3-ccui/style.css'

createApp(App).use(ccui).mount('#app')
```

## todo

- 迁移组件 测试用例 更新为 vitest
