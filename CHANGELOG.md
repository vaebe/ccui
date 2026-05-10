# Changelog

本项目变更遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 风格。
2.x 是当前开发分支，对照 main 主分支记录。

## [Unreleased] - 2.x

工具链迁移到 Vite+，组件库扩到 73+ 个组件，主题层向 Ant Design v6 设计语言全量对齐。

### Added

- **新组件**：tour、transfer、auto-complete、color-picker、qr-code、carousel、mentions、upload、tree-select、cascader、range-picker、time-picker、date-picker、icon、select、form、table、status、menu 等 80% / 95% / 100% 三档逐级交付。
- **主题 token**：
  - 12 色板补全 1–10 阶；Tag 预设色接入色板 token。
  - 加 `controlOutline` / `-error` / `-warning` token，统一所有 focus 光环。
  - dark 主题补全非颜色 token（圆角 / 字号 / 动效 / 间距 / 阴影 / 字体族），切到 `.dark` 类后形态稳定不依赖 `:root` 兜底。
- **Resolver**：新增 `@vue3-ccui/unplugin-vue-components` 工具包，按需自动引入。
- **Form**：`shouldUpdate` / `validateDebounce` / `normalize`、`Form.List` / `Form.Provider` / `preserve`。
- **Table**：行选择、固定列、展开行、合并单元格、树形数据 (`childrenColumnName` + `indentSize`)。
- **Tree**：`showLine`、拖拽 hover-expand、auto-scroll、`loadData` 错误重试、键盘导航、虚拟滚动、`focusedKey` 受控。
- **Select**：分组、`fieldNames`、tags、远程搜索、`FormItem` 联动、虚拟列表、嵌套分组、ARIA、`labelInValue`、`maxCount`、`tagsDraggable`、`optionLabelProp`、`showSearch`。
- **Icon**：Iconify 适配、`themePrefixMap`、`ConfigProvider`、`spinDirection`、`loading` / `disabled`。
- **Tag**：processing 状态加 6px 脉冲点动画。
- **i18n**：新增 `packages/ccui/ui/locale/{zh-CN,en-US,index}.ts` 语言包基础设施，从顶层包导出 `zhCN` / `enUS` / `defaultLocale`。`ConfigProvider.useConfig` 在注入时按 namespace 浅合并用户 locale 与 zhCN 默认，避免深取值变 `undefined`。
- **ConfigProvider 接通 `theme.algorithm`**：原本是死接口（仅类型存在）。
  - `algorithm: 'dark'`：在 wrapper 上叠加 `.dark` 类，`darkTheme.css` 内的 CSS 变量自动级联到子树。
  - `algorithm: 'compact'`：注入紧凑尺寸 token 集（`controlHeight 32→24`，`padding/margin` 系列各档缩小一档），对齐 Ant Design v6 compact 算法。
  - `algorithm: 'default'`：保留原行为。
  - 用户 `theme.token` 仍胜过 compact 的默认值。

### Changed

- **ConfigProvider 接通 `locale`**：原本是死接口，被 `inject` 但无组件消费。本次：
  - 7 个组件改读 `cfg.locale.{ns}.{key}`：Modal / Popconfirm 的 ok / cancel 文案，Empty 的 description，AutoComplete / Mentions / Cascader / TreeSelect 的 notFoundContent。
  - prop 默认值由 `'确 定'` 等中文字面量改为 `''`；运行时优先级：用户显式 prop > `cfg.locale.{ns}.{key}` > 内置 zhCN 兜底。
  - cli `vue-ui` 模板静态注入 `export { zhCN, enUS, defaultLocale } from './locale'`。
  - DatePicker 月份 / 周名、Pagination 文案、Image 加载提示等仍未走 locale，作为 P1 跟进。
- **Form scss 全量 token 化**：
  - 加 `@use '../../style-var/index.scss' as *;`，类名走 `#{$cls-prefix}-form` 占位符。
  - 9 处变量名对齐 v6：`var(--ccui-text)` → `$ccui-color-text`、`var(--ccui-text-weak)` → `$ccui-color-text-secondary`、`var(--ccui-danger)` → `$ccui-color-error`、`var(--ccui-success)` → `$ccui-color-success`。
  - 字面量尺寸全部 → token：`14px` → `$ccui-font-size`、`12px` → `$ccui-font-size-sm`、`32px` → `$ccui-control-height`、`12px / 4px / 6px / 16px` → `$ccui-padding-sm / -margin-xxs / -xs / -padding`。
  - form-item `margin-bottom` 由 18px 调到 24px（`$ccui-margin-lg`），对齐 Ant Design v6 Form.Item 默认间距。视觉上比之前略宽，是有意调整。
- **品牌色**：保留 `#1677ff` 全量对齐 Ant Design v6 SeedToken；旧 1.x 主色 `#5e7ce0` 由使用方通过 `<ConfigProvider>` 自定义注入。
- **主题源单源化**：`themes/light.ts` / `dark.ts` 是唯一真源，`theme.scss` / `darkTheme.css` 由 cli 重生，不可手改。
- **品牌色硬编码清扫**：在 11 个组件 SCSS 把 `#1677ff` / `var(--ccui-brand, #1677ff)` / `rgba(22,119,255,…)` / 派生 hover/active/bg 色一律替换为 `$ccui-color-primary` 系列 token；rgba 透明度走 `color-mix(in srgb, $ccui-color-primary N%, transparent)`。
- **Focus 光环统一**：input-number / slider / input / select / button / cascader / tree-select / auto-complete / mentions / date-picker / time-picker / range-picker / color-picker 等所有 focus 阴影改用 `$ccui-control-outline`（错误态 / 警告态对应 `-error` / `-warning`）。
- **按钮 hover 行为**：popconfirm / time-picker 内置按钮 hover 不再用 `opacity: 0.85`，改走 `colorPrimaryHover` / `colorErrorHover` token，与 Button / Modal 统一。
- **Result.tsx**：把 4 处 SVG `fill="#1677ff"` 字符串改为 `currentColor` + 状态修饰类驱动，token 化。
- **工具链**：从 Vue CLI 全量迁移到 Vite+。
- **依赖**：vue 钉到 3.5.33 修复双实例 reactivity 失效（107 测试失败 → 0）。
- **light.ts 旧 token**：标记 `@deprecated` 并指向新 token：
  - `font-size-card-title` / `-page-title` / `-modal-title` → `font-size-lg` / `-xl`
  - `font-size-price` / `-data-overview` → `font-size-heading-3` / `-heading-2`
  - `border-radius-feedback` / `-card` → `border-radius-lg`
  - `shadow-length-*` → `box-shadow` / `-secondary` / `-tertiary`
  - `animation-duration-*` / `-ease-*` → `motion-duration-*` / `motion-ease-*`

### Fixed

- **Form**：9 处错误命名空间 var 修正。
- **Tag**：`@each` 色名加引号消除 Sass named-color 插值警告。
- **Button**：plain 按钮 hover/focus/active 文字与背景对比度修复；`icon` prop 自动识别 Iconify 名；修复文档死示例。
- **Affix**：分类从「其他」改为「导航」，补回 sidebar 入口。
- **多组件样式与逻辑修复**（commit cfd2a82 系列）。
- **Tree**：修复非法 `background: $ccui-color-primary-bg, rgba(22,119,255,0.08)` 双值（已合并为单 token）。

### Docs

- **审查报告**：`docs-notes/design-audit/references/ant-design-alignment.md` 完整体检 + P0/P1/P2 整改记录。
- **设计决策**：品牌色（`brand-color.md`）、设计原则（`design-values.md`）、Batch 修复（`2026-05-10-component-fixes.md`）。
- **组件示例向 Ant 对齐**：每组件 5–8 个独立 `:::demo` 块，按"基本 → 配置 → 边界 → 事件"分层。
  - Batch 1：anchor / message / status
  - Batch 2：notification / drawer / breadcrumb / popconfirm / collapse / empty
  - Batch 3：image / watermark / statistic / config-provider / splitter / masonry
  - Batch 4：拆分 radio / check-box 堆叠示例
  - Batch A：pagination / steps / skeleton / progress
  - Batch B：descriptions / flex / result / spin
  - Batch C：segmented / layout / typography / grid / calendar
  - Form：补 layout / methods 两个 demo，从 4 扩到 6（button / input / select / table 已 ≥7，无需扩）。
- **首页 hero**：随各 batch 推进同步组件数 / 单测数。

### Build

- **cli**：`generate-theme` 在生成 `darkTheme.css` 时将 light 全集与 dark 浅合并，保证 dark 模式只换皮肤、不丢形态 token。

### Tests

- 测试质量审查：TSX 加载修复 + slider 重写 + 2 个已知失败修复。
- 多组件覆盖率扩展（form / table / menu / select 等）。
- 新增 5 个 ConfigProvider 算法 / locale 浅合并测试，覆盖 dark / compact / default 行为与 token 优先级。
- 1294 单测稳定通过（vue-tsc 0 错）。

---

[Unreleased]: https://github.com/vaebe/ccui/compare/main...2.x
