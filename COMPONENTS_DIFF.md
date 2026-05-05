# vue3-ccui 与 Ant Design 组件对比清单

> 数据来源：Ant Design 官方组件总览（基于 v6.3.7 口径，共 71 个官方组件）。
> 当前项目组件：58 个目录级组件/工具入口（含 `button-3d` 项目特色组件、`masonry` 布局扩展、`util` 工具入口）。
> 更新时间：2026-05-05 13:10，根据当前 `packages/ccui/ui` 目录、Icon / Select 新增实现和验证结果更新。

## 一、已覆盖组件（58 项）

| ccui 组件             | Ant Design 对应         | 分类            | 状态     |
| --------------------- | ----------------------- | --------------- | -------- |
| Affix                 | Affix 固钉              | 其他            | 已完成   |
| Alert                 | Alert 警告提示          | 反馈            | 已完成   |
| Anchor                | Anchor 锚点             | 导航            | 已完成   |
| Avatar                | Avatar 头像             | 数据展示        | 已完成   |
| Badge                 | Badge 徽标数            | 数据展示        | 已完成   |
| Breadcrumb            | Breadcrumb 面包屑       | 导航            | 已完成   |
| Button                | Button 按钮             | 通用            | 已完成   |
| Button3D              | 项目特色组件            | 通用            | 已完成   |
| Calendar              | Calendar 日历           | 数据展示        | 已完成   |
| Card                  | Card 卡片               | 数据展示        | 已完成   |
| CheckBox              | Checkbox 多选框         | 数据录入        | 已完成   |
| Collapse              | Collapse 折叠面板       | 数据展示        | 已完成   |
| ConfigProvider        | ConfigProvider 全局配置 | 其他            | 已完成   |
| Descriptions          | Descriptions 描述列表   | 数据展示        | 已完成   |
| Divider               | Divider 分割线          | 布局            | 已完成   |
| Drawer                | Drawer 抽屉             | 反馈            | 已完成   |
| Dropdown              | Dropdown 下拉菜单       | 导航            | 已完成   |
| Empty                 | Empty 空状态            | 数据展示        | 已完成   |
| Flex                  | Flex 弹性布局           | 布局            | 已完成   |
| FloatButton / BackTop | FloatButton 悬浮按钮    | 通用            | 已完成   |
| Grid                  | Grid 栅格               | 布局            | 已完成   |
| Icon                  | Icon 图标               | 通用            | 基础完成 |
| Image                 | Image 图片              | 数据展示        | 已完成   |
| Input                 | Input 输入框            | 数据录入        | 已完成   |
| InputNumber           | InputNumber 数字输入框  | 数据录入        | 已完成   |
| Layout                | Layout 布局             | 布局            | 已完成   |
| List                  | List 列表               | 数据展示        | 已完成   |
| Masonry               | 瀑布流布局              | 布局            | 已完成   |
| Menu                  | Menu 导航菜单           | 导航            | 已完成   |
| Message               | Message 全局提示        | 反馈            | 已完成   |
| Modal                 | Modal 对话框            | 反馈            | 已完成   |
| Notification          | Notification 通知       | 反馈            | 已完成   |
| Pagination            | Pagination 分页         | 导航            | 已完成   |
| Popconfirm            | Popconfirm 气泡确认框   | 反馈            | 已完成   |
| Popover               | Popover 气泡卡片        | 反馈            | 已完成   |
| Progress              | Progress 进度条         | 反馈            | 已完成   |
| Radio                 | Radio 单选框            | 数据录入        | 已完成   |
| Rate                  | Rate 评分               | 数据录入        | 已完成   |
| Result                | Result 结果             | 反馈            | 已完成   |
| Segmented             | Segmented 分段控制器    | 数据展示        | 已完成   |
| Select                | Select 选择器           | 数据录入        | 基础完成 |
| Skeleton              | Skeleton 骨架屏         | 反馈            | 已完成   |
| Slider                | Slider 滑动输入条       | 数据录入        | 已完成   |
| Space                 | Space 间距              | 布局            | 已完成   |
| Spin                  | Spin 加载中             | 反馈            | 已完成   |
| Splitter              | Splitter 分隔面板       | 布局            | 已完成   |
| Statistic             | Statistic 统计数值      | 数据展示        | 已完成   |
| Status                | Tag 近似组件            | 通用 / 数据展示 | 已完成   |
| Steps                 | Steps 步骤条            | 导航            | 已完成   |
| Switch                | Switch 开关             | 数据录入        | 已完成   |
| Tabs                  | Tabs 标签页             | 导航            | 已完成   |
| Tag                   | Tag 标签                | 数据展示        | 已完成   |
| Timeline              | Timeline 时间轴         | 数据展示        | 已完成   |
| Tooltip               | Tooltip 文字提示        | 反馈            | 已完成   |
| Tree                  | Tree 树形控件           | 数据展示        | 已完成   |
| Typography            | Typography 排版         | 通用            | 已完成   |
| Util                  | 工具函数集合            | 其他            | 已完成   |
| Watermark             | Watermark 水印          | 数据展示        | 已完成   |

> 备注：`Status` 功能上接近 Ant Design 的 `Tag`，已有独立 `Tag` 后，建议后续把 `Status` 视为别名兼容或逐步废弃。
> `Select` 当前为基础可用版本，已覆盖单选、多选、搜索、清空、禁用、loading、空状态、tag 限制和基础键盘交互；尚未达到 Ant Design Select 的完整能力。

## 二、缺失组件清单

### 中等复杂度剩余（3 项）

| 组件                   | 分类     | 复杂点                                   | 建议优先级 |
| ---------------------- | -------- | ---------------------------------------- | ---------- |
| Carousel 走马灯        | 数据展示 | 自动播放、手势/键盘、循环与动画状态      | P2         |
| QRCode 二维码          | 数据展示 | 需要二维码生成库、纠错级别、图标嵌入     | P2         |
| ColorPicker 颜色选择器 | 数据录入 | 色板、HSV/RGB/HEX 转换、透明度、浮层交互 | P2         |

### 复杂组件（11 项）

| 组件                  | 分类     | 复杂点                                   | 建议优先级 |
| --------------------- | -------- | ---------------------------------------- | ---------- |
| Form 表单             | 数据录入 | 字段管理、校验、联动、与所有录入组件耦合 | P0         |
| Table 表格            | 数据展示 | 排序、筛选、固定列、展开行、虚拟滚动     | P0         |
| DatePicker 日期选择框 | 数据录入 | 日期面板、范围、时间联动、国际化         | P1         |
| TimePicker 时间选择框 | 数据录入 | 滚轮选择、范围、禁用项                   | P1         |
| Cascader 级联选择     | 数据录入 | 多级联动、异步加载、搜索                 | P1         |
| TreeSelect 树选择     | 数据录入 | Select + Tree 组合、搜索、多选           | P1         |
| Transfer 穿梭框       | 数据录入 | 双列管理、搜索、分页、批量选择           | P2         |
| Upload 上传           | 数据录入 | 拖拽、切片、进度、预览、错误处理         | P2         |
| AutoComplete 自动完成 | 数据录入 | 与 Input 紧耦合、候选项、键盘交互        | P2         |
| Mentions 提及         | 数据录入 | contentEditable、触发解析、光标定位      | P3         |
| Tour 漫游引导         | 数据展示 | 多步定位、蒙层裁切、滚动跟随             | P3         |

## 三、本轮交付记录

### Batch 1：主题与简单组件

- 主题 Token 重构：`packages/theme/themes/light.ts` / `dark.ts` 对齐 Ant Design v6.3.7 SeedToken / MapToken 口径。
- 新增 14 个简单组件，覆盖 Tag、Badge、Space、Flex、Typography、Alert、Empty、Spin、Skeleton、Progress、Switch、Segmented、Result、Breadcrumb。
- 新增单测和 VitePress 文档，并对既有 Button、Input、Card、Divider、Status、Avatar 做视觉对齐。

### Batch 2：复杂组件零依赖组

已完成 6 项：Grid、Layout、Splitter、Masonry、ConfigProvider、Util。

关键能力：

- Grid：24 栅格、6 断点响应式、Gutter。
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
- 全量测试记录为 409 个用例通过。
- 视觉抽查已覆盖 16 个中等组件；Message / Notification 曾因 VitePress demo 导入路径问题待修，后续提交记录显示已纳入修复。

关键工程决策：

- Modal / Drawer 使用 `Teleport` + `<Transition>`。
- Message / Notification 使用命令式 API 和独立挂载容器。
- Affix / Anchor 在 jsdom 下避免依赖 `instanceof Window`，改用更稳定的 target 判定，并补充 DOM API 兜底。
- Watermark 的 MutationObserver 仅监听 `childList`，避免 attributes 变更触发自递归。
- Image 预览使用 `Teleport`，并对 IntersectionObserver 做兼容兜底。

### Batch 4：Icon 与 Select 基础版

已完成 2 项：Icon、Select。

关键能力：

- Icon：支持注册表 API（`registerIcon` / `resolveIcon` / `unregisterIcon` / `clearIconRegistry`）、组件图标、插槽图标、font icon fallback、尺寸、颜色、旋转和 spin。
- Select：支持单选、多选、filterable 搜索、clearable 清空、disabled、loading / empty 文案、maxTagCount、外部点击关闭、Escape 关闭、Enter / Arrow 键盘选择。
- Select 已补充关键交互测试，从 6 个用例扩展到 15 个用例，覆盖单选、多选、清空、禁用、搜索、tag 限制、可见状态和键盘路径。
- Select 修复项：option 点击冒泡导致单选关闭后重开、多选已有 tag 后无法继续搜索、键盘导航命中 disabled option、乱码默认文案/显示字符。

验证结果：

- `vp check` 通过。
- `vp test packages/ccui/ui/icon/test/icon.test.ts --environment jsdom` 通过。
- `vp test packages/ccui/ui/select/test/select.test.ts --environment jsdom` 通过，15 个用例通过。
- `vp run --filter docs docs:build` 通过；仍有 Grid / Tag 既有 Sass deprecation warning。
- `vp test --environment jsdom` 全量仍失败，失败来自既有 TSX import-analysis 配置/解析问题，例如 `packages/ccui/ui/affix/src/affix.tsx`，不属于 Icon / Select 定向测试失败。

Select 剩余非完整对齐项：

- 尚未支持 option group、自定义 option/tag render、remote search 约定、popup container / placement、fieldNames、虚拟列表、tags / allowCreate 模式、完整 ARIA 和 Form 校验状态集成。

## 四、后续任务规划

### P0：补齐核心复杂组件

1. Form：先定义字段上下文、校验协议、FormItem 数据流，再接入 Input / Select / Checkbox / Radio / Switch 等录入组件。
2. Table：先交付基础列渲染、排序、筛选、分页联动，再拆固定列、展开行、虚拟滚动。
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
