# vue3-ccui 与 Ant Design 组件对比清单

> 数据来源：Ant Design 官方组件总览（基于 v6.3.7 口径，共 71 个官方组件）。
> 当前项目目录：`packages/ccui/ui` 下共 62 个一级目录，其中 60 个组件/工具入口；`shared` 与 `style-var` 为内部支撑目录，不计入组件覆盖数。
> 当前项目组件：60 个组件/工具入口（含 `button-3d` 项目特色组件、`masonry` 布局扩展、`util` 工具入口）。
> 更新时间：2026-05-08，新增 Icon 95% 版（clickable / spinDirection / iconifyPrefix / ConfigProvider 集成 / Iconify 离线 API + 26 个定向测试）、Select 80% 版（分组 / fieldNames / tags / 远程搜索 / FormItem 联动 + 31 个定向测试）和 Tree 80% 版（推翻重写，受控/checkable/loadData/搜索/拖拽 + 31 个定向测试），其他口径同 2026-05-06。

## 零、交付完整度口径

后续组件交付按复杂度分层验收，优先覆盖用户高频功能、Vue 状态协议（`v-model:*` / `update:*` / `default*` / 内部状态）、事件联动、空/禁用/loading 状态、文档示例和定向测试：

- 简单组件：功能完整度 100%，定向测试完整度 100%，文档覆盖基础用法、常用变体和状态。
- 中等难度组件：功能完整度 90%，定向测试完整度 90%，允许仅延后低频边界能力，但必须在文档中列明。
- 复杂组件：高频功能完整度 80%，定向测试完整度 80%，优先交付渲染、交互、`v-model:*` 外部状态接管、事件协议和组合场景；固定列、虚拟滚动、复杂浮层等低频/高成本能力可拆后续批次。
- 每个未达完整对齐的组件必须记录剩余项，不能只用“基础完成”替代覆盖说明。

## 一、已覆盖组件（60 项）

| ccui 组件             | Ant Design 对应         | 分类            | 状态         |
| --------------------- | ----------------------- | --------------- | ------------ |
| Affix                 | Affix 固钉              | 其他            | 已完成       |
| Alert                 | Alert 警告提示          | 反馈            | 已完成       |
| Anchor                | Anchor 锚点             | 导航            | 已完成       |
| Avatar                | Avatar 头像             | 数据展示        | 已完成       |
| Badge                 | Badge 徽标数            | 数据展示        | 已完成       |
| Breadcrumb            | Breadcrumb 面包屑       | 导航            | 已完成       |
| Button                | Button 按钮             | 通用            | 已完成       |
| Button3D              | 项目特色组件            | 通用            | 已完成       |
| Calendar              | Calendar 日历           | 数据展示        | 已完成       |
| Card                  | Card 卡片               | 数据展示        | 已完成       |
| CheckBox              | Checkbox 多选框         | 数据录入        | 已完成       |
| Collapse              | Collapse 折叠面板       | 数据展示        | 已完成       |
| ConfigProvider        | ConfigProvider 全局配置 | 其他            | 已完成       |
| Descriptions          | Descriptions 描述列表   | 数据展示        | 已完成       |
| Divider               | Divider 分割线          | 布局            | 已完成       |
| Drawer                | Drawer 抽屉             | 反馈            | 已完成       |
| Dropdown              | Dropdown 下拉菜单       | 导航            | 已完成       |
| Empty                 | Empty 空状态            | 数据展示        | 已完成       |
| Flex                  | Flex 弹性布局           | 布局            | 已完成       |
| FloatButton / BackTop | FloatButton 悬浮按钮    | 通用            | 已完成       |
| Form                  | Form 表单               | 数据录入        | 80% 完成     |
| Grid                  | Grid 栅格               | 布局            | 已完成       |
| Icon                  | Icon 图标               | 通用            | 95% 完成     |
| Image                 | Image 图片              | 数据展示        | 已完成       |
| Input                 | Input 输入框            | 数据录入        | 已完成       |
| InputNumber           | InputNumber 数字输入框  | 数据录入        | 已完成       |
| Layout                | Layout 布局             | 布局            | 已完成       |
| List                  | List 列表               | 数据展示        | 已完成       |
| Masonry               | 瀑布流布局              | 布局            | 已完成       |
| Menu                  | Menu 导航菜单           | 导航            | 已完成       |
| Message               | Message 全局提示        | 反馈            | 已完成       |
| Modal                 | Modal 对话框            | 反馈            | 已完成       |
| Notification          | Notification 通知       | 反馈            | 已完成       |
| Pagination            | Pagination 分页         | 导航            | 已完成       |
| Popconfirm            | Popconfirm 气泡确认框   | 反馈            | 已完成       |
| Popover               | Popover 气泡卡片        | 反馈            | 已完成       |
| Progress              | Progress 进度条         | 反馈            | 已完成       |
| Radio                 | Radio 单选框            | 数据录入        | 已完成       |
| Rate                  | Rate 评分               | 数据录入        | 已完成       |
| Result                | Result 结果             | 反馈            | 已完成       |
| Segmented             | Segmented 分段控制器    | 数据展示        | 已完成       |
| Select                | Select 选择器           | 数据录入        | 80% 完成     |
| Skeleton              | Skeleton 骨架屏         | 反馈            | 已完成       |
| Slider                | Slider 滑动输入条       | 数据录入        | 已完成       |
| Space                 | Space 间距              | 布局            | 已完成       |
| Spin                  | Spin 加载中             | 反馈            | 已完成       |
| Splitter              | Splitter 分隔面板       | 布局            | 已完成       |
| Statistic             | Statistic 统计数值      | 数据展示        | 已完成       |
| Status                | Tag 近似组件            | 通用 / 数据展示 | 已完成       |
| Steps                 | Steps 步骤条            | 导航            | 已完成       |
| Switch                | Switch 开关             | 数据录入        | 已完成       |
| Tabs                  | Tabs 标签页             | 导航            | 已完成       |
| Table                 | Table 表格              | 数据展示        | 85% 高频完成 |
| Tag                   | Tag 标签                | 数据展示        | 已完成       |
| Timeline              | Timeline 时间轴         | 数据展示        | 已完成       |
| Tooltip               | Tooltip 文字提示        | 反馈            | 已完成       |
| Tree                  | Tree 树形控件           | 数据展示        | 80% 完成     |
| Typography            | Typography 排版         | 通用            | 已完成       |
| Util                  | 工具函数集合            | 其他            | 已完成       |
| Watermark             | Watermark 水印          | 数据展示        | 已完成       |

> 备注：`Status` 功能上接近 Ant Design 的 `Tag`，已有独立 `Tag` 后，建议后续把 `Status` 视为别名兼容或逐步废弃。
> `Select` 当前为基础可用版本，已覆盖单选、多选、搜索、清空、禁用、loading、空状态、tag 限制和基础键盘交互；尚未达到 Ant Design Select 的完整能力。
> `Form` 当前为 80% 覆盖版本，已覆盖字段注册、规则校验、字段级校验、初始值、依赖联动、滚动到错误字段、复杂 name path、重置、清理校验和 submit 校验流程；尚未包含 `Form.List`、`Form.Provider`、`preserve` 等完整高级能力。

## 二、缺失组件清单

### 中等复杂度剩余（3 项）

| 组件                   | 分类     | 复杂点                                   | 建议优先级 |
| ---------------------- | -------- | ---------------------------------------- | ---------- |
| Carousel 走马灯        | 数据展示 | 自动播放、手势、键盘、循环与动画状态     | P2         |
| QRCode 二维码          | 数据展示 | 二维码生成库、纠错级别、图标嵌入         | P2         |
| ColorPicker 颜色选择器 | 数据录入 | 色板、HSV/RGB/HEX 转换、透明度、浮层交互 | P2         |

### 复杂组件（9 项）

| 组件                  | 分类     | 复杂点                              | 建议优先级 |
| --------------------- | -------- | ----------------------------------- | ---------- |
| DatePicker 日期选择框 | 数据录入 | 日期面板、范围、时间联动、国际化    | P1         |
| TimePicker 时间选择框 | 数据录入 | 滚轮选择、范围、禁用项              | P1         |
| Cascader 级联选择     | 数据录入 | 多级联动、异步加载、搜索            | P1         |
| TreeSelect 树选择     | 数据录入 | Select + Tree 组合、搜索、多选      | P1         |
| Transfer 穿梭框       | 数据录入 | 双列管理、搜索、分页、批量选择      | P2         |
| Upload 上传           | 数据录入 | 拖拽、切片、进度、预览、错误处理    | P2         |
| AutoComplete 自动完成 | 数据录入 | 与 Input 紧耦合、候选项、键盘交互   | P2         |
| Mentions 提及         | 数据录入 | contentEditable、触发解析、光标定位 | P3         |
| Tour 漫游引导         | 数据展示 | 多步定位、蒙层裁切、滚动跟随        | P3         |

## 三、本轮交付记录

### Batch 1：主题与简单组件

- 主题 Token 重构：`packages/theme/themes/light.ts` / `dark.ts` 对齐 Ant Design v6.3.7 SeedToken / MapToken 口径。
- 新增 14 个简单组件，覆盖 Tag、Badge、Space、Flex、Typography、Alert、Empty、Spin、Skeleton、Progress、Switch、Segmented、Result、Breadcrumb。
- 新增单测和 VitePress 文档，并对既有 Button、Input、Card、Divider、Status、Avatar 做视觉对齐。

### Batch 2：复杂组件零依赖组

已完成 6 项：Grid、Layout、Splitter、Masonry、ConfigProvider、Util。

关键能力：

- Grid：24 栅格、5 断点响应式、gutter。
- Layout：Header / Sider / Content / Footer，Sider 折叠。
- Splitter：水平/垂直拖拽分隔、min/max 约束。
- ConfigProvider：prefixCls、componentSize、direction、theme.token。
- Util：classNames、debounce、throttle、clamp 等工具。

### 设计排除项

- App：Ant Design React 里用于承载静态方法上下文，但 Vue 组件库没有必要额外提供同名包裹组件。全局能力应优先通过 `app.use()`、`ConfigProvider`、组合式 API 或命令式服务自身的挂载机制处理，避免和 Vue 的 `App` 类型/实例概念混淆。

### Batch 3：中等复杂度主体

已完成 18 项：Pagination、Steps、Statistic、Collapse、Descriptions、Popconfirm、Modal、Drawer、Dropdown、Message、Notification、Image、Menu、Anchor、Affix、List、Watermark、FloatButton / BackTop。

来源记录中的验证结果：

- Batch 3 新增 56 个文件。
- 全量测试记录中 409 个用例通过。
- 视觉抽查已覆盖 16 个中等组件；Message / Notification 曾因 VitePress demo 导入路径问题待修，后续提交记录显示已纳入修复。

关键工程决策：

- Modal / Drawer 使用 `Teleport` + `<Transition>`。
- Message / Notification 使用命令式 API 和独立挂载容器。
- Affix / Anchor 在 jsdom 中避免依赖 `instanceof Window`，改用更稳定的 target 判定，并补充 DOM API 兜底。
- Watermark 的 MutationObserver 仅监听 `childList`，避免 attributes 变更触发自递归。
- Image 预览使用 `Teleport`，并对 IntersectionObserver 做兼容兜底。

### Batch 4：Icon 与 Select 基础版

已完成 2 项：Icon、Select。

关键能力：

- Icon：支持注册表 API（`registerIcon` / `resolveIcon` / `unregisterIcon` / `clearIconRegistry`）、组件图标、插槽图标、font icon fallback、尺寸、颜色、旋转和 spin。
- Select：支持单选、多选、filterable 搜索、clearable 清空、disabled、loading / empty 文案、maxTagCount、外部点击关闭、Escape 关闭、Enter / Arrow 键盘选择。
- Select 已补充关键交互测试，从 6 个用例扩展到 15 个用例，覆盖单选、多选、清空、禁用、搜索、tag 限制、可见状态和键盘路径。
- Select 修复项：option 点击冒泡导致单选关闭后重开、多选已有 tag 后无法继续搜索、键盘导航命中 disabled option、乱码默认文案显示字符。

验证结果：

- `vp check` 通过。
- `vp test packages/ccui/ui/icon/test/icon.test.ts --environment jsdom` 通过。
- `vp test packages/ccui/ui/select/test/select.test.ts --environment jsdom` 通过，15 个用例通过。
- `vp run --filter docs docs:build` 通过；当时仍有 Grid / Tag 既有 Sass warning，后续 Batch 6 已修复。
- `vp test --environment jsdom` 全量仍失败，失败来自既有 TSX import-analysis 配置/解析问题，例如 `packages/ccui/ui/affix/src/affix.tsx`，不属于 Icon / Select 定向测试失败。

Select 剩余非完整对齐项：

- 尚未支持 option group、自定义 option/tag render、remote search 约定、popup container / placement、fieldNames、虚拟列表、tags / allowCreate 模式、完整 ARIA 和 Form 校验状态集成。

### Batch 5：Form 80% 覆盖版

已完成 1 项：Form。

关键能力：

- Form：支持 `model` / `rules` / `initialValues` / `validateMessages`、字段注册与卸载、`validate` / `validateField` / `resetFields` / `clearValidate` / `scrollToField` 暴露方法、submit 自动校验、字段校验事件、失败事件和 `scrollToFirstError`。
- FormItem：支持 `label`、`name` / `prop`、`required`、字段级 `rules`、`help`、`extra`、`validateStatus`、`dependencies`、`htmlFor`、`colon`、`hidden`、`noStyle`、label 宽度/位置、必填/可选标记、错误/成功/校验中状态样式。
- 校验规则：支持 required、type、email、url、enum、whitespace、min / max / len、pattern、同步/异步自定义 validator，并支持 blur / change / submit 触发规则过滤和消息模板。
- 已补充 32 个 Form 定向测试，覆盖布局渲染、必填/正则/长度校验、异步 validator、字段级校验、清理校验、重置字段、触发器过滤、submit、数组 name path、初始值、消息模板、依赖联动、隐藏/noStyle 字段、类型校验和滚动到错误字段。
- 修复 `cloneValue` 在 jsdom 下遇到 Vue reactive proxy 触发 `DataCloneError` 的问题，失败时回退到 JSON 克隆。

验证结果：

- `vp check` 通过。
- `vp test packages/ccui/ui/form/test/form.test.ts --environment jsdom` 通过，32 个用例通过。
- `vp run --filter docs docs:build` 通过；Grid / Tag Sass warning 已在 Batch 6 修复。

Form 剩余非完整对齐项：

- 尚未支持动态 `Form.List`、`Form.Provider`、`preserve`、`validateDebounce`、`normalize`、`getValueProps`、`shouldUpdate` / render props、状态图标、完整 ARIA、与所有录入组件的校验状态深度联动，以及更完整的滚动容器定位和国际化包级默认文案。

### Batch 6：Sass Warning 修复

已完成 2 项：Grid、Tag 样式 warning 修复。

关键能力：

- Grid：使用 `sass:math` 的 `math.div` / `math.percentage` 替代 Sass 即将移除的 `/` 除法和全局 `percentage()`。
- Tag：将预设色名改为字符串 key，避免 Dart Sass 把 `red`、`blue`、`purple` 等裸词当作颜色值参与插值。

验证结果：

- `vp check` 通过。
- `vp run --filter docs docs:build` 通过，Grid / Tag 相关 Sass warning 已消失。
- 当前 docs build 仅剩 `baseline-browser-mapping` 数据过期提示和插件耗时提示，不属于组件 Sass warning。

### Batch 7：Table 高频 80% 版

已完成 1 项：Table。

关键能力：

- Table：支持基础列渲染、`dataIndex` 路径取值、`rowKey`、空状态、loading 遮罩、bordered、size、header/body 自定义插槽和列级 `customRender`。
- 排序：支持 `sorter: true` 默认值排序和函数排序，按 ascend / descend / none 循环，并通过 `update:sorter` 与 `change` 暴露状态。
- 筛选：支持列级 filters、单选/多选筛选和由外部状态接管的 `filteredValue`，通过 `update:filters` 与 `change` 暴露状态。
- 分页：复用 Pagination 样式类，内置轻量分页渲染，支持本地分页、pageSize 切换和 `update:pagination` 联动。
- 测试：Table 定向测试从 6 个扩展到 46 个，覆盖渲染、嵌套路径取值、缺失路径兜底、rowKey 字符串/函数/回退、customRender、header/body 插槽、非排序列点击、筛选点击不误触排序、排序三态、函数排序、外部状态接管排序、columnKey 推导、单选/多选/多列/外部状态接管筛选、数字/布尔筛选值保持、change payload、筛选后排序、排序/筛选重置分页、分页 true/object/false、上一页/下一页/边界禁用、外部 total、pageSize 切换、外部状态接管分页更新、empty/loading、自定义 empty、空列 colspan、宽度/对齐/尺寸样式和隐藏表头。

Table 剩余非完整对齐项：

- 尚未支持固定列、展开行、合并单元格、树形数据、虚拟滚动、远程数据协议、复杂筛选浮层、完整 ARIA 和横向滚动固定表头。

### Batch 8：Table 行选择增强

已完成 1 项：Table rowSelection。

关键能力：

- Table：新增 `rowSelection` 配置，支持 checkbox / radio 行选择、由外部状态接管的 `selectedRowKeys`、用于初始化内部状态的 `defaultSelectedRowKeys`、禁用行、选择列宽度、隐藏全选、选中行样式和 `update:selectedRowKeys`。
- 事件协议：支持 `rowSelection.onChange`、`onSelect`、`onSelectAll`，回传 selected keys、selected rows 与本次可变更行。
- 文档：Table 文档补充 Row Selection 示例，覆盖 `v-model`/外部状态接管选择和禁用行。
- 测试：Table 定向测试从 46 个扩展到 52 个，新增 checkbox 单行选择、外部状态接管选择、radio 单选、全选跳过禁用行、取消全选和分页下保留非当前页选中项。

验证结果：

- `vp check` 通过。
- `vp test packages/ccui/ui/table/test/table.test.ts --environment jsdom` 通过，52 个用例通过。

### Batch 12：Icon 95% 完成

已完成 1 项：Icon。

关键能力：

- `clickable` 让图标变成无障碍按钮：`role="button"` + `tabindex="0"` + Enter / Space 键盘激活，hover 自动降透明度，`focus-visible` 显示 outline。
- `spinDirection: 'cw' | 'ccw'`：spin 动画反向。
- `iconifyPrefix`：`name` 不含 `:` 时自动拼成 `${prefix}:${name}`，常用一组 Iconify 图标时少写一遍前缀。
- ConfigProvider 集成：自动读取 `iconPrefixCls`（字体 fallback 类前缀）和 `componentSize`（small=14、middle=级联、large=20），显式 prop 仍优先。
- 透传 Iconify 离线 API：`addCollection` / `addIcon` / `loadIcon` / `loadIcons` / `addAPIProvider` 直接从 `vue3-ccui` 导出，方便预注入图标集或切自建 API 服务。
- 文档：新增可点击、旋转方向、Iconify 前缀简化、ConfigProvider、离线 API 共 5 个新章节，加 Props 表新增三个字段、新增"事件"和"Iconify 透传 API"两个表。
- 测试：从 14 个扩展到 26 个，新增 clickable role+tabindex+点击、Enter/Space 激活、非 clickable 不挂 role、spinDirection ccw 类、spinDirection cw 不挂、iconifyPrefix 拼接、含冒号时忽略 prefix、ConfigProvider componentSize=small 默认尺寸、显式 size 覆盖 ConfigProvider、ConfigProvider iconPrefixCls 字体 fallback、显式 prefixCls 覆盖、Iconify 透传 API 函数性导出。

工程决策：

- Icon 不直接 `import { useConfig }` 自 ConfigProvider（会触发 jsdom 下的 vite TSX import-analysis bug），改为直接 `inject(CONFIG_INJECT_KEY, DEFAULT_CONFIG)`，从 types 文件单独导入 key。
- ConfigProvider 的 `componentSize` 是 `'small' | 'middle' | 'large'`、Icon 的 `IconSizePreset` 是 `'small' | 'default' | 'large'`，通过 `mapConfigSize`（`'middle'` → `'default'`）跨过该差异。

验证结果：

- `vp check` 通过。
- `vp test packages/ccui/ui/icon/test/icon.test.ts --environment jsdom` 通过，26 个用例。

Icon 剩余 5% 项：

- 没有自带预置 SVG 集（按设计走 Iconify，不向仓库塞 svg 文件）。
- `theme` 当前仅作为 CSS 类钩子，没有自动按主题切换 Iconify 不同前缀（社区做法差异较大，留给消费者自行映射）。
- `loading` 状态下的 skeleton 占位（异步加载时图标尚未到位）。

### Batch 11：Tree 80% 完成（API 推翻重写）

已完成 1 项：Tree。

关键能力：

- **推翻重写**：旧实现仅有 `data` + `level` + `open` 字段渲染，约 50 行。新实现按 Ant Design Tree 的协议重新设计 props / 事件 / 插槽，新旧 API 不兼容（旧 `level` / `open` 字段不再使用）。
- 选中：`selectable` + `selectedKeys` / `defaultSelectedKeys` / `v-model:selected-keys`，单选 / 多选（`multiple`）。
- 勾选：`checkable` + `checkedKeys` / `defaultCheckedKeys` / `v-model:checked-keys`，自动父子半选联动；`checkStrictly` 关闭联动；`disableCheckbox` 锁勾选不锁选中。
- 展开：`expandedKeys` / `defaultExpandedKeys` / `v-model:expanded-keys`，`defaultExpandAll` 一键全开。
- 字段名映射：`fieldNames`（key / title / children / disabled / disableCheckbox / isLeaf / selectable）。
- 异步加载：`loadData(node)`，展开非叶子未加载节点时调用，loading 期间 switcher 显示动画。
- 搜索：`searchValue` 默认按 title 子串匹配并保留命中节点的祖先；命中片段用 `__highlight` span 包裹；`filterTreeNode` 函数自定义谓词。
- 拖拽：`draggable` 启用，emit `drop` 事件并回传 `{ dragNode, node, dropPosition }`，`dropPosition` 三态 `before/inside/after`，组件不直接改 `data`，业务侧自行处理。
- 自定义渲染：`title` / `switcher` / `icon` 三个插槽。
- ARIA：`role="treeitem"` + `aria-selected` / `aria-expanded` / `aria-disabled` / 复选框 `aria-checked='mixed'`。
- 文档：基本用法、受控/非受控、多选、勾选+联动、fieldNames、异步加载、搜索高亮、自定义渲染、拖拽 共 8 块示例 + 完整 props/事件/插槽/类型表。
- 测试：从 0 个补到 31 个定向测试，覆盖默认折叠 / switcher 展开 / 折叠 / defaultExpandAll / 受控 expandedKeys / 单选 / 多选 / disabled 不可选 / selectable=false / 受控 selectedKeys / 父勾选传播 / 半选父级 / checkStrictly / disabled checkbox / disableCheckbox / fieldNames / 搜索过滤 + 高亮 / 自定义谓词 / 自定义 title / switcher / icon 插槽 / loadData / 拖拽 emit drop / draggable=false / 空状态 / disabled 整树 / data 响应 / blockNode / ARIA / 半选→全选切换。

工程决策：

- 拆三个 composables：`use-tree-flatten`（含 fieldNames 解析、扁平化、可见过滤+ancestors 保留）、`use-tree-state`（受控/非受控通用模式）、`use-tree-check`（衍生 checked / halfChecked + 计算下一步勾选 keys）。
- 选中 / 勾选 / 展开三组 keys 都走同一个 `useControllableSet` 抽象，避免重复实现受控 / 非受控分发。
- 删除旧的 `components/icon-close.tsx` / `icon-open.tsx` / `composables/use-toggle.ts`，留下空目录由本次新增的 `composables/` 替代。

验证结果：

- `vp check` 通过。
- `vp test packages/ccui/ui/form packages/ccui/ui/select packages/ccui/ui/icon packages/ccui/ui/tree --environment jsdom` 通过，108 个用例（form 32 + select 31 + icon 14 + tree 31）通过。

Tree 剩余非完整对齐项：

- 虚拟滚动（数据量大时性能不足）。
- 节点级 `dragOver` / `dragInto` 区分判定的更细化交互（当前用 25% / 75% 分界）。
- 连接线 `showLine` 仅作为 prop 钩子，未提供默认连接线 SVG。
- 异步 loadData 失败时的重试 / 错误状态。
- 大数据量下的可见区只渲染（virtual list）。
- 键盘导航（Up/Down/Left/Right/Enter）。
- 拖拽时的 auto-scroll。

### Batch 10：Select 80% 完成

已完成 1 项：Select。

关键能力：

- 选项分组：`options` 中含 `options` 数组的节点视为 group，渲染分组标题；搜索时空 group 自动隐藏。
- `fieldNames` 字段名映射：支持把任意字段（label/value/disabled/options）映射到自定义键，不影响 `modelValue` 协议。
- `mode: 'default' / 'multiple' / 'tags'`：`tags` 模式允许 Enter 创建新值，空白和重复值自动忽略；保留旧的 `multiple` 兼容。
- 远程搜索：`filterOption=false` 关掉前端过滤，监听 `search` 事件做异步加载，配合 `loading`；`filterOption` 也接受函数自定义谓词。
- Popup 定位：`placement='bottom' / 'top' / 'auto'`，基于 `@floating-ui/vue` 自动 flip / shift。
- 自定义渲染：`option`、`tag`、`selected`、`empty`、`prefix`、`suffix` 全套插槽。
- FormItem 联动：通过新增的 `formItemInjectionKey` 注入校验上下文，error / warning 边框自动同步，`modelValue` 改动触发 `validate('change')`、下拉关闭触发 `validate('blur')`；也提供 `status` prop 显式覆盖。
- Backspace 在多选 + 搜索为空时删除最后一个 tag。
- 文档：基本用法、多选、tags、远程搜索、自定义谓词、分组、fieldNames、自定义渲染、placement、FormItem 联动 共 10 块示例。
- 测试：Select 定向测试从 15 个扩展到 31 个，新增分组渲染、分组过滤、fieldNames、filterOption=false、filterOption 函数、tags Enter 创建、tags 空白/重复忽略、mode=multiple 兼容、Backspace 删 tag、自定义 option/tag/empty 插槽、status 错误/警告类、FormItem 注入 validateStatus、FormItem validate('change'/'blur')、placement 应用、popupClassName 透传。

工程决策：

- 在 `packages/ccui/ui/form/src/form-types.ts` 新增 `formItemInjectionKey` 和 `FormItemInjectedContext`，FormItem 通过 `provide` 暴露 `validateStatus` / `validate`，让任意录入组件都能可选注入。Select 是第一个对接的录入组件。
- Select 浮层基于既有依赖 `@floating-ui/vue`，无需新增 popup 容器实现。

验证结果：

- `vp check` 通过。
- `vp test packages/ccui/ui/form packages/ccui/ui/select packages/ccui/ui/icon --environment jsdom` 通过，77 个用例（form 32 + select 31 + icon 14）通过。

Select 剩余非完整对齐项：

- 虚拟列表（按规划单独拆后续）。
- 树形 / 级联选择器（属于 TreeSelect / Cascader 单独组件）。
- option group 嵌套（当前只支持一层 group）。
- popup 自定义容器（getPopupContainer）。
- ARIA 完整支持（aria-activedescendant 部分覆盖）。

### Batch 9：Icon 80% 完成（Iconify 适配）

已完成 1 项：Icon。

关键能力：

- Icon：集成 [`@iconify/vue`](https://iconify.design/)，`name` 含 `:` 时（如 `mdi:home`）自动走 Iconify 渲染，可直接消费 200+ 图标集。
- 解析优先级明确：`component` > Iconify 命名 > 注册表命中 > 字体图标类名（`<i class="ccui-icon-{name}">`） > 默认插槽。
- `size` 支持 `small / default / large` 预设和数字 px / 任意 CSS 长度，`default` 不写内联字号以便父级 `font-size` 级联。
- 新增 `theme: 'outlined' | 'filled' | 'two-tone'` 类名钩子和 `twoToneColor` 副色（通过 `--ccui-icon-two-tone-color` 暴露）。
- 文档：基本用法、尺寸预设、主题、注册表、插槽 SVG、~40 个高频 Iconify 图标分组速览（通用 / 账号 / 操作 / 导航 / 反馈 / 文件&媒体）。
- 测试：Icon 定向测试从 4 个扩展到 14 个，新增 Iconify 检测、Iconify 优先于注册表、size 预设、CSS 单位字符串、`size="default"` 不写 inline、theme 类名、twoToneColor CSS 变量、组件优先级、registry API 暴露、ARIA 属性。

验证结果：

- `vp check` 通过。
- `vp test packages/ccui/ui/icon/test/icon.test.ts --environment jsdom` 通过，14 个用例通过。

Icon 剩余非完整对齐项：

- 没有自带预置 SVG 集（按设计走 Iconify 适配，不向仓库塞 svg 文件）。
- 没做按需 / 懒加载图标包级别拆分（Iconify 自身按图标 lazy fetch）。
- twoTone / outlined / filled 仅作为 CSS 钩子暴露，没有自动按主题映射 Iconify 不同前缀。

## 四、后续任务规划

### 测试覆盖率后续原则

当前覆盖率基线为 Statements `93.76%`、Branches `84.26%`、Functions `94.10%`、Lines `94.08%`。后续不建议为了数字硬追 `95%`；应优先补能证明真实用户行为、Vue 状态协议、事件协议和副作用清理的测试。

建议新任务从以下方向继续：

1. 审查新增测试质量，移除或改写过度依赖 DOM 细节、Transition 时序、内部实现变量的低价值断言。
2. 补高价值剩余缺口：`statistic/countdown`、`collapse-item`、`slider/use-slider`、`float-button/back-top`、`popover/tooltip`。
3. 清理 coverage 输出噪声：Vitest/coverage mixed versions 提示，以及 jsdom `window.scrollTo` not implemented 噪声。
4. 每次推进后重新记录覆盖率基线，并明确说明覆盖率目标服从真实行为测试质量。

### P0：补齐核心复杂组件

1. Table：在基础版上继续拆固定列、展开行、合并单元格、树形数据、虚拟滚动和远程数据协议。
2. Form：在 80% 覆盖版上继续补动态 `Form.List`、`Form.Provider`、`preserve`、状态图标、完整 ARIA 和录入组件深度联动。
3. Select：在基础版上继续补 option group、自定义渲染、远程搜索协议、虚拟列表、popup 定位和 Form 校验状态集成。

### P1：补齐高频录入和基础设施

1. DatePicker / TimePicker：建议先抽日期时间工具层，再做面板组件。
2. Cascader / TreeSelect：复用 Tree 和 Select 的已完成能力。

### P2：增强展示与低频录入

1. Carousel：优先基础切换、自动播放、指示器，再补手势和无障碍键盘。
2. QRCode：评估轻量二维码库，避免把生成算法手写进组件库。
3. ColorPicker：先完成 HEX/RGB/HSV 转换和基础浮层，再补透明度与预设色。
4. Transfer / Upload：分别作为独立较大任务推进，避免和 Form/Table 同轮耦合。

### P3：体验型组件

1. AutoComplete：可在 Select 和 Input 稳定后实现。
2. Mentions：需要单独处理输入解析和光标定位。
3. Tour：依赖浮层定位、滚动跟随和遮罩裁切，建议最后做。

## 五、当前已知修复

- `packages/ccui/ui/vue-ccui.ts` 已移除 ccui `App` 组件的导入、安装和命名导出，Vue 安装函数类型保留为 `VueApp`。
- `packages/ccui/ui/grid/src/grid.scss` 已修复 Dart Sass `/` 除法和全局 `percentage()` deprecation warning。
- `packages/ccui/ui/tag/src/tag.scss` 已修复预设色名插值 warning。
