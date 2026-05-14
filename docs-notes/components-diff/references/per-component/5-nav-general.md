# 第 5 批：导航 + 通用组件 vs Ant Design v6.3.7 逐组件对比

> 输入：`D:\codetest\ccui\docs-notes\components-diff\references\.tmp-llms-full.txt`
> 输出：本文件
> 范围：8 个导航组件 + 5 个通用组件，共 13 个

## Affix

- Ant 段：`## affix`（行 93–242）
- ccui types：`packages/ccui/ui/affix/src/affix-types.ts`
- ccui docs：`packages/docs/components/affix/index.md`
- ccui 自报状态：CHANGELOG 未挂百分比；docs 含 5 个 :::demo + API + 注意事项，源码已实装 offsetTop / offsetBottom / target / 滚动监听 / change 事件。视作 ~90% 对齐。

### Demo 对比
**Ant 官方 demo（共 3 条）**：1. Basic（offsetTop / offsetBottom 同屏） 2. Callback（onChange） 3. Container to scroll（target 容器）
**ccui 文档 demo（共 5 条）**：1. 基本使用 2. 偏移量 offsetTop 3. 固定到底部 offsetBottom 4. 监听固定状态变化 5. 在滚动容器中
**ccui 缺失的 ant demo**（按 ant 顺序）：- 无（ccui 把 ant 的 Basic 拆成 2/3 两个 demo）
**ccui 特有 demo**：- 「基本使用」一节用 Button 直接演示无偏移粘顶；- ccui 多一个独立的「监听固定状态变化」（ant 在 Callback 里覆盖）

### Props 对比
**ccui 缺失的 ant props**（按 ant API 顺序）：- 无关键 prop 缺失；Affix 体量小
**命名/形状差异**：
- ant `target: () => Window | HTMLElement | null`；ccui `target: string | HTMLElement | (() => HTMLElement | Window | null)` 多了字符串选择器形态
- ant `offsetTop` 默认 `0`；ccui 默认 `undefined`（不传不固定上方）
**ccui 特有 props**：- `zIndex: number`（默认 10）—— ant 由 token / 用户 style 控制

### Events / 方法 对比
**缺失 events**：- ant `onChange(affixed?: boolean) => void`；ccui 文档「监听固定状态变化」demo 演示了等价事件，需复核 emits 是否名为 `change`
**缺失 expose 方法**：- 无（ant v5.10 起 Affix 改 FC，原 ref 方法亦失效）

### 子组件 / 静态导出
**缺失**：- 无

---

## Anchor

- Ant 段：`## anchor`（行 816–1412）
- ccui types：`packages/ccui/ui/anchor/src/anchor-types.ts`
- ccui docs：`packages/docs/components/anchor/index.md`
- ccui 自报状态：未挂百分比；docs 含 6 个 :::demo + API。视作 ~75% 对齐（缺 direction / replace / getContainer / getCurrentAnchor / classNames-styles）。

### Demo 对比
**Ant 官方 demo（共 8 条）**：1. Basic 2. Horizontal Anchor 3. Static Anchor（affix=false） 4. Customize the onClick event 5. Customize the anchor highlight（getCurrentAnchor） 6. Set Anchor scroll offset（targetOffset） 7. Listening for anchor link change 8. Replace href in history 9. Custom semantic dom styling
**ccui 文档 demo（共 6 条）**：1. 基本使用 2. 嵌套层级 3. 监听变化 4. 调整高亮容差 5. 拦截点击 6.（API）
**ccui 缺失的 ant demo**（按 ant 顺序）：- Horizontal Anchor（`direction='horizontal'`） - Static Anchor（`affix=false` 独立 demo） - Customize the anchor highlight（`getCurrentAnchor`） - Set Anchor scroll offset（`targetOffset` 完整 demo，ccui 虽列了 prop 但无 demo） - Replace href in history（`replace`） - Custom semantic dom styling（`classNames` / `styles`）
**ccui 特有 demo**：- 「调整高亮容差」单独演示 `bounds` 参数

### Props 对比
**ccui 缺失的 ant props**（按 ant API 顺序）：- `direction: 'vertical' | 'horizontal'` （5.2.0） - `replace: boolean` （5.7.0） - `getContainer: () => HTMLElement` （ccui 用 `scrollContainer` 顶替，类型/形状不同） - `getCurrentAnchor: (activeLink: string) => string` - `classNames` / `styles`（语义 DOM 子键 root/item/itemTitle/indicator）
**命名/形状差异**：
- ant `getContainer: () => HTMLElement` 是函数；ccui `scrollContainer: string | HTMLElement` 是值
- ant `AnchorItem` 字段：`key / href / title / target / children / replace / targetOffset`；ccui `AnchorLink`：`href / title / children`，缺 `key` `target` `replace` 行内 `targetOffset`
- ant `affix` 接受 `boolean | Omit<AffixProps, …>`；ccui 仅 `boolean`
**ccui 特有 props**：- 无

### Events / 方法 对比
**缺失 events**：- ant `onClick(e, link)` / `onChange(currentActiveLink)` —— ccui docs 演示了 click / change，需核 emits 名是否一致；item 级 `target` / 行内 `replace` / 行内 `targetOffset` 全无
**缺失 expose 方法**：- 无（FC 化后均不再暴露）

### 子组件 / 静态导出
**缺失**：- ant 仍兼容 `Anchor.Link` 子组件 API（虽推荐 items），ccui 仅 items；- 横向（`direction='horizontal'`）整套缺失

---

## Breadcrumb

- Ant 段：`## breadcrumb`（行 3552–4005）
- ccui types：`packages/ccui/ui/breadcrumb/src/breadcrumb-types.ts`
- ccui docs：`packages/docs/components/breadcrumb/index.md`
- ccui 自报状态：未挂百分比；docs 7 个 :::demo + API；types 含 `breadcrumbProps` + `breadcrumbItemProps`。视作 ~70%。

### Demo 对比
**Ant 官方 demo（共 7 条）**：1. Basic Usage（items） 2. With an Icon 3. With Params 4. Configuring the Separator 5. Bread crumbs with drop down menu 6. Configuring the Separator Independently（`type:'separator'`） 7. Custom semantic dom styling
**ccui 文档 demo（共 7 条）**：1. 何时使用 2. 基本使用 3. 用 routes 数据驱动 4. 自定义分隔符 5. 单项自定义分隔符 6. 用 #separator 插槽 7. 配合按钮
**ccui 缺失的 ant demo**（按 ant 顺序）：- With an Icon（图标 + 文本组合的 title） - With Params（`params={{ id: 1 }}` 占位符替换） - Bread crumbs with drop down menu（`menu: { items }`） - Custom semantic dom styling（`classNames` / `styles`）
**ccui 特有 demo**：- 「用 #separator 插槽」用具名插槽自定义分隔符（ant 走 ReactNode prop）；- 「配合按钮」演示组合场景

### Props 对比
**ccui 缺失的 ant props**（按 ant API 顺序）：- `dropdownIcon: ReactNode` （6.2.0） - `itemRender: (route, params, routes, paths) => ReactNode`（与 react-router 集成关键 API） - `params: object`（搭配 `:id` 类占位符） - `classNames` / `styles`（root / item / separator 三键）
**命名/形状差异**：
- ant `items: ItemType[]`，子项形状 `{ className, dropdownProps, href, path, menu, onClick, title }`；ccui `routes: BreadcrumbRoute[]`，子项形状 `{ path, href, title, breadcrumbName }`，缺 `menu` / `onClick` / `dropdownProps` / `className`
- ant 用 `{ type: 'separator', separator }` 行内插入分隔符；ccui 用 BreadcrumbItem 的 `separator` 属性 + `<template #separator>` 插槽
- ant `separator: ReactNode`；ccui `separator: string`（不能塞图标节点）
**ccui 特有 props**：- BreadcrumbItem `href: string` / `separator: string` 行内单项级控制（ant 通过 items 数组里的字段实现）

### Events / 方法 对比
**缺失 events**：- 行内 `onClick` 缺失；- 整体 breadcrumb 无 `change` 类事件（ant 也没有）
**缺失 expose 方法**：- 无

### 子组件 / 静态导出
**缺失**：- ant 历史上 `Breadcrumb.Item` / `Breadcrumb.Separator` 仍可用；ccui 应保留 `CBreadcrumbItem`（需核 vue-ccui.ts 是否导出）；- `RouteItemType.menu`（嵌入 Dropdown 菜单）整套缺失

---

## Dropdown

- Ant 段：`## dropdown`（行 16329–17516）
- ccui types：`packages/ccui/ui/dropdown/src/dropdown-types.ts`
- ccui docs：`packages/docs/components/dropdown/index.md`
- ccui 自报状态：未挂百分比；docs 7 个 :::demo + API；`items` API 已对齐。视作 ~65%（缺 arrow / popupRender / Dropdown.Button / 行内 icon-as-node）。

### Demo 对比
**Ant 官方 demo（共 11 条）**：1. Basic 2. Extra node（`extra` 字段，⌘P 类快捷键） 3. Placement 4. Arrow 5. Other elements（divider） 6. Arrow pointing at the center 7. Trigger mode 8. Click event 9. Button with dropdown menu（Space.Compact + Button + Dropdown 组合，等价旧 `Dropdown.Button`） 10. Custom dropdown（`popupRender`） 11. Cascading menu（多级） 12. The way of hiding menu 13. Context Menu（`trigger=['contextMenu']`） 14. Loading 15. Selectable Menu 16. Custom semantic dom styling
**ccui 文档 demo（共 7 条）**：1. 基本使用 2. 触发方式 3. 禁用项与危险项 4. 监听选择 5. 弹出方位 6. 受控显示 7.（API）
**ccui 缺失的 ant demo**（按 ant 顺序）：- Extra node（`extra` 字段显示快捷键） - Arrow（`arrow` / `arrow={{ pointAtCenter: true }}`） - Other elements（item 行内 `{ type: 'divider' }`） - Button with dropdown menu（左按钮 + 右拉菜单复合形态） - Custom dropdown（`popupRender`） - Cascading menu（子菜单级联） - Context Menu（`trigger=['contextMenu']`，ccui 类型已含但无 demo） - Loading - Selectable Menu（`selectable` + `selectedKeys`）
**ccui 特有 demo**：- 「受控显示」显式演示 `visible` 受控

### Props 对比
**ccui 缺失的 ant props**（按 ant API 顺序）：- `arrow: boolean | { pointAtCenter: boolean }` - `autoAdjustOverflow: boolean` - `destroyOnHidden: boolean` （ccui 无与之等价的 keep-alive 控制） - `popupRender: (menus) => ReactNode`（取代旧 `dropdownRender`，自定义弹层内容关键 API） - `getPopupContainer: (triggerNode) => HTMLElement` - `menu: MenuProps`（v5 新 API：把 menu 配置外挂为对象，含 `items / onClick / selectedKeys / multiple` 等全部 Menu 字段）—— ccui 把 menu 字段全摊平到自身 props 上 - `classNames` / `styles`
**命名/形状差异**：
- ant `trigger: Array<'click'|'hover'|'contextMenu'>` 数组形态；ccui `trigger: 'hover'|'click'|'contextmenu'` 单值，且小写 `contextmenu`
- ant `open` + `onOpenChange(open, { source: 'trigger'|'menu' })`；ccui `visible` boolean，`onOpenChange` 缺 `info.source`
- ant `placement: 'bottom'|'bottomLeft'|'bottomRight'|'top'|'topLeft'|'topRight'`（驼峰）；ccui 沿用 PopoverPlacement `bottom-start` 横杠风格，两套字典不互通
- ant `DropdownItem` 字段：`{ key, label, icon, disabled, danger, extra, type: 'divider'|'group', children, onClick }`；ccui：`{ key, label, icon, disabled, divided, danger }`，缺 `extra` / `type` / `children` 级联 / 行内 `onClick` / `label` 仅 string（ant 是 ReactNode 可放 `<a>`）
- ant `icon` 是 ReactNode；ccui `icon: string`
**ccui 特有 props**：- `hideOnClick: boolean`（默认 true） - `width: number | string`（弹层宽度）

### Events / 方法 对比
**缺失 events**：- ant `menu.onClick(info)` 接收 `{ key, keyPath, item, domEvent }` 完整菜单点击信息 - `onOpenChange` 的 `info.source` 字段
**缺失 expose 方法**：- 无

### 子组件 / 静态导出
**缺失**：- **`Dropdown.Button`**（ant v6 虽推荐用 Space.Compact 组合，但 `Dropdown.Button` 仍在 export，ccui 完全缺失） - 项 `type: 'group'` / `type: 'divider'` 行内分组 - 多级 children 级联子菜单

---

## Menu

- Ant 段：`## menu`（行 29776–31059）
- ccui types：`packages/ccui/ui/menu/src/menu-types.ts`
- ccui docs：`packages/docs/components/menu/index.md`
- ccui 自报状态：CHANGELOG 标注 "80% / 95% / 100% 三档"；source 同时实现 items API 与基础键盘交互。视作 ~75%。

### Demo 对比
**Ant 官方 demo（共 8 条）**：1. Top Navigation（horizontal） 2. Inline menu 3. Collapsed inline menu（`inlineCollapsed`） 4. Menu tooltip（`tooltip` 配置） 5. Open current submenu only（`onOpenChange` 手动管理 openKeys） 6. Vertical menu 7. Menu Themes（light/dark 切换） 8. Sub-menu theme（item.theme 子级覆盖） 9. Switch the menu type 10. Custom Submenu Render（`popupRender`） 11. Custom semantic dom styling
**ccui 文档 demo（共 6 条）**：1. 基本用法 2. 内联子菜单 3. 默认展开与默认选中 4. 多选菜单 5. 分组、分割线和额外内容 6. 暗色主题和收起 +（API / MenuItem / Events / 键盘交互）
**ccui 缺失的 ant demo**（按 ant 顺序）：- Menu tooltip（`tooltip: false | TooltipProps`） - Open current submenu only（手动控制 openKeys 案例） - Sub-menu theme（item 级 theme 覆盖） - Switch the menu type（mode 实时切换） - Custom Submenu Render（`popupRender`） - Custom semantic dom styling（`classNames` / `styles`）
**ccui 特有 demo**：- 「多选菜单」单独演示 `multiple` + selectedKeys 受控（ant 把多选合入 Selectable Menu）

### Props 对比
**ccui 缺失的 ant props**（按 ant API 顺序）：- `expandIcon: ReactNode | (props) => ReactNode`（自定义展开图标，并通过 ConfigProvider.menu.expandIcon 可全局配置） - `overflowedIndicator: ReactNode`（水平模式溢出折叠图标，默认 `<EllipsisOutlined />`） - `subMenuCloseDelay: number`（默认 0.1） - `subMenuOpenDelay: number`（默认 0） - `tooltip: false | TooltipProps`（6.3.0 收起态 tooltip 控制） - `popupRender: (node, { item, keys }) => ReactElement`（自定义子菜单弹层） - `classNames` / `styles`
**命名/形状差异**：
- ant SubMenu 子项 `{ popupClassName, popupOffset, popupRender, theme, onTitleClick }`；ccui MenuItem 没有 popup* / 行内 theme 覆盖 / titleClick
- ant Group 子项 `{ type: 'group', label, children }` 行内类型；ccui 已支持 type='group' 但缺 `MenuDividerType.dashed`
- ant `triggerSubMenuAction` 默认 `hover`；ccui 默认 `click`
- ant 项级 `extra: ReactNode` 5.21.0；ccui 已含 `extra: VNodeChild` ✓
**ccui 特有 props**：- `accordion: boolean`（手风琴模式）—— ant 需用户在 onOpenChange 里自己实现 - `multiple: boolean` props 显式暴露

### Events / 方法 对比
**缺失 events**：- ant `onDeselect({ key, keyPath, selectedKeys, domEvent })` 多选反选事件 - SubMenu `onTitleClick({ key, domEvent })` 子菜单标题独立点击 - `onOpenChange(openKeys: string[])` —— ccui openInfo 形状不同
**缺失 expose 方法**：- 无

### 子组件 / 静态导出
**缺失**：- **`Menu.SubMenu`**（命名空间静态组件，ant 仍兼容） - **`Menu.Item`** - **`Menu.ItemGroup`** - **`Menu.Divider`** —— ccui 仅 items 数据驱动一条路径，子组件式 JSX/template 写法整套缺失 - `forceSubMenuRender` ccui 已有 ✓ / `triggerSubMenuAction` ccui 已有 ✓ / `inlineCollapsed` ccui 已有 ✓

---

## Pagination

- Ant 段：`## pagination`（行 33911–34348）
- ccui types：`packages/ccui/ui/pagination/src/pagination-types.ts`
- ccui docs：`packages/docs/components/pagination/index.md`
- ccui 自报状态：未挂百分比；docs 7 个 :::demo；types 覆盖率高。视作 ~75%。

### Demo 对比
**Ant 官方 demo（共 11 条）**：1. Basic 2. Align（start/center/end） 3. More 4. Changer（showSizeChanger） 5. Jumper（showQuickJumper） 6. Size（small/medium/large 三档） 7. Simple mode（`simple={{ readOnly: true }}`） 8. Controlled 9. Total number（showTotal） 10. Show All 11. Prev and next（itemRender 自定义按钮文案） 12. Custom semantic dom styling
**ccui 文档 demo（共 7 条）**：1. 基本使用 2. 显示总数 3. 切换每页条数 4. 快速跳页 5. 简洁模式 6. 小尺寸 7. 禁用 / 单页隐藏
**ccui 缺失的 ant demo**（按 ant 顺序）：- Align（start/center/end） - Controlled - Prev and next（`itemRender`） - 三档 size（ccui 仅 small/default 二档） - Show All（综合演示）
**ccui 特有 demo**：- 「禁用 / 单页隐藏」合并演示

### Props 对比
**ccui 缺失的 ant props**（按 ant API 顺序）：- `align: 'start' | 'center' | 'end'`（5.19.0） - `defaultCurrent / defaultPageSize`（ccui 仅受控 current/pageSize） - `itemRender: (page, type, originalElement) => ReactNode`（自定义页号 / 上下页按钮内容，关键扩展点） - `responsive: boolean` - `showLessItems: boolean` - `showTitle: boolean` - `totalBoundaryShowSizeChanger: number`（默认 50） - `classNames` / `styles`
**命名/形状差异**：
- ant `size: 'large' | 'medium' | 'small'`（v6 三档）；ccui `size: 'small' | 'default'`（二档，没有 large）
- ant `simple: boolean | { readOnly?: boolean }`；ccui `simple: boolean`
- ant `showQuickJumper: boolean | { goButton: ReactNode }`；ccui `showQuickJumper: boolean`
- ant `showSizeChanger: boolean | SelectProps`（5.21+，可深度透传 Select 配置）；ccui 仅 boolean
**ccui 特有 props**：- 无

### Events / 方法 对比
**缺失 events**：- `onShowSizeChange(current, size)` 与 `onChange(page, pageSize)` 的 ccui 实现需核对 emits 名 / 形参顺序
**缺失 expose 方法**：- 无

### 子组件 / 静态导出
**缺失**：- 无（Pagination 无静态命名空间）

---

## Steps

- Ant 段：`## steps`（行 43452–44222）
- ccui types：`packages/ccui/ui/steps/src/steps-types.ts`
- ccui docs：`packages/docs/components/steps/index.md`
- ccui 自报状态：未挂百分比；docs 8 个 :::demo；types 覆盖基础 + navigation。视作 ~60%（缺 type='dot'/'inline'/'panel'、percent、iconRender、variant）。

### Demo 对比
**Ant 官方 demo（共 10 条）**：1. Basic（含 `variant` 切换） 2. Error status（status='error'） 3. Vertical 4. Clickable（onChange） 5. Panel Steps（`type='panel'`） 6. With icon 7. Title Placement and Progress（titlePlacement + percent） 8. Dot Style（`type='dot'`） 9. Navigation Steps（`type='navigation'`） 10. Inline Steps（`type='inline'`） 11. Inline Style Combination（offset + styles） 12. Custom semantic dom styling
**ccui 文档 demo（共 8 条）**：1. 基本使用 2. 全局状态 3. 单项状态 4. 垂直布局 5. 小尺寸 6. 点状步骤条 7. 受控切换 8.（API）
**ccui 缺失的 ant demo**（按 ant 顺序）：- Basic 里的 `variant='outlined'` 切换（ccui 无 variant prop） - Panel Steps（`type='panel'`） - With icon（自定义 step icon） - Title Placement and Progress（`percent` 当前步进度环 + titlePlacement 切换） - Navigation Steps（types 已支持 navigation，但 docs 无 demo） - Inline Steps（`type='inline'` 嵌入 List 行尾的紧凑型） - Inline Style Combination（`offset` + styles）
**ccui 特有 demo**：- 「点状步骤条」单独演示 `progressDot` boolean prop

### Props 对比
**ccui 缺失的 ant props**（按 ant API 顺序）：- `iconRender: (oriNode, info) => ReactNode`（统一替换图标渲染） - `initial: number`（步进起点，默认 0） - `percent: number`（当前 process 步进度，4.5.0） - `responsive: boolean`（默认 true，<532px 自动转 vertical） - `variant: 'filled' | 'outlined'` - `titlePlacement` 与 `labelPlacement` 同义但 ant 已弃 labelPlacement 改 titlePlacement - `onChange(current)` 事件 ccui 需确认 emits - `classNames` / `styles`
**命名/形状差异**：
- ant `type: 'default' | 'dot' | 'inline' | 'navigation' | 'panel'`（5 种）；ccui `type: 'default' | 'navigation'`（只 2 种）
- ant `direction` 已废弃改 `orientation: 'horizontal' | 'vertical'`；ccui 仍用 `direction`
- ant `size: 'medium' | 'small'`；ccui `size: 'default' | 'small'`
- ant `progressDot` 已废弃推荐 `type='dot'`；ccui 仍把它当 boolean prop
- ant StepItem `content` 字段；ccui StepItem 用 `description`（ant 也弃了 description 改 content）
- ant StepItem `disabled` 影响点击；ccui 已含 `disabled` ✓
**ccui 特有 props**：- 无

### Events / 方法 对比
**缺失 events**：- `onChange(current: number)` —— ccui docs 「受控切换」demo 必然用到，需复核 emits
**缺失 expose 方法**：- 无

### 子组件 / 静态导出
**缺失**：- **`Steps.Step`** 子组件式声明（ant 仍兼容，ccui 仅 items 一条路径） - `type='inline'` / `'dot'` / `'panel'` 整套渲染分支 - 行级 `offset` prop（Inline Style Combination 用）

---

## Tabs

- Ant 段：`## tabs`（行 50000–51002）
- ccui types：`packages/ccui/ui/tabs/src/tabs-types.ts`
- ccui docs：`packages/docs/components/tabs/index.md`
- ccui 自报状态：未挂百分比；docs 5 个 :::demo + 完整类型表；types 覆盖基础 + position。视作 ~50%（缺 items API、editable-card、indicator、size、addIcon/removeIcon、hideAdd 等）。

### Demo 对比
**Ant 官方 demo（共 12 条）**：1. Basic（items API） 2. Disabled 3. Centered（`centered`） 4. Icon（item.icon） 5. Indicator（`indicator={{ size, align }}`） 6. Slide（多 tab 滚动） 7. Extra content（`tabBarExtraContent`） 8. Size（small/medium/large） 9. Placement（top/bottom/start/end） 10. Card type tab（`type='card'`） 11. Add & close tab（`type='editable-card'` + onEdit） 12. Customized trigger of new tab（`hideAdd`） 13. Customized bar of tab（`renderTabBar`） 14. Draggable Tabs（DnD） 15. Custom semantic dom styling
**ccui 文档 demo（共 5 条）**：1. Tabs基本用法 2. Tabs卡片风格的标签 3. Tabs带有边框的卡片风格 4. Tabs自定义标签页标题 5. Tabs标签位置的设置
**ccui 缺失的 ant demo**（按 ant 顺序）：- Disabled（独立 demo） - Centered（`centered` prop） - Icon（item-level icon） - Indicator（`indicator={ size, align }`） - Slide（多 tab 滚动） - Extra content（`tabBarExtraContent` 左右双侧） - Size（三档） - Placement（top/bottom/start/end 全套） - Add & close tab（editable-card 增删 + onEdit） - Customized trigger of new tab（`hideAdd`） - Customized bar of tab（`renderTabBar`） - Draggable Tabs - Custom semantic dom styling
**ccui 特有 demo**：- 「Tabs自定义标签页标题」用 `<template #label>` 插槽（ant 走 `items[].label` ReactNode）

### Props 对比
**ccui 缺失的 ant props**（按 ant API 顺序）：- `activeKey` / `defaultActiveKey`（ccui 用 `modelValue` 双向绑定一套，无 default 概念） - `addIcon: ReactNode`（4.4.0，editable-card +号图标自定义） - `removeIcon: ReactNode`（5.15.0，关闭图标自定义） - `animated: boolean | { inkBar, tabPane }` - `centered: boolean`（4.4.0） - `hideAdd: boolean`（editable-card 隐藏 + 号） - `indicator: { size, align: 'start'|'center'|'end' }`（5.13.0） - `items: TabItemType[]`（核心数据驱动 API，ccui 仍走子组件 `<c-tab>` 路径） - `more: MoreProps`（溢出菜单配置） - `renderTabBar: (props, DefaultTabBar) => ReactElement` - `tabBarExtraContent: ReactNode | { left, right }` - `tabBarGutter: number` - `tabBarStyle: CSSProperties` - `destroyOnHidden: boolean`（5.25.0） - `size: 'large' | 'medium' | 'small'` - `onTabClick(key, event)` - `onTabScroll({ direction })` - `onEdit((event|targetKey), action)` - `classNames` / `styles`
**命名/形状差异**：
- ant `type: 'line' | 'card' | 'editable-card'`；ccui `type: '' | 'card' | 'border-card'`（默认走 line，但少了 editable-card）
- ant `tabPlacement: 'top' | 'end' | 'bottom' | 'start'`（v6 用语义化的 start/end）；ccui `tabPosition: 'top' | 'right' | 'bottom' | 'left'`（旧 ant 字典，已被 ant 标记废弃）
- ant 用 `activeKey` + `onChange(activeKey)`；ccui 用 `modelValue` + `v-model` + `change` 事件
- ant TabItemType `{ key, label, icon, children, disabled, closable, closeIcon, forceRender, destroyOnHidden }`；ccui TabProps 仅 `{ label, name, disabled }`，缺 icon/closable/closeIcon/forceRender
**ccui 特有 props**：- `beforeChange: (id) => boolean`（拦截切换） - `customWidth: string` - `cssClass: string`

### Events / 方法 对比
**缺失 events**：- `onEdit` / `onTabClick` / `onTabScroll`
**缺失 expose 方法**：- 无

### 子组件 / 静态导出
**缺失**：- **`Tabs.TabPane`**（ant 已 deprecated，但仍在 export，ccui 无对应导出，应至少注明此 API 已被 items 取代） - `editable-card` 形态整套 - `type='card'` ccui 有 ✓ 但 `border-card` 是 ccui 自创名（ant 没这个 type）

---

## Button

- Ant 段：`## button`（行 4007–5136）
- ccui types：`packages/ccui/ui/button/src/button-types.ts`
- ccui docs：`packages/docs/components/button/index.md`
- ccui 自报状态：未挂百分比；docs 8 个 :::demo + 完整 API 表；emits 仅 `click`。**这是与 ant 形状差异最大的一个组件，沿用 Element Plus 风格而非 ant 风格。** 视作 ~40% 对齐（视觉风格类似，API 不互通）。

### Demo 对比
**Ant 官方 demo（共 13 条）**：1. Syntactic sugar（primary/default/dashed/text/link 5 种 type） 2. Color & Variant（`color × variant` 矩阵：default/primary/danger + 12 PresetColors × outlined/dashed/solid/filled/text/link） 3. Icon（前置 icon） 4. Icon Placement（`iconPlacement: 'start' | 'end'`） 5. Size（large/medium/small） 6. Disabled 7. Loading（boolean | `{ delay, icon }`） 8. Multiple Buttons 9. Ghost Button（`ghost`） 10. Danger Buttons（`danger`） 11. Block Button（`block`） 12. Gradient Button 13. Custom Wave 14. Custom disabled backgroundColor 15. Custom semantic dom styling
**ccui 文档 demo（共 8 条）**：1. 基本使用 2. 不同尺寸 3. 禁用状态 4. 圆角按钮 5. 圆形按钮 6. 朴素按钮 7. 加载状态 8. 图标按钮
**ccui 缺失的 ant demo**（按 ant 顺序）：- Color & Variant 矩阵（ant 5.21+ 核心新 API） - Icon Placement（`iconPlacement: 'start' | 'end'`） - Ghost Button（`ghost`） - Block Button（`block` 占满父宽） - Danger Buttons 独立 demo - Gradient Button（渐变） - Custom Wave - Loading 的 `{ delay, icon }` 对象形态 - Custom semantic dom styling
**ccui 特有 demo**：- 「朴素按钮」（`plain`，Element Plus 风格，ant 无对应；语义最接近 `variant='filled'`） - 「圆角按钮」用 `round` boolean（ant 用 `shape='round'`） - 「圆形按钮」用 `circle` boolean（ant 用 `shape='circle'`）

### Props 对比
**ccui 缺失的 ant props**（按 ant API 顺序）：- `autoInsertSpace: boolean`（5.17+，中文双字符间插空格） - `block: boolean`（占满父容器宽） - `color: 'default' | 'primary' | 'danger' | PresetColors`（5.21+，12 PresetColors：blue/purple/cyan/green/magenta/pink/red/orange/yellow/volcano/geekblue/lime/gold） - `danger: boolean`（独立危险态 prop，ant 沿用为 syntactic sugar） - `ghost: boolean`（透明背景反色） - `href: string`（href 存在时渲染为 `<a>`） - `htmlType: 'submit' | 'reset' | 'button'`（ccui 用 `nativeType` 同义但名字不同） - `iconPlacement: 'start' | 'end'`（取代旧 `iconPosition`） - `loadingIcon: ReactNode`（全局配置项） - `shape: 'default' | 'circle' | 'round'`（ant 用 shape 字段；ccui 拆成两个独立 boolean） - `target: string`（href 配合） - `variant: 'outlined' | 'dashed' | 'solid' | 'filled' | 'text' | 'link'`（5.21+ 与 color 组合） - `loading: boolean | { delay: number, icon: ReactNode }`（ccui 仅 boolean） - `classNames` / `styles`
**命名/形状差异**：
- ant `type: 'primary' | 'dashed' | 'link' | 'text' | 'default'`；ccui `type: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'`（Element Plus 字典，没有 dashed/link/default；有 success/warning/danger/info）
- ant `size: 'large' | 'medium' | 'small'`；ccui `size: 'large' | 'default' | 'small'`（medium → default）
- ant 通过 `color='danger'` 或 `danger` boolean 表达危险态；ccui 用 `type='danger'`
- ant `shape='circle'` / `shape='round'`；ccui `circle: boolean` / `round: boolean`
- ant `htmlType`；ccui `nativeType`
- ant `iconPlacement: 'start' | 'end'`；ccui 仅前置 + `<template #icon>` 插槽
- ant `icon: ReactNode`；ccui `icon: string`（Iconify 名）+ `<template #icon>` 插槽
**ccui 特有 props**：- `plain: boolean`（Element Plus 朴素按钮，语义最近 ant `variant='filled'` + 低饱和度填充，但实现不同）

### Events / 方法 对比
**缺失 events**：- 无（click 是唯一事件）；但 ant 自动透传所有原生 button 事件（focus/blur/keydown...），ccui 仅显式 emit click
**缺失 expose 方法**：- 无

### 子组件 / 静态导出
**缺失**：- **`Button.Group`**（注：ant v6 已弃用 Button.Group 推荐 Space.Compact，但仍在 export；ccui 完全缺失） - PresetColors 整套 12 色板 - color × variant 矩阵 30+ 组合

---

## ConfigProvider

- Ant 段：`## config-provider`（行 10937–12429）
- ccui types：`packages/ccui/ui/config-provider/src/config-provider-types.ts`
- ccui docs：`packages/docs/components/config-provider/index.md`
- ccui 自报状态：CHANGELOG 列入 v2 重点，含 algorithm: 'dark'/'compact'、12 色板 token。视作 ~55%（核心主题 / locale / componentSize 已通，复杂组件级配置缺失最多）。

### Demo 对比
**Ant 官方 demo（共 8 条）**：1. Locale（语言包切换全局） 2. Direction（rtl） 3. Component size 4. Theme（algorithm / token / components） 5. Custom Wave 6. Static function（`holderRender` + ConfigProvider.config） 7. CSP（`csp={{ nonce }}`） 8. App 包裹（Static method context bridging）
**ccui 文档 demo（共 8 条）**：1. 何时使用 2. 自定义品牌色 3. 同时调多个 token 4. 全局组件尺寸 5. 文字方向 6. 多个 ConfigProvider 嵌套 7. 切换语言 8. 在组件内读取配置
**ccui 缺失的 ant demo**（按 ant 顺序）：- Theme algorithm（`algorithm: 'dark' | 'compact' | 'default'`，ccui ThemeConfig 类型已含但 docs 无独立 demo） - Custom Wave（`wave={{ disabled, showEffect, triggerType }}`） - Static function（`ConfigProvider.config({ holderRender })`） - CSP（`csp.nonce`，types 缺 csp 字段） - App 静态方法上下文桥接
**ccui 特有 demo**：- 「多个 ConfigProvider 嵌套」演示层级覆盖 - 「在组件内读取配置」演示 inject 用法

### Props 对比
**ccui 缺失的 ant props**（按 ant API 顺序）：- `componentDisabled: boolean`（4.21+，全局禁用） - `csp: { nonce: string }`（CSP 安全策略） - `getPopupContainer: (trigger?) => HTMLElement | ShadowRoot`（核心：弹层容器） - `getTargetContainer: () => HTMLElement | Window | ShadowRoot`（Affix / Anchor 滚动目标） - `popupMatchSelectWidth: boolean | number`（5.5+） - `popupOverflow: 'viewport' | 'scroll'`（5.5+） - `renderEmpty: (componentName: string) => ReactNode`（核心：空状态注入） - `variant: 'outlined' | 'filled' | 'borderless'`（5.19+，全局表单变体） - `virtual: boolean` - `warning: { strict }` - 已废弃但仍可识别：`~~autoInsertSpaceInButton~~`（推荐 `button={{ autoInsertSpace }}`）/ `~~dropdownMatchSelectWidth~~` - **Component Config 整张表**：`affix / alert / anchor / avatar / badge / breadcrumb / button / card / cardMeta / calendar / carousel / cascader / checkbox / collapse / colorPicker / datePicker / rangePicker / descriptions / divider / drawer / dropdown / empty / flex / floatButton / floatButtonGroup / form / image / input / inputNumber / otp / inputPassword / inputSearch / textArea / layout / list / masonry / menu / mentions / message / modal / notification / pagination / progress / radio / rate / result / ribbon / skeleton / segmented / select / slider / switch / space / splitter / spin / statistic / steps / table / tabs / tag / timeline / timePicker / tour / tooltip / popover / popconfirm / qrcode / transfer / tree / treeSelect / typography / upload / wave` —— ccui 没有任何组件级 ConfigProvider 透传
**命名/形状差异**：
- ant `componentSize: 'small' | 'middle' | 'large'`；ccui 类型字面量已对齐 ✓（注：ant v6.4 起 `componentSize` 标 medium 但保留 middle 兼容）
- ant Theme：`{ algorithm: 'dark' | 'compact' | 'default' | Function[], token, components, cssVar }`；ccui ThemeConfig：`{ token, algorithm, cssVar }`，缺 `components`（组件级 token 覆盖）和函数式 algorithm
- ant 静态方法 `ConfigProvider.config()` / `ConfigProvider.useConfig()` —— ccui 无对应
**ccui 特有 props**：- `prefixCls: string`（默认 `ccui`） - `iconPrefixCls: string`（默认 `ccui-icon`，与 ant `anticon` 对应）

### Events / 方法 对比
**缺失 events**：- 无（ConfigProvider 本身无事件）
**缺失 expose 方法**：- `ConfigProvider.config({ holderRender, prefixCls, iconPrefixCls, theme })`（设置 message/notification/Modal 静态调用上下文，关键） - `ConfigProvider.useConfig(): { componentDisabled, componentSize }`（5.3+，子组件读父 Provider 状态）

### 子组件 / 静态导出
**缺失**：- `ConfigProvider.ConfigContext`（暴露 React Context；ccui 用 inject key CONFIG_INJECT_KEY 顶替，思路一致但 API 形状不同） - 组件级配置（如 `<ConfigProvider button={{ autoInsertSpace: true }} menu={{ expandIcon }} ...>`）整体未实现

---

## FloatButton

- Ant 段：`## float-button`（行 18042–18577）
- ccui types：`packages/ccui/ui/float-button/src/float-button-types.ts`
- ccui docs：`packages/docs/components/float-button/index.md`
- ccui 自报状态：docs 仅 4 个 demo，是本批最简陋的之一；types 拆出 `floatButtonProps` + `backTopProps`，但无 Group。视作 ~40%。

### Demo 对比
**Ant 官方 demo（共 9 条）**：1. Basic 2. Type（primary/default） 3. Shape（circle/square） 4. Content（`content` 文字描述，仅 square） 5. FloatButton with tooltip（含 5.25+ TooltipProps 对象形态） 6. FloatButton Group（基础聚合） 7. Menu mode（Group 的 trigger） 8. Controlled mode（Group open 受控） 9. placement（Group 弹出方向） 10. BackTop 11. badge（`badge: BadgeProps`） 12. Custom semantic dom styling
**ccui 文档 demo（共 4 条）**：1. 基本使用 2. 主色 + 徽标 3. 方形 4. BackTop 回到顶部
**ccui 缺失的 ant demo**（按 ant 顺序）：- Content（square 形态下的 `content` 文字） - FloatButton with tooltip（`tooltip` prop 完整演示） - FloatButton Group 整个聚合容器 - Menu mode（Group + trigger='click'/'hover'） - Controlled mode（Group `open`） - placement（Group 四方向） - Custom semantic dom styling
**ccui 特有 demo**：- 「主色 + 徽标」把 type + badge 合并演示

### Props 对比
**ccui 缺失的 ant props**（按 ant API 顺序）：- `content: ReactNode`（square 形态的文字描述，ant 6.x 把 `description` 已弃用改 `content`；ccui 仍用 `description`） - `disabled: boolean`（6.4+） - `htmlType: 'submit' | 'reset' | 'button'`（5.21+） - `classNames` / `styles` - **FloatButton.Group**：`open / closeIcon / placement: 'top'|'left'|'right'|'bottom' / shape / trigger: 'click'|'hover' / onOpenChange / onClick`
**命名/形状差异**：
- ant `tooltip: ReactNode | TooltipProps`（5.25+ 支持对象形态可配 placement/color）；ccui `tooltip: string`
- ant `badge: BadgeProps`（可配 count / dot / overflowCount / color）；ccui `badge: number | string`
- ant `description` 已废弃；ccui 还在用
**ccui 特有 props**：- 无

### Events / 方法 对比
**缺失 events**：- 无（FloatButton 仅 click）；但 Group 的 `onOpenChange` 缺失
**缺失 expose 方法**：- 无

### 子组件 / 静态导出
**缺失**：- **`FloatButton.Group`** 整体（含菜单展开、placement、trigger、closeIcon）—— ccui 完全缺失这个静态命名空间 - `FloatButton.BackTop` ccui 已用独立 `<c-back-top>` 实现，需复核是否同时挂到 `<c-float-button>` 命名空间下

---

## Icon

- Ant 段：`## icon`（行 23539–23937）
- ccui types：`packages/ccui/ui/icon/src/icon-types.ts`
- ccui docs：`packages/docs/components/icon/index.md`
- ccui 自报状态：docs 14 个 :::demo + Registry API + Iconify 透传，**实现思路与 ant 完全不同**：ant 是图标包 `@ant-design/icons`，ccui 是 Iconify 透传 + 自带 registry。API 不可严格对齐。

> 说明：ant 的 `## icon` 段实际是 `@ant-design/icons` 包安装说明 + IconSearch 工具 + 几个具体图标组件（`HomeOutlined` 等）和 `createFromIconfontCN` 工厂的 API。ccui 是一个**通用 Icon 包装器**，通过 Iconify 名（如 `mdi:magnify`）按需加载 200+ 图标集。两者属于不同的产品形态——前者是"图标集"，后者是"图标渲染器"。下文按"功能映射"而非"prop 对 prop"列。

### Demo 对比
**Ant 官方 demo（共 5 条）**：1. Basic（具名导入 `HomeOutlined` 等） 2. Two-tone icon and colorful icon（`twoToneColor`） 3. Custom Icon（`<Icon component={SvgComponent} />`） 4. Use iconfont.cn（`createFromIconfontCN`） 5. Multiple resources from iconfont.cn（scriptUrl 数组）
**ccui 文档 demo（共 14 条）**：1. 基本用法 2. 尺寸预设 3. 主题样式 4. 自带注册表（项目内复用） 5. 可点击图标（按钮语义） 6. 加载状态 7. 禁用状态 8. 主题 → Iconify 前缀映射 9. 旋转方向 10. Iconify 前缀简化 11. 全局默认（ConfigProvider） 12. 离线 / 自带图标包 13. 直接传入插槽 SVG 14. 常用图标速览
**ccui 缺失的 ant demo**（按 ant 顺序）：- Use iconfont.cn `createFromIconfontCN` 工厂（项目特性差异，可注明） - Multiple resources scriptUrl 数组合并
**ccui 特有 demo**：几乎全部 —— 「自带注册表」 / 「可点击图标」 / 「加载 / 禁用状态」 / 「主题 → Iconify 前缀映射」 / 「Iconify 前缀简化」 / 「全局默认（ConfigProvider）」 / 「直接传入插槽 SVG」 / 「常用图标速览」

### Props 对比
**ccui 缺失的 ant props**：- ant Icon 通用：`className / rotate / spin / style / twoToneColor`（ccui 全部已有 ✓） - ant Custom Icon：`component: ComponentType`（ccui 已有 ✓） - ant 静态方法：`getTwoToneColor()` / `setTwoToneColor(color)` —— ccui 无对应（用 `twoToneColor` prop 替代） - ant `createFromIconfontCN({ scriptUrl, extraCommonProps })` —— ccui 无（用 Iconify 名取代）
**命名/形状差异**：
- ant Icon 是抽象壳，需配合 `@ant-design/icons` 的具名组件使用；ccui Icon 是渲染器，通过 `name` prop 拉取 Iconify 图标
- ant `twoToneColor: string | [string, string]`；ccui `twoToneColor: string`（仅支持单色）
- ant `theme` 是图标名后缀（如 `HomeOutlined`）；ccui `theme: 'outlined' | 'filled' | 'two-tone'` 是渲染配置
**ccui 特有 props**：- `name: string`（Iconify 名，如 `mdi:magnify`） - `size: 'small' | 'default' | 'large' | number | string`（预设 + 数值） - `themePrefixMap: Partial<Record<IconTheme, string>>`（主题 → 前缀映射） - `spinDirection: 'cw' | 'ccw'` - `loading: boolean`（加载态） - `clickable: boolean`（按钮语义 + 焦点环） - `disabled: boolean` - `iconifyPrefix: string`（默认前缀，简写时省略） - `title: string` / `ariaLabel: string`（无障碍） - `prefixCls: string`

### Events / 方法 对比
**缺失 events**：- 无（ant 也无 Icon 专属事件，原生 DOM 事件透传）
**缺失 expose 方法**：- `setTwoToneColor` / `getTwoToneColor` 静态方法 - `createFromIconfontCN` 工厂

### 子组件 / 静态导出
**缺失**：- 几百个具名图标组件（`HomeOutlined / SettingFilled / ...`）—— ccui 改用 Registry + Iconify 名访问，**不应硬对齐**，应在文档明确写"等价方式：`<c-icon name='ant-design:home-outlined' />`" - `createFromIconfontCN` 工厂

---

## Status（项目特色，无 ant 对应）

- Ant 段：**无 ant 对应（项目特色）**
- ccui types：`packages/ccui/ui/status/src/status-types.ts`
- ccui docs：`packages/docs/components/status/index.md`
- ccui 自报状态：docs 6 个 :::demo + API；types 极薄（仅 1 个 `type` prop）。

> **建议视作 ant `Tag` 的语义子集别名 + Badge.Status 的圆点形态**。功能上等价于「带颜色圆点 + 状态文本」的复合，对应 ant 的 `<Badge status='success' text='已完成'/>` 或 `<Tag color='success'>已完成</Tag>`。新组件应优先复用 Badge.status / Tag，Status 作为 v2 兼容别名保留。

### Demo 对比
**Ant 官方 demo（共 N 条）**：—— 无 ant 对应
**ccui 文档 demo（共 6 条）**：1. 何时使用 2. 基本使用 3. 全部类型 4. 配合表格 5. 配合数字与文字 6. 动态切换 +（API）
**ccui 缺失的 ant demo**（按 ant 顺序）：- N/A
**ccui 特有 demo**：- 全部

### Props 对比
**ccui 缺失的 ant props**（按 ant API 顺序）：- N/A（无对应）。若映射到 Badge.status：缺 `text` 单独 prop（ccui 走默认插槽）、缺 `count` / `dot` / `offset` / `color`（自定义色）
**命名/形状差异**：
- ccui `type: 'success' | 'error' | 'initial' | 'warning' | 'waiting' | 'running' | 'invalid' | 'info'`（8 种）
- ant Badge.status 仅 `'success' | 'processing' | 'default' | 'error' | 'warning'`（5 种）；ccui 多了 `initial / waiting / running / invalid` 四个运维语义色
**ccui 特有 props**：- `type` 字面量含 `running / waiting / invalid / initial` 是项目特色

### Events / 方法 对比
**缺失 events**：- N/A
**缺失 expose 方法**：- N/A

### 子组件 / 静态导出
**缺失**：- N/A
