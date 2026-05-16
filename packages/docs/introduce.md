# 简介

## 版本

- vue3-ccui 目前还处于开发迭代中。
- 视觉规范对齐 [Ant Design v6.3.7](https://ant.design)，主题 Token 已按官方默认 Seed/Map Token 实现。

## 主题 Token

| Token         | 默认值                        |
| ------------- | ----------------------------- |
| colorPrimary  | `#1677ff`                     |
| colorSuccess  | `#52c41a`                     |
| colorWarning  | `#faad14`                     |
| colorError    | `#ff4d4f`                     |
| colorInfo     | `#1677ff`                     |
| borderRadius  | `6px`（large 8 / small 4）    |
| fontSize      | `14px`（行高 1.5714）         |
| controlHeight | `32px`（large 40 / small 24） |

CSS 变量同时挂载到 `:root` 和 SCSS 变量 fallback，可直接通过 `var(--ccui-color-primary)` 等方式消费；切换到 `.dark` 类即可启用暗色主题。

## 使用包管理器

```shell
# NPM
$ npm install @vaebe/ccui --save

# Yarn
$ yarn add @vaebe/ccui

# pnpm
$ pnpm install @vaebe/ccui
```

## 浏览器直接引入

```html
<head>
  <!-- 导入样式 -->
  <link rel="stylesheet" href="https://unpkg.com/@vaebe/ccui/style.css" />
  <!-- 导入 Vue 3 -->
  <script src="//cdn.jsdelivr.net/npm/vue@next"></script>
  <!-- 导入组件库 -->
  <script src="https://unpkg.com/@vaebe/ccui"></script>
</head>

<script>
  const App = {
    data() {
      return {
        message: 'Hello vue3-ccui',
      }
    },
  }
  const app = Vue.createApp(App)
  app.use(VueCcui.default)
  app.mount('#app')
</script>
```

## 快速开始

### 完整引入

```ts
import { createApp } from 'vue'
import ccui from '@vaebe/ccui'
import App from './App.vue'

import './style.css'
import '@vaebe/ccui/style.css'

createApp(App).use(ccui).mount('#app')
```
