# 简介

## 版本

- 当前版本：**2.0.0**（稳定版）。
- 视觉规范对齐 [Ant Design v6.3.7](https://ant.design)，主题 Token 已按官方默认 Seed/Map Token 实现。
- 提供完整 i18n 体系：内置 `zhCN` / `enUS` / `jaJP` / `koKR` 四个语言包，配合 ConfigProvider 切换。

## v2.0.0 升级指南

2.0 在 beta 阶段补齐了基础组件的 API 命名与视觉协议。升级时需要关注：

### 命名变更（旧名保留为 deprecated 别名，运行时仍可用）

| 组件        | 旧名                                                                   | 新名                                                                                       |
| ----------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Modal       | `okLoading` / `hideFooter`                                             | `confirmLoading` / `footer`                                                                |
| Drawer      | `showFooter`                                                           | `footer`                                                                                   |
| Tooltip     | `content` / `showArrow` / `showAfter` / `hideAfter` / `popperClass`    | `title` / `arrow` / `mouseEnterDelay` / `mouseLeaveDelay` / `overlayClassName`             |
| Popover     | `showArrow` / `showAfter` / `hideAfter` / `popperClass` / `teleported` | `arrow` / `mouseEnterDelay` / `mouseLeaveDelay` / `overlayClassName` / `getPopupContainer` |
| Popconfirm  | `confirmText` / `confirmType`                                          | `okText` / `okType`                                                                        |
| Button      | `nativeType` / `round` / `circle` / `plain`                            | `htmlType` / `shape='round'` / `shape='circle'` / `variant`                                |
| Input       | `clearable` / `prepend` / `append`                                     | `allowClear` / `addonBefore` / `addonAfter`                                                |
| InputNumber | `size='lg'` / `'md'` / `'sm'`                                          | `size='large'` / `'default'` / `'small'`                                                   |
| Tag         | `bordered`                                                             | `variant='outlined' \| 'filled'`                                                           |
| ColorPicker | `format='hsv'`                                                         | `format='hsb'`                                                                             |
| FormItem    | `prop`                                                                 | `name`                                                                                     |

旧名在 dev mode 触发一次性 `console.warn`，prod 静默。下一大版本（v3.0）将移除旧名。

### 数据协议变更（breaking）

- **Calendar** `modelValue` 由原生 `Date` 改为接受 `string | Date | number | Dayjs | null`，新增 `format`（默认 `'YYYY-MM-DD'`）与 `valueFormat`（`'string' | 'date' | 'number'`，默认 `'string'`）。原有 `Date` 输入仍兼容，但 emit 默认改为字符串；显式传 `value-format="date"` 可保留 Date 出参。

### 视觉与心智

- 基础组件 API 命名已统一切到 Ant Design 协议（`title` / `htmlType` / `allowClear` 等），同时保留 Element Plus 风格命名作为 deprecated 兼容层。浮层组件 `v-model:visible` / `closeOnEsc` / `appendToBody` 保持 Vue 圈惯例命名。
- 复杂组件（DatePicker / RangePicker / Cascader / Tree / TreeSelect / Upload 等）从 v2 首版即为 Ant 协议，无旧名包袱。
- 全量 ARIA + 键盘审计已覆盖 30+ 组件，提升 screen reader 与键盘用户体验。

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
