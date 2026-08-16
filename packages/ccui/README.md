# 简介

vue3-ccui 是基于 Vue 3 + TypeScript 的现代组件库，提供完整 Design Token 系统与工业级视觉规范。文档站覆盖七大类 83 个组件 / 工具与主题指南入口，内置完整 i18n（zhCN / enUS / jaJP / koKR）与 ARIA 审计。

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
$ pnpm add @vaebe/ccui
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
