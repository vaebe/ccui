# 简介

vue3-ccui 是基于 Vue 3 + TypeScript 的组件库，视觉规范对齐 Ant Design v6.3.7。**当前版本 2.0.0**（稳定版），提供 73 个组件 + 完整 i18n（zhCN / enUS / jaJP / koKR）+ ARIA 审计。

升级指南、组件文档与设计 Token 详见 [文档站](https://vaebe.github.io/ccui)。

[从零到一建立属于自己的前端组件库](https://juejin.cn/post/7124487017588588574)

## 快速开始

### 安装

```shell
# NPM
$ npm install @vaebe/ccui --save

# Yarn
$ yarn add @vaebe/ccui

# pnpm
$ pnpm install @vaebe/ccui
```

### 完整引入

```ts
import { createApp } from 'vue'
import ccui from '@vaebe/ccui'
import App from './App.vue'

import './style.css'
import '@vaebe/ccui/style.css'

createApp(App).use(ccui).mount('#app')
```
