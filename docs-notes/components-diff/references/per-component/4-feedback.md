# Batch 4 反馈类组件 diff（vue3-ccui vs antd v6.3.7）

涵盖 13 个组件：alert / drawer / message / modal / notification / popconfirm / popover / progress / result / skeleton / spin / tooltip / tour。

---

## Alert

- Ant 段：`## alert`（行 243–815）
- ccui types：`packages/ccui/ui/alert/src/alert-types.ts`
- ccui docs：`packages/docs/components/alert/index.md`
- ccui 自报状态：未在 changelog 中标记百分比（feedback 大类的 Alert 没出现在 100% 列表内，属于早期 P0 基础实现）。

### Demo 对比

**Ant 官方 demo（共 11 条）**：1. Basic 2. More types（四种 type 横向罗列） 3. Filled（`variant="filled"` 隐藏边框） 4. Closable（对象形式 `closable={{ closeIcon, onClose, 'aria-label' }}`） 5. Description 6. Icon（`showIcon`，带 / 不带 description 两套） 7. Banner（顶部公告 + 长文本截断 + 无图标） 8. Loop Banner（配 react-fast-marquee 做跑马灯） 9. Smoothly Unmount（`closable.afterClose` 解绑后销毁） 10. ErrorBoundary（`Alert.ErrorBoundary` 子组件兜 React 渲染错） 11. Custom action（右侧 `action` 区放 Button） + Custom semantic dom styling（`classNames` / `styles` 对象 + 函数）。

**ccui 文档 demo（共 4 条）**：1. 基本使用（四种 type） 2. 含辅助性文字介绍（description） 3. 显示图标（show-icon） 4. 可关闭（closable + close 事件）。

**ccui 缺失的 ant demo**：

- Filled（`variant="filled"`，6.4.0 新加）
- Banner（顶部公告模式，自动 warning + showIcon=true 默认行为）
- ErrorBoundary 子组件（`<Alert.ErrorBoundary>` 包裹捕获 React 渲染错）
- Action 右侧操作区（自定义按钮 / 链接）
- Smoothly Unmount（`closable.afterClose` 解绑销毁）
- Loop Banner / Marquee 公告
- 对象形式 `closable={{ closeIcon, onClose, 'aria-label' }}` 写法
- classNames / styles 对象 + 函数 semantic 样式

**ccui 特有 demo**：无。

### Props 对比

**ccui 缺失的 ant props**（按 ant API 顺序）：

- `action`：右侧操作区 ReactNode / slot 缺。
- `variant`：`'outlined' | 'filled'` 模式切换（6.4.0）缺。
- `banner`：ccui 虽然在 types 里声明了 `banner: boolean`，但 demo 与文档完全未演示；需补默认 `type=warning` / `showIcon=true` 的联动行为。**实际行为缺失**。
- `closable` 对象形式：ant 支持 `boolean | { closeIcon, onClose, afterClose, disabled, 'aria-label' }`，ccui 仅 `boolean`，无法定制关闭图标 / 关闭后回调 / aria-label。
- `closeIcon`（顶层）：自定义关闭图标 ReactNode；ccui 用 `closeText` 顶替，差异较大。
- `description`：ccui 仅 `string`，ant 支持 ReactNode；slot 缺。
- `icon`：自定义图标（`showIcon` 为 true 时生效），ccui 无入口，无法替换默认 icon。
- `errorIcon` / `infoIcon` / `successIcon` / `warningIcon`：四个分类型全局图标定制，ccui 无。
- `message` / `title`：ant v6 已用 `title` 替代 `message`（`message` 标 deprecated），ccui 仍只暴露 `message`，无 `title` 别名。
- `classNames` / `styles`：semantic DOM 样式 hook 缺。
- `afterClose`：ant 已弃用 → `closable.afterClose`，ccui 无对等。
- `aria-label`：可访问性属性缺。

**命名/形状差异**：

- ant `message` 已 deprecated 改 `title`；ccui 仍叫 `message`（短期可接受，长期跟 v6 对齐应该补 `title` 别名 + 文档迁移说明）。
- ant `closable` 是 `boolean | ClosableType` 联合；ccui 单 boolean。

**ccui 特有 props**：

- `closeText: string`：以纯文本作为关闭按钮（ant 已建议用 `closable.closeIcon`，ccui 是历史 v4 残留）。

### Events / 方法 对比

**缺失 events**：`onClose` 已存在；`afterClose`（关闭动画结束）缺。
**缺失 expose 方法**：无（Alert 无方法暴露）。

### 子组件 / 静态导出 / 命令式 API

**缺失**：

- `Alert.ErrorBoundary`：兜底 React 渲染错的子组件（Vue 等价物应是 `<c-alert-error-boundary>` 配合 `onErrorCaptured`）。**重大缺口**。
- 全局类型导出 `AlertProps['styles']`、`AlertProps['classNames']` 缺。

---

## Drawer

- Ant 段：`## drawer`（行 15170–16327）
- ccui types：`packages/ccui/ui/drawer/src/drawer-types.ts`
- ccui docs：`packages/docs/components/drawer/index.md`
- ccui 自报状态：早期 P0 实现，未在近期 batch 中明确标 100%；文档比较精简。

### Demo 对比

**Ant 官方 demo（共 11 条）**：1. Basic 2. Custom Placement（4 方向 radio 切换） 3. Resizable（6.1.0+，`resizable={{ onResize }}`） 4. Loading（5.17.0 `loading` skeleton） 5. Extra Actions（`extra` 右上角放按钮） 6. Render in current dom（`getContainer={false}`） 7. Submit form in drawer（表单 + 底部固定 footer） 8. Preview drawer（用作详情预览） 9. Multi-level drawer（嵌套抽屉，自动 push） 10. Preset size（`size: 'default' | 'large' | number | string`） 11. mask（`{ blur: true }` / `false`） + Closable placement（`closable={{ placement: 'end' }}` 5.28.0） + Custom semantic dom styling。

**ccui 文档 demo（共 6 条）**：1. 基本使用 2. 四个方向 placement 3. 自定义尺寸（size 数字/字符串） 4. 自定义底部按钮（show-footer + #footer slot） 5. 关闭行为（mask-closable / close-on-esc） 6. 销毁内部 DOM（destroy-on-close）。

**ccui 缺失的 ant demo**：

- Resizable 拖拽改宽（6.1.0+）
- Loading skeleton 占位（5.17.0）
- `extra` 右上角扩展操作区
- 嵌套抽屉自动 push（`Drawer.push` 行为，4.5.0+）
- 预置 `size: 'large'`（736px）vs `'default'`（378px）枚举值
- `getContainer={false}` 渲染到当前 DOM
- `mask={{ enabled, blur, closable }}` 高级蒙层（v6.3 mask.closable）
- `closable.placement: 'end'`（关闭按钮放右上，5.28.0）
- 表单 + 底部固定 footer 复杂场景

**ccui 特有 demo**：无显著新增；自定义 footer 用 slot 模式是 Vue 习惯写法。

### Props 对比

**ccui 缺失的 ant props**（按 ant API 顺序）：

- `afterOpenChange(open)`：开关动画结束回调。
- `classNames` / `styles`：semantic DOM 样式 hook（也支持函数形态 `(info: { props }) => Record<...>`）。
- `closable` 对象形式：`{ closeIcon, disabled, placement }` 缺；尤其 `placement: 'start' | 'end'` 是 5.28.0 新增。
- `destroyOnHidden`（5.25.0）：替代旧 `destroyOnClose`，ccui 仅 `destroyOnClose`。
- `extra`：右上角扩展区（slot 缺）。
- `forceRender`：强制预渲染 panel。
- `focusable`：`{ trap, focusTriggerAfterClose }`（6.2.0）。
- `loading`：Skeleton 占位（5.17.0）。
- `mask` 对象形式：`{ enabled, blur, closable }`（v6.3 加 closable）。
- `maxSize` / `size` 字符串（如 `'500px'` / `'50%'` / `'20vw'` / `'large'` / `'default'`），ccui 已支持 string 但未演示。
- `push`：嵌套抽屉推进配置 `boolean | { distance }`（默认 180px）。
- `resizable`：`boolean | ResizableConfig`（含 `onResizeStart / onResize / onResizeEnd`，6.1.0+）。
- `rootStyle` / `rootClassName`：根容器（含 mask）样式 vs 仅 panel 的 `style/className`。
- `drawerRender(node)`：自定义抽屉内容 render（5.18.0）。

**命名/形状差异**：

- `visible` vs `open`：ant v5+ 已改用 `open`，ccui 仍叫 `visible`（与 antd v4 兼容，与 v6 不一致）。
- `closeOnEsc` vs `keyboard`：ant 用 `keyboard: boolean`，ccui 用 `closeOnEsc`，语义一致但命名不同。

**ccui 特有 props**：

- `showFooter`：手动开关 footer 高度。ant 是只要 `footer` 不为 null 就有。
- `appendToBody`：等价 ant 的 `getContainer`，但只支持 `boolean`，缺函数 / 选择器形态。

### Events / 方法 对比

**缺失 events**：

- `afterOpenChange(open: boolean)`：单事件取代分别的 open / opened / close / closed。
- ant 风格的 `onClose(e)` 携带触发事件参数；ccui `close` 不带参数。

**缺失 expose 方法**：无（Drawer 不暴露实例方法，多级嵌套通过 `push` prop）。

### 子组件 / 静态导出 / 命令式 API

**缺失**：

- 嵌套抽屉 push 行为（不是子组件，但是 ant 招牌特性，ccui 无任何对应）。
- `drawerRender` 自定义 render（用于做可拖拽 / 自定义动画）。

---

## Message

- Ant 段：`## message`（行 31060–31636）
- ccui types：`packages/ccui/ui/message/src/message-types.ts`
- ccui docs：`packages/docs/components/message/index.md`
- ccui 自报状态：核心命令式 API 已具备，但 Hook 形态缺失。

### Demo 对比

**Ant 官方 demo（共 8 条）**：1. Hooks usage（`message.useMessage` + `contextHolder`） 2. Other types（success / error / warning） 3. Customize duration 4. Stack（6.4.0，`{ threshold }` 折叠堆叠） 5. Loading indicator + 异步关闭 6. Promise interface（`.then(afterClose)`） 7. Custom semantic styles（`classNames` / `styles`） 8. Update Message Content（同 `key` 替换） + Static method (deprecated)。

**ccui 文档 demo（共 6 条）**：1. 基本使用（5 个类型） 2. 加载中 3. 自定义停留时长 4. 主动关闭（`MessageHandle.close()`） 5. 显示关闭按钮 + onClose 回调 6. 全局清空 `destroy()`。

**ccui 缺失的 ant demo**：

- **`message.useMessage()` Hook**：能拿到 contextHolder 注入到 Vue tree 中取 ConfigProvider（locale / prefixCls / theme）的 context。**重大缺口**。
- Stack 堆叠折叠模式（6.4.0）
- Promise 链式 `.then(afterClose)`
- 同 `key` 替换内容（虽然 types 暴露了 `key`，但 demo 未演示）
- `classNames` / `styles` semantic DOM

**ccui 特有 demo**：`message.destroy()` 一键全部销毁（ant 也有，但 ccui 文档明确演示了）。

### Props / config 对比

**ccui 缺失的 ant 配置**：

- 全局 `message.config({ top, duration, maxCount, prefixCls, rtl, stack, getContainer })`：**整组都缺**，无法配置顶距、最大数、RTL、容器、堆叠阈值。
- `maxCount`：超过限制丢最旧；ccui 完全没有上限保护。
- `pauseOnHover`：单条 MessageOptions 上的悬停暂停计时（ant 默认 true）。
- `stack`：`boolean | { threshold }`（6.4.0）。
- `className` / `style`：单条样式注入。
- `classNames` / `styles`：semantic DOM。
- `icon`：ccui 是 `string`（图标名），ant 是 `ReactNode` 任意节点。
- `top`：垂直位置，ccui 不可调。
- `getContainer`：自定义挂载节点。
- `rtl`：RTL 模式。
- `prefixCls`：自定义 class 前缀。
- `placement` 多位置：ant message 不像 notification 那样支持四角，但全局 `top` 至少给到。

**命名/形状差异**：

- `duration`：ant 单位是**秒**（默认 3），ccui 是**毫秒**（默认 3000）。**单位不一致是迁移坑**。
- `content`：ccui 已支持 `string | VNode`；ant 是 `ReactNode | config`，等价。
- `showClose`：ccui 自定义字段；ant 无对应字段，关闭由 closable 控制。

**ccui 特有 props**：

- `showClose: boolean`：单条显式关闭按钮，ant 没这个。
- `customClass: string`：单条 class hook（ant 已用 `className` / `classNames` 取代）。

### Events / 方法 对比

**缺失 events**：`onClick`（点击 message 整体）缺。
**缺失 expose 方法**：

- `messageApi.destroy(key?)`：按 key 销毁单条；ccui `destroy()` 是全清。
- `messageApi.open(config).then(afterClose)`：Promise 链。

### 子组件 / 静态导出 / 命令式 API

**缺失**：

- `message.useMessage()` Hook 形态（v4.16+ Ant 主推，v6 强烈建议）：**最大缺口**，影响 ConfigProvider locale / 主题 token 联动。
- `message.config(options)` 全局配置入口。
- 5 个 level 的 `(content, duration, onClose)` 多签名（ccui 只支持二参签名 `(content, duration)`，需要 `onClose` 必须走 `open()`）。

---

## Modal

- Ant 段：`## modal`（行 31638–33006）
- ccui types：`packages/ccui/ui/modal/src/modal-types.ts`
- ccui docs：`packages/docs/components/modal/index.md`
- ccui 自报状态：基础 props 较完整，但**命令式 API 整组缺失**（重大缺口）。

### Demo 对比

**Ant 官方 demo（共 14 条）**：1. Basic 2. Asynchronously close（`confirmLoading`） 3. Customized Footer（数组） 4. mask（`{ blur: true }` + `Modal.useModal()`） 5. Loading skeleton 6. Customized Footer render function（`(_, { OkBtn, CancelBtn })`） 7. Use hooks to get context（`Modal.useModal()`） 8. Internationalization（okText / cancelText） 9. Manual to update destroy（`modal.update({ content })` / `instance.destroy()`） 10. Position（centered / `style.top`） 11. okButtonProps / cancelButtonProps（如 `disabled`） 12. Custom modal content render（`modalRender` + react-draggable） 13. Width（数字 / 响应式断点对象 `{ xs, sm, md, lg, xl, xxl }`，5.23.0） 14. Static Method（`Modal.info / success / error / warning`） + Static confirmation（`Modal.confirm`） + destroyAll + Custom semantic dom styling。

**ccui 文档 demo（共 6 条）**：1. 基本使用 2. 自定义按钮文字 / 类型（ok-type） 3. 异步关闭（ok-loading） 4. 居中显示 5. 自定义宽度（数字 / 字符串） 6. 不带按钮 / 自定义页脚（footer slot）。

**ccui 缺失的 ant demo**：

- **`Modal.confirm` / `Modal.info` / `Modal.success` / `Modal.error` / `Modal.warning` 五个静态方法**
- **`Modal.useModal()` Hook**：返回 `[modal, contextHolder]`，支持 await Promise（confirmed = await modal.confirm({...})）
- `Modal.destroyAll()`：路由切换时清空所有 confirm 弹窗
- `Modal.update()` / `instance.update(prevConfig => ...)`：动态更新内容（如倒计时）
- Footer render function 模式（`(_, { OkBtn, CancelBtn })`）
- 响应式 width（断点对象，5.23.0）
- `modalRender` 自定义包裹（如做可拖拽）
- mask blur 蒙层模糊（v6 新增）
- Loading skeleton 占位（5.18.0）
- okButtonProps / cancelButtonProps（透传 button props）
- semantic dom 样式 hook

**ccui 特有 demo**：footer slot 暴露 `{ ok, cancel }` 是 Vue 风格写法（ant 是 render function 形态，等价但实现风格不同）。

### Props 对比

**ccui 缺失的 ant props**（按 ant API 顺序）：

- `afterClose()` / `afterOpenChange(open)`：动画完毕回调。
- `cancelButtonProps` / `okButtonProps`：透传 [ButtonProps] 到底部按钮（含 disabled、href、size、loading 等）。
- `classNames` / `styles`：semantic DOM。
- `closable` 对象形式：`{ closeIcon, disabled, onClose, afterClose }`。
- `closeIcon`：自定义关闭图标。
- `confirmLoading`：等价 `okLoading`，ccui 用了 `okLoading`，命名差异。
- `destroyOnHidden`（5.25.0）：替代 `destroyOnClose`，ccui 仅 `destroyOnClose`。
- `focusable`：`{ trap, focusTriggerAfterClose, autoFocusButton }`（6.2.0）；`focusTriggerAfterClose` 顶层旧版也缺。
- `footer`：ant 接受 `ReactNode | (originNode, { OkBtn, CancelBtn }) => ReactNode`；ccui 用 slot 实现，但缺 OkBtn / CancelBtn render 入口。
- `forceRender`：强制预渲染。
- `getContainer`：`HTMLElement | () => HTMLElement | selector | false`；ccui 仅 `appendToBody: boolean`。
- `keyboard`：ccui 用 `closeOnEsc`，命名不同。
- `loading`：skeleton 占位（5.18.0）。
- `mask` 对象形式：`{ enabled, blur, closable }`（v6.3 mask.closable）。
- `maskClosable`：ccui 有，命名一致。
- `modalRender(node)`：自定义包裹 render（4.7.0+）。
- `width` 响应式：`Breakpoint` 对象（5.23.0）。
- `wrapClassName` / `zIndex`：`zIndex` 已有，`wrapClassName` 缺。
- `style.top` 调整距顶距离（虽然 style 可传，但缺 `top` 语义）。

**命名/形状差异**：

- `visible` vs `open`、`okLoading` vs `confirmLoading`、`closeOnEsc` vs `keyboard`、`hideFooter` vs `footer={null}`、`appendToBody` vs `getContainer`：**5 处命名差异**，全部偏向 antd v4 / Element Plus 风格。

**ccui 特有 props**：

- `hideFooter: boolean`：直接隐藏页脚（ant 用 `footer={null}`）。
- `appendToBody: boolean`：仅布尔；缺函数 / selector / false 三态。

### Events / 方法 对比

**缺失 events**：`afterClose`、`afterOpenChange(open)`。
**缺失 expose 方法**：无（实例方法主要在静态 API 上）。

### 子组件 / 静态导出 / 命令式 API（**重大缺口集中区**）

**缺失**：

- **`Modal.confirm(config)`**：返回 `{ destroy, update, then }`，是 ant 用得最频繁的命令式 API。
- **`Modal.info(config)` / `Modal.success(config)` / `Modal.error(config)` / `Modal.warning(config)`**：四个语义化命令式入口。
- **`Modal.destroyAll()`**：路由切换批量销毁；属于 SPA 必备防泄漏 API。
- **`Modal.useModal()` Hook**：返回 `[modal, contextHolder]`，仅 Hook 版支持 `await modal.confirm(...)` Promise 形态。
- `instance.update()` / `instance.update(prevCfg => newCfg)`：函数式更新当前 modal。
- `instance.destroy()`：销毁指定 modal 实例。
- `OkBtn` / `CancelBtn` render props（footer 重排时用）。

**整体定性**：ccui Modal 只有"组件模式"，没有"命令式 + Hook 模式"。是本批次最大单点缺口。

---

## Notification

- Ant 段：`## notification`（行 33008–33893）
- ccui types：`packages/ccui/ui/notification/src/notification-types.ts`
- ccui docs：`packages/docs/components/notification/index.md`
- ccui 自报状态：核心五个 API 齐了，Hook / 高级配置缺。

### Demo 对比

**Ant 官方 demo（共 9 条）**：1. Hooks usage（`useNotification` + `contextHolder` 取 ConfigProvider context） 2. Duration（含 0 永不关） 3. Icon types（success / info / warning / error） 4. Custom close button（`btn` / 现 `actions` 5.24.0） 5. Customized Icon（ReactNode） 6. Placement（**6 个方位**：top / topLeft / topRight / bottom / bottomLeft / bottomRight，v5.23 新增 top / bottom 居中两位置） 7. Update Message Content（同 key 替换） 8. Stack（5.10.0+，`{ threshold: 3 }`，**默认开启**） 9. Show with progress（`showProgress` + `pauseOnHover`，5.18.0） + Static Method (deprecated) + Customize progress bar color + Custom semantic styles。

**ccui 文档 demo（共 6 条）**：1. 基本使用（success） 2. 不同类型 3. 弹出位置（4 个角） 4. 自定义停留时长 5. 主动关闭 + 关闭回调 6. 全局清空 destroy。

**ccui 缺失的 ant demo**：

- **`notification.useNotification()` Hook**：能拿 contextHolder 注入到 Vue tree 中取 ConfigProvider context。**重大缺口**。
- **`placement` 6 个方位**：ccui 只有 4 个角（topLeft / topRight / bottomLeft / bottomRight），缺 v5.23 加的居中位 `top` / `bottom`。
- Stack 折叠堆叠（默认 threshold=3）
- `showProgress` 进度条（5.18.0）+ `pauseOnHover`（5.18.0）
- 自定义 `actions` 按钮组（5.24.0，旧名 `btn`）
- `notification.config(options)` 全局配置
- `maxCount`、`closeIcon`、`getContainer`、`rtl`、`top` / `bottom` 距离
- 同 key 替换 demo
- Customize progress bar color（token override）
- semantic dom 样式 hook

**ccui 特有 demo**：无显著。

### Props 对比

**ccui 缺失的 ant props**（按 ant API 顺序）：

- `actions`（5.24.0）：自定义按钮组（旧 `btn` 已 deprecated）。
- `className` / `classNames` / `style` / `styles`：semantic DOM 与单条样式 hook。
- `closeIcon`：自定义关闭图标 ReactNode。
- `key`：单条标识（types 里 NotificationOptions 缺 `key` 字段；ant 是顶层 string）。**ccui 类型上未声明 key**，无法做"同 key 替换"。
- `pauseOnHover`（5.18.0）：悬停暂停计时。
- `placement` 缺 `top` / `bottom` 两个居中值（v5.23）。
- `props`：透传 `data-*` / `aria-*` / `role`。
- `role`：`alert | status`（5.6.0，影响屏幕阅读器抢话）。
- `showProgress`（5.18.0）：进度条显示。
- 全局 `config()` 缺所有字段：`bottom` / `closeIcon` / `getContainer` / `placement` / `showProgress` / `pauseOnHover` / `rtl` / `top` / `maxCount` / `stack`。

**命名/形状差异**：

- `duration`：ant 单位**秒**（默认 4.5），ccui 单位**毫秒**（默认 4500）。
- `description`：ccui 已支持 `string | VNode`；ant 支持 ReactNode。
- `title`：两边一致（ant v6 已用 `title` 替代旧 `message`）。

**ccui 特有 props**：

- `showClose: boolean`（默认 true）：单条关闭按钮开关；ant 是用 `closeIcon=null/false` 隐藏。
- `customClass: string`：旧式 class hook。

### Events / 方法 对比

**缺失 events**：`onClick`（点击通知体）。
**缺失 expose 方法**：

- `api.destroy(key?)`：按 key 销毁单条；ccui `destroy()` 只能全清。
- `api.open(config)` / `api[level](config)` 已有，但缺 `key` 字段支持。

### 子组件 / 静态导出 / 命令式 API

**缺失**：

- **`notification.useNotification(config)` Hook**：与 `useMessage` / `useModal` 三件套核心。**重大缺口**。
- **`notification.config(options)` 全局配置**：影响 placement / maxCount / top / bottom / rtl / showProgress / stack 等。
- **6 方位 placement**（缺 `top` / `bottom`，v5.23）。
- **`stack` 堆叠折叠**（5.10.0，默认 `{ threshold: 3 }`）：v6 重要交互。
- **`maxCount` 上限保护**：超出丢最旧。

---

## Popconfirm

- Ant 段：`## popconfirm`（行 34350–34929）
- ccui types：`packages/ccui/ui/popconfirm/src/popconfirm-types.ts`
- ccui docs：`packages/docs/components/popconfirm/index.md`
- ccui 自报状态：基础形态齐，缺 sharedProps（tooltip 系列）大头。

### Demo 对比

**Ant 官方 demo（共 8 条）**：1. Basic（title + description + onConfirm + onCancel） 2. Locale text（okText / cancelText） 3. Placement（**12 方位**：top / topLeft / topRight / left / leftTop / leftBottom / right / rightTop / rightBottom / bottom / bottomLeft / bottomRight） 4. Auto Shift（视口边缘自动调整） 5. Conditional trigger（结合 `onOpenChange`） 6. Customize icon 7. Asynchronously close（`okButtonProps={{ loading }}`） 8. Async close on Promise（`onConfirm` 返回 Promise，自动 loading + 关闭） + Custom semantic dom styling。

**ccui 文档 demo（共 6 条）**：1. 基本使用 2. 自定义按钮文案 3. 不同确定按钮风格（confirm-type） 4. 改变弹出方位（3 个示例：top / right / bottom-end） 5. 隐藏图标 + 自定义图标颜色 6. 受控显示（v-model:visible）。

**ccui 缺失的 ant demo**：

- 完整 12 方位演示（ccui 文档只演示了 3 个；popover 文档演示了 12 但 popconfirm 没）
- Auto Shift 边缘自动翻转
- Conditional trigger（`onOpenChange` 拦截）
- Promise 返回 + 自动 loading（ant 关键交互）
- `okButtonProps` / `cancelButtonProps` 透传

**ccui 特有 demo**：受控显式 manual trigger 异步校验后再弹（业务向）。

### Props 对比

**ccui 缺失的 ant props**：

- `okButtonProps` / `cancelButtonProps`：透传 ButtonProps（含 loading / disabled / size / danger 等）。
- `showCancel`（4.18.0）：是否显示取消按钮（适合单按钮告知场景）。
- `onPopupClick(e)`（5.5.0）：点击 popup 自身回调。
- `description: ReactNode | () => ReactNode`：ccui 是 string，缺 function 形态。
- `title: ReactNode | () => ReactNode`：同上。

**Popconfirm 还共享 Tooltip 的 sharedProps（embed），ccui 全缺**：

- `arrow`：`boolean | { pointAtCenter: boolean }`（ccui 完全没有 arrow 控制 prop，更别说 `pointAtCenter`）。
- `autoAdjustOverflow`：边缘自动翻转。
- `align`：rc-trigger 高级对齐配置。
- `defaultOpen`：非受控默认显示。
- `destroyTooltipOnHide`：隐藏时销毁 DOM。
- `fresh`：关闭时不缓存内容（44830 issue 引入）。
- `getPopupContainer(trigger)`：自定义挂载节点（避免 overflow / transform 截断）。
- `mouseEnterDelay` / `mouseLeaveDelay`：ant 字段；ccui 是 `showAfter`（不在 popconfirm，只在 popover）。
- `open` / `onOpenChange`：ant 是 `open`，ccui 是 `visible`。
- `placement`：12 方位字符串；ccui 沿用 popover 的 12 值（`top-start` 而非 `topLeft`），ant v6 沿用 `topLeft` 形态。**命名风格不同**。
- `trigger`：`click | hover | focus | contextMenu | array`；ccui 仅 4 值且不含数组。
- `zIndex`。
- `color`（5.27.0）：popconfirm/popover 改 popup 背景色。

**命名/形状差异**：

- `visible` vs `open`、`confirm-text` vs `okText`、`confirm-type` vs `okType`、`hideIcon` vs `icon={null}`：4 处命名差异。
- placement 命名 `top-start` / `bottom-end`（kebab-case + start/end）vs ant `topLeft` / `bottomRight`（camelCase + Left/Right）。**风格差异**。

**ccui 特有 props**：

- `iconColor: string`（默认 `#faad14`）：硬编码警告色；ant 是通过 `icon` slot 自带样式。
- `hideIcon: boolean`：一键隐藏图标。
- `width: number | string`：popup 宽度（ant 无对等顶层 prop）。

### Events / 方法 对比

**缺失 events**：`onPopupClick(e)`、`onOpenChange(open: boolean, e?, info?)`（ccui 仅 `update:visible`，无 info）。
**缺失 expose 方法**：无显著。

### 子组件 / 静态导出 / 命令式 API

**缺失**：无子组件层面缺口；主要是 sharedProps 整组缺。

---

## Popover

- Ant 段：`## popover`（行 34931–35440）+ sharedProps（embed 自 tooltip）
- ccui types：`packages/ccui/ui/popover/src/popover-types.ts`
- ccui docs：`packages/docs/components/popover/index.md`
- ccui 自报状态：feedback_codex 中提到 "popover / tooltip / float-button 审查后质量良好，无需改写"，但 sharedProps 对齐度仍有差距。

### Demo 对比

**Ant 官方 demo（共 8 条）**：1. Basic 2. Three ways to trigger（hover / focus / click） 3. Placement（12 方位） 4. Arrow（show / hide / `{ pointAtCenter: true }`） 5. Auto Shift（边缘自动翻转） 6. Controlling the close（`open` + `onOpenChange`） 7. Hover with click popover（嵌套 hover + click 两层） 8. Custom semantic dom styling。

**ccui 文档 demo（共 8 条）**：1. 基本用法 2. 悬停触发 3. 自定义内容与标题插槽 4. 位置与主题（12 方位 + dark/light） 5. v-model 显隐控制 6. 右键菜单触发（contextmenu） 7. 虚拟触发（virtual-triggering） 8. 嵌套操作 + 自动关闭。

**ccui 缺失的 ant demo**：

- `arrow={{ pointAtCenter: true }}`（箭头对齐元素中心而非边缘）
- Auto Shift 视口边缘自动翻转
- Hover + Click 嵌套两层

**ccui 特有 demo**：

- `contextmenu` 右键触发（ant Popover 文档无此 demo，需 Dropdown 才有）
- `virtual-triggering` + `virtual-ref`（Element Plus 风格，ant 用 `_overlayInnerStyle` 或自己控制）
- `auto-close: number`（毫秒后自动关闭，ccui 特色）
- light / dark 双主题切换（`effect` prop）

### Props 对比

**ccui 缺失的 ant props**：

- `arrow`：`boolean | { pointAtCenter }`；ccui 只有 `showArrow: boolean`，缺 pointAtCenter。
- `autoAdjustOverflow`：边缘自动翻转。
- `color`（5.27.0）：popup 背景色。
- `defaultOpen`：非受控默认显示。
- `destroyTooltipOnHide`：隐藏时销毁 DOM。
- `fresh`：关闭时不缓存内容。
- `getPopupContainer(trigger)`：**重要** 自定义挂载节点。ccui 用 `teleported: boolean`，仅二态。
- `mouseEnterDelay` / `mouseLeaveDelay`：ant 命名；ccui 用 `showAfter` / `hideAfter`，语义等价但命名不同（毫秒单位一致）。
- `align`：rc-trigger 高级对齐配置。
- `zIndex`。
- `onOpenChange` 与 info：ccui 仅 `update:visible`。
- `popupRender`：自定义 popup 内容 render。

**命名/形状差异**：

- placement 命名 `top-start` / `bottom-end` vs ant `topLeft` / `bottomRight`。
- `visible` vs `open`、`showArrow` vs `arrow`、`teleported` vs `getPopupContainer`、`popperClass` vs `overlayClassName`：4 处命名差异。
- `effect: 'dark' | 'light'`：ccui 借用 Element Plus 命名；ant Popover 没有显式 effect 字段，但有 `color` prop。

**ccui 特有 props**：

- `effect: 'dark' | 'light'`：主题（ant 无对应）。
- `virtualTriggering` / `virtualRef`：虚拟触发器（Element Plus 风格）。
- `closeOnEsc`、`hideOnClickOutside`、`autoClose`、`enterable`、`triggerKeys`、`tabindex`、`persistent`、`rawContent`：**Element Plus 风格的细颗粒度交互控制**，ant 没有。
- `transition: string`：自定义过渡动画名。

### Events / 方法 对比

**ccui 已有但 ant 没**：`before-show` / `before-hide` / `before-enter` / `after-enter` / `before-leave` / `after-leave`（动画前后细分），ant 只有 `onOpenChange`。
**缺失 events**：`onOpenChange(open, info)`（含 info source）。
**ccui 已暴露 expose**：`hide()` 方法。**ant 无对应 expose**，但有 `popupRender` 等可替代。

### 子组件 / 静态导出 / 命令式 API

**缺失**：无；本组件 ccui 维度上较为充实，主要差距在 `arrow.pointAtCenter` / `getPopupContainer` / `fresh` / `destroyTooltipOnHide`。

---

## Progress

- Ant 段：`## progress`（行 35442–36053）
- ccui types：`packages/ccui/ui/progress/src/progress-types.ts`
- ccui docs：`packages/docs/components/progress/index.md`
- ccui 自报状态：100%（changelog 列出 line/circle/dashboard + active/exception）。

### Demo 对比

**Ant 官方 demo（共 12 条）**：1. Progress bar（line + status + showInfo） 2. Circular progress bar 3. Mini size 4. Responsive circular（`width<20` 显示 tooltip） 5. Mini circle 6. Dynamic（+/− 加减） 7. Custom text format 8. Dashboard（含 `gapDegree` / `gapPlacement`） 9. Success segment（`success={{ percent }}`） 10. Stroke Linecap（`round | butt | square`） 11. Custom line gradient（对象 `{ '0%': color }` 或 `{ from, to }`） 12. Progress bar with steps（`steps={N}` / 数组 strokeColor） + Circular with steps（`steps={{ count, gap }}`） + Progress size（数字 / `[w, h]` 数组） + Change progress value position（`percentPosition`） + Custom semantic dom styling。

**ccui 文档 demo（共 7 条）**：1. 基本使用 2. 不同状态（normal / active / success / exception） 3. 自定义颜色（stroke-color / trail-color） 4. 自定义文案（format） 5. 圆形 6. 仪表盘 7. 动态进度。

**ccui 缺失的 ant demo**：

- Steps 多段进度（`steps={3}` 阶梯式）：**ant 标志特性，ccui 完全没有**
- Success segment 双段（已完成 + 进行中两色显示）
- 渐变色（对象 + from/to 写法）
- `strokeLinecap` 切换 round/butt/square
- 圆环 with steps（`{ count, gap }`）
- `percentPosition` 数值位置（inside / outside / start / end，5.18.0）
- Responsive 圆形（width < 20 时显示 tooltip）

**ccui 特有 demo**：无显著新增。

### Props 对比

**ccui 缺失的 ant props**：

- `classNames` / `styles`：semantic DOM。
- `railColor`：未填充部分颜色（v6 起 `trailColor` 已 deprecated 改 `railColor`）；ccui 仍叫 `trailColor`。
- `strokeColor` 对象 / 数组形态：ccui 仅 string，无法做渐变、无法配合 steps 做分段色。
- `strokeLinecap`：`round | butt | square`。
- `success`：`{ percent, strokeColor }` 双段显示。
- `size`：ccui 已支持 `'default' | 'small' | number | [number, number]`；ant 6.x 命名是 `'small' | 'medium'`（不是 `default`），并支持 `{ width, height }` 对象（5.18.0）。
- `type="line"` 专属：
  - `steps`：number 阶梯式（ant 招牌）。
  - `rounding`：四舍五入函数（5.24.0）。
  - `percentPosition`：`{ align, type }` 位置（5.18.0）。
- `type="circle"` 专属：
  - `steps`：`number | { count, gap }`（5.16.0）。
  - `strokeWidth`：圆环描边宽（已有，但缺尺寸单位说明）。
- `type="dashboard"` 专属：
  - `gapDegree`：缺口角度（0–295）。
  - `gapPlacement`：`top | bottom | start | end`。

**命名/形状差异**：

- `width: number`：ccui 顶层就有；ant 用 `size` 数值/对象统一表达。
- ant `status` 默认无值（不显式状态），ccui 默认 `'normal'`。

**ccui 特有 props**：

- `width: number`（默认 120）：圆形 / 仪表盘画布尺寸。ant 已用 `size` 统一表达。
- `clampPercent(p)`：暴露工具函数（ant 在内部处理）。

### Events / 方法 对比

**缺失 events**：无（Progress 是纯展示组件，ant 也无 events）。
**缺失 expose 方法**：无。

### 子组件 / 静态导出 / 命令式 API

**缺失**：

- **`steps` 多段形态**（line / circle 两种）：ant 标志特性。
- success 双段进度。
- 渐变 strokeColor 对象 / 数组。

---

## Result

- Ant 段：`## result`（行 37474–37830）
- ccui types：`packages/ccui/ui/result/src/result-types.ts`
- ccui docs：`packages/docs/components/result/index.md`
- ccui 自报状态：100%（changelog 中列在 result.tsx fill 重构等条目）。

### Demo 对比

**Ant 官方 demo（共 8 条）**：1. Success（含 extra 数组按钮） 2. Info 3. Warning 4. 403 5. 404 6. 500 7. Error（复杂错误：Typography + Paragraph 列出错误项） 8. Custom icon + Custom semantic dom styling。

**ccui 文档 demo（共 6 条）**：1. 基本使用（success） 2. 不同状态（error / warning / info） 3. HTTP 错误页（404 / 403 / 500） 4. 自定义图标 5. 携带详细内容（默认 slot 展示错误列表）。

**ccui 缺失的 ant demo**：

- semantic dom 样式 hook 演示
- 复杂 Typography 排版错误页（轻微缺，可由 default slot 自由组合）

**ccui 特有 demo**：HTTP 错误三态各自独立 demo 块（比 ant 散列在三个 demo 中更直观）。

### Props 对比

**ccui 缺失的 ant props**：

- `classNames` / `styles`：semantic DOM 样式 hook（支持函数 `(info: { props }) => Record<...>`）。
- `extra`：ant 是 ReactNode 顶层 prop；ccui 用 `#extra` slot 实现，等价但 prop 入口缺。
- `icon`：ant 是 ReactNode 顶层 prop；ccui 是 `string`（图标类名）+ `#icon` slot；缺 VNode 直传。
- `subTitle`：ant 是 ReactNode；ccui 是 string。
- `title`：ant 是 ReactNode；ccui 是 string。

**命名/形状差异**：

- `status` 枚举两边一致（`success | error | info | warning | 404 | 403 | 500`），✅。
- `subTitle` 命名一致，✅。

**ccui 特有 props**：无（与 ant 重合度高）。

### Events / 方法 对比

**缺失 events**：无（Result 纯展示）。
**缺失 expose 方法**：无。

### 子组件 / 静态导出 / 命令式 API

**缺失**：无；Result 在 ccui 这边对齐度相对最好。主要差距是 `string` vs `ReactNode/VNode` 类型扩展。

---

## Skeleton

- Ant 段：`## skeleton`（行 40128–40572）
- ccui types：`packages/ccui/ui/skeleton/src/skeleton-types.ts`
- ccui docs：`packages/docs/components/skeleton/index.md`
- ccui 自报状态：100%（changelog 列在 100% 集合中）。

### Demo 对比

**Ant 官方 demo（共 6 条）**：1. Basic 2. Complex combination（`avatar + paragraph={{ rows: 4 }}`） 3. Active Animation 4. **Button/Avatar/Input/Image/Node**（5 个子组件 + size + shape + block 切换面板） 5. Contains sub component（loading 切换显示真实内容） 6. List（结合 List 组件做列表占位） + Custom semantic dom styling。

**ccui 文档 demo（共 7 条）**：1. 基本使用 2. 带动画（active） 3. 带头像（avatar + 对象形式） 4. 段落自定义（rows / width 数组） 5. 标题自定义 6. 圆角化（round） 7. 切换为真实内容（loading + default slot）。

**ccui 缺失的 ant demo**：

- **Skeleton.Button / Skeleton.Avatar / Skeleton.Input / Skeleton.Image / Skeleton.Node 五个子组件**：单独占位元素，配合 size / shape / block 配置。**重大缺口**。
- 列表场景（`<Skeleton>` 包裹 `<List.Item.Meta>`）。

**ccui 特有 demo**：圆角化 `round` 单独 demo（ant 也有但归入 API 介绍）。

### Props 对比

**ccui 缺失的 ant props**：

- 顶层 `Skeleton` 已基本对齐：`active` / `avatar` / `loading` / `paragraph` / `round` / `title`，✅。
- **5 个子组件的所有 props**：
  - `Skeleton.Avatar`：`active` / `shape: 'circle' | 'square'` / `size: number | 'large' | 'medium' | 'small'`。
  - `Skeleton.Button`：`active` / `block: boolean`（4.17.0） / `shape: 'circle' | 'round' | 'square' | 'default'` / `size`。
  - `Skeleton.Input`：`active` / `size` / `block`。
  - `Skeleton.Image`：（无文档 API 行但 demo 中演示了 `active`）。
  - `Skeleton.Node`：自定义占位节点（如内嵌图标），`active` + `children`。
- `classNames` / `styles`：semantic DOM。

**命名/形状差异**：

- `paragraph.width`：ant 支持 `number | string | Array<number | string>`，ccui 已对齐。
- `loading` 默认值：ant 是 `undefined`（无默认），ccui 是 `true`。**默认行为不同**：ccui 默认就是 skeleton 态，ant 是默认显示 children。

**ccui 特有 props**：无。

### Events / 方法 对比

**缺失 events**：无（纯展示）。
**缺失 expose 方法**：无。

### 子组件 / 静态导出 / 命令式 API

**缺失**：

- **`Skeleton.Avatar` / `Skeleton.Button` / `Skeleton.Input` / `Skeleton.Image` / `Skeleton.Node` 五个静态子组件**：**重大缺口**。
- 默认 `loading` 值差异需要在迁移文档中明示。

---

## Spin

- Ant 段：`## spin`（行 41998–42374）
- ccui types：`packages/ccui/ui/spin/src/spin-types.ts`
- ccui docs：`packages/docs/components/spin/index.md`
- ccui 自报状态：100%（changelog 中列在 100% 集合）。

### Demo 对比

**Ant 官方 demo（共 8 条）**：1. Basic Usage 2. Size（small / default / large） 3. Embedded mode（`<Spin spinning={true}><Alert /></Spin>`） 4. Customized description（`description` 替代旧 `tip`） 5. Delay 6. Custom spinning indicator（`indicator={<LoadingOutlined spin />}`） 7. **Progress**（`percent: number | 'auto'`，5.18.0） 8. **Fullscreen**（5.11.0） + Custom semantic dom styling。

**ccui 文档 demo（共 6 条）**：1. 基本使用 2. 不同尺寸 3. 加上提示文字（tip） 4. 容器内嵌（spinning） 5. 延迟显示（delay） 6. 全屏模式（fullscreen）。

**ccui 缺失的 ant demo**：

- **Custom spinning indicator**（自定义指示器 ReactNode / slot）
- **Progress**（`percent` 数值 / `'auto'` 不确定进度，5.18.0）
- `description` 富文本描述（v6.3.0 替代 `tip`）
- semantic dom 样式 hook

**ccui 特有 demo**：无显著。

### Props 对比

**ccui 缺失的 ant props**：

- `classNames` / `styles`：semantic DOM hook。
- `description`（6.3.0）：替代旧 `tip`；ant 已建议 `tip` 仅在有 children 时使用，`description` 是新主推。
- `indicator`：自定义旋转节点（ReactNode）。**ccui 完全无自定义 indicator 入口**。
- `wrapperClassName`（已 deprecated → `classNames.root`，但 ccui 全无）。

**命名/形状差异**：

- `size` 命名：ant v6 是 `'small' | 'medium' | 'large'`（**`medium` 不是 `default`**），ccui 仍用 `default`。
- `tip` ccui 仍是核心入口；ant 已弱化为兼容字段。

**ccui 特有 props**：无。

### Events / 方法 对比

**缺失 events**：无（Spin 纯状态展示）。
**缺失 expose 方法**：

- `Spin.setDefaultIndicator(indicator)`：全局默认 indicator 静态方法。**ccui 完全无对应**。

### 子组件 / 静态导出 / 命令式 API

**缺失**：

- 自定义 indicator slot 或 prop。
- `Spin.setDefaultIndicator` 全局静态 API。

---

## Tooltip

- Ant 段：`## tooltip`（行 53060–53603）+ 自身的 sharedProps（被 Popover/Popconfirm embed）
- ccui types：`packages/ccui/ui/tooltip/src/tooltip-types.ts`
- ccui docs：`packages/docs/components/tooltip/index.md`
- ccui 自报状态：feedback_codex 中"质量良好，无需改写"。但 sharedProps 缺口同 Popover。

### Demo 对比

**Ant 官方 demo（共 9 条）**：1. Basic 2. Smooth Transition（`ConfigProvider tooltip={{ unique: true }}` 切换平滑） 3. Placement（12 方位） 4. Arrow（show / hide / `{ pointAtCenter: true }`） 5. Auto Shift（视口边缘自动翻转） 6. **Colorful Tooltip**（13 预设色 + 自定义 hex 色） 7. Disabled（`title={null}` 隐藏） 8. Wrap custom component（forwardRef） 9. Custom semantic dom styling。

**ccui 文档 demo（共 8 条）**：1. 基本用法 2. 位置（12 方位） 3. 主题（dark / light） 4. 更多内容（多行 + raw-content HTML） 5. 触发方式（hover / focus / click） 6. 延迟（show-after / hide-after） 7. 禁用（disabled） 8. 手动控制（visible + trigger=manual）。

**ccui 缺失的 ant demo**：

- **Colorful Tooltip**（13 个预设色 pink/red/yellow/orange/cyan/green/blue/purple/geekblue/magenta/volcano/gold/lime + 自定义 hex）
- Arrow `pointAtCenter` 模式
- Auto Shift 边缘翻转
- ConfigProvider `tooltip.unique` 平滑切换（v6 新增）
- Wrap custom component（VNode + ref 转发）

**ccui 特有 demo**：raw-content HTML 字符串直渲（ant 已不鼓励，但是是兼容 v4 / Element Plus 的写法）。

### Props 对比

**ccui 缺失的 ant props**：

- `color`（5.27.0）：背景色 + 自动文字色适配。**13 预设色**。
- `arrow`：`boolean | { pointAtCenter }`；ccui 只有 `showArrow: boolean`，缺 pointAtCenter。
- `autoAdjustOverflow`：边缘自动翻转。
- `defaultOpen`：非受控默认显示。
- `destroyTooltipOnHide`：隐藏时销毁 DOM。
- `fresh`：关闭时不缓存（44830 issue）。
- `getPopupContainer(trigger)`：自定义挂载节点。
- `mouseEnterDelay` / `mouseLeaveDelay`：ant 命名（ccui 是 `showAfter` / `hideAfter`，语义一致命名不同）。
- `align`：rc-trigger 高级对齐。
- `zIndex`。
- `onOpenChange`。
- `classNames` / `styles`：semantic DOM。
- `title`：ant 顶层用 `title: ReactNode | () => ReactNode`；ccui 用 `content`，**命名不同**且只有 string。

**命名/形状差异**：

- `title` vs `content`：ant 用 `title`，ccui 用 `content`。**命名分歧**。
- `visible` vs `open`、`showArrow` vs `arrow`：命名不一致。
- `effect: 'dark' | 'light'`：ccui Element Plus 风格；ant 已用 `color` 字段 + 内置 token。
- placement 命名 `top-start` 系 vs ant `topLeft` 系。

**ccui 特有 props**：

- `effect: 'dark' | 'light'`：双主题切换。
- `rawContent`：HTML 字符串直渲（ant 用 `dangerouslySetInnerHTML` 自行实现）。
- `enterable`、`showAfter`、`hideAfter`、`ariaLabel`：粒度更细。

### Events / 方法 对比

**ccui 已暴露细分**：`before-show` / `show` / `before-hide` / `hide` / `update:visible`，比 ant 的 `onOpenChange` 更细。
**缺失 events**：`onOpenChange(open: boolean)` 单事件。
**缺失 expose 方法**：无显著（Tooltip 一般无方法暴露）。

### 子组件 / 静态导出 / 命令式 API

**缺失**：

- ConfigProvider `tooltip.unique` 全局唯一 Tooltip 配置（v6 重要 UX，影响切换流畅度）。
- 全局 `color` token + 13 预设色映射。

---

## Tour

- Ant 段：`## tour`（行 53605–54375）
- ccui types：`packages/ccui/ui/tour/src/tour-types.ts`
- ccui docs：`packages/docs/components/tour/index.md`
- ccui 自报状态：**95%**（changelog 明确："`v-model:open` + `v-model:current` 端到端走完一次完整 tour"，19/19 测试通过）。

### Demo 对比

**Ant 官方 demo（共 7 条）**：1. Basic（3 步骤 + ref target + Begin Tour） 2. Non-modal（`mask={false}` + `type="primary"`） 3. Placement（**12 方位** + `target={null}` 居中） 4. Custom mask style（`mask: { style, color }` 单步 / 全局两层） 5. Custom indicator（`indicatorsRender={(current, total) => ...}`） 6. **Custom action**（`actionsRender(originNode, { current, total })` 加 Skip 按钮，5.25.0） 7. Custom highlighted area style（`gap: { offset, radius }`） + Custom semantic dom styling。

**ccui 文档 demo（≥ 3 条已读到）**：1. 基本用法 2. 无目标元素（居中模态） 3. 关闭蒙层（mask=false 全局 / 单步） + 自定义按钮文案 + 上一步/下一步/完成（test 中验证）。

**ccui 缺失的 ant demo**：

- **`indicatorsRender(current, total)` 自定义指示器**（如 `1 / 3`）
- **`actionsRender(originNode, info)` 自定义动作区**（5.25.0，常用于加 Skip 按钮）
- **`gap: { offset, radius }`** 高亮区圆角与偏移
- **`cover`** 单步显示图片 / 视频 cover（基础 demo 中就出现了）：ccui types 已声明 `cover` 字段但 demo 未演示
- `disabledInteraction`（5.13.0）：禁用高亮区交互
- `scrollIntoViewOptions`（5.2.0）：自定义滚动行为
- `nextButtonProps` / `prevButtonProps` 单步透传
- `type: 'default' | 'primary'`：ccui types 已声明，但 demo 未演示对比
- `arrow={{ pointAtCenter }}` / `arrow=false`
- `getPopupContainer`：自定义挂载

### Props 对比（顶层 Tour）

**ccui 缺失的 ant props**：

- `arrow`：ccui 是 `boolean`；ant 是 `boolean | { pointAtCenter }`。**缺 pointAtCenter 子配置**。
- `classNames` / `styles`：semantic DOM hook。
- `closeIcon`（5.9.0）：自定义关闭图标。
- `disabledInteraction`（5.13.0）：禁用高亮区交互。
- `gap`：`{ offset: number | [number, number]; radius: number }`（5.0.0；array offset 5.9.0）。**高亮区圆角偏移完全没有**。
- `keyboard`（6.2.0）：键盘 ←/→ 切换步骤开关。
- `mask` 对象形式：`boolean | { style, color }`；ccui 仅 `boolean`。
- `onChange(current)`：步骤变化回调（current 是**变化前**的步骤，文档明确）。
- `onFinish()`：完成回调，单独事件；ccui 未暴露。
- `scrollIntoViewOptions`：`boolean | ScrollIntoViewOptions`。ccui 有 `scrollIntoViewIfNeeded: boolean`，缺 options 对象。
- `indicatorsRender(current, total)`：自定义指示器。
- `actionsRender(originNode, { current, total })`（5.25.0）：自定义按钮区。
- `getPopupContainer(node)`（5.12.0）：自定义挂载节点。
- `zIndex`（5.3.0）。

### TourStep 对比

**ccui TourStep 缺失字段**：

- `arrow` 单步：`boolean | { pointAtCenter }`。
- `closeIcon` 单步。
- `type: 'default' | 'primary'` 单步覆盖（ccui types 顶层有 type，单步无）。
- `nextButtonProps` / `prevButtonProps`：单步按钮 props 透传。
- `scrollIntoViewOptions` 单步。
- `onClose` 单步关闭回调。

### 命名/形状差异

- `cover` 已声明，需要在 demo 中演示。
- `prevText` / `nextText` / `finishText` 是 ccui 顶层字段；ant 通过 locale + `prevButtonProps.children` 实现。ccui 这个做法对单语言项目更直观。
- placement 命名：ccui 用 `topLeft` 系（**与 ant 一致**），不像 popover 用 `top-start`，✅。

### ccui 特有 props

- `panelWidth: number`（默认 320）：浮层最大宽度。ant 用 `styles.section` / 内置 token 控制。
- `closeOnEsc`、`prevText` / `nextText` / `finishText`：业务向便捷字段。
- `scrollIntoViewIfNeeded: boolean`：简化的二态版。

### Events / 方法 对比

**缺失 events**：`change(current)` / `finish()`（虽然 changelog 提到"末步 finish + 关闭"，但需确认是否独立 emit）。

### 子组件 / 静态导出 / 命令式 API

**缺失**：无子组件层；主要差距在 `gap.radius/offset` / `indicatorsRender` / `actionsRender` / `cover` 演示 / `disabledInteraction`。

---

## 总结：Batch 4 反馈类组件最严重缺口

1. **Hook 三件套全缺**：`message.useMessage()` / `notification.useNotification()` / `Modal.useModal()` 在 ccui 中完全没有对应实现。这是 ant v5+ 主推、v6 强烈推荐的模式，影响 ConfigProvider locale / 主题 token 联动。
2. **Modal 命令式 API 整组缺**：`Modal.confirm/info/success/error/warning` + `Modal.destroyAll` + `instance.update/destroy`。
3. **Skeleton 5 个子组件缺**：Button / Avatar / Input / Image / Node。
4. **Alert.ErrorBoundary 子组件缺**。
5. **Drawer 嵌套 push + resizable + loading（v5.17/v5.18）缺**。
6. **Progress steps 多段 + 渐变 + success 双段 + dashboard gapPlacement 缺**。
7. **Tooltip / Popover / Popconfirm sharedProps 缺**：`getPopupContainer` / `destroyTooltipOnHide` / `arrow.pointAtCenter` / `mouseEnterDelay/LeaveDelay`（命名差异）/ `fresh` / `align` / `autoAdjustOverflow`。
8. **Notification placement 缺 top / bottom 两个居中位（v5.23）+ stack + showProgress + pauseOnHover（v5.18）+ useNotification Hook**。
9. **Spin: indicator slot/prop + percent 进度 + Spin.setDefaultIndicator 静态方法缺；size 命名 default vs medium 不一致**。
10. **Tour 已 95%**，剩余 `gap.radius/offset` / `indicatorsRender` / `actionsRender` / `cover` demo / `disabledInteraction` / TourStep 透传 button props / `onChange/onFinish` 独立事件。
11. **统一命名分歧**：`visible` vs `open`、`closeOnEsc` vs `keyboard`、`okLoading` vs `confirmLoading`、`appendToBody` vs `getContainer`、`showArrow` vs `arrow`、`popperClass` vs `overlayClassName`、`hideAfter/showAfter` vs `mouseEnterDelay/mouseLeaveDelay`、`top-start` vs `topLeft` placement 命名风格。建议在迁移文档中专题列出。
12. **duration 单位不一致**：message / notification 是毫秒 vs ant 的秒。
13. **classNames / styles semantic DOM 样式 hook（v6 主推）13 组件全部缺**：是本批的横向系统级缺口。
