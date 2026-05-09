# vue3-ccui 与 Ant Design 组件对比清单

> 数据来源：Ant Design 官方组件总览（基于 v6.3.7 口径，共 71 个官方组件）。
> 当前项目目录：`packages/ccui/ui` 下共 75 个一级目录，其中 73 个组件/工具入口；`shared` 与 `style-var` 为内部支撑目录，不计入组件覆盖数。
> 当前项目组件：73 个组件/工具入口（含 `button-3d` 项目特色组件、`masonry` 布局扩展、`util` 工具入口）。
> 更新时间：2026-05-09，**P3 体验组件收口 / Mentions 80% 首次交付**：31 用例，textarea + 多 prefix 触发 + 7 个 `findActiveMention` 纯函数测例（含 email-style `me@x` 防误触发、空白后允许、多 prefix 选最近）+ filterOption 三态 + 键盘导航 + 选中插入 prefix+value+split + 受控/非受控 v-model + Form blur/change validate。**P2 大件 + P3 体验型全部 80% 收口**：剩余工作仅有长尾 80→95% 推进与测试质量审查（详见四节）。

## 零、交付完整度口径

后续组件交付按复杂度分层验收，优先覆盖用户高频功能、Vue 状态协议（`v-model:*` / `update:*` / `default*` / 内部状态）、事件联动、空/禁用/loading 状态、文档示例和定向测试：

- 简单组件：功能完整度 100%，定向测试完整度 100%，文档覆盖基础用法、常用变体和状态。
- 中等难度组件：功能完整度 90%，定向测试完整度 90%，允许仅延后低频边界能力，但必须在文档中列明。
- 复杂组件：高频功能完整度 80%，定向测试完整度 80%，优先交付渲染、交互、`v-model:*` 外部状态接管、事件协议和组合场景；固定列、虚拟滚动、复杂浮层等低频/高成本能力可拆后续批次。
- 每个未达完整对齐的组件必须记录剩余项，不能只用“基础完成”替代覆盖说明。

## 一、已覆盖组件（65 项）

| ccui 组件             | Ant Design 对应         | 分类            | 状态   |
| --------------------- | ----------------------- | --------------- | ------ |
| Affix                 | Affix 固钉              | 导航            | 已完成 |
| Alert                 | Alert 警告提示          | 反馈            | 已完成 |
| Anchor                | Anchor 锚点             | 导航            | 已完成 |
| AutoComplete          | AutoComplete 自动完成   | 数据录入        | 95%    |
| Avatar                | Avatar 头像             | 数据展示        | 已完成 |
| Badge                 | Badge 徽标数            | 数据展示        | 已完成 |
| Breadcrumb            | Breadcrumb 面包屑       | 导航            | 已完成 |
| Button                | Button 按钮             | 通用            | 已完成 |
| Button3D              | 项目特色组件            | 通用            | 已完成 |
| Calendar              | Calendar 日历           | 数据展示        | 已完成 |
| Card                  | Card 卡片               | 数据展示        | 已完成 |
| Carousel              | Carousel 走马灯         | 数据展示        | 95%    |
| Cascader              | Cascader 级联选择       | 数据录入        | 80%    |
| CheckBox              | Checkbox 多选框         | 数据录入        | 已完成 |
| Collapse              | Collapse 折叠面板       | 数据展示        | 已完成 |
| ColorPicker           | ColorPicker 颜色选择器  | 数据录入        | 95%    |
| ConfigProvider        | ConfigProvider 全局配置 | 通用            | 已完成 |
| DatePicker            | DatePicker 日期选择框   | 数据录入        | 80%    |
| Descriptions          | Descriptions 描述列表   | 数据展示        | 已完成 |
| Divider               | Divider 分割线          | 布局            | 已完成 |
| Drawer                | Drawer 抽屉             | 反馈            | 已完成 |
| Dropdown              | Dropdown 下拉菜单       | 导航            | 已完成 |
| Empty                 | Empty 空状态            | 数据展示        | 已完成 |
| Flex                  | Flex 弹性布局           | 布局            | 已完成 |
| FloatButton / BackTop | FloatButton 悬浮按钮    | 通用            | 已完成 |
| Form                  | Form 表单               | 数据录入        | 已完成 |
| Grid                  | Grid 栅格               | 布局            | 已完成 |
| Icon                  | Icon 图标               | 通用            | 已完成 |
| Image                 | Image 图片              | 数据展示        | 已完成 |
| Input                 | Input 输入框            | 数据录入        | 已完成 |
| InputNumber           | InputNumber 数字输入框  | 数据录入        | 已完成 |
| Layout                | Layout 布局             | 布局            | 已完成 |
| List                  | List 列表               | 数据展示        | 已完成 |
| Masonry               | 瀑布流布局              | 布局            | 已完成 |
| Mentions              | Mentions 提及           | 数据录入        | 95%    |
| Menu                  | Menu 导航菜单           | 导航            | 已完成 |
| Message               | Message 全局提示        | 反馈            | 已完成 |
| Modal                 | Modal 对话框            | 反馈            | 已完成 |
| Notification          | Notification 通知       | 反馈            | 已完成 |
| Pagination            | Pagination 分页         | 导航            | 已完成 |
| Popconfirm            | Popconfirm 气泡确认框   | 反馈            | 已完成 |
| Popover               | Popover 气泡卡片        | 反馈            | 已完成 |
| Progress              | Progress 进度条         | 反馈            | 已完成 |
| QRCode                | QRCode 二维码           | 数据展示        | 95%    |
| Radio                 | Radio 单选框            | 数据录入        | 已完成 |
| RangePicker           | DatePicker.RangePicker  | 数据录入        | 80%    |
| Rate                  | Rate 评分               | 数据录入        | 已完成 |
| Result                | Result 结果             | 反馈            | 已完成 |
| Segmented             | Segmented 分段控制器    | 数据展示        | 已完成 |
| Select                | Select 选择器           | 数据录入        | 已完成 |
| Skeleton              | Skeleton 骨架屏         | 反馈            | 已完成 |
| Slider                | Slider 滑动输入条       | 数据录入        | 已完成 |
| Space                 | Space 间距              | 布局            | 已完成 |
| Spin                  | Spin 加载中             | 反馈            | 已完成 |
| Splitter              | Splitter 分隔面板       | 布局            | 已完成 |
| Statistic             | Statistic 统计数值      | 数据展示        | 已完成 |
| Status                | Tag 近似组件            | 通用 / 数据展示 | 已完成 |
| Steps                 | Steps 步骤条            | 导航            | 已完成 |
| Switch                | Switch 开关             | 数据录入        | 已完成 |
| Tabs                  | Tabs 标签页             | 导航            | 已完成 |
| Table                 | Table 表格              | 数据展示        | 已完成 |
| Tag                   | Tag 标签                | 数据展示        | 已完成 |
| TimePicker            | TimePicker 时间选择框   | 数据录入        | 80%    |
| Timeline              | Timeline 时间轴         | 数据展示        | 已完成 |
| Tooltip               | Tooltip 文字提示        | 反馈            | 已完成 |
| Tour                  | Tour 漫游引导           | 反馈            | 95%    |
| Transfer              | Transfer 穿梭框         | 数据录入        | 95%    |
| Tree                  | Tree 树形控件           | 数据展示        | 已完成 |
| TreeSelect            | TreeSelect 树选择       | 数据录入        | 80%    |
| Upload                | Upload 上传             | 数据录入        | 95%    |
| Typography            | Typography 排版         | 通用            | 已完成 |
| Util                  | 工具函数集合            | 通用            | 已完成 |
| Watermark             | Watermark 水印          | 数据展示        | 已完成 |

> 备注：`Status` 功能上接近 Ant Design 的 `Tag`，已有独立 `Tag` 后，建议后续把 `Status` 视为别名兼容或逐步废弃。
> `Select` 已对齐 100%（虚拟列表 / 嵌套分组 / Teleport / labelInValue / 拖拽排序 / 完整 ARIA）。
> `Form` 已推到 95%：在原有字段注册 / 规则校验 / 依赖联动 / scrollToError / submit 流程基础上，新增 Form.List 动态字段（add / remove / move 与稳定 key）、Form.Provider 跨表单注册表（form-change / form-finish 聚合）、form-level 与 item-level 双层 preserve 卸载策略；仅 `shouldUpdate` / `validateDebounce` / `normalize` 等少量低频能力未交付。
> `Table` 已推到 95%：在原有列渲染 / 排序 / 过滤 / 分页 / 行选择基础上，新增 column.fixed='left'|'right' 双侧粘性定位、expandable.expandedRowRender + 受控/默认全展开 + rowExpandable + expandRowByClick、column.onCell / column.onHeaderCell 合并单元格（rowSpan/colSpan=0 跳过被吞并单元格）。

## 二、缺失组件清单

### 中等复杂度剩余（0 项 / 已全部收口）

P2 中等复杂度三件套全部 80%：Carousel (Batch 25) / QRCode (Batch 26) / ColorPicker (Batch 27)。后续 P2 工作只剩独立大任务 Transfer / Upload。

### 复杂组件（5 项剩余 + 5 项推进中，P1 数据录入复杂组件 5/5 已 80% 收口）

| 组件                  | 分类     | 复杂点                                                                                                                                    | 建议优先级   |
| --------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| DatePicker 日期选择框 | 数据录入 | week / month / year / quarter / showTime / preset / locale 切换 — 已交付 80%（date 单选）；range 已拆为独立 RangePicker 组件交付          | P1（推进中） |
| RangePicker 日期范围  | 数据录入 | preset 快捷预设 / showTime / start-end 独立 disabledDate / 响应式单面板 — 已交付 80%（双面板 + hover 预览 + 自动调换）                    | P1（推进中） |
| TimePicker 时间选择框 | 数据录入 | 12 小时制 / 范围 / 键盘导航 / 滚轮 snap — 已交付 80%（24 小时制 + step + disabled + now/ok）                                              | P1（推进中)  |
| Cascader 级联选择     | 数据录入 | multiple 多选 / showSearch 搜索 / loadData 异步 / hover 触发 — 已交付 80%（单选 + fieldNames + changeOnSelect + displayRender）           | P1（推进中） |
| TreeSelect 树选择     | 数据录入 | showSearch 搜索 / loadData 异步 / showCheckedStrategy / 键盘导航 / 半选 v-model — 已交付 80%（单选 + 多选 checkable + treeCheckStrictly） | P1（推进中） |
| Transfer 穿梭框       | 数据录入 | 双列管理、搜索、分页、批量选择 — 已交付 80%（Batch 29）：双列勾选 + indeterminate / 双向移动 / 按列独立搜索 + 自定义 filterOption / render / Form 联动 | P2（已交付）  |
| Upload 上传           | 数据录入 | 拖拽、切片、进度、预览、错误处理 — 已交付 80%（Batch 31）：选择 + 拖拽 + 三层守门（maxCount/maxSize/beforeUpload）+ 状态四态 + reject emit；不内置 HTTP 上传 | P2（已交付）  |
| AutoComplete 自动完成 | 数据录入 | 与 Input 紧耦合、候选项、键盘交互 — 已交付 80%（Batch 28）：filterOption 三态 + caseSensitive + ArrowUp/Down/Enter/Esc 键盘 + Form 联动     | P3（已交付）  |
| Mentions 提及         | 数据录入 | contentEditable、触发解析、光标定位 — 已交付 80%（Batch 32）：textarea + findActiveMention 纯函数 + 多 prefix + 键盘 + 选中插入 prefix+value+split | P3（已交付）  |
| Tour 漫游引导         | 反馈     | 多步定位、蒙层裁切、滚动跟随 — 已交付 80%（Batch 30）：4 块 mask 围出镂空 + floating-ui 12 方位 + Esc 关闭 + finish emit + 双 v-model       | P3（已交付）  |

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

### Batch 32：Mentions 80% 首次交付（P3 体验组件收口）

已完成 1 项：Mentions（80% 首次交付）。**P2 大件 + P3 体验型组件全部 80% 收口**。31 个用例，含 7 个 `findActiveMention` 纯函数测例。

关键能力：

- **findActiveMention 纯函数**：把「在 cursor 位置之前找最近一个有效 prefix」的逻辑拆成独立纯函数，可独立单测。规则：在 `text.slice(0, cursor)` 里找 prefix 的最后出现位置；prefix 之前必须是字符串开头或空白（防 `me@x` 邮箱误触发）；prefix 到 cursor 之间不能有空白（用户输入空格意味着 mention 结束）；多 prefix 时选 start 最大的（最近的）。这是 Mentions 的核心算法，独立测试 7 个 case 覆盖了所有边界。
- **textarea 而非 contenteditable**：80% 选择 textarea + 浮层。优点：纯文本一致、SSR 友好、所有浏览器一致行为、简单可调试。缺点：`@user` 无法渲染成彩色 token（业务能接受，因为大部分 IM/评论场景都是 textarea）。下一批要彩色高亮再切到 contenteditable。
- **refreshMatch 双触发点**：`onInput`（用户输入文本）+ `onKeyup`（光标移动但没改文本，如方向键）+ `onClick`（点击改光标位置）。三个触发点共用 `refreshMatch()`，统一调 `findActiveMention`，open / close 浮层 + emit search。
- **selectOption 字符串拼接 + setSelectionRange**：`before = value.slice(0, match.start)`，`after = value.slice(cursor)`，`inserted = prefix + value + split`，三段拼接。`nextTick` 后调 `setSelectionRange(newCursor, newCursor)` 把光标定位到 inserted 末尾，让用户能继续输入。
- **mousedown.preventDefault() 防 textarea blur**：与 AutoComplete 同款技巧。option 的 onMousedown 阻止默认 → textarea 不失焦 → click outside 处理器不会先触发 close → 选中正常完成。
- **多 prefix 同时支持**：`prefix` 接受 `string | string[]`。computed `prefixList` 统一规范成数组喂给 `findActiveMention`。文档示例里 `['@', '#']` 同时识别 @ 提人和 # 关联标签。
- **filterOption 三态 + caseSensitive**：与 AutoComplete 同套设计，`filterOption=true`（默认 includes）/ `false`（不过滤）/ 函数。函数模式接收原始 `option.raw`，方便业务按 value 而非 label 过滤。
- **Form 联动**：`change` 事件触发 `formItem?.validate('change')`，`blur` 触发 `formItem?.validate('blur')`。

工程决策：

- **不抽 useMentionTrigger hook**：核心算法已经拆到 findActiveMention 纯函数（pure，独立测试），refreshMatch 在组件内部调度。再抽 hook 反而模糊责任边界。
- **不复用 AutoComplete**：AutoComplete 的核心是「输入框值就是选中值」，Mentions 是「输入框值是文本，里面嵌套了 mention token」。语义对立，强行复用会让 Mentions 的 selection 协议变形。
- **不实现光标精确定位**：浮层固定贴 textarea 底部左侧。要让浮层跟随光标位置精确浮动，需要建一个不可见的 mirror div 复制 textarea 样式 + 计算每个字符宽度，工程量大且 jsdom 测试无法验证。文档里明确说明限制。
- **不用 mirror div 测量**：上面同理。如果要做，应该单独抽一个 use-cursor-position hook，独立体验型组件。
- **多 prefix 选 latest**：`hi @x and @y` 光标在末尾时选 `@y`。这个语义符合用户认知（最后一次提及就是当前编辑的）。

测试：31 个用例。findActiveMention 纯函数 7：`@a` 起始、空白后 `hi @bo`、邮箱 `me@x` 不触发、空白阻断 `@bo  end`、多 prefix 选最近、prefix 数组、无 prefix 返回 null。组件 24：渲染（textarea placeholder/rows/disabled/modelValue）；popup 触发（无 prefix 不开、`@` 开、空白后 `hi @` 开、邮箱 `me@x` 不开、`@a` → `@a ` 关、emit search）；过滤（默认 / false / 自定义 function / notFoundContent）；选中（mousedown 插入 + emit、value !== label 用 value 插入、disabled 不响应、自定义 split、中间插入保留尾部）；键盘（ArrowDown 切 active、Enter 选中、Esc 关无插入）；多 prefix（数组形态 + emit search 带 prefix）；v-model（uncontrolled defaultValue / controlled emit + 父级写回）。

验证结果：

- `vp test run ui/mentions`（packages/ccui 内）通过 31/31。

### Batch 31：Upload 80% 首次交付（P2 大件第二项 / 不内置 HTTP）

已完成 1 项：Upload（80% 首次交付）。P2 独立大任务的第二项，至此 P2 大件只剩 Mentions 一项。22 个用例。

关键能力：

- **核心定位 — 不内置 HTTP 上传**：80% 切片明确不做 fetch / xhr / customRequest 默认实现。组件提供 UI（按钮 / 拖拽区 / 文件列表）+ 状态机（uploading / done / error / removed）+ 三层守门，**真实上传由业务侧监听 `change` 事件、自己发请求、回写 fileList 状态**。原因：HTTP 协议、错误重试、CSRF、进度上报、token 注入这些业务诉求差异极大，强行内置 customRequest 会导致 80% 用户都要覆盖默认实现，反而把组件搞复杂。下一批 95% 时再补 customRequest 默认形态。
- **三层守门 — maxSize → maxCount → beforeUpload**：在 `pickFiles` 内按这个顺序逐个文件检查：超 maxSize → reject('maxSize')；累计已超 maxCount → reject('maxCount')；beforeUpload 返回 false → reject('beforeUpload')。三种 rejection 都 emit `reject(file, reason)`，业务可以做统一 toast。**maxCount 是「剩余槽位」语义**：`remainingSlots = maxCount - 当前列表长度`，只允许填满，超出的丢弃 + reject。
- **input.value = '' 重置技巧**：选完文件后立刻 `target.value = ''`，让用户能重复选同一个文件（否则浏览器认为相同 value 不触发 change）。这是 `<input type="file">` 的经典坑。
- **defaultStatus 控制初始状态**：默认 `done`（被动列表，直接显示打勾）；业务想要「持续显示加载态等回写」就传 `defaultStatus="uploading"`，新加的文件 status='uploading' percent=0，业务回写为 'done' / 'error'。
- **拖拽事件四件套**：`dragenter` / `dragover` 都需要 `e.preventDefault()` 才能让 drop 生效（HTML5 标准）；同时切 `dragOver.value = true` 加 `is-dragover` 视觉。`dragleave` 切回 false。`drop` 阻止默认 + 关 dragOver + 读 `e.dataTransfer.files` 走同一个 `pickFiles`（共用三层守门）。`disabled` 时四个 handler 全部短路。
- **触发器三态**：drag=true → 拖拽区；drag=false + default slot → 自定义按钮（slot 内容）；drag=false 无 slot → 默认按钮（triggerText）。这意味着 drag 与 default slot 互斥，文档明确说明。
- **隐藏 input 设计**：`<input type="file">` `position: absolute; w/h:0; opacity:0; tabindex=-1; aria-hidden`。点击触发器 → `inputRef.click()` 走原生选文件对话框。这是 Upload 组件的标准实现，与 AntD / Element Plus / Naive UI 都一致。
- **受控 / 非受控双模**：`v-model:fileList` 受控；非受控时内部 `innerList = ref(defaultFileList)`。`commitList` 函数统一写 inner state（非受控时）+ emit `update:fileList`（永远 emit）。
- **size 格式化**：`< 1KB` 显示字节；`< 1MB` 显示 KB（1 位小数）；其它显示 MB（1 位小数）。简单实用，不引入第三方库。

工程决策：

- **不抽 useUpload hook**：状态简单，组件就一个 setup 内联完成。没有跨组件复用诉求。
- **不复用 c-checkbox / c-button**：触发按钮和 × 按钮都是 native `<button>`。c-button 引入会带来 size / type / loading 等 props 冲突。
- **不引入 c-progress**：80% 的 percent 字段先用文字渲染（`30%`）。要彩色进度条建议下一批接入 c-progress，避免一次引入多组件依赖。
- **maxCount=0 表示"不限"**：与 maxSize=0 同款语义，避免业务必须传一个魔法大数（如 `Infinity`）。`if (props.maxCount > 0)` 短路。
- **beforeUpload 同步**：80% 不接 Promise。AntD beforeUpload 支持返回 Promise 但很多业务场景下用户体验是"卡顿等待"，反而劝退 80%。同步过滤足够覆盖文件名、扩展名、客户端校验等场景。
- **默认 status='done' 而不是 'success'**：与 AntD 的 status 枚举一致（done/uploading/error），不引入 success/info 等状态。

测试：22 个用例。jsdom 没 `DataTransfer` / `FileList` 构造函数，写了一个 `makeFileList(files)` 工具用 spread + `length` + `item()` + Symbol.iterator 伪造 FileList。`mockSelectFiles` 通过 `Object.defineProperty(input, 'files', ...)` + dispatch `change` 模拟用户选文件；`dispatchDrop` 通过 `Object.defineProperty(dropEvent, 'dataTransfer', ...)` 伪造 dataTransfer。覆盖：触发器渲染（默认 / drag / 自定义 slot / disabled / accept+multiple 透传）；选择（emit + render、maxSize/maxCount/beforeUpload 三层 reject、input.value 重置、defaultStatus）；删除（× emit / disabled 隐藏 ×）；列表（showUploadList=false 隐藏、status 三态 modifier、size 格式化 B/KB/MB、itemRender slot）；拖拽（dragover class 切换、drop 走 dataTransfer、disabled 屏蔽 drop）；v-model:fileList 受控双向。

验证结果：

- `vp test run ui/upload`（packages/ccui 内）通过 22/22。

### Batch 30：Tour 80% 首次交付（P3 体验组件第一项）

已完成 1 项：Tour（80% 首次交付）。P3 体验型组件第一项，新功能上线时一步步带用户认识页面。19 个用例覆盖渲染 / 导航 / 关闭 / 目标元素 / v-model 协议。

关键能力：

- **mask 镂空 — 4 块 div 围出 target 矩形**：不用 SVG mask、不用 `clip-path`、不用 box-shadow spread。直接 4 个 fixed div 摆 top / bottom / left / right 围出目标矩形 → 中间天然空出来。每块 mask 都监听 click 触发 close。优点：jsdom 友好（getBoundingClientRect 返回值能直接读）、零 SVG 编译、零兼容性问题。缺点：圆角目标元素的镂空也是矩形（与 AntD 一致，不是真贴目标轮廓）。
- **highlight 高亮框**：除了 4 块 mask 外，再加一个 `position:fixed` 的 `__highlight` div 贴在 target 矩形上，给一个 `box-shadow: 0 0 0 4px rgba(22, 119, 255, 0.4)` 的蓝色光晕。`pointer-events: none` 保证不阻挡 target 自身的点击 / hover。
- **target 三态 + 居中模态兜底**：`target` 可以是 `HTMLElement`、`() => HTMLElement | null`（懒求值，Tour 打开时再 resolve）、或 `null/undefined`。无 target 时浮层退化成 fixed 居中模态 + 整屏蒙层，是「最后一步：感谢」类总结页的标准用法。
- **mask 三态优先级**：单步 `step.mask` undefined 时回落到全局 `props.mask`；undefined !== false，所以 `step: { mask: false }` 真的能关掉这一步的蒙层（即使全局 mask=true）。
- **floating-ui 12 方位**：`PLACEMENT_TO_FLOATING` 把 ccui 的 12 方位（top/topLeft/topRight 等）映射到 floating-ui 的 6 个 placement + start/end 修饰。`offset(12)` 让浮层与目标保持 12px 间距，`flip()` 在视口边缘自动翻面，`shift({ padding: 8 })` 防止浮层贴到视口边缘。
- **双 v-model**：`v-model:open` + `v-model:current` 同时存在。next 按钮在末步触发 `finish` 事件 + emit `update:open(false)` 自动关闭；prev 按钮在首步隐藏（不是 disabled，是不渲染，避免视觉浪费）。close (×) / Esc / 蒙层点击 都走同一条 `close()` 路径：emit `close` + emit `update:open(false)`。
- **closeOnEsc 全局监听**：document.addEventListener('keydown') 在 setup 时挂上，onBeforeUnmount 摘掉。即使 Tour 没打开也挂着监听（cheap），但 handler 内 `if (!props.open) return` 短路。这样 Tour 打开期间 Esc 立即生效，不用等 mount 时机。

工程决策：

- **不抽 useTourState 复合 hook**：状态简单（open / current / 当前 step）+ 整个组件就一个 setup，抽 hook 反而打散逻辑。
- **不复用 Popover / Modal**：虽然视觉上 Tour 浮层像 Popover、整屏 mask 像 Modal，但 Tour 的浮层与 mask 是同一个 Teleport 层，且镂空区域必须能透出 target 让用户继续 hover/点击 —— 这个语义在 Popover/Modal 里都不存在，强行复用反而别扭。
- **不渲染 arrow 箭头**：80% 切片不做 `arrow()` middleware 渲染。简单的 12 方位 placement 已经能让用户理解「这个浮层在指什么」。下一批补一个跟随 placement 旋转的小三角。
- **不做 scrollIntoView**：业务侧最了解什么时机能滚动（可能涉及虚拟列表、副作用），组件里强加 `scrollIntoView` 会踩坑。文档里明确说明业务自己滚。
- **mask 用绝对像素而非百分比**：targetRect 是从 `getBoundingClientRect()` 拿的像素值，4 块 mask 直接用像素 top/left/width/height 写 inline style。视口 resize 时浮层会通过 `autoUpdate` 跟随 target，但 mask 不重新计算位置（80% 不做 ResizeObserver；refresh 由 watch props.open/current/steps 触发）。

测试：19 个用例。渲染（open=false 不渲染、open=true 渲染 panel + mask、当前步骤 title/description/indicator、current 越界不渲染、全局 mask=false 隐藏蒙层、单步 mask=false 覆盖全局）；导航（next 推进 + emit、prev 在首步隐藏、prev 推退、末步 finish + 关闭、自定义 prev/next/finish 文案）；关闭（× 按钮、Esc 默认关 + closeOnEsc=false 阻止、蒙层点击关）；目标（target HTMLElement 模拟 stubRect 后渲染 highlight、target=null 居中模态兜底、target 函数形态懒求值）；v-model（open + current 双 v-model 端到端走完一次完整 tour）。

验证结果：

- `vp test run ui/tour`（packages/ccui 内）通过 19/19。

### Batch 29：Transfer 80% 首次交付（P2 大件第一项）

已完成 1 项：Transfer（80% 首次交付）。P2 独立大任务的第一项。24 个用例覆盖 partition / 选择协议 / 移动协议 / 搜索 / v-model 双键。

关键能力：

- **partition 函数 — 顺序按 targetKeys**：把 dataSource 按 `targetKeys` 拆成 left/right 两列。关键是 right 列的顺序**严格跟随 `targetKeys` 数组顺序**，而不是 dataSource 的原始顺序。这样业务可以通过排序 targetKeys 来排序右侧，符合「目标列是用户精心挑出的有序集」语义（与 AntD 一致）。实现：先把 right 候选项收进 Map<key, item>，再按 targetKeys 顺序从 Map 里取。
- **跨列勾选状态共用一个 selectedKeys**：与 Ant Design 一致，不拆 leftSelectedKeys / rightSelectedKeys。组件内部按 `props.targetKeys.includes(k)` 切分到左右。这让 v-model:selectedKeys 这一个 prop 就能 round-trip 双列状态。emit `select-change` 时再拆成 (sourceSelected, targetSelected) 两个数组方便业务监听。
- **header indeterminate 三态**：每列头部 checkbox 用 `indeterminate` 真三态（none / partial / all），通过 `ref` 直接写 `el.indeterminate = ...`（Vue 不会把这个属性写到模板）。allLeftSelected：列内所有 enabled 项都被勾；someLeftSelected：有勾但未全勾。
- **disabled 单项不进 enabled 统计**：选中、全选、计数都按 `enabled = items.filter(!disabled)` 过滤。点击 disabled 项 toggleItem 直接 return；全选 toggleAll 也只对 enabled keys 做集合操作。这意味着 disabled 项永远进不了 selectedKeys，业务侧不用自己防御。
- **move 操作的副作用 — 同时清掉对应 selectedKeys**：移动按钮按下后，被移动的 keys 从 selectedKeys 里被自动清除（避免「我已经移过去了，但你还高亮着」的视觉错乱）。同时 emit 三个事件：`update:targetKeys`、`change(targetKeys, direction, moveKeys)`、`update:selectedKeys`。Form 联动同款 `formItem?.validate('change')`。
- **filterOption 三态**：未传 → 默认按 `title` 包含匹配（不区分大小写）；函数 → 业务自定义 `(input, item) => boolean`，可以按 key、description、自定义字段过滤。**两列共用同一份 filterOption**，但搜索框 value 各自独立（leftSearch / rightSearch shallowRef）。
- **render slot + render prop 双入口**：slots.render（Vue 模板风格）优先；fallback 到 props.render（函数式 prop）；fallback 到 `item.title ?? item.key`。slot 接收 `{ item }` 单参，业务可以做带图标 / 副标题 / tag 的复合渲染。
- **locale + 单复数**：内置默认 locale `{ itemUnit: '项', itemsUnit: '项', notFoundContent: '列表为空', searchPlaceholder: '请输入搜索内容' }`。total === 1 用 itemUnit，否则用 itemsUnit。这与 AntD locale 接口一致，方便国际化。
- **Form 联动**：`formItem?.validate('change')` 仅在 move 操作触发（不在 toggleItem 触发）—— 因为表单关心的是「最终选择了哪些」（targetKeys 变化），不关心中间勾选状态。

工程决策：

- **不拆 TransferList 子组件**：左右两列结构完全一致，直接 `renderList(direction)` 函数复用；外部不暴露子组件，避免增加 inject/provide 链路。如果 95% 时要支持子组件 slot 自定义某一列，再拆。
- **不引入 c-checkbox**：用 native `<input type="checkbox">` + accent-color 样式。c-checkbox 本身有自己的状态管理，套进来会有 props 冲突；80% 切片下 native checkbox 完全够用。
- **不集成 c-input**：搜索框是 native input + 简单样式。c-input 的 prefix/suffix/clearable 在 Transfer 列头部不需要。
- **operations 是数组而非两个独立 prop**：与 AntD `operations: [string, string]` 对齐，业务可以一行 `:operations="['加入', '移除']"` 替换两个按钮文案；语义比 `rightText` / `leftText` 更紧凑。
- **不渲染描述（description）**：`item.description` 字段类型上保留，但默认 render 不展示。业务想加描述就用 `render` 自己拼，避免组件层强加视觉规范。

测试：24 个用例。渲染（partition 双列、targetKeys 顺序、自定义 titles/operations、locale 单复数、custom render、empty 状态）；选择（点击 toggle、disabled 项不响应、整体 disabled、emit select-change 拆 left/right）；header 全选（check-all / uncheck-all、indeterminate 真三态、空列 disabled）；移动（右移、左移、移动后清 selectedKeys、按钮 disabled 当无选中、append 不重复）；搜索（默认隐藏、showSearch=true 显示两列、左侧搜索过滤左列、自定义 filterOption、emit search 带 direction）；v-model（v-model:targetKeys + v-model:selectedKeys 双键 round-trip）。

验证结果：

- `vp test run ui/transfer`（packages/ccui 内）通过 24/24。

### Batch 28：AutoComplete 80% 首次交付（P3 起步 / Input + Select 之间的补全场景）

已完成 1 项：AutoComplete（80% 首次交付）。P3 第一个组件，本质是「Input + 浮层下拉建议项」，区别于 Select 在于值可以是任意字符串（不限于选项）。复用 P1/P2 共 8 个组件已经验证过的 popup 模式（floating-ui + Teleport + formItemInjectionKey + click outside），不抽公共 hook。

关键能力：

- **options 双形态归一化**：对外 API 同时接收 `string[]` / `number[]` 和 `{ value, label?, disabled? }[]`。`normalizeOption` 统一映射成内部 `NormalizedOption { value, label, disabled, raw }`，渲染层只看 `label`/`disabled`，emit `select` 时回 `(value, raw)`，业务自定义字段不丢。
- **filterOption 三态**：`true`（默认 includes，可配 `caseSensitive=true` 切到大小写敏感）/ `false`（不过滤，全展）/ `function`（自定义 `(input, option) => boolean`）。`function` 模式接收原始 `option.raw`，方便业务按 value 而非 label 过滤（演示文档里用 `startsWith` 跑了一组）。
- **键盘导航 — 跳过 disabled 项**：`ArrowDown` / `ArrowUp` 在 `enabled = list.filter(!disabled)` 子集上前进/回退，wrap-around；`Enter` 选中当前 active；`Esc` 关闭浮层；输入字符时打开浮层；选中后浮层关闭但 input 保留焦点。`mousedown` 阻止 default 阻止 input blur，确保选中前浮层不关。
- **受控 / 非受控双模**：`isControlled = computed(() => props.modelValue !== undefined)`。受控走 `props.modelValue`，非受控走 `innerValue`（默认 `defaultValue ?? ''`）。受控测例验证：父级未写回时，组件不会私自改 inner state（emit 走了，但 value ref 仍是 init）。
- **emit 三件套同时触发**：每次 setValue 都同时 emit `update:modelValue` / `change` / `search`。`change` 是 v-model 的常见别名；`search` 与 AntD AutoComplete 的 search 事件语义一致（用户在搜什么），方便业务监听做远程 loadData。
- **mousedown 阻止 input blur**：`option` 的 onMousedown 上 `e.preventDefault()` —— 这是 popup-with-input 模式的标准做法。如果用 click，input 会先失焦 → focus 转移 → outside click 关 popup → click 事件已经丢了。mousedown.preventDefault 让 input 永远是 focused 的，再走我们自己的 selectOption。
- **selectOption 不再 nextTick 调 focus**：第一版里在 selectOption 末尾 `nextTick(() => inputRef.focus())`，结果 focus 又触发 onFocus → openPopup → 浮层重新打开，单测两个 close 断言挂掉。修正：mousedown.preventDefault 已经保证 input 持有焦点，键盘选中时焦点本来就在 input 内，根本不需要再 focus 一次。
- **Form 联动**：`mergedStatus = props.status || formItem?.validateStatus.value`，`setValue` 同步触发 `formItem?.validate('change')`，`onBlur` 触发 `formItem?.validate('blur')`。与 P1 / P2 同套。

工程决策：

- **不复用 c-select 内部实现**：c-select 的核心是 value=选项之一（discrete enum），AutoComplete 是 value=任意字符串（free text）。这两个语义是根本对立的，强行复用 select 组件需要大量分支判断。重新写一个轻量的 input + popup 反而干净（仅 ~290 行）。共享的是 popup 模式（floating-ui placement / Teleport / outside click / formItemInjectionKey）—— 这层逻辑已经在 P1 五件套 + P2 ColorPicker 上跑了 6 次，模式稳定。
- **不复用 c-input**：c-input 的 prefix/suffix/clearable/showCount/maxlength 等能力 AutoComplete 80% 用不上，引入 c-input 会带来 props 冲突和样式继承问题。直接用 native `<input>` + 自己渲染 clear 按钮更简单。
- **option slot 第一版就开**：参考 P1 TreeSelect 的经验 —— 自定义 option 渲染是高频需求，加这个 slot 代价为 1 行 `slots.option ? slots.option({option, index}) : opt.label`，但能接住「头像 + 名字」/「label + meta」这种业务诉求。
- **search 事件别名 change**：AntD AutoComplete API 里 search 与 change 几乎是同一时刻，但语义上 search 强调「用户在搜什么」。同时 emit 两个，让监听 search 的代码可以零迁移地从 AntD 切过来。

测试：24 个用例。渲染（input placeholder / modelValue 反映 / disabled 阻止 popup）；popup 开关（focus 打开 / outside mousedown 关 / Esc 关）；过滤（默认 includes / filterOption=false 全展 / 自定义 function / caseSensitive 切大小写敏感 / 空结果 notFoundContent）；选中（mousedown 选中 emit + close、disabled 项不响应、option.value !== option.label 时 emit value 而非 label）；键盘（ArrowDown 跳 disabled 循环到首项、ArrowUp 从开头跳到最后 enabled、Enter 选中 active、Enter 无 active 不 emit）；clear（allowClear + value 非空显示 / value 空隐藏 / disabled 隐藏）；受控（typing emit 但 inner state 不写回）；Form 联动（FormItem 内 v-model 双向回写）。

验证结果：

- `vp test run ui/auto-complete`（packages/ccui 内）通过 24/24。

### Batch 27：ColorPicker 80% 首次交付（P2 中等复杂度三件套收口）

已完成 1 项：ColorPicker（80% 首次交付）。P2 第三个、也是最后一个中等复杂度组件，至此 **「中等复杂度剩余」清零**。25 个测试用例分两层：5 个覆盖 `shared/utils/color.ts` HEX/RGB/HSV 互转，20 个覆盖组件层。

关键能力：

- **shared/utils/color.ts 转换层**：与 `date.ts` 同样的 utility-first 风格，按 `hexToRgb` / `rgbToHex` / `rgbToHsv` / `hsvToRgb` / `rgbToString` / `hsvToString` 拆开，每个函数都接收/返回 `{ r,g,b,a }` 或 `{ h,s,v,a }` 普通对象，无类对象、无单例、SSR 安全。HEX 解析支持 3/4/6/8 位四种形态（4/8 位带 alpha），`rgbToHex` 在 `a < 1` 或 `includeAlpha=true` 时输出 8 位 hex。round-trip：red `#ff0000` → `{h:0,s:100,v:100}` → 回 `{255,0,0,1}` 对得上，hue 边界 `120 → green` / `240 → blue` 也对得上。
- **三段拖拽 — 通用 trackPointer**：抽出一个共享的 `trackPointer(el, e, apply)` 工具：从 `getBoundingClientRect()` 拿到一次 rect、立刻调用一次 `apply(relX, relY)`、把 `pointermove` / `pointerup` 监听挂到 `document` 直到 up。三个滑块（SV / hue / alpha）各自只关心自己的 `apply` 逻辑（SV 改 s/v 两维、hue 改 h、alpha 改 a），rect 计算与生命周期统一。Click 也是合法 pointerdown，所以「点哪去哪」与「按住拖」共用同一条路径。
- **SV picker 三层叠加**：`backgroundColor: hsl(${h}, 100%, 50%)` 给底层纯色 → 叠 `linear-gradient(to right, #fff, transparent)`（饱和度从左到右 0→100）→ 再叠 `linear-gradient(to bottom, transparent, #000)`（明度从上到下 100→0）。cursor 用 `left=s%`、`top=(100-v)%` 定位，与 Ant Design 视觉一致。
- **alpha 滑块的 checker 底纹**：`linear-gradient(45deg/-45deg, #ddd 25%, transparent 25%) ...` 多层小方格（8×8 px）拼出经典棋盘格。slider 自身的实色轨道用 `linear-gradient(to right, rgba(...,0), rgb(...))`（基于当前 SV+hue 算出的 baseRgb）覆在棋盘上，cursor 拖 → 透明度真实可视。
- **hex 输入 lazy commit**：键入 → 只更新 `hexInput` 显示，**不触发 emit**（允许打到一半的不合法状态）；blur 或 Enter → 解析尝试，成功就 commit，失败就把 input 文本回滚到当前 currentHex（不滑出 modelValue）。这是与 Ant Design QRCode hex 输入相同的「edit-on-blur」语义。
- **disabledAlpha 强守门**：在三处生效 ——（1）alpha 区域不渲染、（2）alpha number input 不渲染、（3）任何 commitHsv 调用都会被 `{ ...next, a: 1 }` 重写。这意味着即使外部有 `modelValue="#1677ff80"` 注入，组件也会把 alpha 还原成 1（输出 hex 始终 6 位）。
- **format 仅影响显示，不影响 v-model**：`format='rgb' | 'hsv'` 切换 `displayText` 的格式（rgb()/rgba() 或 hsv()/hsva() 字符串），但 `update:modelValue` 永远 emit hex 字符串。`change` 事件第二参 `{ rgb, hsv }` 给业务原生对象方便自己再格式化，避免在 v-model 上做 polymorphic 类型分支。
- **受控 / 非受控双模**：`isControlled = computed(() => props.modelValue !== undefined)`。受控走 `props.modelValue`，非受控走内部 `innerValue`（默认 `defaultValue ?? '#1677ff'`）。受控测例验证：父级未提交时 swatch 仍停留在原 modelValue，不切到点击的 preset 颜色。
- **Form 联动**：与 P1 五件套同套 `formItemInjectionKey`（`mergedStatus = props.status || formItem?.validateStatus.value`），`commitHsv` 同步触发 `formItem?.validate('change')`。

工程决策：

- **不抽 useColorState 复合 hook**：颜色状态较 DatePicker 简单（一个 hex 字符串、一个 pending HSV），抽 hook 反而拆散逻辑。沿用「全部 setup 内联」与之前 P1 五件套同款。
- **不在组件层支持 rgb()/hsl() 字符串输入**：`parseColor` 只识别 hex（含简写 / 带 alpha）。要支持 `rgb(22, 119, 255)` 解析需要规范化空白、单位、百分比 vs 整数等多种形态的 fuzz parsing，工程量与 80% 不匹配。业务侧若拿到 rgb 字符串，应先转 hex 再注入。
- **pointermove 不做 debounce / requestAnimationFrame**：`commitHsv` 在拖拽期间会高频触发（典型每秒 60 次）。computed `currentRgb` / `displayText` / SV/hue/alpha cursor 的 inline style 更新都是 reactive 缓存友好的，没出现卡顿。早优化没必要。
- **disabledAlpha 而不是 `alpha: false`**：与 Ant Design 的 prop 命名对齐（同样叫 `disabledAlpha`），同时与本仓库 `disabled` / `disabledHours` / `disabledDate` 的「disabledX」前缀风格一致。
- **不引入颜色库（chroma-js / color / tinycolor）**：HEX/RGB/HSV 互转加起来不到 70 行，自己写既能掌控边界 case 又免一份依赖。chroma-js 等库主要价值在 `interpolate` / `mix` / `cmyk` / `lab` 等高阶能力，与 80% 切片无关。

测试：25 个用例。color util 5：HEX 解析（3/4/6/8 位 + 不合法回 null）、rgb→hex round-trip（含 alpha < 1 输出 8 位）、rgb↔hsv round-trip（red/green/blue 关键三色）、hsv→rgb hue 边界（120/240）、rgbToString / hsvToString 格式化（带 alpha 与不带 alpha）。组件层 20：渲染（trigger swatch 着色 + showText 三档 format + disabled）；popup（click 开 / 再 click 关 / 外点关 / disabledAlpha 隐藏 alpha 段 + alpha number input）；SV/hue/alpha 拖拽（stubRect + MouseEvent('pointerdown') 模拟，断言 emit 出来的 hex 解析回 hsv 后 s/v/h/a 接近预期值）；hex 输入（合法值 blur 提交 + 非法值 blur 回滚 + Enter 直接 commit）；预设色（点击 commit + 空数组不渲染 presets section）；受控 / 非受控（uncontrolled 下点击 preset 改 swatch、controlled 下父级未提交 swatch 不变）；Form 联动（FormItem 内 v-model 双向 + emit 后 value 同步到 reactive form）。

验证结果：

- `vp test run ui/color-picker`（packages/ccui 内）通过 25/25。

### Batch 26：QRCode 80% 首次交付（自渲 SVG / 中等复杂度剩 1 项）

已完成 1 项：QRCode（80% 首次交付）。P2 第二个组件，使用 `qrcode-generator` (3KB) 提供矩阵数据，组件层负责 SVG 渲染与状态遮罩。**「中等复杂度剩余」从 2 项降到 1 项**（仅余 ColorPicker）。

关键能力：

- **依赖选型 — qrcode-generator 而非 qrcode**：评估了 `qrcode` (~50KB，canvas/svg/dataURL 全 API) vs `qrcode-generator` (3KB，纯矩阵数据)。最终选 `qrcode-generator`：体积小一个数量级，无 DOM/Buffer 依赖（SSR 安全），编码逻辑稳定（同一作者维护多年），代价是要自己写约 30 行 SVG 渲染（对组件库而言可控）。
- **buildMatrix 矩阵数据 + path 合并**：`qrcode(0, level)`（typeNumber=0 自动选 version）→ `addData` → `make` → 二重循环遍历 `getModuleCount()` × `getModuleCount()`，对每行做 horizontal-run 合并：连续深色模块写成 `M{x} {y}h{span}v1h-{span}z` 单段 path，而不是一格一个 `<rect>`。一个 version 5 (37×37) 二维码 path 长度通常在 1.5-2KB，比 700+ 个 rect 节点轻得多。
- **SVG `viewBox` = 模块数**：`viewBox="0 0 N N"` + 容器 `width/height = props.size`，浏览器自动按比例放缩；`shape-rendering="crispEdges"` 防像素抗锯齿模糊边缘。这意味着同一个 `value`，调 `size=120` / `size=400` 共用一份 path 数据，无需重新编码。
- **iconSize 30% 截断**：QR 容错 H 档允许遮挡 ~30% 模块，所以 `iconClampedSize = Math.min(iconSize, size * 0.3)`。这是简单但有效的护栏 —— 业务侧填了 80px iconSize / size=200 也会被自动截到 60px，避免覆盖到三个角的定位图形（finder pattern）。
- **status 四态遮罩**：`active`（不渲染遮罩）/ `loading`（CSS keyframes spinner）/ `expired`（文案 + 「点击刷新」按钮 → emit `refresh`）/ `scanned`（「已扫描」文案）。`statusRender` slot 提供完全自定义入口，提供 slot 时默认遮罩内容（spinner / 文字 / 刷新按钮）让位。
- **value 编码失败兜底**：`buildMatrix` 包 try/catch 返回 null，渲染降级到 `<svg viewBox="0 0 1 1">` 空占位（不抛错，不破坏布局）。`qrcode-generator` 在 value 超过 version 40 容量（H 档约 1273 字符）时会 throw，组件不让这种业务错误冒泡。
- **a11y 基础**：root 节点 `role="img"` + `aria-label={value}` 把二维码内容暴露给屏幕阅读器；SVG 内部 `aria-hidden="true"` 避免重复读出。

工程决策：

- **不抽 toCanvas / toDataURL expose**：80% 切片只做 SVG 渲染。业务想下载二维码可以 `new XMLSerializer().serializeToString(svg)` + Blob URL 自己实现；下一批考虑加 `toDataURL()` expose 方法（需要 canvas 转换，会引入 SSR 不友好的依赖）。
- **不写 RoundedQRCode / GradientQRCode 变体**：Ant Design v6.x 的圆角点阵 / 渐变前景需要按 finder pattern / alignment pattern / data area 区分模块，工程量大且与 80% 「能扫码」的目标无关。留给后续。
- **不在组件层做缓存**：`computed(buildMatrix)` 在 value/errorLevel 变化时全量重算。一次编码 typically <2ms，业务侧高频改 value 极少（多为 token 刷新），不值得引入 LRU。
- **status 用 modifier 而非 attribute**：`ccui-qr-code__status--{status}` BEM modifier 把状态写成可被外部 CSS hook 覆盖的钩子，而不是 `data-status` 属性 —— 与本仓库其他组件（Tag / Status / Tabs）的状态约定一致。

测试：17 个用例。基础渲染（svg + path 存在、path data 非空、viewBox 模块数随 errorLevel 单调递增、size/color/bgColor 正确写入 style 与 attribute、bordered modifier 切换、role + aria-label）；icon 嵌入（无 icon 时不渲染 wrapper、有 icon 时 src 正确、iconSize 30% 截断与不超时直接采用）；status 四态（active 不渲染 mask、loading spinner 存在、scanned 文字、expired 刷新按钮 + click emit refresh、refreshText 自定义、statusRender slot 完全替换默认内容）；reactivity（value 变化重建 path、errorLevel 变化重建 path）；edge case（empty value 渲染 viewBox=0 0 1 1 占位 svg 无 path）。

验证结果：

- `pnpm add qrcode-generator` 加 3KB 依赖。
- `vp test run ui/qr-code`（packages/ccui 内）通过 17/17。

### Batch 25：Carousel 80% 首次交付（P2 启动 / 中等复杂度收一项）

已完成 1 项：Carousel（80% 首次交付）。P1 收口后第一个 P2 中等复杂度组件。**P2 启动**，「中等复杂度剩余」从 3 项降到 2 项（QRCode / ColorPicker）。

关键能力：

- **架构 — vnode 直接当帧**：不抽 `CarouselItem` 子组件，`flattenSlides` 把 default slot 展平后过滤掉 Text / Comment / Fragment（递归展开），剩下的每个 vnode 就是一帧。`cloneVNode` 包一层 `<div class="ccui-carousel__slide">` 加 `is-active` / `aria-hidden` 控制可见性。这一选择让用户像写 Tabs / List 一样写 `<c-carousel><div>...</div></c-carousel>`，无须为每帧多一个组件。
- **双 effect — scrollx vs fade**：`scrollx`（默认）用 `flex` 横向铺开 + 容器 `overflow:hidden` + `track.translateX(-active * 100%)`，依赖 `transition-property: transform`。`fade` 改成 `position:absolute; inset:0` 重叠摆放，每帧 `style.opacity = isActive ? 1 : 0` + `transition-duration` inline 写入，`pointer-events: none` 让非激活帧不接受点击。两套样式由 `.ccui-carousel__track--fade` modifier 切换，scss 用嵌套覆盖避免冲突。
- **受控 / 非受控双模**：`isControlled = computed(() => props.modelValue !== undefined)`。受控走 `props.modelValue`，非受控走内部 `innerActive`。受控模式下点击 dot 仅 emit `update:modelValue`，不写入内部 state；非受控模式下点击 dot 直接写 inner state + emit。受控测例验证：父级未提交时面板停留在 `props.modelValue`、不切到点击的目标。
- **autoplay + pauseOnHover**：`setInterval(autoplaySpeed)` 单实例，`pauseOnHover && isHover.value` 时跳过本次 tick（不停 timer，只跳过 next 调用）。`watch([autoplay, autoplaySpeed])` 自动重启 timer。`onBeforeUnmount` 清理 interval + animationTimer。当 `total <= 1` 时 next 是 no-op，autoplay 不会触发 emit（边界用例验证）。
- **infinite 循环 vs clamp**：`setActive(next)` 时根据 `infinite` 决定 wrap（`<0 → max`，`>max → 0`）还是 clamp（`Math.min/max`）。`infinite=false` 时点击 prev 在第 0 帧、点击 next 在最后一帧 都不 emit `change`（与「target === prev → 短路」逻辑天然一致）。
- **dotPosition 4 向**：`top` / `bottom` 横向排列居中，`left` / `right` 竖向排列居中，dots 元素本身改成竖条形（3×16 → active 3×24）。BEM modifier `__dots--<position>` 一处管定位、一处管 dot 形状。
- **expose 三方法**：`expose<CarouselExpose>({ goTo, next, prev })`。`goTo(index, dontAnimate?)` 第二参 `dontAnimate=true` 时跳过 `animating.value = true` 的标记（虽然 transition 仍会跑，但移除 `is-animating` 状态类让外部样式可以区分跳转与动画）。

工程决策：

- **不抽 `CarouselItem` 子组件**：80% 切片下用户的诉求是「我有一组 div 想轮播」，不是「我每帧要复杂的生命周期」。子组件会引入 inject / provide 的耦合，对 80% 不必要。如果后面要加 lazyRender、afterChange 精确帧回调，可以在帧 wrapper 上加，不影响外部 API。
- **dots 用 `<ul><li><button>` 而不是 `<div><span>`**：dots 是 tablist 语义近似，button 默认带键盘焦点 + Enter 触发，比 div+role 实在。每个 dot 都有 `aria-label="Go to slide N"` + `aria-current`，无障碍最低限度先过。
- **不实现 swipe / 键盘导航**：80% 切片明确不做指针事件 + 阈值 + cancellable 拖拽（这是单独一批的工作量），也不做 Arrow / Home / End 键盘（与 dots focus 状态绑在一起，需要 roving tabindex 才有意义）。这两项放到 95% 推进时一起做。
- **transition 用 inline style 而非 class**：`transitionDuration: ${duration}ms` 写到 inline style，让用户改 `duration` prop 立即生效，不用维护 `--ccui-carousel-duration` CSS variable 和 watcher。代价是少了一层 CSS 可定制能力，但 80% 切片下可控性 > 可定制性。

测试：23 个用例。基础渲染（slides 数量、defaultActive、dots 显示/隐藏、dotPosition modifier、arrows 默认/启用、effect=fade 的 opacity 与 track--fade）；dot 点击协议（uncontrolled emit + 切换、target=current 不 emit、controlled modelValue 父级未提交保持不变）；arrows（next/prev 切换、infinite=true 在边界 wrap、infinite=false 在边界保持）；autoplay（interval 推进、autoplay=false 不推进、pauseOnHover=true 在 hover 暂停 + leave 恢复、pauseOnHover=false 不暂停、speed 变化重启 timer）；exposed methods（goTo/next/prev 通过模板 ref 调用、out-of-range clamp）；edge case（0 帧不渲染 dots、1 帧 autoplay no-op）。

验证结果：

- `vp test run ui/carousel`（packages/ccui 内）通过 23/23。
- `vp test run` 全量 1067/1069 通过；2 个失败（anchor scrollTo / statistic countdown 11ms 时序漂移）在本批次改动之前已存在，与 carousel 无关。

### Batch 24：TreeSelect 80% 首次交付（P1 数据录入复杂组件 5/5 收口）

已完成 1 项：TreeSelect（单选 80% + 多选 checkable 80%）。**P1 数据录入复杂组件 5/5 全部 80% 收口**：DatePicker / TimePicker / RangePicker / Cascader / TreeSelect。

关键能力：

- **架构 — popup 内嵌 c-tree**：TreeSelect 不重写 Tree 渲染，直接把现有的 `c-tree` 当浮层内容。这是本批次最大的工程红利——Tree 已经支持 `selectable / multiple / checkable / checkStrictly / selectedKeys / checkedKeys / expandedKeys / defaultExpandAll / fieldNames / blockNode / disabled` 等完整能力，TreeSelect 只需做「外壳 + 状态桥接 + 输入框渲染」。
- **fieldNames 双层映射**：TreeSelect 对外暴露 `{ label, value, children, disabled }`（与 Cascader / Select 一致），内部通过 `toTreeFieldNames` 转成 `c-tree` 的 `{ title, key, children, disabled }`。业务端只用一套字段名习惯，不必在 Cascader / TreeSelect / Tree 之间切换。
- **v-model 类型分支**：`modelValue` 在单选时是 `string | number | null`，多选时是 `(string | number)[] | null`。`normalizeMultipleValue` 把单值包成数组喂给 `c-tree` 的 `selectedKeys` / `checkedKeys`；emit 时单选只取 `keys.at(-1)`，多选回数组（empty 转 null 与其他 picker 一致）。
- **三种交互模式**：
  - **单选** (`multiple=false`，默认)：`c-tree selectable selectedKeys=[v]`。点击任意节点（含父节点）→ emit + close。
  - **多选 checkable** (`multiple=true treeCheckable=true`，默认)：`c-tree checkable checkedKeys=v selectable=false`。监听 `check` 事件 emit 数组，select 不响应。父子节点联动除非 `treeCheckStrictly=true`。
  - **多选 selectable** (`multiple=true treeCheckable=false`)：`c-tree multiple selectable selectedKeys=v`。监听 `select` 事件 emit 数组，不显示 checkbox。
- **多选 tags 渲染**：`buildNodeIndex` 一次性扁平化整棵 treeData 成 `Map<key, {label, disabled}>`，从 modelValue 反查 label 拼成 tags；超过 `maxTagCount` 折叠成 `+ N` 占位 tag。单 tag 移除：`removeTag(e, key)` `e.stopPropagation()` 不触发面板打开，`emitChange(filtered.length === 0 ? null : filtered)`。
- **clear 一键清空**：单选 / 多选都 emit `null`（与 Cascader / DatePicker 一致），`stopPropagation` 不触发面板打开。
- **Teleport / Form 联动**：与前 4 个 P1 组件同套（`popupAppendToBody` + 自定义 `getPopupContainer` + `formItemInjectionKey` 注入校验状态 + `emitChange` 同步触发 `formItem?.validate('change')`）。
- **空数据兜底**：`treeData: []` 时面板渲染 `notFoundContent`（默认 `暂无数据`）占位，不触发 c-tree mount。
- 文档：单选 / 多选 / treeCheckStrictly / 多选 selectable / fieldNames / 三种尺寸 / 表单联动 / 弹层容器；API Props 23 行 + Events 5 行 + 已知限制（showSearch / loadData / showCheckedStrategy / 键盘 / halfCheckedKeys 输出）。
- 测试：43 个用例。基础渲染（默认/自定义 placeholder + modelValue label 反查 + 单值未知降级 + null 兜底）；多选渲染（tags 数量 + 内容、placeholder 占位、`+ N` 折叠 tag、多选模式无 input 元素、tag close 单移除 + stopPropagation、最后一个移除 emit null、disabled 时无 close 按钮）；popup（click 切换 / outside / disabled / empty + 自定义 notFoundContent）；single selection（叶子提交 + close、change 带 labels 数组、父节点单选可选）；multiple checkable（check emit 数组、追加 keys、uncheck 退出、checkable 模式渲染 checkbox、treeCheckable=false 不渲染 checkbox、selectable 模式不关面板）；fieldNames 自定义；clearable 5 种 + size 三档 + status + is-multiple modifier；Form integration + Teleport 两种容器 + 单选外部 v-model 回写。

工程决策：

- **不在 c-tree 上加 wrapper component，直接 `h(Tree, props)`**：TreeSelect 对 c-tree 的需求是 props 驱动 + 事件透传，没有自定义渲染需求。直接 `h(Tree, baseProps)` 比 `<c-tree>` 模板简洁，省去 setup 中模板编译开销。
- **buildNodeIndex 一次性扁平化**：tags 渲染需要 `value → label` 反查，每次 modelValue 变化逐节点 walk 是 O(N) 的开销但实现简单。如果 treeData 很大可以加 memoize，但 80% 切片不优化。
- **`treeCheckable=true` 是默认（与 multiple 配合）**：与 Ant Design TreeSelect 的常用模式一致——多选场景下用户期望看到 checkbox。`treeCheckable=false` 留给「想要 c-tree 多选 selectable 视觉效果」的少数用户。
- **不在 v-model 中输出 halfCheckedKeys**：c-tree 的 check 事件第二参带 halfCheckedKeys，业务可以监听 `c-tree-select` 自身的 `change` 事件（含全集 checkedKeys）或直接渲染 c-tree 处理。把半选状态放进 v-model 会让类型膨胀，留下一切片或单独 `halfCheckedKeys` prop 处理。
- **`buildPopup` 直接渲染 `Tree`，不复用第三方包装**：保持 popup 内容与外壳的关注点分离，Tree 自身的 popup 行为（如展开/收起动画、键盘导航后续接通）不影响 TreeSelect 的 popup 容器层。

P1 数据录入复杂组件全景（5/5 全部 80%）：

| 组件        | 用例数 | 共享                                                      | 80% 范围                                           |
| ----------- | ------ | --------------------------------------------------------- | -------------------------------------------------- |
| DatePicker  | 40     | shared/utils/date.ts + popup 模式                         | date 单选 + valueFormat 三档 + disabledDate        |
| TimePicker  | 45     | shared/utils/date.ts (buildTimeColumnValues) + popup 模式 | 24h 三列 + step + disabled + now/ok                |
| RangePicker | 38     | shared/utils/date.ts + popup 模式                         | 双面板 + hover 预览 + 自动调换                     |
| Cascader    | 39     | popup 模式                                                | 单选 + fieldNames + changeOnSelect + displayRender |
| TreeSelect  | 43     | popup 模式 + c-tree                                       | 单选 + 多选 checkable + treeCheckStrictly + tags   |

累计 205 个 P1 新增测试用例。所有 5 个组件共享：`@floating-ui/vue` placement / Teleport + Transition / Form `formItemInjectionKey` 联动 / click outside 关闭 / 与 emit 同步触发 `validate('change')`。

验证结果：

- `vp check` 通过（310 文件 lint/type 全干净）。
- 从 `packages/ccui` 跑 `pnpm test ui/tree-select --run` 通过 43/43。

### Batch 23：Cascader 80% 首次交付（多列联动 + 路径数组 v-model）

已完成 1 项：Cascader（单选 80%）。复用 DatePicker / RangePicker / TimePicker 三个 P1 组件已经验证过的 popup 模式（`@floating-ui/vue` + Teleport + `formItemInjectionKey` 联动 + click outside），不抽公共 hook（参考 Batch 21、22 的同款决策）。

关键能力：

- **数据结构与 fieldNames**：`options` 是递归 `children` 的树。`fieldNames: { label?, value?, children?, disabled? }` 把字段名映射到任意业务字段（默认 `'label' / 'value' / 'children' / 'disabled'`）。组件内统一通过 `getOptionLabel` / `getOptionValue` / `getOptionChildren` / `isOptionDisabled` 4 个 helper 读字段，所有渲染分支共用。
- **路径数组 v-model**：`v-model` 永远是 `(string | number)[] | null`。受控值传进来时，`findOptionPath` 沿 options 一级一级查匹配 value 的节点，构造 `selectedPath: CascaderOption[]`；任一级 value 在 options 中找不到则降级为空路径（input 显示空）——避免外部脏数据导致渲染崩。
- **多列联动渲染**：内部 `activePath` 决定渲染哪几列。第 0 列永远是顶级 `options`，第 i 列是 `activePath[i-1].children`。点击非叶子节点：`activePath = activePath.slice(0, columnIndex).push(item.raw)`，自动截掉更深的列，下一列填充新选中的 children。点击叶子：emit 完整路径数组 + close。
- **changeOnSelect**：默认 false。开启后中间节点点击时也 emit 一次 `update:modelValue` 与 `change`，但不关闭面板，让用户继续展开下一级（任一时刻 v-model 总是反映「当前已确定的最深路径」）。
- **`change` 事件双参**：第一个参数是 `(string | number)[] | null`，第二个参数是 `selectedOptions: CascaderOption[]` 原始路径节点数组，业务可直接拿到每级的 raw option（label / 自定义 meta）。
- **displayRender**：默认实现是 `labels.join(separator)`，separator 默认 `/`。传 `displayRender(labels, selectedOptions)` 函数可以做完全自定义的展示文本。
- **Teleport / Form 联动**：与 DatePicker / RangePicker / TimePicker 同套（`popupAppendToBody` + 自定义 `getPopupContainer` + `formItemInjectionKey` 注入校验状态 + emit 时同步触发 `formItem?.validate('change')`）。
- **空数据兜底**：传 `options: []` 时面板首列显示 `notFoundContent`（默认 `暂无数据`）。
- 文档：基础 / changeOnSelect / fieldNames / 禁用某项 / 自定义 displayRender / 三种尺寸 / 表单联动 / 弹层容器；API Props 表 19 行 + Events 表 5 行 + 已知限制（multiple / showSearch / loadData / hover trigger / 键盘）。
- 测试：39 个用例。基础渲染（默认/自定义 placeholder + separator + displayRender、modelValue 路径解析、找不到路径降级为空、null 兜底）；popup（click 切换 / outside / disabled / autoFocus）；column expansion（无值时 1 列、有值时 N+1 列、点击非叶子展开下一列、切换 sibling 截深列、active modifier 三列定位、expand-icon 仅非叶子有）；selection（叶子提交完整路径并关、非叶子 changeOnSelect=false 不 emit、changeOnSelect=true 每级都 emit 但不关到叶子才关、change 第二参数是原始 options 数组、disabled item click 不 emit）；fieldNames 自定义；clearable 4 种 + size 三档 + status；Form integration + Teleport 两种容器 + 外部 v-model 回写；notFoundContent 默认 + 自定义。

工程决策：

- **`activePath` 与 `selectedPath` 解耦**：`selectedPath` 是从 modelValue 推导的「确定」路径，`activePath` 是面板上「悬停 / 编辑」中的路径。点击非叶子时只改 `activePath`，不动 `selectedPath`；只有叶子点击或 `changeOnSelect=true` 时才 emit 让 `selectedPath` 通过 modelValue 回写。这种解耦让用户可以在面板里自由展开探索，不会污染 v-model 的「确定」状态。
- **`watch(selectedPath, ...)` 同步 activePath**：外部 `modelValue` 变化时把 activePath 同步到新的 selectedPath，避免外部 setState 后面板上还停留在旧路径的展开状态。
- **`getOptionLabel` 显式判 string/number/boolean**：而不是直接 `String(v)`——后者对 object 会返回 `[object Object]` 这种无意义字符串，命中 oxlint 的告警。显式列出三种基础类型与 Select 的 `labelAsString` 一致。
- **不引入公共 popup hook**：DatePicker / TimePicker / RangePicker / Cascader 四个浮层组件 popup 内部内容差异巨大（grid / columns / 双 grid / 多列 menu），抽出来要传太多 render slot 反而损可读性。同款决策第 4 次复用，等推到 5 个+ 浮层组件再回头评估抽离。
- **空 options 不进入选择流程**：第 0 列直接渲染 `notFoundContent` 占位，避免空 ul + click 后进入"半空状态"。

验证结果：

- `vp check` 通过（306 文件 lint/type 全干净）。
- 从 `packages/ccui` 跑 `pnpm test ui/cascader --run` 通过 39/39。

### Batch 22：RangePicker 80% 首次交付（双面板 + hover 预览 + 自动调换）

已完成 1 项：RangePicker（80%）。独立组件 `packages/ccui/ui/range-picker/`，**不在 DatePicker 上加 `mode='range'`**：现有 DatePicker 80% props 已不少，叠 range mode 会让 modelValue 类型分裂、disabledDate 签名分裂、hover 状态新增成 props，损耗 single 单选用户的可读性与测试隔离。Ant Design 也是分两个组件。复用 `shared/utils/date.ts` 的 `toDayjs / emitValue / generateMonthGrid / isSameDay` 与 `@floating-ui/vue` 同款 popup 模式，零新增工具层。

关键能力：

- **协议**：`v-model` 是 `[start, end]` 数组，与 DatePicker 同款 `valueFormat` 三档（`['string','string']` / `[Date,Date]` / `[number,number]`，全空时 = `null`）。`change(value, [startStr, endStr])` 同时 emit 数组值与格式化字符串对。`disabledDate(current: Dayjs) => boolean` 一份共用，对 start / end 都生效（独立 disabledDate 留下一切片）。
- **双面板**：左 `viewMonth`，右 `viewMonth + 1`。左 panel header 只有 `‹ 上月 / « 上年`，右 panel header 只有 `下月 › / 下年 »`，中间 label 不可点。一个 `viewMonth` 控制左面板，右面板永远 `+1` 跟随，避免左右独立 viewMonth 的同步成本。
- **状态机 phase: 'start' | 'end'**：打开面板时 phase=`start`（除非 click end input 直接 phase=`end`）；点击日期把 cell 设为 pendingStart，phase 切到 `end`，pendingEnd 重置为 null；下一次点击若 cell.isBefore(pendingStart) 则 `[s, e] = [e, s]` 自动调换，否则按选中顺序 emit `[start, end]` 并关闭。两次提交都满足 `start <= end`。
- **hover in-range 预览**：phase=`end` 且 pendingStart 已选时，cell `mouseenter` 把 hoverDate 设为该 cell。`isCellInHoverRange(d)` 计算 `min(start, hover)` 与 `max(start, hover)` 之间（不含两端）的 cell 加 `--in-hover-range` modifier，实时给用户「此刻提交将选这一段」的视觉反馈。`mouseleave` 不立即清空 hoverDate（避免抖动），closePopup 时统一清。
- **已确认 in-range**：pendingStart && pendingEnd 都有时，两端之间的 cell 加 `--in-range`；两端本身加 `--range-start` / `--range-end` 配合 `--in-range` 的浅蓝背景画出连续 hue。
- **input 显示分流**：打开期间 `startInputDisplay` 显示 pendingStart、`endInputDisplay` 显示 pendingEnd，让用户在选 start 后能立刻看到「左 input 已填好、右 input 等待」；关闭时回退到 selectedStart / selectedEnd 受控值。
- **clear 一键清空**：清按钮 `e.stopPropagation()` 不触发面板打开，把 pendingStart / pendingEnd 设 null 并 emit `null`，`change` 的 dateStrings 退化成 `['', '']`。
- **Teleport / Form 联动**：与 DatePicker 同套机制——`popupAppendToBody` + 自定义 `getPopupContainer` 用 `teleported` computed 切换 floating 的 fixed/absolute 策略；`formItemInjectionKey` inject `validateStatus` 合并到 `mergedStatus`，emit 同步触发 `formItem?.validate('change')`。
- 文档：基础 / 显示已选区间 / 自定义格式（valueFormat 三档）/ 自动调换（end<start）/ 禁用日期 / 自定义分隔符与占位 / 三种尺寸 / 表单联动 / 弹层容器；API Props 表 18 行 + Events 表 5 行 + 已知限制（preset / showTime / 独立 disabledDate / 键盘 / 响应式单面板）。
- 测试：38 个用例。基础渲染（默认/自定义 placeholder + separator、3 类 modelValue + format + null）；popup（start/end input 都能打开、outside 关、disabled 不开、双面板月相邻、autoFocus 落在 start input）；selection flow（首次只设 pending start、二次提交并关、end<start 自动调换、跨月 start-left-end-right、valueFormat 三档输出 + 类型校验）；hover preview（in-hover-range 数量精确为 hover 与 start 之间的非端点 cell、phase=start 阶段无 hover 高亮、已确认 in-range 数量、range-start/end modifier 文本）；disabledDate；月切换（左 prev、右 next 联动）；clearable 4 种 + size 三档 + status；Form integration + Teleport 两种容器 + 外部 v-model 回写（无初始值场景）。

工程决策：

- **不抽 `use-date-popup` 通用 hook**：跟 TimePicker 一样的判断——DatePicker / RangePicker / TimePicker 三个组件 popup 的 cell 渲染差异（grid / 双 grid / columns）足够大，再不同的 emit 协议（单值 / 数组 / 单值），抽出来要传一堆 render slot 与 callback，反而损可读性。等做第四个浮层组件（Cascader / TreeSelect）时再回头看是否值得抽。
- **emit 路径仅在第二次点击触发**：第一次点击只更 pending state，不发 `update:modelValue` 也不调 `formItem.validate('change')`。这避免「点了 start 还没选完 end，Form rules 已经认为只有 start 是无效输入」这种半成品校验。
- **hover 不立即清空**：`mouseleave` 故意不清 hoverDate。原因是格子之间的 1px 间隙会触发 mouseleave-enter 抖动，每次都清掉再重建会让 in-hover-range 高亮闪烁。下次 mouseenter 自然覆盖。closePopup / phase 切换时统一清。
- **`isBefore` 而不是 `<` 比较**：所有日期比较都走 dayjs 的 `isBefore(other, 'day')` / `isAfter(other, 'day')`，确保按"日"粒度比较，避免外部传入带时分秒的 Date 时把同一天的不同时刻误判成 before/after。
- **`emitRangeValue` 助手函数提到顶层模块**：内部 helper，不导出到 components 公共 API；同时把 `start && end 都为 null → null` 的特殊形态也封装在这里，调用点不需要重复判 null。

验证结果：

- `vp check` 通过（302 文件 lint/type 全干净）。
- 从 `packages/ccui` 跑 `pnpm test ui/range-picker --run` 通过 38/38。

### Batch 21：TimePicker 80% 首次交付（24 小时三列 + step + disabled + footer）

已完成 1 项：TimePicker（24 小时制 80%）；扩展 `shared/utils/date.ts`。

关键能力：

- **`buildTimeColumnValues(range, step, disabledValues?)`**：在 `shared/utils/date.ts` 新增的通用列构造函数，输出 `{ value, disabled }[]`。`step <= 0` 兜底成 1，`disabledValues` 用 `Set` 标记 disabled 行。TimePicker 的 hour（0..23）/ minute（0..59）/ second（0..59）三列，以及未来 DatePicker showTime 都共用这一个 helper。
- **TimePicker 80% API**：受控/非受控 `v-model:modelValue`（默认 string，可切 `'date'` / `'number'`，与 DatePicker 同款 `valueFormat` 三档）；`format`（默认 `HH:mm:ss`，dayjs token）；`placeholder` / `disabled` / `clearable`（默认 true）/ `size` 三档 / `status`；`placement` 4 个方位映射到 floating-ui；`popupAppendToBody` + 自定义 `getPopupContainer`，复用 Select/DatePicker 同款 Teleport + Transition 模式。
- **三列控制**：`showHour` / `showMinute` / `showSecond` 任意组合（关到只剩 1 列也能用）；`hourStep` / `minuteStep` / `secondStep` 控制每列步长（hourStep=4 → 6 行 0/4/8/12/16/20）；`disabledHours` / `disabledMinutes(hour)` / `disabledSeconds(hour, minute)` 三层联动屏蔽，`disabledMinutes` 接当前 pending hour、`disabledSeconds` 接 pending hour + minute，可以做"9:00 之前禁选"这种联动。
- **footer 双按钮 + showOk 行为分流**：`showOk=true`（默认）时点击单元格只更新 pending、不 emit、面板不关，等点确定才 emit + 关；`showOk=false` 时点击单元格立即 emit + 关。`showNow` 控制「此刻」按钮，`showOk=false` 模式下「此刻」也立即 emit + 关。两个按钮都关时整个 footer 不渲染。文案 `nowText` / `okText` 可自定义。
- **pending 状态机**：内部维护 `pendingDayjs: Dayjs`，`watch(selectedDayjs)` 在外部受控值变化时把 pending 同步过去，避免 popup 打开期间外部 setState 后面板停留在旧值；`openPopup` 时把 pending 重置到当前 selected（外部无值时回 `dayjs().startOf('day')`），避免上次面板状态泄漏。
- **Form 联动**：和 DatePicker 同套机制——通过 `formItemInjectionKey` inject `validateStatus`，校验失败 root 自动加 `--status-error`；`emitChange` 同步触发 `formItem?.validate('change')`。
- 文档：覆盖基础（默认 showOk）/ 选中即提交（showOk=false）/ 自定义格式（含 valueFormat 三档 demo）/ 步长 / 屏蔽时间（含 hour-minute 联动）/ 隐藏某列 / 三种尺寸 / 表单联动 / 弹层容器；API Props 表 27 行 + Events 表 5 行 + 已知限制清单（12 小时制 / 键盘 / 范围 / showTime / 滚轮 snap）。
- 测试：45 个用例。基础渲染（默认/自定义 placeholder、3 类 modelValue + format + 无效值兜底）；popup open/close（click 切换、outside、disabled、autoFocus）；columns（默认 3 列、3 种 show-X 关闭、24 cells 全集、3 种 step 验证 cells 数 + 文本、selected modifier 三列定位）；disabled values（disabledHours 命中、disabledMinutes 联动、disabled cell click 不变 pending）；selection showOk=false 急切 emit 三档 valueFormat；footer showOk=true（hour click 只更 pending 不 emit、ok 提交、now 设 pending 不关、now+ok 提交、showOk=false 时 now 立即 emit、both off 不渲染 footer、自定义文案）；clearable 4 种组合；size 三档 + status；Form integration + Teleport 两种容器 + 外部 v-model 回写。

工程决策：

- **复用 DatePicker 的内部抽象，但不抽 `use-popup` hook**：本来想把 DatePicker / TimePicker 的 popup（rootRef + popupRef + open + floating + click outside + Teleport + Transition）抽成 `use-time-popup` hook，但当前两个组件 popup 渲染内容差别足够大（grid vs columns），抽象 hook 会要传入太多 render slot，反而损可读性。先保持两份相似代码，等推第三个浮层组件（Cascader / TreeSelect）时再回头抽。
- **`showOk=true` 是默认**：与 Ant Design TimePicker 默认行为一致——用户在三列里多次微调最后才确定，避免每次点击都 emit 触发外部 reactive / Form rules。`showOk=false` 留给「快速选时间」场景。
- **`buildTimeColumnValues` 输出 cell list 而不是 `disabled` 函数**：函数式更灵活但每帧重算开销大。这里数据规模小（最多 60 cell），用 Set 一次性求值后就直接当 cell.disabled 用，computed 缓存命中也轻松。
- **不引入 `dayjs` 默认插件外的额外插件**：date.ts 已经 extend `customParseFormat`，TimePicker 用的 hour() / minute() / second() / .hour(x) 都是核心 API，无需 `advancedFormat` 等附加插件。这与上一批次工具层口径一致。

验证结果：

- `vp check` 通过（298 文件 lint/type、所有 prettier 全干净）。
- 从 `packages/ccui` 跑 `pnpm test ui/time-picker --run` 通过 45/45。
- 从 `packages/docs` 跑生成器无 warning，TimePicker 出现在数据录入分类，状态 80%。

### Batch 20：DatePicker 80% 首次交付（date 单选 + 共享日期工具层）

已完成 1 项：DatePicker（date 单选 80%）；新增共享层 `shared/utils/date.ts`。

关键能力：

- **共享日期工具层** `packages/ccui/ui/shared/utils/date.ts` 包装 dayjs，作为后续 TimePicker / Range / Cascader 等所有日期相关组件的共享底座：`toDayjs(value, format?)`（接受 `string | number | Date | Dayjs | null`，按 format 严格解析失败返回 null）、`formatDate`、`emitValue(dayjs, 'string'|'date'|'number', format)` 把内部 Dayjs 输出为外部 v-model 期望的形态、`generateMonthGrid(viewMonth, weekStart)` 输出 6×7 = 42 格 cell `{ date, day, isCurrentMonth, isToday }`、`isSameDay` / `isSameMonth` / `isToday` 比较谓词。
- **DatePicker 80% API**：受控/非受控 `v-model:modelValue`（默认 string，可切 `'date'` / `'number'`）；`format`（默认 `YYYY-MM-DD`，dayjs token）；`placeholder` / `disabled` / `clearable`（默认 true）/ `size` 三档 / `status`；`disabledDate(current: Dayjs) => boolean`；`placement` 4 个方位（`bottomLeft / bottomRight / topLeft / topRight`，对齐 Ant Design 命名，内部映射到 `@floating-ui/vue` 的 `bottom-start / bottom-end / top-start / top-end`）；`popupAppendToBody` + 自定义 `getPopupContainer`，复用 Select 同款 Teleport + Transition 模式；`weekStart` 0/1 切换周日/周一开头；`autoFocus` / `inputReadOnly` / `popupClassName` / `transitionName`；`@floating-ui/vue` 的 `flip + shift({ padding: 8 }) + offset(4)` 自动 flip。
- **Form 联动**：通过 `formItemInjectionKey` inject `validateStatus` 后合并到 `mergedStatus` 计算属性，FormItem 校验失败时自动给 root 加 `--status-error` / `--status-warning` modifier；`emitChange` 同步触发 `formItem?.validate('change')` 走 onChange trigger 校验。
- **面板交互**：input click 切换 open；同一天再点不重发 change（仅关闭面板）；`open` 时把 `viewMonth` 重置到选中月，避免上次切到 next month 后再开还停在那；click outside（document mousedown 捕获）关闭。
- 文档：覆盖基础 / 显示已选值 / 自定义格式（含 valueFormat 三档 demo）/ 禁用日期 / 三种尺寸 / 禁用与不可清除 / Form 联动（含 c-form-item + 校验按钮 demo）/ 弹层容器；API Props 表 18 行 + Events 表 5 行 + 已知限制清单。
- 测试：40 个用例，覆盖基础渲染（默认/自定义 placeholder、3 类 modelValue、自定义 format、无效值兜底）、popup open/close（click 切换、click outside 关闭、disabled 不打开、autoFocus）、selection（默认 string / `valueFormat=date` Date 实例 / `valueFormat=number` 时间戳、选中后关闭、同日不重发）、disabledDate（cell 加 disabled modifier、disabled cell 不响应 click）、clearable（5 种组合 + click clear emit null + stopPropagation）、月/年 4 个箭头切换 + 关闭再打开回到选中月、grid（42 格 / today modifier 唯一 / 周日/周一两套周标签 / outside 月格子）、size 三档 + status modifier、Form integration（findComponent.vm.$.exposed）、Teleport（popupAppendToBody 挂 body / 自定义 getPopupContainer 容器）。
- 状态：sidebar.ts（手写风格 +5 行加进 数据录入 分类，CheckBox 与 Form 之间）、vue-ccui.ts（DatePickerInstall + DatePicker 三处插入，与 ConfigProvider/Descriptions 字母序对齐）、components-diff.md 表格 + 头部 + 缺失清单同步、README 数据录入分类条目、`packages/cli/templates/vitepress-sidebar.js` 生成器无 warning。

工程决策：

- **统一用 dayjs 而不是 Date / Intl**：仓库已有 `dayjs ^1.11.19`（Calendar 在用），不引入新依赖；用 `dayjs/plugin/customParseFormat` 在 `toDayjs` 中按 format 严格解析（`dayjs(value, format, true)`），避免 `dayjs('not-a-date')` 落到 fallback 解析得到当前时间这种隐蔽 bug。
- **viewMonth 与 modelValue 解耦**：内部用 `shallowRef<Dayjs>` 存当前查看的月份，`watch(selectedDayjs)` 仅在外部受控值跨月变化时同步面板，避免用户切月看其他日期时被一次回写打断。
- **`valueFormat` 三档而不是直接吐 Dayjs**：DateValue 内部统一 Dayjs，但向外通过 `emitValue` 转回 string / Date / number，避免把 dayjs 类型暴露给业务层强迫所有 v-model 绑定都要 `import { Dayjs } from 'dayjs'`。
- **Placement 命名映射**：对外暴露 Ant Design 风格 `bottomLeft / topRight` 等 4 个值，内部用常量表 `PLACEMENT_TO_FLOATING` 映射到 floating-ui 风格 `bottom-start / top-end`。这样未来切底层定位库时只改一张表，不影响业务调用。
- **input 默认 `readonly={true}`**：`inputReadOnly` 默认开启，禁止键盘输入日期。键盘解析（带 format 容错、月/日范围校验、IME 中状态等）成本高，留到下一批 90% 时再做。
- **「同日重点不重发」**：dispatch `update:modelValue` 会走外部回写 → `selectedDayjs` 重新 computed → 触发 watch 但 `isSameMonth` 拦下不切月。但还是会触发 `formItem?.validate('change')` 重复校验。所以选中同一天直接 close 不发，节省一次校验回路。

验证结果：

- `vp check` 通过（467 文件 prettier、294 文件 lint/type 均干净）。
- 从 `packages/ccui` 跑 `pnpm test ui/date-picker --run` 通过，40 个用例全过。
- 从 `packages/docs` 跑 `node ../cli/index.js create -t ccui --ignore-parse-error` 没有任何 `分类不存在` warning，DatePicker 出现在数据录入分类，状态 80%。
- 仓库内 `pnpm test --run` 全量回归 879/881 通过；2 个失败（`statistic countdown 时钟精度差 11ms`、`float-button backTop 默认 target` mock）在 DatePicker 引入前就已存在，单独跑 `ui/statistic` / `ui/float-button` 复现，与本次改动无关。

### Batch 19：Table 95% 完成（固定列 / 展开行 / 合并单元格）

已完成 1 项：Table。

关键能力：

- **column.fixed='left'|'right'**：按 ordered columns（左固定 + 中间 + 右固定）渲染，`fixedLeftOffsets` 自前向后累加列宽生成 `left: <px>`，`fixedRightOffsets` 自后向前累加生成 `right: <px>`；selection 与 expand 列在存在任意左固定用户列或显式 `fixed: true` 时自动跟随固定到左侧。表格根容器挂 `--has-fixed-left` / `--has-fixed-right`，配合 CSS 给最后一个左固定列与第一个右固定列加阴影。
- **expandable.expandedRowRender**：受控 `expandedRowKeys`（v-model + onChange）+ 非受控 `defaultExpandedRowKeys` / `defaultExpandAllRows`，`rowExpandable` 决定单行是否可展开，`expandRowByClick` 让整行点击触发；展开行作为额外 `<tr class="ccui-table__expanded-row">` 紧跟数据行渲染，`<td colspan>` 自动撑满总列数（含 selection / expand 列）。新增 `expand` 事件 `(expanded, record)`。
- **column.onCell / column.onHeaderCell**：返回 `{ rowSpan, colSpan, style, class }`；`rowSpan === 0` 或 `colSpan === 0` 时直接跳过该单元格不渲染（被前一行/列吃掉），与 Ant Design Table 的合并语义一致。
- **scroll: { x?, y? }**：`x` 写入 `min-width` 触发横向滚动（与固定列联动），`y` 写入 `max-height + overflow-y: auto` 实现纵向滚动容器。
- **样式**：`__cell--fixed-left/--fixed-right` 单独着色，hover 与 selected 行下也会保持 sticky 单元格的背景色与正常 cell 一致；展开按钮 `__expand-icon` 使用边框按钮 + `+`/`−` 字符替代 SVG。
- 文档：新增固定列、展开行、合并单元格三段示例，参数表新增 `expandable` / `scroll`，`TableColumn` 加 `onCell` / `onHeaderCell`，事件表加 `update:expandedRowKeys` 与 `expand`。
- 测试：从 52 个扩展到 64 个，新增列重排到左/中/右、左偏移累加、右偏移逆累加、selection 跟随左固定、`expandedRowRender` 渲染、受控 `expandedRowKeys` 切换、`defaultExpandAllRows`、`rowExpandable=false` 隐藏图标、`expandRowByClick` 整行触发、`onCell rowSpan/colSpan=0` 跳过、`onHeaderCell colSpan + class` 合并表头。
- 状态：components-diff.md / sidebar.ts / table/index.ts 全部 85% -> 95% / 已完成。

工程决策：

- 列重排不改原始 `index`，单独维护 `OrderedColumn { column, originalIndex }`，`getColumnKey` / 排序 / 过滤继续用 `originalIndex` 保证 key 与 columnKey 推导稳定，避免破坏既有的 sortOrder / filteredValue / customRender 协议。
- 固定列阴影通过 `__cell--fixed-left:last-of-type` / `__cell--fixed-right:first-of-type` 用纯 CSS 实现，不引入 scroll 监听，避免 SSR / jsdom 测试环境额外开销。
- 展开行不复用 selection 列宽常量，独立 `expandWidthPx`（默认 48），`selectionFixed` 与 `expandColumnFixed` 分别推导，互不耦合。
- `renderCell` 返回值显式 `as any` 透传给 `h()`：因为 Vue h 的单 child 路径会把 `boolean` 走文本节点（如 `true` 渲染成 `'true'`），而数组 child 路径会把 boolean 转 Comment 不渲染，老测试 `preserves number and boolean filter values` 依赖前者行为，必须保留。

验证结果：

- `vp check` 通过。
- `vp test ui/table --environment jsdom` 通过，64 个用例通过。

### Batch 18：Form 95% 完成（Form.List / Form.Provider / preserve）

已完成 1 项：Form。

关键能力：

- **Form.List 动态字段**：默认作用域插槽 `(fields, { add, remove, move })`。`fields` 元素 `{ key, name }` —— `key` 是组件级稳定 ID（move 后保持，避免 v-for 重建），`name` 是当前下标用于 `:name="[field.name, 'email']"` 拼接。`add(value?, insertIndex?)` / `remove(index | indices)` / `move(from, to)` 直接修改 `model[name]` 数组并同步 keys；`initialValue` 在 model 中无值时一次性填入，再走 FormItem 的 initialValue / model 双层兜底。
- **name path 自动拼接**：FormItem 注入 `formListInjectionKey.prefixName`，把父级 List 的 name 作为前缀拼到子项 name 上，最终 path 形如 `['users', 0, 'email']`，与 Ant Design React 协议一致；List 嵌套 List 也能逐层拼。
- **Form.Provider**：`forms: Record<string, FormInstance>` 注册表，子表单按 `name` 注册 / 卸载；`form-finish (name, { values, forms })` 在子表单 submit 校验通过后触发，`form-change (name, { changedFields, forms })` 在字段触发原生 change 时触发。`FormInstance` 暴露 `validate / validateField / resetFields / clearValidate / scrollToField / getFieldsValue`。
- **preserve 双层策略**：form-level 默认 `preserve=true`（保留卸载字段值，与 Ant Design 一致）；item-level `preserve` 优先于 form-level，`preserve=false` 时卸载走 `deleteValueByPath` 删除值（数组用 splice，对象用 delete）。
- **values-change 事件**：FormItem `onChangeCapture` 在校验之外额外调 `form.notifyFieldChange(field, value)`，Form 上抛 `values-change` 事件 + 接入 Provider 的 `triggerFormChange`，常用于跨表单联动或全局状态同步。
- 文档：在 Form 文档新增 Form.List / Provider / preserve 三段完整示例，参数表新增 `name` / `preserve` / `FormItem.preserve` / `FormList`（name + initialValue + 作用域插槽签名）/ `FormProvider`（form-change + form-finish），事件表加 `values-change`。
- 测试：从 32 个扩展到 44 个，新增 List initialValue 注入 + name path 注册、List add/remove/move、move 后 key 不变、批量 remove、preserve form/item 三档优先级、Provider form-finish/form-change/forms 注册表跨表单读取。
- 状态：components-diff.md / sidebar.ts / form/index.ts 全部 80% -> 95% / 已完成。

工程决策：

- FormList 用单独的 `state.keys` 而非 `model[name]` 的下标作为 v-for key —— 删除/插入/移动后下标变了，但稳定 key 不变，避免子组件重建（输入框失焦、动画重放等）。
- FormItem 把 `fieldContext` 的 `prop` / `field` / `dependencies` 改为 getter，使得 prefix / dependencies 变化时已注册到 Form 的字段也能拿到最新值，无需重新 add/remove。
- `deleteValueByPath` 对 `Record<string | number, any>` 做了 `as` 断言，绕过 TS 的索引签名收窄；数组路径走 `splice` 让响应式能正确传播。
- Form.Provider 的 `triggerFormFinish` 只在 submit 校验通过且 form 设了 `name` 时触发，避免无 name 表单污染注册表。

验证结果：

- `vp check` 通过。
- `vp test ui/form --environment jsdom` 通过，44 个用例通过。

### Batch 17：Tree 100% 完成

已完成 1 项：Tree。

关键能力：

- **showLine**：默认连接线由 CSS 渲染——每个节点 N 个 `__guide` 绝对定位 span，按 ancestor 深度铺出垂直线。新增 `connector` 插槽允许消费者完全替换每条 guide 的内容。
- **拖拽 hover 自动展开**：dragover 在节点 inside 区超过 `dragHoverExpandDelay`（默认 600ms）后自动 `triggerExpand`，drop / dragend / 离开 inside 都会清掉计时器。视觉上聚焦节点挂 `--hover-expand` 类。
- **拖拽 auto-scroll**：`dragAutoScroll` 启用时（默认 true），dragover 接近滚动容器顶/底 `dragAutoScrollEdge`（默认 32px）以内时按 `dragAutoScrollSpeed`（默认 12px/帧）滚动；用 `requestAnimationFrame` 持续推进，drop / dragend / 离开边缘自动停。
- **loadData 错误状态 + retryLoad**：`runLoadData` 抽出错误 try/catch，失败的节点进 `loadErrorKeys` 集合并 emit `load-error`；switcher 渲染为红色感叹号按钮，点击直接 retry。`expose({ retryLoad, isNodeLoading, hasLoadError })` 让父组件可以编程式重试或读取状态。
- **switcher slot payload 扩展**：除了 `expanded` / `node`，新增 `loading` / `loadFailed`，让自定义 switcher 也能展示 loading 与错误状态。
- **drop position 对 jsdom 友好**：`computePosition` 在 `rect.height === 0`（jsdom 默认）时直接返回 `'inside'`，避免 NaN 比较推到 `'after'` 导致的测试假阴性。
- **onUnmounted 清理**：组件卸载时 `clearHoverExpandTimer` + `stopAutoScroll`，避免计时器或 RAF 泄漏。
- 文档：新增 showLine（含 connector slot）、拖拽 hover 自动展开、拖拽 auto-scroll、loadData 错误重试 共 4 个章节；Props 表加 4 个新字段，事件表加 `load-error`，新增"组件方法"小节列出 expose 的 3 个 API。
- 测试：从 43 个扩展到 50 个，新增 showLine 渲染 N 个 guide、connector slot 自定义渲染、drag hover-expand 在 delay 后展开、drop / dragend 取消 hover 计时器、loadData 失败 emit load-error 并显示错误 switcher、点击错误 switcher 触发 retry、expose retryLoad / isNodeLoading / hasLoadError。
- 状态：components-diff.md / sidebar.ts / tree/index.ts 全部 95% -> 100% / 已完成。

工程决策：

- `runLoadData` 提取为独立函数，让 `triggerExpand`（首次展开）和 `retryLoad`（手动重试）共用一份错误处理路径。
- `dragHoverTimer` / `autoScrollFrame` 都用 `shallowRef` 存原生 timer / RAF id，配合 `onUnmounted` 兜底清理；`autoScrollDelta = 0` 时退出 RAF 循环。
- showLine 的连接线刻意避开了 antd 那种 ::before/::after 多边复合 SVG 路径——绝对定位 span 在虚拟列表 + auto-scroll 场景下渲染开销更可控。

验证结果：

- `vp check` 通过。
- `vp test packages/ccui/ui/{form,select,icon,tree} --environment jsdom` 通过，174 个用例（form 32 + select 59 + icon 33 + tree 50）通过。

### Batch 16：Tree 95% 完成（键盘导航 + 虚拟滚动）

已完成 1 项：Tree。

关键能力：

- **键盘导航**：`onKeydown` 处理 ↑/↓ 上下移动焦点、→ 展开或进入第一个子节点、← 折叠或回到父节点、Home/End 跳到首末可见节点、Enter / Space 触发 `triggerSelect`（或 `triggerCheck` 当 `checkable=true`）。
- **roving tabindex**：聚焦节点 `tabindex=0`，其它节点 `tabindex=-1`；未聚焦时根容器可 Tab 进入。
- **`focusedKey` 受控**：支持 `v-model:focused-key` 接管，新增 `update:focusedKey` 和 `focus-change` 事件；prop 受控时内部 ref 不写。
- **虚拟滚动**：`virtualScroll` 启用后只渲染可视区 + 缓冲，每个节点用 `position: absolute` 摆放；新增 `virtualItemHeight` / `virtualMaxHeight` props。
- **autoScroll**：聚焦变化后自动滚到可见区——虚拟滚动用 `virtual.scrollToIndex`，非虚拟用 `el.focus({ preventScroll: false })`，对 jsdom 没有 `CSS.escape` 做兜底。
- **抽公共 hook**：把 `composables/use-virtual-list.ts` 从 select 移到 `shared/hooks/use-virtual-list.ts`，Select 和 Tree 共用，后续 TreeSelect / Cascader 也能直接复用。
- 文档：新增键盘导航、虚拟滚动两个章节；Props 表加 4 个新字段（virtualScroll / virtualItemHeight / virtualMaxHeight / focusedKey），事件表加 update:focused-key 和 focus-change。
- 测试：从 31 个扩展到 43 个，新增 ↑/↓ 移焦点、→ 展开折叠节点、→ 已展开移子节点、← 折叠展开节点、← 移父节点、Enter 选中、Space + checkable 勾选、Home/End 跳首末、roving tabindex、虚拟滚动只渲染可视区、disabled 阻止键盘、focusedKey 受控行为。
- 状态：components-diff.md / sidebar.ts / tree/index.ts 全部 80% -> 95%。

工程决策：

- `escapeAttrValue` 在 `CSS.escape` 不可用（jsdom）时退化到手动转义双引号和反斜杠，避免测试报错。
- `setFocusedKey` 同时 emit `update:focusedKey` 和 `focus-change`，对应受控 / 非受控两种集成方式。
- 键盘 Enter / Space 在 checkable 模式下走 check，否则走 select；Space 同 Enter 行为统一。
- 拆 `use-virtual-list` 到 shared 的同时，select 端只需改 import 路径（一行），保持向前兼容。

验证结果：

- `vp check` 通过。
- `vp test packages/ccui/ui/{form,select,icon,tree} --environment jsdom` 通过，167 个用例（form 32 + select 59 + icon 33 + tree 43）通过。

Tree 剩余 5% 项：

- 拖拽自动滚动（dragover 边缘自动 scroll）。
- 拖拽 auto-expand 父节点（hover 一段时间后自动展开）。
- showLine 默认连接线 SVG（当前仅 prop 钩子）。
- 异步 loadData 失败重试 / 错误状态。
- 节点 connectorIcon 自定义。

### Batch 15：Select 100% 完成

已完成 1 项：Select。

关键能力：

- `optionLabelProp`：已选展示用独立字段，下拉项仍按 `label` 渲染。字段缺失时回退到 `label`。多选 / tags 模式下也作用于 tag 文本。
- `showSearch`：`filterable` 别名，与社区 API 对齐；`filterOption=false` 同样适用，可作为远程搜索语义糖。
- `transitionName`：浮层用 Vue `<Transition>` 包裹，默认 `ccui-select-fade`（淡入 + 4px 上滑），可换任意 transition 名搭配自定义 CSS。
- `tagsDraggable`：多选 / tags 模式下用户可以拖拽 tag 调整顺序，被拖中的 tag 降透明，drop 目标高亮边框，松开后 `update:modelValue` 直接给出新顺序；新增 `reorderTagValue` 内部 helper。
- 文档：新增 optionLabelProp、showSearch 别名、自定义浮层动画、拖拽排序已选 tag 共 4 个章节，Props 表加 4 个新字段。
- 测试：从 49 个扩展到 59 个，新增 optionLabelProp 单选展示、字段缺失回退、多选 tag 显示、showSearch 启用搜索框、showSearch+filterOption=false 不过滤、transitionName 不破坏 dropdown、tagsDraggable 挂 draggable+grab 类、拖拽 reorder modelValue、同 tag drop noop、tagsDraggable=false 不挂 draggable。
- 状态：components-diff.md / sidebar.ts / select/index.ts 全部 95% -> 100% / 已完成。

工程决策：

- `displayLabelOf` 抽到 useSelect 内统一处理 optionLabelProp 字段映射，selectedLabel 和 renderTag 共享。
- 浮层 Transition 通过 `appear: true` 让初次打开也走 enter 动画，配合 Teleport 时仍能正确触发。
- tag 拖拽用 HTML5 native dragstart/dragover/drop，不引入第三方库；`reorderTagValue` 在 useSelect 内做数组重排，对外只暴露最终 modelValue。

验证结果：

- `vp check` 通过。
- `vp test packages/ccui/ui/select/test/select.test.ts --environment jsdom` 通过，59 个用例。

### Batch 14：Icon 100% 完成

已完成 1 项：Icon。

关键能力：

- `loading` 状态：开启后图标内容被 spinner SVG 替换，自动开 spin 动画并挂 `aria-busy="true"`，常用于异步操作中按钮的图标占位。
- `disabled` 状态：仅对 `clickable=true` 生效，自动阻止 click 和键盘激活，挂 `aria-disabled="true"` + `tabindex="-1"`，外观降透明 + `cursor: not-allowed`。
- `themePrefixMap`：按 theme 自动映射 Iconify 前缀，比 `iconifyPrefix` 优先。`name` 含 `:` 时仍跳过该映射。
- 文档：新增 加载状态、禁用状态、主题→Iconify 前缀映射 共 3 个章节，Props 表加 3 个新字段。
- 测试：从 26 个扩展到 33 个，新增 loading 替换内容 + spin 类 + aria-busy、disabled 阻止 click 和键盘、disabled 不挂在非 clickable、themePrefixMap 命中前缀、themePrefixMap 命中失败时回退 iconifyPrefix、含冒号时忽略两个映射、loading + spinDirection=ccw。
- 状态：components-diff.md / sidebar.ts / icon/index.ts 全部 95% -> 100% / 已完成。

验证结果：

- `vp check` 通过。
- `vp test packages/ccui/ui/icon/test/icon.test.ts --environment jsdom` 通过，33 个用例。

### Batch 13：Select 95% 完成

已完成 1 项：Select。

关键能力：

- **虚拟列表**：`virtualScroll` 启用后下拉框只渲染可视区 + 缓冲区，`virtualItemHeight` / `virtualMaxHeight` 可调，能流畅承载数千上万选项。键盘导航自动滚动到当前 active 项。
- **嵌套分组**：`options` 中的 group 节点可以再嵌套 group，命中过滤会逐层折叠空 group。
- **完整 ARIA**：根元素 `role="combobox"` + `aria-expanded` + `aria-controls` + `aria-haspopup="listbox"` + `aria-activedescendant`；每项独立 `id` + `role="option"` + `aria-selected` + `aria-disabled`；listbox 容器有 `role="listbox"` + `id`。
- **键盘导航**：Home / End 跳到首/末非禁用项，PageUp / PageDown 按 `virtualMaxHeight / virtualItemHeight` 翻页，原有的 ↑ / ↓ / Enter / Escape / Backspace 全部保留。
- **Teleport 浮层**：`getPopupContainer(triggerNode)` 自定义挂载点；`popupAppendToBody` 等价于挂到 body；浮层穿出后 floating-ui 自动切 fixed strategy。
- **`labelInValue` 模式**：modelValue 变成 `{ value, label }` 单值或数组形态，读写两侧都按形态处理；从已有 options 命中标签，未命中（tags 模式）回退到 value 自身做 label。
- **`maxCount` 限制**：multiple / tags 模式下到达上限后再点选项或回车创建 tag 不触发 update。
- **`highlightMatch` 命中高亮**：option 标签里命中子串包 `<mark class="ccui-select__highlight">`。
- **`defaultActiveFirstOption`** 显式 prop（默认 true，关掉后开下拉时 activeIndex 留在 0 不寻 enabled）。
- **`autoFocus`** 挂载后聚焦根元素。
- **`focus` / `blur` 事件**：从根元素回传 FocusEvent。
- 文档：新增虚拟列表、嵌套分组、命中高亮、Teleport 浮层、labelInValue、maxCount、ARIA & 键盘导航 共 7 个章节，Props 表加 11 个新字段，事件表新增 focus / blur。
- 测试：从 31 个扩展到 49 个，新增 ARIA combobox 语义、option id+role+aria-selected、Home/End 跳转、PageDown/PageUp 翻页、嵌套 group 递归、嵌套 group 命中过滤、命中高亮 mark 标签、popupAppendToBody Teleport、getPopupContainer 自定义挂载、labelInValue 单值/数组/读取、maxCount 多选阻断、maxCount tags 阻断、autoFocus、defaultActiveFirstOption=false、virtualScroll 渲染窗口缩减、focus/blur emit。

工程决策：

- 新增 `composables/use-virtual-list.ts`：通用虚拟列表 hook，支持 buffer、totalHeight、containerHeight、scrollToIndex；与具体 Select 解耦，后续 TreeSelect / Cascader 可复用。
- 通过 `setOpen` 同步赋值 `firstEnabledIndex` 替代异步 watch，确保 Home/End/PageUp/PageDown 在打开下拉的同一帧能正确覆盖 activeIndex。
- 浮层 Teleport 使用 `<Teleport :to="container">`，`computePopupContainer` 同时考虑 `getPopupContainer` 和 `popupAppendToBody`，并把 floating-ui strategy 切到 fixed 防止滚动错位。
- `labelInValue` 在 `useSelect` 内统一处理读（`extractRawValue`）和写（`wrapForEmit`），调用方无感。
- 嵌套 group 用递归 `flattenVisible`，按需挂 `depth` 字段控制缩进；空 group 在递归出来后回滚。

验证结果：

- `vp check` 通过。
- `vp test packages/ccui/ui/{form,select,icon,tree} --environment jsdom` 通过，138 个用例（form 32 + select 49 + icon 26 + tree 31）通过。

Select 剩余 5% 项：

- 树形 / 级联选择器（属于 TreeSelect / Cascader 单独组件）。
- 自定义浮层动画 transition / 渲染时机控制。
- 拖拽排序已选 tag。
- showSearch 与 filterable 的语义合并（当前只有 filterable）。
- 选项的 `optionLabelProp` 单独配置已选展示字段（当前用 label 字段）。

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

覆盖率基线（2026-05-09 测试质量审查后）：Statements `91.51%`、Branches `83.43%`、Functions `92.78%`、Lines `93.23%`。全量 **74/74 文件通过、1220/1220 测试通过**（含 slider 重写后的 32 个高价值用例）。此前基线 Statements `93.76%` 是在 64 个 TSX 文件无法加载（0 test 执行）的情况下统计的，修复 TSX 加载后覆盖率分母增大导致数值回落，实际覆盖面大幅提升。后续不建议为了数字硬追 `95%`；应优先补能证明真实用户行为、Vue 状态协议、事件协议和副作用清理的测试。

本轮审查已完成的工作：

1. ✅ **修复 TSX import-analysis 错误**：`vueJsx({ tsTransform: 'built-in' })` 让 OXC 内置处理 TSX，从 64 个文件加载失败降到 0。
2. ✅ **slider.test.ts 重写**：消除所有 `wrapper.vm.*` 内部状态访问（currentValue / isDragging / getValueFromPercent / formatTooltipText / getPercent / getAriaValueText），改为验证 emitted 值、DOM 输出和 ARIA 属性；移除只检查 `exists()` 的空壳测试，补充键盘 ArrowRight/ArrowLeft/Home/End 具体值、click step 对齐值、disabled 阻止交互等高价值用例。从 30 个低价值测试重写为 32 个高价值测试。
3. ✅ **statistic countdown 11ms 漂移修复**：`setInterval(1000/30)` 的 tick 粒度导致精确到毫秒的断言不稳定，改为 ±50ms 范围断言。
4. ✅ **backTop window target 修复**：`window instanceof Window` 在 jsdom 下返回 `false`，在 `getScrollTop` 和 `scrollTo` 中增加 `t === window` 前置判断。
5. ✅ 其余 5 个高价值缺口文件（statistic / collapse / popover / tooltip / float-button）审查后质量良好，无需改写。

后续建议：

1. 新增组件测试时避免访问 `wrapper.vm.*` 内部状态，通过 emitted 事件、DOM 输出和 ARIA 属性验证行为。
2. 覆盖率目标服从真实行为测试质量，不追数字。

### P0：核心复杂组件（已收口）

P0 三个组件全部对齐到 95% 或 100%，剩余项是低频边角能力，单独放入"P0 长尾"小节按需推进，不再阻塞 P1。

- **Form 95%（Batch 18）**：Form.List / Form.Provider / preserve 全部交付。
- **Table 95%（Batch 19）**：固定列 / 展开行 / 合并单元格全部交付。
- **Select 100%（Batch 15）**：optionLabelProp / showSearch / transitionName / tagsDraggable 全部交付。
- **Tree 100%（Batch 17）**：showLine / 拖拽 hover-expand / auto-scroll / loadData 错误重试全部交付。
- **Icon 100%（Batch 14）**：loading / disabled / themePrefixMap 全部交付。

P0 长尾（不阻塞 P1，可按业务请求触发）：

1. Form：`shouldUpdate` / `validateDebounce` / `normalize` / `getValueProps`、状态图标、与录入组件的更深联动。
2. Table：树形数据 `childrenColumnName` / 虚拟滚动 / 远程数据协议 / 横向滚动固定表头。
3. Select：自定义浮层渲染时机、TreeSelect / Cascader 单独组件（计入 P1）。

### P1：补齐高频录入和基础设施

1. DatePicker / TimePicker：建议先抽日期时间工具层，再做面板组件。
2. Cascader / TreeSelect：复用 Tree 和 Select 的已完成能力。

### P2：增强展示与低频录入

1. Carousel：**95% 已交付**。新增键盘导航（ArrowLeft/Right/Up/Down/Home/End）+ ARIA 增强（role=region, aria-roledescription=carousel, aria-live=polite, role=tabpanel）+ swipe 手势（pointerdown/up + swipeThreshold + 横竖自适应）+ afterChange 事件（duration 后触发）+ customDot 作用域插槽。39 个测试全通过。剩余 adaptiveHeight / slidesToShow 留给后续。
2. QRCode：**95% 已交付**。新增 toDataURL expose（SVG→canvas→dataURL）、dotRadius 圆角点阵（0~0.5）、gradient 渐变前景色（linearGradient + 6 向 direction）。25 个测试全通过。剩余 logo 精修样式 / 超长 value 校验留给后续。
3. ColorPicker：**95% 已交付**。新增 RGB 三联 number input、trigger 作用域插槽、SV/hue/alpha 键盘 Arrow 微调（含 Shift 大步进）、allowClear + null 清空。34 个测试全通过。剩余 EyeDropper API / panelRender slot 留给后续。
4. Transfer：**95% 已交付**。新增 pagination 分页（pageSize + 翻页控件）、selectAllLabels 作用域插槽、draggable 右列拖拽排序。31 个测试全通过。剩余虚拟滚动 / RTL 留给后续。
5. Upload：**95% 已交付**。新增 customRequest 自定义上传 + action 默认 POST（XHR + progress/success/error 回调）、async beforeUpload（Promise 支持）、listType=picture 缩略图渲染（thumbUrl/url fallback）、preview 事件（点击文件名触发）。28 个测试全通过。剩余 picture-card 样式 / c-progress 进度条 / chunk 分片留给后续。

### P3：体验型组件

1. AutoComplete：**95% 已交付**。新增 defaultActiveFirstOption / backfill 键盘回填 / searchDebounce 防抖 / trigger 作用域插槽。29 个测试全通过。剩余虚拟滚动留给后续。
2. Mentions：**95% 已交付**。新增 autoSize 自适应高度（boolean / { minRows, maxRows }）、Tab 键选中当前项、searchDebounce 搜索防抖。34 个测试全通过。剩余光标精确定位 / 彩色 token / trigger slot 留给后续。
3. Tour：**95% 已交付**。新增 type='primary' 主题（蓝底白字全套样式）、arrow 箭头跟随 placement（12 方位定位）、scrollIntoViewIfNeeded 自动滚动到目标、step.cover 封面图/VNode 渲染。25 个测试全通过。剩余 per-step async hooks / nextButtonProps 留给后续。

## 五、当前已知修复

- `packages/ccui/ui/vue-ccui.ts` 已移除 ccui `App` 组件的导入、安装和命名导出，Vue 安装函数类型保留为 `VueApp`。
- `packages/ccui/ui/grid/src/grid.scss` 已修复 Dart Sass `/` 除法和全局 `percentage()` deprecation warning。
- `packages/ccui/ui/tag/src/tag.scss` 已修复预设色名插值 warning。
