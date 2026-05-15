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

| Ant 概念                                                                                                                                                                                                                                                                                                                                             | 为什么不做                                                                                                              | ccui 怎么解决                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Form.shouldUpdate`                                                                                                                                                                                                                                                                                                                                  | React 渲染优化原语，强迫子树重渲。Vue 响应式自动处理依赖收集                                                            | 不实现，文档说明「Vue 中通过 reactive 自然达成」                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `Form.Item.valuePropName` / `getValueFromEvent` / `getValueProps`                                                                                                                                                                                                                                                                                    | 用来桥接 React 受控 onChange/value 协议                                                                                 | **不需要**，Vue `v-model:*` + `modelValue` 已经统一协议                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `controlled` vs `uncontrolled` 语义                                                                                                                                                                                                                                                                                                                  | React 受控/非受控二分法                                                                                                 | Vue 用 `v-model:*` + `default-*` 双轨已统一覆盖，文档不引入这两个词                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `ref forwarding` / `React.forwardRef`                                                                                                                                                                                                                                                                                                                | React 特有 ref 转发                                                                                                     | Vue `defineExpose` + 模板 `ref` 直接拿，本就是另一套机制                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| React 风格的 `render props`（`tagRender` / `optionRender` / `cellRender` / `headerRender` / `iconRender` / `modalRender` / `popupRender` / `dropdownRender` / `indicatorsRender` / `actionsRender` / `panelRender` / `displayRender` / `titleRender` 等）                                                                                            | React 把 render 当一等公民                                                                                              | **全部翻译成 Vue 作用域插槽**，命名按 ccui 惯例（如 `tag` / `option` / `cell` / `header` / `icon` / `modal` / `popup` / `indicator` slot），保留 prop 形式时仅接受字符串 / VNode，不接受 React 函数                                                                                                                                                                                                                                                                                                        |
| **静态属性命名空间挂子组件**（`Input.TextArea` / `Button.Group` / `Tag.CheckableTag` / `Image.PreviewGroup` / `Avatar.Group` / `Badge.Ribbon` / `Card.Meta` / `List.Item.Meta` / `Table.Column` / `Tree.DirectoryTree` / `Dropdown.Button` / `Skeleton.Button` / `Form.ErrorList` / `Statistic.Timer` / `Alert.ErrorBoundary` / `Space.Compact` 等） | React 没有 kebab 模板 + auto-import，靠 `<Input.TextArea>` 命名空间读起来更顺；Vue 模板根本写不出 `<c-input.text-area>` | **全部拆为平铺独立顶层组件**：`Textarea` / `ButtonGroup` / `CheckableTag` / `ImagePreviewGroup` / `AvatarGroup` / `BadgeRibbon` / `CardMeta` / `ListItemMeta` / `TableColumn` / `DirectoryTree` / `DropdownButton` / `SkeletonButton` / `FormErrorList` / `StatisticTimer` / `ErrorBoundary` / `SpaceCompact`。模板用 `<c-textarea>`，TSX 用 `import { Textarea }`，**禁止 `Input.TextArea = Textarea` 静态属性挂载**。范例：现有 `Form / FormItem / FormList / FormProvider` 平铺导出。详见 Tier L-2 表。 |
| **静态常量命名空间**（`Cascader.SHOW_CHILD` / `TreeSelect.SHOW_PARENT` / `Upload.LIST_IGNORE` 等）                                                                                                                                                                                                                                                   | React 把常量挂在组件上做命名空间                                                                                        | **改顶层 export**：`CASCADER_SHOW_CHILD` / `TREE_SELECT_SHOW_PARENT` / `UPLOAD_LIST_IGNORE` 从 `vue3-ccui` 顶层导出                                                                                                                                                                                                                                                                                                                                                                                        |
| `Modal.useModal()` 返回的 `[modal, contextHolder]` 二元组                                                                                                                                                                                                                                                                                            | React Hook + JSX 单一 contextHolder                                                                                     | ccui 改成 `useModal()` composable 返回 `{ modal, holder }`，`holder` 是 Vue 组件，模板写 `<component :is="holder" />`，或直接挂 `<c-modal-host>` 单例                                                                                                                                                                                                                                                                                                                                                      |
| `App` 组件（包裹全局 message/notification/modal 上下文）                                                                                                                                                                                                                                                                                             | React 没有 `app.use()` 这种全局插件机制                                                                                 | **不做**，Vue 通过 `app.use(ccui)` 自然挂载全局命令式 API，这一点 components-diff.md 已记录为"设计排除项"                                                                                                                                                                                                                                                                                                                                                                                                  |
| `errorBoundary`（Alert.ErrorBoundary）                                                                                                                                                                                                                                                                                                               | React 错误边界组件                                                                                                      | ccui 用 `onErrorCaptured` 实现的 Vue 包裹组件 `ErrorBoundary`（顶层组件，不挂到 Alert），行为对齐                                                                                                                                                                                                                                                                                                                                                                                                          |
| `getContainer: () => HTMLElement`                                                                                                                                                                                                                                                                                                                    | React Portal 容器函数                                                                                                   | ccui 已有 `appendToBody` boolean；这里**接 Ant 的 `getContainer` 函数签名**（更灵活），保留 `appendToBody` 别名                                                                                                                                                                                                                                                                                                                                                                                            |
| `keepAlive` / `forceRender` / `destroyOnHidden` 这类显式生命周期标志                                                                                                                                                                                                                                                                                 | React 没有 KeepAlive，需要手动控制 mount                                                                                | Vue 用 `<KeepAlive>` 已提供。ccui 接同名 prop 时**对齐语义**（destroyOnHidden 改 v-if，forceRender 等价于 keepAlive=true），不照搬实现                                                                                                                                                                                                                                                                                                                                                                     |

### 二、要"翻译"的事（同心智，不同 API 形状）

| Ant React 写法                                                                | ccui Vue 化写法                                                                                                                                                   |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value={x}` + `onChange={fn}`                                                 | `v-model:value="x"` 或更语义化的 `v-model:<name>`                                                                                                                 |
| `defaultValue`                                                                | `default-value` 同名保留                                                                                                                                          |
| `open` + `onOpenChange`                                                       | `v-model:open` + 兼容 `update:open` 事件                                                                                                                          |
| `<Button icon={<Icon />}>`                                                    | `<c-button>` + `icon` slot 或 `icon` prop（字符串 Iconify name）                                                                                                  |
| `closable={{ closeIcon, disabled, ariaLabel }}` 复合对象                      | 同形 object 接收 + 单独 `closeIcon` slot 兜底                                                                                                                     |
| `footer={null}` / `footer={vnode}`                                            | `footer` slot；prop 接受 `null \| VNode`；保留 `hideFooter` 别名                                                                                                  |
| `addonBefore` / `addonAfter` ReactNode                                        | `addon-before` / `addon-after` slot；prop 仍接 string 兼容旧 `prepend`/`append`                                                                                   |
| `loading={{ delay, icon }}`                                                   | 同形 object 接收，`icon` 部分接 slot 或 string                                                                                                                    |
| `Form.useForm()` 命令式 form 实例                                             | **可选**：保留 `<c-form ref="formRef" />` + `formRef.value.validate()` 主路径；只在确实需要"游离 form 实例"（如多 form 间 hot-swap）时再做 `useForm()` composable |
| `tagsDraggable` / `optionRender` / `tagRender` / `cellRender` 等 render props | 全部 slot，命名按 ccui 惯例                                                                                                                                       |

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

| ID   | 范围                                                                              | 文件 / 行                                                 | 验收条件                                                                                                             | 状态 |
| ---- | --------------------------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---- |
| S-01 | Radio.types `String \|\| Number` truthy 表达式 → 接收 number 失败                 | `packages/ccui/ui/radio/src/radio-types.ts:12,33`         | 改为 `type: [String, Number] as PropType<string \| number>`；补 `<c-radio :value="1">` 测试                          | [x]  |
| S-02 | InputNumber size 字面值 `lg/md/sm` 与库内其他组件 `large/default/small` 不一致    | `packages/ccui/ui/input-number/src/input-number-types.ts` | size 接受 `'large' \| 'default' \| 'small'`；旧值 `'lg'/'md'/'sm'` 加 runtime warn 并 fallback；docs 同步            | [x]  |
| S-03 | ColorPicker `format: 'hsv'` 与 ant `'hsb'` 字面值差异                             | `packages/ccui/ui/color-picker/src/color-picker-types.ts` | format 接受 `'hex' \| 'rgb' \| 'hsb'`；旧 `'hsv'` runtime alias 并 deprecated                                        | [x]  |
| S-04 | Switch `size: 'default'` ↔ ant `'medium'` 命名分歧                                | `packages/ccui/ui/switch/src/switch-types.ts`             | size 接受两者，`'medium'` 为推荐                                                                                     | [x]  |
| S-05 | Slider 缺 `onChangeComplete`（mouseup/keyup 触发，Form 联动场景必备）             | `packages/ccui/ui/slider/src/slider.tsx`                  | 新增 emit `change-complete`，参数为最终值；定向测试覆盖鼠标抬起 / 键盘释放 / 拖到 disabled 区域                      | [x]  |
| S-06 | Tag `bordered` 已被 ant deprecated → `variant: 'filled' \| 'solid' \| 'outlined'` | `packages/ccui/ui/tag/src/tag-types.ts`                   | 加 `variant` prop（默认 `'outlined'`）；`bordered={false}` runtime alias 到 `variant='filled'`；docs 加 variant 演示 | [x]  |

**单批合并建议**：S-01 至 S-06 一个 commit 收口，PR 标题 `fix(types): Batch 41-S 机械修复 6 项`。

**✅ 已交付（2026-05-14）**：6 项全部落地，1416 → 1421 测试（+5）。要点：

- Radio 把 `_label = \`${props.label}\`` 强制 stringify 去掉，保留 number 原类型；`BeforeChangeType`与`RadioGroupInjection.modelValue`同步放宽为`string | number`。
- InputNumber 用 `normalizedSize` computed 收口，类与 SCSS 用规范名（`--large` / `--small`），旧值 `lg/md/sm` 进来 dev warn 一次后映射；测试改用规范名，补一条 deprecated 兼容测试。
- ColorPicker `format='hsb'` 新增（输出 `hsb(h, s%, b%)`，与 ant 一致），旧 `'hsv'` runtime warn 一次后仍输出 `hsv(...)` 兼容历史断言。
- Switch 类型放宽到 `'default' | 'medium' | 'small'`，渲染逻辑不变（只在 `'small'` 时加 modifier）。
- Slider `change-complete` emit 与 `change` 同点位同步触发（alias 关系，方便后续拆分 every-tick vs interaction-end）。**顺手发现历史 bug**：`emit('change', currentValue.value)` 中 `currentValue` 是 computed getter 读回 `props.modelValue`，单挂载场景下永远是旧值——不在本批次修，留 M-B 单组件长尾处理。
- Tag 新增 `variant: 'outlined' | 'filled' | 'solid'` prop + `effectiveVariant` computed（显式 `variant` > `bordered=false` → `'filled'` > 默认 `'outlined'`）；输出类同时包含 `--variant-xxx` 与兼容旧的 `--borderless`（非 outlined 时）。`bordered` 在 JSDoc 加 @deprecated 标记。

---

## Tier M-A — 跨组件横向 v5/v6 通用能力（5 批，每批 2–3 天）

> 这 5 批是「一次写完所有录入组件的同一类 prop」，性价比远高于继续推单组件长尾。

| Batch | 范围                                                                                                                                                                      | 影响组件                                                                                                                                                        | 预估测试增量 | 验收条件                                                                                                                                                                                            | 状态 |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| M-A1  | `variant: 'outlined' \| 'filled' \| 'borderless' \| 'underlined'`（v5.13.0+）                                                                                             | Input / InputNumber / Select / Cascader / AutoComplete / Mentions / DatePicker / RangePicker / TimePicker / TreeSelect / ColorPicker / Textarea（如有）共 12 个 | +24          | 每组件 4 种 variant 视觉对齐 Ant；提供 demo「Variants」一节                                                                                                                                         | [ ]  |
| M-A2  | `classNames` / `styles` 语义化 DOM 钩子（v5.18.0+）                                                                                                                       | 录入 12 + 展示 8（Table / Avatar / Badge / Card / List / Image / Tree / Calendar）+ 反馈 5（Modal / Drawer / Alert / Notification / Message）共 25 个           | +25          | 每组件至少 3 个语义化区域（root / popup.root / popup.listItem 等）可独立 className 注入                                                                                                             | [ ]  |
| M-A3  | `status: 'error' \| 'warning'` 拉齐                                                                                                                                       | 8 个未接入的录入（Input / InputNumber / DatePicker / RangePicker / TimePicker / Mentions / AutoComplete / TreeSelect）+ Form item 联动检查                      | +16          | status='error' / 'warning' 时边框、阴影、图标对齐；Form 校验失败自动透传                                                                                                                            | [ ]  |
| M-A4  | `prefix` / `suffixIcon` / `allowClear={ clearIcon }` / `loadingIcon` / `removeIcon` / `expandIcon` 自定义图标钩子（Vue：prop 接 string Iconify name；同名 slot 高优先级） | 10 个录入                                                                                                                                                       | +20          | 每个图标钩子同时支持 prop 形式（string / VNode）与同名 slot；slot 优先级高于 prop                                                                                                                   | [ ]  |
| M-A5  | 命名差异统一表（21 项）加 Ant 别名层，旧名 deprecated                                                                                                                     | Button / Input / Modal / Drawer / Tooltip / Popover / Popconfirm / Form 7 个                                                                                    | +30          | `open` ↔ `visible`、`title` ↔ `content`、`htmlType` ↔ `nativeType`、`addonBefore/After` ↔ `prepend/append`、`mouseEnterDelay/LeaveDelay` ↔ `showAfter/hideAfter` 等同时支持，旧名 runtime warn 一次 | [ ]  |

**单批合并建议**：每批一个 commit。M-A1 是最大头，建议先做。

---

## Tier M-B — 单组件长尾 95→100%（10 批，每批 2–3 天）

| Batch | 组件        | 当前 → 目标 | 剩余项（来自 components-diff §6.3 + per-component）                                                                                                                                                                                                                                                                               | 状态 |
| ----- | ----------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| M-B1  | DatePicker  | 95 → 100    | `cell` slot（替代 ant `cellRender`） / `minDate` / `maxDate` / `extra-footer` slot（替代 `renderExtraFooter`） / `showToday` / `disabledTime` / 完整键盘导航 / `multiple`（v6）                                                                                                                                                   | [ ]  |
| M-B2  | RangePicker | 95 → 100    | `allowEmpty: [boolean, boolean]` / `disabled: [boolean, boolean]` / `separator`（v6.3） / 响应式单面板 / preset 高亮当前命中                                                                                                                                                                                                      | [ ]  |
| M-B3  | TimePicker  | 95 → 100    | 滚轮 snap / `TimeRangePicker` 独立组件 / `cell` slot                                                                                                                                                                                                                                                                              | [ ]  |
| M-B4  | Cascader    | 95 → 100    | `showCheckedStrategy`（导出常量 `Cascader.SHOW_CHILD` / `SHOW_PARENT`） / `maxTagCount` + `max-tag-placeholder` slot + `maxTagTextLength` / 键盘导航 / `option` slot（替代 `optionRender`） / `popup` slot（替代 `popupRender`） / showSearch 对象 `limit`/`matchInputWidth`/`render`/`sort`（`render` 翻成 `searchOption` slot） | [ ]  |
| M-B5  | TreeSelect  | 80 → 95     | `showSearch` 完整 / `loadData` / `showCheckedStrategy`（常量同上） / 键盘导航 / 半选 `v-model:halfCheckedKeys`                                                                                                                                                                                                                    | [ ]  |
| M-B6  | ColorPicker | 95 → 100    | `presets` 预设色板 / `destroyOnHidden`（v5.25，对应 Vue `v-if` 语义） / EyeDropper API / `panel` slot（替代 `panelRender`）                                                                                                                                                                                                       | [ ]  |
| M-B7  | Carousel    | 95 → 100    | `adaptiveHeight` / `slidesToShow` / `slidesToScroll` / `responsive` 配置 / `pauseOnFocus` / `pauseOnHover` / `pauseOnDotsHover` / `waitForAnimate` / `dotPlacement` 别名                                                                                                                                                          | [ ]  |
| M-B8  | Transfer    | 95 → 100    | 虚拟滚动 / RTL / `selections-icon` slot（替代 `selectionsIcon` render prop）                                                                                                                                                                                                                                                      | [ ]  |
| M-B9  | Upload      | 95 → 100    | `listType='picture-card'` 完整样式 / chunk 分片 / `Upload.Dragger` 独立子组件 / `Upload.LIST_IGNORE` 常量                                                                                                                                                                                                                         | [ ]  |
| M-B10 | Tour        | 95 → 100    | `gap` / `indicators` slot（替代 `indicatorsRender`） / `actions` slot（替代 `actionsRender`） / `cover` 演示 / `disabledInteraction` / per-step `nextButtonProps` / `prevButtonProps` / Vue 风格事件（`@step-change` / `@finish`，async 用 `await emit` 模式而非 React async hook）                                               | [ ]  |

---

## Tier L-1 — 基础组件 Ant 别名层（每批 3–5 天，与 M-A5 互补）

> M-A5 只加 prop 别名（不改行为），这里是把 Element Plus 风格 API 真正"加上 Ant 完整能力"。

| Batch | 组件                           | 待补 props / 行为                                                                                                                                                                                                                                                                                                                                                                                                                                                | 状态 |
| ----- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| L-1.1 | Button                         | `block` / `ghost` / `danger` / `href`/`target`（自动 render 成 `<a>`） / `shape='circle' \| 'round'` / `htmlType`（保留 `nativeType` 兼容） / `loading={ delay, icon }`（`icon` 接 string 或 `loading-icon` slot） / `color` / `variant`（v5.21）/ `iconPosition: 'start' \| 'end'` / `autoInsertSpace`（v5.17，CJK 字符间插空格）                                                                                                                               | [x]  |
| L-1.2 | Input                          | `addon-before` / `addon-after` slot（保留 `prepend`/`append` string 兼容） / `prefix` slot / `suffix` slot / `allowClear: bool \| { clearIcon }`（`clearIcon` 也可走 slot） / `show-count` 自带计数 + `{ formatter }` slot / `maxLength` / `status` / `@press-enter` 事件（替代 `onPressEnter` 回调） / `defaultValue` 与 `v-model:value` 并存                                                                                                                   | [x]  |
| L-1.3 | Modal                          | `v-model:open` 受控 + `visible` deprecated（保留兼容） / `footer` slot（支持 string \| VNode \| null） / `closable: bool \| { closeIcon, disabled, ariaLabel }` 复合（closeIcon 同时支持 slot） / `@after-open-change` 事件 / `keep-alive` prop（替代 ant `forceRender`，对接 Vue `<KeepAlive>`） / `modal` slot（替代 `modalRender`） / `wrap-class-name` / `keyboard` 别名 `close-on-esc` / `transitionName` / `maskTransitionName` / `focusTriggerAfterClose` | [x]  |
| L-1.4 | Drawer                         | `v-model:open` 别名 / `extra` slot / `loading`（v5.17） / `footer` slot / `@after-open-change` / `keep-alive` prop（替代 `forceRender`） / `push`（嵌套抽屉，含 `distance` 自动让位距离）                                                                                                                                                                                                                                                                        | [x]  |
| L-1.5 | Tooltip / Popover / Popconfirm | `title` slot + 别名 `content`（保留 ccui 旧名） / `color` 别名 `effect` 字符串 → 颜色字面量同时支持 / `mouse-enter-delay` 别名 `show-after` / `mouse-leave-delay` 别名 `hide-after` / `get-popup-container: (trigger) => HTMLElement`（保留 `append-to-body` 别名） / `destroy-tooltip-on-hide` / `arrow: bool \| { pointAtCenter }` / `fresh` / `align` 对象 / `auto-adjust-overflow` / `overlay-class-name` 别名 `popper-class`                                | [x]  |
| L-1.6 | Form                           | `name` 别名（保留 ccui `prop`） / `colon` / `label-col` / `wrapper-col` 栅格对象 / `hasFeedback` / `warningOnly` / Rule 接受函数式 `(form) => Rule \| Rule[]` / `validateDebounce` / **不做** `valuePropName` / `getValueFromEvent` / `getValueProps` / `shouldUpdate`（Vue v-model + 响应式已替代）                                                                                                                                                             | [x]  |

**✅ L-2.17 已交付（2026-05-15）**：测试数不变（仅文档）。Tier L-2 Menu 子组件对齐（对标 ant `Menu.SubMenu` / `Menu.ItemGroup` / `Menu.Divider`）。要点：

- **核查现状**：grep `packages/ccui/ui/menu/` 全目录，确认 ccui Menu 走**配置式 API**——所有菜单项、子菜单、分组、分割线都通过 `items: MenuItem[]` prop 的 `type: 'item' | 'submenu' | 'group' | 'divider'` 字段表达；**不存在** `Menu.SubMenu` / `Menu.ItemGroup` / `Menu.Divider` 静态属性命名空间，也**不存在** `<c-sub-menu>` / `<c-menu-item-group>` / `<c-menu-divider>` 模板式子组件。roadmap 表内「**当前 ccui 已平铺**」是此意（即不挂静态属性命名空间），不是字面上的子组件存在。
- **决策：保持配置式 API 不拆模板子组件**。理由：Menu 数据结构高度规整（树形 + 类型枚举），配置式 API 在动态菜单（基于后端权限的 admin 菜单）场景比模板式更简洁；模板式 `<c-sub-menu>` 等子组件留作 v2.x 演进项（如有强需求再做）。这与 L-2.21 / L-2.23 「不拆组件」的风格一致。
- **文档对齐**：在 `packages/docs/components/menu/index.md` 文档开头「基本用法」之前新增「对标 Ant Design 子组件」一节：
  - 用 `::: tip` block 明示「配置式 API、不暴露子组件命名空间」+ 理由
  - 给出对照表：`<Menu.Item />` → `{ key, label, icon? }` / `<Menu.SubMenu />` → `{ key, label, type: 'submenu', children }` / `<Menu.ItemGroup />` → `{ key, label, type: 'group', children }` / `<Menu.Divider />` → `{ key, type: 'divider' }`
  - 说明 `type` 缺省的自动推断逻辑：有 children → submenu，无 children → item
- **顶层导出确认**：`packages/ccui/ui/vue-ccui.ts` 已 export `Menu`，无需新增。
- 测试 +0：现有 Menu 测试已覆盖四种 type 的渲染（include `items` array tests）；本批纯文档对齐，无运行时变更。
- 注：本批是当前 L-2 系列里唯一一件「仅文档」的批次，roadmap 文本明确「本批仅文档表述对齐」；如未来决定补模板式子组件，需另起批次 L-2.x（参照 L-2.12 TableColumn 的 provide/inject 收集器模式）。

**✅ L-2.16 已交付（2026-05-15）**：1782 → 1791 测试（+9）。Tier L-2 表单错误列表（对标 ant `Form.ErrorList`）。要点：

- **新建 `packages/ccui/ui/form-error-list/`**，平铺独立 `<c-form-error-list>` / `import { FormErrorList }`。**不挂 Form.ErrorList 静态属性**。
- **与 FormItem 完全解耦**：FormItem 内置只显示一条 message；本组件独立组件，可放在 FormItem 外部 / 表单顶部汇总区 / 任意位置，纯展示模式，不绑定校验逻辑。
- **三组 props**：`errors: string[]`（红色）/ `warnings: string[]`（黄色）/ `help: string`（次级灰色单条）。
- **渲染优先级**：`errors > warnings > help`。`errors` 非空只显示 errors；errors 空 + warnings 非空显示 warnings；都空 + help 非空显示 help；全部空返回 `null` 不渲染外层 `<ul>`（避免空容器占位）。
- **DOM 结构**：`<ul role="alert" aria-live="polite">` + 多个 `<li class="--{type}">`；每个 item key 为 `${type}-${index}-${text}`，确保 reactive 更新时 patch 而非 unmount-remount。
- **JSX 渲染**：本批起 `.tsx` 默认用 JSX 写模板（之前 L-2.12~L-2.15 批量用 h() 是初版 instructions 误读；feedback memory 已纠正）；h() 只在必要时（动态组件 / oxc 边界）使用。
- **SCSS**：基础类 `ccui-form-error-list`（`<ul>` 列表样式 + `margin-top: var(--margin-xxs)` + 字号 sm + line-height base）；item 三档颜色：`--error`（`$ccui-color-error`）/ `--warning`（`$ccui-color-warning`）/ `--help`（`$ccui-color-text-secondary`）。
- **顶层注册**：`packages/ccui/ui/vue-ccui.ts` 加 `FormErrorListInstall` import + installs 数组 + 顶层 export。
- 文档 + sidebar：用户文档 3 demo（基本 errors / errors+warnings 同存 / help 单条）+ 渲染优先级说明 + API 表；sidebar「数据录入」组 Form 后加入口。
- 测试 9 条：errors 列表 DOM / --error modifier / warnings + --warning / 同存顺序（先 errors 后 warnings）/ help 在空时显示 / help 被 errors 抢走优先级 / 全部空时不渲染 / a11y role+aria-live / reactive 动态变化。

**✅ L-2.15 已交付（2026-05-15）**：1756 → 1782 测试（+26）。Tier L-2 Skeleton 5 形态变体（对标 ant `Skeleton.Button` / `Skeleton.Avatar` / `Skeleton.Input` / `Skeleton.Image` / `Skeleton.Node`）。要点：

- **新建 5 个目录**：`skeleton-button/` / `skeleton-avatar/` / `skeleton-input/` / `skeleton-image/` / `skeleton-node/`，平铺独立 `<c-skeleton-button>` / `<c-skeleton-avatar>` / `<c-skeleton-input>` / `<c-skeleton-image>` / `<c-skeleton-node>` / 5 个顶层 `import { SkeletonButton, ... }`。**不挂 Skeleton.Button / Skeleton.Avatar / ... 静态属性**。
- **每件单一职责，仅纯渲染 span**：所有组件都 `h('span', { class, style, 'aria-busy': 'true', 'aria-hidden': 'true' })`，零状态、零事件、零 slot（除 SkeletonNode 有 default slot 放自定义图标）。
- **统一动画系统**：共享 `@keyframes ccuiSkeletonLoading` 关键帧（CSS 关键帧本身就是全局，每个 .scss 内重复定义不会冲突，确保单独加载某一件时动画也可用）；`--active` modifier 统一开启 `linear-gradient` 背景动画。
- **SkeletonButton**：`size: 'large' | 'default' | 'small'` + `shape: 'default' | 'circle' | 'round' | 'square'` + `block` 撑满 + `active`。circle 形态遇到 large/small 时联级调整 width；round 使用 100px 大圆角；square 走 border-radius:0。
- **SkeletonAvatar**：`size: 'large' | 'default' | 'small' | number` —— 字符串档位走 SCSS `--{size}` modifier，number 类型走 inline style（width/height/minWidth 三件套）。`shape: 'circle' | 'square'`，circle 默认（border-radius: 50%）。
- **SkeletonInput**：`size: 'large' | 'default' | 'small'` + `block` 撑满 + `active`。基础 160×32，large 200×40，small 120×24。
- **SkeletonImage**：固定 96×96，内置 1098×1024 viewBox 的山形 SVG 图片图标（fill: currentColor，灰色降饱和），与 ant 视觉对齐。
- **SkeletonNode**：默认 160×96 + `width` / `height` 双 props（接 number 或 CSS 字符串，`toCss()` 工具自动加 px）；default slot 放自定义图标 / VNode；`inline-flex + align-items:center + justify-content:center` 让 slot 内容居中。
- **顶层注册**：`packages/ccui/ui/vue-ccui.ts` 加 5 个 Install import + installs 数组 + 5 个顶层 export。
- 文档 + sidebar：5 份用户文档（SkeletonButton 3 demo / SkeletonAvatar 2 demo / SkeletonInput 2 demo / SkeletonImage 1 demo / SkeletonNode 2 demo）+ 每件 API 表；sidebar「反馈」组 Skeleton 后顺序加 5 个入口。
- 测试 26 条：SkeletonButton 6 / SkeletonAvatar 6 / SkeletonInput 5 / SkeletonImage 4 / SkeletonNode 5。覆盖：默认 span + base class / size 档位 modifier / size number inline style / shape modifier / block modifier / active modifier / aria-busy / SVG 图标 / slot 渲染 / width-height 单位处理。

**✅ L-2.14 已交付（2026-05-15）**：1743 → 1756 测试（+13）。Tier L-2 下拉按钮（对标 ant `Dropdown.Button`）。要点：

- **新建 `packages/ccui/ui/dropdown-button/`**，平铺独立 `<c-dropdown-button>` / `import { DropdownButton }`。**不挂 Dropdown.Button 静态属性**。
- **组合外壳：`<c-button>` + `<c-dropdown>`**。setup 内 `h(Button main)` + `h(Dropdown, slot.default = h(Button trigger))`；不重写 Dropdown / Button 实现，只承担两件外观协调 + 事件分流。
- **主按钮（左）vs 下拉触发按钮（右）**：共享 `type` / `size` / `disabled` / `danger`，但 `loading` / `href` / `htmlType` 仅作用主按钮（下拉触发按钮始终 `<button>`）。主按钮 onClick 拦截：`disabled || loading` 时不 emit。
- **三段 slot 优先级**：default（主按钮内容）> `label` prop；`icon`（下拉触发图标）slot > `icon` class prop > 默认 CSS `border` 三角；`menu`（自渲染菜单）slot 透传给底层 Dropdown，与 `items` prop 互斥（slot 胜出）。
- **SCSS 拼接**：主按钮去掉右半圆角（`border-top-right-radius: 0 !important`），下拉触发按钮去掉左半圆角 + `margin-inline-start: -1px` 让 border 叠合 + `padding-inline: 8px` 收紧；wrapper `inline-flex` 让两个按钮垂直对齐。`!important` 是因为 ccui Button SCSS 优先级较高，外部 class 覆盖不进去。
- **placement 默认 `'bottom-end'`**（与 ant 一致）：下拉菜单从触发按钮的右下角对齐 wrapper 右边缘，避免主按钮被遮挡。
- **事件转发**：emit `click` / `select` / `update:visible` / `visible-change`，与 `<c-dropdown>` 同名事件一一对接。
- **顶层注册**：`packages/ccui/ui/vue-ccui.ts` 加 `DropdownButtonInstall` import + installs 数组 + 顶层 export。
- 文档 + sidebar：用户文档 5 demo（基本 / default slot 主按钮内容 / 类型尺寸危险 / menu slot 自渲染 / icon 自定义）+ API 三表；sidebar「通用」组在 Dropdown 后加入口。
- 测试 13 条：基本组合 DOM / default slot 优先 / 主按钮 click 转发 / disabled / loading 时不触发 click / 默认 arrow / icon prop / icon slot 优先 / size modifier / danger 双 Button / hover→click trigger + select / menu slot 自渲染 + cleanup teleport / visible-change 转发。

**✅ L-2.13 已交付（2026-05-15）**：1730 → 1743 测试（+13）。Tier L-2 目录树（对标 ant `Tree.DirectoryTree`）。要点：

- **新建 `packages/ccui/ui/directory-tree/`**，平铺独立 `<c-directory-tree>` / `import { DirectoryTree }`。**不挂 Tree.DirectoryTree 静态属性**。
- **薄外壳设计**：DirectoryTree 不重写树形渲染，内部 `h(Tree, ...)` 透传所有 props / events / slots；只覆盖三项默认值 + 加两个独有 prop + 注入内置 icon slot。
- **默认值差异**（与底层 Tree 比较）：`defaultExpandAll: true` / `blockNode: true` / `multiple: true`，与 Ant 「文件管理器」语境一致。
- **`expandAction: 'click' | false`**（默认 `'click'`）：拦截 Tree 的 `select` 事件，folder 节点（`hasChildren || (loadData && !isLeaf)`）触发同步展开切换。`false` 则只透传，不触发自动展开（仅 switcher 图标点击展开）。**不支持 ant 的 `'doubleClick'`**（v2.x 演进时再加；当前 Tree 节点没有 `dblclick` 监听，需要修改 Tree 暴露才能实现）。
- **`showIcon: true`** + 内置 3 套 14×14 SVG（folder closed / folder open / file），优先级：用户 `icon` slot > `node.raw.icon` > 内置 folder/file；`showIcon=false` 时禁用内置图标但保留用户 slot / raw.icon。
- **expandedKeys 受控/非受控双轨**：`isControlledExpanded` computed 判断；非受控用 `innerExpandedKeys` ref 镜像，click 切换写本地；watch props.expandedKeys 同步父级值。**透传给 Tree 时始终传 `currentExpandedKeys.value`**（即始终走 Tree 的受控分支），避免内部状态分裂。
- **defaultExpandAll 手动展开**：DirectoryTree 内置 `collectExpandableKeys(data, fieldNames)` 工具递归收集所有带 children 的 key（默认字段名 fallback）。初始化 `innerExpandedKeys` 时检测 `defaultExpandAll && expandedKeys === undefined && defaultExpandedKeys.length === 0` 才触发；否则 Tree 不会执行内置 defaultExpandAll 逻辑（因为我们始终把 expandedKeys 传给它）。
- **事件全转发**：`update:selectedKeys / update:checkedKeys / update:expandedKeys / update:focusedKey / select / check / expand / load / drop / dragstart / dragenter / dragover / dragleave / focus-change / load-error` 14 个事件全 emit。
- **暴露底层 Tree 实例**：`expose({ get tree })`，父组件可通过 `directoryTreeRef.tree` 调 Tree 暴露的方法（保留扩展口）。
- 文档 + sidebar：用户文档 5 demo（基本 / expandAction 切换 / 自定义 icon slot / node.raw.icon / showIcon 关闭）+ 默认值对照表 + API 表；sidebar「数据展示」组 Tree 后加入口。
- 测试 13 条：默认全展开 / defaultExpandAll=false 折叠 / blockNode modifier / expandAction='click' 切换 / expandAction=false 不展开 / 内置 icon SVG 存在 / showIcon=false 不渲染 / node.raw.icon 优先 / multiple 默认多选 / @select 转发 / @expand 转发 + payload / 受控 expandedKeys / 用户 icon slot 覆盖。

**✅ L-2.12 已交付（2026-05-15）**：1713 → 1730 测试（+17）。Tier L-2 表格模板式列声明 + 汇总行（对标 ant `Table.Column` / `Table.ColumnGroup` / `Table.Summary`）。要点：

- **新建 `packages/ccui/ui/table-column/` + `table-column-group/` + `table-summary/` 三件**，平铺独立 `<c-table-column>` / `<c-table-column-group>` / `<c-table-summary>` / `import { TableColumn, TableColumnGroup, TableSummary }`。**不挂 Table.Column / Table.ColumnGroup / Table.Summary 静态属性**；从 `vue3-ccui` 顶层三件 export。
- **架构核心：provide / inject 收集器**。`table-types.ts` 新增 `tableColumnsCollectorKey` / `tableColumnGroupCollectorKey` / `tableSummaryCollectorKey` 三 Symbol；Table.setup 内建 `collectedEntries: Map<symbol, { column, order }>` + `shallowRef<TableColumn[]>` + `triggerRef` 手动通知；register/unregister 双 API 给子组件用。三件子组件 setup 阶段 inject + register（id = Symbol，order = 自增），onBeforeUnmount unregister。所有子组件 `render() => null`，自身不产生 DOM。
- **`effectiveColumns` 互斥规则**：computed 选择 `props.columns?.length > 0 ? props.columns : collectedColumns.value`。**`columns` prop 优先**；模板式列只有 prop 为空时生效。文档显式强调二选一。
- **列定义用 getter 暴露字段（关键反复试错点）**：TableColumn / TableColumnGroup 不存快照 column 对象，而是 `Object.defineProperties` 把 `title` / `dataIndex` / `customRender` 等做成 getter，读时通过闭包返回 `props.xxx` 最新值。`customRender` 用 stable closure 代理 slot/prop（slot 优先），避免函数 ref 频繁变化触发 `watch deep` 递归刷新（实测 `watch(() => ({...props}), { deep: true })` 在 customRender slot 场景会无限刷新，因为每次父 render 都给 TableColumn 新的函数引用）。换 getter 后 Table 端读 column.title 时建立反向依赖，props 改动 Table 自动 re-render，且 0 个 watch 表达式。
- **ColumnGroup 嵌套 + thead 双行渲染**：ColumnGroup 通过 `provide(tableColumnGroupCollectorKey)` 暴露子收集器，内部 `<c-table-column>` 优先注册到 group 而非 root（`inject(group) ?? inject(root)`）。Table 端 `hasColumnGroup` computed 检测任一顶层列带 children，触发双行 thead：top row 渲染顶层列（group `colspan=leafCount`，组外 leaf `rowspan=2`），bottom row 渲染所有 group 的叶子。`leafColumns` 展平所有 children 给 tbody / fixed offsets / sorter / filter 用。
- **Summary slot 注入到 tfoot**：`<c-table-summary>` setup 阶段 `watchEffect` 把 default slot 推到 Table 的 `summarySlot: shallowRef<Slot | null>`；Table render 检测到非 null 时 `h('tfoot', { class: ns.e('summary') }, [summarySlot.value()])`。卸载时 `setSummary(null)` 清理。
- **default slot 渲染到隐藏 children-collector**：Table 渲染时把 `slots.default()` 包到 `<div class="ccui-table__children-collector" style="display:none">` 内，让三件子组件走完 setup（触发 register / setSummary）；子组件自身 render null 不产生实际 DOM。
- **顶层注册**：`packages/ccui/ui/vue-ccui.ts` 加 `TableColumnInstall` / `TableColumnGroupInstall` / `TableSummaryInstall` 三 import + installs 数组 + 三个顶层 export。
- 文档 + sidebar：用户文档 3 份（TableColumn 4 demo / TableColumnGroup 3 demo / TableSummary 2 demo）+ API 表；sidebar「数据展示」组在 Table 后加 3 个入口。
- 测试 17 条：TableColumn 7（DOM 列头+行数据 / columns prop 优先 / customRender slot 优先 / width+align+fixed / sorter 点击 / 动态增删列 v-if / 脱离父级不渲染）+ TableColumnGroup 5（双行 thead+colspan+rowspan / tbody 叶子单元格 / 无分组退化单行 / --group modifier class / 脱离父级）+ TableSummary 5（tfoot 渲染 / 未用不渲染 / 与 thead+tbody 并列 / 卸载移除 / 脱离父级）。

**✅ L-2.11 已交付（2026-05-15）**：1705 → 1713 测试（+8）。Tier L-2 列表项元信息（对标 ant `List.Item.Meta`）。要点：

- **新建 `packages/ccui/ui/list-item-meta/`**，平铺独立 `<c-list-item-meta>` / `import { ListItemMeta }`。**不挂 List.Item.Meta 静态属性**。
- **与现有 `<c-list-item>` 内嵌 meta 同形**：复用 `useNamespace('list')`（不开新前缀），渲染同样的 `.list__item-inner` / `.list__item-avatar` / `.list__item-meta` / `.list__item-title h4` / `.list__item-desc` DOM 与 SCSS，两种写法可二选一不重复样式。
- **props**：`title` / `description` 两段字符串 prop + 三 slot（`avatar` / `title` / `description`）。slot 优先于 prop；未传时不渲染对应节点（不留空 `<h4></h4>` 或 `.item-meta` 占位）。
- **额外的 default slot**：渲染于 `item-main` 内 meta 之后，承担「meta 下方的正文 / 额外内容」（与 ant `Item.Meta` 内允许额外内容一致）。
- **两种写法对照**（任选其一）：
  - 现有 ccui 风（slot 直接挂在 ListItem 上）：`<c-list-item><template #avatar>...</template><template #title>...</template></c-list-item>`
  - ant 风（嵌套 Meta 组件）：`<c-list-item><c-list-item-meta avatar=... title=... description=... /></c-list-item>`
- **顶层注册**：`packages/ccui/ui/vue-ccui.ts` 加 `ListItemMetaInstall` import + installs 数组 + 顶层 export。
- 文档 + sidebar：用户文档对照两种写法 + 各自 demo + API 表；sidebar「数据展示」组加入口。
- 测试 8 条：item-inner+item-main DOM / title prop（h4 标签 + 文字）/ description prop / title slot 优先 / description slot 优先 / avatar slot 容器 / 无 title+description 不渲染 item-meta / default slot 渲染。

**✅ L-2.10 已交付（2026-05-15）**：1689 → 1705 测试（+16）。Tier L-2 卡片元信息 + 卡片网格（对标 ant `Card.Meta` / `Card.Grid`）。要点：

- **新建 `packages/ccui/ui/card-meta/` + `packages/ccui/ui/card-grid/`** 双件平铺独立，**不挂 Card.Meta / Card.Grid 静态属性**。`<c-card-meta>` / `<c-card-grid>` 模板 + `import { CardMeta, CardGrid }` TSX 同时可用。
- **CardMeta props**：`title` / `description` 两段文字 + 三个 slot（`avatar` / `title` / `description`）；slot 优先于 prop；未传 title / description 时不渲染对应节点（不留空 div 占位）。
- **CardMeta SCSS**：左 avatar 48×48 圆形（与 ant 64 略小，与 ccui Avatar 默认 36 协调），右 detail 两段文字（title 加粗 + 截断省略、description 次级色）。
- **CardGrid props**：`hoverable: bool`（默认 true，hover 浮起阴影）+ `colSpan: 1-24`（夹紧 `Math.max(1, Math.min(24, ...))`，越界自动 clamp）+ `bodyStyle: CSSProperties` inline 透传。
- **CardGrid SCSS**：默认 33.33% 宽（与 ant 三栏一致）；`box-shadow` 用 5 个内/外阴影画一像素边框（避免边框双倍），hover 时 z-index:1 升起 + 主阴影。
- **顶层注册**：`packages/ccui/ui/vue-ccui.ts` 加 `CardMetaInstall` + `CardGridInstall` 两 import + installs 数组 + 两个顶层 export。
- 文档 + sidebar：用户文档分别为 CardMeta（avatar+title+description 三段；slot 优先）+ CardGrid（hoverable / colSpan / 自定义 bodyStyle）；sidebar 加两个独立入口。
- 测试 16 条：CardMeta 7（DOM / title prop / description prop / title slot 优先 / description slot 优先 / avatar slot / 无内容降级）+ CardGrid 9（DOM / 默认 hoverable / 关闭 hoverable / colSpan 12=50% / 24=100% / 99 夹紧 / 0 夹紧 / bodyStyle 透传 / 未传 colSpan 无 width inline）。

**✅ L-2.9 已交付（2026-05-15）**：1675 → 1689 测试（+14）。Tier L-2 缎带徽标（对标 ant `Badge.Ribbon`）。要点：

- **新建 `packages/ccui/ui/badge-ribbon/`**，平铺独立 `<c-badge-ribbon>` / `import { BadgeRibbon }`。**不挂 Badge.Ribbon 静态属性**。
- **`text` prop + `text` slot 双源**：slot 优先；slot 可放 VNode / 富文本，prop 接受 string。
- **`color` 双轨**：13 个预设色名（`pink / magenta / red / volcano / orange / yellow / gold / cyan / lime / green / blue / geekblue / purple`）走 SCSS `--color-{name}` modifier；非预设字符串（`#hex` / `rgb()` / 命名色）作为 CSS color 字面量挂到 inline `background-color`，**自定义色同时写入 corner inline `color`** 让三角折角同色（不挂 modifier）。
- **`placement: 'start' | 'end'`**：`end`（默认）右上，`start` 左上；通过 `right: -8px` / `left: -8px` 定位 + 不同侧圆角 + 不同 corner 边色方向。
- **`isRibbonPresetColor()`** 顶层 export：13 名集合（Set lookup），与 Tag preset 兼容（drop yellow/cyan/lime 是历史差异，本批已对齐 ant v6 全套）。
- **SCSS 折角实现**：`__corner` 绝对定位在 ribbon 底部，4px 透明 border 拼出三角；`end` 用 `border-color: c c transparent transparent`（左下半），`start` 用 `border-color: c transparent transparent c`（右下半）；`transform: scaleY(0.75) origin-top` 让三角自然贴合。
- **wrapper `position: relative inline-block`**：ribbon `position: absolute` 浮于子内容右/左上，避免影响子内容布局。
- 文档 + sidebar：5 demo（基本 / placement / 预设色矩阵 / 自定义 hex / slot 文字）+ API 表；sidebar「数据展示」组加入口。
- 测试 14 条：基本 5（DOM / text prop / text slot 优先 / default slot / corner 存在）+ placement 2 + color 7（无 / red modifier / blue modifier / custom hex inline / corner inline / custom 不挂 modifier / 未知字符串当 CSS color）。

**✅ L-2.8 已交付（2026-05-15）**：1660 → 1675 测试（+15）。Tier L-2 头像组（对标 ant `Avatar.Group`）。要点：

- **新建 `packages/ccui/ui/avatar-group/`**，平铺独立 `<c-avatar-group>` / `import { AvatarGroup }`。**不挂 Avatar.Group 静态属性**。
- **默认 slot 子项过滤**：`slots.default()` 后用 `typeof vnode.type === 'symbol'` 过滤掉纯文本 / 注释节点，只留实际组件 vnode，避免空白破坏 maxCount 计算。
- **`maxCount` 切片**：`total > max` 时 `slice(0, max)` 渲染，剩余进 `+N` 节点；`maxCount=0` 边界把所有 avatar 全挤进 `+N`（与 ant 行为一致）。
- **`+N` 节点 size 计算**：`resolveAvatarSize(size)` 把 `'large' | 'default' | 'small'` 映射到 40 / 32 / 24，number 直接用；font-size 按 size 的 40% 适配。
- **`maxStyle` 透传**：spread 到 `+N` 节点 inline style，可改背景 / 文字色。
- **`shape: 'circle' | 'square'`**：`+N` border-radius 用 50% / 4px 对应。
- **`maxPopoverPlacement`** 12 方向：`top` / `top-start` / `top-end` / `bottom*` / `left*` / `right*`；SCSS modifier `--{placement}` 控制绝对定位 + transform。
- **`maxPopoverTrigger`** 三态：`hover` 用 `mouseenter` / `mouseleave`（popover 自身也挂同样监听以避免穿出消失）；`click` 切换；`focus` 加 `tabindex=0` + `focus` / `blur`。
- **`provide(avatarGroupInjectionKey)`** 暴露 `{ size, shape }` 给未来 Avatar 内部消费（本批 Avatar 未消费，留作扩展接口）。
- **SCSS 子项重叠**：`> *:not(:first-child) { margin-inline-start: -8px }` + 每个子项 `border: 2px solid bg-container` 让边界白圈；popover `position: absolute`，z-index 1050。
- 文档 + sidebar：用户文档 6 demo（基本 / maxCount / maxStyle / shape / size / placement / trigger）+ API 表；sidebar「数据展示」组加入口。
- 测试 15 条：基本 3 + maxCount 6（含 maxStyle / shape / size 透传 / maxCount=0 边界）+ hover 2 + click 1 + focus 1 + placement 2。

**✅ L-2.7 已交付（2026-05-15）**：1646 → 1660 测试（+14）。Tier L-2 多图预览（对标 ant `Image.PreviewGroup`）。要点：

- **新建 `packages/ccui/ui/image-preview-group/`**，平铺独立 `<c-image-preview-group>` / `import { ImagePreviewGroup }`。**不挂 Image.PreviewGroup 静态属性**；与现有 `Image` 单图预览解耦，本组件自带 mask + toolbar，不复用 Image 内部 preview UI。
- **`items: string[] \| { src, alt? }[]`**：传数组时 group 自动渲染缩略图（80×80 cover），点击进入大图预览；不传时只渲染默认 slot（受控模式，用户自己管缩略图）。
- **`preview` 复合受控**：`{ visible?, current? }` 对象；传则受控，未传则非受控（内部 `innerVisible` / `innerCurrent` ref 管理）。`isControlled` computed 区分。
- **事件三件套**：`update:preview({ visible, current })`（受控模式回写）、`change(current)`（切换图）、`visible-change(visible)`（打开/关闭）。
- **prev / next 循环切换**：`((next % total) + total) % total` 数学模处理负数，末尾下一张回首张，首张上一张到末尾。
- **缩放**：内嵌 `+ / − / ⟳` 按钮；`maxZoom=6` `minZoom=0.25` 可配；切图时 scale 重置为 1。
- **键盘导航**：`window.addEventListener('keydown')`（watch visible 切换 add/remove，组件卸载时强制 remove 防内存泄漏）；`ArrowLeft / ArrowRight / Escape` 切图与关闭。
- **toolbar 按钮 + counter**：单张图不渲染 counter；多张时显示 `current+1 / total`。
- **Teleport to body + Transition `-fade`**：与现有 Image 单图预览风格一致；mask z-index 1100 高于 modal/drawer。
- **顶层注册**：`packages/ccui/ui/vue-ccui.ts` 加 `ImagePreviewGroupInstall` import + installs 数组 + 顶层 export。
- 文档 + sidebar：用户文档 5 demo（items / preview 受控 / 缩放 / 键盘 / 默认 slot）+ API 表；sidebar「数据展示」组加入口。
- 测试 14 条：items 模式 9（DOM / string[] / click 打开 / 关闭 / prev+next / 循环 / counter / 单张无 counter / keyboard+zoom）+ 受控模式 3（visible=true 立显 / next emit / close emit）+ 默认 slot 模式 1 + 边界 1。

**✅ L-2.6 已交付（2026-05-15）**：1628 → 1646 测试（+18）。Tier L-2 可勾选标签（对标 ant `Tag.CheckableTag`）。要点：

- **新建 `packages/ccui/ui/checkable-tag/`**，平铺独立 `<c-checkable-tag>` / `<c-checkable-tag-group>`，**不挂 Tag.CheckableTag 静态属性**；从 `vue3-ccui` 顶层 export `CheckableTag` + `CheckableTagGroup` 双件。
- **CheckableTag 单独使用**：`v-model:checked` 受控；点击 / Space / Enter 切换；emit `update:checked(boolean)` + `change(boolean)`；`disabled` 灰化禁点。
- **CheckableTagGroup 多选容器**：`v-model:modelValue: (string | number)[]` + 内部 `inner` ref 镜像（保持单向流但避免 toggle 读旧值）；watch 父值同步；`provide(checkableTagGroupInjectionKey)` 暴露 `{ modelValue, disabled, size, maxCount, toggle, isChecked, canCheck }`。
- **`options: CheckableTagOption[]`** 声明式渲染：`{ label, value, disabled? }`；与默认 slot 互斥（options 胜出）。
- **`maxCount`**：达到上限后未勾选项的 click 被忽略，已勾选项仍可取消（CheckableTag computed `canToggle` 用 `group.canCheck()` 判断）。
- **`disabled` 双源**：group-level + option-level / prop-level 取或值；任一禁用即灰化。
- **`size` 三档**：`large` / `default` / `small`，group 注入到子标签 scss modifier。
- **CheckableTag 子组件**：`inject(checkableTagGroupInjectionKey, null)`，存在时由 group 决定 checked / canCheck；不存在时本地 `localChecked` ref + `v-model:checked` 同步。
- **a11y**：`role="checkbox"` + `aria-checked={isChecked}` + `aria-disabled` + `tabindex={isDisabled ? -1 : 0}`；Space / Enter 触发 toggle。
- **SCSS**：未勾 hover 文字变主色；勾选 `--checked` 主色填充 + 白字；group `inline-flex flex-wrap`，子标签自带右边距。
- 测试 18 条：单独 8（DOM / 默认未勾 / checked / click / 父变化 / disabled / Space+Enter / a11y attrs）；group 10（DOM / options click / 受控选中态 / 重点取消 / group disabled / option.disabled / maxCount / 默认 slot 配合 / 父变化同步 / size 透传）。

**✅ L-2.5 已切换状态（2026-05-15）**：`ButtonGroup` 实质工作在 L-1.1 完成（commit `82aad07`），后续 commit `3d846ba` 移除了 `Button.Group` 静态属性。roadmap `[~]` → `[x]`。

**✅ L-2.4 已交付（2026-05-14）**：1604 → 1628 测试（+24）。Tier L-2 一次性密码（对标 ant `Input.OTP` v5.18+）。要点：

- **新建 `packages/ccui/ui/input-otp/`**（与 input / textarea / input-search 同级），平铺独立 `<c-input-otp>` / `import { InputOtp }`。**不挂 Input.OTP 静态属性**。
- **`length: number`**（默认 6）：N 个单字符 cell；length 变化时自动 reshape cells，保留可见字符。
- **`mask: bool | string`**：`true` 用 `•` 遮罩；`string` 用任意单字符（自动取首字符，处理代理对）；mask 仅影响显示，emit 的 modelValue 始终是真实字符串。
- **`formatter: (v: string) => string`**：单字符变换器（在写入 cell 之前调用，再取首字符防多字符）。例：`v => v.toUpperCase()`。
- **`@change(value, { index })`**：与 ant `onChange(value)` 对齐 + 加入触发格 index payload；同时 emit `update:modelValue(value)`。
- **`autoFocus`**：挂载时聚焦首格。`disabled` / `status: 'error' | 'warning'` / `size: 'large' | 'default' | 'small'` 与同套数据录入组件对齐。
- **焦点流转**：输入触发自动跳下一格；Backspace 当前格有值 → 清掉，无值 → 回上一格并清；ArrowLeft / ArrowRight 显式跨格；粘贴 paste 时从当前格起逐格填入（一次输入多字符同语义，处理 IME / 安卓键盘）。
- **`stringToCells` / `cellsToString`**：value 与 cells 双向单源同步；watch modelValue 时仅在差异时重置，避免回环。
- **a11y**：根 `role="group" aria-label="OTP input"`；每格 `aria-label="OTP cell N"`；首格 `autocomplete="one-time-code"` 触发系统自动填充；`inputmode="numeric"`。
- **`takeFirstChar` 用 `Array.from(s)[0]`**：避免拆 emoji / 代理对。
- 顶层注册：`packages/ccui/ui/vue-ccui.ts` 加 `InputOtpInstall` import + installs 数组 + InputOtp 顶层 export。
- 测试 24 条：基本渲染 5 / v-model+defaultValue 4 / 输入+焦点流转 3 / Backspace 2 / Arrow 2 / 粘贴 2 / formatter 1 / mask 2 / status 2 / focus+blur 1。粘贴测试在 jsdom 无 DataTransfer，传 mock `{ getData }`。

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
>
> - 模板用 kebab-case：`<c-textarea>` / `<c-input-search>` / `<c-checkable-tag>` / `<c-button-group>`
> - TSX 用 PascalCase 平铺 import：`import { Textarea, InputSearch, CheckableTag, ButtonGroup } from 'vue3-ccui'`
> - **禁止挂静态属性**（`Input.TextArea = Textarea` 这种 React 习惯）。范例：现有的 `Form / FormItem / FormList / FormProvider` 都是平铺导出。
> - 静态常量同理：`Cascader.SHOW_CHILD` → 顶层 `CASCADER_SHOW_CHILD`。

| Batch  | Vue 顶层组件 / 常量                                                                                                  | 对标 ant 名                                                                                   | 关键能力                                                                                                                                                                  | 状态 |
| ------ | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| L-2.1  | `Textarea`（`<c-textarea>`）                                                                                         | `Input.TextArea`                                                                              | 多行文本：`autoSize: bool \| { minRows, maxRows }` / `showCount` / `allowClear` / `count` / `maxLength`；底层 `<textarea>`                                                | [x]  |
| L-2.2  | `InputSearch`（`<c-input-search>`）                                                                                  | `Input.Search`                                                                                | 搜索框：`enterButton: bool \| string \| VNode` / `loading` / `@search` 事件 / `addon-after` slot                                                                          | [x]  |
| L-2.3  | （可选）`InputPassword`（`<c-input-password>`）                                                                      | `Input.Password`                                                                              | 密码框：`iconRender` slot / `visibilityToggle: bool \| { visible, onVisibleChange }`。**仅在差异化能力超出现有 `<c-input type="password" show-password>` 时才拆独立组件** | [—]  |
| L-2.4  | `InputOtp`（`<c-input-otp>`）                                                                                        | `Input.OTP`（v5.18+）                                                                         | 一次性密码：`length` / `formatter` / `mask` / `@change(value, { index })`                                                                                                 | [x]  |
| L-2.5  | `ButtonGroup`（`<c-button-group>`）                                                                                  | `Button.Group`                                                                                | 按钮组：`size` / `disabled` 透传。**实现在 L-1.1，静态属性挂载已在后续 commit 移除**（仅平铺导出）                                                                        | [x]  |
| L-2.6  | `CheckableTag` / `CheckableTagGroup`（`<c-checkable-tag>` / `<c-checkable-tag-group>`）                              | `Tag.CheckableTag`                                                                            | 可勾选标签：`v-model:checked` / 多选 group                                                                                                                                | [x]  |
| L-2.7  | `ImagePreviewGroup`（`<c-image-preview-group>`）                                                                     | `Image.PreviewGroup`                                                                          | 多图预览：`items` / `preview={ visible, onVisibleChange, current }` / 切换上一张下一张                                                                                    | [x]  |
| L-2.8  | `AvatarGroup`（`<c-avatar-group>`）                                                                                  | `Avatar.Group`                                                                                | 头像组：`maxCount` / `maxStyle` / `maxPopoverPlacement` / `maxPopoverTrigger`                                                                                             | [x]  |
| L-2.9  | `BadgeRibbon`（`<c-badge-ribbon>`）                                                                                  | `Badge.Ribbon`                                                                                | 缎带徽标：`text` / `color` / `placement`                                                                                                                                  | [x]  |
| L-2.10 | `CardMeta` / `CardGrid`（`<c-card-meta>` / `<c-card-grid>`）                                                         | `Card.Meta` / `Card.Grid`                                                                     | 卡片元信息 + 网格                                                                                                                                                         | [x]  |
| L-2.11 | `ListItemMeta`（`<c-list-item-meta>`）                                                                               | `List.Item.Meta`                                                                              | 列表项元信息：`avatar` slot / `title` / `description` slot                                                                                                                | [x]  |
| L-2.12 | `TableColumn` / `TableColumnGroup` / `TableSummary`（`<c-table-column>` 等）                                         | `Table.Column` / `Table.ColumnGroup` / `Table.Summary`                                        | 模板式列声明（替代 `columns` 数组）+ 汇总行；Vue 模板用 v-for + 子组件描述列                                                                                              | [x]  |
| L-2.13 | `DirectoryTree`（`<c-directory-tree>`）                                                                              | `Tree.DirectoryTree`                                                                          | 目录树：默认展开 / 文件图标                                                                                                                                               | [x]  |
| L-2.14 | `DropdownButton`（`<c-dropdown-button>`）                                                                            | `Dropdown.Button`                                                                             | 下拉按钮：`menu` / `buttons-render` slot / 主按钮 + dropdown 双触发                                                                                                       | [x]  |
| L-2.15 | `SkeletonButton` / `SkeletonAvatar` / `SkeletonInput` / `SkeletonImage` / `SkeletonNode`（`<c-skeleton-button>` 等） | `Skeleton.Button` / `Skeleton.Avatar` / `Skeleton.Input` / `Skeleton.Image` / `Skeleton.Node` | Skeleton 5 形态变体                                                                                                                                                       | [x]  |
| L-2.16 | `FormErrorList`（`<c-form-error-list>`）                                                                             | `Form.ErrorList`                                                                              | 错误列表组件，独立于 FormItem 自渲染                                                                                                                                      | [x]  |
| L-2.17 | `SubMenu` / `MenuItemGroup` / `MenuDivider`（`<c-sub-menu>` 等）                                                     | `Menu.SubMenu` / `Menu.ItemGroup` / `Menu.Divider`                                            | **当前 ccui 已平铺**；本批仅文档表述对齐（确认导出 + 写明 `<c-sub-menu>` 用法）                                                                                           | [x]  |
| L-2.18 | `StatisticTimer`（`<c-statistic-timer>`）                                                                            | `Statistic.Timer`（v5.25+）                                                                   | 计时器（替代 Countdown）                                                                                                                                                  | [ ]  |
| L-2.19 | Calendar 加 `header` slot + `headerRender` 用 slot 替换                                                              | `Calendar.Header` + `headerRender`                                                            | **不拆顶层组件**，Calendar 内部新增 `header` slot（Vue 化 ant render prop）                                                                                               | [ ]  |
| L-2.20 | `ErrorBoundary`（`<c-error-boundary>`）                                                                              | `Alert.ErrorBoundary`                                                                         | 错误边界，Vue 内部用 `onErrorCaptured` 实现；**不挂到 Alert**                                                                                                             | [ ]  |
| L-2.21 | Layout 内 Sider 扩 `breakpoint` / `onBreakpoint` / `zeroWidthTriggerStyle` / `reverseArrow`                          | `Layout.Sider.*` props                                                                        | **不拆组件**，Sider 现有组件加 props；现有 `<c-sider>` 已平铺                                                                                                             | [ ]  |
| L-2.22 | `SpaceCompact`（`<c-space-compact>`）                                                                                | `Space.Compact`                                                                               | 输入紧凑组合                                                                                                                                                              | [ ]  |
| L-2.23 | Splitter 内 SplitterPanel 加 `showCollapsibleIcon` + `orientation` 别名                                              | `Splitter.Panel.showCollapsibleIcon`                                                          | **不拆组件**，`<c-splitter-panel>` 已平铺；本批补 props                                                                                                                   | [ ]  |
| L-2.24 | 顶层常量 `CASCADER_SHOW_CHILD` / `CASCADER_SHOW_PARENT`                                                              | `Cascader.SHOW_CHILD` / `.SHOW_PARENT`                                                        | **不挂命名空间**，从 `vue3-ccui` 顶层 export                                                                                                                              | [ ]  |
| L-2.25 | 顶层常量 `TREE_SELECT_SHOW_PARENT` / `TREE_SELECT_SHOW_CHILD` / `TREE_SELECT_SHOW_ALL`                               | `TreeSelect.SHOW_*`                                                                           | 同上，顶层 export                                                                                                                                                         | [ ]  |

---

## Tier L-3 — 命令式 / Hook API（每批 3–5 天）

| Batch | 范围                                                                                                                                                                            | 用途                                                                                                                                                                       | 状态 |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| L-3.1 | `Modal.confirm` / `Modal.info` / `Modal.success` / `Modal.error` / `Modal.warning` / `Modal.destroyAll` / `Modal.update`                                                        | 命令式确认弹窗 + 静态实例（纯函数调用，跟语言无关）                                                                                                                        | [ ]  |
| L-3.2 | `useModal()` composable                                                                                                                                                         | Vue 化：返回 `{ modal, holder }`，`holder` 是 Vue 组件，模板写 `<component :is="holder" />`；承载 confirm 系列的上下文（替代 ant `[modal, contextHolder]` 元组）           | [ ]  |
| L-3.3 | `useMessage()` composable                                                                                                                                                       | 同上，Vue composable + `<host>` 组件，不照搬 React Hook 元组返回                                                                                                           | [ ]  |
| L-3.4 | `useNotification()` composable                                                                                                                                                  | 同上                                                                                                                                                                       | [ ]  |
| L-3.5 | message / notification 通用增强：`stack` / `maxCount` / `pauseOnHover` / `role`（aria） / 多 `placement`（v5.23） / `top`/`bottom` 居中位 / `duration` 单位改秒（保留毫秒兼容） | 通知体验对齐 ant                                                                                                                                                           | [ ]  |
| L-3.6 | `useForm()` composable（**可选**）                                                                                                                                              | Vue 主路径已经是 `<c-form ref="formRef" />` + `formRef.value.validate()`，这条只在确实需要"游离 form 实例 hot-swap"等高级场景再做；不是必交付项。**默认 [—]，不阻塞 v2.0** | [—]  |
| L-3.7 | `Typography.Text` / `.Title` / `.Paragraph` / `.Link` 的 `copyable` / `editable` / `ellipsis` 三大交互                                                                          | 文案展示标配；render props 全部翻成 slot（`copy-icon` / `edit-icon` / `expand-text` 等 slot）                                                                              | [ ]  |

---

## Tier L-4 — 文档示例补齐（每批 2–4 天，按 demo 缺口大小排）

> 数据来自 per-component/ 各文件「缺失 ant demo」节。

| Batch | 范围                                                                               | demo 增量 | 状态 |
| ----- | ---------------------------------------------------------------------------------- | --------- | ---- |
| L-4.1 | Rate（缺 12） / Result（缺 10） / Progress（缺 9）                                 | +31 demo  | [ ]  |
| L-4.2 | Avatar / Badge / Alert / FloatButton（各缺 8+）                                    | +32 demo  | [ ]  |
| L-4.3 | Affix / Spin / InputNumber / Empty / Segmented / Flex（各缺 8+）                   | +48 demo  | [ ]  |
| L-4.4 | Mentions / Collapse / Card / List / Image / Statistic / Divider / Grid（中等缺口） | +35 demo  | [ ]  |
| L-4.5 | Cascader / DatePicker / Tooltip / Popover（缺 6–8）                                | +28 demo  | [ ]  |
| L-4.6 | Table（25 demo 缺口，与 L-2.12 配套交付）                                          | +25 demo  | [ ]  |
| L-4.7 | Form（28 demo 缺口，与 L-1.6 + L-3.6 配套交付）                                    | +28 demo  | [ ]  |
| L-4.8 | Typography（与 L-3.7 配套交付）+ Calendar（与 XL-2 配套交付）                      | +20 demo  | [ ]  |

---

## Tier XL — 架构 / Breaking 演进（每批 1–2 周）

| Batch | 范围                                                                                                                                                                                                            | 影响                                                                                  | 风险                        | 状态 |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------- | ---- |
| XL-1  | Form.Item `prop` → `name` 切换为主名，`prop` 保留 deprecated 至下一大版本                                                                                                                                       | docs 几十处 :::demo 重写 + 测试用例改                                                 | 中（breaking 但有别名兼容） | [ ]  |
| XL-2  | Calendar 从原生 `Date` 迁到 `Dayjs`（对齐 DatePicker 系），引入 `valueFormat` Vue 协议                                                                                                                          | Calendar 全量重写 + valueFormat 协议引入                                              | 高（数据协议变更）          | [ ]  |
| XL-3  | 全量 deprecation policy 落地：旧 prop 在 dev mode 触发 console.warn（每个 key 一次性，避免噪音），文档加 deprecated 标记，定一个删除时间窗                                                                      | 影响所有 deprecated 标记的 prop（命名差异表 21 项 + Tag.bordered + InputNumber size） | 低                          | [ ]  |
| XL-4  | 跨组件 ARIA 完整审计 + 键盘导航补齐（Cascader / Menu / Tree / DatePicker 系 / Dropdown / Tabs 等）                                                                                                              | 30+ 组件键盘 + screen reader 测试                                                     | 中                          | [ ]  |
| XL-5  | 国际化二期：DatePicker 系 dayjs/locale 包接入 + 完整 enUS / 其他语言包覆盖                                                                                                                                      | locale 接口扩展 + 包体积管理                                                          | 中（需要权衡 dayjs 体积）   | [ ]  |
| XL-6  | Element Plus 风格 API 全量切换到 Ant 风格主名（L-1 + M-A5 完成后），旧名彻底转为 deprecated 兼容层；同步把所有 render-prop 翻译成 slot；README 与 introduce.md 强调「Vue 组件库 / 对标 Ant Design 视觉 + 心智」 | README 表述同步 + 公开 v2.0 升级指南                                                  | 高（breaking 升大版本）     | [ ]  |

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
