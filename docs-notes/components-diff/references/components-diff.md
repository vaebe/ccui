# vue3-ccui 与 Ant Design 组件对比清单

> 数据来源：Ant Design 官方组件总览（基于 v6.3.7 口径，共 71 个官方组件）。
> 当前项目目录：`packages/ccui/ui` 下共 63 个一级目录，其中 61 个组件/工具入口；`shared` 与 `style-var` 为内部支撑目录，不计入组件覆盖数。
> 当前项目组件：61 个组件/工具入口（含 `button-3d` 项目特色组件、`masonry` 布局扩展、`util` 工具入口）。
> 更新时间：2026-05-09，本批次开 P1：新增 DatePicker（date 单选 80%，40 用例），抽 `shared/utils/date.ts` 日期工具层（toDayjs / formatDate / emitValue / generateMonthGrid / isSameDay / isSameMonth / isToday）作为后续 TimePicker / Range / Cascader 的共享底座。Form / Table 95%、Icon / Select / Tree / Affix 100% 沿用上轮状态。

## 零、交付完整度口径

后续组件交付按复杂度分层验收，优先覆盖用户高频功能、Vue 状态协议（`v-model:*` / `update:*` / `default*` / 内部状态）、事件联动、空/禁用/loading 状态、文档示例和定向测试：

- 简单组件：功能完整度 100%，定向测试完整度 100%，文档覆盖基础用法、常用变体和状态。
- 中等难度组件：功能完整度 90%，定向测试完整度 90%，允许仅延后低频边界能力，但必须在文档中列明。
- 复杂组件：高频功能完整度 80%，定向测试完整度 80%，优先交付渲染、交互、`v-model:*` 外部状态接管、事件协议和组合场景；固定列、虚拟滚动、复杂浮层等低频/高成本能力可拆后续批次。
- 每个未达完整对齐的组件必须记录剩余项，不能只用“基础完成”替代覆盖说明。

## 一、已覆盖组件（61 项）

| ccui 组件             | Ant Design 对应         | 分类            | 状态   |
| --------------------- | ----------------------- | --------------- | ------ |
| Affix                 | Affix 固钉              | 导航            | 已完成 |
| Alert                 | Alert 警告提示          | 反馈            | 已完成 |
| Anchor                | Anchor 锚点             | 导航            | 已完成 |
| Avatar                | Avatar 头像             | 数据展示        | 已完成 |
| Badge                 | Badge 徽标数            | 数据展示        | 已完成 |
| Breadcrumb            | Breadcrumb 面包屑       | 导航            | 已完成 |
| Button                | Button 按钮             | 通用            | 已完成 |
| Button3D              | 项目特色组件            | 通用            | 已完成 |
| Calendar              | Calendar 日历           | 数据展示        | 已完成 |
| Card                  | Card 卡片               | 数据展示        | 已完成 |
| CheckBox              | Checkbox 多选框         | 数据录入        | 已完成 |
| Collapse              | Collapse 折叠面板       | 数据展示        | 已完成 |
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
| Menu                  | Menu 导航菜单           | 导航            | 已完成 |
| Message               | Message 全局提示        | 反馈            | 已完成 |
| Modal                 | Modal 对话框            | 反馈            | 已完成 |
| Notification          | Notification 通知       | 反馈            | 已完成 |
| Pagination            | Pagination 分页         | 导航            | 已完成 |
| Popconfirm            | Popconfirm 气泡确认框   | 反馈            | 已完成 |
| Popover               | Popover 气泡卡片        | 反馈            | 已完成 |
| Progress              | Progress 进度条         | 反馈            | 已完成 |
| Radio                 | Radio 单选框            | 数据录入        | 已完成 |
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
| Timeline              | Timeline 时间轴         | 数据展示        | 已完成 |
| Tooltip               | Tooltip 文字提示        | 反馈            | 已完成 |
| Tree                  | Tree 树形控件           | 数据展示        | 已完成 |
| Typography            | Typography 排版         | 通用            | 已完成 |
| Util                  | 工具函数集合            | 通用            | 已完成 |
| Watermark             | Watermark 水印          | 数据展示        | 已完成 |

> 备注：`Status` 功能上接近 Ant Design 的 `Tag`，已有独立 `Tag` 后，建议后续把 `Status` 视为别名兼容或逐步废弃。
> `Select` 已对齐 100%（虚拟列表 / 嵌套分组 / Teleport / labelInValue / 拖拽排序 / 完整 ARIA）。
> `Form` 已推到 95%：在原有字段注册 / 规则校验 / 依赖联动 / scrollToError / submit 流程基础上，新增 Form.List 动态字段（add / remove / move 与稳定 key）、Form.Provider 跨表单注册表（form-change / form-finish 聚合）、form-level 与 item-level 双层 preserve 卸载策略；仅 `shouldUpdate` / `validateDebounce` / `normalize` 等少量低频能力未交付。
> `Table` 已推到 95%：在原有列渲染 / 排序 / 过滤 / 分页 / 行选择基础上，新增 column.fixed='left'|'right' 双侧粘性定位、expandable.expandedRowRender + 受控/默认全展开 + rowExpandable + expandRowByClick、column.onCell / column.onHeaderCell 合并单元格（rowSpan/colSpan=0 跳过被吞并单元格）。

## 二、缺失组件清单

### 中等复杂度剩余（3 项）

| 组件                   | 分类     | 复杂点                                   | 建议优先级 |
| ---------------------- | -------- | ---------------------------------------- | ---------- |
| Carousel 走马灯        | 数据展示 | 自动播放、手势、键盘、循环与动画状态     | P2         |
| QRCode 二维码          | 数据展示 | 二维码生成库、纠错级别、图标嵌入         | P2         |
| ColorPicker 颜色选择器 | 数据录入 | 色板、HSV/RGB/HEX 转换、透明度、浮层交互 | P2         |

### 复杂组件（8 项剩余 + 1 项进行中）

| 组件                  | 分类     | 复杂点                                                                                            | 建议优先级   |
| --------------------- | -------- | ------------------------------------------------------------------------------------------------- | ------------ |
| DatePicker 日期选择框 | 数据录入 | range / week / month / year / quarter / showTime / preset / locale 切换 — 已交付 80%（date 单选） | P1（推进中） |
| TimePicker 时间选择框 | 数据录入 | 滚轮选择、范围、禁用项                                                                            | P1           |
| Cascader 级联选择     | 数据录入 | 多级联动、异步加载、搜索                                                                          | P1           |
| TreeSelect 树选择     | 数据录入 | Select + Tree 组合、搜索、多选                                                                    | P1           |
| Transfer 穿梭框       | 数据录入 | 双列管理、搜索、分页、批量选择                                                                    | P2           |
| Upload 上传           | 数据录入 | 拖拽、切片、进度、预览、错误处理                                                                  | P2           |
| AutoComplete 自动完成 | 数据录入 | 与 Input 紧耦合、候选项、键盘交互                                                                 | P2           |
| Mentions 提及         | 数据录入 | contentEditable、触发解析、光标定位                                                               | P3           |
| Tour 漫游引导         | 数据展示 | 多步定位、蒙层裁切、滚动跟随                                                                      | P3           |

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

当前覆盖率基线为 Statements `93.76%`、Branches `84.26%`、Functions `94.10%`、Lines `94.08%`。后续不建议为了数字硬追 `95%`；应优先补能证明真实用户行为、Vue 状态协议、事件协议和副作用清理的测试。

建议新任务从以下方向继续：

1. 审查新增测试质量，移除或改写过度依赖 DOM 细节、Transition 时序、内部实现变量的低价值断言。
2. 补高价值剩余缺口：`statistic/countdown`、`collapse-item`、`slider/use-slider`、`float-button/back-top`、`popover/tooltip`。
3. 清理 coverage 输出噪声：Vitest/coverage mixed versions 提示，以及 jsdom `window.scrollTo` not implemented 噪声。
4. 每次推进后重新记录覆盖率基线，并明确说明覆盖率目标服从真实行为测试质量。

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
