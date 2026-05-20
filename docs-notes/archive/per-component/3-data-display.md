# 数据展示组件 vs Ant Design v6.3.7 全量 diff

> 范围：vue3-ccui 2.x 分支「数据展示」分组下 19 个组件 + Typography（通用分组）+ Watermark（Ant 在 Feedback 分组但 ccui 归在数据展示）。
> 参考：`D:\codetest\ccui\docs-notes\components-diff\references\.tmp-llms-full.txt`（Ant v6.3.7 LLM 全文）。

---

## Avatar

- Ant 段：`## avatar`（行 2425–2744）
- ccui types：`packages/ccui/ui/avatar/src/avatar-types.ts`
- ccui docs：`packages/docs/components/avatar/index.md`
- ccui 自报状态：100%

### Demo 对比

**Ant 官方 demo（共 6 条）**：1. Basic（三种尺寸 × 两种形状） 2. Type（图片 / 图标 / 字母，可自定义颜色） 3. Autoset Font Size（字母自适应字号，gap） 4. With Badge（与 Badge 组合） 5. Avatar.Group（头像组、max 折叠、popover trigger、shape） 6. Responsive Size（按断点 xs/sm/md/lg/xl/xxl 响应式尺寸）。

**ccui 文档 demo（共 7 条）**：1. 基本用法 2. 不同尺寸 3. 方形头像 4. 图片头像 5. 自定义显示文字 6. 性别配色 7. 显示规则。

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「Autoset Font Size」（ant 第 3 条）—— 字母过长时根据头像宽度自动缩字号，`gap` 控制左右间距。
- 「With Badge」（ant 第 4 条）—— 与 Badge 嵌套出现的提醒模式。
- 「Avatar.Group」（ant 第 5 条）—— 头像组堆叠 + `max.count` 折叠 + Tooltip。
- 「Responsive Size」（ant 第 6 条）—— `size={{ xs, sm, md, lg, xl, xxl }}` 响应式尺寸。

**ccui 特有 demo**：

- 「性别配色」—— ccui 自有 `gender: 'male' | 'female'` 业务字段，按性别自动配色。
- 「显示规则」—— 演示 `imgSrc / customText / name` 三者降级显示规则。

### Props 对比

**ccui 缺失的 ant props**（按 ant API 顺序）：

- `alt`（string，-）—— 图片替代文本，无障碍必备。
- `gap`（number，4，v4.3.0）—— 字母 Avatar 字母与左右边界的距离。
- `icon`（ReactNode，-）—— Icon 类型头像。
- `shape`（'circle' | 'square'，'circle'）—— ccui 仅有 `isRound: boolean`，缺 square 形状之外的统一抽象。
- `size`（number | 'large' | 'medium' | 'small' | 响应式对象，'medium'）—— ccui 只有 width/height number，未提供 size 枚举与响应式对象。
- `srcSet`（string，-）—— 不同 DPR 图源。
- `draggable`（boolean | 'true' | 'false'，true）—— 是否可拖拽。
- `crossOrigin`（'anonymous' | 'use-credentials' | ''，-）—— CORS 设置。
- `onError`（() => boolean，-）—— 图片加载失败回调，返回 false 阻止默认 fallback。
- Avatar.Group 整体（`max`、`size`、`shape`）—— ccui 未提供 Group 组件。

**命名/形状差异**：

- `imgSrc` vs ant `src`：ccui 用驼峰自创字段，命名不一致。
- `isRound: boolean` vs ant `shape: 'circle' | 'square'`：表达能力更弱。
- `width` / `height` 两个数字 vs ant 统一 `size`。
- `customText` vs ant 直接 children/字母。

**ccui 特有 props**：

- `name`（string）—— 自动取首字符显示。
- `gender`（'male' | 'female' | string）—— 性别配色业务字段。
- `fit`（'fill' | 'contain' | 'cover' | 'none' | 'scale-down'）—— object-fit，ant 由 `src` 元素自行处理。
- `customText`（string）—— 自定义内显文字。

### Events / 方法 对比

**缺失 events**：- `onError`（图片加载失败）。

**缺失 expose 方法**：- 无（Avatar 本身 ant 无 expose）。

### 子组件 / 静态导出

**缺失**：

- `Avatar.Group`（头像组，max.count / max.style / max.popover 配置、size、shape）。

---

## Badge

- Ant 段：`## badge`（行 2746–3308）
- ccui types：`packages/ccui/ui/badge/src/badge-types.ts`
- ccui docs：`packages/docs/components/badge/index.md`
- ccui 自报状态：100%

### Demo 对比

**Ant 官方 demo（共 10 条）**：1. Basic（count、showZero、count 为 ReactNode 图标） 2. Standalone（独立使用，count 0 隐藏、color、自定义 backgroundColor） 3. Overflow Count（`overflowCount` 99+） 4. Red badge（dot 模式） 5. Dynamic（动态增减，动画过渡） 6. Clickable（包 `<a>` 可点击） 7. Offset（`offset=[x,y]`） 8. Size（`size: 'medium' | 'small'`） 9. Status（status + text，5 种状态） 10. Colorful Badge（13 种 preset + 自定义 hex/rgb/hsl/hwb） 11. Ribbon（Badge.Ribbon 缎带） 12. Custom semantic dom styling（classNames / styles 函数）。

> 实际 ant 段含 11 个 example block + 1 个 semantic，按 ant cols=2 顺序如上。

**ccui 文档 demo（共 5 条）**：1. 基本使用 2. 独立使用 3. 小红点 4. 状态点 5. 多彩标签（在 docs grep 中只出现到「状态点」，实际页面再追加 Colorful）。

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「Overflow Count」（ant 第 3 条）—— `overflowCount` 自定义溢出阈值。
- 「Dynamic」（ant 第 5 条）—— 数值动画过渡。
- 「Clickable」（ant 第 6 条）—— 链接包裹场景。
- 「Offset」（ant 第 7 条）—— badge 相对默认位置的偏移。
- 「Size」（ant 第 8 条）—— `size: small | medium` 两档。
- 「Colorful Badge」（ant 第 10 条）—— 13 种 preset 色 + 任意 CSS 色值。
- 「Ribbon」（ant 第 11 条）—— Badge.Ribbon 缎带，色 / placement。
- 「Custom semantic dom styling」—— classNames / styles。

**ccui 特有 demo**：- 无（均为 ant 子集）。

### Props 对比

**ccui 缺失的 ant props**（按 ant API 顺序）：

- `count` 接受 ReactNode（除 number/string 外允许图标节点）—— ccui 限制为 `number | string`。
- `classNames`（Record<SemanticDOM, string> | 函数）—— 语义化结构 class。
- `size`（'medium' | 'small'）—— 数字徽标尺寸。
- `styles`（Record<SemanticDOM, CSSProperties> | 函数）—— 语义化结构内联样式。
- `title`（string）—— 鼠标悬停 title 属性。

**命名/形状差异**：

- `offset` 类型一致，均 `[number, number]`。
- `color` 一致；ccui 没有把 13 种 preset 显式列出（实现里仅作字符串透传）。

**ccui 特有 props**：- 无。

### Events / 方法 对比

**缺失 events**：- 无（ant Badge 本身无 events，Ribbon 也无）。
**缺失 expose 方法**：- 无。

### 子组件 / 静态导出

**缺失**：

- `Badge.Ribbon`（缎带：`color` / `placement: 'start' | 'end'` / `text` / `classNames` / `styles`）。

---

## Calendar

- Ant 段：`## calendar`（行 5138–5907）
- ccui types：`packages/ccui/ui/calendar/src/calendar-types.ts`
- ccui docs：`packages/docs/components/calendar/index.md`
- ccui 自报状态：100%

### Demo 对比

**Ant 官方 demo（共 8 条）**：1. Basic（onPanelChange） 2. Notice Calendar（dateCellRender / monthCellRender / cellRender 统一） 3. Card（fullscreen=false 卡片模式） 4. Selectable Calendar（受控 value/onSelect/onPanelChange） 5. Lunar Calendar（农历 + headerRender 完全自定义） 6. Show Week（5.23.0 showWeek 周序号） 7. Customize Header（headerRender） 8. Custom semantic dom styling（classNames / styles 对象 + 函数）。

**ccui 文档 demo（共 6 条）**：1. 基本使用 2. 监听变化 3. 只读模式 4. 自定义 header 5. 自定义日期 cell 6. 选中信息回显。

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「Card」（ant 第 3 条）—— `fullscreen={false}` 嵌入有限容器的卡片模式。
- 「Lunar Calendar」（ant 第 5 条）—— 农历/节气/节假日叠加渲染 + headerRender 完全替换。
- 「Show Week」（ant 第 6 条）—— `showWeek` 显示周序号（v5.23.0）。
- 「Custom semantic dom styling」（ant 第 8 条）—— classNames / styles。

**ccui 特有 demo**：

- 「只读模式」—— ccui 自创 `readOnly: boolean`，ant 没有此 prop（ant 用 `disabledDate` / 受控 value）。
- 「选中信息回显」—— 自定义示例（实质等同 Selectable Calendar）。

### Props 对比

**ccui 缺失的 ant props**（按 ant API 顺序）：

- `cellRender`（(current, info) => ReactNode，v5.4.0）—— 统一渲染入口。
- `classNames` / `styles`（语义化）。
- `dateFullCellRender`（(date) => ReactNode）—— 覆盖整个日期单元。
- `fullCellRender`（v5.4.0）—— 同上的新名。
- `defaultValue`（Dayjs）—— 默认日期，ccui 只有受控 `modelValue`。
- `disabledDate`（(currentDate) => boolean）—— 禁用日期。
- `fullscreen`（boolean，true）—— 全屏/卡片切换。
- `showWeek`（boolean，false，v5.23.0）—— 周序号列。
- `headerRender`（({value,type,onChange,onTypeChange}) => ReactNode）—— 完全替换头部。
- `locale`（object）—— i18n 区域。
- `mode`（'month' | 'year'）—— 面板模式。
- `validRange`（[dayjs, dayjs]）—— 有效范围。
- `value`（dayjs）—— ccui modelValue 用原生 Date，未支持 dayjs 对象。

**命名/形状差异**：

- ccui `modelValue: Date` vs ant `value: Dayjs`。
- ccui 仅暴露 `readOnly`，ant 没有该字段。

**ccui 特有 props**：

- `readOnly`（boolean）—— ccui 自创。

### Events / 方法 对比

**缺失 events**：

- `onChange(date: Dayjs)`。
- `onPanelChange(date: Dayjs, mode: string)`。
- `onSelect(date: Dayjs, info: { source: 'year' | 'month' | 'date' | 'customize' })`。

**缺失 expose 方法**：- 无（ant 无 expose）。

### 子组件 / 静态导出

**缺失**：- 无。

---

## Card

- Ant 段：`## card`（行 5908–6513）
- ccui types：`packages/ccui/ui/card/src/card-types.ts`
- ccui docs：`packages/docs/components/card/index.md`
- ccui 自报状态：100%

### Demo 对比

**Ant 官方 demo（共 10 条）**：1. Basic card（title + extra + size） 2. No border（`variant="borderless"`） 3. Simple card（仅内容） 4. Customized content（Card.Meta avatar/title/description + hoverable + cover） 5. Card in column（栅格嵌入） 6. Loading card（loading + actions + Meta） 7. Grid card（Card.Grid） 8. Inner card（type="inner" 嵌套） 9. With tabs（tabList + activeTabKey + tabBarExtraContent + tabProps） 10. Support more content configuration（cover + actions + Meta avatar） 11. Custom semantic dom styling。

**ccui 文档 demo（共 6 条）**：1. 基本用法 2. 阴影效果 3. 自定义标题区 4. 不带标题 5. 自定义内容内边距 6. 卡片栅格（Row/Col 中嵌入）。

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「No border / variant」（ant 第 2 条）—— `variant: 'outlined' | 'borderless'`。
- 「Customized content（Card.Meta）」（ant 第 4 条）—— `Card.Meta` 三段式：avatar / title / description。
- 「Loading card」（ant 第 6 条）—— `loading`、`actions`（卡片底部操作位）。
- 「Grid card」（ant 第 7 条）—— `Card.Grid` 网格子卡。
- 「Inner card」（ant 第 8 条）—— `type="inner"` 嵌套卡。
- 「With tabs」（ant 第 9 条）—— 内置 Tabs：`tabList` / `activeTabKey` / `defaultActiveTabKey` / `tabBarExtraContent` / `tabProps` / `onTabChange`。
- 「Support more content configuration」（ant 第 10 条）—— cover + actions + Meta avatar 组合。
- 「Custom semantic dom styling」—— classNames / styles + Meta styles。

**ccui 特有 demo**：

- 「阴影效果」—— 演示 `shadow: 'always' | 'hover' | 'never'`，ant 无此抽象（ant 用 `variant` + `hoverable`）。
- 「自定义内容内边距」—— 演示 `bodyStyle`（ant 已废弃此 prop，改 `styles.body`）。

### Props 对比

**ccui 缺失的 ant props**（按 ant API 顺序）：

- `actions`（ReactNode[]）—— 卡片底部操作列表。
- `activeTabKey` / `defaultActiveTabKey`—— Tabs 受控 / 非受控。
- `variant`（'outlined' | 'borderless'，v5.24.0）—— 卡片变体。
- `classNames` / `styles`（语义化）。
- `cover`（ReactNode）—— 封面区。
- `extra`（ReactNode）—— 右上角附加内容。
- `hoverable`（boolean）—— 悬浮态。
- `loading`（boolean）—— 加载占位。
- `size`（'medium' | 'small'）—— 尺寸。
- `tabBarExtraContent`（ReactNode）。
- `tabList`（TabItemType[]）。
- `tabProps`（透传 Tabs props）。
- `title`（ReactNode）—— 注意 ccui `header: string`，与 ReactNode/插槽差异大。
- `type`（'inner' | undefined）—— 内嵌卡片样式。
- `onTabChange`（(key) => void）。

**命名/形状差异**：

- `header: string` vs ant `title: ReactNode`，ccui 用字符串、不支持 VNode；title 与 header 命名也不一致。
- `bodyStyle` 保留：ant v6 已 deprecated 此名，推荐 `styles.body`。

**ccui 特有 props**：

- `shadow`（'always' | 'hover' | 'never'）—— 阴影策略，ant 用 `variant` + `hoverable` 表达。

### Events / 方法 对比

**缺失 events**：- `onTabChange`。
**缺失 expose 方法**：- 无。

### 子组件 / 静态导出

**缺失**：

- `Card.Meta`（avatar / title / description / className / style，含 `styles` / `classNames`）。
- `Card.Grid`（hoverable / className / style）。

---

## Carousel

- Ant 段：`## carousel`（行 6514–6871）
- ccui types：`packages/ccui/ui/carousel/src/carousel-types.ts`
- ccui docs：`packages/docs/components/carousel/index.md`
- ccui 自报状态：80%

### Demo 对比

**Ant 官方 demo（共 6 条）**：1. Basic（afterChange） 2. Position（`dotPlacement: top | bottom | start | end`） 3. Scroll automatically（autoplay） 4. Fade in（effect="fade"） 5. Arrows for switching（arrows + dotPlacement） 6. Progress of dots（`autoplay={{ dotDuration: true }}` 进度条）。

**ccui 文档 demo（共 9 条）**：1. 基本用法 2. 自动播放 3. 指示器位置 4. 渐隐切换 5. 前后切换箭头 6. 触摸滑动 7. 自定义指示器 8. 受控模式 9. 命令式调用。

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「Progress of dots」（ant 第 6 条）—— `autoplay={{ dotDuration: true }}` 在指示器上显示自动播放进度条（v5.24.0）。

**ccui 特有 demo**：

- 「触摸滑动」—— ccui 自有 `swipeable` / `swipeThreshold`。
- 「自定义指示器」—— 通过 slot 定制指示器（ant 用 `dots: { className }`）。
- 「受控模式」—— `v-model:value` 双向绑定。
- 「命令式调用」—— 暴露 `goTo / next / prev / getCurrentIndex`。

### Props 对比

**ccui 缺失的 ant props**（按 ant API 顺序）：

- `autoplay` 接受 `{ dotDuration?: boolean }`（ccui 只 boolean）。
- `autoplaySpeed`（ccui 已有，但叫 `autoplaySpeed`，ant 同名同 default 3000，一致）。
- `adaptiveHeight`（boolean）—— 自适应当前 slide 高度。
- `dotPlacement`（ant 新名，'top' | 'bottom' | 'start' | 'end'，ccui 用旧名 `dotPosition` 并含 'left' | 'right'）。
- `dots` 接受 `{ className?: string }`（ccui 只 boolean）。
- `draggable`（boolean，false）—— 桌面端鼠标拖动；ccui 名 `swipeable`，default true 与 ant draggable=false 行为相反。
- `fade`（boolean）—— 与 `effect="fade"` 二者其一即可。
- `speed`（number，500）—— ccui 用 `duration: 500`，名字不同。
- `easing`（string，'linear'）—— 缓动函数名。
- `waitForAnimate`（boolean）—— 切换中是否等待动画结束。
- `beforeChange`（(current, next) => void）。
- `afterChange`（(current) => void）—— ccui 改用 `change` / `update:modelValue` 事件。

**命名/形状差异**：

- `dotPosition` (ccui) vs `dotPlacement` (ant，旧名 `dotPosition` 已 deprecated)。ccui 仍含 ant 弃用名。
- `effect` 取值一致（'scrollx' | 'fade'）。
- `swipeable` (ccui, default true) vs `draggable` (ant, default false) 含义近似但默认值相反。
- `duration` (ccui) vs `speed` (ant)。

**ccui 特有 props**：

- `modelValue`（受控当前索引，ant 没有受控 prop，需用 ref.goTo）。
- `defaultActive`（非受控默认索引）。
- `pauseOnHover`（boolean，hover 暂停 autoplay；ant 在 react-slick 透传，非顶层 prop）。
- `swipeThreshold`（number，触发阈值像素）。

### Events / 方法 对比

**缺失 events**：- `beforeChange(current, next)`、`afterChange(current)`（ant 命名）。ccui 用 `change`。
**缺失 expose 方法**：- 无（ccui 已有 goTo/next/prev，且多一个 getCurrentIndex）。

### 子组件 / 静态导出

**缺失**：- 无。

---

## Collapse

- Ant 段：`## collapse`（行 9612–10318）
- ccui types：`packages/ccui/ui/collapse/src/collapse-types.ts`
- ccui docs：`packages/docs/components/collapse/index.md`
- ccui 自报状态：100%

### Demo 对比

**Ant 官方 demo（共 10 条）**：1. Collapse（items API + onChange） 2. Size（large / medium / small） 3. Accordion（手风琴） 4. Nested panel（嵌套） 5. Borderless（`bordered={false}`） 6. Custom Panel（expandIcon + 自定义背景） 7. No arrow（`showArrow={false}`） 8. Extra node（`extra` + `expandIconPlacement`） 9. Ghost Collapse（`ghost` 透明背景） 10. Collapsible（`collapsible: header | icon | disabled`） 11. Custom semantic dom styling。

**ccui 文档 demo（共 6 条）**：1. 基本使用 2. 手风琴模式 3. 无边框 / 幽灵风格 4. 展开图标位置 5. 自定义标题 6. 监听变化。

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「Size」（ant 第 2 条）—— `size: 'large' | 'medium' | 'small'`（v5.2.0），ccui 无 size prop。
- 「Nested panel」（ant 第 4 条）—— 嵌套 Collapse。
- 「Custom Panel」（ant 第 6 条）—— `expandIcon`（render 函数）+ items 单项 style。
- 「No arrow」（ant 第 7 条）—— item 级 `showArrow=false`（ccui CollapseItem 已有 showArrow，但缺示例）。
- 「Extra node」（ant 第 8 条）—— `extra` 角落附加节点。
- 「Collapsible」（ant 第 10 条）—— `collapsible: 'header' | 'icon' | 'disabled'`。
- 「Custom semantic dom styling」—— classNames / styles。

**ccui 特有 demo**：- 无。

### Props 对比

**ccui Collapse 缺失的 ant props**：

- `classNames` / `styles`（语义化）。
- `collapsible`（'header' | 'icon' | 'disabled'，v4.9.0）—— 控制触发区域。
- `destroyOnHidden`（boolean，false，v5.25.0）—— 隐藏时销毁面板（旧 `destroyInactivePanel` deprecated）。
- `expandIcon`（(panelProps) => ReactNode）—— 自定义展开图标。
- `expandIconPlacement`（'start' | 'end'，'start'）—— ccui 用 `expandIconPosition`，新名 placement 是 ant 新名（v6 推荐 placement）。
- `size`（'large' | 'medium' | 'small'，'medium'，v5.2.0）。
- `items`（[ItemType]，v5.6.0）—— ccui 仍是 slot/子组件模式，没有 items 数组 API。

**Collapse.Item 缺失**：

- `forceRender`（强制渲染未展开 panel）。
- `extra`（角落附加节点）。
- `collapsible`（item 级覆盖）。
- `classNames` / `styles`（item 级）。
- `label`（ant 用 `label` 在 items 数组里；ccui 用 `title`）。

**命名/形状差异**：

- ccui `modelValue` vs ant `activeKey` / `defaultActiveKey`。
- ccui `expandIconPosition` vs ant `expandIconPlacement`（ant v6 新名）。
- ccui CollapseItem `name` 必填 vs ant items 的 `key`。
- ccui CollapseItem `title` vs ant `label`。

**ccui 特有 props**：- 无。

### Events / 方法 对比

**缺失 events**：- 无（ccui 已有 change）。
**缺失 expose 方法**：- 无。

### 子组件 / 静态导出

**缺失**：- 无（Collapse.Panel 在 ant v5+ 已 deprecated，推荐 items；ccui 沿用 CollapseItem 子组件，匹配 ant <5.6.0 风格）。

---

## Descriptions

- Ant 段：`## descriptions`（行 14092–14815）
- ccui types：`packages/ccui/ui/descriptions/src/descriptions-types.ts`
- ccui docs：`packages/docs/components/descriptions/index.md`
- ccui 自报状态：100%

### Demo 对比

**Ant 官方 demo（共 7 条）**：1. Basic（items） 2. border（bordered + items 含 span 配置） 3. Custom size（large/middle/small） 4. responsive（`column={{ xs,sm,md,lg,xl,xxl }}` + 单 item `span` 响应式） 5. Vertical（layout="vertical"） 6. Vertical border（vertical + bordered） 7. Custom semantic dom styling（classNames + styles） 8. row（`span: 'filled'` 整行填充，v5.22.0）。

**ccui 文档 demo（共 6 条）**：1. 基本使用 2. 带边框 3. 控制列数 4. 不同尺寸 5. 纵向布局 6. 隐藏冒号 / 自定义样式。

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「responsive」（ant 第 4 条）—— `column` 接收 `Record<Breakpoint, number>` + 单 item `span` 也支持响应式对象（v5.9.0 screens）。
- 「Custom semantic dom styling」—— classNames / styles 函数。
- 「row / filled span」（ant 第 8 条）—— `span: 'filled'` 单行填充剩余宽度（v5.22.0）。

**ccui 特有 demo**：

- 「隐藏冒号 / 自定义样式」—— 演示 `colon=false` + 自定义 label/content style；ant `colon` 也存在，但 ccui 是单独 demo 强调。

### Props 对比

**ccui Descriptions 缺失**：

- `classNames` / `styles`（语义化）。
- `extra`（ReactNode，v4.5.0）—— 右上角操作区。ccui 有 `extra: string`，但限制为字符串。
- `column` 接收 `Record<Breakpoint, number>`（ccui 仅 number）。

**DescriptionItem 缺失**：

- `span: 'filled' | number | Screens`（ccui 仅 number）。
- ant 实际新版 item 通过 `items` 数组而非子组件，ccui 同时支持子组件与 items 数组（DescriptionsItem interface 已含 value/labelStyle/contentStyle/span）。

**命名/形状差异**：

- ccui `extra: string` vs ant `extra: ReactNode`。
- ccui `size: 'small' | 'middle' | 'default'` vs ant `size: 'large' | 'middle' | 'small'`（ant 默认 large；ccui 默认 default）。
- ccui `items` 字段为 `{ label, value, span, labelStyle, contentStyle }`，ant items 为 `{ key, label, children, span, labelStyle, contentStyle }`（ant 用 `children` 而非 `value`）。

**ccui 特有 props**：- 无。

### Events / 方法 对比

**缺失 events**：- 无（ant 也无）。
**缺失 expose 方法**：- 无。

### 子组件 / 静态导出

**缺失**：- 无（ccui 已有 DescriptionsItem 子组件）。

---

## Empty

- Ant 段：`## empty`（行 17518–17804）
- ccui types：`packages/ccui/ui/empty/src/empty-types.ts`
- ccui docs：`packages/docs/components/empty/index.md`
- ccui 自报状态：100%

### Demo 对比

**Ant 官方 demo（共 6 条）**：1. Basic 2. Choose image（`image={Empty.PRESENTED_IMAGE_SIMPLE}`） 3. Customize（自定义 image url + description + extra Button） 4. ConfigProvider（`renderEmpty` 全局替换 Select / TreeSelect / Cascader / Transfer / Table / List 的空态） 5. Custom semantic dom styling 6. No description（`description={false}`）。

**ccui 文档 demo（共 7 条）**：1. 基本使用 2. 自定义文案 3. 配合操作按钮 4. 使用图片 URL 5. 调整图片尺寸 6. 自定义插画 7.（slot）。

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「Choose image / PRESENTED_IMAGE_SIMPLE」（ant 第 2 条）—— 静态属性切换 SIMPLE / DEFAULT 两套内置图。
- 「ConfigProvider 全局替换」（ant 第 4 条）—— 通过 ConfigProvider.renderEmpty 让所有「无数据」组件统一使用自定义空态。
- 「Custom semantic dom styling」—— classNames / styles 函数。
- 「No description（description={false}）」（ant 第 6 条）—— `description=false` 不渲染描述文字。

**ccui 特有 demo**：

- 「自定义插画」—— ccui 用 slot 替换插画；ant 用 `image` ReactNode。
- 「调整图片尺寸」—— ccui 用 `imageStyle: object`（ant deprecated 此 prop，改 `styles.image`）。

### Props 对比

**ccui 缺失的 ant props**：

- `classNames` / `styles`（语义化，含 root / image / description / footer）。
- `image` 接受 ReactNode（ccui 仅 string url）。
- `description` 接受 ReactNode / `false`（ccui 仅 string）。

**命名/形状差异**：

- ccui `imageStyle: object`（ant 已 deprecated `imageStyle`，改 `styles.image`）。

**ccui 特有 props**：- 无（imageStyle 是 ant 旧 prop）。

### Events / 方法 对比

**缺失 events**：- 无。
**缺失 expose 方法**：- 无。

### 子组件 / 静态导出

**缺失**：

- `Empty.PRESENTED_IMAGE_DEFAULT`（默认插画引用）。
- `Empty.PRESENTED_IMAGE_SIMPLE`（简单插画引用）。

---

## Image

- Ant 段：`## image`（行 23940–24895）
- ccui types：`packages/ccui/ui/image/src/image-types.ts`
- ccui docs：`packages/docs/components/image/index.md`
- ccui 自报状态：100%

### Demo 对比

**Ant 官方 demo（共 11 条）**：1. Basic Usage（width + alt + src） 2. Progressive Loading（`placeholder={{ progress: true | { percent, render } }}`，v6 新增） 3. Fault tolerant（fallback base64） 4. Multiple image preview（Image.PreviewGroup + preview.onChange） 5. Preview from one image（PreviewGroup `items` 数组） 6. Custom preview image（`preview.src`） 7. Controlled Preview（`preview.open` / `preview.scaleStep` / `onOpenChange`） 8. Custom toolbar render（`preview.actionsRender`） 9. Custom preview render（`preview.imageRender` 显示 video） 10. preview mask（`preview.mask = { blur } | false` + `preview.cover`） 11. Custom semantic dom styling 12. nested（在 Modal 中嵌套预览）。

**ccui 文档 demo（共 6 条）**：1. 基本使用 2. 大图预览 3. 适应方式 4. 加载失败兜底 5. 懒加载 6. 自定义占位。

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「Progressive Loading」（ant 第 2 条）—— `placeholder.progress` 水墨/进度条加载占位。
- 「Multiple image preview（PreviewGroup）」（ant 第 4 条）—— Image.PreviewGroup 多图预览。
- 「Preview from one image（PreviewGroup items）」（ant 第 5 条）—— 单图触发的图集预览。
- 「Custom preview image」（ant 第 6 条）—— `preview.src` 缩略图与预览图分离。
- 「Controlled Preview」（ant 第 7 条）—— `preview.open` 受控，`scaleStep`。
- 「Custom toolbar render」（ant 第 8 条）—— `preview.actionsRender` 自定义工具栏（含 onActive / onFlipX/Y / onRotateLeft/Right / onZoomIn/Out / onReset / onClose）。
- 「Custom preview render」（ant 第 9 条）—— `preview.imageRender` 把预览替换成 video 等。
- 「preview mask」（ant 第 10 条）—— `preview.mask.blur` 模糊蒙层、`preview.cover` 自定义遮罩内容（v6.0+ 含 CoverConfig.placement）。
- 「Custom semantic dom styling」—— classNames / styles。
- 「nested」—— 与 Modal 嵌套时正确触发预览层。

**ccui 特有 demo**：

- 「适应方式」—— `fit: object-fit` 演示。
- 「懒加载」—— ccui 自有 `lazy` + `rootMargin`（用 IntersectionObserver）。

### Props 对比

**ccui Image 缺失的 ant props**：

- `classNames` / `styles`（语义化）。
- `placeholder`（ReactNode | PlaceholderType）—— ccui 仅 slot；缺 `{ progress: boolean | { percent, render } }` 结构。
- `preview`（boolean | PreviewType）—— ccui 仅 boolean，缺整个 PreviewType 配置：
  - `actionsRender`、`closeIcon`、`cover`、`focusTrap`（v6.4.0）、`getContainer`、`imageRender`、`mask: { enabled, blur, closable }`、`maxScale`、`minScale`、`movable`、`open`、`rootClassName`、`scaleStep`、`src`、`styles`、`onOpenChange`、`onTransform`。

**命名/形状差异**：

- ccui `fallback: string` 一致。
- ccui `fit` 通过 `object-fit` 用 css 控制，ant 由 `<img>` 元素属性透传，差异不大。
- ccui `preview: boolean` vs ant `preview: boolean | PreviewType`。

**ccui 特有 props**：

- `lazy`（boolean）—— 懒加载（ant 由 `<img loading>` 原生支持，无独立 prop）。
- `rootMargin`（string）—— IntersectionObserver 根边距。
- `fit`（object-fit 5 值）—— ccui 顶层 prop，ant 走 style。

### Events / 方法 对比

**缺失 events**：- `onError(event)`（图片加载错误，ccui 暴露在 slot/无显式 prop）。
**缺失 expose 方法**：- 无（ant 无 expose）。

### 子组件 / 静态导出

**缺失**：

- `Image.PreviewGroup`（多图预览容器：items / preview / onChange / countRender / current / 全套 PreviewGroupType）—— **必须点出**。

---

## List

- Ant 段：`## list`（行 27445–28667，标记 `tag: DEPRECATED`，ant v6 推荐 Listy）
- ccui types：`packages/ccui/ui/list/src/list-types.ts`
- ccui docs：`packages/docs/components/list/index.md`
- ccui 自报状态：100%

### Demo 对比

**Ant 官方 demo（共 11 条）**：1. Simple list（size + header + footer + bordered） 2. Basic list（List.Item + List.Item.Meta） 3. Load more（loadMore + Skeleton） 4. Vertical（itemLayout=vertical + extra） 5. Pagination Settings（pagination.position / align） 6. Grid（grid={{gutter, column}}） 7. Responsive grid list（grid 含 xs/sm/md/lg/xl/xxl） 8. Scrolling loaded（react-infinite-scroll-component） 9. Drag sorting（dnd-kit） 10. Drag sorting with handler 11. Grid Drag sorting 12. Grid Drag sorting with handler 13. virtual list（@rc-component/virtual-list）。

**ccui 文档 demo（共 4 条）**：1. 基本使用 2. 带头尾 3. 加载状态 4. 空状态。

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「Basic list（List.Item.Meta）」（ant 第 2 条）—— Meta avatar / title / description 三段式。
- 「Load more」（ant 第 3 条）—— `loadMore` slot + Skeleton。
- 「Vertical（itemLayout=vertical + extra）」（ant 第 4 条）—— extra 区。
- 「Pagination Settings」（ant 第 5 条）—— pagination position（top/bottom/both）+ align。
- 「Grid」（ant 第 6 条）—— `grid={{ gutter, column }}` 网格布局。
- 「Responsive grid list」（ant 第 7 条）—— grid xs/sm/md/lg/xl/xxl/xxxl（xxxl v6.3.0）。
- 「Scrolling loaded」（ant 第 8 条）—— 无限滚动加载。
- 「Drag sorting / handler / Grid Drag sorting / Grid Drag sorting with handler」（ant 第 9-12 条）—— dnd-kit 整合的 4 种拖拽形态。
- 「virtual list」（ant 第 13 条）—— 虚拟列表。

**ccui 特有 demo**：

- 「空状态」—— 当 dataSource 为空时的处理。

### Props 对比

**ccui 缺失的 ant props**（按 ant API 顺序）：

- `footer`（ReactNode）—— 列表尾。
- `header`（ReactNode）—— 列表头。ccui 通过 slot。
- `grid`（object）—— 网格布局：`{ gutter, column, xs, sm, md, lg, xl, xxl, xxxl }`（xxxl v6.3.0）。
- `loadMore`（ReactNode）—— 加载更多区域。
- `locale`（object）—— `emptyText` 等。
- `pagination`（boolean | object）—— 含 `position: 'top' | 'bottom' | 'both'` 与 `align: 'start' | 'center' | 'end'`。
- `renderItem`（(item, index) => ReactNode）—— ccui 通过 slot；缺以函数形式。
- List.Item 子组件：`actions`、`extra`、`classNames`、`styles`（v5.18.0）。
- List.Item.Meta（avatar / title / description）—— 缺整个子组件。

**命名/形状差异**：

- ccui `size: 'large' | 'default' | 'small'` vs ant `'default' | 'large' | 'small'`（一致）。
- ccui 已有 `bordered` / `split` / `dataSource` / `loading` / `itemLayout` / `rowKey`，命名都与 ant 对齐。

**ccui 特有 props**：

- `layout`（'horizontal' | 'vertical'）—— 与 ant `itemLayout` 重复；ccui 同时保留两个字段。

### Events / 方法 对比

**缺失 events**：- 无（ant List 本身无 events）。
**缺失 expose 方法**：- 无。

### 子组件 / 静态导出

**缺失**：

- `List.Item` 增强：`actions` / `extra` / `classNames` / `styles`（ccui ListItem 接受任意结构，未声明 props）。
- `List.Item.Meta`（avatar / title / description）—— **完全缺失**。

---

## QRCode

- Ant 段：`## qr-code`（行 36055–36553）
- ccui types：`packages/ccui/ui/qr-code/src/qr-code-types.ts`
- ccui docs：`packages/docs/components/qr-code/index.md`
- ccui 自报状态：80%

### Demo 对比

**Ant 官方 demo（共 9 条）**：1. base（基础 + Input 双绑） 2. With Icon（中心 logo） 3. other status（status: loading / expired / scanned + onRefresh） 4. custom status render（`statusRender(info)` 自定义状态遮罩） 5. Custom Render Type（type: canvas / svg） 6. Custom Size（size + iconSize） 7. Custom Color（color + bgColor） 8. Download QRCode（canvas → toDataURL，svg → blob） 9. Error Level（L/M/Q/H） 10. Advanced Usage（Popover 包裹） 11. Custom semantic dom styling。

**ccui 文档 demo（共 9 条）**：1. 基本用法 2. 自定义颜色与边长 3. 容错率 4. 嵌入 logo 5. 状态 6. 自定义状态遮罩 7. 圆角点阵 8. 渐变前景 9. 无边框。

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「Custom Render Type」（ant 第 5 条）—— `type: 'canvas' | 'svg'` 切换。ccui 实现仅 canvas（无 type prop）。
- 「Download QRCode」（ant 第 8 条）—— 演示 toDataURL（ccui 已 expose `toDataURL`，但缺示例）。
- 「Advanced Usage（Popover）」（ant 第 10 条）—— 在 Popover 中弹出 QRCode。
- 「Custom semantic dom styling」—— classNames / styles。

**ccui 特有 demo**：

- 「圆角点阵」—— ccui 自有 `dotRadius`（ant 无）。
- 「渐变前景」—— ccui 自有 `gradient` 对象（ant 无）。
- 「无边框」—— 演示 `bordered=false`（ant 也有，但未单独 demo）。

### Props 对比

**ccui 缺失的 ant props**：

- `value: string | string[]`（ccui 仅 string；ant `string[]` v5.28.0）。
- `type`（'canvas' | 'svg'，'canvas'，v5.6.0）—— 渲染方式切换。
- `iconSize: number | { width, height }`（ccui 仅 number，v5.19.0 扩展对象）。
- `classNames` / `styles`（语义化）。
- `marginSize`（number，0，v6.2.0）—— 静默区（modules 数）。
- `boostLevel`（boolean，true，v5.28.0）—— 自动提升纠错等级。
- `statusRender`（(info) => ReactNode，v5.20.0）—— ccui 已实现，需对齐 info 字段。

**命名/形状差异**：

- ccui 颜色字段 `color` / `bgColor` 与 ant 一致。
- ccui `dotRadius` (0~0.5) 与 ant 无对应（ant 不支持点阵圆角）。

**ccui 特有 props**：

- `dotRadius`（number，点阵圆角）。
- `gradient`（{ type, direction, from, to }，渐变前景）。
- `refreshText`（string，「点击刷新」文案；ant 通过 locale 注入）。

### Events / 方法 对比

**缺失 events**：- `onRefresh`（status='expired' 时点击触发；ccui 有 expose 但需事件入口）。
**缺失 expose 方法**：- 无（ccui 已有 `toDataURL`）。

### 子组件 / 静态导出

**缺失**：- 无。

---

## Rate

- Ant 段：`## rate`（行 37228–37473，注：ant 把 Rate 归在 Data Entry）
- ccui types：`packages/ccui/ui/rate/src/rate-types.ts`
- ccui docs：`packages/docs/components/rate/index.md`
- ccui 自报状态：100%

### Demo 对比

**Ant 官方 demo（共 8 条）**：1. Basic 2. Sizes（large / medium / small，v6.4 新增） 3. Half star（allowHalf） 4. Show copywriting（tooltips 文案数组 + TooltipProps） 5. Read only（disabled） 6. Clear star（allowClear） 7. Other Character（character 单字符 / icon / 中文） 8. Customize character（`character: (RateProps) => ReactNode` 按 index 分配）。

**ccui 文档 demo（共 5 条）**：1. 只读模式 2. 动态模式 3. 动态模式-自定义 4. 半选模式 5. 使用 color 参数。

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「Sizes」（ant 第 2 条）—— `size: 'small' | 'medium' | 'large'`。ccui 无 size prop。
- 「Show copywriting / tooltips」（ant 第 4 条）—— `tooltips: TooltipProps[] | string[]` 每星 tooltip。
- 「Clear star（allowClear）」（ant 第 6 条）—— 再次点击当前值是否清零。
- 「Other Character」（ant 第 7 条）—— `character` 接受 ReactNode / icon / 任意文字。
- 「Customize character」（ant 第 8 条）—— `character` 接受函数。

**ccui 特有 demo**：

- 「动态模式-自定义」—— 通过 slot 或 character props 自定义渲染。
- 「使用 color 参数」—— ccui `color` 直接改星星填充色。

### Props 对比

**ccui 缺失的 ant props**：

- `allowClear`（boolean，true）—— 点击当前值清零。
- `character`（ReactNode | (props) => ReactNode）—— 自定义节点。
- `className`（ant 透传 root 类，所有组件 common props）。
- `keyboard`（boolean，true，v5.18.0）—— 是否启用键盘操作。
- `size`（'small' | 'medium' | 'large'，'medium'）。
- `style`（CSSProperties）—— common prop。
- `tooltips`（TooltipProps[] | string[]）—— 每星提示。
- `onBlur` / `onFocus` / `onHoverChange(value)` / `onKeyDown(event)`。

**命名/形状差异**：

- ccui `readOnly: boolean` vs ant `disabled: boolean`（types 文件已注释 "todo 替换为 disabled"）。
- ccui `onChange: PropType<...>` 作为 props 注入；ant Vue 习惯应用 emit 'change' 事件。
- ccui `color: string` 直接改色 vs ant 通过 Component Token / style。

**ccui 特有 props**：

- `color`（string）—— 一键改星色。
- `onChange` / `onTouched`（作为函数 prop 注入，而非事件）。

### Events / 方法 对比

**缺失 events**：- `blur` / `focus` / `hoverChange(value)` / `keyDown(event)`（ant 命名 onBlur 等）。
**缺失 expose 方法**：- `blur()` / `focus()`（ant Methods 节）。

### 子组件 / 静态导出

**缺失**：- 无。

---

## Segmented

- Ant 段：`## segmented`（行 37832–38356）
- ccui types：`packages/ccui/ui/segmented/src/segmented-types.ts`
- ccui docs：`packages/docs/components/segmented/index.md`
- ccui 自报状态：100%

### Demo 对比

**Ant 官方 demo（共 10 条）**：1. Basic（Segmented<string>） 2. Vertical Direction（orientation="vertical"） 3. Block Segmented（block） 4. Round shape（shape="round" + size 联动，v5.24.0） 5. Disabled（整体 + 单项 disabled） 6. Controlled mode（value + onChange） 7. Custom Render（option.label 自定义节点 + tooltip） 8. Dynamic（动态加 options） 9. Three sizes 10. With Icon 11. With Icon only 12. With name（name 透传给 input[type=radio]，v5.23.0） 13. Custom semantic dom styling。

**ccui 文档 demo（共 6 条）**：1. 基本使用 2. 用对象选项 3. 不同尺寸 4. 块级宽度 5. 禁用整组 6. 监听变化。

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「Vertical Direction」（ant 第 2 条）—— `orientation="vertical"`。
- 「Round shape」（ant 第 4 条）—— `shape: 'default' | 'round'`。
- 「Custom Render」（ant 第 7 条）—— option.label 接受 ReactNode + option.tooltip。
- 「Dynamic」（ant 第 8 条）—— 动态变更 options。
- 「With Icon / Icon only」（ant 第 10-11 条）—— option.icon ReactNode；ccui SegmentedOption.icon 仅 string。
- 「With name」（ant 第 12 条）—— `name` 透传 input[type=radio]，键盘左右切换。
- 「Custom semantic dom styling」—— classNames / styles 含 root / icon / item。

**ccui 特有 demo**：- 无。

### Props 对比

**ccui 缺失的 ant props**（按 ant API 顺序）：

- `classNames` / `styles`（语义化）。
- `orientation`（'horizontal' | 'vertical'，'horizontal'）—— ccui 无方向。
- `vertical`（boolean，false，v5.21.0）—— 旧名（兼容）。
- `shape`（'default' | 'round'，'default'，v5.24.0）。
- `name`（string，v5.23.0）—— 透传 radio 组 name。
- `defaultValue`（string | number）。

**SegmentedOption 缺失**：

- `icon: ReactNode`（ccui 仅 string）。
- `label: ReactNode`（ccui 仅 string）。
- `tooltip: string | TooltipProps`。
- `className: string`。

**命名/形状差异**：

- ccui `modelValue` vs ant `value` / `defaultValue`。
- ccui `size: 'small' | 'middle' | 'large'` vs ant `'large' | 'medium' | 'small'`（middle vs medium 一致风格不同）。

**ccui 特有 props**：- 无。

### Events / 方法 对比

**缺失 events**：- 无（ccui 已有 change）。
**缺失 expose 方法**：- 无。

### 子组件 / 静态导出

**缺失**：- 无。

---

## Statistic

- Ant 段：`## statistic`（行 43025–43451）
- ccui types：`packages/ccui/ui/statistic/src/statistic-types.ts`
- ccui docs：`packages/docs/components/statistic/index.md`
- ccui 自报状态：100%

### Demo 对比

**Ant 官方 demo（共 5 条）**：1. Basic（含 loading） 2. Unit（prefix + suffix ReactNode） 3. Animated number（react-countup + `formatter` 函数） 4. In Card（嵌入 Card + styles.content 染色） 5. Timer（Statistic.Timer 含 type=countdown/countup，format=HH:mm:ss:SSS / "D 天 H 时" 等，onFinish / onChange） 6. Custom semantic dom styling。

**ccui 文档 demo（共 6 条）**：1. 基本使用 2. 加前缀 / 后缀 / 精度 3. 千分位与小数分隔符 4. 自定义颜色 / 强调样式 5. 加载中 6. 倒计时。

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「Animated number」（ant 第 3 条）—— `formatter` 自定义渲染函数（react-countup 动画）。
- 「In Card」（ant 第 4 条）—— 在 Card 中组合 + 用 styles.content 染色。
- 「Statistic.Timer」（ant 第 5 条，v5.25.0+）—— **Timer 是 v5.25.0 新组件**，`type: 'countdown' | 'countup'`，统一 Countdown 与 Countup。
- 「Custom semantic dom styling」—— classNames / styles。

**ccui 特有 demo**：

- 「千分位与小数分隔符」—— 演示 groupSeparator / decimalSeparator（ant 也有此 prop）。
- 「加载中」—— 演示 `loading`（ant 也有，但未独立 demo）。

### Props 对比

**ccui Statistic 缺失的 ant props**：

- `classNames` / `styles`（语义化，含 root / header / title / content / value / prefix / suffix 7 个节点）。
- `formatter`（(value) => ReactNode）—— 自定义值渲染，用于动画 / 千分位高级场景。
- `prefix: ReactNode`（ccui 仅 string）。
- `suffix: ReactNode`（ccui 仅 string）。
- ant `valueStyle` 已 deprecated，推荐 `styles.content`；ccui 仍保留 `valueStyle: object`。

**Statistic.Countdown 缺失**（ant 已 deprecated，但仍可用）：

- `onFinish()` / `onChange(value)` —— ccui 缺事件。
- `prefix` / `suffix` ReactNode。

**Statistic.Timer**（v5.25.0+，ant v6 推荐）：

- **ccui 完全缺失此子组件**。`type: 'countdown' | 'countup'`、format、prefix、suffix、title、value、valueStyle、onFinish、onChange 全部缺失。

**命名/形状差异**：

- ccui `prefix: string` vs ant `prefix: ReactNode`，影响图标用法。
- ccui Countdown `value: number | string | Date` vs ant `value: number`（ccui 更宽松）。

**ccui 特有 props**：- 无。

### Events / 方法 对比

**缺失 events**：- `onFinish`（Countdown / Timer）、`onChange(value)`（Timer）。
**缺失 expose 方法**：- 无。

### 子组件 / 静态导出

**缺失**：

- `Statistic.Timer`（v5.25.0+，**ant v6 推荐统一 API**，必须点出）。
- `Statistic.Countdown` 仍存在（ant 标 deprecated，但 ccui 已实现）—— 注意 ant 推荐迁移到 Timer。

---

## Table

- Ant 段：`## table`（行 44496–49939，5443 行，含 30 个 demo）
- ccui types：`packages/ccui/ui/table/src/table-types.ts`
- ccui docs：`packages/docs/components/table/index.md`
- ccui 自报状态：95%
- **设计取舍**：Table 不承担分页职责，分页改为 `<c-pagination>` + 父组件 slice `dataSource` 外部组合；下文凡涉及 `pagination` 字段 / `pagination.placement` / `onChange(pagination, ...)` 4 参签名等与分页耦合的 ant API，统一不对齐 / 不补齐，不计入 95 → 100 长尾。

### Demo 对比

**Ant 官方 demo（共 30 条）**：1. Basic Usage（columns + Tag + actions） 2. JSX style API（Table.Column / Table.ColumnGroup） 3. selection（rowSelection.type=checkbox/radio） 4. Selection and operation（受控 selectedRowKeys + 批量操作按钮） 5. Custom selection（rowSelection.selections 自定义批量项） 6. Filter and sorter（column.filters + column.sorter） 7. Filter in Tree（filterMode='tree'） 8. Filter search（filterSearch=true） 9. Multiple sorter（sorter={{compare, multiple}}） 10. Reset filters and sorters（filteredValue / sortedInfo 控制） 11. Customized filter panel（filterDropdown 自定义面板） 12. Ajax（受控 pagination + 远程加载） 13. size（large/middle/small） 14. border, title and footer 15. Expandable Row（expandable.expandedRowRender） 16. Order Specific Column（手动控制 column 顺序） 17. colSpan and rowSpan（onCell 返回 rowSpan/colSpan） 18. Tree data（dataSource 含 children，childrenColumnName） 19. Fixed Header（scroll.y） 20. Fixed Columns（column.fixed） 21. Stack Fixed Columns（多列 fixed） 22. Fixed Columns and Header（scroll.x + scroll.y + fixed） 23. Hidden Columns（column.hidden，v5.13.0） 24. Grouping table head（column.children） 25. Editable Cells 26. Editable Rows 27. Nested tables（expandable.expandedRowRender 嵌套表） 28. Drag sorting（dnd-kit） 29. Drag Column sorting 30. Drag sorting with handler 31. ellipsis column（column.ellipsis） 32. Shared column props（Table.column 共享） 33. ellipsis column custom tooltip 34. Custom empty（locale.emptyText） 35. Summary（Table.Summary + Summary.Row / Summary.Cell） 36. Virtual list（virtual + scroll.y） 37. Responsive（column.responsive） 38. Pagination Settings（pagination.placement） 39. Fixed header and scroll bar with the page（sticky） 40. Dynamic Settings 41. Custom semantic dom styling。

> 总数 30+（ant 段有 41 个 ### 子标题，包含「Promotion」「Using in TypeScript」等非 demo 块；实际 ## Examples 下有 30 个 demo 区段）。

**ccui 文档 demo（共 13 条）**：1. Basic 2. 模板式列声明 3. 自定义单元格渲染 4. 树形数据 5. Sort And Filter 6. 固定列 7. 展开行 8. 合并单元格 9. Row Selection 10. 单选 + 实时统计 11. loading / size / showHeader 12. 自定义空态 13. change 事件全量追踪。

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「JSX style API（Column / ColumnGroup）」（ant 第 2 条）—— 子组件式 API（**Table.Column / Table.ColumnGroup 必须点出**）。
- 「Custom selection」（ant 第 5 条）—— rowSelection.selections 批量动作。
- 「Filter in Tree（filterMode）」（ant 第 7 条）—— filterMode='tree'。
- 「Filter search」（ant 第 8 条）—— filterSearch=true / function。
- 「Multiple sorter」（ant 第 9 条）—— `sorter={{ compare, multiple }}`。
- 「Reset filters and sorters」（ant 第 10 条）—— 受控 filteredValue / sortOrder + 重置。
- 「Customized filter panel」（ant 第 11 条）—— column.filterDropdown 自定义面板。
- 「Ajax」（ant 第 12 条）—— 远程数据：监听 `change` 事件 (filters, sorter, currentData) 触发后端 refetch；分页部分不对齐（见设计取舍）。
- 「size」（ant 第 13 条）—— large/middle/small 三档。
- 「border, title and footer」（ant 第 14 条）—— `bordered` + `title()` + `footer()`。
- 「Order Specific Column」（ant 第 16 条）—— Table.EXPAND_COLUMN / Table.SELECTION_COLUMN 顺序占位符。
- 「Tree data」（ant 第 18 条）—— `dataSource` 含 children，`childrenColumnName`、`indentSize`、`expandable` 与 Tree 表格的组合。
- 「Fixed Header / Fixed Columns / Stack / Combined」（ant 第 19-22 条）—— scroll.x / scroll.y + column.fixed=left/right。
- 「Hidden Columns」（ant 第 23 条）—— column.hidden（v5.13.0）。
- 「Grouping table head」（ant 第 24 条）—— column.children 表头分组（即 ColumnGroup）。
- 「Editable Cells / Rows」（ant 第 25-26 条）—— 完整可编辑示例。
- 「Nested tables」（ant 第 27 条）—— expandedRowRender 嵌套表。
- 「Drag sorting / Drag Column sorting / Drag sorting with handler」（ant 第 28-30 条）—— dnd-kit。
- 「ellipsis column / Shared column props / ellipsis custom tooltip」（ant 第 31-33 条）—— `column.ellipsis: { showTitle }`、`column` 顶层共享 props（v6.4.0）。
- 「Custom empty」（ant 第 34 条）—— `locale.emptyText`。
- 「Summary」（ant 第 35 条）—— `summary(currentData)` + `Table.Summary` 静态子组件。
- 「Virtual list」（ant 第 36 条）—— `virtual` + `scroll.y`（v5.9.0）。
- 「Responsive」（ant 第 37 条）—— column.responsive。
- 「Fixed header and scroll bar with the page」（ant 第 39 条）—— `sticky: { offsetHeader, offsetScroll, getContainer }`。
- 「Dynamic Settings」（ant 第 40 条）—— 综合演示。
- 「Custom semantic dom styling」—— classNames / styles。

**ccui 特有 demo**：- 无（均为 ant 子集）。

### Props 对比

**ccui Table 缺失的 ant props**：

- `classNames` / `styles`（语义化）。
- `column`（Partial<ColumnType>，v6.4.0）—— 顶层共享 column 默认 props。
- `components`（覆盖默认 table elements）。
- `footer(currentPageData)`。
- `getPopupContainer(triggerNode) => HTMLElement`。
- `locale`（含 emptyText 等）。
- `rowClassName(record, index)`。
- `rowHoverable`（boolean，true，v5.16.0）。
- `showSorterTooltip`（boolean | TooltipProps & { target }，v5.16.0）。
- `sortDirections`（数组）。
- `sticky`（boolean | { offsetHeader, offsetScroll, getContainer }，v4.6.0）。
- `summary`（(currentData) => ReactNode）。
- `tableLayout`（'auto' | 'fixed'）。
- `title`（function(currentPageData)）。
- `virtual`（boolean，v5.9.0）—— 虚拟滚动开关。
- `onChange(pagination, filters, sorter, extra)`：**形状不对齐**，ccui `change` 为 `(filters, sorter, currentData)` 3 参（见设计取舍）。
- `onHeaderRow(columns, index)`。
- `onRow(record, index)` —— 行级 props（onClick / onDoubleClick / 等）。
- `onScroll(event)`（v5.16.0）。

**Table.Column 缺失**（ccui TableColumn interface 已有 title/dataIndex/key/width/align/fixed/sorter/sortOrder/filters/filteredValue/filterMultiple/customRender/onCell/onHeaderCell）：

- `className`（列样式）。
- `colSpan`（标题 colSpan）。
- `defaultFilteredValue` / `defaultSortOrder`。
- `filterResetToDefaultFilteredValue`。
- `ellipsis`（boolean | { showTitle }）。
- `filterDropdown` / `filterDropdownProps`（v5.22.0）。
- `filtered`（boolean）。
- `filterIcon`（ReactNode | function）。
- `filterOnClose`（v5.15.0）。
- `filterMode`（'menu' | 'tree'，v4.17.0）。
- `filterSearch`（boolean | function，v4.17.0/4.19.0）。
- `responsive`（Breakpoint[]，v4.2.0）。
- `rowScope`（'row' | 'rowgroup'，v5.1.0）。
- `shouldCellUpdate(record, prevRecord) => boolean`（v4.3.0）。
- `showSorterTooltip`（v5.16.0）。
- `sortDirections`。
- `sortIcon`（v5.6.0）。
- `minWidth`（v5.21.0）。
- `hidden`（boolean，v5.13.0）。
- `onFilter(value, record) => boolean`。
- `render(value, record, index)` —— ccui 用 `customRender`，名字不一致。

**Table.ColumnGroup 缺失**：

- 完整子组件未实现（ccui 通过 column.children 实现表头分组未提供 JSX API）。

**pagination 整段不对齐**：

- Table 不承担分页职责，`pagination` 字段不存在。ant 的 `pagination.position / placement / showSizeChanger / pageSizeOptions / showQuickJumper / showTotal / responsive` 等统一不补齐。分页改为「父组件持 page 状态 + slice dataSource + 外置 `<c-pagination>`」组合范式。

**expandable 缺失**：

- `childrenColumnName`（ccui Table 顶层已有，ant 在 expandable 内）。
- `columnTitle`（v4.23.0）。
- `columnWidth`。
- `defaultExpandAllRows`（ccui 已有 defaultExpandAllRows）。
- `expandedRowClassName`。
- `expandIcon`（自定义展开图标）。
- `expandRowByClick`（ccui 已有）。
- `fixed`（boolean | 'left' | 'right'，v4.16.0）。
- `indentSize`（ccui 顶层）。
- `showExpandColumn`（v4.18.0）。
- `onExpandedRowsChange`。

**rowSelection 缺失**：

- `align`（v5.25.0）。
- `checkStrictly`（默认 true，v4.4.0）。
- `columnTitle`（ReactNode | function）。
- `getTitleCheckboxProps()`。
- `preserveSelectedRowKeys`（v4.4.0）。
- `renderCell(checked, record, index, originNode)`（v4.1.0）。
- `selections`（boolean | object[]）—— 批量选项菜单。
- `onCell`（v5.5.0）。

**scroll 缺失**：

- `scrollToFirstRowOnChange`（boolean）。

**命名/形状差异**：

- ccui `customRender` vs ant `render`。
- ccui `size: 'small' | 'middle' | 'default'` vs ant `'large' | 'medium' | 'small'`（ccui 默认 default，ant 默认 large）。

**ccui 特有 props**：

- `childrenColumnName` / `indentSize` 放在 Table 顶层（ant 在 expandable 内）。

### Events / 方法 对比

**缺失 events**：

- `onChange(pagination, filters, sorter, extra)`：**形状不对齐**。ccui `change` 签名为 `(filters, sorter, currentData)` 3 参，无 pagination 首参，无 extra.currentDataSource（见设计取舍）。
- `onHeaderRow(columns, index)` / `onRow(record, index)`。
- `onScroll`（v5.16.0）。
- `onExpand(expanded, record)` / `onExpandedRowsChange`（expandable）。
- `onSelect(record, selected, selectedRows, nativeEvent)` / `onSelectAll(selected, selectedRows, changedRows)`（rowSelection）。

**缺失 expose 方法**：

- `nativeElement: HTMLDivElement`（v5.11.0）。
- `scrollTo({ index?, key?, top?, offset?, align? })`（v5.11.0）。

### 子组件 / 静态导出

**必须点出的缺失子组件**：

- `Table.Column`（JSX API 入口）。
- `Table.ColumnGroup`（表头分组 JSX）。
- `Table.Summary`（含 `Summary.Row` / `Summary.Cell`，汇总行）。
- `Table.EXPAND_COLUMN` / `Table.SELECTION_COLUMN`（列顺序占位符常量）。

---

## Tag

- Ant 段：`## tag`（行 51003–51858）
- ccui types：`packages/ccui/ui/tag/src/tag-types.ts`
- ccui docs：`packages/docs/components/tag/index.md`
- ccui 自报状态：100%

### Demo 对比

**Ant 官方 demo（共 8 条）**：1. Basic（closable / closeIcon / onClose / preventDefault） 2. Colorful Tag（11 presets × 3 variants：filled / solid / outlined） 3. Add & Remove Dynamically（动态增删 + 编辑） 4. Checkable（Tag.CheckableTag + Tag.CheckableTagGroup 含 multiple） 5. Animate（rc-tween-one 动效） 6. Icon（Tag 含 icon + CheckableTag 含 icon，v5.27.0） 7. Status Tag（5 个状态 × 3 个 variant） 8. Draggable Tag（dnd-kit） 9. Custom semantic dom styling。

**ccui 文档 demo（共 4 条）**：1. 基本使用 2. 多彩标签 3. 可关闭 4. 自定义颜色。

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「Add & Remove Dynamically」（ant 第 3 条）—— 动态增删 + 双击编辑 + Tooltip。
- 「Checkable」（ant 第 4 条）—— **Tag.CheckableTag 与 Tag.CheckableTagGroup**（含 multiple、options、value、onChange）。
- 「Animate」（ant 第 5 条）—— 进出场动画。
- 「Icon」（ant 第 6 条）—— Tag.icon + CheckableTag.icon（v5.27.0）。
- 「Status Tag」（ant 第 7 条）—— 5 个状态色 × 3 个 variant。
- 「Draggable Tag」（ant 第 8 条）—— dnd-kit。
- 「Custom semantic dom styling」—— classNames / styles + CheckableTagGroup styles。

**ccui 特有 demo**：- 无。

### Props 对比

**ccui Tag 缺失的 ant props**：

- `classNames` / `styles`（语义化，含 root / icon / content / close）。
- `closeIcon`（ReactNode，v4.4.0）—— 自定义关闭图标；ccui 仅 `closable: boolean`。
- `disabled`（boolean，v6.0.0）—— 禁用态。
- `href`（string，v6.0.0）—— 渲染为 `<a>`。
- `target`（string，v6.0.0）—— 配合 href。
- `variant`（'filled' | 'solid' | 'outlined'，'filled'，v6.0.0）—— ant v6 新引入，ccui 完全没有。
- `onClose(e)` —— ccui 用 emit 'close'，需对齐参数。
- `~~bordered~~`（ant 已 deprecated，推荐 variant="filled"；ccui 仍保留 `bordered`）。

**Tag.CheckableTag 缺失**（**整个子组件缺失**）：

- `checked: boolean`、`icon: ReactNode`（v5.27.0）、`onChange(checked)`。

**Tag.CheckableTagGroup 缺失**（**整个子组件缺失**）：

- `classNames` / `styles` / `defaultValue` / `disabled` / `multiple` / `options` / `value` / `onChange`。

**命名/形状差异**：

- ccui `color: 'default' | ...17种` 与 ant 一致（含 17 种 preset + status）。
- ccui `bordered: boolean` 保留 ant 已废弃字段。
- ccui `icon: string`（图标类名）vs ant `icon: ReactNode`。

**ccui 特有 props**：- 无。

### Events / 方法 对比

**缺失 events**：- 无（ccui 已有 close）。
**缺失 expose 方法**：- 无。

### 子组件 / 静态导出

**必须点出的缺失子组件**：

- `Tag.CheckableTag`（受控勾选）。
- `Tag.CheckableTagGroup`（v6 新增的 Group 容器）。

---

## Timeline

- Ant 段：`## timeline`（行 52476–53059）
- ccui types：`packages/ccui/ui/timeline/src/timeline-types.ts`
- ccui docs：`packages/docs/components/timeline/index.md`
- ccui 自报状态：100%

### Demo 对比

**Ant 官方 demo（共 9 条）**：1. Basic（items API） 2. Variant（`variant: filled` v6 新增） 3. Loading and Reversing（`reverse` + item.loading） 4. Alternate（mode="alternate"） 5. Horizontal（orientation="horizontal" + mode=start/end/alternate） 6. Custom（item.icon + item.color） 7. End alternate（mode="end"） 8. Title（item.title 单独 demo + mode） 9. Title Offset（titleSpan number | percent | px） 10. Semantic Sample（item.styles 局部样式） 11. Custom semantic dom styling。

**ccui 文档 demo（共 6 条）**：1. 基本用法 2. 自定义节点样式 3. 自定义时间戳 4. 垂直居中 5. 自定义节点 6.（同自定义节点）。

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「Basic（items API）」（ant 第 1 条）—— **ccui 未提供 items 数组 API**，只能用子组件 TimelineItem。
- 「Variant」（ant 第 2 条）—— `variant: 'filled' | 'outlined'`（v6 新增）。
- 「Loading and Reversing」（ant 第 3 条）—— `reverse` 顶层 + `item.loading`。
- 「Alternate」（ant 第 4 条）—— `mode: 'start' | 'alternate' | 'end'`。
- 「Horizontal」（ant 第 5 条）—— `orientation: 'horizontal' | 'vertical'` + mode 联动。
- 「End alternate」（ant 第 7 条）—— `mode="end"`。
- 「Title / Title Offset」（ant 第 8-9 条）—— item.title + titleSpan。
- 「Semantic Sample」（ant 第 10 条）—— item 级 styles。
- 「Custom semantic dom styling」—— Timeline 级 classNames / styles。

**ccui 特有 demo**：

- 「自定义时间戳」—— ccui TimelineItem 含 `timestamp` / `placement`（ant 用 `title` + `position` 等价表达）。
- 「垂直居中」—— ccui TimelineItem 自有 `center: boolean`。

### Props 对比

**Timeline 缺失的 ant props**：

- `classNames` / `styles`（语义化）。
- `items`（[Items]）—— 数组 API，ccui 仅子组件。
- `mode`（'start' | 'alternate' | 'end'，'start'）。
- `orientation`（'vertical' | 'horizontal'）。
- `reverse`（boolean）。
- `titleSpan`（number | string，12）—— 标题占用空间。
- `variant`（'filled' | 'outlined'，'outlined'）。
- `~~pending~~` / `~~pendingDot~~`（ant 已 deprecated，迁移到 item.loading / item.icon）。

**TimelineItem 缺失**：

- `content`（ReactNode）—— ant items 用 `content`。
- `loading`（boolean）—— 加载态节点。
- `placement`（'start' | 'end'）—— ccui 已有 `placement: 'top' | 'bottom'`，**取值不同**。
- ant `title` 字段 vs ccui `timestamp` —— **命名不一致**。
- ant `icon` 同名，ccui 也有，但 ant 接受 ReactNode，ccui 接受 string | Component。

**命名/形状差异**：

- ccui `timestamp: string` vs ant item `title: ReactNode`。
- ccui `placement: 'top' | 'bottom'` vs ant `placement: 'start' | 'end'`（**取值完全不同**）。
- ccui `type: 'primary' | 'success' | 'warning' | 'danger' | 'info' | ''` vs ant 直接 `color: string`，ccui 没有 color preset（仅 color: any string）。
- ccui `size: 'normal' | 'large'` vs ant 无 size（用 dotSize token）。
- ccui `hollow: boolean` 空心点 vs ant 用 icon ReactNode 完成。
- ccui `center: boolean` vs ant 无对应。

**ccui 特有 props**：

- TimelineItem `timestamp`、`hideTimestamp`、`center`、`type` preset、`size`、`hollow` —— 业务化扩展。

### Events / 方法 对比

**缺失 events**：- 无（ant 也无）。
**缺失 expose 方法**：- 无。

### 子组件 / 静态导出

**缺失**：- 无（ccui 已有 TimelineItem 子组件）。

---

## Tree

- Ant 段：`## tree`（行 55465–56657）
- ccui types：`packages/ccui/ui/tree/src/tree-types.ts`
- ccui docs：`packages/docs/components/tree/index.md`
- ccui 自报状态：100%

### Demo 对比

**Ant 官方 demo（共 13 条）**：1. Basic 2. Controlled Tree（受控 expandedKeys/checkedKeys/selectedKeys + autoExpandParent） 3. draggable（含 allowDrop / 拖拽 onDrop） 4. load data asynchronously（loadData） 5. Searchable（搜索 + 高亮） 6. Tree with line（showLine + showIcon） 7. Customize Icon（icon ReactNode） 8. directory（**Tree.DirectoryTree**，expandAction='click' | 'doubleClick' | false） 9. Customize collapse/expand icon（switcherIcon） 10. Virtual scroll（height） 11. Block Node（blockNode） 12. Custom semantic dom styling。

**ccui 文档 demo（共 15 条）**：1. 基本用法 2. 受控 / 非受控 3. 多选 4. 勾选 + 父子半选联动 5. fieldNames 字段名映射 6. 异步加载 7. 搜索 + 高亮 8. 自定义渲染 9. 键盘导航 10. 虚拟滚动 11. showLine 连接线 12. 拖拽 hover 自动展开 13. 拖拽 auto-scroll 14. 异步加载错误重试 15. 拖拽排序。

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「draggable + allowDrop」（ant 第 3 条）—— `allowDrop({ dropNode, dropPosition }) => boolean`，ccui 缺这个 prop。
- 「directory（Tree.DirectoryTree）」（ant 第 8 条）—— **必须点出**，含 `expandAction`。
- 「Customize collapse/expand icon（switcherIcon）」（ant 第 9 条）—— `switcherIcon` + `switcherLoadingIcon`（v5.20.0）。
- 「Block Node」（ant 第 11 条）—— `blockNode`（ccui 已实现但需 demo 化）。
- 「Custom semantic dom styling」—— classNames / styles。

**ccui 特有 demo**：

- 「键盘导航」—— ccui 自有 `focusedKey` + 键盘交互完整 demo。
- 「拖拽 hover 自动展开」—— ccui 自有 `dragHoverExpandDelay`（默认 600ms）。
- 「拖拽 auto-scroll」—— ccui 自有 `dragAutoScroll` / `dragAutoScrollEdge` / `dragAutoScrollSpeed`。
- 「异步加载错误重试」—— ccui 特定演示。
- 「拖拽排序」—— ccui 独立 demo。

### Props 对比

**ccui 缺失的 ant props**（按 ant API 顺序）：

- `allowDrop`（({ dropNode, dropPosition }) => boolean）。
- `autoExpandParent`（boolean）—— 自动展开父节点。
- `className`（透传）。
- `classNames` / `styles`（语义化）。
- `defaultExpandParent`（boolean，true）。
- `defaultSelectedKeys`（ccui 已有）。
- `draggable` 接受对象（ccui 仅 boolean）—— ant 支持 `{ icon: ReactNode | false, nodeDraggable: (node) => boolean }`（v4.17.0）。
- `filterTreeNode(node)` —— ccui 已有但签名稍异。
- `height`（number）—— **虚拟滚动高度**，ccui 用 `virtualMaxHeight`。
- `icon`（ReactNode | (props) => ReactNode）—— 顶层 icon。
- `loadedKeys`（受控加载过的 keys）。
- `motion`（CSSMotionProps）。
- `rootStyle`（CSSProperties，v4.20.0）。
- `showIcon`（boolean）。
- `showLine` 接受对象 `{ showLeafIcon }`（ccui 仅 boolean）。
- `style`（透传）。
- `switcherIcon`（ReactNode | (props) => ReactNode）。
- `switcherLoadingIcon`（v5.20.0）。
- `titleRender(nodeData) => ReactNode`（v4.5.0）—— ccui 用 slot/render。
- `treeData`（ccui 用 `data`，命名不一致）。
- `onCheck(checkedKeys, e)` / `onDoubleClick(event, node)`。
- `onDragEnd` / `onDragEnter` / `onDragLeave` / `onDragOver` / `onDragStart` / `onDrop` —— ccui 已部分实现但需对齐参数。
- `onExpand(expandedKeys, { expanded, node })`。
- `onLoad(loadedKeys, { event, node })`。
- `onRightClick(event, node)`。
- `onSelect(selectedKeys, e)`。

**TreeNode 缺失**（ccui TreeNodeData 已含 key/title/children/disabled/disableCheckbox/selectable/isLeaf/icon，基本对齐）：

- ant TreeNode 还支持 `checkable`（节点级）。

**DirectoryTree 缺失**：

- **整个 `Tree.DirectoryTree` 子组件未实现**：包含 `expandAction: 'click' | 'doubleClick' | false`。

**命名/形状差异**：

- ccui `data` vs ant `treeData`。
- ccui `virtualScroll: boolean` + `virtualItemHeight` + `virtualMaxHeight` vs ant `virtual: boolean` + `height: number`。
- ccui `searchValue` + `filterTreeNode` vs ant 仅 `filterTreeNode` 函数。
- ccui `focusedKey` 是显式 prop，ant 通过内部 focus 管理。

**ccui 特有 props**：

- `searchValue: string` —— 内建搜索值（ant 由用户实现）。
- `focusedKey` —— 焦点节点 key。
- `dragHoverExpandDelay`（默认 600）—— 拖拽悬停自动展开延时。
- `dragAutoScroll` / `dragAutoScrollEdge` / `dragAutoScrollSpeed` —— 拖拽时容器边缘自动滚动。
- `virtualScroll` / `virtualItemHeight` / `virtualMaxHeight` —— 虚拟滚动配置。

### Events / 方法 对比

**缺失 events**：- 见上 Props 中 onCheck / onDoubleClick / onDragX / onExpand / onLoad / onRightClick / onSelect 全集（ant 命名）。
**缺失 expose 方法**：

- `scrollTo({ key, align, offset })`（虚拟滚动中滚动到指定节点）。

### 子组件 / 静态导出

**必须点出的缺失子组件**：

- `Tree.DirectoryTree`（目录树，含 expandAction）。

---

## Typography

- Ant 段：`## typography`（行 57732–58572）
- ccui types：`packages/ccui/ui/typography/src/typography-types.ts`
- ccui docs：`packages/docs/components/typography/index.md`
- ccui 自报状态：100%

### Demo 对比

**Ant 官方 demo（共 11 条）**：1. Basic（综合：Title / Paragraph / Text / Link） 2. Title Component（h1-h5） 3. Text and Link Component（type / mark / code / keyboard / underline / delete / strong / italic + Link） 4. Editable（editable: { icon / tooltip / onChange / triggerType / enterIcon / maxLength / autoSize / text }） 5. Copyable（copyable: { text / icon / tooltips / format / onCopy / actions.placement v6.4.0 }） 6. Ellipsis（ellipsis: { rows, expandable, symbol, tooltip, suffix }） 7. Controlled ellipsis expand/collapse（expandable: 'collapsible'、expanded、onExpand 受控，v5.16.0） 8. Ellipsis from middle（自实现 + ellipsis.suffix） 9. suffix（ellipsis.suffix + onEllipsis 回调） 10. Table（嵌入原生 table 默认样式，v6 新增 demo） 11. 还可能含 List / Interactive / Pre 等小 demo。

**ccui 文档 demo（共 7 条）**：1. 基本使用 2. 五级标题 3. 语义化文本 4. 文本样式装饰 5. 链接 6. 段落组合 7.（API）。

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「Editable」（ant 第 4 条）—— 整套 `editable` 配置：icon / tooltip / triggerType / enterIcon / maxLength / autoSize / text / onChange / onCancel / onStart / onEnd。
- 「Copyable」（ant 第 5 条）—— 整套 `copyable`：text / icon / tooltips / format / tabIndex / actions.placement / onCopy。
- 「Ellipsis」（ant 第 6 条）—— `ellipsis: { rows, expandable, symbol, tooltip, suffix, onEllipsis, onExpand }`。
- 「Controlled ellipsis expand/collapse」（ant 第 7 条）—— `expandable: 'collapsible' | true` 受控展开。
- 「Ellipsis from middle」（ant 第 8 条）—— 通过 suffix 截取尾部演示。
- 「suffix」（ant 第 9 条）—— 末尾固定文本。
- 「Table」（ant 第 10 条）—— Typography 内嵌原生 `<table>` 默认样式（v6 新增）。

**ccui 特有 demo**：- 无（均为 ant 子集）。

### Props 对比

**Typography.Text / Title / Paragraph 通用缺失的 ant props**：

- `actions`（{ placement: 'start' | 'end' }，v6.4.0）—— 操作栏放置。
- `classNames` / `styles`（语义化，v6.4.0）。
- `copyable`（boolean | copyable config）—— **完整缺失**。
  - copyable: { text, onCopy, icon, tooltips, format, tabIndex, actions.placement }。
- `editable`（boolean | editable config）—— **完整缺失**。
  - editable: { icon, tooltip, editing, maxLength, autoSize, text, onChange, onCancel, onStart, onEnd, triggerType, enterIcon, tabIndex }。
- `ellipsis`（boolean | ellipsis config）—— **完整缺失**。
  - ellipsis: { rows, expandable: boolean | 'collapsible', suffix, symbol, tooltip, defaultExpanded, expanded, onExpand, onEllipsis }。
- `onClick(event)`。

**Typography.Title 缺失**：

- 同上通用四大块；`level` 已实现（1~5）。

**Typography.Paragraph 缺失**：

- 同上通用四大块；`strong` 已实现。

**Typography.Link 缺失**：

- 同上通用四大块。
- Link 没有 `level`，已正确。
- 缺少 ant 的 disabled、editable、copyable、ellipsis 等通用能力。

**命名/形状差异**：

- ccui 把 `code / mark / keyboard / underline / delete / strong / italic / type / disabled` 都作为 boolean prop 实现了，与 ant 对齐。

**ccui 特有 props**：- 无。

### Events / 方法 对比

**缺失 events**：

- `onClick(event)`（所有 Text/Title/Paragraph）。
- copyable.onCopy / editable.onChange / editable.onCancel / editable.onStart / editable.onEnd / ellipsis.onExpand / ellipsis.onEllipsis（嵌套在配置对象内的回调）。

**缺失 expose 方法**：- 无。

### 子组件 / 静态导出

**缺失**：- 无（ccui 已含 Typography / Text / Title / Paragraph / Link 五个导出，结构与 ant 一致）。

---

## Watermark

- Ant 段：`## watermark`（行 60207–60554，注：ant 归在 Feedback 分组）
- ccui types：`packages/ccui/ui/watermark/src/watermark-types.ts`
- ccui docs：`packages/docs/components/watermark/index.md`
- ccui 自报状态：100%

### Demo 对比

**Ant 官方 demo（共 5 条）**：1. Basic（content） 2. Multi-line watermark（content 数组） 3. Image watermark（image + width + height） 4. Custom configuration（content / color / fontSize / zIndex / rotate / gap / offset 全配置 + Form 实时改） 5. Modal or Drawer（`inherit` 传递到 Modal/Drawer，v5.11.0）。

**ccui 文档 demo（共 6 条）**：1. 基本使用 2. 多行文字 3. 自定义旋转 4. 字体样式 5. 控制密度 6. 图片水印。

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「Custom configuration」（ant 第 4 条）—— 综合配置面板（ccui 已有零散 demo，但无综合表单）。
- 「Modal or Drawer」（ant 第 5 条）—— **`inherit: boolean`**（v5.11.0）传递水印到弹层组件，ccui 缺。

**ccui 特有 demo**：

- 「控制密度」—— 演示 gap 调节密度（ant 在 Custom configuration 内含）。
- 「字体样式」—— 字体配置 demo。

### Props 对比

**ccui 缺失的 ant props**：

- `inherit`（boolean，true，v5.11.0）—— 弹层组件继承水印。
- `onRemove`（() => void，v6.0.0）—— DOM 被移除时回调。

**Font 字段缺失**：

- `textAlign`（CanvasTextAlign，'center'，v5.10.0）—— 文本对齐。

**命名/形状差异**：

- ccui `zIndex` 默认 9，ant 默认 999。
- 其余 width/height/rotate/gap/offset/font/image/content 完全对齐。

**ccui 特有 props**：- 无。

### Events / 方法 对比

**缺失 events**：- `onRemove`（v6.0.0）。
**缺失 expose 方法**：- 无。

### 子组件 / 静态导出

**缺失**：- 无。

---

## 总览

| 组件         | ccui 自报 | demo 缺口 | props 缺口（重点）                                                               | 子组件缺口                               |
| ------------ | --------- | --------- | -------------------------------------------------------------------------------- | ---------------------------------------- |
| Avatar       | 100%      | 4 / 6     | alt/gap/icon/shape/size 响应式/Group                                             | Avatar.Group                             |
| Badge        | 100%      | 7 / 10    | classNames/styles/size/title/count ReactNode                                     | Badge.Ribbon                             |
| Calendar     | 100%      | 4 / 8     | cellRender/dateFullCellRender/headerRender/disabledDate/showWeek/mode/validRange | -                                        |
| Card         | 100%      | 7 / 10    | variant/cover/actions/loading/tabList/extra                                      | Card.Meta、Card.Grid                     |
| Carousel     | 80%       | 1 / 6     | dotPlacement 新名/effect=fade/adaptiveHeight/easing                              | -                                        |
| Collapse     | 100%      | 6 / 10    | size/collapsible/expandIcon/items/destroyOnHidden                                | -                                        |
| Descriptions | 100%      | 3 / 7     | classNames/styles/responsive column/filled span                                  | -                                        |
| Empty        | 100%      | 4 / 6     | image ReactNode/description=false/classNames                                     | PRESENTED_IMAGE_DEFAULT/SIMPLE 静态      |
| Image        | 100%      | 10 / 11   | preview 整个对象/placeholder.progress/classNames                                 | **Image.PreviewGroup**                   |
| List         | 100%      | 9 / 11    | grid/pagination/loadMore/locale/footer/header ReactNode                          | List.Item.Meta、List.Item.actions/extra  |
| QRCode       | 80%       | 4 / 9     | type=svg/marginSize/boostLevel/iconSize 对象/classNames                          | -                                        |
| Rate         | 100%      | 5 / 8     | character/tooltips/keyboard/size/onBlur/onFocus                                  | -                                        |
| Segmented    | 100%      | 7 / 10    | orientation/shape=round/name/label ReactNode/icon ReactNode                      | -                                        |
| Statistic    | 100%      | 4 / 5     | formatter/prefix-suffix ReactNode/classNames                                     | **Statistic.Timer**（v5.25+）            |
| Table        | 95%       | 25 / 30   | onChange/sticky/virtual/summary/title/footer/column 25+ 子字段                   | **Table.Column / ColumnGroup / Summary** |
| Tag          | 100%      | 7 / 9     | variant/closeIcon/disabled/href/target                                           | **Tag.CheckableTag / CheckableTagGroup** |
| Timeline     | 100%      | 9 / 11    | items/mode/orientation/reverse/titleSpan/variant                                 | -                                        |
| Tree         | 100%      | 5 / 13    | allowDrop/switcherIcon/treeData 命名/height/titleRender                          | **Tree.DirectoryTree**                   |
| Typography   | 100%      | 7 / 11    | copyable/editable/ellipsis 三大块完全缺失                                        | -                                        |
| Watermark    | 100%      | 2 / 5     | inherit/onRemove/font.textAlign                                                  | -                                        |
