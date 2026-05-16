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
- 🎨 视觉规范对齐 Ant Design

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

视觉规范对齐 [Ant Design v6.3.7](https://ant.design)，主题 Token 已按官方默认 Seed/Map Token 实现。当前已交付 **73 个组件 / 工具入口**，详细覆盖度与剩余项见 [`docs-notes/components-diff/references/components-diff.md`](./docs-notes/components-diff/references/components-diff.md)。

### 通用

- **Button** - 按钮
- **Button3D** - 3D 按钮（项目特色）
- **ConfigProvider** - 全局配置
- **FloatButton** / **BackTop** - 悬浮按钮
- **Icon** - 图标（内置 [Iconify](https://iconify.design/) 200+ 图标集适配）
- **Status** - 状态
- **Typography** - 排版（Text / Title / Paragraph / Link）
- **Util** - 工具集（classNames / debounce / throttle / clamp 等）

### 导航

- **Affix** - 固钉
- **Anchor** - 锚点
- **Breadcrumb** - 面包屑
- **Dropdown** - 下拉菜单
- **Menu** - 导航菜单
- **Pagination** - 分页
- **Steps** - 步骤条
- **Tabs** - 标签页

### 反馈

- **Alert** - 警告提示
- **Drawer** - 抽屉
- **Message** - 全局提示
- **Modal** - 对话框
- **Notification** - 通知
- **Popconfirm** - 气泡确认框
- **Popover** - 气泡卡片
- **Progress** - 进度条
- **Result** - 结果
- **Skeleton** - 骨架屏
- **Spin** - 加载中
- **Tooltip** - 文字提示
- **Tour** - 漫游引导（80%，多步骤 + 蒙层镂空 + floating-ui 浮层 + Esc 关闭）

### 数据录入

- **AutoComplete** - 自动完成（80%，options + filterOption + 键盘导航 + allowClear + Form 联动 + Teleport）
- **Cascader** - 级联选择（80%，多列联动 + fieldNames + changeOnSelect + Form 联动 + Teleport）
- **CheckBox** - 多选框
- **ColorPicker** - 颜色选择器（80%，HEX/RGB/HSV 显示 + alpha + 预设色板 + Form 联动 + Teleport）
- **DatePicker** - 日期选择框（date 单选 80%，含 v-model / format / valueFormat / disabledDate / Form 联动 / Teleport）
- **Form** - 表单（Form.List 动态字段 / Form.Provider 跨表单 / preserve 卸载策略均已补齐）
- **Input** - 输入框
- **InputNumber** - 数字输入框
- **Mentions** - 提及（80%，textarea + @ 触发 + 多 prefix + 键盘导航 + 自定义过滤）
- **Radio** - 单选框
- **RangePicker** - 日期范围（80%，双面板 + hover 预览 + 自动调换 + Form 联动 + Teleport）
- **Select** - 选择器（虚拟列表 / 嵌套分组 / Teleport / labelInValue / 拖拽排序 / 完整 ARIA）
- **Slider** - 滑块
- **Switch** - 开关
- **TimePicker** - 时间选择框（80%，含 hourStep / disabledHours / showHour-Minute-Second / now+ok / Form 联动 / Teleport）
- **Transfer** - 穿梭框（80%，双列 + 全选 + 双向移动 + 搜索 + render slot + Form 联动）
- **TreeSelect** - 树选择（80%，单选 / 多选 checkable / treeCheckStrictly / fieldNames / Form 联动 / Teleport）
- **Upload** - 上传（80%，文件选择 + 拖拽 + maxCount/maxSize/beforeUpload + 列表 + 状态四态）

### 数据展示

- **Avatar** - 头像
- **Badge** - 徽标数
- **Calendar** - 日历
- **Card** - 卡片
- **Carousel** - 走马灯（80%，scrollx + fade / autoplay / 4 向 dots / infinite / prev・next・goTo expose）
- **Collapse** - 折叠面板
- **Descriptions** - 描述列表
- **Empty** - 空状态
- **Image** - 图片
- **List** - 列表
- **QRCode** - 二维码（80%，自渲 SVG / 容错 4 档 / logo 嵌入 / loading・expired・scanned 三态）
- **Rate** - 评分
- **Segmented** - 分段控制器
- **Table** - 表格（固定列 / 展开行 / 合并单元格 / 行选择 / 排序过滤 / 分页全部已交付）
- **Tag** - 标签
- **Timeline** - 时间线
- **Tree** - 树形控件（受控选中/勾选/展开 / 异步 loadData / 搜索高亮 / 拖拽 / 键盘导航 / 虚拟滚动 / showLine）
- **Watermark** - 水印

### 布局

- **Divider** - 分割线
- **Flex** - 弹性布局
- **Grid** - 栅格（24 列 / 5 断点响应式）
- **Layout** - 布局（Header / Sider / Content / Footer）
- **Masonry** - 瀑布流
- **Space** - 间距
- **Splitter** - 分隔面板

### 还没交付的常见组件

> Ant Design v6.3.7 的常见组件已 **全量 80% 起步交付**。后续工作集中在长尾打磨（80% → 95%）与测试质量审查，详见 [`docs-notes/components-diff/references/components-diff.md`](./docs-notes/components-diff/references/components-diff.md) 「四、后续任务规划」。

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
