# 对标 Ant Design 的设计原则（Benchmark, 不是 100% 对齐）

> 状态：**已采纳，作为长期不变性约束**
> 适用范围：新增 / 重写组件、添加 prop、为 issue / PR 做范围裁决时

ccui 与 Ant Design 的关系是 **对标**：能力覆盖到、心智模型对齐、迁移成本低，但 **不照搬 React-only 模式**。下面这些清单决定每条任务怎么落地。

## 一、不做的事（React-only / Vue 自带等价物）

| Ant 概念 | 为什么不做 | ccui 怎么解决 |
| --- | --- | --- |
| `Form.shouldUpdate` | React 渲染优化原语，强迫子树重渲。Vue 响应式自动处理依赖收集 | 不实现，文档说明「Vue 中通过 reactive 自然达成」 |
| `Form.Item.valuePropName` / `getValueFromEvent` / `getValueProps` | 用来桥接 React 受控 onChange/value 协议 | **不需要**，Vue `v-model:*` + `modelValue` 已经统一协议 |
| `controlled` vs `uncontrolled` 语义 | React 受控/非受控二分法 | Vue 用 `v-model:*` + `default-*` 双轨已统一覆盖，文档不引入这两个词 |
| `ref forwarding` / `React.forwardRef` | React 特有 ref 转发 | Vue `defineExpose` + 模板 `ref` 直接拿，本就是另一套机制 |
| React 风格的 `render props`（`tagRender` / `optionRender` / `cellRender` / `headerRender` / `iconRender` / `modalRender` / `popupRender` / `dropdownRender` / `indicatorsRender` / `actionsRender` / `panelRender` / `displayRender` / `titleRender` 等） | React 把 render 当一等公民 | **全部翻译成 Vue 作用域插槽**，命名按 ccui 惯例（如 `tag` / `option` / `cell` / `header` / `icon` / `modal` / `popup` / `indicator` slot），保留 prop 形式时仅接受字符串 / VNode，不接受 React 函数 |
| **静态属性命名空间挂子组件**（`Input.TextArea` / `Button.Group` / `Tag.CheckableTag` / `Image.PreviewGroup` / `Avatar.Group` / `Badge.Ribbon` / `Card.Meta` / `Table.Column` / `Tree.DirectoryTree` / `Dropdown.Button` / `Skeleton.Button` / `Space.Compact` 等） | React 没有 kebab 模板 + auto-import，靠 `<Input.TextArea>` 命名空间读起来更顺；Vue 模板写不出 `<c-input.text-area>` | **全部拆为平铺独立顶层组件**：`Textarea` / `ButtonGroup` / `CheckableTag` / `ImagePreviewGroup` / `AvatarGroup` / `BadgeRibbon` / `CardMeta` / `TableColumn` / `DirectoryTree` / `DropdownButton` / `SkeletonButton` / `SpaceCompact` 等。模板用 `<c-textarea>`，TSX 用 `import { Textarea }`，**禁止 `Input.TextArea = Textarea` 静态属性挂载**。范例：`Form / FormItem / FormList / FormProvider` 平铺导出 |
| **静态常量命名空间**（`Cascader.SHOW_CHILD` / `TreeSelect.SHOW_PARENT` / `Upload.LIST_IGNORE` 等） | React 把常量挂在组件上做命名空间 | **改顶层 export**：`CASCADER_SHOW_CHILD` / `TREE_SELECT_SHOW_PARENT` / `UPLOAD_LIST_IGNORE` 从 `@vaebe/ccui` 顶层导出 |
| `Modal.useModal()` 返回的 `[modal, contextHolder]` 二元组 | React Hook + JSX 单一 contextHolder | ccui 改成 `useModal()` composable 返回 `{ modal, holder }`，`holder` 是 Vue 组件，模板写 `<component :is="holder" />`，或直接挂 `<c-modal-host>` 单例 |
| `App` 组件（包裹全局 message/notification/modal 上下文） | React 没有 `app.use()` 这种全局插件机制 | **不做**，Vue 通过 `app.use(ccui)` 自然挂载全局命令式 API |
| `errorBoundary`（Alert.ErrorBoundary） | React 错误边界组件 | 用 `onErrorCaptured` 实现的 Vue 包裹组件 `ErrorBoundary`（顶层组件，不挂到 Alert），行为对齐 |
| `getContainer: () => HTMLElement` | React Portal 容器函数 | 接 Ant 的 `getContainer` 函数签名（更灵活），保留 `appendToBody` 别名 |
| `keepAlive` / `forceRender` / `destroyOnHidden` 这类显式生命周期标志 | React 没有 KeepAlive，需要手动控制 mount | Vue 用 `<KeepAlive>` 已提供。ccui 接同名 prop 时 **对齐语义**（destroyOnHidden 改 v-if，forceRender 等价于 keepAlive=true），不照搬实现 |

## 二、要「翻译」的事（同心智，不同 API 形状）

| Ant React 写法 | ccui Vue 化写法 |
| --- | --- |
| `value={x}` + `onChange={fn}` | `v-model:value="x"` 或更语义化的 `v-model:<name>` |
| `defaultValue` | `default-value` 同名保留 |
| `open` + `onOpenChange` | `v-model:open` + 兼容 `update:open` 事件 |
| `<Button icon={<Icon />}>` | `<c-button>` + `icon` slot 或 `icon` prop（字符串 Iconify name） |
| `closable={{ closeIcon, disabled, ariaLabel }}` 复合对象 | 同形 object 接收 + 单独 `closeIcon` slot 兜底 |
| `footer={null}` / `footer={vnode}` | `footer` slot；prop 接受 `null \| VNode`；保留 `hideFooter` 别名 |
| `addonBefore` / `addonAfter` ReactNode | `addon-before` / `addon-after` slot；prop 仍接 string 兼容旧 `prepend` / `append` |
| `loading={{ delay, icon }}` | 同形 object 接收，`icon` 部分接 slot 或 string |
| `Form.useForm()` 命令式 form 实例 | **可选**：主路径用 `<c-form ref="formRef" />` + `formRef.value.validate()`；只在多 form hot-swap 等高级场景再做 composable |
| `tagsDraggable` / `optionRender` / `tagRender` / `cellRender` 等 render props | 全部 slot，命名按 ccui 惯例 |

## 三、要保留的对标项（语言无关）

- **视觉 token / 主题算法**：colorPrimary / control-outline / border-radius / motion-duration 等，对齐 Ant v6 SeedToken / MapToken。
- **`variant: 'outlined' | 'filled' | 'borderless' | 'underlined'`** —— 视觉变体，跟语言无关。
- **`classNames` / `styles` 语义化 DOM 钩子** —— Vue 也可以接受 `{ root, popup, item }` 形式的 object，结构化定制方案跟 React 没绑死。
- **`status: 'error' | 'warning'`** —— 状态语义。
- **图标钩子 `prefix` / `suffixIcon` / `clearIcon` / `loadingIcon` / `removeIcon` / `expandIcon`** —— 接 string（Iconify name） / slot / VNode 三态。
- **命令式 API** `Modal.confirm` / `message.info` / `notification.open` —— 跟语言无关，纯函数调用。
- **静态 / 常量导出** 如 `CASCADER_SHOW_PARENT` / `TREE_SELECT_SHOW_ALL` —— 模块级常量，跟语言无关。

## 四、判断准则（新任务进来时怎么定位）

1. **要解决的用户痛点是不是 React 框架特有的？** 是 → 不做（如 forwardRef / shouldUpdate）。
2. **API 形状能不能用 v-model / slot / composable 等价表达？** 能 → 翻译成 Vue 习惯（render prop → slot 是主要动作）。
3. **概念是不是跨语言通用？** 是 → 直接对齐（如 variant / status / classNames）。
4. **是不是 Ant 已经废弃的 API？** 是 → 跳过（如 `bordered` 改 `variant`、`message` 改 `title`、`dataSource` 改 `options`），ccui 不背包袱。

## 反向决策开销

- 是设计原则级约束，不能"按需个别破坏"。如果要破例（例如真的需要 `Input.TextArea = Textarea` 静态属性挂载），必须在本文件增加修订记录并写明原因。
- 反过来要把所有原则全部撤回，意味着 ccui 重做成 Ant-react 的字面 Vue 移植，那是另一个项目，不在本仓库范围内。
