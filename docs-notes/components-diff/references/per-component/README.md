# 逐组件 vs Ant Design v6.3.7 diff

> 数据来源：`https://ant.design/llms-full.txt`（74 段 / 60551 行 / 2026-05-14 拉取）。
> 对比口径：ccui 组件源码（`packages/ccui/ui/<name>/src/<name>-types.ts`）与文档（`packages/docs/components/<name>/index.md`）vs ant 段 `## Examples` / `## API` / `## Methods` / 静态导出。
> 用途：作为 `components-diff.md` 的明细补丁，按「每个组件每项实打实列出」原则枚举所有缺口；不替代 `components-diff.md` 的批次交付历史。

## 文件分布

| 文件 | 组件数 | 行数 | 范围 |
| --- | --- | --- | --- |
| [1-data-entry-basic.md](./1-data-entry-basic.md) | 11 | 1163 | AutoComplete / Cascader / Checkbox / ColorPicker / Input / InputNumber / Mentions / Radio / Slider / Switch / Select |
| [2-data-entry-advanced.md](./2-data-entry-advanced.md) | 7 | 241 | DatePicker / RangePicker / TimePicker / Form / Transfer / TreeSelect / Upload |
| [3-data-display.md](./3-data-display.md) | 20 | 1291 | Avatar / Badge / Calendar / Card / Carousel / Collapse / Descriptions / Empty / Image / List / QRCode / Rate / Segmented / Statistic / Table / Tag / Timeline / Tree / Typography / Watermark |
| [4-feedback.md](./4-feedback.md) | 13 | 782 | Alert / Drawer / Message / Modal / Notification / Popconfirm / Popover / Progress / Result / Skeleton / Spin / Tooltip / Tour |
| [5-nav-general.md](./5-nav-general.md) | 13 | 407 | Affix / Anchor / Breadcrumb / Dropdown / Menu / Pagination / Steps / Tabs / Button / ConfigProvider / FloatButton / Icon / Status |
| [6-layout-misc.md](./6-layout-misc.md) | 9 | 421 | Divider / Flex / Grid / Layout / Masonry / Space / Splitter / Button3D / Util |
| **合计** | **73** | **4305** | — |

## 每节统一模板

每个组件下含 4 个固定子节：

```
### Demo 对比
- Ant 官方 demo（共 N 条）
- ccui 文档 demo（共 M 条）
- ccui 缺失的 ant demo（按 ant 顺序枚举）
- ccui 特有 demo（ant 没有的）

### Props 对比
- ccui 缺失的 ant props（按 ant API 顺序，含类型 / 默认 / 起始版本）
- 命名 / 形状差异（ccui x ↔ ant y）
- ccui 特有 props

### Events / 方法 对比
- 缺失 events
- 缺失 expose 方法

### 子组件 / 静态导出
- 缺失：Component.SubName / 静态方法 / 命令式 API
```

## 跨 bucket 总结

### 横向系统级缺口（绝大多数组件都缺）

1. `variant: 'outlined' | 'filled' | 'borderless' | 'underlined'`（ant v5.13.0+）—— 录入类全员未接入。
2. `classNames` / `styles` 语义化 DOM 钩子（ant v5.18.0+）—— 73 个组件中 50+ 个全缺，是反馈类 13 个组件的横向缺口。
3. `status: 'error' | 'warning'`（ant v4.19+）—— 仅 Cascader / Select / 部分 DatePicker 接入。
4. `*Icon` 自定义图标钩子（`clearIcon` / `loadingIcon` / `removeIcon` / `expandIcon` / `menuItemSelectedIcon` / `searchIcon`）—— 录入类几乎全缺。
5. Hook 三件套 `useMessage()` / `useNotification()` / `useModal()` —— 反馈类全缺，与 ant v6 主推模式冲突。
6. Locale / ConfigProvider 联动 —— 60+ 组件级配置键 ccui 未实现。

### 命名差异统一表（迁移用户必踩的坑）

| ccui | ant | 备注 |
| --- | --- | --- |
| `visible` | `open` | Modal / Drawer / Tooltip / Popover / Popconfirm 全套 |
| `content` | `title` | Tooltip / Popover |
| `effect: 'dark' \| 'light'` | `color: 'string'` | Tooltip / Popover |
| `showAfter` / `hideAfter` | `mouseEnterDelay` / `mouseLeaveDelay` | Tooltip / Popover / Popconfirm |
| `popperClass` | `overlayClassName` | Tooltip / Popover |
| `nativeType` | `htmlType` | Button |
| `clearable` | `allowClear` | Input / Select / Cascader / DatePicker 系全套 |
| `prepend` / `append`（string） | `addonBefore` / `addonAfter`（ReactNode） | Input |
| `closeOnEsc` | `keyboard` | Modal / Drawer / Popover |
| `okLoading` | `confirmLoading` | Modal |
| `appendToBody` | `getContainer` | Modal / Drawer / Tooltip 系 |
| `showArrow` | `arrow` | Tooltip / Popover |
| `top-start` / `bottom-end` | `topLeft` / `bottomRight` | placement 命名空间 |
| `prop` | `name` | Form.Item |
| `labelWidth` | `labelCol={{ span }}` | Form |
| `labelPosition: 'top'` | `layout: 'vertical'` | Form |
| `size: 'default'` | `size: 'medium'` | InputNumber / Switch（不一致） |
| `size: 'lg' \| 'md' \| 'sm'` | `size: 'large' \| 'medium' \| 'small'` | InputNumber（更严重） |
| `format: 'hsv'` | `format: 'hsb'` | ColorPicker（色彩模型字面值） |
| `dotPosition` | `dotPlacement` | Carousel |
| `layout: 'horizontal'` | `orientation: 'horizontal'` | Splitter |
| `middle` | `medium` | Flex.gap |
| `bordered`（已 deprecated） | `variant` | Tag / Input |
| `duration: ms` | `duration: s` | Message / Notification（单位） |

### 子组件 / 静态导出缺失全表

| 缺失项 | 用途 | 优先级 |
| --- | --- | --- |
| `Modal.confirm/info/success/error/warning/destroyAll/update` | 命令式确认 | 高 |
| `Modal.useModal()` | Hook 上下文 | 高 |
| `message.useMessage()` | Hook 上下文 | 高 |
| `notification.useNotification()` | Hook 上下文 | 高 |
| `Input.TextArea` | 多行文本 + autoSize / showCount | 高 |
| `Input.Search` | 搜索框 + enterButton / loading | 高 |
| `Input.Password` | 密码框 + iconRender / visibilityToggle | 中 |
| `Input.OTP`（v5.18+） | 一次性密码 | 中 |
| `Button.Group` | 按钮组 | 中 |
| `Tag.CheckableTag` / `Tag.CheckableTagGroup` | 可勾选标签 | 中 |
| `Image.PreviewGroup` | 多图预览 | 中 |
| `Avatar.Group` | 头像组 + maxCount / maxStyle | 中 |
| `Badge.Ribbon` | 缎带徽标 | 低 |
| `Card.Meta` / `Card.Grid` | 卡片元信息 / 网格 | 中 |
| `List.Item.Meta` | 列表项元信息 | 中 |
| `Table.Column` / `Table.ColumnGroup` / `Table.Summary` | JSX 列声明 + 汇总行 | 高 |
| `Tree.DirectoryTree` | 目录树 | 低 |
| `Dropdown.Button` | 下拉按钮 | 中 |
| `Menu.SubMenu` / `Menu.ItemGroup` / `Menu.Divider` | 菜单子组件 | 中 |
| `Form.ErrorList` | 错误列表 | 中 |
| `Form.useForm()` | 命令式 form 实例 Hook | 高 |
| `Skeleton.Button` / `.Avatar` / `.Input` / `.Image` / `.Node` | 骨架变体 | 中 |
| `Alert.ErrorBoundary` | 错误边界 | 低 |
| `Statistic.Timer`（v5.25+） | 计时器（替代 Countdown） | 低 |
| `Typography.Title` / `.Text` / `.Paragraph` / `.Link` 的 `copyable` / `editable` / `ellipsis` 三大交互 | 文案标配 | 高 |
| `Calendar.Header` + `headerRender` | 日历自定义头 | 低 |
| `Layout.Sider` 的 `breakpoint` / `onBreakpoint` / `zeroWidthTriggerStyle` / `reverseArrow` | 响应式 Sider | 中 |
| `Space.Compact` / `Space.Addon` | 输入紧凑组合 | 中 |
| `Splitter.Panel.showCollapsibleIcon` | 面板可折叠 | 低 |
| `TreeSelect.SHOW_PARENT` / `.SHOW_CHILD` / `.SHOW_ALL` | 多选展示策略常量 | 中 |
| `Upload.Dragger` / `Upload.LIST_IGNORE` | 拖拽上传子组件 / 忽略常量 | 中 |
| `Drawer.push` 嵌套抽屉 | 嵌套抽屉 + push 距离 | 低 |
| `Cascader.SHOW_CHILD` / `.SHOW_PARENT` | 多选展示策略常量 | 中 |

### 隐藏的代码问题（子代理顺手发现）

合并自 Bucket 1 / 2 / 3 子代理报告：

- **`packages/ccui/ui/radio/src/radio-types.ts:12`** —— `type: String || Number` 是 truthy 运算式，求值结果是 `String`，等于禁止接收 number。应写 `type: [String, Number] as PropType<string | number>`。Radio.Group 同位置 33 行同问题。
- **`packages/ccui/ui/input-number/src/input-number-types.ts`** —— `size: 'lg' | 'md' | 'sm'` 与库内其他组件 `'large' | 'default' | 'small'` 不一致，也与 ant `'large' | 'medium' | 'small'` 不一致，三套字面值并存。
- **`packages/ccui/ui/color-picker/src/color-picker-types.ts`** —— `format: 'hex' | 'rgb' | 'hsv'` 应统一到 ant 的 `'hex' | 'rgb' | 'hsb'`（颜色模型字面值，HSB 是 ant 的官方写法）。
- **`packages/ccui/ui/switch/src/switch-types.ts`** —— `size: 'default' | 'small'` 与 ant `'medium' | 'small'` 字面值差异。
- **Slider 缺 `onChangeComplete`** —— mouseup / keyup 才触发，Form 联动场景必备，建议优先补。
- **80% 自报的复杂录入组件**（DatePicker / RangePicker / TimePicker / TreeSelect / Upload）实际 prop 缺口 20–30 个/组件，超出 `components-diff.md` 的 80% 描述口径。

## 跨 bucket 数量汇总

> 数字来自各 bucket 文件末尾的「总览」节，按各子代理实际枚举条数汇总。

- **Demo 缺口累计**：~250–300 条（最重灾区 Table 25 / Form 28 / Result ≈10 / Rate ≈12 / Avatar / Badge / Progress / Alert / Float-button / Flex / Affix / Spin / Empty / Segmented 各 ≥ 8）。
- **Props 缺口累计**：~600+ 条（Button 20+ / Form 25+ / Table 20+ / Modal 12+ / Tooltip-Popover-Popconfirm 共 30+ / 录入类全员 `variant + classNames + styles` 共 30+）。
- **Events 缺口累计**：~50 条（主要在 Modal / Drawer / Form / Carousel / Table）。
- **静态导出 / 子组件缺口**：30 项（见上表）。

## 建议落地批次

按性价比排序（详见 `components-diff.md` 第 6.6 节）：

1. **Batch 41 通用 props 拉齐**：`variant` / `classNames` / `styles` / `status` / `*Icon` —— 一批拉齐 12 个录入组件。
2. **Batch 42 基础组件 Ant 别名层**：Button / Input / Modal / Drawer / Tooltip / Popover / Popconfirm 加 Ant 风格 props 别名 + 旧名 deprecated。
3. **Batch 43 缺失子组件 / 静态 API**：Input.TextArea/Search/Password/OTP、Button.Group、Modal.confirm + useModal、useMessage / useNotification、Tag.CheckableTag、Image.PreviewGroup、Form.ErrorList + useForm、Dropdown.Button、Skeleton.Button/Avatar/Input。
4. **Batch 44 命名差异收敛**：上方"命名差异统一表"21 项一次扫平，旧名 deprecated 标记保留向后兼容。
5. **Batch 45 错误代码修复**：上方"隐藏的代码问题"6 项修复（Radio `String || Number`、InputNumber size 字面值、ColorPicker hsv → hsb、Switch size、Slider onChangeComplete）。
