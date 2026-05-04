# Vue3-CCUI

[![npm version](https://img.shields.io/npm/v/vue3-ccui.svg)](https://www.npmjs.com/package/vue3-ccui)
[![license](https://img.shields.io/npm/l/vue3-ccui.svg)](https://github.com/vaebe/ccui/blob/main/LICENSE)
[![downloads](https://img.shields.io/npm/dt/vue3-ccui.svg)](https://www.npmjs.com/package/vue3-ccui)

一个基于 Vue 3 + TypeScript + [Vite+](https://viteplus.dev/) 构建的现代化 UI 组件库。

## ✨ 特性

- 🚀 基于 Vue 3 Composition API
- 💪 使用 TypeScript 开发，提供完整的类型定义
- ⚡ Vite 8 + Rolldown 构建，OXC 全链路加速
- 🛠️ 全量接入 Vite+ 工具链：`vp dev / build / test / check / lint / fmt`
- 📦 支持按需引入，减小包体积
- 🎨 视觉规范对齐 Ant Design

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

视觉规范对齐 [Ant Design v6.3.7](https://ant.design)，主题 Token 已按官方默认 Seed/Map Token 实现。

### 通用

- **Button** - 按钮
- **Button3D** - 3D 按钮
- **Status** - 状态
- **Typography** - 排版（Text / Title / Paragraph / Link）

### 布局

- **Divider** - 分割线
- **Flex** - 弹性布局
- **Space** - 间距

### 导航

- **Breadcrumb** - 面包屑
- **Tabs** - 标签页

### 数据录入

- **CheckBox** - 复选框
- **Input** - 输入框
- **InputNumber** - 数字输入框
- **Radio** - 单选框
- **Rate** - 评分
- **Slider** - 滑块
- **Switch** - 开关

### 数据展示

- **Avatar** - 头像
- **Badge** - 徽标数
- **Calendar** - 日历
- **Card** - 卡片
- **Empty** - 空状态
- **Segmented** - 分段控制器
- **Tag** - 标签
- **Timeline** - 时间线
- **Tree** - 树形控件

### 反馈

- **Alert** - 警告提示
- **Popover** - 气泡卡片
- **Progress** - 进度条
- **Result** - 结果
- **Skeleton** - 骨架屏
- **Spin** - 加载中
- **Tooltip** - 文字提示

## 📖 文档

访问 [在线文档](https://vaebe.github.io/ccui/) 查看详细的组件使用说明和示例。

## 🛠️ 开发

> 仓库已接入 [Vite+](https://viteplus.dev/)，需要预先全局安装 `vp`：
>
> ```bash
> npm i -g vp
> ```
>
> 同时要求 Node `>= 22.10`（用于 cli 包的原生 TypeScript type stripping）。

```bash
# 克隆项目
git clone https://github.com/vaebe/ccui.git

# 安装依赖
vp install

# 启动开发服务器（默认跑文档站）
vp run --filter docs dev

# 构建文档
vp run --filter docs docs:build

# 运行测试
vp run --filter vue3-ccui test

# 一站式格式化 + lint + 类型检查
vp check --fix

# 单独格式化（Oxfmt）
vp fmt

# 单独 lint（Oxlint）
vp lint . --fix
```

工具链：

| 能力        | 工具                                                        |
| ----------- | ----------------------------------------------------------- |
| 构建        | Vite 8 + Rolldown                                           |
| 测试        | Vitest 4.1（通过 `vp test`）                                |
| 格式化      | Oxfmt（antfu 风格：单引号、无分号、`trailingComma: 'all'`） |
| Lint        | Oxlint                                                      |
| 类型检查    | tsgolint（在 `vp check` 内串联）                            |
| 文档站      | VitePress 2                                                 |
| Git Hooks   | `vp config` + `.vite-hooks/`（替代 husky）                  |
| Staged 任务 | `vite.config.ts` 的 `staged` 块（替代 lint-staged）         |

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[Apache-2.0](./LICENSE)

## 🔗 相关链接

- [GitHub](https://github.com/vaebe/ccui)
- [NPM](https://www.npmjs.com/package/vue3-ccui)
- [在线文档](https://vaebe.github.io/ccui/)
