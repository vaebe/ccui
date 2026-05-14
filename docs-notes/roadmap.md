# vue3-ccui 后续任务清单（roadmap）

> **本仓库是 Vue 3 组件库。** 与 Ant Design 的关系是「对标」而不是「移植」。所有 React-only 模式（render props / forwardRef / shouldUpdate / 受控-非受控二分法 等）一律不照搬，要么不做，要么翻译成 Vue 习惯写法（v-model / slot / composable / KeepAlive）。详见下文「对标原则」一节。
>
> 数据基础：`components-diff/references/per-component/` 73 组件 4305 行明细 + `components-diff.md` 第 6 节「API 风格对齐审计」。
> 分级口径（T-Shirt Size）：**S** <1 天 / **M** 1–3 天 / **L** 3–7 天 / **XL** >1 周。
> 每个 batch 互相不阻塞，可并行；建议节奏：每 sprint 取 1 个 L + 2–3 个 M + 5–10 个 S。
> 每个 batch 完成后在对应行加状态（`[x]` 完成 / `[~]` 推进中），并把交付摘要写到 `components-diff.md` 「三、本轮交付记录」节。

---

## 对标原则（Benchmark, 不是 100% 对齐）

ccui 与 Ant Design 的关系是**对标**：能力覆盖到、心智模型对齐、迁移成本低，但**不照搬 React-only 模式**。下面这些清单决定每条任务怎么落地。

### 一、不做的事（React-only / Vue 自带等价物）

| Ant 概念 | 为什么不做 | ccui 怎么解决 |
| --- | --- | --- |
| `Form.shouldUpdate` | React 渲染优化原语，强迫子树重渲。Vue 响应式自动处理依赖收集 | 不实现，文档说明「Vue 中通过 reactive 自然达成」 |
| `Form.Item.valuePropName` / `getValueFromEvent` / `getValueProps` | 用来桥接 React 受控 onChange/value 协议 | **不需要**，Vue `v-model:*` + `modelValue` 已经统一协议 |
| `controlled` vs `uncontrolled` 语义 | React 受控/非受控二分法 | Vue 用 `v-model:*` + `default-*` 双轨已统一覆盖，文档不引入这两个词 |
| `ref forwarding` / `React.forwardRef` | React 特有 ref 转发 | Vue `defineExpose` + 模板 `ref` 直接拿，本就是另一套机制 |
| React 风格的 `render props`（`tagRender` / `optionRender` / `cellRender` / `headerRender` / `iconRender` / `modalRender` / `popupRender` / `dropdownRender` / `indicatorsRender` / `actionsRender` / `panelRender` / `displayRender` / `titleRender` 等） | React 把 render 当一等公民 | **全部翻译成 Vue 作用域插槽**，命名按 ccui 惯例（如 `tag` / `option` / `cell` / `header` / `icon` / `modal` / `popup` / `indicator` slot），保留 prop 形式时仅接受字符串 / VNode，不接受 React 函数 |
| **静态属性命名空间挂子组件**（`Input.TextArea` / `Button.Group` / `Tag.CheckableTag` / `Image.PreviewGroup` / `Avatar.Group` / `Badge.Ribbon` / `Card.Meta` / `List.Item.Meta` / `Table.Column` / `Tree.DirectoryTree` / `Dropdown.Button` / `Skeleton.Button` / `Form.ErrorList` / `Statistic.Timer` / `Alert.ErrorBoundary` / `Space.Compact` 等） | React 没有 kebab 模板 + auto-import，靠 `<Input.TextArea>` 命名空间读起来更顺；Vue 模板根本写不出 `<c-input.text-area>` | **全部拆为平铺独立顶层组件**：`Textarea` / `ButtonGroup` / `CheckableTag` / `ImagePreviewGroup` / `AvatarGroup` / `BadgeRibbon` / `CardMeta` / `ListItemMeta` / `TableColumn` / `DirectoryTree` / `DropdownButton` / `SkeletonButton` / `FormErrorList` / `StatisticTimer` / `ErrorBoundary` / `SpaceCompact`。模板用 `<c-textarea>`，TSX 用 `import { Textarea }`，**禁止 `Input.TextArea = Textarea` 静态属性挂载**。范例：现有 `Form / FormItem / FormList / FormProvider` 平铺导出。详见 Tier L-2 表。 |
| **静态常量命名空间**（`Cascader.SHOW_CHILD` / `TreeSelect.SHOW_PARENT` / `Upload.LIST_IGNORE` 等） | React 把常量挂在组件上做命名空间 | **改顶层 export**：`CASCADER_SHOW_CHILD` / `TREE_SELECT_SHOW_PARENT` / `UPLOAD_LIST_IGNORE` 从 `vue3-ccui` 顶层导出 |
| `Modal.useModal()` 返回的 `[modal, contextHolder]` 二元组 | React Hook + JSX 单一 contextHolder | ccui 改成 `useModal()` composable 返回 `{ modal, holder }`，`holder` 是 Vue 组件，模板写 `<component :is="holder" />`，或直接挂 `<c-modal-host>` 单例 |
| `App` 组件（包裹全局 message/notification/modal 上下文） | React 没有 `app.use()` 这种全局插件机制 | **不做**，Vue 通过 `app.use(ccui)` 自然挂载全局命令式 API，这一点 components-diff.md 已记录为"设计排除项" |
| `errorBoundary`（Alert.ErrorBoundary） | React 错误边界组件 | ccui 用 `onErrorCaptured` 实现的 Vue 包裹组件 `ErrorBoundary`（顶层组件，不挂到 Alert），行为对齐 |
| `getContainer: () => HTMLElement` | React Portal 容器函数 | ccui 已有 `appendToBody` boolean；这里**接 Ant 的 `getContainer` 函数签名**（更灵活），保留 `appendToBody` 别名 |
| `keepAlive` / `forceRender` / `destroyOnHidden` 这类显式生命周期标志 | React 没有 KeepAlive，需要手动控制 mount | Vue 用 `<KeepAlive>` 已提供。ccui 接同名 prop 时**对齐语义**（destroyOnHidden 改 v-if，forceRender 等价于 keepAlive=true），不照搬实现 |

### 二、要"翻译"的事（同心智，不同 API 形状）

| Ant React 写法 | ccui Vue 化写法 |
| --- | --- |
| `value={x}` + `onChange={fn}` | `v-model:value="x"` 或更语义化的 `v-model:<name>` |
| `defaultValue` | `default-value` 同名保留 |
| `open` + `onOpenChange` | `v-model:open` + 兼容 `update:open` 事件 |
| `<Button icon={<Icon />}>` | `<c-button>` + `icon` slot 或 `icon` prop（字符串 Iconify name） |
| `closable={{ closeIcon, disabled, ariaLabel }}` 复合对象 | 同形 object 接收 + 单独 `closeIcon` slot 兜底 |
| `footer={null}` / `footer={vnode}` | `footer` slot；prop 接受 `null \| VNode`；保留 `hideFooter` 别名 |
| `addonBefore` / `addonAfter` ReactNode | `addon-before` / `addon-after` slot；prop 仍接 string 兼容旧 `prepend`/`append` |
| `loading={{ delay, icon }}` | 同形 object 接收，`icon` 部分接 slot 或 string |
| `Form.useForm()` 命令式 form 实例 | **可选**：保留 `<c-form ref="formRef" />` + `formRef.value.validate()` 主路径；只在确实需要"游离 form 实例"（如多 form 间 hot-swap）时再做 `useForm()` composable |
| `tagsDraggable` / `optionRender` / `tagRender` / `cellRender` 等 render props | 全部 slot，命名按 ccui 惯例 |

### 三、要保留的对标项（语言无关）

- **视觉 token / 主题算法**：colorPrimary / control-outline / border-radius / motion-duration 等，对齐 Ant v6 SeedToken/MapToken（已完成，见 design-audit）。
- **`variant: 'outlined' \| 'filled' \| 'borderless' \| 'underlined'`** —— 视觉变体，跟语言无关。
- **`classNames` / `styles` 语义化 DOM 钩子** —— Vue 也可以接受 `{ root, popup, item }` 形式的 object，是结构化定制方案，跟 React 没绑死。
- **`status: 'error' \| 'warning'`** —— 状态语义。
- **图标钩子 `prefix` / `suffixIcon` / `clearIcon` / `loadingIcon` / `removeIcon` / `expandIcon`** —— 接 string（Iconify name） / slot / VNode 三态。
- **命令式 API** `Modal.confirm` / `message.info` / `notification.open` —— 跟语言无关，纯函数调用。
- **静态/常量导出** 如 `Cascader.SHOW_PARENT` / `TreeSelect.SHOW_ALL` —— 模块级常量，跟语言无关。
- **子组件命名** `Input.TextArea` / `Tag.CheckableTag` / `Image.PreviewGroup` —— Vue 同样可以挂静态属性，迁移成本低。

### 四、判断准则（新任务进来时怎么定位）

1. **要解决的用户痛点是不是 React 框架特有的？** 是 → 不做（如 forwardRef / shouldUpdate）。
2. **API 形状能不能用 v-model / slot / composable 等价表达？** 能 → 翻译成 Vue 习惯（render prop → slot 是主要动作）。
3. **概念是不是跨语言通用？** 是 → 直接对齐（如 variant / status / classNames）。
4. **是不是 Ant 已经废弃的 API？** 是 → 跳过（如 `bordered` 改 `variant`、`message` 改 `title`、`dataSource` 改 `options`），ccui 不背包袱。

---

## 总览（按优先级建议执行序）

1. **先做 Tier S（机械修复 6 项）** —— 一次性消灭已发现的代码 bug 与命名漂移，零设计开销。
2. **再做 Tier M-A（跨组件横向 5 批）** —— 一次性给 50+ 组件补 v5/v6 通用能力，性价比最高。
3. **接着做 Tier L-1（基础组件 Ant 别名层）** —— 让 Button / Input / Modal / Tooltip 系从 Element Plus 风格切到 Ant 风格，保留旧名做 deprecated，是迁移用户体验的拐点。
4. **再做 Tier L-2 / L-3（缺失子组件 + 命令式 / Hook API）** —— 把 30 项点号导出补齐。
5. **Tier M-B（单组件长尾 95→100%）** 与 Tier L-4（文档示例补齐）随上述节奏并行推进。
6. **Tier XL** 留在最后，是 breaking 演进，需要专门预留时间窗口。

---

## Tier S — 机械修复（6 项，每项 <1 天，单批可合并提交）

| ID | 范围 | 文件 / 行 | 验收条件 | 状态 |
| --- | --- | --- | --- | --- |
| S-01 | Radio.types `String \|\| Number` truthy 表达式 → 接收 number 失败 | `packages/ccui/ui/radio/src/radio-types.ts:12,33` | 改为 `type: [String, Number] as PropType<string \| number>`；补 `<c-radio :value="1">` 测试 | [x] |
| S-02 | InputNumber size 字面值 `lg/md/sm` 与库内其他组件 `large/default/small` 不一致 | `packages/ccui/ui/input-number/src/input-number-types.ts` | size 接受 `'large' \| 'default' \| 'small'`；旧值 `'lg'/'md'/'sm'` 加 runtime warn 并 fallback；docs 同步 | [x] |
| S-03 | ColorPicker `format: 'hsv'` 与 ant `'hsb'` 字面值差异 | `packages/ccui/ui/color-picker/src/color-picker-types.ts` | format 接受 `'hex' \| 'rgb' \| 'hsb'`；旧 `'hsv'` runtime alias 并 deprecated | [x] |
| S-04 | Switch `size: 'default'` ↔ ant `'medium'` 命名分歧 | `packages/ccui/ui/switch/src/switch-types.ts` | size 接受两者，`'medium'` 为推荐 | [x] |
| S-05 | Slider 缺 `onChangeComplete`（mouseup/keyup 触发，Form 联动场景必备） | `packages/ccui/ui/slider/src/slider.tsx` | 新增 emit `change-complete`，参数为最终值；定向测试覆盖鼠标抬起 / 键盘释放 / 拖到 disabled 区域 | [x] |
| S-06 | Tag `bordered` 已被 ant deprecated → `variant: 'filled' \| 'solid' \| 'outlined'` | `packages/ccui/ui/tag/src/tag-types.ts` | 加 `variant` prop（默认 `'outlined'`）；`bordered={false}` runtime alias 到 `variant='filled'`；docs 加 variant 演示 | [x] |

**单批合并建议**：S-01 至 S-06 一个 commit 收口，PR 标题 `fix(types): Batch 41-S 机械修复 6 项`。

**✅ 已交付（2026-05-14）**：6 项全部落地，1416 → 1421 测试（+5）。要点：

- Radio 把 `_label = \`${props.label}\`` 强制 stringify 去掉，保留 number 原类型；`BeforeChangeType` 与 `RadioGroupInjection.modelValue` 同步放宽为 `string | number`。
- InputNumber 用 `normalizedSize` computed 收口，类与 SCSS 用规范名（`--large` / `--small`），旧值 `lg/md/sm` 进来 dev warn 一次后映射；测试改用规范名，补一条 deprecated 兼容测试。
- ColorPicker `format='hsb'` 新增（输出 `hsb(h, s%, b%)`，与 ant 一致），旧 `'hsv'` runtime warn 一次后仍输出 `hsv(...)` 兼容历史断言。
- Switch 类型放宽到 `'default' | 'medium' | 'small'`，渲染逻辑不变（只在 `'small'` 时加 modifier）。
- Slider `change-complete` emit 与 `change` 同点位同步触发（alias 关系，方便后续拆分 every-tick vs interaction-end）。**顺手发现历史 bug**：`emit('change', currentValue.value)` 中 `currentValue` 是 computed getter 读回 `props.modelValue`，单挂载场景下永远是旧值——不在本批次修，留 M-B 单组件长尾处理。
- Tag 新增 `variant: 'outlined' | 'filled' | 'solid'` prop + `effectiveVariant` computed（显式 `variant` > `bordered=false` → `'filled'` > 默认 `'outlined'`）；输出类同时包含 `--variant-xxx` 与兼容旧的 `--borderless`（非 outlined 时）。`bordered` 在 JSDoc 加 @deprecated 标记。

---

## Tier M-A — 跨组件横向 v5/v6 通用能力（5 批，每批 2–3 天）

> 这 5 批是「一次写完所有录入组件的同一类 prop」，性价比远高于继续推单组件长尾。

| Batch | 范围 | 影响组件 | 预估测试增量 | 验收条件 | 状态 |
| --- | --- | --- | --- | --- | --- |
| M-A1 | `variant: 'outlined' \| 'filled' \| 'borderless' \| 'underlined'`（v5.13.0+） | Input / InputNumber / Select / Cascader / AutoComplete / Mentions / DatePicker / RangePicker / TimePicker / TreeSelect / ColorPicker / Textarea（如有）共 12 个 | +24 | 每组件 4 种 variant 视觉对齐 Ant；提供 demo「Variants」一节 | [ ] |
| M-A2 | `classNames` / `styles` 语义化 DOM 钩子（v5.18.0+） | 录入 12 + 展示 8（Table / Avatar / Badge / Card / List / Image / Tree / Calendar）+ 反馈 5（Modal / Drawer / Alert / Notification / Message）共 25 个 | +25 | 每组件至少 3 个语义化区域（root / popup.root / popup.listItem 等）可独立 className 注入 | [ ] |
| M-A3 | `status: 'error' \| 'warning'` 拉齐 | 8 个未接入的录入（Input / InputNumber / DatePicker / RangePicker / TimePicker / Mentions / AutoComplete / TreeSelect）+ Form item 联动检查 | +16 | status='error' / 'warning' 时边框、阴影、图标对齐；Form 校验失败自动透传 | [ ] |
| M-A4 | `prefix` / `suffixIcon` / `allowClear={ clearIcon }` / `loadingIcon` / `removeIcon` / `expandIcon` 自定义图标钩子（Vue：prop 接 string Iconify name；同名 slot 高优先级） | 10 个录入 | +20 | 每个图标钩子同时支持 prop 形式（string / VNode）与同名 slot；slot 优先级高于 prop | [ ] |
| M-A5 | 命名差异统一表（21 项）加 Ant 别名层，旧名 deprecated | Button / Input / Modal / Drawer / Tooltip / Popover / Popconfirm / Form 7 个 | +30 | `open` ↔ `visible`、`title` ↔ `content`、`htmlType` ↔ `nativeType`、`addonBefore/After` ↔ `prepend/append`、`mouseEnterDelay/LeaveDelay` ↔ `showAfter/hideAfter` 等同时支持，旧名 runtime warn 一次 | [ ] |

**单批合并建议**：每批一个 commit。M-A1 是最大头，建议先做。

---

## Tier M-B — 单组件长尾 95→100%（10 批，每批 2–3 天）

| Batch | 组件 | 当前 → 目标 | 剩余项（来自 components-diff §6.3 + per-component） | 状态 |
| --- | --- | --- | --- | --- |
| M-B1 | DatePicker | 95 → 100 | `cell` slot（替代 ant `cellRender`） / `minDate` / `maxDate` / `extra-footer` slot（替代 `renderExtraFooter`） / `showToday` / `disabledTime` / 完整键盘导航 / `multiple`（v6） | [ ] |
| M-B2 | RangePicker | 95 → 100 | `allowEmpty: [boolean, boolean]` / `disabled: [boolean, boolean]` / `separator`（v6.3） / 响应式单面板 / preset 高亮当前命中 | [ ] |
| M-B3 | TimePicker | 95 → 100 | 滚轮 snap / `TimeRangePicker` 独立组件 / `cell` slot | [ ] |
| M-B4 | Cascader | 95 → 100 | `showCheckedStrategy`（导出常量 `Cascader.SHOW_CHILD` / `SHOW_PARENT`） / `maxTagCount` + `max-tag-placeholder` slot + `maxTagTextLength` / 键盘导航 / `option` slot（替代 `optionRender`） / `popup` slot（替代 `popupRender`） / showSearch 对象 `limit`/`matchInputWidth`/`render`/`sort`（`render` 翻成 `searchOption` slot） | [ ] |
| M-B5 | TreeSelect | 80 → 95 | `showSearch` 完整 / `loadData` / `showCheckedStrategy`（常量同上） / 键盘导航 / 半选 `v-model:halfCheckedKeys` | [ ] |
| M-B6 | ColorPicker | 95 → 100 | `presets` 预设色板 / `destroyOnHidden`（v5.25，对应 Vue `v-if` 语义） / EyeDropper API / `panel` slot（替代 `panelRender`） | [ ] |
| M-B7 | Carousel | 95 → 100 | `adaptiveHeight` / `slidesToShow` / `slidesToScroll` / `responsive` 配置 / `pauseOnFocus` / `pauseOnHover` / `pauseOnDotsHover` / `waitForAnimate` / `dotPlacement` 别名 | [ ] |
| M-B8 | Transfer | 95 → 100 | 虚拟滚动 / RTL / `selections-icon` slot（替代 `selectionsIcon` render prop） | [ ] |
| M-B9 | Upload | 95 → 100 | `listType='picture-card'` 完整样式 / chunk 分片 / `Upload.Dragger` 独立子组件 / `Upload.LIST_IGNORE` 常量 | [ ] |
| M-B10 | Tour | 95 → 100 | `gap` / `indicators` slot（替代 `indicatorsRender`） / `actions` slot（替代 `actionsRender`） / `cover` 演示 / `disabledInteraction` / per-step `nextButtonProps` / `prevButtonProps` / Vue 风格事件（`@step-change` / `@finish`，async 用 `await emit` 模式而非 React async hook） | [ ] |

---

## Tier L-1 — 基础组件 Ant 别名层（每批 3–5 天，与 M-A5 互补）

> M-A5 只加 prop 别名（不改行为），这里是把 Element Plus 风格 API 真正"加上 Ant 完整能力"。

| Batch | 组件 | 待补 props / 行为 | 状态 |
| --- | --- | --- | --- |
| L-1.1 | Button | `block` / `ghost` / `danger` / `href`/`target`（自动 render 成 `<a>`） / `shape='circle' \| 'round'` / `htmlType`（保留 `nativeType` 兼容） / `loading={ delay, icon }`（`icon` 接 string 或 `loading-icon` slot） / `color` / `variant`（v5.21）/ `iconPosition: 'start' \| 'end'` / `autoInsertSpace`（v5.17，CJK 字符间插空格） | [x] |
| L-1.2 | Input | `addon-before` / `addon-after` slot（保留 `prepend`/`append` string 兼容） / `prefix` slot / `suffix` slot / `allowClear: bool \| { clearIcon }`（`clearIcon` 也可走 slot） / `show-count` 自带计数 + `{ formatter }` slot / `maxLength` / `status` / `@press-enter` 事件（替代 `onPressEnter` 回调） / `defaultValue` 与 `v-model:value` 并存 | [x] |
| L-1.3 | Modal | `v-model:open` 受控 + `visible` deprecated（保留兼容） / `footer` slot（支持 string \| VNode \| null） / `closable: bool \| { closeIcon, disabled, ariaLabel }` 复合（closeIcon 同时支持 slot） / `@after-open-change` 事件 / `keep-alive` prop（替代 ant `forceRender`，对接 Vue `<KeepAlive>`） / `modal` slot（替代 `modalRender`） / `wrap-class-name` / `keyboard` 别名 `close-on-esc` / `transitionName` / `maskTransitionName` / `focusTriggerAfterClose` | [x] |
| L-1.4 | Drawer | `v-model:open` 别名 / `extra` slot / `loading`（v5.17） / `footer` slot / `@after-open-change` / `keep-alive` prop（替代 `forceRender`） / `push`（嵌套抽屉，含 `distance` 自动让位距离） | [x] |
| L-1.5 | Tooltip / Popover / Popconfirm | `title` slot + 别名 `content`（保留 ccui 旧名） / `color` 别名 `effect` 字符串 → 颜色字面量同时支持 / `mouse-enter-delay` 别名 `show-after` / `mouse-leave-delay` 别名 `hide-after` / `get-popup-container: (trigger) => HTMLElement`（保留 `append-to-body` 别名） / `destroy-tooltip-on-hide` / `arrow: bool \| { pointAtCenter }` / `fresh` / `align` 对象 / `auto-adjust-overflow` / `overlay-class-name` 别名 `popper-class` | [x] |
| L-1.6 | Form | `name` 别名（保留 ccui `prop`） / `colon` / `label-col` / `wrapper-col` 栅格对象 / `hasFeedback` / `warningOnly` / Rule 接受函数式 `(form) => Rule \| Rule[]` / `validateDebounce` / **不做** `valuePropName` / `getValueFromEvent` / `getValueProps` / `shouldUpdate`（Vue v-model + 响应式已替代） | [x] |

**✅ L-2.2 已交付（2026-05-14）**：1574 → 1604 测试（+30）。Tier L-2 搜索框（对标 ant `Input.Search`）。要点：

- **新建 `packages/ccui/ui/input-search/`**（与 input / textarea 同级），平铺独立组件：`<c-input-search>` 模板 / `import { InputSearch }` TSX。**不挂 Input.Search 静态属性**（贯彻 L-2 表头约定）。
- **`enterButton: boolean \| string \| VNode`**：`false` 默认 → 仅在 suffix 显示放大镜（点击触发 search）；`true` → 渲染默认按钮含放大镜图标（icon-only modifier）；`string` → 按钮文字；`VNode` → 自定义按钮内容；**`enter-button` slot 优先级最高**，完全自定义按钮内容（含放大镜替换）。
- **`loading: boolean`**：旋转 loading 图标（纯 CSS keyframes `ccui-input-search-rotate`，避免 IconifyIcon 依赖）。有按钮时替换按钮内的放大镜；无按钮时替换 suffix 的放大镜。loading 时按钮 disabled 且不触发 search。
- **`@search` 事件**：`(value, event?)` payload。触发场景：点击 enterButton / 点击 suffix 内联放大镜 / 按 Enter / 点击清除按钮（emit `search('', undefined)`，对齐 ant 行为）。disabled / loading 时不触发。
- **`press-enter` 同时触发**：Enter 既 emit `press-enter` 又 emit `search`，两者共存。
- **复用 inputProps**：通过 `...inputProps` spread，size / placeholder / disabled / readonly / allowClear / maxLength / status / defaultValue 全部继承。type 仅识别 password / text。
- **渲染采用 `h()` 而非 JSX**：jsx 文件名保留 .tsx，但内部用 `h(Fragment, ...)` 等渲染。原因：根 vite.config.ts 不带 vueJsx 插件，从根目录跑 vp 时 import-analysis 阶段会因 `jsx: preserve` 在 oxc 阶段失败；切到 `packages/ccui/` 跑则使用包内 vite config 的 `@vitejs/plugin-vue-jsx` 正常。`h()` 不触发该问题。**测试入口需 `cd packages/ccui && vp test`**。
- **`allowClear` / `prefix` / `suffix` slot**：与 Input 一致。allowClear 显示清除按钮（×），点击清空并 emit `search('')`。prefix slot 放左侧；suffix slot 与放大镜/loading 共存于右侧。
- **SCSS `--with-button` modifier**：有按钮时 input-wrap 右边圆角去掉、border-right 去掉，与按钮无缝拼接；按钮左边圆角去掉，右边保留 border-radius。
- **顶层注册**：`packages/ccui/ui/vue-ccui.ts` 加 `InputSearchInstall` import + installs 数组 + InputSearch export。
- 测试 30 条：基本渲染 5 / v-model+defaultValue 5 / enterButton 5（false/true/string/slot 优先级/--with-button） / @search 6（按钮 click / Enter / suffix 放大镜 / disabled / loading / clear→search('')） / loading 2 / status 2 / allowClear 4 / prefix+suffix slot 2。

**✅ L-2.1 已交付（2026-05-14）**：1540 → 1574 测试（+34）。Tier L-2 第一件，**Vue 平铺独立顶层组件**示范。要点：

- **新建 `packages/ccui/ui/textarea/`** 目录（与 input 同级），平铺独立组件：`<c-textarea>` 模板 / `import { Textarea }` TSX。**不挂 Input.TextArea 静态属性**（贯彻 L-2 表头约定）。
- **`autoSize` 复合**：`false` 走原生 `rows` / `true` 高度跟随内容 / `{ minRows, maxRows }` 限制最小最大行数。实现用 `measureRowsHeight()`（读 `getComputedStyle` 拿 line-height + padding + border，避免硬编码）+ `el.style.height = 'auto'` → `scrollHeight` 再 clamp。autoSize 开启时强制 `resize: none`（CSS 维度）+ `el.style.overflowY` 控制是否出滚动条。
- **`allowClear` 复合**：`bool \| { clearIcon }`，clearIcon 接 string（Iconify name 自动识别）/ VNode；与 Input 完全对齐。disabled / readonly 时不显示清除按钮。
- **`showCount` 复合**：`bool \| { formatter }`，formatter 接 `({ value, count, maxLength }) => string`；默认 `N / max` 或 `N`。
- **`status: 'error' \| 'warning'`**：与 Input 对齐，SCSS `--status-error` / `--status-warning` 边框 + control-outline 光环。
- **`press-enter` 事件**：Enter（不含 Shift/Ctrl/Alt/Meta）触发；Shift+Enter 保留换行不触发。
- **`defaultValue` 非受控初值**：与 Input 对齐，首次挂载从 defaultValue 取，之后忽略；与 v-model:value 并存。
- **`resize` prop**：原生 textarea CSS resize 透传；autoSize=true 时强制 'none' 覆盖。
- **`suffix` slot**：textarea 下方追加内容（不同于 input 的右侧）。
- **`size: 'large' \| 'default' \| 'small'`**：与 Input 对齐。
- **顶层注册**：`packages/ccui/ui/vue-ccui.ts` 加 `TextareaInstall` import + installs 数组 + Textarea export；**顺手补 L-1.1 漏掉的 `ButtonGroup` 顶层 export**。
- 测试 34 条：基本渲染 6 / v-model+defaultValue 5 / focus+blur 1 / press-enter 3 / allowClear 6 / showCount+maxLength 4 / status 2 / autoSize 3 / size 2 / suffix slot 1。jsdom 限制下 autoSize 实际高度变化不测，仅测 resize:none 切换。

**✅ L-1.6 已交付（2026-05-14）**：1530 → 1540 测试（+10）。Tier L-1 收官（6/6 全部完成）。要点：

- **`labelCol` / `wrapperCol` 24 栅格**：FormItem 显式优先于 Form 级；`labelCol.span` 按 `(span/24)*100%` 换算成 `width`；`offset` → `margin-inline-start`；`flex` 字符串/数字透传。labelCol 优先级高于旧 `labelWidth`。
- **`hasFeedback` 校验状态图标**：FormItem 显式 > Form 级；图标随 `currentStatus` 切（`✓` success / `✕` error / `!` warning / `◌` validating 旋转）；位置 `absolute` 贴右内边距，input 自动 `padding-inline-end: 28px` 让位。
- **`warningOnly` 降级校验**：Rule 加 `warningOnly: boolean`；失败时 FormItem 状态降级为 `'warning'`（新增到 `FormValidateStatus` union），消息正常显示但**不阻塞 form-level submit**（field.validate() 返回 true）；新增 `warningState` ref 与 `currentStatus` computed 联动。
- **rules 函数式**：FormItem `rules` 类型扩为 `FormRule \| FormRule[] \| ((model) => FormRule \| FormRule[])`；mergedRules 解析时若是函数，传入当前 `form.model.value` 调用。
- **FormItem 渲染结构调整**：`__content` 内新增 `__control` 包装容器（hasFeedback 时挂 `--has-feedback`），用于绝对定位 feedback 图标；旧测试无破坏。
- **`shouldUpdate` 标 @deprecated**：JSDoc 说明 React-only 渲染优化原语，Vue 响应式已处理，新代码不建议使用；prop 保留兼容。
- **明示不做**：`valuePropName` / `getValueFromEvent` / `getValueProps`（v-model 已统一协议，详见 roadmap 「对标原则」节）。
- 测试：labelCol/wrapperCol 5 / hasFeedback 3 / warningOnly 1 / rules 函数式 1 = +10。

**✅ L-1.5 已交付（2026-05-14）**：1510 → 1530 测试（+20）。要点（Tooltip / Popover / Popconfirm 三件套同模式）：

- **Tooltip / Popover 共享**：`open` ↔ `visible`、`title` ↔ `content`（Tooltip 仅 content；Popover 已有 title=标题/content=正文双 prop，新增的是 `open` 等）、`mouseEnterDelay` ↔ `showAfter`、`mouseLeaveDelay` ↔ `hideAfter`、`overlayClassName` ↔ `popperClass`、`arrow: bool \| { pointAtCenter }` ↔ `showArrow`、`getPopupContainer: (trigger) => HTMLElement \| null` ↔ `teleported`（Popover）/ 同名（Tooltip）、新 props `color`（覆盖 effect 内置背景）、`fresh`、`destroyTooltipOnHide`、`autoAdjustOverflow`（接 floating-ui flip middleware）、`align` 对象。
- **delay 单位**：保留 ccui 原 ms 口径（ant 文档单位是秒，但 ccui 仓库其他组件 loading delay / showAfter 都是 ms，统一比迁移到秒更稳）。文档侧后续在 v2.0 升级指南说明。
- **arrow 复合**：`pointAtCenter=true` 加 `--arrow-center` modifier class（实际 ant 风格的 SCSS 留 v2.x 接入）。
- **color 内置背景覆盖**：`color` 设置时给 popper 加 inline `background-color`，与 `effect='dark' \| 'light'` 互补。
- **Popconfirm**：`open` ↔ `visible`、`okText` ↔ `confirmText`、`okType` ↔ `confirmType`；内部转发到 Popover；`update:open` 与 `update:visible` 双 emit。
- **emit 双 update**：`update:open` 与 `update:visible` 同步触发，方便用户从 v-model:visible 渐进迁到 v-model:open。
- **getPopupContainer 在 Popover**：接收函数返回容器节点；返回 null 时不 Teleport（同 `teleported=false`）。
- **autoAdjustOverflow=false** 时 floating-ui 不再加 flip middleware，禁止自动翻转方向。
- 测试：Tooltip +8 / Popover +7 / Popconfirm +5 = +20。

**✅ L-1.4 已交付（2026-05-14）**：1489 → 1510 测试（+21）。要点：

- **Ant 主名 + 旧名双源**：`open` ↔ `visible`、`keyboard` ↔ `closeOnEsc`、`getContainer` ↔ `appendToBody`，与 Modal 保持一致命名约定。
- **复合 closable**：与 Modal 同形（`bool | { closeIcon, disabled, ariaLabel }` + `close-icon` slot 高优先级）。
- **新增 props**：`extra` slot（头部右侧操作区） / `loading: boolean`（v5.17，渲染 3 行骨架占位 + `aria-busy="true"`，body 区被替换） / `footer: string \| VNode \| null \| undefined` + `footer` slot / `keep-alive`（与 Modal 同语义） / `after-open-change` 事件 / `focusTriggerAfterClose`（默认 true）。
- **`push` 嵌套抽屉**（重点）：父抽屉通过 `provide(drawerParentInjectionKey)` 暴露 `register/unregister`；子抽屉 inject 后在 `watch(isOpen, immediate)` 里通知父亲计数；父抽屉根据 `activeChildCount > 0 && pushEnabled` 计算 `pushTransform`，按 placement 反向位移 `distance` px（默认 180）。**push 在父端决定**（与 ant 一致：`push=false` 设在父抽屉表示"我不让位"）；子抽屉无条件 register，父抽屉 gate；卸载时主动 unregister 避免泄漏。
- **SCSS 新增**：`__extra`（inline-flex，margin-inline-start 8px） / `__content` transition transform（让 push 让位动起来） / `__skeleton`（3 行 shimmer 动画，1.4s ease infinite） / `@keyframes ccui-drawer-skeleton`。

**✅ L-1.3 已交付（2026-05-14）**：1469 → 1489 测试（+20）。要点：

- **Ant 主名 + 旧名双源**：`open` ↔ `visible`（`v-model:open` 工作，关闭时同时 emit `update:open` + `update:visible`）、`keyboard` ↔ `closeOnEsc`、`confirmLoading` ↔ `okLoading`、`getContainer: (trigger) => HTMLElement \| null` ↔ `appendToBody` boolean。
- **`closable` 复合配置**：`bool \| { closeIcon, disabled, ariaLabel }`；`disabled=true` 时按钮渲染但 click 无效；`ariaLabel` 透传到 `aria-label`；`closeIcon` 接 string（Iconify 自动识别）/ VNode；`close-icon` slot 优先级高于 prop。
- **`footer` 新接口**：`string \| VNode \| null \| undefined`；`null` 等价旧 `hideFooter=true`；`string`/VNode 直接渲染；`undefined` 走内置 ok/cancel；**`footer` slot 优先级最高**（保留 `{ ok, cancel }` scoped 参数）。
- **`after-open-change` 事件**：immediate watch 触发首次 false，open 切换时各触发一次。
- **`keep-alive` prop**：Vue 化等价 ant `forceRender`；true 时即使未打开也渲染外层 DOM，关闭后保留；与 `destroyOnClose` 互斥（keep-alive 胜出）。
- **`wrap-class-name`**：透传到根节点 class。
- **`transitionName` / `maskTransitionName`**：自定义 Transition 名（空字符串走内置 `-zoom` / `-mask-fade`）。
- **`focusTriggerAfterClose`**：默认 true；打开时 `document.activeElement` 捕获到 `trigger` ref，关闭 `onAfterLeave` 时 `.focus({ preventScroll: true })` 还原；触发节点已脱离 DOM 时跳过。
- **挂载容器决策**：`getContainer` 显式 > 旧 `appendToBody=true` Teleport→body > false 内联渲染。

**✅ L-1.2 已交付（2026-05-14）**：1450 → 1469 测试（+19）。要点：

- **Ant 主名 + ccui 旧名双源接入**：`allowClear` ↔ `clearable`、`addonBefore`/`addonAfter` ↔ `prepend`/`append`、显式 Ant 主名优先；旧 prop JSDoc 加 `@deprecated`。
- **复合配置接收**：`allowClear: bool | { clearIcon }` —— clearIcon 接 string（Iconify name 自动识别） / VNode；`showCount: bool | { formatter }` —— formatter 接 `({ value, count, maxLength }) => string`。
- **新增独立 props**：`maxLength`（透传原生 `maxlength`） / `showCount` 字符计数（自动 `N / max` 格式或自定义） / `status: 'error' | 'warning'`（与 Form 联动 + SCSS `--status-error` / `--status-warning` 边框与 focus 光环） / `defaultValue` 非受控初值（首次挂载从 defaultValue 取值，之后忽略；与 `v-model:value` 并存）。
- **slot 主名化**：`addon-before` / `addon-after` / `prefix` / `suffix` 全部走 slot；slot 优先级 > prop string。
- **新事件 `press-enter`**：对齐 ant `onPressEnter`，Enter 键按下时触发，payload 为原生 KeyboardEvent。
- **SCSS 新增**：`--status-error` / `--status-warning` 双状态边框 + control-outline 光环；`__count` 字符计数样式（fontSize=sm，text-tertiary 色）。

**✅ L-1.1 已交付（2026-05-14）**：1421 → 1450 测试（+29）。要点：

- **新 props 全套接入**：`shape: 'default' \| 'circle' \| 'round'` / `htmlType` / `danger` / `ghost` / `block` / `href` / `target` / `iconPosition` / `autoInsertSpace`（默认 true，与 Ant v5.17+ 对齐）/ `loading: boolean \| { delay, icon }` / `color` / `variant`（v5.21+ 占位，SCSS 矩阵留 v2.x）。
- **type 取值扩展**：联合保留 `'primary'/'success'/'warning'/'danger'/'info'/'text'`（ccui 旧）+ 新增 `'default'/'dashed'/'link'`（Ant）；SCSS 加 `--default` / `--dashed`（虚线边框）/ `--link`（纯文字 + 主色 + hover 下划线）。
- **deprecated 兼容**：`round`/`circle` boolean → 解析时让位给显式 `shape`；`nativeType` 让位给 `htmlType`；`plain` 保留行为不变；旧值进来不 warn（值集合扩展，与 S-tier 那种字面值替换不同）。
- **href 渲染**：`href` 设置时整个组件用 `<a role="button">` 替代 `<button>`，disabled 时去 href + 加 aria-disabled + tabindex=-1；target 透传。
- **`Button.Group` 子组件新建**（`packages/ccui/ui/button/src/button-group.{tsx,scss}`），通过 `provide(buttonGroupInjectionKey, {size,disabled})` 给子按钮注入；子按钮显式 prop 仍优先。SCSS 相邻按钮 `border-radius: 0` 让边框对齐 + `margin-inline-start: -1px` 让边框重叠。
- **autoInsertSpace 行为变更（轻量 breaking）**：默认 true，'确定' → '确 定'（CJK 2 字插空格）。旧 'dom' 测试同步更新预期；想保留紧凑写法的传 `:auto-insert-space="false"`。
- **class 命名冲突解决**：旧 `type='danger'` 与新 `danger=true` boolean 都产生 `--danger` 类时 object literal 同 key 后者覆盖前者。新 `danger=true` 改用 `--dangerous` 类（与 Ant `.ant-btn-dangerous` 对齐），二者可并存。SCSS `&--dangerous.ccui-button--primary` 复现 ant 的红色实色组合。
- **loading delay**：watch props.loading → 若对象形带 delay 用 setTimeout 推迟翻 true；unmount + 切回 false 时清理定时器；测试用 vitest fake timers 验证。
- **静态导出**：`Button.Group` 挂到 Button 命名空间（`<Button.Group>` Vue tsx 写法可用），同时独立导出 `ButtonGroup` 供 `<c-button-group>` 模板使用。

---

## Tier L-2 — 缺失子组件 / 配套组件（每批 3–5 天，按优先级排）

> **重要约定（来自 memory `feedback_vue_first_benchmark.md`）**：Ant Design React 的 `Component.SubName` 静态属性命名空间一律不照搬，**全部拆为平铺独立顶层组件**。
> - 模板用 kebab-case：`<c-textarea>` / `<c-input-search>` / `<c-checkable-tag>` / `<c-button-group>`
> - TSX 用 PascalCase 平铺 import：`import { Textarea, InputSearch, CheckableTag, ButtonGroup } from 'vue3-ccui'`
> - **禁止挂静态属性**（`Input.TextArea = Textarea` 这种 React 习惯）。范例：现有的 `Form / FormItem / FormList / FormProvider` 都是平铺导出。
> - 静态常量同理：`Cascader.SHOW_CHILD` → 顶层 `CASCADER_SHOW_CHILD`。

| Batch | Vue 顶层组件 / 常量 | 对标 ant 名 | 关键能力 | 状态 |
| --- | --- | --- | --- | --- |
| L-2.1 | `Textarea`（`<c-textarea>`） | `Input.TextArea` | 多行文本：`autoSize: bool \| { minRows, maxRows }` / `showCount` / `allowClear` / `count` / `maxLength`；底层 `<textarea>` | [x] |
| L-2.2 | `InputSearch`（`<c-input-search>`） | `Input.Search` | 搜索框：`enterButton: bool \| string \| VNode` / `loading` / `@search` 事件 / `addon-after` slot | [x] |
| L-2.3 | （可选）`InputPassword`（`<c-input-password>`） | `Input.Password` | 密码框：`iconRender` slot / `visibilityToggle: bool \| { visible, onVisibleChange }`。**仅在差异化能力超出现有 `<c-input type="password" show-password>` 时才拆独立组件** | [—] |
| L-2.4 | `InputOtp`（`<c-input-otp>`） | `Input.OTP`（v5.18+） | 一次性密码：`length` / `formatter` / `mask` / `@change(value, { index })` | [ ] |
| L-2.5 | `ButtonGroup`（`<c-button-group>`） | `Button.Group` | 按钮组：`size` / `disabled` 透传。**已交付（L-1.1）**，但 `Button.Group = ButtonGroup` 静态属性挂载需移除（React 习惯，Vue 不需要） | [~] |
| L-2.6 | `CheckableTag` / `CheckableTagGroup`（`<c-checkable-tag>` / `<c-checkable-tag-group>`） | `Tag.CheckableTag` | 可勾选标签：`v-model:checked` / 多选 group | [ ] |
| L-2.7 | `ImagePreviewGroup`（`<c-image-preview-group>`） | `Image.PreviewGroup` | 多图预览：`items` / `preview={ visible, onVisibleChange, current }` / 切换上一张下一张 | [ ] |
| L-2.8 | `AvatarGroup`（`<c-avatar-group>`） | `Avatar.Group` | 头像组：`maxCount` / `maxStyle` / `maxPopoverPlacement` / `maxPopoverTrigger` | [ ] |
| L-2.9 | `BadgeRibbon`（`<c-badge-ribbon>`） | `Badge.Ribbon` | 缎带徽标：`text` / `color` / `placement` | [ ] |
| L-2.10 | `CardMeta` / `CardGrid`（`<c-card-meta>` / `<c-card-grid>`） | `Card.Meta` / `Card.Grid` | 卡片元信息 + 网格 | [ ] |
| L-2.11 | `ListItemMeta`（`<c-list-item-meta>`） | `List.Item.Meta` | 列表项元信息：`avatar` slot / `title` / `description` slot | [ ] |
| L-2.12 | `TableColumn` / `TableColumnGroup` / `TableSummary`（`<c-table-column>` 等） | `Table.Column` / `Table.ColumnGroup` / `Table.Summary` | 模板式列声明（替代 `columns` 数组）+ 汇总行；Vue 模板用 v-for + 子组件描述列 | [ ] |
| L-2.13 | `DirectoryTree`（`<c-directory-tree>`） | `Tree.DirectoryTree` | 目录树：默认展开 / 文件图标 | [ ] |
| L-2.14 | `DropdownButton`（`<c-dropdown-button>`） | `Dropdown.Button` | 下拉按钮：`menu` / `buttons-render` slot / 主按钮 + dropdown 双触发 | [ ] |
| L-2.15 | `SkeletonButton` / `SkeletonAvatar` / `SkeletonInput` / `SkeletonImage` / `SkeletonNode`（`<c-skeleton-button>` 等） | `Skeleton.Button` / `Skeleton.Avatar` / `Skeleton.Input` / `Skeleton.Image` / `Skeleton.Node` | Skeleton 5 形态变体 | [ ] |
| L-2.16 | `FormErrorList`（`<c-form-error-list>`） | `Form.ErrorList` | 错误列表组件，独立于 FormItem 自渲染 | [ ] |
| L-2.17 | `SubMenu` / `MenuItemGroup` / `MenuDivider`（`<c-sub-menu>` 等） | `Menu.SubMenu` / `Menu.ItemGroup` / `Menu.Divider` | **当前 ccui 已平铺**；本批仅文档表述对齐（确认导出 + 写明 `<c-sub-menu>` 用法） | [ ] |
| L-2.18 | `StatisticTimer`（`<c-statistic-timer>`） | `Statistic.Timer`（v5.25+） | 计时器（替代 Countdown） | [ ] |
| L-2.19 | Calendar 加 `header` slot + `headerRender` 用 slot 替换 | `Calendar.Header` + `headerRender` | **不拆顶层组件**，Calendar 内部新增 `header` slot（Vue 化 ant render prop） | [ ] |
| L-2.20 | `ErrorBoundary`（`<c-error-boundary>`） | `Alert.ErrorBoundary` | 错误边界，Vue 内部用 `onErrorCaptured` 实现；**不挂到 Alert** | [ ] |
| L-2.21 | Layout 内 Sider 扩 `breakpoint` / `onBreakpoint` / `zeroWidthTriggerStyle` / `reverseArrow` | `Layout.Sider.*` props | **不拆组件**，Sider 现有组件加 props；现有 `<c-sider>` 已平铺 | [ ] |
| L-2.22 | `SpaceCompact`（`<c-space-compact>`） | `Space.Compact` | 输入紧凑组合 | [ ] |
| L-2.23 | Splitter 内 SplitterPanel 加 `showCollapsibleIcon` + `orientation` 别名 | `Splitter.Panel.showCollapsibleIcon` | **不拆组件**，`<c-splitter-panel>` 已平铺；本批补 props | [ ] |
| L-2.24 | 顶层常量 `CASCADER_SHOW_CHILD` / `CASCADER_SHOW_PARENT` | `Cascader.SHOW_CHILD` / `.SHOW_PARENT` | **不挂命名空间**，从 `vue3-ccui` 顶层 export | [ ] |
| L-2.25 | 顶层常量 `TREE_SELECT_SHOW_PARENT` / `TREE_SELECT_SHOW_CHILD` / `TREE_SELECT_SHOW_ALL` | `TreeSelect.SHOW_*` | 同上，顶层 export | [ ] |

---

## Tier L-3 — 命令式 / Hook API（每批 3–5 天）

| Batch | 范围 | 用途 | 状态 |
| --- | --- | --- | --- |
| L-3.1 | `Modal.confirm` / `Modal.info` / `Modal.success` / `Modal.error` / `Modal.warning` / `Modal.destroyAll` / `Modal.update` | 命令式确认弹窗 + 静态实例（纯函数调用，跟语言无关） | [ ] |
| L-3.2 | `useModal()` composable | Vue 化：返回 `{ modal, holder }`，`holder` 是 Vue 组件，模板写 `<component :is="holder" />`；承载 confirm 系列的上下文（替代 ant `[modal, contextHolder]` 元组） | [ ] |
| L-3.3 | `useMessage()` composable | 同上，Vue composable + `<host>` 组件，不照搬 React Hook 元组返回 | [ ] |
| L-3.4 | `useNotification()` composable | 同上 | [ ] |
| L-3.5 | message / notification 通用增强：`stack` / `maxCount` / `pauseOnHover` / `role`（aria） / 多 `placement`（v5.23） / `top`/`bottom` 居中位 / `duration` 单位改秒（保留毫秒兼容） | 通知体验对齐 ant | [ ] |
| L-3.6 | `useForm()` composable（**可选**） | Vue 主路径已经是 `<c-form ref="formRef" />` + `formRef.value.validate()`，这条只在确实需要"游离 form 实例 hot-swap"等高级场景再做；不是必交付项。**默认 [—]，不阻塞 v2.0** | [—] |
| L-3.7 | `Typography.Text` / `.Title` / `.Paragraph` / `.Link` 的 `copyable` / `editable` / `ellipsis` 三大交互 | 文案展示标配；render props 全部翻成 slot（`copy-icon` / `edit-icon` / `expand-text` 等 slot） | [ ] |

---

## Tier L-4 — 文档示例补齐（每批 2–4 天，按 demo 缺口大小排）

> 数据来自 per-component/ 各文件「缺失 ant demo」节。

| Batch | 范围 | demo 增量 | 状态 |
| --- | --- | --- | --- |
| L-4.1 | Rate（缺 12） / Result（缺 10） / Progress（缺 9） | +31 demo | [ ] |
| L-4.2 | Avatar / Badge / Alert / FloatButton（各缺 8+） | +32 demo | [ ] |
| L-4.3 | Affix / Spin / InputNumber / Empty / Segmented / Flex（各缺 8+） | +48 demo | [ ] |
| L-4.4 | Mentions / Collapse / Card / List / Image / Statistic / Divider / Grid（中等缺口） | +35 demo | [ ] |
| L-4.5 | Cascader / DatePicker / Tooltip / Popover（缺 6–8） | +28 demo | [ ] |
| L-4.6 | Table（25 demo 缺口，与 L-2.12 配套交付） | +25 demo | [ ] |
| L-4.7 | Form（28 demo 缺口，与 L-1.6 + L-3.6 配套交付） | +28 demo | [ ] |
| L-4.8 | Typography（与 L-3.7 配套交付）+ Calendar（与 XL-2 配套交付） | +20 demo | [ ] |

---

## Tier XL — 架构 / Breaking 演进（每批 1–2 周）

| Batch | 范围 | 影响 | 风险 | 状态 |
| --- | --- | --- | --- | --- |
| XL-1 | Form.Item `prop` → `name` 切换为主名，`prop` 保留 deprecated 至下一大版本 | docs 几十处 :::demo 重写 + 测试用例改 | 中（breaking 但有别名兼容） | [ ] |
| XL-2 | Calendar 从原生 `Date` 迁到 `Dayjs`（对齐 DatePicker 系），引入 `valueFormat` Vue 协议 | Calendar 全量重写 + valueFormat 协议引入 | 高（数据协议变更） | [ ] |
| XL-3 | 全量 deprecation policy 落地：旧 prop 在 dev mode 触发 console.warn（每个 key 一次性，避免噪音），文档加 deprecated 标记，定一个删除时间窗 | 影响所有 deprecated 标记的 prop（命名差异表 21 项 + Tag.bordered + InputNumber size） | 低 | [ ] |
| XL-4 | 跨组件 ARIA 完整审计 + 键盘导航补齐（Cascader / Menu / Tree / DatePicker 系 / Dropdown / Tabs 等） | 30+ 组件键盘 + screen reader 测试 | 中 | [ ] |
| XL-5 | 国际化二期：DatePicker 系 dayjs/locale 包接入 + 完整 enUS / 其他语言包覆盖 | locale 接口扩展 + 包体积管理 | 中（需要权衡 dayjs 体积） | [ ] |
| XL-6 | Element Plus 风格 API 全量切换到 Ant 风格主名（L-1 + M-A5 完成后），旧名彻底转为 deprecated 兼容层；同步把所有 render-prop 翻译成 slot；README 与 introduce.md 强调「Vue 组件库 / 对标 Ant Design 视觉 + 心智」 | README 表述同步 + 公开 v2.0 升级指南 | 高（breaking 升大版本） | [ ] |

---

## 节奏建议

### 第 1–2 周：消除已发现 bug + 拉齐通用能力

- Tier S 全做：S-01 至 S-06，一个 commit。
- Tier M-A1（variant）+ M-A2（classNames/styles）。

### 第 3–6 周：基础组件 API 切 Ant

- Tier L-1.1（Button） → L-1.2（Input） → L-1.3（Modal） → L-1.4（Drawer） → L-1.5（Tooltip 系） → L-1.6（Form）。
- 期间穿插 Tier M-A3 / M-A4 / M-A5。

### 第 7–10 周：补足缺失子组件 + Hook

- Tier L-2 按优先级做（Input 子组件优先 → Modal 静态/Hook → message/notification Hook → Typography 交互）。
- Tier L-3.1–L-3.4 同步推进。

### 第 11–14 周：单组件 100% 化 + 文档

- Tier M-B1 至 M-B10 滚动推进。
- Tier L-4 文档示例补齐与 Tier L-2 / L-3 配套交付。

### 第 15 周以后：XL 演进 + 大版本升级

- XL-1（Form name）→ XL-2（Calendar Dayjs）→ XL-3（deprecation policy 收紧）→ XL-6（v2.0 切换）。

---

## 维护约定

- **完成一条**：把 `[ ]` 改成 `[x]`，并在 `components-diff.md` §三新加一节 Batch XX 摘要（参考既有 Batch 36-40 样式）。
- **新增任务**：在对应 Tier 末尾追加；Tier 内部按优先级排序，不必严格按 ID。
- **删除任务**：不直接删，加 `[—]` 标记并写一句「为何不做」（例如 ant 已 deprecated / 不在 ccui 设计范围内）。
- **状态过期**：本清单每 2 个月或每个大批次完成后复审一次，删除已完成项的 backlog 残留、补充新发现。
