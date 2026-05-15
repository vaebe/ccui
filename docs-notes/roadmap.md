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
| M-A1  | `variant: 'outlined' \| 'filled' \| 'borderless' \| 'underlined'`（v5.13.0+）                                                                                             | Input / InputNumber / Select / Cascader / AutoComplete / Mentions / DatePicker / RangePicker / TimePicker / TreeSelect / ColorPicker / Textarea（如有）共 12 个 | +24          | 每组件 4 种 variant 视觉对齐 Ant；提供 demo「Variants」一节                                                                                                                                         | [x]  |
| M-A2  | `classNames` / `styles` 语义化 DOM 钩子（v5.18.0+）                                                                                                                       | 录入 12 + 展示 8（Table / Avatar / Badge / Card / List / Image / Tree / Calendar）+ 反馈 5（Modal / Drawer / Alert / Notification / Message）共 25 个           | +25          | 每组件至少 3 个语义化区域（root / popup.root / popup.listItem 等）可独立 className 注入                                                                                                             | [ ]  |
| M-A3  | `status: 'error' \| 'warning'` 拉齐                                                                                                                                       | 8 个未接入的录入（Input / InputNumber / DatePicker / RangePicker / TimePicker / Mentions / AutoComplete / TreeSelect）+ Form item 联动检查                      | +16          | status='error' / 'warning' 时边框、阴影、图标对齐；Form 校验失败自动透传                                                                                                                            | [x]  |
| M-A4  | `prefix` / `suffixIcon` / `allowClear={ clearIcon }` / `loadingIcon` / `removeIcon` / `expandIcon` 自定义图标钩子（Vue：prop 接 string Iconify name；同名 slot 高优先级） | 10 个录入                                                                                                                                                       | +20          | 每个图标钩子同时支持 prop 形式（string / VNode）与同名 slot；slot 优先级高于 prop                                                                                                                   | [ ]  |
| M-A5  | 命名差异统一表（21 项）加 Ant 别名层，旧名 deprecated                                                                                                                     | Button / Input / Modal / Drawer / Tooltip / Popover / Popconfirm / Form 7 个                                                                                    | +30          | `open` ↔ `visible`、`title` ↔ `content`、`htmlType` ↔ `nativeType`、`addonBefore/After` ↔ `prepend/append`、`mouseEnterDelay/LeaveDelay` ↔ `showAfter/hideAfter` 等同时支持，旧名 runtime warn 一次 | [ ]  |

**单批合并建议**：每批一个 commit。M-A1 是最大头，建议先做。

**🗑 2026-05-16 下线 Tour 组件（不再对标 Ant，永不交付）**：业务不需要同步 Tour。物理删 `packages/ccui/ui/tour/` + `packages/docs/components/tour/` + 顶层 `vue-ccui.ts` 1 import / 1 install / 1 export + zh/en sidebar 1 入口 + `resolver/src/components.ts` `CTour` mapping + `resolver/README` 组件清单。roadmap M-B10 行物理删；Tier M-B 由 10 批缩为 9 批。**不再加回 roadmap 待办列**。

**🗑 2026-05-16 下线 6 组件（不再对标 Ant，永不交付）**：`qr-code` / `list` / `list-item-meta` / `card-grid` / `form-error-list` / `error-boundary`。理由：业务不需要同步这些组件。物理删除 6 ccui/ui 目录 + 6 docs 目录 + 顶层 `vue-ccui.ts` 7 export（含 `ListItem`）+ zh/en sidebar 5 入口 + `resolver/src/components.ts` 3 映射（`CList` / `CListItem` / `CQRCode`；其余 4 个 resolver 原本就漏注册）+ `resolver/test` 1 断言 + `resolver/README` 组件清单。跨组件 docs 同步删 `card/index.md` 卡片内宫格段、`form/index.md` 错误汇总段 + FormErrorList API 表 + 文末关键交付提及。roadmap L-2 行 L-2.11 / L-2.16 / L-2.20 物理删，L-2.10 改写为仅 CardMeta（注 CardGrid 下线）；已交付要点段同步删 L-2.11 / L-2.16 / L-2.20 + L-2.10 改写。测试基线 1976 → 1906（-70，含 list +14 / list-item-meta 8 / card-grid 9 / form-error-list 9 / error-boundary 9 / qr-code + util/install.test.ts 1 项 List 入口 共 21）。**不再加回 roadmap 待办列**，未来路线不再覆盖这 6 个组件。

**✅ M-A3 已交付（2026-05-15）**：1954 → 1976 测试（+22）。Tier M-A 第三批 —— `status='error'|'warning'` 在 8 个录入组件上拉齐，并补齐 Form item 双向联动（class 透传 + change/blur 自动 validate）。要点：

- **影响范围**：Input / InputNumber / Mentions（之前无 formItem inject 或 status prop 完全没接入）+ DatePicker / RangePicker / TimePicker / AutoComplete / TreeSelect（之前已有 inject + class 输出，本批补 blur 触发 validate + 测试覆盖）。
- **三类组件按现状差异化处理**：
  - **Input**：status prop / class 已有，本批新加 `inject(formItemInjectionKey)` + `mergedStatus = computed(() => props.status || formItem?.validateStatus.value)`；change / blur 同时触发 `formItem?.validate('change' | 'blur')`。
  - **InputNumber**：完全没有 status —— 新加 `InputNumberStatus` type + `status` prop + 根 class `--status-${mergedStatus}` + SCSS `&--status-error/warning`（边框层与 Input 一致在根元素，与 `--focused` / `--glow` 叠加时边框 + outline 颜色对齐 Ant）+ formItem inject + change / blur 触发 validate。
  - **Mentions**：之前 formItem 仅用于 validate trigger，无 status prop / class 输出 —— 新加 `MentionsStatus` type + `status` prop + 根 class + SCSS（视觉边框层在 `__textarea`，复用 variant 的 SCSS 选择器范式：`&--status-error .__textarea`）。
- **已接入 5 个统一补 blur validate**：DatePicker / RangePicker / TimePicker / TreeSelect 原先只在 `change` 触发 `formItem?.validate('change')`，本批在 input `onBlur` 处补 `formItem?.validate('blur')`，让 Form rule trigger=`'blur'` 也能生效（与 Input / InputNumber / Mentions / AutoComplete 一致）。RangePicker 的两个 input（start / end）各自独立触发 blur 校验。
- **顺手修复 auto-complete 旧 class bug**：原 `auto-complete.tsx` 用 `ns.em('status', mergedStatus.value)` 渲染 `__status--error`，但 scss 写的是 `&__wrap` 下 `&--status-error`（实际类名应是 `__wrap--status-error`）—— 旧代码 status 样式根本没生效。本批改为 `ns.em('wrap', 'status-${mergedStatus}')` 让 class 与 scss 对齐。
- **mergedStatus 优先级**：显式 `props.status` 优先于 Form 注入的 `validateStatus`，与 ant 一致；Input / Mentions 测试覆盖了「Form 注入 error + props.status='warning' → 渲染 warning」的优先级用例。
- **测试 +22**（roadmap 估 +16）：Input +4（warning 已有保留 / Form 注入 / props 优先 / change+blur trigger）/ InputNumber +4（error / warning / Form 注入 / change+blur trigger）/ Mentions +4（error / warning / Form 注入 / props 优先）/ DatePicker +2（warning / blur trigger）/ RangePicker +2（warning / start+end blur trigger）/ TimePicker +2（warning / blur trigger）/ AutoComplete +3（error / warning / Form 注入；本批顺手补的 class 修复落地测试）/ TreeSelect +2（warning / blur trigger）。比估值多 6 是因为 AutoComplete bug fix 额外多 3 + 多组件加了显式 warning 拓展。
- **docs 补齐**：Input / InputNumber / Mentions docs 在 Variants 节后加「校验状态 status」demo（error / warning / normal 三态并列对照） + Mentions / InputNumber Props 表补 `status` / `variant` 行；其余 5 组件 docs 已在之前批次写过 status 不重复。
- **commit 体例**：1 个 commit 收口（含 3 src/types/scss 新增 + 5 src tsx 补 blur validate + 1 src tsx bug 修复 + 8 test 文件 + 3 docs）。后续 M-A4 / M-A5 等 batch 沿用本批「按现状差异化补」+「Form item 双向联动测试覆盖」思路。

---

**✅ M-A1 已交付（2026-05-15）**：1906 → 1954 测试（+48）。Tier M-A 第一批 —— 12 个录入组件统一 `variant` 形态（Ant Design v5.13+：`outlined` / `filled` / `borderless` / `underlined`）。要点：

- **影响范围**：Input / InputNumber / Textarea / Mentions / Select / AutoComplete / Cascader / TreeSelect / DatePicker / RangePicker / TimePicker / ColorPicker 共 12 组件全量接入。所有组件 default `'outlined'`，对应既有视觉无 breaking。
- **共享 SCSS mixin**：在 `packages/ccui/ui/style-var/` 新建 `_form-control-variant.scss`，定义两个 mixin —— `form-control-variants`（视觉边框在根元素：Input / InputNumber / Textarea / Mentions）+ `form-control-variants-on($child)`（视觉边框在子元素：Select __selector、Cascader / TreeSelect / DatePicker / RangePicker / TimePicker __input-wrap、AutoComplete __wrap、ColorPicker __trigger）。`@forward` 到 `style-var/index.scss`，各组件 `@use '../../style-var/index.scss' as *;` 后直接 `@include`。Mixin 仅输出 3 个 modifier 块（outlined 即默认 SCSS 状态，不重复），filled focus 时 bg → bg-container + border → primary；borderless / underlined 关闭 box-shadow；underlined `border-bottom-color: primary-hover` hover 反馈。
- **复合组件 `--open` / focus 不冲突**：mixin 只覆盖 base + hover，`--open` 时 trigger 的 primary 边框由组件原有规则负责；不引入新 `:focus-within` 规则，避免和 `--open &__selector { border: primary }` 产生 specificity 战。
- **types**：每组件 `*-types.ts` 增 `export type XxxVariant = 'outlined' | 'filled' | 'borderless' | 'underlined'` + `variant` prop（default `'outlined'`）；type 命名按组件局部化，避免全局污染。
- **tsx**：每组件根 class 增 `[ns.m(\`variant-${props.variant}\`)]`，对应 mixin 生成的 `&--variant-xxx` 选择器；composite 组件（Select / Cascader 等）的根 modifier 配合 mixin 的 `&--variant-filled &__selector` 选择器命中子元素的边框层。
- **测试 +48**：每组件 4 个 variant render test（默认 outlined / filled / borderless / underlined）。Input 33 → 37 / InputNumber 25 → 29 / Textarea 34 → 38 / Mentions +4 / Select 59 → 63 / 其余 7 个 composite 组件各 +4。
- **文档「Variants」节**：12 组件各加 1 个 demo —— `c-segmented v-model="variant"` 4 选项切换，绑定到组件 `:variant`，演示视觉差异；写作风格与 L-4 系列一致。
- **不演示 ccui 不存在的边框层**：mentions / auto-complete / color-picker 用 hardcoded `border: 1px solid #d9d9d9` 而非 `$ccui-color-border`，variant mixin 通过选择器 specificity（`&--variant-filled &__textarea`）+ `!important`-free 覆盖；CSS 顺序优先级保证 mixin 写在原边框规则后即生效。
- **commit 体例**：1 个 commit 收口本 batch（含 12 组件 src + 12 docs + 1 共享 SCSS + 12 test 文件）。后续 M-A2 / M-A3 等 batch 沿用本 mixin 思路（M-A2 classNames / styles 语义化钩子也能复用 form-control 概念）。

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

**✅ L-4.7 已交付（2026-05-15）**：测试数不变（纯文档 demo）。Tier L-4 Form demo 补齐（与 L-1.6 + L-3.6 配套；L-3.6 标 [—] 不做，本批独立推进）。要点：

- **demo 净增 +7 块**：7 → 14（基本用法 / 表单校验 / 初始值和依赖校验 / **函数式 rules** / **warningOnly** / **hasFeedback** / **requiredMark 三态** / 动态字段 Form.List / 不同布局 / **栅格 labelCol / wrapperCol** / **全表 disabled** / 实例方法 / 跨表单联动 / **`<c-form-error-list>` 错误汇总** / 字段保留策略）。roadmap 表估 +28 是按 ant 全集估，**ccui Form API 本身已基本对齐**，所以 +7 已覆盖现 API 表面的全部 demo 维度（剩余 ant 专属 demo 如 `dependencies` 跨子表单、`scrollToFirstError` 容器内滚动等待对应 prop 接入再补）。
- **函数式 rules**：双业务示例 —— `confirmRules: (m) => [{ validator: (_r, v) => v === m.password || '两次密码不一致' }]` confirm 密码 + `phoneRules: (m) => [{ required: !m.email, message: '邮箱为空时手机必填' }]` 互斥字段；配 `:dependencies="['password']"` 让 password 变化时 confirm 重新校验。
- **warningOnly 警告级规则**：弱密码（< 8 字符 warning，但 submit 通过）+ 价格异常（> 1000 warning，业务允许通过），凸显 `warningOnly: true` 与默认 `required` / `validator` 的区别（前者不阻塞 form-level submit）。
- **hasFeedback 校验状态图标**：Form 级 `has-feedback` 默认开启 + 单 FormItem `:has-feedback="false"` 覆盖关闭 + `validate-status="warning"` 外部强制 warning 三组并列，演示 ✓ / ✕ / ! / ◌ 四态图标渲染逻辑（FormItem 显式优先于 Form 级）。
- **requiredMark 三态对照**：`c-segmented` 切换 `true` / `false` / `'optional'`；`true` 必填字段左侧加 `*`、`false` 不显示标记、`'optional'` 非必填字段右侧加 `(optional)`（移动端常用范式）。
- **栅格 labelCol / wrapperCol**：Form 级 `{ span: 6 }` + `{ span: 16 }` 默认；单 FormItem 显式 `{ span: 4 }` + `{ span: 20 }` 覆盖；最后一行 `:wrapper-col="{ offset: 6, span: 16 }"` 对齐输入框列做按钮排版。labelCol 优先于 `labelWidth`（已写入 Form Props 表说明）。
- **全表 disabled / 提交中态切换**：submit 1.5s 内 `:disabled="submitting"` + 按钮 `loading + 文案切换 + 完成解锁`，最常见的「保存中锁表」业务范式。
- **`<c-form-error-list>` 错误汇总**：新组件首次进入文档 —— `:errors` 模拟后端字段级错误数组 + `:warnings` 风险提示 + `help` 兜底文案（三者全空时不渲染）；适合后端字段错误聚合到 form 顶部统一展示的业务范式。
- **API 表补 FormErrorList**：本组件之前未在 docs 列出，本批补 3 字段 props 表 + 渲染优先级（errors > warnings > help）+ 自带 `role="alert"` + `aria-live="polite"` 说明。
- **API 表补 FormRule**：原 FormItem props 表只标 `rules: FormRule | FormRule[] | (model) => ...`，本批增 FormRule 完整字段表（required / message / trigger / type / min / max / len / pattern / enum / whitespace / warningOnly / validator 11 字段 + 各自类型签名）。
- **写作约定**：`<script setup lang="ts">` 风格 / 单 demo 单功能 / 业务场景命名（弱密码 / 价格异常 / 后端错误聚合 / 保存中锁表）便于业务直接复制 / disabled / submitting 类异步业务用 setTimeout 模拟 + 显式 try/catch / 函数式 rules 用 `_r` / `_v` 忽略未使用参数与 ESLint 配置一致。
- **测试 +0**（纯文档 demo），全量回归 1906 不变（104 文件 / 1906 用例）。

**✅ L-4.6 已交付（2026-05-15）**：测试数不变（纯文档 demo）。Tier L-4 Table demo 补齐（与 L-2.12 模板式列声明配套交付）。要点：

- **demo 净增 +8 块**：7 → 15（Basic / **模板式列声明** / **自定义单元格渲染** / **树形数据** / Sort And Filter / Pagination / **受控分页** / 固定列 / 展开行 / 合并单元格 / Row Selection / **单选 + 实时统计** / **loading / size / showHeader** / **自定义空态** / **change 事件全量追踪**）。roadmap 表估 +25 是按 ant 全集估，**ccui Table API 已基本对齐 ant**，+8 已覆盖现 API 表面的全部 demo 维度（剩余 ant 专属 demo 如 `expandRowByClick` 配合 `rowExpandable`、`scroll.y` 配 `tfoot fixed='bottom'` 等待场景出现再补）。
- **模板式列声明（L-2.12 配套）**：三组件首次合体登场 —— `<c-table-column>` + `<c-table-column-group>`（成绩三列分组到「成绩」分组表头）+ `<c-table-summary>`（`<tr><td>合计</td>...</td></tr>` 模板式 tfoot）；与 `:columns` 数组互斥（数组非空优先）。同时演示 ColumnGroup 让 thead 渲染成「分组标题 + 子列标题」双行结构。
- **自定义单元格渲染**：三种写法并列对照 —— 列上 `customRender: ({ text }) => \`¥${text.toLocaleString()}\`` 函数式（薪资千分位）+ 全局 `#body-cell="{ column, record }"` slot 按 `column.key` 区分（状态徽章 + 操作按钮）+ 全局 `#header-cell="{ column }"` slot 自定义表头（💰 Salary 图标前缀）。**重点**：`#body-cell` 与 `#header-cell` 是**全局 slot**（非 per-column），需自行 `v-if="column.key === 'xxx'"` 分发，对应 ant React 端 per-column slot key 写法的 Vue 化等价。
- **树形数据**：`children` 字段自动收集子节点 + `:indent-size="24"` 控制每层缩进（默认 15px），3 层嵌套（部门 → 小组 → 团队）业务示例。`childrenColumnName` 默认 `children`，可改字段名避免冲突。
- **受控分页**：`pagination` 完整对象 `{ current, pageSize, total, showSizeChanger, pageSizeOptions }` + `@update:pagination` 受控回写；28 条数据 5/10/20 三档分页可切，业务侧最常见的后端分页联动范式。
- **单选 + 实时统计**：`rowSelection.type = 'radio'` 把多选改单选；配 `getCheckboxProps: (r) => ({ disabled: r.disabled })` 锁定企业版（不可选）；`computed selected` 实时映射当前选中行的「套餐 + 价格」到表格下方汇总区，业务侧购买套餐场景最常见组合。
- **loading / size / showHeader**：`c-segmented` 切 size 三档 + 复选框切 showHeader + 「刷新」按钮 setTimeout 1.2s 模拟 loading，三组开关合一个 demo 覆盖三 prop。
- **自定义空态**：`#empty` slot 接管「无数据」占位区 —— emoji + 文案 + 「创建第一条」引导按钮 + `c-segmented` 切「空数据 / 有数据」对照；业务侧最常用于「未筛选到结果」与「真的没数据」分文案。
- **change 事件全量追踪**：`@change="(pagination, filters, sorter, currentData) => ..."` 4 参数 destructure + JSON.stringify pretty-print 到 `<pre>`；最常见的后端 API 联动 / 埋点 / 持久化筛选状态范式，明确演示 sorter 是 `{ columnKey, order }` 对象、filters 是 `Record<columnKey, value[]>`、currentData 是当前页过滤后的数据数组。
- **API 表补全**（之前文档只 Table props 表 + TableColumn 表 + TableExpandable 表）：
  - **Table Slots 表** 4 slot（default / body-cell / header-cell / empty）+ 全局 slot 性质说明
  - **Table props 补** `childrenColumnName` / `indentSize` 两字段（树形数据控制）
  - **TablePaginationConfig 表** 5 字段（current / pageSize / total / showSizeChanger / pageSizeOptions）
  - **TableRowSelection 表** 9 字段（type / selectedRowKeys / defaultSelectedRowKeys / columnWidth / hideSelectAll / fixed / getCheckboxProps / onChange / onSelect / onSelectAll）
  - **TableColumn 表补** `children`（来自 ColumnGroup 自动收集）
  - **TableColumn 子组件 props 命名调整说明** 段：`key` → `column-key`（避开 Vue 保留属性），子组件 slot `customRender` 接 `{ text, record, index, column }`
  - **TableColumnGroup 表** 4 字段（title / align / fixed / onHeaderCell）
  - **TableSummary 表** 1 字段（fixed）+ default slot 直接写 `<tr><td>` 的语义说明
- **写作约定**：`<script setup>` 风格 / 单 demo 单功能 / 业务场景命名（成绩分组合计 / 套餐选择 / 部署刷新 / 后端分页 / 引导按钮）便于业务直接复制 / `customRender: ({ text }) => \`¥${text.toLocaleString()}\`` 类简短业务格式化用箭头函数 / `c-segmented` 切换状态用 ref（与 L-4.3 Spin 多 Spin 网格 / L-4.4 Image 受控预览写法一致） / `<c-table-summary>` default slot 直接写原生 `<tr><td>` 而非 wrap div（Table 内部 `h('tfoot', [slot()])` 渲染时表格 DOM 语义需要 tr/td）。
- **测试 +0**（纯文档 demo），全量回归 1906 不变（104 文件 / 1906 用例）。

**✅ L-4.5 已交付（2026-05-15）**：测试数不变（纯文档 demo）。Tier L-4 Cascader / DatePicker / Tooltip / Popover demo 补齐 + Tooltip / Popover 全文从 Options API 重写为 `<script setup>`。要点：

- **demo 净增 +20 块 + 16 个 Options API → script setup 重写**：Tooltip 8 → 13（+5，并重写原 8 个）/ Popover 8 → 14（+6，并重写原 8 个）/ Cascader 11 → 16（+5）/ DatePicker 15 → 19（+4）。roadmap 估 +28 demo；本批 +20 新增 + 16 重写实际工作量与 +28 全新对齐。
- **Tooltip 全文重写为 script setup**（核心）：原 8 个 demo 全是 `export default { setup() { return {} } }` 风格，本次全部翻新；同时把 12 placement demo 从一行行 hard-coded 改为 `v-for` 数组循环（4 组 placement 数组 + 单一模板循环渲染），代码减少 70+ 行。
- **Tooltip 扩 +5**：自定义背景色 color（品牌蓝 / 成功绿 / 警告红 / 渐变 紫粉 四示例）/ arrow={ pointAtCenter: true }（默认贴 edge vs 对准触发器中心 vs 无箭头 三态并列）/ 受控 `v-model:open` 新名（旧 `v-model:visible` 仍兼容但 deprecated）/ `mouseEnterDelay` / `mouseLeaveDelay` 新名（旧 `showAfter` / `hideAfter` deprecated + ::: tip block 说明）/ show / hide 完整事件追踪（before-show / show / before-hide / hide 4 事件最近 5 条日志）/ 业务图标提示（邮箱字段 `?` 图标 + API 密钥 `!` 红色图标，最常见的表单辅助说明范式）。
- **Popover 全文重写为 script setup**：原 8 个 demo 全是 Options API 风格，本次全部翻新；同时 12 placement demo 同 Tooltip 走 v-for 数组循环简化；虚拟触发 demo 把 `handleShow/handleHide` 两个函数压缩为内联 `@mouseenter="visible = true"`；嵌套操作 demo 移到「ref hide 方法」一节，去掉无意义的中间 `visible` ref。
- **Popover 扩 +6**：自定义 color / arrow.pointAtCenter / **width 弹层宽度**（短内容固定 280px 对比示例，业务卡片对齐场景）/ 受控 v-model:open（与 Tooltip 对称）/ mouseEnterDelay/Leave 新名（与 Tooltip 对称 + tip block）/ **ref expose hide 方法**（删除确认场景：通过 `popRef.value.hide()` 在事件回调内主动关闭，对应 Popover Exposes 表）/ **业务用户卡 hover**（用户列表 hover 名字弹出完整用户卡：头像 + 角色 + 描述，IM / 协作工具最常见悬浮卡片范式，3 用户 + 不同色头像）。
- **Cascader 扩 +5**：notFoundContent 自定义空数据占位（emoji + 文案，配合空 options 数组）/ status 三态（error / warning / success 并列对照）/ clearable=false 锁定已选路径（业务关键字段如归属部门）/ placement 4 方位（bottomLeft / bottomRight / topLeft / topRight 并列对照）/ expandIcon 自定义 + autoFocus 自动聚焦（替换默认 `›` 为 `→` + 挂载后立即 focus，「打开弹窗后第一个表单项」场景）。
- **DatePicker 扩 +4**：weekStart 周起始（0 周日 vs 1 周一并列对照）/ status 三态（error / warning / success）/ **change(value, dateString) 双参追踪**（重点演示第二参数永远是按 format 格式化字符串，无论 valueFormat 是 string / date / number 都一致）/ **panel-change(mode, viewMonth) 事件追踪**（面板上钻 date ↔ month ↔ year 时触发，常用于日历埋点；提示用户点年份 / 月份头部触发）。
- **写作约定**：`<script setup>` 风格 / 单 demo 单功能 / 业务场景命名（图标提示 / 用户卡 hover / 删除确认 / 归属部门锁定）便于业务直接复制 / 12 placement demo 统一走 v-for 4 组数组循环（tops / lefts / rights / bottoms）大幅压缩重复模板 / Tooltip / Popover 旧名 / 新名共存 demo 加 `::: tip` block 说明 deprecated 路径 + 自动映射策略，与 InputNumber size 旧名警告范式一致。
- **测试 +0**（纯文档 demo），全量回归 1906 不变（104 文件 / 1906 用例）。

**✅ L-4.4 已交付（2026-05-15）**：测试数不变（纯文档 demo）。Tier L-4 Mentions / Collapse / Card / List / Image / Statistic / Divider / Grid demo 补齐。要点：

- **demo 净增 +40 块**：Mentions 5 → 10（+5），Collapse 6 → 11（+5），Card 6 → 11（+5），List 4 → 10（+6），Image 6 → 11（+5），Statistic 6 → 11（+5），Divider 6 → 10（+4），Grid 7 → 12（+5）。roadmap 估 +35，本批 +40 因 List 缺口最大（原文档只 4 个 demo 且无 API 表，本次顺手补齐三表）。
- **Mentions 扩 +5**：caseSensitive 大小写对照 / autoSize（true 无限制 + `{ minRows: 2, maxRows: 6 }` 双示例）/ placement=top 浮层向上弹（评论框场景）/ notFoundContent 自定义空数据占位（emoji + 文案）/ #option slot 自定义渲染（头像 + 姓名 + 角色 scope `{ option, index }`）。
- **Collapse 扩 +5**：单 item disabled + `:show-arrow="false"` 隐藏箭头 / 嵌套 collapse（外 ghost + 内 bordered，强调层级）/ FAQ 业务（accordion + 标题加 Q1 序号 + 长答案）/ 受控外部全展/全收按钮（v-model 接 expand/collapse all）/ 表单分组（每段 collapse-item 内嵌 c-form 字段，业务最常见模式）。
- **Card 扩 +5**：`<c-card-grid>` 卡片内宫格（快捷入口 6 格，body-style padding=0 让 grid 贴边）/ `<c-card-meta>` 元数据（商品卡封面图 + 用户卡头像 双示例，对标 ant Card.Meta）/ 卡片底部操作（default slot 内 c-divider + 右对齐按钮，对标 ant footer prop）/ 仪表盘统计网格（Card + Statistic + Row/Col 4 卡片一行）/ shadow=hover 列表卡（4 卡片网格 + hover 阴影 cursor:pointer）。
- **List 扩 +6 + 三表补齐**：富信息条目（`<c-list-item>` 6 slot 全用：avatar/title/description/actions/extra + 团队成员业务）/ `<c-list-item-meta>` 模板写法（与 list-item slot 等价但更声明式，文章列表场景）/ loadMore slot（加载更多按钮 + setTimeout 模拟分页）/ 三尺寸对比（small/default/large）/ rowKey 函数形态 + split=false（无分隔线卡片风）。**API 表补齐**：原文档只 4 demo 且零 API 表，本批补 List Props 表（8 字段）+ List Slots 表（5 slot）+ ListItem Slots 表（6 slot）+ ListItemMeta Props 表 + 顶部「何时使用」节。
- **Image 扩 +5**：load/error/click 事件追踪（最近 5 条日志 + 时间戳）/ `<c-image-preview-group>` 多张图相册（items 数组传图列表）/ 受控预览（外部按钮唤起 `v-model:preview` + `{ visible, current }` 对象，配合 update:preview + change 回写）/ fallback + #error 双重兜底链（主图失败 → fallback 失败 → 走 error slot）/ 事件追踪 demo 顺带演示 click 用法。
- **Statistic 扩 +5 + Countdown 事件表补齐**：倒计时 finish + change 事件追踪（每 tick 剩余 ms + 归零切状态 + 重置按钮，format=ss.SSS）/ 字符串 value 占位（— / N/A / A+ 三示例，灰 / 黄强调样式）/ 涨跌趋势（▲ ▼ — 三 prefix + 绿 / 红 / 灰 color）/ 仪表盘 4 卡片（Card + Statistic + Row/Col 6 span x 4 列）/ 限时活动卡片（Card + Countdown + 立即领取 block 按钮，业务最常见组合）。API 表补加 StatisticCountdown Events 表（finish / change 两事件，之前文档只列 props 表漏了事件）。
- **Divider 扩 +4**：虚线 + 文案三向组合（center/left/right + dashed + content-color）/ 章节标题分隔（h3 + Divider 分章节，长表单常见排版）/ 线型动态切换（segmented 控 borderStyle，编辑/打印模式联动）/ 行内多段分组（垂直 divider 把按钮分编辑组/状态组/危险组三段，toolbar 多段排版）。
- **Grid 扩 +5**：push / pull 移位（视觉反转布局）/ 嵌套 row（外 col-16 内嵌两个 row 分 col-12 + col-24，多色块区分层级）/ 业务双栏布局（xs=24 md=6+18，移动端自动堆叠，最常见后台双栏比例）/ wrap=false 强制单行（8 张 flex:'200px' 卡片横向滚动）/ xs/md/lg ColSize 对象形态（`{ span, offset, order }` 完整对象按断点分配）。
- **写作约定**：`<script setup>` 风格 / 单 demo 单功能 / 业务场景命名（团队成员 / 商品卡 / 限时活动 / 仪表盘 / 双栏布局）便于业务直接复制 / scope slot 演示用最小 inline style 不引外部 SCSS / 倒计时 / fetch 类异步 demo 写明 setInterval/setTimeout 但不引 onBeforeUnmount 简化（Countdown 内部已自管 timer）/ 多文件不写跨文件依赖（每 demo 自包含 import + style）。
- **测试 +0**（纯文档 demo），全量回归 1906 不变（104 文件 / 1906 用例）。

**✅ L-4.3 已交付（2026-05-15）**：测试数不变（纯文档 demo）。Tier L-4 Affix / Spin / InputNumber / Empty / Segmented / Flex demo 补齐。要点：

- **demo 净增 +32 块**：Flex 7 → 12（+5），Empty 6 → 11（+5），Segmented 7 → 12（+5），Spin 6 → 11（+5），Affix 5 → 10（+5），InputNumber 8 → 15（+7）。roadmap 估 +48 是按 ant 完整 demo 集合估，**ccui 实际 API 表面较精简**（Spin 无 wrapperClassName / indicator 已 slot 化；Affix 无 onTestUpdatePosition / autoFix；Segmented 无 vertical / motion）—— +32 已覆盖现 API 表面能演示的全部能力，余 ant 专属 demo 待对应 prop 接入再补。
- **Flex 扩 +5**：`justify` 全 6 枚举对照（flex-start / center / flex-end / space-between / space-around / space-evenly 视觉对照）/ `align` 全 5 枚举对照（高 80px 容器内 + 不同字号子项凸显差异）/ wrap-reverse 反向换行 / 嵌套布局页面骨架（header + body 双栏 + footer 三段式）/ 业务工具栏与 Space 区别对比（外 Flex 两端分布 + 内 Space 操作组等距）。
- **Empty 扩 +5**：列表卡片内嵌（边框 + 邀请引导按钮）/ 搜索无结果场景（关键词输入 + 重置筛选按钮）/ description slot 复杂内容（多行 + 链接 +「接入指引 →」）/ 三尺寸对比（imageStyle.height: 32 嵌入式 / 80 默认 / 120 专题页 并列展示）/ Tabs 内嵌空态（segmented 切换 → 不同维度独立空文案）。
- **Segmented 扩 +5**：数字 value（page size 选择器，`typeof v` 实时打印验证类型回传一致性）/ 带 icon 选项（icon CSS class，渲染在 label 前）/ default slot 自定义渲染（scope `{ option }`，演示头像 + 文字团队切换）/ 单项 disabled（企业版「需联系销售」单项灰，其余可点）/ 视图切换业务（list / kanban / chart 联动占位区，最典型用法范式）。
- **Spin 扩 +5**：自定义 #indicator slot（emoji ⏳ 自旋 + 🧠💭 静态双示例 + CSS @keyframes spin）/ spinning=false 完整内容展示（订单卡片 demo）/ 异步 fetch 业务（async + try/finally 复位 loading + 模拟 1.2s 远程刷新）/ 包裹表格（toolbar 上方 + Spin 外层 + 内嵌 table 行）/ 多 Spin 网格独立（3 张统计卡片各自独立 loading，点击刷新单卡不影响相邻）。**特别说明**：types 里的 `percent` prop 在 spin.tsx 内未使用（stub 状态）—— **不写 percent 相关 demo**，遵循「不演示 ccui 不存在的 prop」原则，待后续接入实际进度渲染再补。
- **Affix 扩 +5**：自定义 zIndex（默认 10 / Modal 1000 / 需盖过 mask 取 1100+ 的取值参考）/ 多个 Affix 错开（主导航 offsetTop=0 + 筛选条 offsetTop=48 双层 sticky）/ 表格工具栏吸顶业务（搜索 + 批量操作 + 新建组合）/ 章节锚点侧边目录（左 sticky 160px 目录 + 右内容区，长文档 / 商品详情常用排版）/ 容器内 vs window 对比（左 target=window 整页贴顶、右 target=容器 仅盒内贴顶，并列对照让 target prop 语义直观）。
- **InputNumber 扩 +7**：readonly 只读（"后端计算结果展示"业务说明）/ change 事件追踪（curr/prev 双参数 + 最近 5 次变更带时间戳列表）/ 实例方法 ref（focus / blur / increase / decrease / getValue / setValue 6 个方法，外部 + - 聚焦 重置按钮联动）/ 货币输入场景（precision=2 + step=0.01 + min=0 + controls-position=right + price.toFixed(2) 展示）/ reg 正则限制（仅正整数 `/^\d+$/` + 非负小数 `/^\d+(\.\d{0,2})?$/` 双示例）/ showGlowStyle=false 关闭悬浮发光（与默认并列对照）/ 推荐新 size 名 `large/default/small`（旧 `lg/md/sm` 改为兼容值并加 `::: tip` 说明 deprecated 警告 + runtime 自动映射）。**顺手清理**：现有 8 个 demo 里全部去掉未使用的 `import { defineComponent }`（仅留 `ref`），同时把「尺寸」demo 改写为新名 + 「控制按钮位置」demo 改为新名；Props 表 `size` 行类型补充新旧名并列说明；方法表纠正——去掉源码不存在的 `select` 方法，补齐 `getValue` / `setValue` / `increase` / `decrease` 与 InputNumberInstance 接口对齐。
- **写作约定**：`<script setup>` 风格 / 单 demo 单功能 / 业务场景命名（订单工具栏 / 货币输入 / 团队切换 / 多卡片统计 / 章节锚点）便于业务侧直接复制 / scope slot 演示用最小 inline style 不引外部 SCSS / `setTimeout` 在 onBeforeUnmount 内部清理（仅 Affix / Spin 异步业务 demo 涉及，无需 cleanup 的简单 demo 不引入 onBeforeUnmount 增加阅读负担）/ Empty `imageStyle` demo 用 `:image-style="{ height: 'Xpx' }"` 而非完整 CSSProperties 字典展开（一行写完更直观）。
- **测试 +0**（纯文档 demo），全量回归 1906 不变。

**✅ L-4.2 已交付（2026-05-15）**：测试数不变（纯文档 demo）。Tier L-4 Avatar / Badge / Alert / FloatButton demo 补齐。要点：

- **demo 净增 +24 块**：Avatar 6 → 12（+6），Badge 4 → 10（+6），Alert 4 → 10（+6），FloatButton 4 → 10（+6）。roadmap 估 +32 是按 ant 完整 demo 集合估，ccui 按现 API 表面补到 +24 是覆盖现实能力的饱满度，余 ant 专属 demo 待对应 prop 接入再补。
- **Avatar 扩 +6**：单字符 / Emoji 头像（custom-text 接 emoji / VIP / 管）/ 加载失败回退（无效 img-src 自动 fallback 到文字）/ AvatarGroup 基本（独立顶层组件 `<c-avatar-group>`，max-count 限流 + N）/ AvatarGroup 自定义 +N 样式（max-style 背景色 + size=large）/ 用户列表场景（头像+姓名+岗位 三段排版）/ 评论头像（左右布局 + 时间戳）。
- **Badge 扩 +6**：自定义颜色（4 种 CSS 颜色字符串）/ offset 偏移（默认 vs [-4,4] vs [10,-10]）/ 字符串 count（NEW / HOT / 限时 角标）/ BadgeRibbon 基本（顶层 `<c-badge-ribbon>` + text / color / placement=start）/ BadgeRibbon 预设 12 色（pink/red/volcano/orange/gold/yellow/lime/green/cyan/blue/geekblue/purple 网格展示）/ 与 Avatar 组合（消息中心头像角标 + count 联动按钮）。
- **Alert 扩 +6**：banner 顶部公告（3 类型示例）/ closeText 自定义关闭文字（「知道了」/「切换到生产」）/ 图标 + 描述完整版（success/error 双示例）/ 长内容自动换行（max-width 容器约束）/ 表单错误汇总（业务场景：error type + default slot 内嵌 ul 错误列表 + dismissed 状态 + 重置按钮）/ 行内嵌入卡片（API 接入配置场景）。
- **FloatButton 扩 +6**：icon prop（带图标 + description 双层布局）/ href + target 链接跳转 / tooltip 悬浮提示 / 多按钮组合（3 个 FloatButton 按 inset-block-end 叠放，构成右下操作组）/ BackTop visibilityHeight + duration 自定义阈值与动画时长 / BackTop type=primary shape=square 自定义形状。同时**补全 API 表**：原文档只有零散表，本批补 FloatButton 完整 props 表 + BackTop 完整 props 表（visibilityHeight / duration / target / shape / type / icon 全字段）。
- **写作约定**：`<script setup>` 风格 / 单 demo 单功能 / 业务场景命名（评论头像、消息中心、表单错误汇总）便于业务侧直接复制 / 涉及绝对定位的 FloatButton demo 用 `position: relative` + 固定高度容器隔离防止覆盖文档其他内容。
- **测试 +0**（纯文档 demo），全量回归 1906 不变。

**✅ L-4.1 已交付（2026-05-15）**：测试数不变（纯文档 demo）。Tier L-4 Rate / Result / Progress demo 补齐。要点：

- **demo 净增 +21 块**：Rate 5 → 11（+6），Result 7 → 14（+7），Progress 7 → 16（+9）。roadmap 表估 +31 是按 ant 完整 demo 集合，**ccui 实际 API 表面比 ant 简化**（如 Rate 没有 `character` render / `autofocus` / `tooltips` / `desc`），所以补到 +21 已覆盖 ccui 当前能演示的全部能力，余下 10 个 ant 专属 demo 待 v2.x 把对应 prop 接入后再补。
- **Rate 重写 + 扩**：把原有 5 个 Options API 风格 demo（`export default { setup() { ... } }`）全部统一改写为 `<script setup>` 风格（与 Typography / Modal 等近期批次一致）；新增 6 个：基本使用（外部值同步显示） / 自定义星数（5/7/10 分制对比） / 自定义颜色（4 色）/ 自定义图标（心形 ❤ + 字母 A）/ 评分描述（info slot + 文案映射「极差 / 差 / 一般 / 好 / 极好」）/ change 事件追踪 / 清零按钮 / 表单集成 / 只读聚合分（商品页综合 + 描述 + 物流 + 服务 4 维度）。
- **Result 扩**：新增 7 个业务场景 demo：极简版（卡片内嵌 / 仅标题）/ 注册成功倒计时跳转（setInterval + 立即跳转 + 重置）/ 网络错误带重试计数（连续失败 N 次）/ 权限不足申请页（403 + 申请权限 / 返回首页）/ 自定义 SVG icon（带圆形勾选动画的 inline SVG）/ Modal 内嵌使用（closable=false + footer=null + 内部 c-result）/ 多按钮组合（部署完成 4 个 action）。
- **Progress 扩**：新增 9 个 API 表面 demo：不同尺寸（small/default/number/[w,h] 四态）/ 隐藏百分比（show-info=false 含 line/circle/dashboard）/ 自定义线宽（stroke-width 4/8/16 line + circle）/ 圆形 4 种 width（48/80/120/180）/ 渐变色（linear-gradient 字符串）/ 步骤式多段进度（4 步 + 各自 percent）/ 失败重试（exception → active → success 状态切换）/ 剩余时间 ETA（format 函数基于 elapsed 计算 remaining）。
- **写作约定**：每子节 `##` 标题 + 一句话说明用途 + 单 demo 单功能；脚本一律 `<script setup>`；`setInterval` / `setTimeout` 在 `onBeforeUnmount` 中清理；style 内联只为演示需要的尺寸 / 间距，不引入 SCSS 文件。
- **测试 +0**（纯文档 demo），全量回归 1906 不变。

**🟡 L-4.8（Typography 部分）已交付（2026-05-15）**：测试数不变（纯文档 demo）。Tier L-4 Typography demo 配套（与 L-3.7 交互三能力配套）。**Calendar 部分推迟到 XL-2（Calendar Dayjs 迁移）之后再做**——避免基于将被重写的 Date API 写 demo，否则随 XL-2 全部作废。当前状态 `[~]` 半交付。要点：

- **demo 块从 10 个扩到 29 个**（净增 19 个），三大节按 API 表面拆细子节，每子节单 demo 单功能：
  - **copyable +6 子节**：基本复制 / 复制不同文本（`cfg.text`） / `onCopy` 回调与计数 / 自定义 `tooltips` / 自定义图标（`copy-icon` slot 含 `{ copied }` scope） / 短延时（`copyableDelay`） / 在 Title / Paragraph / Link 上的复制（4 组件共用 prop 演示）
  - **editable +6 子节**：基本编辑 / 点文本即编辑（`triggerType: ['text']`） / icon + text 双触发组合 / `maxLength` 限制 + 实时计数 / `onStart` + `onChange` + `onCancel` + `onEnd` 四态回调追踪日志 / 自定义 `edit-icon` slot + `tooltip` 文字 / `@update:editable-text` 事件同步外部状态
  - **ellipsis +9 子节**：单行 / 多行（2/3/5 行对比） / 单向展开 / 可来回（`collapsible`） / 自定义 `expand-text` + `collapse-text` slot / `tooltip` 显示完整内容（boolean + string 两种） / 受控 `expanded` + 外部按钮 / Title 也支持 ellipsis
  - **组合 demo +1**：copyable + editable + ellipsis 三能力同时启用同一 paragraph（验证按钮渲染顺序「截断 → 编辑 → 复制」与互不干扰）
- **写作风格**：每节加 `###` 子标题 + 一句话说明用途 + `:::demo` 块；style `max-width: 300-360px` 让截断在演示环境能稳定触发；`script setup` 内的 ref 在模板内 inline arrow（`(v) => (text = v)`）走 Vue 3 setup ref auto-unwrap-on-write 机制，与现有 ccui demo 风格一致。
- **避免误导**：不写 `v-model:editable-text="text"`（这会让用户以为有标准 v-model 协议，但组件并未声明对应 `editableText` prop，只 emit `update:editable-text`）。改用 `@update:editable-text="text = $event"` 明确单向 emit 同步，文案明示「与 `onChange` 二选一」。
- **Calendar 部分推迟原因**：roadmap XL-2 计划把 Calendar 从原生 `Date` 迁到 `Dayjs` + 引入 `valueFormat` 协议，是数据协议级 breaking。当前 Calendar demo 写出来会基于 `Date` API，XL-2 后需全部重写。**等 XL-2 完成后再补这 8-10 个 Calendar demo**，留 `[~]` 半交付标记。
- 测试 +0（纯文档），全量回归 1906 用例不变，typography 组件 34 用例不变。

**✅ L-3.7 已交付（2026-05-15）**：1882 → 1906 测试（+24）。Tier L-3 Typography copyable / editable / ellipsis 三大交互（对标 ant `Typography.Text` / `.Title` / `.Paragraph` / `.Link` 的同名 props；render props 全翻 slot）。**收尾本 Tier L-3 全部 6 件交付**（L-3.6 标 [—] 不做）。要点：

- **不拆顶层组件**：Text / Title / Paragraph / Link 4 个组件已平铺；本批为它们共享的 `baseTextProps` 注入 `copyable` / `editable` / `ellipsis` 三 props，通过 `createTypographyComponent` 工厂封装统一 setup 逻辑（避免 4 处重复实现）。
- **render props 全翻 slot**（核心 [[feedback-vue-first-benchmark]]）：
  - ant `copyable.icon: (copied) => Node` → ccui slot `copy-icon` + scope `{ copied }`
  - ant `editable.icon: (editing) => Node` → ccui slot `edit-icon`
  - ant `ellipsis.symbol / expandText` 等 → ccui slot `expand-text` / `collapse-text`
  - 唯一保留 prop 的是 `tooltips: [before, after]`（数据元组不是 render），与 ant 形状一致。
- **copyable 实现要点**：
  - `navigator.clipboard.writeText` 调用 + try/catch 静默失败（用户拿不到错误就 fallback 也别炸）
  - 复制成功后 `copied=true` 切按钮 icon 为 ✓ 加 `is-copied` modifier；3 秒（可 `copyableDelay` 配）后自动恢复，timer 在 `onBeforeUnmount` 清理
  - `cfg.text` 优先；缺省时遍历 default slot 节点拼 `getSlotText` 拿文本（兼容简单文本/decoration wrapper 嵌套）
- **editable 实现要点**：
  - 默认 `triggerType: ['icon']`，点 icon 切 textarea；可配 `['text']` 让点文本本身也进入编辑；`['icon', 'text']` 同时支持
  - Enter（不带 shift）提交 + 触发 onChange + emit `update:editable-text`；Shift+Enter 留作换行（textarea 原生行为）；Escape 取消触发 onCancel
  - blur 自动提交（用户切走焦点不丢草稿）
  - 进入编辑模式时 `nextTick` 后 `textarea.focus()` 让光标立即可用
  - 受控 `editing: boolean` 通过 `watch` 同步内部 ref（外部强制开/关编辑态）
- **ellipsis 实现要点**：
  - `rows=1` 走 CSS `overflow:hidden; white-space:nowrap; text-overflow:ellipsis`；`rows>=2` 走 `-webkit-line-clamp: N`
  - `expandable: true` 单向展开（展开后按钮消失）；`'collapsible'` 双向（展开后切「收起」按钮）；受控 `expanded` boolean
  - `tooltip` 简化实现：原生 `title` attribute（jsdom 友好 + 零运行时依赖）。v2.x 可演进接 Tooltip 组件
  - **`onEllipsis` 待实现**：jsdom 没有 layout，无法在 mount 后测真实 clipping 状态；当前签名预留，回调暂不触发，留 v2.x 接 `ResizeObserver` + `measureText`
- **JSX 选择**：本批 typography.tsx 是**老文件**（pre-L-2.12 风格 h() 写就），按 [[feedback-jsx-over-h]] 「用户已落地的保持现状」原则，外层 `Text/Title/Paragraph/Link` 工厂内的内部 helper（`renderCopyBtn` / `renderEditBtn` / `renderExpandBtn` / `renderEditingInput`）全部用 JSX 新写；最外层 `h(tagName, attrs, children)` 因为 `tagName` 是动态 string（'span'/'div'/'h{N}'/'a'）保留 h() 调用（动态 component 边界）。
- **顶层 export 不变**：Typography 系列已经 export，无需改 `vue-ccui.ts`；types 中新增 `CopyableConfig` / `EditableConfig` / `EllipsisConfig` 三个 interface（隐式 export，业务侧若需要可走 `import type { CopyableConfig } from 'vue3-ccui'` 走全量 types index 已暴露的路径）。
- 文档：`packages/docs/components/typography/index.md` 新增三节「可复制 copyable」/「可编辑 editable」/「截断 ellipsis」，每节含 demo + 配置表 + slot 表；ellipsis 节加 `::: warning` block 明示 jsdom 测试限制；copyable 节加 `::: tip` block 说明 slot 替代 render props 的原则。
- 测试 +24（copyable 8 + editable 6 + ellipsis 10）：copy 按钮 DOM / 不渲染 / clipboard.writeText 调用 / cfg.text 覆盖 / onCopy 回调 / 复制后 icon 切 + 自动恢复 / copy-icon slot { copied } scope / tooltips 数组渲染 title；edit 按钮 DOM / 点击切 textarea / Enter onChange + 关闭 / Escape onCancel / triggerType=text 文本点击进编辑 / edit-icon slot；ellipsis modifier / rows=N modifier / expand 按钮 / 点击 onExpand + 去 ellipsis class / collapsible 切收起 / expand-text + collapse-text slot / tooltip=true / tooltip=string / Title 也支持 / expandable=true 单向展开。`vi.fn()` mock `navigator.clipboard.writeText`，`beforeEach` 重置 mock。1882 → 1906 全量回归通过（104 文件 / 1906 用例）。

**✅ L-3.1 + L-3.2 已交付（2026-05-15）**：1867 → 1882 测试（+15）。Tier L-3 Modal 命令式 + useModal composable（对标 ant `Modal.confirm` / `Modal.useModal` 元组的 Vue 化等价）。两批合并交付（强耦合：useModal 复用 modalFunc 命令式底座，只是包一层 parent context 注入）。要点：

- **命令式方法挂在 Modal 函数对象上，不挂子组件**：与 `[[feedback-vue-first-benchmark]]` 一致——`Modal.Header` / `Modal.Footer` 这种 React 子组件命名空间一律拆顶层平铺；但 `Modal.confirm({...})` 是**纯函数调用**，跟语言无关，保留 ant 习惯。`Modal.confirm` / `.info` / `.success` / `.error` / `.warning` / `.destroyAll` 全部挂在 Modal 上；同时全部以独立命名 export 暴露（如 `modalFunc` / `modalDestroyAll`）便于业务侧 tree-shake。
- **底层架构 `modalFunc(options, parentCtx?)`**：在 body 上 `createElement` 一个 host div，`createApp(Inner) + mount(host)`，渲染 `<Modal>` + 自定义 `default` / `footer` slot 填充 confirm 内容。`open` ref 控制开关；监听 Modal `onClosed`（动画完成事件）→ 调用 `afterClose` → `appInstance.unmount()` + 移除 host div + 从 `activeInstances` set 删除。
- **`onOk` Promise 串行**：`onOk` 返回 `Promise` 时按钮进入 loading 状态（`disabled=true` + `confirmLoading=true` 透传 Modal），resolve 后关闭；reject 不关闭（错误吞掉，调用方自行处理）。`onCancel` 同款语义。同步 `void` 返回时立即关闭。
- **`update(updater)`**：接受对象或函数 `(prev) => Partial<Options>`；用 `reactive(state)` + `Object.assign` 合并到 state（不替换整个对象，保留未指定字段）；Inner 组件根据 reactive state 自动重渲染。
- **`destroyAll()`**：模块级 `activeInstances: Set<{destroy}>`，循环调用每个 destroy（标记 `open=false`，DOM 卸载在动画完成后异步发生）。
- **`useModal()` 核心机制（**重点**）**：setup 阶段 `getCurrentInstance()` 捕获调用组件 `inst`；**懒读** `inst.provides` 在每次 `modal.confirm()` 调用时拿到当前 provides 链。**为什么必须懒读**：Vue 3 的 `provide()` Options API 走 **copy-on-write**——当组件首次 `provide()`，会把 `instance.provides` 替换为新对象（`Object.create(parent.provides)` 为原型）。如果在 useModal() setup 阶段就缓存 `inst.provides` 引用，拿到的是旧对象，看不到 Options API 后注入的 key。**必须在 confirm() 调用时**读 `inst.provides` 才是最终态。这是 hook 实现里最隐蔽的坑，注释里专门标注。
- **parent context 注入 `appInstance._context`**：modalFunc 收到 `parentCtx = { provides, appContext }` 后，把 `parentCtx.provides` + `parentCtx.appContext.provides` 都 merge 进新 app 的 `_context.provides`；同时合并 `components` 和 `directives`（让 confirm 内容里可以用全局注册的组件如 `<c-button>`）。
- **`holder` 是 noop 组件**：useModal 的 holder 不渲染任何 DOM（因为 modalFunc 自己 createApp 走独立挂载）；API 形状仍保持 `<component :is="holder" />` 与 useMessage / useNotification 一致，方便用户记忆。文档注释说明 holder 的作用是「占位标记 + 保持 API 一致」，实际 inject 链注入靠的是 `getCurrentInstance()` 捕获 + 懒读 provides。
- **不复用 Modal.tsx 内部逻辑**：confirm 走「外层 Modal + slots 填内容」的组合模式，**不重写** Modal 的 mask / Teleport / focus / Escape 关闭流程。这是为什么 confirm-types 把 maskClosable 默认改为 `false`、closable 默认 `false`、width 默认 `416` 等覆盖项独立配置，但底层关闭流程仍是 Modal 内置那套。
- **顶层 export**：`vue-ccui.ts` 加 `useModal` 命名 import + named export 块；`modal/index.ts` 把 `confirm` / `info` / ... / `destroyAll` 挂到 Modal 对象 + export `useModal` + export `ModalFuncOptions` / `ModalFuncReturn` / `UseModalReturn` 类型。
- 文档：`packages/docs/components/modal/index.md` 新增「命令式 Modal.confirm」节（5 类型 demo + Promise loading demo + update/destroy demo + destroyAll 说明）+「useModal composable」节（继承上下文 demo + tip block 「何时用模块级 vs Hook」+ UseModalReturn / ModalFuncOptions / ModalFuncReturn 三张表）。
- 测试 +15（confirm 9 + useModal 6）：confirm 双按钮 / info-success-error-warning 单按钮 / type icon modifier 类 / onOk 触发 + 关闭 / onCancel 触发 / onOk Promise loading 期间按钮 disabled / 返回 destroy+update 句柄 / update 函数形式 / destroyAll 关闭所有；useModal 返回对象不是元组 / modal.confirm 渲染 DOM / destroy+update 句柄 / info+success 类型 / **inject 父链继承 dark theme**（核心存在理由锁死） / onOk Promise loading。1867 → 1882 全量回归通过（103 文件 / 1882 用例）。

**✅ L-3.4 已交付（2026-05-15）**：1858 → 1867 测试（+9）。Tier L-3 `useNotification()` composable（与 L-3.3 useMessage 镜像，对标 ant `notification.useNotification()` 元组的 Vue 化等价）。要点：

- **与 L-3.3 useMessage 完全对称**：返回 `{ notification, holder }` 对象（NOT 元组）；hook 内部闭包独立 state；holder 通过 `<Teleport>` 挂到 body，Vue 树连父级保证 inject 链不断。
- **复用 L-3.5 全套配置**：placement（6 位）/ role / pauseOnHover / stack / maxCount / duration 归一化 / top / bottom 偏移，行为与 useMessage 一致；默认 placement `topRight`、默认 duration `4.5` 秒（与模块级 `notification` 对齐，不与 useMessage 默认值混淆）。
- **实例 id 前缀 `use-noti-N-...`**：与 useMessage 的 `use-msg-N-...` 区分；模块级 `instanceCounter` 跨 hook 实例自增。
- **顶层 export**：`vue-ccui.ts` 加 `useNotification` 命名 import + named export 块；`notification/index.ts` 同时 export `UseNotificationReturn` 类型。
- **文档**：`packages/docs/components/notification/index.md` 新增「useNotification composable」节，含完整 demo + 何时用模块级 vs Hook 的 tip block + UseNotificationReturn 表。
- **测试 +9**（与 useMessage 镜像）：返回对象结构（Array.isArray 锁死）/ holder Teleport DOM / unmount 清除 / 多 placement 含 top+bottom 居中位 / handle.close 删除指定 item / config.maxCount 顶掉最旧 / inject 链继承父级 provide / duration 秒制归一化 / role + aria-live 联动。1858 → 1867 全量回归通过（101 文件 / 1867 用例）。

**✅ L-3.3 已交付（2026-05-15）**：1849 → 1858 测试（+9）。Tier L-3 `useMessage()` composable（对标 ant `Modal.useModal()` / `message.useMessage()` 元组返回的 Vue 化等价）。要点：

- **返回对象 `{ message, holder }`，不是数组元组**：这是 `[[feedback-vue-first-benchmark]]` memory 里写死的硬规则——ant React `[message, contextHolder]` 元组在 Vue 里翻成对象返回，命名 `holder`（语义化「占位组件」），区别于 React 的 `contextHolder`。`Array.isArray(result)` 必须为 `false`，测试里专门加了断言锁死这条契约。
- **核心存在理由**：模块级 `import { message } from 'vue3-ccui'` 走独立 `createApp` 挂载，**拿不到调用方应用的 inject**（ConfigProvider、主题、locale 都不继承）。`useMessage()` 的 holder 通过 `<Teleport>` 把容器送到 body，但 Vue 节点树仍连在调用组件下——`inject` 链完整继承。这是「为什么需要 hook 版」的核心答案，文档 `::: tip` block 明确强调。
- **实现要点**：
  - 全部状态（`lists` / `counter` / `config`）都是 `useMessage()` 闭包内的局部变量，每次调用产生独立实例（实例 id 通过模块级 `instanceCounter` 自增，前缀 `use-msg-N-...` 避免多实例 id 冲突）
  - `holder` 是 `defineComponent` 返回的 Vue 组件；setup 内 return render 函数，根据 `lists` 在每个非空 placement 渲染一个 `<div class="ccui-message ccui-message--{p}">` + `<MessageItem>` 列表；外层包 `<Teleport to="body">`（或 `config.getContainer()`）
  - `message` API 与模块级形状完全一致：`open/info/success/warning/error/loading/config/destroy`；返回的 `MessageHandle.close()` 也是 splice 内部 list
  - 不复用模块级 `_messageInternal`：每个 hook 实例独立 state；只复用 `MessageItem` 组件、`normalizeDuration` 逻辑（hook 内独立拷贝一份，避免改动模块级影响 hook）
- **生命周期**：holder 组件卸载 → `<Teleport>` 内容跟着 unmount → 所有 message item 节点清除。测试用 `wrapper.unmount()` 后断言 `.ccui-message__item` 不存在锁死该行为。
- **placement / role / pauseOnHover / stack / maxCount**：全部走 L-3.5 同一套，hook 实例内独立配置（`message.config({...})` 设置的是 hook 实例 scoped 的 config，不污染模块级 globalConfig 也不被其影响）。
- **顶层 export**：`vue-ccui.ts` 加 `useMessage` 命名 import + named export 块；`message/index.ts` 导出 `useMessage` + `UseMessageReturn` 类型。
- **测试 +9**：返回对象不是元组（结构断言）/ holder Teleport 到 body 渲染 / 卸载清除 DOM / 多 placement 同时挂 / handle.close 删除指定 item / config.maxCount 顶掉最旧 / inject 链继承父级 provide / duration 秒制归一化 / role + aria-live 联动。`afterEach` 清理 body 残留 Teleport 目标。1849 → 1858 全量回归通过（100 文件 / 1858 用例）。

**✅ L-3.5 已交付（2026-05-15）**：1833 → 1849 测试（+16）。Tier L-3 message / notification 通用增强（对标 ant v5.23 `stack` / `maxCount` / `placement` / 秒制 `duration` / aria `role`）。要点：

- **`duration` 单位改秒 + ms 兼容（核心 breaking 但平滑）**：内部新增 `normalizeDuration(input, defaultSeconds)`：`0` 永远表示不自动关闭；`≤ 100` 视为秒（如 `3` / `1.5` / `4.5`，与 ant 一致）；`> 100` 视为毫秒（兼容历史 `3000` / `4500` 等写法）。默认值从 `3000`/`4500` ms 改写为 `3`/`4.5` s。**用户传旧 ms 数值无需改代码**——阈值 `> 100` 自动落到 ms 分支。文档 `::: tip` block 明确规则。
- **多 placement**：message 从单容器（永远顶部居中）拆为 `top / topLeft / topRight / bottom / bottomLeft / bottomRight` 6 位置（仿 notification 的 `Map<placement, container>` 模式），默认 `top`（与历史行为一致）。notification 补 `top` / `bottom` 两个居中位（`left: 50%; transform: translateX(-50%)` 实现），默认 `topRight` 不变。
- **`role` aria prop**：item 容器 `role` + `aria-live` 联动：`role='alert'` → `aria-live='assertive'`（默认，紧急播报）；`role='status'` → `aria-live='polite'`（非紧急，屏幕阅读器有空再读）。两组件 item 默认 `role='alert'` 与 ant 行为对齐。
- **`pauseOnHover` 改为可选 prop**：原本两组件 item 强制 mouseenter/mouseleave 暂停；现升级为 `pauseOnHover: boolean` 默认 `true`（行为兼容）。`pauseOnHover=false` 时 mouseenter 不阻断计时器。
- **`maxCount` 全局配置**：`globalConfig.maxCount` 默认 `Infinity`；超出时 `lists[placement].shift()` 顶掉最旧。message / notification 都是**单 placement 内**计数（不是跨 placement 总数），与 ant 行为一致。
- **`stack` 模式**：container `data-stack` 改为类 `--stack` modifier。CSS 实现「非首项 `margin-top: -28px` + `transform: scale(0.96)` + `opacity: 0.85`」的简版视觉堆叠（第 3+ 项再缩 `scale(0.92)` / `opacity: 0.7`）。**最小实现**：不做 hover 展开（ant v5.21 的全交互堆叠留 v2.x 演进项），文档不承诺该行为。
- **`message.config()` / `notification.config()` 全局 API**：对齐 ant `message.config({ top, duration, maxCount, ... })` 语义。设置后影响所有后续调用（已存在 container 同步刷新 `--stack` modifier，但 `top` / `bottom` 偏移在 container 重建时生效——`destroy()` + 再开即可）。每次 `config()` 是 `Object.assign` 合并不是替换；显式传 `undefined` 可清除某项。
- **优先级**：单次 `open()` 选项 > `globalConfig` 默认值；`role` / `pauseOnHover` / `duration` 都遵循此规则。
- **架构**：message.ts 从单 `containerEl` 改为 `containers: Map<placement, HTMLElement>` + `lists: reactive<Record<placement, Instance[]>>`，与 notification.ts 完全对称。两文件各自暴露 `_messageInternal` / `_notificationInternal`（含 `normalizeDuration` / `globalConfig` / `PLACEMENTS`）给后续 L-3.3 / L-3.4 的 `useMessage` / `useNotification` composable 复用。
- **不在本批**：useMessage / useNotification 是 L-3.3 / L-3.4 各自单独 commit；本批只补底座。
- **测试 +16（message +10 / notification +6）**：默认 placement / 多 placement 渲染 / role + aria-live 联动（默认 alert + 自定义 status）/ maxCount 顶掉最旧 / stack modifier 切换 / pauseOnHover=false 不暂停 / duration 秒制（0.05s = 50ms 内部）/ duration > 100 仍按 ms（200ms 直接）/ duration=0 永不关闭。`afterEach` 加 `message.config({...})` 还原全局状态防污染。1833 → 1849 全量回归通过（99 文件 / 1849 用例）。

**✅ L-2.22 已交付（2026-05-15）**：1827 → 1833 测试（+6）。Tier L-2 紧凑组合（对标 ant `Space.Compact`）。要点：

- **新建 `packages/ccui/ui/space-compact/`**，平铺独立 `<c-space-compact>` / `import { SpaceCompact }`。**不挂 Space.Compact 静态属性**。
- **与 `<c-space>` 的差异**：Space 子项之间留 gap；SpaceCompact 子项之间贴边合并（相邻 border 重叠 + 圆角合并）。适合「Input + 选择器 + 按钮」类组合。
- **三组 props**：`direction: 'horizontal' | 'vertical'`（默认 horizontal）/ `size: 'large' | 'middle' | 'small'`（默认 middle，仅作为 CSS modifier，不强制子项尺寸）/ `block`（撑满父容器）。
- **核心是 SCSS**（无 JS 逻辑）：
  - 横向：`> *:not(:first-child) { margin-inline-start: -1px }` 让相邻 border 重叠
  - 中间项：`border-radius: 0` + 同样对内嵌的 `input` / `button` / `.ccui-input` / `.ccui-button` / `.ccui-select` 用 `:is(...)` 重置
  - 首项：`border-top-right-radius: 0; border-bottom-right-radius: 0`（只保留外侧）
  - 末项：`border-top-left-radius: 0; border-bottom-left-radius: 0`（只保留外侧）
  - hover / focus-within 时 `z-index: 1` 提层，避免 border 被相邻子项覆盖
  - 纵向同理但方向是 top/bottom
- **JSX 渲染**：纯 div 容器 + class 计算，不涉及子项注册或 provide/inject（与 Splitter / Radio.Group 等不同，子项无需感知父容器存在）。
- **顶层注册**：`packages/ccui/ui/vue-ccui.ts` 加 `SpaceCompactInstall` import + installs 数组 + 顶层 export。
- 文档 + sidebar：用户文档 4 demo（Input+Button 搜索栏 / 多 Input 拼接 / 纵向紧凑 / block 撑满）+ API 表；sidebar「布局」组 Space 后加入口。
- 测试 6 条：默认 DOM + horizontal modifier / direction=vertical modifier / size large/small modifier / size=middle 无 modifier / block modifier / default slot 完整渲染子节点。1827 → 1833 全量回归通过。

**✅ L-2.21 已交付（2026-05-15）**：1823 → 1827 测试（+4）。Tier L-2 Sider 响应式 + 浮动触发器（对标 ant `Layout.Sider.breakpoint` / `onBreakpoint` / `zeroWidthTriggerStyle`）。要点：

- **不拆组件**，`<c-sider>` 已平铺；本批为现有 Sider 补响应式 props + 实现 matchMedia 监听。
- **`SIDER_BREAKPOINT_PX` 常量**：xs/sm/md/lg/xl/xxl → 480/576/768/992/1200/1600 px，与 ant 一致。位于 `layout-types.ts` 顶部 export，便于业务侧直接引用。
- **matchMedia 监听**：`onMounted` 时 `window.matchMedia('(max-width: {N - 1}px)')` 注册 `change` listener；初次主动评估一次（addEventListener 不会回放当前态）；`onBeforeUnmount` 清理。
- **断点行为**：命中（窗口变窄）→ emit `breakpoint(true)` + 自动 `collapsed=true`（受控时仅 emit 事件不覆盖父值）；解除（窗口变宽）→ 反向。collapse type 区分 `'clickTrigger'`（手动点击）/ `'responsive'`（响应式）。
- **`zeroWidthTriggerStyle` 浮动触发器**：`collapsedWidth=0` 且当前折叠时，触发器加 `--zero-width` modifier class + 应用 `zeroWidthTriggerStyle` inline style（用户传 `{ position: 'fixed', top: '16px' }` 之类做浮动定位）。展开态不应用（避免影响 in-Sider 触发器布局）。
- **现有 reverseArrow** 已实现，本批无需改动；roadmap 文本列出主要是确认 props 集合完整。
- **`window.matchMedia` 兼容性**：onMounted 内判断 `typeof window !== 'undefined' && window.matchMedia`，SSR 友好。
- 文档：`packages/docs/components/layout/index.md` LayoutSider Props 表加 `breakpoint` / `zeroWidthTriggerStyle` 两行（L-2.21 标记）；Events 表加 `breakpoint(broken)` 事件 + `collapse` 的 `type` 取值说明。
- 测试 +4：matchMedia 命中自动 collapse + emit / 受控不覆盖父值 / collapsedWidth=0 + 折叠时触发器 zero-width modifier + inline style / 展开态不挂 zero-width style。jsdom 不带 matchMedia，用 `window.matchMedia = () => fakeMql` 直接 stub。

**✅ L-2.19 已交付（2026-05-15）**：1811 → 1814 测试（+3）。Tier L-2 Calendar header slot 富作用域（Vue 化 ant `headerRender` render-prop）。要点：

- **不拆顶层组件**。Calendar 已有 `header` slot（之前作用域为单字符串当前日期）；本批把作用域升级为富对象，让 slot 内部能直接调用月份切换 API 而无需从外部维护状态。
- **新作用域**：`{ value: string, currentMonth: string, setDate(date), changeMonth('lastMonth' | 'nextMonth') }`。`setDate` / `changeMonth` 是 Calendar 内部已有的 `setCurrentDate` / `changeMonth` 方法的对外名（保持公开 API 命名简洁）。
- **轻量 breaking**：旧 `<template #header="d">{{ d }}</template>` 输出 `[object Object]`，需改为 `{{ d.value }}`。改动幅度小（demo / 用户代码本来就需要月份切换助手，新 API 更易用）；文档加 warning block 明示。
- **Vue 化 ant `headerRender`**：ant `headerRender({ value, type, onChange, onTypeChange })` → ccui slot scope `{ value, currentMonth, setDate, changeMonth }`。**不引入 `headerRender` prop**（slot 即替代），与 [[feedback-vue-first-benchmark]] 「render-prop 翻 slot」原则一致。Calendar 无 year/month 视图切换，省略 type / onTypeChange。
- **实现**：`setup` 内新增 `headerScope = computed(() => ({...}))`；slot 调用改为 `slots.header(headerScope.value)`。零运行时开销（仅传 ref 解包）。
- 文档：`packages/docs/components/calendar/index.md` 「自定义 header」节重写 demo（用 changeMonth + setDate，不再外部 ref shift）；warning block 列出迁移；Slots 表加注 L-2.19 标记。
- 测试 +3：scope 内含 4 字段 + 类型 / changeMonth('nextMonth') 触发 update:modelValue 月份 +1 / setDate 跳转到指定日。1811 → 1814 全量回归通过。

**✅ L-2.18 已交付（2026-05-15）**：1798 → 1811 测试（+13）。Tier L-2 计时器（对标 ant `Statistic.Timer` v5.25+）。要点：

- **新建 `packages/ccui/ui/statistic-timer/`**，平铺独立 `<c-statistic-timer>` / `import { StatisticTimer }`。**不挂 Statistic.Timer 静态属性**。
- **与 `<c-statistic-countdown>` 的关系**：StatisticTimer 是 Countdown 的上位替代，**不直接 deprecate** StatisticCountdown（保留为兼容层）；新项目推荐用 StatisticTimer 统一表达倒/正计时。
- **`type: 'countdown' | 'countup'`** 双向计时器：countdown 走 `target - now` 公式归 0 后 `finish` 停表；countup 走 `now - start` 公式永不归 0 永不 finish。
- **共享 statistic SCSS**：复用 `useNamespace('statistic')` + `import '../../statistic/src/statistic.scss'`，不开新前缀也不开新 scss 文件，DOM 类名与 Statistic / Countdown 完全一致。
- **value 三种输入**：`number` ms 时间戳 / `string` Date.parse 兼容格式 / `Date` 实例。`toTimestamp()` 工具统一归一化。
- **format token**：复用 Countdown 的 `D/DD/H/HH/m/mm/s/ss/SSS` 同套 token 替换；`formatDuration()` 内嵌实现，与 Countdown 一致逻辑。
- **30 FPS 刷新**：`setInterval(tick, 1000/30)` 让秒和毫秒级 token 都能平滑更新；卸载时清理。
- **重启时机**：`watch([targetTs, type])` 任何一项变化都重启计时器（switch `type` 后 stopTimer + startTimer，避免错位状态）。
- **JSX 渲染**：本批起 `.tsx` 默认 JSX，与 form-error-list / dropdown-button 一致；`onClick / onPointerdown` 类型问题不涉及本组件。
- **顶层注册**：`packages/ccui/ui/vue-ccui.ts` 加 `StatisticTimerInstall` import + installs 数组 + 顶层 export。
- 文档 + sidebar：用户文档 5 demo（倒计时 / 正计时 / 自定义 format / prefix+suffix / 事件表）+ API 表；sidebar「数据展示」组 Statistic 后加入口。
- 测试 13 条：countdown DOM 显示 / countup DOM 显示 / title prefix suffix props / 三 slot 优先级 / value Date 实例 / value ISO string / countdown 归 0 finish / countup 永不 finish / change tick 持续触发 / valueStyle 透传 / D 天格式 token / 切换 type 重启 / 卸载清理定时器。jsdom 用 `vi.useFakeTimers()` + `vi.setSystemTime()` 锁时间。

**✅ L-2.25 已交付（2026-05-15）**：测试数不变（仅常量 export）。Tier L-2 TreeSelect SHOW_* 顶层常量（对标 ant `TreeSelect.SHOW_PARENT` / `.SHOW_CHILD` / `.SHOW_ALL`）。要点：

- **新增 3 个顶层常量**：`TREE_SELECT_SHOW_PARENT = 'SHOW_PARENT'` / `TREE_SELECT_SHOW_CHILD = 'SHOW_CHILD'` / `TREE_SELECT_SHOW_ALL = 'SHOW_ALL'`（`as const` 字面量类型）。
- **定义位置**：`packages/ccui/ui/tree-select/src/tree-select-types.ts` 文件顶部；附 `TreeSelectShowCheckedStrategy` union 类型 export。
- **顶层 export**：`packages/ccui/ui/tree-select/index.ts` re-export 3 常量 + type；`packages/ccui/ui/vue-ccui.ts` 加入命名 import + named export 块。**不挂 `TreeSelect.SHOW_*` 静态属性命名空间**（与 L-2 平铺独立顶层组件原则一致）。
- **当前状态**：ccui TreeSelect 尚未接入 `showCheckedStrategy` prop（已知限制文档列出）。本批仅 export 常量符号，方便外部代码提前按 ant 习惯引用；待后续 batch 接入实际多选汇总逻辑时无缝对接。
- 文档：`packages/docs/components/tree-select/index.md` 新增「顶层常量（L-2.25）」一节，含代码示例 + 3 行常量含义表；同时把「已知限制」中 showCheckedStrategy 一条加注「**L-2.25 已顶层 export 常量符号**」。
- 测试 +0：纯常量 export，无运行时变更。

**✅ L-2.24 已交付（2026-05-15）**：测试数不变（仅常量 export）。Tier L-2 Cascader SHOW_* 顶层常量（对标 ant `Cascader.SHOW_CHILD` / `.SHOW_PARENT`）。要点：

- **新增 2 个顶层常量**：`CASCADER_SHOW_CHILD = 'SHOW_CHILD'` / `CASCADER_SHOW_PARENT = 'SHOW_PARENT'`（`as const` 字面量类型）。
- **定义位置**：`packages/ccui/ui/cascader/src/cascader-types.ts` 文件顶部；附 `CascaderShowCheckedStrategy` union 类型 export。
- **顶层 export**：`packages/ccui/ui/cascader/index.ts` re-export 2 常量 + type；`packages/ccui/ui/vue-ccui.ts` 加入命名 import + named export 块。**不挂 `Cascader.SHOW_*` 静态属性命名空间**。
- **当前状态**：ccui Cascader 尚未接入 `showCheckedStrategy` prop（已知限制文档列出）。本批仅 export 常量符号，待后续 batch 接入实际逻辑。
- 文档：`packages/docs/components/cascader/index.md` 新增「顶层常量（L-2.24）」一节；同时把「已知限制」中 showCheckedStrategy 一条加注「**L-2.24 已顶层 export 常量符号**」。
- 测试 +0：纯常量 export，无运行时变更。

**✅ L-2.23 已交付（2026-05-15）**：1791 → 1798 测试（+7）。Tier L-2 Splitter / SplitterPanel 补 props（对标 ant `Splitter.Panel.showCollapsibleIcon`）。要点：

- **不拆组件**，`<c-splitter>` / `<c-splitter-panel>` 已平铺；本批为现有组件补 props + 实现折叠运行时逻辑。
- **Splitter `orientation` 别名**：对标 ant 命名（`'horizontal' | 'vertical'`）。`layout` 默认改为 `undefined`（之前是 `'horizontal'`，会永远赢过别名）；`effectiveLayout = layout ?? orientation ?? 'horizontal'`。原有用户传 `layout='horizontal'` / 不传 layout 的行为完全兼容。
- **SplitterPanel `showCollapsibleIcon`**：bool prop，默认 `false`。**需配合 `collapsible` 一起使用**（不设 collapsible 时即使 showCollapsibleIcon=true 也不渲染按钮，避免 dead UI）。
- **实现折叠运行时**：Splitter 内新增 `collapsedPanels: Map<id, prevSize>`；折叠时 `panel.size = 0` + 记录 prevSize；恢复时写回 prevSize。SplitterContext 暴露 `isCollapsed(id)` / `toggleCollapse(id)`。Panel style computed 检测折叠态 → `flex: 0 0 0; overflow: hidden`。
- **折叠按钮 UI**：resizer 内 absolute 居中，16×16 chevron 按钮；箭头方向随 horizontal/vertical + 折叠态切换（`◀ ▶ ▲ ▼`）；click 触发 toggleCollapse，pointerdown 阻断 resize 事件冒泡。a11y `aria-label="Collapse panel" / "Expand panel"`。
- **collapsible 对象形态归一化**：`true` → `{ start: true, end: true }`；`{ start: true }` / `{ end: true }` 部分启用；`false` → 全关。computed `collapsibleConfig` 统一读取。
- **SplitterContext.layout 改成 getter**：`get layout() { return effectiveLayout.value }`，保证 orientation 别名修改后子 Panel 能读到最新值（虽然 Panel 内部用 const 捕获一次，但本批同步加了 `isHorizontal` computed 让 Panel 也跟着 reactive）。
- 文档：`packages/docs/components/splitter/index.md` Splitter Props 表加 `orientation`，SplitterPanel Props 表加 `collapsible` + `showCollapsibleIcon`。
- 测试 7 条：orientation 别名 / layout 优先 / showCollapsibleIcon+collapsible 渲染按钮 / 缺 collapsible 不渲染 / 缺 showCollapsibleIcon 不渲染 / 点击折叠+恢复 + flex:0 0 0 / collapsible 对象形态 `{ start: true }` 也触发图标。

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

**✅ L-2.10 已交付（2026-05-15）**：1689 → 1705 测试（+16）。Tier L-2 卡片元信息 + 卡片网格（对标 ant `Card.Meta` / `Card.Grid`）。要点：

- **新建 `packages/ccui/ui/card-meta/`**，平铺独立 `<c-card-meta>` / `import { CardMeta }`。**不挂 Card.Meta 静态属性**。
- **CardMeta props**：`title` / `description` 两段文字 + 三个 slot（`avatar` / `title` / `description`）；slot 优先于 prop；未传 title / description 时不渲染对应节点（不留空 div 占位）。
- **CardMeta SCSS**：左 avatar 48×48 圆形（与 ant 64 略小，与 ccui Avatar 默认 36 协调），右 detail 两段文字（title 加粗 + 截断省略、description 次级色）。
- **顶层注册**：`packages/ccui/ui/vue-ccui.ts` 加 `CardMetaInstall` import + installs 数组 + 顶层 export。
- 文档 + sidebar：CardMeta（avatar+title+description 三段；slot 优先）；sidebar 加入口。
- 测试 7：CardMeta（DOM / title prop / description prop / title slot 优先 / description slot 优先 / avatar slot / 无内容降级）。
- **注**：本批原同时含 `CardGrid`（9 测试，独立 `card-grid/` 目录），已于 2026-05-16 随 6 组件下线一并物理移除。

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
| L-2.10 | `CardMeta`（`<c-card-meta>`）                                                                                        | `Card.Meta`                                                                                   | 卡片元信息（CardGrid 已于 2026-05-16 移除，不再对标）                                                                                                                     | [x]  |
| L-2.12 | `TableColumn` / `TableColumnGroup` / `TableSummary`（`<c-table-column>` 等）                                         | `Table.Column` / `Table.ColumnGroup` / `Table.Summary`                                        | 模板式列声明（替代 `columns` 数组）+ 汇总行；Vue 模板用 v-for + 子组件描述列                                                                                              | [x]  |
| L-2.13 | `DirectoryTree`（`<c-directory-tree>`）                                                                              | `Tree.DirectoryTree`                                                                          | 目录树：默认展开 / 文件图标                                                                                                                                               | [x]  |
| L-2.14 | `DropdownButton`（`<c-dropdown-button>`）                                                                            | `Dropdown.Button`                                                                             | 下拉按钮：`menu` / `buttons-render` slot / 主按钮 + dropdown 双触发                                                                                                       | [x]  |
| L-2.15 | `SkeletonButton` / `SkeletonAvatar` / `SkeletonInput` / `SkeletonImage` / `SkeletonNode`（`<c-skeleton-button>` 等） | `Skeleton.Button` / `Skeleton.Avatar` / `Skeleton.Input` / `Skeleton.Image` / `Skeleton.Node` | Skeleton 5 形态变体                                                                                                                                                       | [x]  |
| L-2.17 | `SubMenu` / `MenuItemGroup` / `MenuDivider`（`<c-sub-menu>` 等）                                                     | `Menu.SubMenu` / `Menu.ItemGroup` / `Menu.Divider`                                            | **当前 ccui 已平铺**；本批仅文档表述对齐（确认导出 + 写明 `<c-sub-menu>` 用法）                                                                                           | [x]  |
| L-2.18 | `StatisticTimer`（`<c-statistic-timer>`）                                                                            | `Statistic.Timer`（v5.25+）                                                                   | 计时器（替代 Countdown）                                                                                                                                                  | [x]  |
| L-2.19 | Calendar 加 `header` slot + `headerRender` 用 slot 替换                                                              | `Calendar.Header` + `headerRender`                                                            | **不拆顶层组件**，Calendar 内部新增 `header` slot（Vue 化 ant render prop）                                                                                               | [x]  |
| L-2.21 | Layout 内 Sider 扩 `breakpoint` / `onBreakpoint` / `zeroWidthTriggerStyle` / `reverseArrow`                          | `Layout.Sider.*` props                                                                        | **不拆组件**，Sider 现有组件加 props；现有 `<c-sider>` 已平铺                                                                                                             | [x]  |
| L-2.22 | `SpaceCompact`（`<c-space-compact>`）                                                                                | `Space.Compact`                                                                               | 输入紧凑组合                                                                                                                                                              | [x]  |
| L-2.23 | Splitter 内 SplitterPanel 加 `showCollapsibleIcon` + `orientation` 别名                                              | `Splitter.Panel.showCollapsibleIcon`                                                          | **不拆组件**，`<c-splitter-panel>` 已平铺；本批补 props                                                                                                                   | [x]  |
| L-2.24 | 顶层常量 `CASCADER_SHOW_CHILD` / `CASCADER_SHOW_PARENT`                                                              | `Cascader.SHOW_CHILD` / `.SHOW_PARENT`                                                        | **不挂命名空间**，从 `vue3-ccui` 顶层 export                                                                                                                              | [x]  |
| L-2.25 | 顶层常量 `TREE_SELECT_SHOW_PARENT` / `TREE_SELECT_SHOW_CHILD` / `TREE_SELECT_SHOW_ALL`                               | `TreeSelect.SHOW_*`                                                                           | 同上，顶层 export                                                                                                                                                         | [x]  |

---

## Tier L-3 — 命令式 / Hook API（每批 3–5 天）

| Batch | 范围                                                                                                                                                                            | 用途                                                                                                                                                                       | 状态 |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| L-3.1 | `Modal.confirm` / `Modal.info` / `Modal.success` / `Modal.error` / `Modal.warning` / `Modal.destroyAll` / `Modal.update`                                                        | 命令式确认弹窗 + 静态实例（纯函数调用，跟语言无关）                                                                                                                        | [x]  |
| L-3.2 | `useModal()` composable                                                                                                                                                         | Vue 化：返回 `{ modal, holder }`，`holder` 是 Vue 组件，模板写 `<component :is="holder" />`；承载 confirm 系列的上下文（替代 ant `[modal, contextHolder]` 元组）           | [x]  |
| L-3.3 | `useMessage()` composable                                                                                                                                                       | 同上，Vue composable + `<host>` 组件，不照搬 React Hook 元组返回                                                                                                           | [x]  |
| L-3.4 | `useNotification()` composable                                                                                                                                                  | 同上                                                                                                                                                                       | [x]  |
| L-3.5 | message / notification 通用增强：`stack` / `maxCount` / `pauseOnHover` / `role`（aria） / 多 `placement`（v5.23） / `top`/`bottom` 居中位 / `duration` 单位改秒（保留毫秒兼容） | 通知体验对齐 ant                                                                                                                                                           | [x]  |
| L-3.6 | `useForm()` composable（**可选**）                                                                                                                                              | Vue 主路径已经是 `<c-form ref="formRef" />` + `formRef.value.validate()`，这条只在确实需要"游离 form 实例 hot-swap"等高级场景再做；不是必交付项。**默认 [—]，不阻塞 v2.0** | [—]  |
| L-3.7 | `Typography.Text` / `.Title` / `.Paragraph` / `.Link` 的 `copyable` / `editable` / `ellipsis` 三大交互                                                                          | 文案展示标配；render props 全部翻成 slot（`copy-icon` / `edit-icon` / `expand-text` 等 slot）                                                                              | [x]  |

---

## Tier L-4 — 文档示例补齐（每批 2–4 天，按 demo 缺口大小排）

> 数据来自 per-component/ 各文件「缺失 ant demo」节。

| Batch | 范围                                                                               | demo 增量 | 状态 |
| ----- | ---------------------------------------------------------------------------------- | --------- | ---- |
| L-4.1 | Rate（缺 12） / Result（缺 10） / Progress（缺 9）                                 | +31 demo  | [x]  |
| L-4.2 | Avatar / Badge / Alert / FloatButton（各缺 8+）                                    | +32 demo  | [x]  |
| L-4.3 | Affix / Spin / InputNumber / Empty / Segmented / Flex（各缺 8+）                   | +48 demo  | [x]  |
| L-4.4 | Mentions / Collapse / Card / List / Image / Statistic / Divider / Grid（中等缺口） | +35 demo  | [x]  |
| L-4.5 | Cascader / DatePicker / Tooltip / Popover（缺 6–8）                                | +28 demo  | [x]  |
| L-4.6 | Table（25 demo 缺口，与 L-2.12 配套交付）                                          | +25 demo  | [x]  |
| L-4.7 | Form（28 demo 缺口，与 L-1.6 + L-3.6 配套交付）                                    | +28 demo  | [x]  |
| L-4.8 | Typography（与 L-3.7 配套交付）+ Calendar（与 XL-2 配套交付）                      | +20 demo  | [~]  |

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
