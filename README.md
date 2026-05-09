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

视觉规范对齐 [Ant Design v6.3.7](https://ant.design)，主题 Token 已按官方默认 Seed/Map Token 实现。当前已交付 **65 个组件 / 工具入口**，详细覆盖度与剩余项见 [`docs-notes/components-diff/references/components-diff.md`](./docs-notes/components-diff/references/components-diff.md)。

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

### 数据录入

- **Cascader** - 级联选择（80%，多列联动 + fieldNames + changeOnSelect + Form 联动 + Teleport）
- **CheckBox** - 多选框
- **DatePicker** - 日期选择框（date 单选 80%，含 v-model / format / valueFormat / disabledDate / Form 联动 / Teleport）
- **Form** - 表单（Form.List 动态字段 / Form.Provider 跨表单 / preserve 卸载策略均已补齐）
- **Input** - 输入框
- **InputNumber** - 数字输入框
- **Radio** - 单选框
- **RangePicker** - 日期范围（80%，双面板 + hover 预览 + 自动调换 + Form 联动 + Teleport）
- **Select** - 选择器（虚拟列表 / 嵌套分组 / Teleport / labelInValue / 拖拽排序 / 完整 ARIA）
- **Slider** - 滑块
- **Switch** - 开关
- **TimePicker** - 时间选择框（80%，含 hourStep / disabledHours / showHour-Minute-Second / now+ok / Form 联动 / Teleport）
- **TreeSelect** - 树选择（80%，单选 / 多选 checkable / treeCheckStrictly / fieldNames / Form 联动 / Teleport）

### 数据展示

- **Avatar** - 头像
- **Badge** - 徽标数
- **Calendar** - 日历
- **Card** - 卡片
- **Collapse** - 折叠面板
- **Descriptions** - 描述列表
- **Empty** - 空状态
- **Image** - 图片
- **List** - 列表
- **Rate** - 评分
- **Segmented** - 分段控制器
- **Statistic** - 统计数值（含 Countdown）
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

| 组件                            | 复杂度 | 备注                     |
| ------------------------------- | ------ | ------------------------ |
| Transfer / Upload               | 复杂   | 独立大任务               |
| AutoComplete                    | 中等   | 依赖 Select / Input 稳定 |
| Carousel / QRCode / ColorPicker | 中等   | 见路线图                 |
| Mentions / Tour                 | 体验型 | 见路线图                 |

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
