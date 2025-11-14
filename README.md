# Vue3-CCUI

[![npm version](https://img.shields.io/npm/v/vue3-ccui.svg)](https://www.npmjs.com/package/vue3-ccui)
[![license](https://img.shields.io/npm/l/vue3-ccui.svg)](https://github.com/vaebe/ccui/blob/main/LICENSE)
[![downloads](https://img.shields.io/npm/dt/vue3-ccui.svg)](https://www.npmjs.com/package/vue3-ccui)

一个基于 Vue 3 + TypeScript + Vite 构建的现代化 UI 组件库。

## ✨ 特性

- 🚀 基于 Vue 3 Composition API
- 💪 使用 TypeScript 开发，提供完整的类型定义
- ⚡ 使用 Vite 构建，快速的开发体验
- 📦 支持按需引入，减小包体积
- 🎨 现代化的设计风格
- 🔧 完善的开发工具链

## 📦 安装

```bash
# NPM
npm install vue3-ccui --save

# Yarn
yarn add vue3-ccui

# pnpm
pnpm install vue3-ccui
```

## 🚀 快速开始

### 完整引入

```ts
import { createApp } from 'vue'
import ccui from 'vue3-ccui'
import App from './App.vue'

import './style.css'
import 'vue3-ccui/style.css'

createApp(App).use(ccui).mount('#app')
```

### 按需引入

```ts
import { createApp } from 'vue'
import { Button, Card } from 'vue3-ccui'
import App from './App.vue'

import 'vue3-ccui/style.css'

const app = createApp(App)
app.use(Button)
app.use(Card)
app.mount('#app')
```

## 📚 组件

目前包含以下组件：

- **Avatar** - 头像
- **Button** - 按钮
- **Button3D** - 3D 按钮
- **Calendar** - 日历
- **Card** - 卡片
- **CheckBox** - 复选框
- **Divider** - 分割线
- **Popover** - 气泡卡片
- **Radio** - 单选框
- **Rate** - 评分
- **Status** - 状态
- **Tabs** - 标签页
- **Timeline** - 时间线
- **Tooltip** - 文字提示
- **Tree** - 树形控件

## 📖 文档

访问 [在线文档](https://vaebe.github.io/ccui/) 查看详细的组件使用说明和示例。

## 🛠️ 开发

```bash
# 克隆项目
git clone https://github.com/vaebe/ccui.git

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建文档
pnpm docs:build

# 运行测试
pnpm --filter vue3-ccui test

# 代码检查
pnpm lint
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[Apache-2.0](./LICENSE)

## 🔗 相关链接

- [GitHub](https://github.com/vaebe/ccui)
- [NPM](https://www.npmjs.com/package/vue3-ccui)
- [在线文档](https://vaebe.github.io/ccui/)
