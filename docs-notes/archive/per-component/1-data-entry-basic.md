# 数据录入基础组件 — ccui vs Ant Design v6.3.7 逐项 diff（Batch 1）

> 范围：数据录入基础类共 11 个组件。Ant 段落来自 `D:\codetest\ccui\docs-notes\components-diff\references\.tmp-llms-full.txt`（v6.3.7）。

## 目录

- [AutoComplete](#autocomplete)
- [Cascader](#cascader)
- [Checkbox](#checkbox)
- [ColorPicker](#colorpicker)
- [Input](#input)
- [InputNumber](#inputnumber)
- [Mentions](#mentions)
- [Radio](#radio)
- [Slider](#slider)
- [Switch](#switch)
- [Select](#select)

本批共 11 个组件，ccui 缺失 demo 累计 39 条，缺失 props 累计 99 条。

---

## AutoComplete

- Ant 段：`## auto-complete`（行 1669–2423）
- ccui types：`packages/ccui/ui/auto-complete/src/auto-complete-types.ts`
- ccui docs：`packages/docs/components/auto-complete/index.md`
- ccui 自报状态：80%

### Demo 对比

**Ant 官方 demo（共 10 条，按官方顺序）**：

1. Basic Usage
2. Customized
3. Customize Input Component
4. Non-case-sensitive AutoComplete
5. Lookup-Patterns - Certain Category
6. Lookup-Patterns - Uncertain Category
7. Status
8. Variants
9. Customize clear button
10. Custom semantic dom styling

**ccui 文档 demo（共 8 条，按文档顺序）**：

1. 基本用法
2. 自定义选项格式
3. 过滤逻辑
4. 大小写敏感
5. 键盘导航
6. 三种尺寸
7. 表单联动
8. 弹层容器

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「Customize Input Component」（ant 第 3 条）—— children 槽位用 TextArea 等自定义触发器替代默认 Input
- 「Lookup-Patterns - Certain Category」（ant 第 5 条）—— grouped options + 分组标题（label + options 分组结构）
- 「Lookup-Patterns - Uncertain Category」（ant 第 6 条）—— 富 label 渲染 + Input.Search enterButton 触发器
- 「Status」（ant 第 7 条）—— status="error" / "warning" 校验状态视觉
- 「Variants」（ant 第 8 条）—— variant=outlined/filled/borderless/underlined 四种边框
- 「Customize clear button」（ant 第 9 条）—— allowClear={{ clearIcon }} 自定义清除图标
- 「Custom semantic dom styling」（ant 第 10 条）—— classNames / styles 对象与函数两种用法

**ccui 特有 demo**（ant 没有的）：

- 「键盘导航」—— ↑↓ Enter Esc 高亮与提交（ccui 把它作为独立 demo，ant 仅在交互里隐含）
- 「三种尺寸」—— size=large/default/small 直观对比（ant 该组件 API 表里有 size，但没单列 demo）
- 「表单联动」—— 与 Form 校验联动

### Props 对比

**ccui 缺失的 ant props**（按 ant API 表顺序）：

- `children` —— 自定义触发器节点
- `defaultOpen`（boolean）—— 浮层初始打开状态
- `open`（boolean）—— 受控的浮层打开状态
- `value`（string）—— 受控值（ccui 用 v-model，但缺失独立 value/onChange 受控约定）
- `popupRender`（(origin) => ReactNode，v6 取代 dropdownRender）—— 自定义浮层内容
- `popupMatchSelectWidth`（boolean | number，默认 true）—— 浮层宽度跟随输入框
- `classNames` / `styles`（Record<SemanticDOM, ...>）—— 语义化 DOM 自定义 className/样式
- `variant`（'outlined'|'filled'|'borderless'|'underlined'，默认 'outlined'，v5.13.0）—— 边框样式
- `virtual`（boolean，默认 true，v4.1.0）—— 关闭虚拟滚动

**命名/形状差异**：

- ccui `allowClear: boolean` ↔ ant `allowClear: boolean | { clearIcon, disabled? }`（ccui 无对象形态）
- ccui `popupClassName: string` ↔ ant `classNames.popup.root: string`（ant 已弃用 popupClassName）
- ccui `popupMaxHeight: number` ↔ ant `listHeight`（命名不同；ant 默认 256）
- ccui `searchDebounce: number` —— ant 无原生防抖，需 onSearch 内手动 debounce

**ccui 特有 props**：

- `caseSensitive`（boolean）—— 大小写敏感开关（ant 通过 filterOption 函数实现）
- `popupAppendToBody`（boolean）—— ant 用 getPopupContainer 实现
- `transitionName`（string）—— 浮层过渡名（ant 由主题/motion 处理）
- `searchDebounce`（number）—— 内置搜索防抖

### Events / 方法 对比

**缺失 events**：

- `onClear`（v4.6.0）
- `onInputKeyDown`
- `onOpenChange`（v6 取代 onDropdownVisibleChange）
- `onPopupScroll`

**缺失 expose 方法**：

- `blur()` / `focus()`

### 子组件 / 静态导出

无（AutoComplete 本身没有静态子组件，ccui 已对齐）。

---

## Cascader

- Ant 段：`## cascader`（行 6872–8435）
- ccui types：`packages/ccui/ui/cascader/src/cascader-types.ts`
- ccui docs：`packages/docs/components/cascader/index.md`
- ccui 自报状态：80%

### Demo 对比

**Ant 官方 demo（共 18 条，按官方顺序）**：

1. Basic
2. Default value
3. Custom trigger
4. Hover
5. Disabled option
6. Change on select
7. Multiple
8. ShowCheckedStrategy
9. Size
10. Custom render
11. Search
12. Load Options Lazily
13. Custom Field Names
14. Prefix and Suffix
15. Custom dropdown
16. Placement
17. Variants
18. Status
19. Custom semantic dom styling
20. Panel (v5.10.0+)

**ccui 文档 demo（共 12 条，按文档顺序）**：

1. 基本用法
2. 中间节点也可选 (changeOnSelect)
3. 自定义字段名 (fieldNames)
4. 禁用某项
5. 自定义路径展示
6. 三种尺寸
7. 表单联动
8. 弹层容器
9. hover 触发
10. showSearch 搜索
11. loadData 异步加载
12. multiple 多选

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「Default value」（ant 第 2 条）—— defaultValue=['zhejiang','hangzhou','xihu'] 非受控初值
- 「Custom trigger」（ant 第 3 条）—— children 槽位替代默认输入框（如 `<a>` 链接）
- 「ShowCheckedStrategy」（ant 第 8 条）—— SHOW_CHILD/SHOW_PARENT 多选聚合策略
- 「Prefix and Suffix」（ant 第 14 条）—— prefix / suffixIcon / expandIcon 三类图标定制
- 「Custom dropdown」（ant 第 15 条）—— popupRender 在浮层底部追加 footer
- 「Variants」（ant 第 17 条）—— outlined/filled/borderless/underlined 四种边框
- 「Status」（ant 第 18 条）—— status="error" / "warning" 校验状态
- 「Custom semantic dom styling」（ant 第 19 条）—— classNames / styles
- 「Panel」（ant 第 20 条）—— Cascader.Panel 内嵌面板视图

**ccui 特有 demo**：

- 「表单联动」—— 与 Form 校验联动
- 「弹层容器」—— popupAppendToBody / getPopupContainer 调试场景

### Props 对比

**ccui 缺失的 ant props**：

- `autoClearSearchValue`（boolean，默认 true，v5.9.0）—— 多选选中后清空搜索（已弃用，移到 showSearch 下）
- `defaultOpen`（boolean）—— 初始打开
- `defaultValue`（值数组）—— 非受控初值
- `maxTagCount`（number | 'responsive'，v4.17.0）—— 多选最大显示标签数
- `maxTagPlaceholder`（ReactNode | function，v4.17.0）—— 折叠时占位
- `maxTagTextLength`（number，v4.17.0）—— 单 tag 最长字符
- `open`（boolean）—— 受控开关
- `prefix`（ReactNode，v5.22.0）—— 触发器前缀
- `suffixIcon`（ReactNode）—— 后缀图标
- `loadingIcon`（ReactNode）—— 异步加载图标
- `removeIcon`（ReactNode）—— 多选删除图标
- `showCheckedStrategy`（SHOW_PARENT | SHOW_CHILD，v4.20.0）—— 多选聚合策略
- `tagRender`（function）—— 多选 tag 自定义渲染
- `popupRender`（function）—— 浮层内容自定义
- `optionRender`（function，v5.16.0）—— 选项渲染自定义
- `classNames` / `styles` —— 语义化 DOM 样式
- `variant`（outlined|filled|borderless|underlined，v5.13.0）
- `Cascader.Panel`（v5.10.0+）—— 内嵌面板形态

**命名/形状差异**：

- ccui `clearable: boolean` ↔ ant `allowClear: boolean | { clearIcon }`
- ccui `popupClassName: string` ↔ ant `classNames.popup.root: string`
- ccui `expandIcon: string`（仅字符）↔ ant `expandIcon: ReactNode`（类型缩窄）
- ccui `showSearch: boolean | { filter }` ↔ ant `showSearch: boolean | { filter, limit, matchInputWidth, render, sort, searchValue, onSearch, searchIcon }`（ant 子配置远更丰富）

**ccui 特有 props**：

- `transitionName`（string）—— 过渡动画名
- `popupAppendToBody`（boolean）
- `autoFocus`（boolean）—— 自动聚焦
- `inputReadOnly`（boolean）—— 输入框只读控制
- `separator`（string，默认 ' / '）—— ant 没有显式 separator，由 displayRender 决定

### Events / 方法 对比

**缺失 events**：

- `onOpenChange` / `onDropdownVisibleChange`（弃用）
- `onSearch`（已迁入 showSearch.onSearch）

**缺失 expose 方法**：

- `blur()` / `focus()`

### 子组件 / 静态导出

- `Cascader.Panel`（v5.10.0+）—— 内嵌面板
- `Cascader.SHOW_CHILD` / `Cascader.SHOW_PARENT` —— 多选策略常量

---

## Checkbox

- Ant 段：`## checkbox`（行 9189–9631）
- ccui types：`packages/ccui/ui/check-box/src/check-box-types.ts`
- ccui docs：`packages/docs/components/check-box/index.md`
- ccui 自报状态：100%

### Demo 对比

**Ant 官方 demo（共 7 条，按官方顺序）**：

1. Basic
2. Disabled
3. Controlled Checkbox
4. Checkbox Group
5. Check all
6. Use with Grid
7. Custom semantic dom styling

**ccui 文档 demo（共 8 条，按文档顺序）**：

1. 基本使用
2. 用 label 属性显示文字
3. 禁用
4. 自定义颜色
5. 多选框组
6. 排列方向
7. 整组禁用 / 整组着色
8. 切换前钩子

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「Controlled Checkbox」（ant 第 3 条）—— 与外部按钮通讯切换 checked/disabled
- 「Check all」（ant 第 5 条）—— indeterminate + 全选/反选范式
- 「Use with Grid」（ant 第 6 条）—— Checkbox.Group 内嵌 Row/Col 实现复杂布局
- 「Custom semantic dom styling」（ant 第 7 条）—— classNames / styles

**ccui 特有 demo**：

- 「用 label 属性显示文字」—— 通过 label prop 显示文字（ant 用 children）
- 「自定义颜色」—— color prop 着色（ant 没有，需自定义 token）
- 「切换前钩子」—— beforeChange 异步拦截

### Props 对比

**ccui 缺失的 ant props**（Checkbox）：

- `checked`（boolean）—— 受控选中
- `defaultChecked`（boolean）—— 非受控初值
- `indeterminate`（boolean）—— 半选态（最关键缺失）
- `classNames` / `styles` —— 语义化 DOM 样式

**ccui 缺失的 ant props**（Checkbox.Group）：

- `defaultValue`（(string|number)[]）—— 非受控初值
- `name`（string）—— input name 透传
- `options`（string[] | Option[]）—— 数据驱动渲染（ccui 当前只支持子组件嵌套）
- `value`（数组）—— 受控值

**命名/形状差异**：

- ccui `modelValue: boolean`（单 checkbox）↔ ant `checked + defaultChecked` 两套
- ccui `label: string | number | boolean` ↔ ant 用 children 节点
- ccui CheckBoxGroup `direction: 'row' | 'column'` ↔ ant 没有 direction，靠 CSS / 外层 Flex 控制

**ccui 特有 props**：

- `color`（string）—— 单 checkbox 自定义着色
- `beforeChange`（(isChecked, v) => boolean | Promise<boolean>）—— 切换前拦截
- `direction`（'row' | 'column'）—— 组方向
- `name`（string，单 checkbox 上也提供）

### Events / 方法 对比

**缺失 events**：

- `onBlur` / `onFocus`

**缺失 expose 方法**：

- `blur()` / `focus()` / `nativeElement`（v5.17.3）

### 子组件 / 静态导出

ccui 已提供 CheckBoxGroup，对齐 Checkbox.Group。无其他静态导出。

---

## ColorPicker

- Ant 段：`## color-picker`（行 10319–10935）
- ccui types：`packages/ccui/ui/color-picker/src/color-picker-types.ts`
- ccui docs：`packages/docs/components/color-picker/index.md`
- ccui 自报状态：80%

### Demo 对比

**Ant 官方 demo（共 13 条，按官方顺序）**：

1. Basic Usage
2. Trigger size
3. controlled mode
4. Line Gradient
5. Rendering Trigger Text
6. Disable
7. Disabled Alpha
8. Clear Color
9. Custom Trigger
10. Custom Trigger Event
11. Color Format
12. Preset Colors
13. Custom Render Panel
14. Custom semantic dom styling

**ccui 文档 demo（共 8 条，按文档顺序）**：

1. 基本用法
2. 显示格式
3. 关闭 alpha
4. 预设色板
5. 三种尺寸
6. 禁用
7. 表单联动
8. 弹层容器

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「controlled mode」（ant 第 3 条）—— value + onChange 与 onChangeComplete 区别
- 「Line Gradient」（ant 第 4 条）—— mode='gradient' 渐变色选择（v5.20.0）
- 「Rendering Trigger Text」（ant 第 5 条）—— showText 为函数自定义触发器文本
- 「Clear Color」（ant 第 8 条）—— allowClear + onChange 清空交互
- 「Custom Trigger」（ant 第 9 条）—— children 槽位替换默认 swatch
- 「Custom Trigger Event」（ant 第 10 条）—— trigger='hover' 悬停触发
- 「Custom Render Panel」（ant 第 13 条）—— panelRender 自定义面板布局
- 「Custom semantic dom styling」（ant 第 14 条）—— classNames / styles

**ccui 特有 demo**：

- 「三种尺寸」—— 直接对比 size
- 「表单联动」 / 「弹层容器」

### Props 对比

**ccui 缺失的 ant props**：

- `arrow`（boolean | { pointAtCenter }，默认 true）—— 浮层箭头
- `children`（ReactNode）—— 自定义触发器
- `defaultFormat`（'rgb'|'hex'|'hsb'，v5.9.0）—— 默认格式
- `destroyOnHidden`（boolean，v5.25.0）—— 关闭时销毁
- `disabledFormat`（boolean，v5.22.0）—— 禁用格式切换
- `mode`（'single' | 'gradient' | (single|gradient)[]，v5.20.0）—— 单色 / 渐变模式
- `open`（boolean）—— 受控开关
- `panelRender`（function，v5.7.0）—— 自定义面板
- `trigger`（'hover' | 'click'，默认 'click'）—— 触发方式
- `showText`（boolean | (color) => ReactNode，v5.7.0）—— ccui 仅 boolean
- `classNames` / `styles` —— 语义化 DOM
- 静态 `theme` 集成（Component Token）

**命名/形状差异**：

- ccui `showText: boolean` ↔ ant `showText: boolean | function`
- ccui `format: 'hex'|'rgb'|'hsv'` ↔ ant `format: 'rgb'|'hex'|'hsb'`（ccui 多 hsv，ant 用 hsb——颜色模型有差）
- ccui `presets: string[]` ↔ ant `presets: PresetColorType[]`（含 label/key/colors/defaultOpen）
- ccui `defaultValue: string` ↔ ant `defaultValue: ColorType`（string | Color 对象 | gradient 数组）

**ccui 特有 props**：

- `popupAppendToBody` / `transitionName` / `popupClassName` —— 内部样式开关
- `getPopupContainer`

### Events / 方法 对比

**缺失 events**：

- `onChangeComplete`（v5.7.0）—— 拖拽结束才回调
- `onFormatChange`
- `onOpenChange`
- `onClear`（v5.6.0）

**缺失 expose 方法**：

无显式方法。

### 子组件 / 静态导出

无（ColorPicker 没有静态子组件）。但 ant 暴露的 `Color` 对象（toHex/toRgbString/...）在 ccui 端缺失，需要包装。

---

## Input

- Ant 段：`## input`（行 24896–25940）
- ccui types：`packages/ccui/ui/input/src/input-types.ts`
- ccui docs：`packages/docs/components/input/index.md`
- ccui 自报状态：100%

### Demo 对比

**Ant 官方 demo（共 15 条，按官方顺序）**：

1. Basic usage
2. Three sizes of Input
3. Variants
4. Compact Style
5. Search box
6. Search box with loading
7. TextArea
8. Autosizing the height to fit the content
9. OTP
10. Format Tooltip Input
11. prefix and suffix
12. Password box
13. With clear icon
14. With character counting
15. Custom count logic (v5.10.0)
16. Status
17. Focus
18. Custom semantic dom styling

**ccui 文档 demo（共 7 条，按文档顺序）**：

1. 基本使用
2. 不同尺寸
3. 禁用状态
4. 只读状态
5. 清空功能
6. 密码输入
7. 前置/后置内容

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「Variants」（ant 第 3 条）—— outlined/filled/borderless/underlined
- 「Compact Style」（ant 第 4 条）—— Space.Compact 拼接输入组
- 「Search box」 / 「Search box with loading」（ant 第 5–6 条）—— Input.Search 子组件
- 「TextArea」 / 「Autosizing」（ant 第 7–8 条）—— Input.TextArea + autoSize
- 「OTP」（ant 第 9 条）—— Input.OTP 一次性密码
- 「Format Tooltip Input」（ant 第 10 条）—— 与 Tooltip 联动的数字格式化输入
- 「prefix and suffix」（ant 第 11 条）—— prefix / suffix 槽位（ccui 只有 prepend/append 字符串）
- 「With character counting」 / 「Custom count logic」（ant 第 14–15 条）—— showCount / count.{max,strategy,exceedFormatter}
- 「Status」（ant 第 16 条）—— status="error" / "warning"
- 「Focus」（ant 第 17 条）—— inputRef.current.focus({ cursor, preventScroll })
- 「Custom semantic dom styling」（ant 第 18 条）

**ccui 特有 demo**：

- 「禁用状态」 / 「只读状态」—— 单列 demo（ant 在 API 里覆盖）

### Props 对比

**ccui 缺失的 ant props**（按 ant API 顺序）：

- `addonAfter` / `addonBefore`（ReactNode，已弃用建议用 Space.Compact）—— ccui 的 prepend/append 形状不同
- `allowClear`（boolean | { clearIcon, disabled }）—— ccui 用 `clearable: boolean`
- `count`（CountConfig：max/strategy/show/exceedFormatter，v5.10.0）—— 字符计数定制
- `defaultValue`（string）—— 非受控初值
- `id`（string）—— 表单关联
- `maxLength`（number）—— 原生最大长度
- `prefix` / `suffix`（ReactNode）—— 前后图标（ccui 当前只有 prepend/append 字符串）
- `showCount`（boolean | { formatter }，v4.18.0）—— 字符计数展示
- `status`（'error' | 'warning'，v4.19.0）—— 校验状态
- `variant`（outlined|filled|borderless|underlined，v5.13.0）
- `classNames` / `styles` —— 语义化 DOM

**命名/形状差异**：

- ccui `clearable: boolean` ↔ ant `allowClear: boolean | { clearIcon, disabled }`
- ccui `prepend: string` ↔ ant `addonBefore: ReactNode`（ccui 类型严重收窄）
- ccui `append: string` ↔ ant `addonAfter: ReactNode`
- ccui `showPassword: boolean` ↔ ant 通过 `Input.Password` 子组件实现
- ccui `size: 'large'|'default'|'small'` ↔ ant `size: 'large'|'medium'|'small'`（ccui 'default' vs ant 'medium' 字面值差）

**ccui 特有 props**：

- `showPassword`（boolean）—— 在 base Input 上做密码切换（ant 用子组件 Password）

### Events / 方法 对比

**缺失 events**：

- `onChange(e)` —— ccui 有 update:modelValue 但未暴露原生 event
- `onPressEnter`
- `onClear`（v5.20.0）
- `onBlur` / `onFocus`（细粒度暴露）

**缺失 expose 方法**：

- `blur()` / `focus({ preventScroll, cursor: 'start'|'end'|'all' })`
- `nativeElement`（v5.17.3）
- `select()`

### 子组件 / 静态导出

**缺失**：

- `Input.TextArea` —— 多行文本，含 `autoSize` / `showCount` / `classNames`
- `Input.Search` —— 搜索框，含 `enterButton` / `loading` / `onSearch` / `searchIcon`
- `Input.Password` —— 密码框，含 `iconRender` / `visibilityToggle`
- `Input.OTP` —— 一次性密码（v5.16.0+），含 `length` / `formatter` / `mask` / `separator`

---

## InputNumber

- Ant 段：`## input-number`（行 25942–26559）
- ccui types：`packages/ccui/ui/input-number/src/input-number-types.ts`
- ccui docs：`packages/docs/components/input-number/index.md`
- ccui 自报状态：100%

### Demo 对比

**Ant 官方 demo（共 13 条，按官方顺序）**：

1. Basic
2. Sizes
3. Disabled
4. High precision decimals
5. Formatter
6. Keyboard
7. Wheel
8. Variants
9. Spinner
10. Out of range
11. Prefix / Suffix
12. Status
13. Focus
14. Custom semantic dom styling

**ccui 文档 demo（共 9 条，按文档顺序）**：

1. 基本用法
2. 禁用状态
3. 数值范围
4. 步数
5. 精度
6. 尺寸
7. 控制按钮位置
8. 允许空值
9. （API 节）

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「High precision decimals」（ant 第 4 条）—— stringMode 高精度小数（依赖 BigInt）
- 「Formatter」（ant 第 5 条）—— formatter / parser 货币百分比格式
- 「Keyboard」（ant 第 6 条）—— keyboard=false 关闭键盘步进
- 「Wheel」（ant 第 7 条）—— changeOnWheel 鼠标滚轮加减
- 「Variants」（ant 第 8 条）—— outlined/filled/borderless/underlined
- 「Spinner」（ant 第 9 条）—— mode='spinner' 旋钮形态
- 「Out of range」（ant 第 10 条）—— value 越界 warning 视觉
- 「Prefix / Suffix」（ant 第 11 条）—— prefix / suffix 槽位
- 「Status」（ant 第 12 条）—— status='error'/'warning'
- 「Focus」（ant 第 13 条）—— ref.focus({ cursor, preventScroll })
- 「Custom semantic dom styling」（ant 第 14 条）

**ccui 特有 demo**：

- 「允许空值」—— allowEmpty 把 modelValue 设为 undefined（ant 用 null 默认支持）
- 「控制按钮位置」—— controlsPosition 'right' | 'both'（ant 仅默认双侧，无右侧单列）

### Props 对比

**ccui 缺失的 ant props**：

- `addonAfter` / `addonBefore`（已弃用）
- `changeOnBlur`（boolean，默认 true，v5.11.0）—— blur 触发 onChange
- `changeOnWheel`（boolean，v5.14.0）—— 滚轮改值
- `decimalSeparator`（string）—— 小数分隔符
- `defaultValue`（number）—— 非受控初值
- `formatter`（function(value, info) => string）—— 展示格式化
- `keyboard`（boolean，默认 true）—— 键盘步进开关
- `mode`（'input' | 'spinner'）—— 旋钮形态
- `parser`（function(string) => number）—— 反解析
- `prefix`（ReactNode）—— 前缀图标
- `suffix`（ReactNode，v5.20.0）—— 后缀图标
- `status`（'error' | 'warning'）—— 校验状态
- `stringMode`（boolean）—— 高精度小数
- `variant`（outlined|filled|borderless|underlined）
- `classNames` / `styles` —— 语义化 DOM

**命名/形状差异**：

- ccui `size: 'lg'|'md'|'sm'` ↔ ant `size: 'large'|'medium'|'small'`（字面值大不同，ccui 不一致于自身 Input 的 large/default/small）
- ccui `controls: boolean` ↔ ant `controls: boolean | { upIcon, downIcon }`（ant 支持自定义图标）
- ccui `controlsPosition: 'right' | 'both'` ↔ ant 无此 prop（默认双侧）
- ccui `reg: RegExp | string` —— ant 无对应（用 formatter/parser 实现）

**ccui 特有 props**：

- `allowEmpty`（boolean）—— 允许 undefined
- `showGlowStyle`（boolean）—— 聚焦发光样式
- `controlsPosition`（'right' | 'both'）
- `reg`（RegExp | string）—— 输入正则约束
- `placeholder` —— ant InputNumber 也有 placeholder（已对齐）

### Events / 方法 对比

**缺失 events**：

- `onPressEnter`
- `onStep`（v5.x，含 offset / type / emitter）

**已暴露 expose（与 ant 类似）**：

- `focus()` / `blur()` / `increase()` / `decrease()` / `getValue()` / `setValue()`
- 缺失：`focus({ preventScroll, cursor })` / `nativeElement`（v5.17.3）

### 子组件 / 静态导出

无（InputNumber 无静态子组件）。

---

## Mentions

- Ant 段：`## mentions`（行 29066–29774）
- ccui types：`packages/ccui/ui/mentions/src/mentions-types.ts`
- ccui docs：`packages/docs/components/mentions/index.md`
- ccui 自报状态：80%

### Demo 对比

**Ant 官方 demo（共 11 条，按官方顺序）**：

1. Basic
2. Size
3. Variants
4. Asynchronous loading
5. With Form
6. Customize Trigger Token
7. disabled or readOnly
8. Placement
9. With clear icon
10. autoSize
11. Status
12. Custom semantic dom styling

**ccui 文档 demo（共 5 条，按文档顺序）**：

1. 基本用法
2. 自定义选项格式
3. 多触发字符
4. 自定义分隔符
5. 自定义过滤

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「Size」（ant 第 2 条）—— size=large/medium/small
- 「Variants」（ant 第 3 条）—— outlined/filled/borderless/underlined
- 「Asynchronous loading」（ant 第 4 条）—— onSearch + loading 远程数据
- 「With Form」（ant 第 5 条）—— Form.Item 校验 + getMentions 静态方法
- 「disabled or readOnly」（ant 第 7 条）—— disabled / readOnly 两态对比
- 「Placement」（ant 第 8 条）—— placement='top' / 'bottom'（ccui 已支持但无 demo）
- 「With clear icon」（ant 第 9 条）—— allowClear / 自定义 clearIcon
- 「autoSize」（ant 第 10 条）—— autoSize { minRows, maxRows }（ccui 已支持但无 demo）
- 「Status」（ant 第 11 条）—— status='error' / 'warning'
- 「Custom semantic dom styling」（ant 第 12 条）

**ccui 特有 demo**：

- 「自定义分隔符」—— split prop 单独 demo（ant 文档未单列）

### Props 对比

**ccui 缺失的 ant props**：

- `allowClear`（boolean | { clearIcon, disabled }，v5.13.0）—— 清除按钮
- `loading`（boolean）—— 加载状态
- `readOnly`（boolean）—— 只读
- `size`（'large'|'medium'|'small'）—— 尺寸
- `status`（'error'|'warning'|'success'|'validating'）—— 校验
- `variant`（outlined|filled|borderless|underlined）
- `validateSearch`（function）—— 自定义触发搜索逻辑
- `getPopupContainer`（() => HTMLElement）
- `classNames` / `styles` —— 语义化 DOM
- 静态方法 `Mentions.getMentions(value, config)`

**命名/形状差异**：

- ccui `popupMaxHeight: number` ↔ ant 无显式 prop（由 token 控制）
- ccui `caseSensitive: boolean` ↔ ant 用 filterOption 函数实现
- ccui `searchDebounce: number` —— ant 无原生防抖

**ccui 特有 props**：

- `caseSensitive` / `searchDebounce`（同上）
- `rows`（number，默认 3）—— ant 也有透传到 textarea 的 rows，但未在 API 表列出

### Events / 方法 对比

**缺失 events**：

- `onBlur` / `onFocus`
- `onClear`（v5.20.0）
- `onResize`
- `onPopupScroll`（v5.23.0）

**缺失 expose 方法**：

- `blur()` / `focus()`

### 子组件 / 静态导出

- `Mentions.getMentions(value, { prefix, split })` —— 解析提及结果（ccui 缺失）

---

## Radio

- Ant 段：`## radio`（行 36555–37227）
- ccui types：`packages/ccui/ui/radio/src/radio-types.ts`
- ccui docs：`packages/docs/components/radio/index.md`
- ccui 自报状态：100%

### Demo 对比

**Ant 官方 demo（共 10 条，按官方顺序）**：

1. Basic
2. disabled
3. Radio Group
4. Vertical Radio.Group
5. Block Radio.Group
6. Radio.Group group - optional
7. radio style
8. Radio.Group with name
9. Size
10. Solid radio button
11. Custom semantic dom styling

**ccui 文档 demo（共 7 条，按文档顺序）**：

1. 基本使用
2. 禁用
3. 单选框组
4. 排列方向
5. 整组禁用
6. 切换前钩子
7. 监听 change

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「Block Radio.Group」（ant 第 5 条）—— block prop 撑满父宽（v5.21.0）
- 「Radio.Group group - optional」（ant 第 6 条）—— options 数据驱动 + optionType='button' + buttonStyle='solid'
- 「radio style」（ant 第 7 条）—— Radio.Button 按钮风格组
- 「Radio.Group with name」（ant 第 8 条）—— name 透传到原生 input
- 「Size」（ant 第 9 条）—— size=large/medium/small Radio.Button
- 「Solid radio button」（ant 第 10 条）—— buttonStyle='solid' 实心样式
- 「Custom semantic dom styling」（ant 第 11 条）—— classNames / styles

**ccui 特有 demo**：

- 「切换前钩子」—— beforeChange 拦截
- 「监听 change」—— 独立监听 demo（ant 仅在 Radio Group 里隐含）

### Props 对比

**ccui 缺失的 ant props**（Radio）：

- `checked`（boolean）—— 受控选中
- `defaultChecked`（boolean）—— 非受控初值
- `value`（any）—— 与 Group 联动的值
- `classNames` / `styles`（v6.0.0）

**ccui 缺失的 ant props**（Radio.Group）：

- `block`（boolean，v5.21.0）—— 撑满父宽
- `buttonStyle`（'outline' | 'solid'）—— 按钮风格
- `defaultValue`（any）—— 非受控初值
- `name`（string）—— input name 透传
- `options`（string[] | number[] | CheckboxOptionType[]）—— 数据驱动渲染
- `optionType`（'default' | 'button'，v4.4.0）—— 渲染形态
- `orientation`（'horizontal' | 'vertical'）—— 方向（与 vertical 并存，orientation 优先）
- `size`（'large' | 'medium' | 'small'）
- `value`（any）—— 受控值
- `classNames` / `styles`（v6.0.0）
- 静态子组件 `Radio.Button`

**命名/形状差异**：

- ccui `modelValue: string` ↔ ant `value: any` + `defaultValue` 两态；ccui 强行限定为 string，缺失 number/boolean
- ccui `direction: 'row' | 'column'` ↔ ant `orientation: 'horizontal' | 'vertical'` 或 `vertical: boolean`
- ccui `label: typeof (String || Number)` —— bug-level typo，`String || Number` 是 truthy 表达式（`String`），导致 label 实际只接受 string

**ccui 特有 props**：

- `beforeChange`（(value) => boolean | Promise<boolean>）—— 切换前拦截

### Events / 方法 对比

**缺失 events**：

- `onChange(e:RadioChangeEvent)` —— ccui 仅 update:modelValue
- `onBlur` / `onFocus`

**缺失 expose 方法**：

- `blur()` / `focus()`

### 子组件 / 静态导出

**缺失**：

- `Radio.Button` —— 按钮形态单选（ccui 完全缺失）
- `Radio.Group` 的 `options` 数据驱动模式

---

## Slider

- Ant 段：`## slider`（行 40574–41215）
- ccui types：`packages/ccui/ui/slider/src/slider-types.ts`
- ccui docs：`packages/docs/components/slider/index.md`
- ccui 自报状态：100%

### Demo 对比

**Ant 官方 demo（共 12 条，按官方顺序）**：

1. Basic
2. Slider with InputNumber
3. Slider with icon
4. Customize tooltip
5. Event
6. Graduated slider
7. Vertical
8. Control visibility of Tooltip
9. Reverse
10. Draggable track
11. Multiple handles
12. Dynamic edit nodes
13. Custom semantic dom styling

**ccui 文档 demo（共 12 条，按文档顺序）**：

1. 基本用法
2. 范围选择
3. 垂直模式
4. 步长
5. 显示间断点
6. 带标记
7. 带输入框
8. 定制 Tooltip 显示内容
9. Tooltip 位置
10. 尺寸变体
11. 禁用状态
12. 无障碍访问

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「Slider with icon」（ant 第 3 条）—— 滑块两侧加图标语义化
- 「Event」（ant 第 5 条）—— onChange vs onChangeComplete 区别（ccui 缺 onChangeComplete）
- 「Control visibility of Tooltip」（ant 第 8 条）—— tooltip.open=true 强制显示
- 「Reverse」（ant 第 9 条）—— reverse 反向滑块（ccui 无 reverse）
- 「Draggable track」（ant 第 10 条）—— range.draggableTrack 拖整段轨道
- 「Multiple handles」（ant 第 11 条）—— range 多 handle + tracks 渐变
- 「Dynamic edit nodes」（ant 第 12 条）—— range.editable / minCount / maxCount 增删节点
- 「Custom semantic dom styling」（ant 第 13 条）—— classNames / styles

**ccui 特有 demo**：

- 「带输入框」 / 「尺寸变体」 / 「无障碍访问」 —— ccui 单列演示（ant 在 API 表 / 隐式覆盖）
- 「Tooltip 位置」—— placement 独立 demo

### Props 对比

**ccui 缺失的 ant props**：

- `dots`（boolean）—— 仅可拖到 marks（ccui 用 showStops 部分对齐）
- `included`（boolean，默认 true）—— marks 区间是否包含
- `keyboard`（boolean，v5.2.0+）—— 键盘步进开关
- `orientation`（'horizontal' | 'vertical'）—— ccui 用 `vertical: boolean`
- `range`（boolean | { draggableTrack, editable, minCount, maxCount }）—— ccui 仅 boolean，缺失对象配置
- `reverse`（boolean）—— 反向
- `tooltip`（{ autoAdjustOverflow, open, placement, getPopupContainer, formatter }）—— ccui 用扁平 showTooltip / formatTooltip / placement / tooltipClass，缺失 open / autoAdjustOverflow / getPopupContainer
- `classNames` / `styles` —— 语义化 DOM
- 弃用：`handleStyle` / `railStyle` / `trackStyle` / `onAfterChange`（ant 弃用迁到 styles / onChangeComplete）

**命名/形状差异**：

- ccui `range: boolean` ↔ ant `range: boolean | { draggableTrack, editable, minCount, maxCount }`
- ccui `vertical: boolean` ↔ ant `orientation: 'horizontal'|'vertical'` + `vertical: boolean`（双轨）
- ccui `formatTooltip` ↔ ant `tooltip.formatter`
- ccui `placement: 'top'|'right'|'bottom'|'left'` ↔ ant `tooltip.placement: string`（ccui 类型更窄）
- ccui `showInput` / `showInputControls` / `inputSize` / `height` —— ant 没有，需要外层组合 InputNumber

**ccui 特有 props**：

- `showInput` / `showInputControls` / `inputSize`（与 InputNumber 联动）
- `showStops`（boolean）—— 间断点
- `label` / `ariaLabel` / `rangeStartLabel` / `rangeEndLabel` / `formatValueText` —— a11y 支持
- `tipsRenderer`（function | null）—— 自定义 tooltip 渲染
- `persistent` / `validateEvent` / `showDefaultTooltip` —— Form 联动开关

### Events / 方法 对比

**缺失 events**：

- `onChangeComplete`（mouseup / keyup 才回调；这是 ant 推荐的提交点，ccui 缺失会导致 form 性能问题）

**缺失 expose 方法**：

- `blur()` / `focus()`

### 子组件 / 静态导出

无（Slider 无静态子组件）。

---

## Switch

- Ant 段：`## switch`（行 44223–44495）
- ccui types：`packages/ccui/ui/switch/src/switch-types.ts`
- ccui docs：`packages/docs/components/switch/index.md`
- ccui 自报状态：100%

### Demo 对比

**Ant 官方 demo（共 5 条，按官方顺序）**：

1. Basic
2. Disabled
3. Text & icon
4. Two sizes
5. Loading
6. Custom semantic dom styling

**ccui 文档 demo（共 6 条，按文档顺序）**：

1. 基本使用
2. 内嵌文字
3. 尺寸
4. 禁用 / 加载
5. 自定义开关值
6. 监听 change 事件

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「Custom semantic dom styling」（ant 第 6 条）—— classNames / styles

**ccui 特有 demo**：

- 「自定义开关值」—— checkedValue / uncheckedValue 支持任意类型（ant 仅 boolean）
- 「监听 change 事件」—— 独立 onChange 演示

### Props 对比

**ccui 缺失的 ant props**：

- `checked`（boolean）—— 受控选中（ccui 用 modelValue）
- `defaultChecked`（boolean）—— 非受控初值
- `defaultValue`（boolean，v5.12.0）—— defaultChecked 别名
- `value`（boolean，v5.12.0）—— checked 别名
- `className` —— 顶层透传
- `classNames` / `styles` —— 语义化 DOM

**命名/形状差异**：

- ccui `checkedChildren: string` / `uncheckedChildren: string` ↔ ant `checkedChildren: ReactNode` / `unCheckedChildren: ReactNode`（注意 ant 是 **un**Checked 大小写；ccui 形状缩窄为 string）
- ccui `size: 'default' | 'small'` ↔ ant `size: 'medium' | 'small'`（字面值差，ccui 使用 'default'）

**ccui 特有 props**：

- `checkedValue` / `uncheckedValue`（boolean | string | number）—— 自定义 on/off 值（ant 仅 boolean）
- `autofocus`（boolean）—— 自动聚焦（ant 没列在 API 表）

### Events / 方法 对比

**缺失 events**：

- `onClick(checked, event)` —— ant 单独 onClick
- `onChange(checked, event)` —— ccui 有 update:modelValue 但缺 event 参数

**缺失 expose 方法**：

- `blur()` / `focus()`

### 子组件 / 静态导出

无（Switch 无静态子组件）。

---

## Select

- Ant 段：`## select`（行 38357–40127）
- ccui types：`packages/ccui/ui/select/src/select-types.ts`
- ccui docs：`packages/docs/components/select/index.md`
- ccui 自报状态：100%

### Demo 对比

**Ant 官方 demo（共 21 条，按官方顺序）**：

1. Basic Usage
2. Select with search field
3. Custom Search
4. Multi field search
5. multiple selection
6. Sizes
7. Custom dropdown options
8. Search with sort
9. Tags
10. Option Group
11. coordinate
12. Search Box
13. Get value of selected item
14. Automatic tokenization
15. Search and Select Users
16. Prefix and Suffix
17. Custom dropdown
18. Hide Already Selected
19. Variants
20. Custom Tag Render
21. Custom Selected Label Render
22. Responsive maxTagCount
23. Big Data
24. Status
25. Placement
26. Max Count
27. Custom semantic dom styling

**ccui 文档 demo（共 22 条，按文档顺序）**：

1. 基本用法
2. 多选
3. Tags 模式（自由输入）
4. 可搜索 / 远程搜索
5. 选项分组
6. fieldNames 字段名映射
7. 自定义渲染（option / tag / empty）
8. Popup 位置
9. 虚拟列表（大数据量）
10. 嵌套分组
11. 命中高亮
12. Teleport 浮层
13. labelInValue 模式
14. 选择数量上限
15. ARIA 与键盘导航
16. optionLabelProp 已选展示字段
17. showSearch 别名
18. 自定义浮层动画
19. 拖拽排序已选 tag
20. FormItem 联动

**ccui 缺失的 ant demo**（按 ant 顺序）：

- 「Multi field search」（ant 第 4 条）—— optionFilterProp 接受 string[] OR 匹配（v6.1.0）
- 「Search with sort」（ant 第 8 条）—— filterSort 排序
- 「coordinate」（ant 第 11 条）—— 联动两个 Select 父子级联
- 「Get value of selected item」（ant 第 13 条）—— onChange(value, option) 拿到完整 option
- 「Automatic tokenization」（ant 第 14 条）—— tokenSeparators 自动分词
- 「Search and Select Users」（ant 第 15 条）—— 远程异步 + 受控
- 「Prefix and Suffix」（ant 第 16 条）—— prefix / suffixIcon 槽位
- 「Custom dropdown」（ant 第 17 条）—— popupRender 在浮层追加节点
- 「Hide Already Selected」（ant 第 18 条）—— 已选项从下拉中过滤
- 「Variants」（ant 第 19 条）—— outlined/filled/borderless/underlined
- 「Custom Selected Label Render」（ant 第 21 条）—— labelRender 自定义已选标签
- 「Responsive maxTagCount」（ant 第 22 条）—— maxTagCount='responsive' 自适应折叠
- 「Status」（ant 第 24 条）—— status='error'/'warning' 单独 demo（ccui types 已支持 status，文档无 demo）
- 「Max Count」（ant 第 26 条）—— maxCount 限制最多选择数

**ccui 特有 demo**：

- 「虚拟列表」 / 「嵌套分组」 / 「命中高亮」 / 「Teleport 浮层」 / 「labelInValue 模式」 / 「optionLabelProp 已选展示字段」 / 「showSearch 别名」 / 「自定义浮层动画」 / 「拖拽排序已选 tag」 / 「FormItem 联动」 / 「ARIA 与键盘导航」 —— 这些 ccui 单独成 demo，ant 多在 API 表或隐式

### Props 对比

**ccui 缺失的 ant props**（按 ant API 表顺序）：

- `defaultOpen`（boolean）—— 浮层初始打开
- `defaultValue`（受控值变体）—— 非受控初值
- `listHeight`（number，默认 256）—— ccui 用 virtualMaxHeight 部分对齐
- `loadingIcon`（ReactNode，v6.4.0）
- `maxTagPlaceholder`（ReactNode | function）—— 超过 maxTagCount 折叠占位
- `maxTagTextLength`（number）—— 单 tag 最长字符
- `menuItemSelectedIcon`（ReactNode）—— 多选已选图标
- `notFoundContent`（ReactNode）—— ccui 用 noDataText，但仅 string
- `open`（boolean）—— 受控开关
- `popupMatchSelectWidth`（boolean | number，默认 true，v5.5.0）
- `popupRender`（function，v5.25.0）—— 自定义浮层内容
- `prefix`（ReactNode，v5.22.0）—— 触发器前缀
- `removeIcon`（ReactNode）—— 多选删除图标
- `suffixIcon`（ReactNode）—— 后缀图标
- `tagRender`（function）—— 多选 tag 渲染（ccui 用插槽实现）
- `labelRender`（function，v5.15.0）—— 已选标签渲染
- `tokenSeparators`（string[]）—— 自动分词
- `value`（受控值）—— ccui 用 modelValue
- `variant`（outlined|filled|borderless|underlined）
- `virtual`（boolean，默认 true）—— ant 是 true，ccui 默认 false 且字段名 `virtualScroll`
- `classNames` / `styles` —— 语义化 DOM

**命名/形状差异**：

- ccui `clearable: boolean` ↔ ant `allowClear: boolean | { clearIcon }`
- ccui `filterable: boolean` —— ant 用 `showSearch`（ccui 同时提供 showSearch 作为别名）
- ccui `noDataText: string` / `loadingText: string` ↔ ant `notFoundContent: ReactNode`
- ccui `maxCount: number`（默认 0=不限）↔ ant `maxCount: number`（默认 -=不限）—— 语义略不同
- ccui `mode: 'default'|'multiple'|'tags'` + `multiple: boolean` —— ant 仅 `mode: 'multiple'|'tags'`（ccui 双 prop 冗余）
- ccui `placement: 'bottom'|'top'|'auto'` ↔ ant `placement: 'bottomLeft'|'bottomRight'|'topLeft'|'topRight'`（精度差）
- ccui `transitionName` —— ant 无对应

**ccui 特有 props**：

- `highlightMatch`（boolean）—— 命中高亮
- `virtualScroll` / `virtualItemHeight` / `virtualMaxHeight`（虚拟滚动配置；ant 用 virtual + listHeight + 内部固定 itemHeight）
- `tagsDraggable`（boolean）—— 已选 tag 拖拽排序

### Events / 方法 对比

**缺失 events**：

- `onActive(value)`
- `onClear`（v4.6.0）
- `onDeselect`（仅多选/tags）
- `onOpenChange` / `onDropdownVisibleChange`（已弃用）
- `onInputKeyDown`
- `onPopupScroll`

**缺失 expose 方法**：

- `blur()` / `focus()`

### 子组件 / 静态导出

ant Select 历史上有 `Select.Option` / `Select.OptGroup` 但 v5+ 推荐使用 `options` 数据驱动。ccui 当前没有 `Option` / `OptGroup` 子组件（按 v6 推荐对齐 OK，但 jsx 写法不支持）。
