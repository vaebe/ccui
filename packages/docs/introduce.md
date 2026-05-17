# 简介

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

### 按需引入

搭配 [`unplugin-vue-components`](https://github.com/unplugin/unplugin-vue-components) 与官方 resolver 包 `@vaebe/unplugin-vue-components-ccui`，模板里直接写 `<c-button>` 即可，组件代码与样式由插件按需注入，未使用的组件会被 tree-shake。

```bash
pnpm add @vaebe/ccui
pnpm add -D @vaebe/unplugin-vue-components-ccui unplugin-vue-components
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { Vue3CCUIResolver } from '@vaebe/unplugin-vue-components-ccui'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [Vue3CCUIResolver()],
    }),
  ],
})
```

```vue
<template>
  <c-form :model="form">
    <c-form-item label="用户名">
      <c-input v-model="form.username" />
    </c-form-item>
    <c-form-item>
      <c-button type="primary" @click="submit">提交</c-button>
    </c-form-item>
  </c-form>
</template>
```

Webpack / Rspack / Rollup / esbuild 把 `Vue3CCUIResolver()` 注册到对应构建工具的 `Components` 插件 `resolvers` 数组即可，配置方式一致。完整 Options（`importStyle` / `prefix` / `exclude` / `importFrom` / `cssBundlePath`）见 [resolver 包 README](https://github.com/vaebe/ccui/tree/main/packages/resolver#readme)。
