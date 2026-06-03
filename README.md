# Vue3-CCUI

[![npm version](https://img.shields.io/npm/v/@vaebe/ccui.svg)](https://www.npmjs.com/package/@vaebe/ccui)
[![license](https://img.shields.io/npm/l/@vaebe/ccui.svg)](https://github.com/vaebe/ccui/blob/main/LICENSE)
[![downloads](https://img.shields.io/npm/dt/@vaebe/ccui.svg)](https://www.npmjs.com/package/@vaebe/ccui)

一个基于 Vue 3 + TypeScript + [Vite+](https://viteplus.dev/) 构建的现代化 UI 组件库。

## ✨ 特性

- 🚀 基于 Vue 3 Composition API
- 💪 使用 TypeScript 开发，提供完整的类型定义
- ⚡ Vite 8 + Rolldown 构建，OXC 全链路加速
- 🛠️ 全量接入 Vite+ 工具链：`vp dev / build / test / check / lint / fmt`
- 📦 支持按需引入，减小包体积
- 🎨 视觉设计致敬 Ant Design，沉淀为一套完整的主题 Token 体系
- 🧩 API 采用 Vue-first 命名（如 `visible` / `closeOnEsc` / `appendToBody`），与 Vue 生态习惯一致

## 📦 安装

```bash
# NPM
npm install @vaebe/ccui --save

# Yarn
yarn add @vaebe/ccui

# pnpm
pnpm install @vaebe/ccui
```

## 🚀 快速开始

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

```ts
import { createApp } from 'vue'
import { Button, Card } from '@vaebe/ccui'
import App from './App.vue'

import '@vaebe/ccui/style.css'

const app = createApp(App)
app.use(Button)
app.use(Card)
app.mount('#app')
```

## 📚 组件

覆盖通用 / 导航 / 反馈 / 数据录入 / 数据展示 / 布局 / 其他七大类，共 **84 个组件 / 工具入口**。**API 命名采用 Vue-first 习惯**（受控显示用 `visible` / `v-model:visible`，而非 React 生态的 `open`），完整命名约定见 [`docs-notes/decisions/benchmark-principles.md`](./docs-notes/decisions/benchmark-principles.md)。

完整组件列表、API 与在线示例见 [📖 在线文档](https://vaebe.github.io/ccui/)。

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
vp run --filter @vaebe/ccui test

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

## 📦 发布

仓库通过根目录的 `scripts/publish.mjs` 一键发布 3 个公开包到 npm（`@vaebe/ccui` / `@vaebe/ccui-icons` / `@vaebe/unplugin-vue-components-ccui`）。

```bash
pnpm release          # 默认 dist-tag=beta
pnpm release:dry      # 走全流程但不真正 publish
node scripts/publish.mjs --tag latest    # 正式发版
```

脚本会自动：

1. 预检 npm 登录态；缺失会引导走 `npm login --auth-type=web`（passkey / Touch ID / WebAuthn）
2. 校验三个发布包版本号一致
3. 按依赖顺序构建：icons → ccui → resolver
4. 顺序 publish；2FA 失败时给出 `[r]` 重登 / `[o]` 兜底输 TOTP / `[x]` 终止三选项
5. 打 git tag `v<version>` 并 push origin

> npm 自 2025-09 起停止接受新的 TOTP 注册，全面推 WebAuthn / passkey。
> 老 TOTP 账号仍可用，发布失败时按 `o` 输 6 位码兜底。
> 详细流程与故障排查见 [`docs-notes/releasing.md`](./docs-notes/releasing.md)。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[Apache-2.0](./LICENSE)

## 🔗 相关链接

- [GitHub](https://github.com/vaebe/ccui)
- [NPM](https://www.npmjs.com/package/@vaebe/ccui)
- [在线文档](https://vaebe.github.io/ccui/)
