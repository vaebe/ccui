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
- **DatePicker → 95%（Batch 37）**：`picker: 'date' | 'week' | 'month' | 'year' | 'quarter'` 5 种粒度 + 面板逐级展开（date → month → year decade）+ `showTime` 时间三列（含 `hourStep` / `minuteStep` / `secondStep` / `disabledHours` 等子配置）+ footer「此刻」/「确定」+ `presets` 侧边 rail（value 函数延迟求值）+ `panel-change` 事件。
  - shared/utils/date 新增 `generateYearMonthGrid` / `generateDecadeYearGrid` / `generateQuarterGrid` / `getWeekInfo`（ISO 8601 含跨年与美式双模式周计数）。
  - 装 dayjs `quarterOfYear` + `advancedFormat` 插件，支持 `'YYYY-[Q]Q'` 双向解析与格式化。
  - `DatePickerLocale` 扩 `monthNamesShort` / `quarterNames` / `weekFormat`（`{weekYear}` / `{weekNumber}` 占位）/ `weekHeader`。
- **RangePicker → 95%（Batch 38）**：`disabledStartDate` / `disabledEndDate` 起止侧独立禁用（优先于通用 `disabledDate`）+ `presets` 元组 rail（end < start 自动调换）+ `showTime` 双面板各挂时间三列 + 双 phase pending（start 默认 00:00:00 / end 默认 23:59:59）+ 单按钮 ok footer（无 now，范围下语义模糊）。
  - effectiveFormat 启用 showTime 时自动拼接时间部分；用户 format 含时间 token 时优先。
- **TimePicker → 95%（Batch 39）**：`use12Hours` 12 小时制 + AM/PM 第 4 列（hour 列展示 `[12, 1..11]`，`hourStep` 抽稀，`disabledHours` 仍按 24h 接收内部映射）+ 键盘导航（`ArrowUp / ArrowDown` 列内环绕 / `Home / End` 跳首尾 / `Enter` 触发 ok / `Esc` 关闭，cell `tabindex=0`、disabled `tabindex=-1`）+ auto-scroll 打开时把每列选中项滚到中央。
- **Cascader → 95%（Batch 40）**：`expandTrigger: 'click' | 'hover'`（hover 模式 mouseenter 展开下一列，不触发 emit）+ `showSearch: boolean | { filter }`（扁平搜索面板，默认 `path.some(label.includes(input))`，禁用项不可选）+ `loadData: (path) => Promise<void>`（`CascaderOption` 加 `isLeaf?: boolean` 显式标记，loading 期间加 `--loading` 类 + ⟳ 图标）+ `multiple` 多选（`modelValue` 变 `CascaderValuePath[]` / 叶子节点 checkbox / input wrap 渲染 tag rail + × 移除 / 与 showSearch 共存不关闭面板）。

### Changed

- **ConfigProvider 接通 `locale`**：原本是死接口，被 `inject` 但无组件消费。本次：
  - 7 个组件改读 `cfg.locale.{ns}.{key}`：Modal / Popconfirm 的 ok / cancel 文案，Empty 的 description，AutoComplete / Mentions / Cascader / TreeSelect 的 notFoundContent。
  - prop 默认值由 `'确 定'` 等中文字面量改为 `''`；运行时优先级：用户显式 prop > `cfg.locale.{ns}.{key}` > 内置 zhCN 兜底。
  - cli `vue-ui` 模板静态注入 `export { zhCN, enUS, defaultLocale } from './locale'`。
- **locale 第二轮收口（Batch 36）**：扩 `PaginationLocale` / `ImageLocale` / `DatePickerLocale` 三个 namespace，把上一轮列为 P1 跟进的 5 个组件全部接通：
  - **Pagination**：`showTotal` 默认模板（`{total}` 占位）/ `条/页` / `跳至` / `页` / 上下页 `aria-label` 全部走 `cfg.locale.Pagination`，自定义 `showTotal` 函数与显式 prop 仍优先。
  - **Image**：`加载中` / `加载失败` 字面量改读 `cfg.locale.Image`，slots 仍优先。
  - **DatePicker / RangePicker / TimePicker**：placeholder / 周名（`weekdaysShort`，自然 [日…六] 顺序，`weekStart=1` 时组件层后置首项）/ 面板标题（`panelLabelFormat` 用 dayjs format：zhCN `YYYY 年 M 月`、enUS `MMM YYYY`）/ `now` / `ok` 按钮 / 4 个 arrow aria-label / clearLabel 全部走 `cfg.locale.DatePicker`。
  - 三个 Picker 5 个 prop（DatePicker.placeholder / RangePicker.placeholder / TimePicker.placeholder / nowText / okText）默认值由中文字面量改为 `''`，统一三级 fallback（用户 prop > locale > zhCN 兜底）。
  - `vue-ccui.ts` 补静态 `export { zhCN, enUS, defaultLocale } from './locale'`（cli 模板早已注入，文件未同步生成）。
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
- **Picker 系 format prop 默认值统一改为 `''`**（Batch 37 / 39，breaking）：
  - DatePicker.format `''` → 按 `picker` 兜底（`date` → `YYYY-MM-DD` / `week` → `YYYY-MM-DD` / `month` → `YYYY-MM` / `year` → `YYYY` / `quarter` → `YYYY-[Q]Q`）；`showTime` 启用时拼成 `YYYY-MM-DD HH:mm:ss`。
  - TimePicker.format `''` → 按 `use12Hours` 兜底（`true` → `h:mm:ss a` / `false` → `HH:mm:ss`）。
  - RangePicker.format 保留 `'YYYY-MM-DD'` 默认，但 `showTime` 启用时若 format 未含 `[HhmsAa]` 任一时间 token 则自动拼接时间部分。
  - 用户显式传 `format='YYYY-MM-DD'`（或任意非空值）依然原样工作。
- **CascaderOption 接口** 加可选字段 `isLeaf?: boolean` 与 `checked?: boolean`（Batch 40）：`isLeaf=false` 让节点配合 `loadData` 标记为「需加载」；`checked` 在多选受控模式下表达勾选状态。

### Fixed

- **Form**：9 处错误命名空间 var 修正。
- **Tag**：`@each` 色名加引号消除 Sass named-color 插值警告。
- **Button**：plain 按钮 hover/focus/active 文字与背景对比度修复；`icon` prop 自动识别 Iconify 名；修复文档死示例。
- **Affix**：分类从「其他」改为「导航」，补回 sidebar 入口。
- **多组件样式与逻辑修复**（commit cfd2a82 系列）。
- **Tree**：修复非法 `background: $ccui-color-primary-bg, rgba(22,119,255,0.08)` 双值（已合并为单 token）。
- **ConfigProvider**：`config-provider.tsx:43` 收口 `eslint-plugin-unicorn/no-useless-fallback-in-spread` 历史警告（`...((user[ns] as object) ?? {})` → `...(user[ns] as object)`），lint baseline 18 errors → 0。
- **DatePicker / RangePicker**：`buildPopup` 内 `const children: unknown[]` 触发 vue `h()` TS2769 overload mismatch，改成三元 `[main]` / `[main, footer]` 直推类型。

### Docs

- **审查报告**：`docs-notes/design-audit/references/ant-design-alignment.md` 完整体检 + P0/P1/P2 整改记录。
- **设计决策**：品牌色（`brand-color.md`）、设计原则（`design-values.md`）、Batch 修复（`2026-05-10-component-fixes.md`）、locale & algorithm 接通（`2026-05-10-locale-algorithm.md`，含 Batch 36 第二轮收口）。
- **ConfigProvider 文档**：新增 "切换语言" 两块 :::demo（Pagination 中英文 toggle + DatePicker/TimePicker enUS）。
- **组件示例向 Ant 对齐**：每组件 5–8 个独立 `:::demo` 块，按"基本 → 配置 → 边界 → 事件"分层。
  - Batch 1：anchor / message / status
  - Batch 2：notification / drawer / breadcrumb / popconfirm / collapse / empty
  - Batch 3：image / watermark / statistic / config-provider / splitter / masonry
  - Batch 4：拆分 radio / check-box 堆叠示例
  - Batch A：pagination / steps / skeleton / progress
  - Batch B：descriptions / flex / result / spin
  - Batch C：segmented / layout / typography / grid / calendar
- **DatePicker 文档（Batch 37）**：扩 11 demo —— 4 picker 模式（week / month / year / quarter）+ 4 showTime（基础 / 只显示时分 / 步进+默认时间 / 禁用时间+showNow=false）+ 3 presets（基础相对项 / picker=week 共存 / showTime 共存）。API 表加 `picker` / `showTime` / `showNow` / `presets` 四行；Events 表加 `panel-change`。
- **RangePicker 文档（Batch 38）**：扩 5 demo —— 独立禁用起止侧 / showTime 基础 / showTime 默认时间 / presets / presets + showTime 共存。API 表加 `disabledStartDate` / `disabledEndDate` / `presets` / `showTime` 四行。
- **TimePicker 文档（Batch 39）**：扩 3 demo —— 12 小时制 / 键盘导航说明 / auto-scroll 居中。API 表 `format` 默认 `''`，加 `use12Hours` 行。
- **Cascader 文档（Batch 40）**：扩 4 demo —— hover 触发 / showSearch 搜索 / loadData 异步加载 / multiple 多选。API 表加 `expandTrigger` / `multiple` / `showSearch` / `loadData` 四行。
- **docs-notes**：`components-diff.md` 同步 Batch 37-40 四批头部记录、复杂组件表 4 项 80→95%、详细记录段（A-F slice 拆解）、P1 后续规划。
  - Form：补 layout / methods 两个 demo，从 4 扩到 6（button / input / select / table 已 ≥7，无需扩）。
- **首页 hero**：随各 batch 推进同步组件数 / 单测数。

### Build

- **cli**：`generate-theme` 在生成 `darkTheme.css` 时将 light 全集与 dark 浅合并，保证 dark 模式只换皮肤、不丢形态 token。

### Tests

- 测试质量审查：TSX 加载修复 + slider 重写 + 2 个已知失败修复。
- 多组件覆盖率扩展（form / table / menu / select 等）。
- 新增 5 个 ConfigProvider 算法 / locale 浅合并测试，覆盖 dark / compact / default 行为与 token 优先级。
- Batch 36 locale 接通增 12 个用例：Pagination / Image 各 +2（zhCN 默认 + enUS 切换），DatePicker / RangePicker / TimePicker 各 +1（placeholder / 周名 / 面板标题 / aria-label / footer 按钮文案随 locale 切换）。
- Batch 37（DatePicker → 95%）+63 用例：14 个 shared/utils/date 纯函数测（月/十年/季度网格 + ISO/US 双模式周计数 + 跨年与长年）+ 28 个 picker 模式（5 模式各典型路径 + 面板逐级展开 + 重开重置 + panel-change 事件）+ 13 个 showTime（列数 / 不立即 emit / ok 禁用 / now / hourStep / disabledHours / hideDisabledOptions / 用户 format 覆盖）+ 8 个 presets（rail 渲染 / 立即 emit / 函数延迟求值 / 与 showTime 共存 / picker=week|month）。
- Batch 38（RangePicker → 95%）+19 用例：disabledStart/End 起止侧独立 + presets 元组 + showTime 双侧时间格 + 默认 start/end 时间 + presets+showTime 共存 + 用户 format 覆盖。
- Batch 39（TimePicker → 95%）+14 用例：use12Hours 第 4 列 / hour 列 [12,1..11] 顺序 / AM-PM 切换 / disabledHours 24h→12h 映射 / 键盘 ArrowUp/Down 环绕 + Home/End + Enter + Esc + disabled tabindex=-1 / auto-scroll 选中存在。
- Batch 40（Cascader → 95%）+19 用例：expandTrigger=hover 展开但不 emit / showSearch 默认 includes 与自定义 filter + 禁用项不可点 + 清空回 columns / loadData 异步 + loading 类 + isLeaf=false 渲染 expand-icon / multiple checkbox + tag rail + × 移除 + clear + checkedKeys 去重 + multiple+showSearch 共存不关。
- 1416 单测稳定通过（1301 → 1364 → 1383 → 1397 → 1416，vue-tsc 0 错；vp check 0 errors / 5 pre-existing warnings）。

---

[Unreleased]: https://github.com/vaebe/ccui/compare/main...2.x
