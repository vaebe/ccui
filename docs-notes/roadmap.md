# vue3-ccui 后续任务清单（roadmap）

> 数据基础：`components-diff/references/per-component/` 73 组件 4305 行明细 + `components-diff.md` 第 6 节「API 风格对齐审计」。
> 分级口径（T-Shirt Size）：**S** <1 天 / **M** 1–3 天 / **L** 3–7 天 / **XL** >1 周。
> 每个 batch 互相不阻塞，可并行；建议节奏：每 sprint 取 1 个 L + 2–3 个 M + 5–10 个 S。
> 每个 batch 完成后在对应行加状态（`[x]` 完成 / `[~]` 推进中），并把交付摘要写到 `components-diff.md` 「三、本轮交付记录」节。

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
| S-01 | Radio.types `String \|\| Number` truthy 表达式 → 接收 number 失败 | `packages/ccui/ui/radio/src/radio-types.ts:12,33` | 改为 `type: [String, Number] as PropType<string \| number>`；补 `<c-radio :value="1">` 测试 | [ ] |
| S-02 | InputNumber size 字面值 `lg/md/sm` 与库内其他组件 `large/default/small` 不一致 | `packages/ccui/ui/input-number/src/input-number-types.ts` | size 接受 `'large' \| 'default' \| 'small'`；旧值 `'lg'/'md'/'sm'` 加 runtime warn 并 fallback；docs 同步 | [ ] |
| S-03 | ColorPicker `format: 'hsv'` 与 ant `'hsb'` 字面值差异 | `packages/ccui/ui/color-picker/src/color-picker-types.ts` | format 接受 `'hex' \| 'rgb' \| 'hsb'`；旧 `'hsv'` runtime alias 并 deprecated | [ ] |
| S-04 | Switch `size: 'default'` ↔ ant `'medium'` 命名分歧 | `packages/ccui/ui/switch/src/switch-types.ts` | size 接受两者，`'medium'` 为推荐 | [ ] |
| S-05 | Slider 缺 `onChangeComplete`（mouseup/keyup 触发，Form 联动场景必备） | `packages/ccui/ui/slider/src/slider.tsx` | 新增 emit `change-complete`，参数为最终值；定向测试覆盖鼠标抬起 / 键盘释放 / 拖到 disabled 区域 | [ ] |
| S-06 | Tag `bordered` 已被 ant deprecated → `variant: 'filled' \| 'solid' \| 'outlined'` | `packages/ccui/ui/tag/src/tag-types.ts` | 加 `variant` prop（默认 `'outlined'`）；`bordered={false}` runtime alias 到 `variant='filled'`；docs 加 variant 演示 | [ ] |

**单批合并建议**：S-01 至 S-06 一个 commit 收口，PR 标题 `fix(types): Batch 41-S 机械修复 6 项`。

---

## Tier M-A — 跨组件横向 v5/v6 通用能力（5 批，每批 2–3 天）

> 这 5 批是「一次写完所有录入组件的同一类 prop」，性价比远高于继续推单组件长尾。

| Batch | 范围 | 影响组件 | 预估测试增量 | 验收条件 | 状态 |
| --- | --- | --- | --- | --- | --- |
| M-A1 | `variant: 'outlined' \| 'filled' \| 'borderless' \| 'underlined'`（v5.13.0+） | Input / InputNumber / Select / Cascader / AutoComplete / Mentions / DatePicker / RangePicker / TimePicker / TreeSelect / ColorPicker / Textarea（如有）共 12 个 | +24 | 每组件 4 种 variant 视觉对齐 Ant；提供 demo「Variants」一节 | [ ] |
| M-A2 | `classNames` / `styles` 语义化 DOM 钩子（v5.18.0+） | 录入 12 + 展示 8（Table / Avatar / Badge / Card / List / Image / Tree / Calendar）+ 反馈 5（Modal / Drawer / Alert / Notification / Message）共 25 个 | +25 | 每组件至少 3 个语义化区域（root / popup.root / popup.listItem 等）可独立 className 注入 | [ ] |
| M-A3 | `status: 'error' \| 'warning'` 拉齐 | 8 个未接入的录入（Input / InputNumber / DatePicker / RangePicker / TimePicker / Mentions / AutoComplete / TreeSelect）+ Form item 联动检查 | +16 | status='error' / 'warning' 时边框、阴影、图标对齐；Form 校验失败自动透传 | [ ] |
| M-A4 | `prefix` / `suffixIcon` / `allowClear={ clearIcon }` / `loadingIcon` / `removeIcon` / `expandIcon` 自定义图标钩子 | 10 个录入 | +20 | 每个图标钩子接受 string（Iconify name） / VNode / 默认渲染回退 | [ ] |
| M-A5 | 命名差异统一表（21 项）加 Ant 别名层，旧名 deprecated | Button / Input / Modal / Drawer / Tooltip / Popover / Popconfirm / Form 7 个 | +30 | `open` ↔ `visible`、`title` ↔ `content`、`htmlType` ↔ `nativeType`、`addonBefore/After` ↔ `prepend/append`、`mouseEnterDelay/LeaveDelay` ↔ `showAfter/hideAfter` 等同时支持，旧名 runtime warn 一次 | [ ] |

**单批合并建议**：每批一个 commit。M-A1 是最大头，建议先做。

---

## Tier M-B — 单组件长尾 95→100%（10 批，每批 2–3 天）

| Batch | 组件 | 当前 → 目标 | 剩余项（来自 components-diff §6.3 + per-component） | 状态 |
| --- | --- | --- | --- | --- |
| M-B1 | DatePicker | 95 → 100 | `cellRender` / `minDate` / `maxDate` / `renderExtraFooter` / `showToday` / `disabledTime` / 完整键盘导航 / `multiple`（v6） | [ ] |
| M-B2 | RangePicker | 95 → 100 | `allowEmpty: [boolean, boolean]` / `disabled: [boolean, boolean]` / `separator`（v6.3） / 响应式单面板 / preset 高亮当前命中 | [ ] |
| M-B3 | TimePicker | 95 → 100 | 滚轮 snap / `TimeRangePicker` 独立组件 / `cellRender` | [ ] |
| M-B4 | Cascader | 95 → 100 | `showCheckedStrategy`（SHOW_CHILD / SHOW_PARENT） / `maxTagCount` + `maxTagPlaceholder` + `maxTagTextLength` / 键盘导航 / `optionRender` / `popupRender` / showSearch 对象 `limit`/`matchInputWidth`/`render`/`sort` | [ ] |
| M-B5 | TreeSelect | 80 → 95 | `showSearch` 完整 / `loadData` / `showCheckedStrategy` / 键盘导航 / 半选 v-model | [ ] |
| M-B6 | ColorPicker | 95 → 100 | `presets` 预设色板 / `destroyOnHidden`（v5.25） / EyeDropper API / `panelRender` slot | [ ] |
| M-B7 | Carousel | 95 → 100 | `adaptiveHeight` / `slidesToShow` / `slidesToScroll` / `responsive` 配置 / `pauseOnFocus` / `pauseOnHover` / `pauseOnDotsHover` / `waitForAnimate` / `dotPlacement` 别名 | [ ] |
| M-B8 | Transfer | 95 → 100 | 虚拟滚动 / RTL / `selectionsIcon` 自定义 | [ ] |
| M-B9 | Upload | 95 → 100 | `listType='picture-card'` 完整样式 / chunk 分片 / `Upload.Dragger` 独立子组件 / `Upload.LIST_IGNORE` 常量 | [ ] |
| M-B10 | Tour | 95 → 100 | `gap` / `indicatorsRender` / `actionsRender` / `cover` 演示 / `disabledInteraction` / per-step `nextButtonProps` / `prevButtonProps` / async hooks | [ ] |

---

## Tier L-1 — 基础组件 Ant 别名层（每批 3–5 天，与 M-A5 互补）

> M-A5 只加 prop 别名（不改行为），这里是把 Element Plus 风格 API 真正"加上 Ant 完整能力"。

| Batch | 组件 | 待补 props / 行为 | 状态 |
| --- | --- | --- | --- |
| L-1.1 | Button | `block` / `ghost` / `danger` / `href`/`target`（render 成 `<a>`） / `shape='circle' \| 'round'` / `htmlType` / `loading={ delay, icon }` / `color` / `variant`（v5.21）/ `iconPosition` / `autoInsertSpace`（v5.17，CJK 字符间插空格） | [ ] |
| L-1.2 | Input | `addonBefore`/`addonAfter` 改 slot/VNode / `prefix` / `suffix` / `allowClear`（含 `{ clearIcon }`） / `showCount`（含 `{ formatter }`） / `maxLength` / `status` / `onPressEnter` / `defaultValue` 受控分离 | [ ] |
| L-1.3 | Modal | `open` 受控 + `visible` deprecated / `footer` slot 支持 ReactNode\|VNode\|null / `closable={ closeIcon, disabled, ariaLabel }` 复合 / `afterOpenChange` / `forceRender` / `modalRender` / `wrapClassName` / `keyboard` / `transitionName` / `maskTransitionName` / `focusTriggerAfterClose` | [ ] |
| L-1.4 | Drawer | `open` 别名 / `extra` slot / `loading`（v5.17） / `footer` slot / `afterOpenChange` / `forceRender` / `push`（嵌套抽屉，含 `distance`） | [ ] |
| L-1.5 | Tooltip / Popover / Popconfirm | `title` / `color` / `mouseEnterDelay` / `mouseLeaveDelay` / `getPopupContainer` / `destroyTooltipOnHide` / `arrow={ pointAtCenter }` / `fresh` / `align` / `autoAdjustOverflow` / `overlayClassName` | [ ] |
| L-1.6 | Form | `name` 别名（保留 `prop`）/ `colon` / `labelCol`/`wrapperCol` 栅格 / `valuePropName` / `getValueFromEvent` / `getValueProps` / `hasFeedback` / `warningOnly` / Rule 函数式 / `validateDebounce` / `shouldUpdate` | [ ] |

---

## Tier L-2 — 缺失子组件（每批 3–5 天，按优先级排）

| Batch | 子组件 | 用途 | 状态 |
| --- | --- | --- | --- |
| L-2.1 | `Input.TextArea` | 多行文本：`autoSize: bool \| { minRows, maxRows }` / `showCount` / `allowClear` / `count` | [ ] |
| L-2.2 | `Input.Search` | 搜索框：`enterButton` / `loading` / `onSearch` | [ ] |
| L-2.3 | `Input.Password` | 密码框：`iconRender` / `visibilityToggle: bool \| { visible, onVisibleChange }` | [ ] |
| L-2.4 | `Input.OTP`（v5.18+） | 一次性密码：`length` / `formatter` / `mask` / `onChange(value, info)` | [ ] |
| L-2.5 | `Button.Group` | 按钮组：`size` / `disabled` 透传所有子按钮 | [ ] |
| L-2.6 | `Tag.CheckableTag` + `Tag.CheckableTagGroup` | 可勾选标签：`checked` / `onChange` / 多选组合 | [ ] |
| L-2.7 | `Image.PreviewGroup` | 多图预览：`items` / `preview={ visible, onVisibleChange, current }` / 切换上一张下一张 | [ ] |
| L-2.8 | `Avatar.Group` | 头像组：`maxCount` / `maxStyle` / `maxPopoverPlacement` / `maxPopoverTrigger` | [ ] |
| L-2.9 | `Badge.Ribbon` | 缎带徽标：`text` / `color` / `placement` | [ ] |
| L-2.10 | `Card.Meta` / `Card.Grid` | 卡片元信息 + 网格 | [ ] |
| L-2.11 | `List.Item.Meta` | 列表项元信息：`avatar` / `title` / `description` | [ ] |
| L-2.12 | `Table.Column` / `Table.ColumnGroup` / `Table.Summary` | JSX 列声明 + 汇总行 | [ ] |
| L-2.13 | `Tree.DirectoryTree` | 目录树：默认展开 / 文件图标 | [ ] |
| L-2.14 | `Dropdown.Button` | 下拉按钮：`menu` / `buttonsRender` / 主按钮 + dropdown 双触发 | [ ] |
| L-2.15 | `Skeleton.Button` / `.Avatar` / `.Input` / `.Image` / `.Node` | Skeleton 5 形态变体 | [ ] |
| L-2.16 | `Form.ErrorList` | 错误列表组件 | [ ] |
| L-2.17 | `Menu.SubMenu` / `Menu.ItemGroup` / `Menu.Divider` 独立导出 | 现有 items API 已有；补独立子组件导出便于 JSX 写法 | [ ] |
| L-2.18 | `Statistic.Timer`（v5.25+） | 计时器（替代 Countdown） | [ ] |
| L-2.19 | `Calendar.Header` + `headerRender` | 日历自定义头 | [ ] |
| L-2.20 | `Alert.ErrorBoundary` | 错误边界 | [ ] |
| L-2.21 | `Layout.Sider` 的 `breakpoint` / `onBreakpoint` / `zeroWidthTriggerStyle` / `reverseArrow` | 响应式 Sider | [ ] |
| L-2.22 | `Space.Compact` / `Space.Addon` | 输入紧凑组合 | [ ] |
| L-2.23 | `Splitter.Panel.showCollapsibleIcon` + `orientation` 别名 | 面板可折叠 / 命名对齐 | [ ] |
| L-2.24 | `Cascader.SHOW_CHILD` / `.SHOW_PARENT` 常量 | 多选展示策略静态导出 | [ ] |
| L-2.25 | `TreeSelect.SHOW_PARENT` / `.SHOW_CHILD` / `.SHOW_ALL` 常量 | 多选展示策略静态导出 | [ ] |

---

## Tier L-3 — 命令式 / Hook API（每批 3–5 天）

| Batch | 范围 | 用途 | 状态 |
| --- | --- | --- | --- |
| L-3.1 | `Modal.confirm` / `Modal.info` / `Modal.success` / `Modal.error` / `Modal.warning` / `Modal.destroyAll` / `Modal.update` | 命令式确认弹窗 + 静态实例 | [ ] |
| L-3.2 | `Modal.useModal()` Hook | 返回 `[modal, contextHolder]`，承载静态方法的上下文 | [ ] |
| L-3.3 | `message.useMessage()` Hook | 类似 Modal.useModal，承载 message 上下文 | [ ] |
| L-3.4 | `notification.useNotification()` Hook | 同上 | [ ] |
| L-3.5 | message / notification 通用增强：`stack` / `maxCount` / `pauseOnHover` / `role`（aria） / 多 `placement`（v5.23） / `top`/`bottom` 居中位 / `duration` 单位改秒 | 通知体验对齐 ant | [ ] |
| L-3.6 | `Form.useForm()` Hook | 返回 form 实例，外部命令式 `getFieldsValue` / `setFieldsValue` / `validateFields` / `resetFields` / `scrollToField` 调用 | [ ] |
| L-3.7 | `Typography.Text` / `.Title` / `.Paragraph` / `.Link` 的 `copyable` / `editable` / `ellipsis` 三大交互 | 文案展示标配 | [ ] |

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
| XL-2 | Calendar 从原生 `Date` 迁到 `Dayjs`（对齐 DatePicker 系） | Calendar 全量重写 + valueFormat 协议引入 | 高（数据协议变更） | [ ] |
| XL-3 | 全量 deprecation policy 落地：旧 prop 在 dev mode 触发 console.warn（每个 key 一次性，避免噪音），文档加 deprecated 标记，定一个删除时间窗 | 影响所有 deprecated 标记的 prop（命名差异表 21 项 + Tag.bordered + InputNumber size） | 低 | [ ] |
| XL-4 | 跨组件 ARIA 完整审计 + 键盘导航补齐（Cascader / Menu / Tree / DatePicker 系 / Dropdown / Tabs 等） | 30+ 组件键盘 + screen reader 测试 | 中 | [ ] |
| XL-5 | 国际化二期：DatePicker 系 dayjs/locale 包接入 + 完整 enUS / 其他语言包覆盖 | locale 接口扩展 + 包体积管理 | 中（需要权衡 dayjs 体积） | [ ] |
| XL-6 | Element Plus 风格 API 全量切换到 Ant 风格主名（L-1 + M-A5 完成后），旧名彻底转为 deprecated 兼容层 | README 表述同步 + 公开 v2.0 升级指南 | 高（breaking 升大版本） | [ ] |

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
