# v2 beta deprecation 兼容层清理计划

> **临时文档** — 全部 task 完成后随 commit 一并删除。
>
> **背景**：v2.x 仍在 beta 阶段（最近 tag `v2.0.1-beta.3`），趁正式发布前清掉前面几批引入的 deprecation 兼容代码与 dev warn 接口。不是 v3 breaking——v2 内部演进。
>
> **不变 version**：不需要 bump major。
>
> **执行节奏**：每个 task 单独一个对话 / 一个 commit。完成后回到这里勾选 checkbox。

---

## 决策池（一次性敲定，下次会话直接读）

### 总策略

按"哪种风格更顺 Vue 习惯"做反向决策：

1. **保留旧名、删新名**（Vue 习惯更顺）：Button / Input / Tooltip / Popover / Popconfirm
2. **删旧名、保留新名**（Ant 风格更顺）：Modal / Drawer / Tag / ColorPicker / FormItem ← **本批已完成**（commit `2089965`）
3. **直接删** Form `shouldUpdate` ← 本批已完成
4. **InputNumber size** 跟 Button 对齐（保 `large/default/small`）

### 细化决策（已敲定，下次会话不再问）

| 编号 | 决策点 | 结论 |
|---|---|---|
| ① | Button `variant` / `color` 怎么处理 | 整删 `shape` prop（保 `round/circle` boolean）；整删 `variant` prop（保 `plain` boolean）；**`color` 保留但语义改为「任意 CSS color 字符串」**——通过 inline style 注入 `background-color`（实心 type）/ `color + border-color`（描边 type），不在 SCSS 加专属 modifier。`color` 当前 prop 在 button.scss **没有任何对应样式**（验证过），所以这是新增实现而非"保留" |
| ② | Tooltip `title` 既是 prop 也是 slot —— slot 名要不要也改回 | **slot 改回 `default`**——浮层内容走默认 slot，不引入 `content` 具名 slot（避免和 prop 名一致带来的优先级混乱） |
| ③ | Tooltip / Popover `arrow` 复合形态怎么办 | **舍弃** `pointAtCenter` 能力；`showArrow` 保持纯 boolean |
| ④ | Popconfirm `locale.okText` 是否同步改回 | **改回 `confirmText`**——prop 名与 locale key 一致。4 个 locale 包（zh/en/ja/ko）`Popconfirm.okText` → `Popconfirm.confirmText`；顶层 `okText`（Modal 用）保持不变 |

---

## 已完成 ✅

> 见 commit `2089965`（删 6 组件 9 项 deprecation 兼容层 + 测试 + docs）。
>
> - [x] Form/FormItem `shouldUpdate`
> - [x] Modal `okLoading` / `hideFooter`
> - [x] Drawer `showFooter`
> - [x] Tag `bordered`
> - [x] ColorPicker `format='hsv'`
> - [x] FormItem `prop` → `name`（含 FormItemContext.prop → .name 内部同步）

---

## 剩余 task（按建议执行顺序）

### Task A — InputNumber size 旧值删除（最简，先做 smoke test）

**改动**：删 `'lg' | 'md' | 'sm'` 三个旧值；类型联合从 6 值缩到 3 值，对齐 Button。

- [x] `input-number-types.ts:17` `ISize` 联合 `'large' | 'default' | 'small' | 'lg' | 'md' | 'sm'` → `'large' | 'default' | 'small'`
- [x] `input-number.tsx:25-34` 删 `sizeAliasMap` + `normalizedSize` computed，模板里直接用 `props.size`
- [x] `input-number/test/input-number.test.ts` 删 deprecation 测试 + 把 `size: 'lg'/'md'/'sm'` 改成 `'large'/'default'/'small'`
- [x] `docs/components/input-number/index.md` API 表删旧值
- [x] `packages/ccui/ui/shared/utils/deprecated.ts` 调用方减少，但 util 本身保留（其他组件还在用）

**验收**：`pnpm --filter @vaebe/ccui test` 全过；grep `'lg'|'md'|'sm'` 在 input-number 目录零命中。

---

### Task B — Input 删新名

**改动**：删 Ant 风格新名，保留 Vue 习惯旧名。

- [x] `input-types.ts` 删 `allowClear` / `addonBefore` / `addonAfter` 三个 prop 声明 + JSDoc，保留 `clearable` / `prepend` / `append`
- [x] `input.tsx:38-44` 删 3 段 `warnDeprecated` 调用 + isPropExplicit 检查
- [x] `input.tsx` 内部用到 `props.allowClear ?? props.clearable` 等回退逻辑：简化为直接用 `props.clearable` / `props.prepend` / `props.append`
- [x] 清理未用 import (`isPropExplicit`、`warnDeprecated`、`getCurrentInstance`、`VNode`、`IconifyIcon`)
- [x] slot 名同步：~~addon-before / addon-after~~ 已删除新 slot 名，沿用 `prepend` / `append` slot
- [x] `input/test/input.test.ts` 删 deprecation describe + 改测试中使用的新名为旧名
- [x] `docs/components/input/index.md` API 表把旧名设为主、删新名行
- [x] **级联**：InputSearch 透传 inputProps，同步把 `props.allowClear` / 测试 / docs 改为 `clearable`（**计划外但必要**）

**验收**：grep `allowClear|addonBefore|addonAfter` 在 packages/ccui 零命中。

---

### Task C — Tooltip 删新名

**改动**：5 项 prop 反向（保旧名删新名），slot 名也改回。

- [x] `tooltip-types.ts` 删 `title` / `arrow` / `mouseEnterDelay` / `mouseLeaveDelay` / `overlayClassName` 5 prop + JSDoc；保留 `content` / `showArrow`（boolean）/ `showAfter` / `hideAfter` / `popperClass`
- [x] `tooltip-types.ts` 同时删 `TooltipArrowObject` / `TooltipArrow` 复合类型（pointAtCenter 舍弃）；`showArrow` 类型回到纯 `Boolean`
- [x] `tooltip.tsx:26-38` 删 5 段 deprecation warn 块 + 兼容映射 computed（resolvedTitle / resolvedArrow 等）
- [x] ~~`tooltip.tsx` 模板：`title` slot 改用 `slots.default?.()` 渲染浮层内容~~ → 调整为：`default` slot 仍为 trigger（不破坏 Vue 习惯），`title` slot 删除，`content` slot 保留为浮层内容 slot
- [x] `tooltip/test/tooltip.test.ts` 删 deprecation describe + 改测试用的新名为旧名
- [x] `docs/components/tooltip/index.md` API 表反转
- [x] **级联**：Slider 内部 `<Tooltip title= arrow= overlayClassName=>` → `content= showArrow= popperClass=`；slider.test.ts 4 处 `props('title')` → `props('content')`
- [x] **级联**：`no-self-deprecated.test.ts` Tooltip 已 canonical 的 4 pattern 暂时移除（Popover 用同名 prop 待 Task D 一起清；保留 `teleported` 项给 Popover）

**注意**：Tooltip 还有 `color`/`fresh`/`destroyTooltipOnHide`/`autoAdjustOverflow`/`align`/`getPopupContainer` 等 L-1.5 引入的新能力——**这些不删**（不是 deprecated，是真功能）。仅删上面列出的 5 项。

**验收**：grep `mouseEnterDelay|mouseLeaveDelay|overlayClassName` 在 tooltip 目录零命中；`arrow:` 作为 prop key 零命中。

---

### Task D — Popover 删新名

**改动**：5 项反向，与 Tooltip 联动。

- [x] `popover-types.ts` 删 `arrow` / `mouseEnterDelay` / `mouseLeaveDelay` / `overlayClassName` / `getPopupContainer` 5 prop（注：Popover 没有 `title` deprecation 因为旧版 Popover 用 `title` 表示标题不是内容）
- [x] `popover-types.ts` 删 `PopoverArrow` + `PopoverArrowObject` + `PopoverGetPopupContainer` 复合类型
- [x] `getPopupContainer` 删除后 `teleported`（boolean）回归为唯一控制项
- [x] `popover.tsx:51-63` 删 5 段 warn + 兼容 computed（enterDelay / leaveDelay / arrowEnabled / arrowPointAtCenter / customClassName）
- [x] `popover/test/popover.test.ts` 删 deprecation describe + 改新名为旧名
- [x] `docs/components/popover/index.md` API 表反转
- [x] **级联**：Dropdown / Popconfirm 内部 `<Popover arrow= overlayClassName=>` → `showArrow= popperClass=`
- [x] **收尾**：`no-self-deprecated.test.ts` patterns 清空（Tooltip + Popover 全部收敛完成）

---

### Task E — Popconfirm 删新名 + locale 改回

**改动**：2 项 prop 反向 + 4 个 locale 包 key 同步改回。

- [x] `popconfirm-types.ts` 删 `okText` / `okType` prop 声明 + JSDoc；保留 `confirmText` / `confirmType`
- [x] `popconfirm.tsx:21-24` 删 2 段 warn
- [x] `popconfirm.tsx` 模板：locale 取值从 `cfg.locale?.Popconfirm?.okText` 改为 `cfg.locale?.Popconfirm?.confirmText`
- [x] locale 4 个文件改 key（zh-CN / en-US / ja-JP / ko-KR：`Popconfirm.okText` → `Popconfirm.confirmText`）
- [x] `config-provider-types.ts` 里 `PopconfirmLocale.okText` 改为 `confirmText`
- [x] 顶层 `Modal.okText` 保持不变——只动 `Popconfirm.*` 节
- [x] `popconfirm/test/popconfirm.test.ts` 删 deprecation describe + 改新名为旧名
- [x] `docs/components/popconfirm/index.md` API 表反转

**验收**：grep `Popconfirm.*okText|Popconfirm\.okText` 在 packages 全仓零命中；`Popconfirm.confirmText` 在 4 个 locale 都有。

---

### Task F — Button 删新名 + color 改造为任意 CSS 字符串

**改动量最大**——含新功能开发（不是单纯删除）。

#### F.1 删旧名替代物

- [ ] `button-types.ts` 删 `htmlType` prop（保 `nativeType`）
- [ ] `button-types.ts` 删 `shape` prop **整段**（保 `round` boolean、`circle` boolean）
- [ ] `button-types.ts` 删 `variant` prop **整段** + `ButtonVariant` 类型（保 `plain` boolean）
- [ ] `button-types.ts` 删 `ButtonShape` 类型导出（不再有 prop 用它）
- [ ] `button.tsx:35-58` 删 4 段 warn + `resolvedShape` computed（直接用 `circle/round` boolean）+ `resolvedHtmlType` 简化为 `props.nativeType ?? 'button'`
- [ ] `button.tsx:125-143` butCls 计算里删 `variant-${variant}`、shape 改用 boolean 判断
- [ ] `button.tsx:142` 删 `if (props.variant) cls[ns.m(\`variant-${props.variant}\`)] = true`

#### F.2 改造 `color` 为任意 CSS color（新功能）

- [ ] `button-types.ts` `color` 类型从 `'default' | 'primary' | 'danger'` 联合改为 `String`（任意 CSS color）
- [ ] `button-types.ts` 删 `ButtonColor` 类型导出
- [ ] `button.tsx:141` 删 `cls[ns.m(\`color-${props.color}\`)] = true` 这行 className 注入
- [ ] `button.tsx` 在 setup 里新增 `customColorStyle` computed：
  - 当 `props.color` 非空且 `type` 属于实心型（primary/success/warning/danger/info）→ 注入 `{ backgroundColor: props.color, borderColor: props.color }`
  - 当 `props.color` 非空且 `type` 属于描边型（''/default/dashed）→ 注入 `{ color: props.color, borderColor: props.color }`
  - 当 `type` 是 `text`/`link` → 仅注入 `color`
  - 当 `props.color` 为空字符串 → 返回 undefined（不污染 style attr）
- [ ] `button.tsx` `<button>` / `<a>` 的 style 属性合并 customColorStyle
- [ ] hover/active 不做联动（用户用 CSS class 自己兜底，文档说明此限制）

#### F.3 测试 / 文档

- [ ] `button/test/button.test.ts` 删 deprecation describe（4 段）+ 改新名为旧名
- [ ] 新增 button color 自定义颜色的测试（实心/描边/text 三类 type）
- [ ] `docs/components/button/index.md` API 表反转 + 新增 color 自定义颜色 demo

**验收**：grep `htmlType|ButtonShape|ButtonVariant|ButtonColor` 在 packages 零命中；新加的 customColorStyle 测试通过。

---

### Task G — 公共配套

**前提**：A-F 都完成后做。

- [ ] **codemod 反向重写**：`scripts/codemod-v1-to-v2.mjs` → `scripts/codemod-pre-v2-to-v2.mjs`（或类似命名），把 Button/Input/Tooltip/Popover/Popconfirm 5 组件的映射方向反转（新→旧），保留 Modal/Drawer/Tag/ColorPicker/FormItem 5 组件方向不变（旧→新）
- [ ] `scripts/CODEMOD.md` 同步更新（或如果对内开发不需要保留 v1 codemod，**直接删 codemod-v1-to-v2.mjs 和 CODEMOD.md**——v2 还没正式 GA，没有 v1 升级用户）
- [ ] `docs-notes/roadmap.md` 的 V3 节（行 1192-1218）重写：
  - 由于本批清理已经在 v2 beta 内完成，"Tier V3 删旧名" 这一节**整段删除**或改为「已在 v2 beta 阶段做完」
  - 同时清理 roadmap 里所有「下一大版本移除」相关字样
- [ ] `CHANGELOG.md` 加一条 v2.0.1-beta.4（或下一 beta）的 entry，列出所有 breaking 改动
- [ ] **不变** version 号（v2.0.1-beta.x 持续）
- [ ] `packages/ccui/ui/shared/utils/deprecated.ts` 文件**保留**（util 设计为通用，可能未来其他场景还会用）；但如果所有 `warnDeprecated` 调用都没了，**删 `isPropExplicit` 和 `warnDeprecated` 两个 export**，只保留 `__resetDeprecatedWarningsForTest` 给测试用。先 grep 确认全仓没有 warnDeprecated 调用后再删。
- [ ] 删除 `__resetDeprecatedWarningsForTest` 在 test 文件中的残留 import

---

### Task H — docs 站全面 sweep

**前提**：A-G 都完成后做最终扫描。

- [ ] `docs/components/button/index.md` — demo / API 表用旧名（删 htmlType/shape/variant/color 枚举）
- [ ] `docs/components/input/index.md` — demo / API 表用旧名
- [ ] `docs/components/tooltip/index.md` — demo / API 表用旧名 + slot 改 default
- [ ] `docs/components/popover/index.md` — demo / API 表用旧名
- [ ] `docs/components/popconfirm/index.md` — demo / API 表用旧名 + locale 文案说明
- [ ] `docs/components/modal/index.md` — 删 okLoading/hideFooter 残留
- [ ] `docs/components/drawer/index.md` — 删 showFooter 残留
- [ ] `docs/components/tag/index.md` — 删 bordered 残留
- [ ] `docs/components/color-picker/index.md` — 删 format='hsv' 残留
- [ ] `docs/components/form/index.md` — 删 FormItem prop 残留（task #3 已部分做过，再扫一遍）
- [ ] `docs/components/input-number/index.md` — 删 size 旧值（task A 已部分做过，再扫一遍）
- [ ] `examples/consumer/src/` — fixture 里如果用了旧 API 同步改
- [ ] **跑文档站本地预览** (`pnpm run dev`) 全量 click 一遍各组件 demo，确认没有 console error / DOM 错误

---

## 最终收尾（全部 task 完成后）

- [ ] **删除本文档** `docs-notes/v2-cleanup-plan.md`
- [ ] commit message 用：`docs(notes): 清理 v2-cleanup-plan.md（全部 task 完成）`
- [ ] 跑一次最终全量测试，确认基线
- [ ] 评估是否到时机发布 `v2.0.1-beta.4`

---

## 影响面提示（grep 结果，下次会话省时间）

- `deprecated.ts` 调用：删完 A-F 后，应仅剩 0 个 `warnDeprecated()` 调用
- `@deprecated` JSDoc：删完 A-F 后，应仅剩 0 处
- locale `Popconfirm.okText` 出现位置：4 个 locale 文件（task E 范围）
- FormItem `prop:` 模式：commit `2089965` 已全部替换为 `name:`

## 测试基线追踪

| 阶段 | files | tests |
|---|---|---|
| commit `2089965`（已完成） | 95 | 2064 |
| A 完成（预期） | 95 | ~2059 |
| B 完成（预期） | 95 | ~2050 |
| C 完成（预期） | 95 | ~2040 |
| D 完成（预期） | 95 | ~2030 |
| E 完成（预期） | 95 | ~2025 |
| F 完成（预期） | 95 | ~2020（+ button color 新测试可能 +3-5） |
| G 完成（codemod 删除不影响 test） | 95 | 同 F |
| H 完成（docs only） | 95 | 同 F |
