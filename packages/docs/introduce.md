# 简介

`@vaebe/ccui` 是一套基于 **Vue 3 + TypeScript** 的开箱即用组件库，视觉与心智模型对齐 [Ant Design v6](https://ant-design.antgroup.com/)，覆盖通用 / 布局 / 导航 / 数据录入 / 数据展示 / 反馈 / 其他七类、80+ 个组件。

## 设计取向

- **对标而非照搬**：能力覆盖到、迁移成本低，但 React-only 的 API 形态（render props / forwardRef / 静态属性挂子组件等）会全部翻译成 Vue 习惯（slot、`v-model:*`、平铺导出）。详见 [对标原则](https://github.com/vaebe/ccui/blob/main/docs-notes/decisions/benchmark-principles.md)。
- **TypeScript 优先**：完整 `.d.ts` 类型导出，组件 props / events / slots 全量可推导。
- **主题原生 CSS 变量**：SeedToken / MapToken 双层体系，CSS 变量挂 `:root`，切换 `.dark` 类即启用暗色。
- **可访问性**：浮层 / 选择 / 列表 / 录入 等关键组件已完成 ARIA + 键盘审计。
- **国际化**：内置 zhCN / enUS / jaJP / koKR 四个语言包，`ConfigProvider` 切换同步驱动 dayjs locale 按需懒加载。

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

CSS 变量同时挂载到 `:root` 和 SCSS 变量 fallback，可直接通过 `var(--ccui-color-primary)` 等方式消费；切换到 `.dark` 类即可启用暗色主题。完整 token 列表与定制方式见 [ConfigProvider 全局配置](/components/config-provider/)。

## 浏览器支持

跟随 Vue 3 官方支持范围：现代浏览器、不再支持 IE11。

## 下一步

- 安装与引入方式见 [快速开始](/quick-start)
- 给 AI / Copilot 接入 ccui 的索引文件见 [AI 接入](/for-ai)
