# 6 — 布局组件 + 特色组件 / 工具 与 Ant Design 6.3.7 逐项 diff

覆盖：divider / flex / grid (Row+Col) / layout (Header+Sider+Content+Footer) / masonry / space (含 Compact) / splitter (含 Panel) / button-3d / util（共 9 个组件）。

---

## Divider

- Ant 段：`## divider`（行 14816）
- ccui types：`packages/ccui/ui/divider/src/divider-types.ts`
- ccui docs：`packages/docs/components/divider/index.md`
- ccui 自报状态：`100%`

### Demo 对比

**Ant 官方 demo（共 6 条）**：1. Horizontal（含 `dashed`）；2. Divider with title（`titlePlacement="start/end"` + `styles.content`）；3. Set the spacing size（`size="small/medium/large"`）；4. Text without heading style（`plain`）；5. Vertical（`orientation="vertical"` 与 `vertical` 简写）；6. Variant（`variant="solid|dashed|dotted"` + 自定义 `borderColor`）；附 Custom semantic dom styling（`classNames` / `styles` 对象与函数）。
**ccui 文档 demo（共 6 条）**：1. 基本用法；2. 虚线（`border-style="dashed"`）；3. 自定义颜色（`color`）；4. 带文案（`content-position`）；5. 自定义文案样式（`content-color` / `content-background-color`）；6. 垂直分隔线（`direction="vertical"`）。
**ccui 缺失的 ant demo**：

- 「带 title 的 placement」demo（`titlePlacement="start/end"` + 通过 `styles.content` 控制 content margin）
- 「Spacing size」demo（`size="small|medium|large"`）
- 「Plain 文案样式」demo（`plain` 关掉 heading 风格）
- 「Variant」demo（`variant="dashed|dotted|solid"`）
- 「Custom semantic dom styling」demo（`classNames` / `styles` 支持对象与函数两种形态）
  **ccui 特有 demo**：
- 「自定义文案样式」demo —— 用 `content-color` / `content-background-color` 直接控文字颜色与底色（ant 走 `styles.content` 的 CSSProperties 路径，ccui 给出了两个简写 prop）

### Props 对比

**ccui 缺失的 ant props**：

- `titlePlacement: 'start' | 'end' | 'center'`（ccui 用 `contentPosition: 'left' | 'right' | 'center'` 代替，命名/取值都不同）
- `plain: boolean`（关掉 heading 风格，4.2+）
- `size: 'small' | 'medium' | 'large'`（5.25.0+，仅水平方向有效）
- `variant: 'dashed' | 'dotted' | 'solid'`（5.20.0+，ccui 只支持 `dashed | solid`，**缺 `dotted`**）
- `dashed: boolean`（顶层快捷写法，ccui 必须用 `border-style="dashed"`）
- `vertical: boolean`（与 `orientation="vertical"` 等价的顶层快捷写法）
- `orientationMargin`（已废弃；但 ant 6.x 仍承认）
- `classNames` / `styles` 语义化 DOM 接管（含函数形态）
- `className` / `style` 容器透传（ccui 不在 props 中声明，但 Vue 模板可天然透传 attr）
  **命名/形状差异**：
- `direction` ↔ ant 的 `orientation`（取值都是 `horizontal | vertical`；ccui 不识别 `orientation`，且没有顶层 `vertical` 简写）
- `contentPosition: 'left' | 'right'` ↔ ant 的 `titlePlacement: 'start' | 'end'`（LTR / RTL 语义不同；ant 用逻辑端，更利于双向布局）
- `borderStyle: 'solid' | 'dashed'` ↔ ant 同时具备 `variant`（含 `dotted`）和 `dashed` 简写
- `color`、`contentColor`、`contentBackgroundColor` —— ant 没有对应 prop，靠 `style` / `styles` 自行 CSS
  **ccui 特有 props**：
- `color`（线条颜色快捷设置）
- `contentColor`（文案文字颜色）
- `contentBackgroundColor`（文案背景色）

### Events / 方法 对比

**缺失 events**：双方均无事件。
**缺失 expose 方法**：双方均无。

### 子组件 / 静态导出

**缺失**：双方均无静态子组件。

---

## Flex

- Ant 段：`## flex`（行 17805，5.10.0+ 新组件）
- ccui types：`packages/ccui/ui/flex/src/flex-types.ts`
- ccui docs：`packages/docs/components/flex/index.md`
- ccui 自报状态：`100%`

### Demo 对比

**Ant 官方 demo（共 5 条）**：1. Basic（horizontal/vertical 切换）；2. align（`justify` / `align` 用 Segmented 动态切）；3. gap（三档预设 `small`/`medium`/`large` + customize 数字滑杆）；4. Wrap（`wrap` 自动换行 24 个 Button）；5. combination（嵌套：Card + Flex + Typography 实现卡片排版）。
**ccui 文档 demo（共 7 条）**：1. 基本使用（`:gap="12"`）；2. 间距预设（`gap="small/middle/large"`）；3. 垂直布局（`vertical`）；4. 对齐方式（`justify` × `align`）；5. 自动换行（`wrap`）；6. `flex` 简写撑满剩余空间；7. 自定义元素（`component="nav"`）。
**ccui 缺失的 ant demo**：

- 「combination 综合排版」demo（Card + Flex + Typography 嵌套，类似 hero card）
  **ccui 特有 demo**：
- 「自定义元素」demo —— `component="nav"`（ant prop 同名为 `component`，但 ant 文档没单独 demo）
- 「flex 简写撑满剩余」demo（ant prop `flex` 存在但官方 demo 用 children 自行控）

### Props 对比

**ccui 缺失的 ant props**：

- `orientation: 'horizontal' | 'vertical'`（6.x 新增的语义化命名，与 `vertical` 同时存在时 `orientation` 优先）
  **命名/形状差异**：
- `gap` 取值集：ant 是 `'small' | 'medium' | 'large' | string | number`；ccui 是 `'small' | 'middle' | 'large' | string | number`（**ccui 沿用旧的 `middle`，ant 6 已切到 `medium`**，并把 `PRESET_GAP` 写在 `flex-types.ts` 里）
- `flex` 默认值：ccui `'normal'` 字符串、ant 文档默认 `normal` 一致
- `component` 类型：ccui `string`（仅标签名），ant 是 `React.ComponentType`（可传组件构造器）
- `wrap` 类型：ccui `boolean | FlexWrap`、ant `flex-wrap | boolean`（语义一致）
  **ccui 特有 props**：
- 无（ccui 与 ant Flex 是该组的最小覆盖；ccui 多导出了 `PRESET_GAP` 常量供消费者读取）

### Events / 方法 对比

**缺失 events**：双方均无事件。
**缺失 expose 方法**：双方均无。

### 子组件 / 静态导出

**缺失**：双方均无静态子组件。

---

## Grid（Row / Col）

- Ant 段：`## grid`（行 22791），含 `### Row` 与 `### Col` 两张 props 表
- ccui types：`packages/ccui/ui/grid/src/grid-types.ts`
- ccui docs：`packages/docs/components/grid/index.md`
- ccui 自报状态：`100%`

### Demo 对比

**Ant 官方 demo（共 11 条）**：1. Basic Grid（24 等分基本骨架）；2. Grid Gutter（数字 / 对象 / 数组 / CSS 字符串单位 `2rem`，5.28+）；3. Column offset；4. Grid sort（`push` / `pull`）；5. Typesetting（`justify`：start/center/end/space-between/space-around/space-evenly）；6. Alignment（`align`：top/middle/bottom 配合不同高度）；7. Order（数字 + 响应式 `xs={{ order }}` 嵌套）；8. Flex Stretch（`Col flex={2}` / `flex="100px"` / `flex="auto"` / `wrap={false}` 配 `flex="none"`）；9. Responsive（`xs/sm/md/lg/xl`）；10. Flex Responsive（`xs={{ flex: '100%' }}` 形态，CSS 变量驱动）；11. More responsive（`xs={{ span, offset }}` 嵌套对象）；12. Playground（Slider 动态控 gutter / col count）；13. useBreakpoint Hook（`Grid.useBreakpoint()`）。
**ccui 文档 demo（共 7 条）**：1. 基本使用；2. 不等分；3. 偏移与对齐；4. 响应式列数（`xs/sm/md/lg`）；5. 响应式间距（`[24, 12]`）；6. 列排序（`order`）；7. flex 简写（`flex="120px"` / `flex="auto"`）。
**ccui 缺失的 ant demo**：

- 「Grid Gutter 字符串单位」demo（`gutter="2rem"`，5.28+）
- 「Column offset 专题」demo（多种 offset 组合，目前与「偏移与对齐」混为一谈）
- 「push / pull」demo（ccui props 已声明但文档零 demo）
- 「Typesetting `justify` 完整谱」demo（ant 列了六种水平模式各一行）
- 「Alignment `align` 高度变化」demo（top/middle/bottom 对照）
- 「Order 响应式嵌套」demo（`xs={{order:1}} sm={{order:2}}`）
- 「Flex 响应式 `xs={{ flex: '100%' }}`」demo
- 「More responsive `xs={{ span, offset }}` 嵌套对象」demo
- 「Playground」 demo
- 「useBreakpoint Hook」demo（ccui 完全缺乏对应能力 —— 无导出 `Grid.useBreakpoint`/composable）
  **ccui 特有 demo**：
- 无（ccui 是 ant Grid 的子集）

### Props 对比 — Row

**ccui 缺失的 ant props**：

- `align` 取值的「响应式对象形态」（`{ xs: 'top', sm: 'middle' }`，4.24+）—— ccui 只支持单值
- `justify` 取值的「响应式对象形态」—— ccui 只支持单值
- `gutter` 取值中的「string CSS 单位」分支（`'2rem'` 等，5.28+）
- `gutter` 对象形态中的 `xxxl` 键（见下，6.3.0 才有）
  **命名/形状差异**：
- `gutter` 类型签名：ccui `number | [number, number] | Partial<Record<Breakpoint, number | [number, number]>>`、ant `number | string | object | array`（**ccui 缺 string 分支**）
- `align` 默认值：ccui `'top'`、ant `'top'` 一致；但 ccui 不接受对象形态
  **ccui 特有 props**：
- 无

### Props 对比 — Col

**ccui 缺失的 ant props**：

- **`xxxl`（`screen ≥ 1920px`，ant 6.3.0 新增）—— ccui 断点止步 `xxl`**，`BREAKPOINT_PX` 和 `BREAKPOINTS` 数组中都没有该键。这是 ant 6.3 相对 5.x 的关键新增点之一。
- ant `xs/sm/.../xxl` 各档接受「单数字 / 对象」两种；ccui 已支持，但对象内不支持 `flex` 属性细节文档未在 demo 中演示
  **命名/形状差异**：
- `span` 类型：ccui `number | string`、ant `number`（ccui 兼容字符串模板传值；功能等价）
- `offset / order / push / pull`：ccui `number | string`、ant 全 `number`
- `flex`：ccui `number | string`、ant `string | number`，等价
  **ccui 特有 props**：
- 无

### Events / 方法 对比

**缺失 events**：双方均无事件。
**缺失 expose 方法**：双方均无。

### 子组件 / 静态导出

**缺失**：

- `Grid.useBreakpoint` Hook —— ccui 没有 composable 形式的 `useBreakpoint()`（这是 ant 极受用户欢迎的能力，对自适应渲染至关重要）
- ccui 仅导出 `<c-row>` / `<c-col>`，没有 `Grid` 命名空间下挂的工具
- ccui 内部 `BREAKPOINT_PX.xs` 等于 `0`，ant 文档断点表里 `xs: '480px'`（在 Layout 段标注），与 Grid 段 `xs<576px` 的语义略有差别 —— 但这是 ant 内部 Layout vs Grid 的差别，不算 ccui 问题

---

## Layout（Header / Sider / Content / Footer）

- Ant 段：`## layout`（行 26561），API 表在 27352-27411
- ccui types：`packages/ccui/ui/layout/src/layout-types.ts`
- ccui docs：`packages/docs/components/layout/index.md`
- ccui 自报状态：`100%`

### Demo 对比

**Ant 官方 demo（共 7 条）**：1. Basic Structure（四种 H/HSF/HSF-right/SHF 经典骨架并排）；2. Header-Content-Footer（含 Breadcrumb + Menu 顶导）；3. Header-Sider（顶 + 侧两级导航）；4. Header Sider 2（应用型，侧栏在 Header 之下铺底）；5. Sider（带 collapsible 折叠，`collapsed` 受控）；6. Custom trigger（`trigger={null}` 隐藏默认折叠按钮，自定义在 Header 中点击）；7. Responsive（`breakpoint="lg"` + `collapsedWidth="0"` + `onBreakpoint` 自动响应折叠）；8. Fixed Header（`position: sticky` 顶栏）；9. Fixed Sider；（实际还有 Side by Side 多种变体 demo，共 ≥7 条）
**ccui 文档 demo（共 6 条）**：1. 基本使用（HCF）；2. 含侧边栏；3. 可折叠侧边栏（`collapsible` + `v-model:collapsed`）；4. 自定义宽度（`width` / `collapsedWidth`）；5. 浅色侧边栏（`theme="light"`）；6. 监听折叠（`@collapse="(collapsed, type)"`）。
**ccui 缺失的 ant demo**：

- 「Basic Structure 全谱」demo（四种骨架并排展示）
- 「Header + Sider（带菜单）」demo（要 Menu 联动才有完整效果）
- 「Custom trigger」demo（`trigger={null}` 隐藏默认按钮，在外部自定义触发）
- 「Responsive (`breakpoint`)」demo —— **ccui types 中已声明 `breakpoint`，但实现是否响应窗口宽度需对照源码；ccui 文档 0 个 `breakpoint` demo，也无 `@breakpoint` 事件相关示例**
- 「Fixed Header」demo（`position: sticky` 顶栏 + Layout 内滚动）
- 「Fixed Sider」demo（侧栏整列 fixed）
- 「reverseArrow」demo（右侧栏折叠按钮箭头反向，常用于右侧 sider）
  **ccui 特有 demo**：
- 「浅色侧边栏 theme="light"」demo（ant 段无独立 demo，但 prop 同名 `theme`）

### Props 对比 — Layout

**ccui 缺失的 ant props**：

- 无（`hasSider` ccui 已有，`className/style` 是 Vue 透传）
  **命名/形状差异**：无
  **ccui 特有 props**：无

### Props 对比 — Header / Content / Footer

**ccui 缺失的 ant props**：无（双方均零 props，仅作为带样式语义化标签）
**命名/形状差异**：无

### Props 对比 — Sider（重点段）

**ccui 缺失的 ant props**：

- **`breakpoint` 的 `xxxl` 取值（ant 6.3.0 新增）—— ccui types 中 `breakpoint` 类型为 `'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'`，无 `xxxl`**
- **`onBreakpoint(broken: boolean)` 事件 / `@breakpoint`** —— ccui 文档 + types 中**完全缺失**。这是 ant 响应式 Sider 的关键回调，没有它就无法在窗口跨越断点时获得回调
- **`zeroWidthTriggerStyle: CSSProperties`** —— `collapsedWidth=0` 时出现的特殊小触发条样式定制，ccui 缺
- `className` / `style`（Vue 模板可透传，但 types 未声明）
  **命名/形状差异**：
- `theme` 默认值都是 `'dark'` ✓
- `width` 默认值都是 `200` ✓
- `collapsedWidth` 默认值：ccui `80`、ant `80` ✓（但 ant 还约定「`collapsedWidth=0` 时出现特殊触发条」的语义 —— ccui 此特殊处理需在源码核对）
- `trigger`：ccui `string | object`、ant `ReactNode`；ant 显式约定 `trigger={null}` → 隐藏默认按钮（ccui 文档未点出，命名差异较小，但「null 隐藏」语义需核对实现）
- `collapsible` 默认 `false` ✓
- `defaultCollapsed` 默认 `false` ✓
- `reverseArrow` ccui 已有 ✓
  **ccui 特有 props**：无（`SiderTheme` 类型与 ant 等价）

### Events / 方法 对比 — Sider

**缺失 events**：

- `@breakpoint`（`(broken: boolean) => void`）—— ant 必备，ccui 缺
  **ccui 已有**：`@update:collapsed` / `@collapse(value, type)`（与 ant `onCollapse` 一致）
  **缺失 expose 方法**：双方均无（折叠纯靠 `v-model` / `collapsed` 受控）

### 子组件 / 静态导出

**缺失**：

- ant 通过 `Layout.Header / Layout.Sider / Layout.Content / Layout.Footer` 名字空间挂载子组件；ccui 走「kebab 全局组件」路径暴露 `<c-layout-header>` `<c-layout-sider>` `<c-layout-content>` `<c-layout-footer>`。功能等价，但 **缺乏命名空间形态的 `Layout.Sider` 静态导出**，迁移 ant 代码时需要逐个改名

---

## Masonry

- Ant 段：`## masonry`（行 28668，ant 6.0.0 才有的新组件）
- ccui types：`packages/ccui/ui/masonry/src/masonry-types.ts`
- ccui docs：`packages/docs/components/masonry/index.md`
- ccui 自报状态：`100%`

### Demo 对比

**Ant 官方 demo（共 5 条）**：1. Basic（`items[] + itemRender` 渲染契约，部分 item 走 `children`）；2. Responsive（`columns={{xs:1, sm:2, md:3, lg:4}}` + `gutter={{xs:8, sm:12, md:16}}` 响应式 gutter）；3. Image（图片加载完自动重新分列）；4. Dynamic（动态增删 + `item.column` 锚定列 + `onLayoutChange` 反查重新写回）；5. Custom semantic dom styling（`classNames` / `styles` 对象与函数）。
**ccui 文档 demo（共 5 条）**：1. 基本使用（默认插槽放 N 个 `<div>`）；2. 响应式列数（`columns={{xs:1,...lg:4}}`）；3. 控制水平/垂直间距（`gutter=[24, 8]`）；4. 卡片墙（包 `<c-card>` 子节点）；5. 内容动态变化（响应 `v-for` 长度变化重新分列）。
**ccui 缺失的 ant demo**：

- 「Image」demo（图片加载触发重新分列，演示 `fresh` / 自适应能力）
- 「Dynamic / item.column 锚定」demo（ccui 没有 `item.column` 概念，ant 设计差异点）
- 「Custom semantic dom styling」demo
  **ccui 特有 demo**：
- 「卡片墙（`<c-card>` 子节点）」demo —— 直接用默认插槽，与 ant `items + itemRender` 的渲染契约完全不同
- 「内容动态变化（响应 `v-for` 长度）」demo

### Props 对比

**ccui 缺失的 ant props**：

- **`items: MasonryItem[]`** —— ant 的核心数据契约，每项含 `{ key, data, children?, column?, height? }`
- **`itemRender: (item) => ReactNode`** —— 与 `items` 配对的渲染函数
- **`onLayoutChange: (sortedItems: { key, column }[]) => void`** —— 列分配完成回调，配合 `item.column` 锚定
- **`fresh: boolean`** —— 持续监听子项尺寸变化（图片场景必需）
- `classNames` / `styles` 语义化 DOM
  **命名/形状差异**：
- **渲染契约方向不同**：ant 走「数据驱动 `items + itemRender`」，ccui 走「默认插槽 / 直接子节点」。前者更适合大数据 + 列锚定 + 抗抖动；后者更接近 Vue 原生开发体验，但**无法实现 ant 的 `item.column` 锚定能力**
- `columns` 对象形态：ant 6 文档示例只列了 `{xs, sm, md}`，但实际类型 `Partial<Record<'xs'|...|'xxl', number>>`；ccui 与 ant 类型一致（含 `xxl`）。**ccui 没有 `xxxl` 键**
- `gutter` 类型：ccui `number | [number, number]`、ant `Gap | [Gap, Gap]`（其中 `Gap = number | Partial<Record<breakpoint, number>>`）—— **ant 支持「gutter 整体响应式 `{xs: 8, sm: 12}`」，ccui 不支持**
  **ccui 特有 props**：
- `sequential: boolean` —— 顺序填充模式（保持原序、不做高度平衡）。ant 没有此 prop，ccui 设计差异点

### Events / 方法 对比

**缺失 events**：

- `@layout-change` / `onLayoutChange` —— ccui 缺
  **缺失 expose 方法**：双方均无

### 子组件 / 静态导出

**缺失**：

- ant 暴露 `MasonryItemType` / `Gap` 等类型；ccui 暴露 `MasonryColumns` / `BREAKPOINT_PX` / `BREAKPOINTS` 常量
- **设计冲突点**：ccui 是「Vue 默认插槽 + 子节点」、ant 是「`items + itemRender`」。两者迁移成本较高，且锚定能力（`item.column` + `onLayoutChange`）只在 ant 设计下可达成

---

## Space（含 Space.Compact）

- Ant 段：`## space`（行 41216）
- ccui types：`packages/ccui/ui/space/src/space-types.ts`
- ccui docs：`packages/docs/components/space/index.md`
- ccui 自报状态：`100%`

### Demo 对比

**Ant 官方 demo（共 ≥10 条）**：1. Basic Usage（横向）；2. Vertical Space（`orientation="vertical"`）；3. Space Size（small/medium/large/customize）；4. Align（start/center/end/baseline）；5. Wrap（`size={[8,16]} wrap`）；6. separator（用 `separator` 取代旧 `split`）；7. Compact Mode for form component（庞大的 `Space.Compact` × Input/Select/DatePicker/TimePicker/Cascader/TreeSelect/InputNumber 组合）；8. Button Compact Mode（按钮组）；9. Vertical Compact Mode（`Space.Compact orientation="vertical"`，仅 Button）；10. Custom semantic dom styling；外加 `Space.Addon`（5.29+，用于 Compact 中插入自定义单元格）。
**ccui 文档 demo（共 4 条）**：1. 基本使用；2. 垂直间距（`direction="vertical"`）；3. 间距大小（small/middle/large + 数字 40）；4. 分隔符（`split="·"`）。
**ccui 缺失的 ant demo**：

- 「Align」demo（`align="start|end|center|baseline"`）—— ccui types 中已有 `align` prop，文档无对应 demo
- 「Wrap」demo（`wrap` + 数组 size 演示）
- **「Compact Mode」整个 demo 簇（双方差异最大）**：表单组件紧凑组合、按钮紧凑组合、垂直按钮紧凑组合 —— **ccui 完全没有 `Space.Compact` / `<c-space-compact>` 静态子组件**
- 「Custom semantic dom styling」demo
  **ccui 特有 demo**：
- 无（ccui 是 ant Space 的子集）

### Props 对比

**ccui 缺失的 ant props**：

- `orientation: 'vertical' | 'horizontal'`（ant 6.x 新命名，与 `direction` 等价；ant 已把 `direction` 标记为 deprecated）
- `vertical: boolean`（顶层快捷写法）
- `separator: ReactNode`（替代旧 `split`；ccui 只有 `split: string`，**只支持纯文本，不支持 ReactNode/VNode**）
- `classNames` / `styles` 语义化 DOM 接管
  **命名/形状差异**：
- `direction` —— ant 文档已标 `~~direction~~`（deprecated），推荐 `orientation`；ccui 还在用 `direction`
- `size` 取值：ccui `'small' | 'middle' | 'large' | number | [number, number]`、ant `'small' | 'medium' | 'large' | number | Size[]`；**ccui 取值用 `middle`、ant 用 `medium`**
- `split: string` ↔ ant `separator: ReactNode`：ccui 类型更窄，不能传 `<c-divider vertical />` 之类的 VNode 分隔符
- `align` 默认值：ccui `undefined`、ant `-`（功能等价）
  **ccui 特有 props**：
- 无

### Events / 方法 对比

**缺失 events**：双方均无
**缺失 expose 方法**：双方均无

### 子组件 / 静态导出

**缺失**：

- **`Space.Compact` / `<c-space-compact>`** —— ant 4.24.0+ 提供的「子表单组件紧凑组合」专用子组件，支持 Button / AutoComplete / Cascader / DatePicker / Input / InputNumber / Select / TimePicker / TreeSelect，**ccui 完全没有对应实现**。这是 Space 子能力中最重要的缺失项
- **`Space.Addon`** （5.29.0+）—— 在 Compact 中插入自定义单元格（如 `$` 符号），**ccui 缺失**
- 涉及 Compact 的全部 props：`block` / `orientation` / `vertical` / `size`（在 Compact 上）— 全部缺

---

## Splitter（含 Splitter.Panel）

- Ant 段：`## splitter`（行 42376）
- ccui types：`packages/ccui/ui/splitter/src/splitter-types.ts`
- ccui docs：`packages/docs/components/splitter/index.md`
- ccui 自报状态：`100%`

### Demo 对比

**Ant 官方 demo（共 10 条）**：1. Basic（百分比 / px 混用 `defaultSize="40%" min="20%" max="70%"`）；2. Control mode（受控 `size`、`onResize`、单面板禁用 resizable）；3. Vertical（`vertical` / `orientation="vertical"`）；4. Collapsible（`Panel collapsible` + `collapsible={{ motion }}`）；5. Control collapsible icons（`collapsible.showCollapsibleIcon` 'auto' / true / false）；6. Multiple panels；7. Complex combination（双向嵌套：Left + (Top/Bottom)）；8. Lazy（`lazy` 拖动结束才更新尺寸，5.23+）；9. Customize（`draggerIcon` + `collapsible.icon.start/end` 自定义图标）；10. Custom semantic dom styling；11. Double-clicked reset（`onDraggerDoubleClick` 双击重置，6.3+）。
**ccui 文档 demo（共 6 条）**：1. 基本使用；2. 垂直布局（`layout="vertical"`）；3. 多面板（三栏）；4. 限制最小/最大尺寸；5. 不可拖动（`:resizable="false"`）；6. 监听尺寸变化（`@resize` / `@resizeStart` / `@resizeEnd`）。
**ccui 缺失的 ant demo**：

- 「Control mode」demo（`size` 受控；演示 `onResize(setSizes)` 双向同步）
- 「Collapsible 动效 + motion 开关」demo
- 「Control collapsible icons」demo（`showCollapsibleIcon: 'auto' | true | false`）
- 「Lazy 模式」demo（`lazy: true`，松开才更新）
- 「Customize 图标」demo（`draggerIcon` / `collapsibleIcon`）
- 「Complex combination 嵌套」demo（Splitter 中嵌 Splitter）
- 「Custom semantic dom styling」demo
- 「Double-clicked reset」demo（`onDraggerDoubleClick`，6.3+）
  **ccui 特有 demo**：
- 无（ccui 是 ant Splitter 子集）

### Props 对比 — Splitter（容器）

**ccui 缺失的 ant props**：

- `orientation: 'horizontal' | 'vertical'`（ant 6.x 新命名；ccui 只用 `layout`，**命名差异显著**）
- `vertical: boolean`（顶层快捷写法）
- **`collapsible: { motion?: boolean; icon?: { start?: ReactNode; end?: ReactNode } }`** —— 容器层「全局折叠动效 + 图标」（6.4+）
- `draggerIcon: ReactNode`（自定义拖动条图标，6.0+）
- `lazy: boolean`（拖拽时不实时更新，松开才更新，5.23+）
- `destroyOnHidden: boolean`（折叠到 0 时销毁内容，6.4+）
- `onCollapse: (collapsed: boolean[], sizes: number[]) => void`（5.28+）
- `onDraggerDoubleClick: (index: number) => void`（6.3+）
- `classNames` / `styles` 语义化 DOM
  **命名/形状差异**：
- **`layout: 'horizontal' | 'vertical'` ↔ ant `orientation`**（ant 在表里仍保留 `~~layout~~` 作为 deprecated 别名 —— ccui 用的恰是 ant 已不推荐的名称）
  **ccui 特有 props**：
- 无

### Props 对比 — Splitter.Panel

**ccui 缺失的 ant props**：

- **`collapsible` 复杂形态 `{ start?: boolean; end?: boolean; showCollapsibleIcon?: boolean | 'auto' }`** —— ccui types 中虽然写了 `boolean | { start?: boolean; end?: boolean }`，但**没有 `showCollapsibleIcon` 字段**
- `destroyOnHidden: boolean`（覆盖 Splitter 同名 prop，6.4+）
- `size` / `defaultSize` / `min` / `max` 的「百分比字符串 `'50%'`」分支 —— ccui types 类型签名是 `number | string`，但**文档示例和 demo 全用纯数字 px，没有演示百分比是否真支持**（需要看实现）
  **命名/形状差异**：
- 默认值都一致（`min=0` / `resizable=true`）

### Events / 方法 对比

**缺失 events**：

- `@collapse(collapsed: boolean[], sizes: number[])` —— ccui 缺
- `@dragger-double-click(index)` —— ccui 缺
- `@resize` / `@resize-start` / `@resize-end` 已对应 ant 的 `onResize` / `onResizeStart` / `onResizeEnd` ✓
  **缺失 expose 方法**：双方均无（折叠/重置走 props + event 实现）

### 子组件 / 静态导出

**缺失**：

- ant 通过 `Splitter.Panel` 名字空间静态导出；ccui 用 `<c-splitter-panel>` 全局组件。功能等价，但**没有命名空间形态**
- ccui 内部 `SPLITTER_INJECT_KEY` / `SplitterContext`（含 `registerPanel`/`unregisterPanel`）是实现细节，未对外标注

---

## Button3d

- Ant 段：**无 ant 对应（项目特色 3D 按钮）**
- ccui types：`packages/ccui/ui/button-3d/src/button-3d-types.ts`
- ccui docs：`packages/docs/components/button-3d/index.md`
- ccui 自报状态：`100%`

### Demo 对比

**Ant 官方 demo（共 0 条）**：无对应组件。
**ccui 文档 demo（共 4 条）**：1. 基础用法（default/primary/success/warning/danger/info 六色）；2. 尺寸（large/default/small）；3. 禁用状态；4. 加载状态。
**ccui 缺失的 ant demo**：N/A
**ccui 特有 demo**：全部都是项目特色，灵感来自 Josh W Comeau 的「Building a Magical 3D Button」博客（文档已注明）

### Props 对比

**ccui 特有 props**：

- `size: 'large' | 'default' | 'small'`
- `type: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'`（**`secondary` 在 types 里存在，但文档没演示**；文档类型表只列了 primary/success/warning/danger/info）
- `disabled: boolean`
- `loading: boolean`
- `nativeType: 'button' | 'submit' | 'reset'`

### Events / 方法 对比

- 双方无显式 emit；走原生 `@click` 透传

### 子组件 / 静态导出

- 无；纯叶子组件

---

## Util

- Ant 段：`## _util`（行 7，ant 5.13.0+ 起作为独立段落，仅给出 4 个**类型工具**：`GetRef` / `GetProps` / `GetProp` / `GetProp` 的「Return」第三参用法）
- ccui 模块：`packages/ccui/ui/util/index.ts`（运行时工具集），子文件 `src/dom.ts` / `src/func.ts` / `src/type.ts`
- ccui docs：`packages/docs/components/util/index.md`
- ccui 自报状态：`100%`

### Demo 对比

**Ant 官方 demo（共 3 条 code block）**：1. `GetRef<typeof Select>`；2. `GetProps<typeof Checkbox.Group>` + Context 形态；3. `GetProp<typeof Select, 'options'>[number]` + `GetProp<Props, 'func', 'Return'>` 取函数返回值类型。
**ccui 文档 demo（共 1 条 code block）**：`classNames('a', { b: true })` + `clamp(15, 0, 10)` + `debounce(fn, 200)` 综合用法。
**ccui 缺失的 ant demo**：双方完全不同方向，**ccui 缺所有 ant 的类型助手 demo（GetRef / GetProps / GetProp）**
**ccui 特有 demo**：上文综合代码段

### Props / 导出 对比 — 方向不同的对照

**Ant `_util` 完全是「类型助手」（仅类型，无运行时）**：

- `GetRef<T>` —— 拿组件的 ref 类型（适合未直接 expose 的子组件）
- `GetProps<T>` —— 拿组件/Context 的 props 类型
- `GetProp<T, K>` —— 拿 props 中单字段类型（已套 NonNullable）
- `GetProp<T, K, 'Return'>` —— 拿函数 prop 的返回值类型

**ccui `util` 完全是「运行时函数工具集 + 少量类型守卫」**（详见 `index.ts`）：

- DOM 系：`inBrowser` / `canUseDom()` / `getOffset(el)` / `isVisible(el)` / `contains(parent, target)`
- 函数系：`debounce(fn, wait)` / `throttle(fn, wait)` / `noop()` / `isFunction(v)` / `isObject(v)`
- 类型/工具：`classNames(...args)` / `isNil(v)` / `clamp(val, min, max)`

**对照结论**：

- 方向完全不同：ant 给 TS 类型推导锐器，ccui 给开发者运行时基础设施（防抖/节流/类名合成/DOM 判定）
- ant 这套类型助手对 Vue 生态意义不大（Vue 的 props 类型推导路径与 React `GetProps`/`GetRef` 不同；Vue 用 `InstanceType<typeof X>` + `ExtractPropTypes` 即可）
- ccui 这套运行时工具对于使用方很有用，但不应被理解为「补齐 ant `_util`」 —— 二者只是恰好都叫 util
- **ccui 缺失的 ant 部分**：所有类型助手；**ant 缺失的 ccui 部分**：所有运行时函数

### 子组件 / 静态导出

- ant：`GetRef` / `GetProps` / `GetProp`（仅 type）
- ccui：上述 13 个运行时函数 + 默认导出的 `install(_: App)`（空注册，无组件挂载）
