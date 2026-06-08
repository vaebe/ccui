# ccui 组件待人工介入清单（58 条）

> 经多代理重确认（每条 2 个对立视角 + 分歧裁决）：原 131 条待审项中，0 误报；73 条已确认为安全自动修并已提交（commit 759b980）；下列为**真正需要人工决策**的项——涉及对外行为/API 变更、快照/测试契约、设计取舍或较大重构。13 条标注「未复核」是裁决代理偶发失败、保守列入。


## 响应式（行为/重构/契约） — 8 条


### avatar
- **[high]** img/name/error/nobody 元素在 setup 期一次性构建，prop 变更后不重渲  
  `avatar/src/avatar.tsx` @ 54-124, 138-145  
  方向：Move all four JSX const blocks AND the hasImgElement/hasNameElement helper bodies inside the returned render function so createVNode re-runs per render. Keep ns, styleNs, the backgroundNs computed, showErrorAvatar, and the watch outside. Concretely: `return ()

### config-provider
- **[high]** provide 注入的是 computed 的快照 ctx.value，子树永久丢失响应性  
  `config-provider/src/config-provider.tsx` @ 76  
  方向：Provide the computed ref and unwrap it inside useConfig so all existing consumers keep reading plain properties. (1) Change line 76 to `provide(CONFIG_INJECT_KEY, ctx)`. (2) Type the key as `InjectionKey<ComputedRef<ConfigContext>>` (or cast) and rewrite useCo

### tabs
- **[medium]** 外部修改 modelValue 不会同步 active（缺 watch）  
  `tabs/src/tabs.tsx` @ 16  
  方向：需在 import 中加入 watch（当前 line 2 只导入了 defineComponent, provide, reactive），再在 setup 内 state 声明后添加同步逻辑：

import { defineComponent, provide, reactive, watch } from 'vue'

watch(() => props.modelValue, (v) => { if (v !== state.active) state.active = v })

加 v !== sta

### tree
- **[medium]** defaultExpandAll 只在 setup 同步执行一次，异步/后到的 data 不生效  
  `tree/src/tree.tsx` @ 72  
  方向：The bug is real but requires changes in BOTH files because the proposed watch alone won't propagate. Option A (recommended, minimal-risk): keep computing initialExpandedAll reactively AND make useControllableSet react to defaultValue changes when uncontrolled.

### descriptions
- **[medium]** computed 内调用 slot 渲染函数并缓存 VNode，存在 VNode 复用风险  
  `descriptions/src/descriptions.tsx` @ 36-37  
  方向：把 slot 的 VNode 调用从 computed 内推迟到 render 内（thunk 形态），slot 路径不缓存 VNode 实例。最小修改如下：

1) ResolvedItem 的 label/content 改为可承载 thunk：
   label: VNode | string | (() => VNode)
   content: VNode | string | number | (() => VNode)

2) resolveFromSlots 第36-37行存 thunk 而非立刻调

### textarea
- **[medium]** defaultValue 会吞掉“受控且初值为空字符串”的合法场景  
  `textarea/src/textarea.tsx` @ 53  
  方向：The proposed fix `props.defaultValue ?? props.modelValue` is a no-op: in that branch props.modelValue is already '' (its default), so it equals the current `props.defaultValue ?? ''`. A correct fix requires making "provided" detectable: in textarea-types.ts ch

### masonry
- **[medium]** ⚠️未复核 用数组下标 ci/ii 作 key，列数变化时 DOM 复用错位  
  `masonry/src/masonry.tsx` @ 109,112  
  方向：用全局序号 gi 做稳定身份，优先 VNode 自带 key。修改 columns 计算携带 gi，并在渲染用 key={vnode.key ?? gi}。

1) 把 columns 计算改为携带原始全局序号（合并 sequential/默认两分支，因二者逻辑当前完全相同）：

const columns = computed(() => {
  const items = flatChildren(slots.default?.() ?? [])
  const cols: { vnode: VNode, gi

### affix
- **[low]** watch target 仅监听 prop 引用变化，函数型 target 返回值改变时不会重新绑定  
  `affix/src/affix.tsx` @ 153-160  
  方向：优先采用文档化方案：明确"函数型 target 仅在挂载时解析一次，引用不变则不重绑"。若要代码修复，不应放进每帧 scroll 都会跑的 update()（会引入每次滚动调用 resolveTarget + DOM 查询的开销与潜在反复 add/removeEventListener），而应仅在 onMounted 的 requestAnimationFrame 回调里或 resize/ResizeObserver 等低频时机做一次比对：`const next = resolveTarget(props.targ

## 逻辑（设计取舍/时序） — 8 条


### date-picker
- **[high]** showTime 下点击 clear 未重置 pendingValue / pendingDirty，面板残留旧高亮且 ok 仍可点  
  `date-picker/src/date-picker.tsx` @ 401-405  
  方向：The proposed fix is directionally right but unsafe as written: it calls initialPendingTime(), which reads selectedDayjs.value (a computed off props.modelValue). emitChange(null) only emits update:modelValue and does NOT synchronously update selectedDayjs, so i

### tag
- **[high]** variant 的 filled/solid/outlined 修饰类无任何样式，filled 与 solid 渲染完全一致  
  `tag/src/tag.scss` @ 119  
  方向：The defect is real, but a blanket `&--variant-solid` background rule is not minimal/safe: solid's promise is per-preset-color saturation, and the preset colors are generated in the `@each` loop (lines 119-126) as `background: var(--ccui-#{$name}-1)` plus statu

### message
- **[medium]** enforceMaxCount 用 arr.shift() 直接移除最旧消息，跳过 leave 过渡动画  
  `message/src/use-message.ts` @ 80  
  方向：The bug is real but the suggested "call the oldest item's close" fix is NOT directly applicable: MessageItem (message-item.tsx) keeps `visible` and `close` internal to setup and never `expose`s them, and the holder renders children via h(MessageItem,...) with 

### modal
- **[medium]** Escape 关闭对所有打开的 modal 全局生效，栈式多层 modal 会被同时关闭  
  `modal/src/modal.tsx` @ 80-84  
  方向：引入模块级栈并把 push/pop 绑定到 open/close 生命周期(不能只在 keydown 内处理):
1) 文件顶部加 `const modalEscStack: number[] = []`。
2) onKeydown 改为仅当本实例位于栈顶才响应,并阻止冒泡:
```
const onKeydown = (e: KeyboardEvent) => {
  if (e.key !== 'Escape' || !props.closeOnEsc || !isOpen.value) return
  if

### table-column
- **[medium]** 全局自增 columnSeq 决定列序，动态重挂载的列会跳到末尾  
  `table-column/src/table-column.tsx` @ 7, 19  
  方向：Do not apply the accuser's "minimal" variant as-is: locating by a stable key within the original `columns` order is invalid here, because in template-collection mode there is no `columns` array to index into — columns exist only via register(). The correct fix

### input-number
- **[medium]** handleInput 在每次击键时即 clamp 到 min/max 并按 precision 取整，妨碍正常输入  
  `input-number/src/input-number.tsx` @ 111  
  方向：Two-part change. (1) In handleInput, parse the raw value without clamp/precision so typing isn't disrupted, e.g. replace lines 111-112 with: `const raw = Number.parseFloat(value); if (!Number.isNaN(raw)) updateValue(raw, false)` — leaving clamp+precision to ha

### space-compact
- **[medium]** size 生成的修饰类无任何样式承接，且未透传到子项，是死输出  
  `space-compact/src/space-compact.tsx` @ 16  
  方向：Do NOT delete line 16 — that breaks existing assertions in test/space-compact.test.ts:24-26 requiring ccui-space-compact--large / --small. Take option (a): add the missing scss rules so the modifier is consumed. In space-compact.scss, inside the root block, ad

### time-picker
- **[low]** 「此刻」按钮不遵守 step 与 disabled 约束  
  `time-picker/src/time-picker.tsx` @ 196-203 (clickNow)  
  方向：Align `now` to an existing, non-disabled cell using the same column value lists that render the panel, instead of naive step rounding (columns floor to multiples of step starting at 0, and disabled cells must be skipped). Add a helper and use it in clickNow:



## 可访问性 — 25 条


### color-picker
- **[high]** 清除按钮是嵌套在 <button> 内的可交互元素，HTML 非法且键盘不可达  
  `color-picker/src/color-picker.tsx` @ 356-376  
  方向：The defect is real, but the proposed fix is not a safe drop-in autofix: (a) changing the outer trigger from `<button>` to a `div+role=button` loses native focus/`disabled`/form semantics and is a behavior change; (b) the clear control is currently a flex child

### input
- **[high]** 清除按钮 <i> 缺 role/aria-label/键盘支持，且与同库其它组件不一致  
  `input/src/input.tsx` @ 174  
  方向：{hasClear && <i class={ns.e('clear')} role="button" aria-label="清除" tabindex={0} onClick={clearInput} onKeydown={(e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clearInput() } }}></i>}

### segmented
- **[high]** 单选项缺少 name 与 onChange，键盘无法切换且不成 radio group  
  `segmented/src/segmented.tsx` @ 44-50  
  方向：The proposed fix's direction is right (move the handler to onChange) but `name={ns.b()}` is wrong: ns.b() is a constant class string ('c-segmented') shared by every Segmented instance, so two Segmenteds on one page would collide into one radio group. Use a per

### table
- **[high]** 树形展开图标是裸 <span>，键盘不可达  
  `table/src/table.tsx` @ 866-875  
  方向：Replace the tree-expand span with a native button so keyboard (Enter/Space) and SR semantics come for free and it matches renderExpandCell. At line 864-875 change the inner branch to:

h(
  'button',
  {
    type: 'button',
    class: [ns.e('tree-expand-icon')

### carousel
- **[medium]** tablist/tabpanel 角色不完整，缺 tab 角色与 aria-controls 关联  
  `carousel/src/carousel.tsx` @ 318-324, 296-305, 263-285  
  方向：建议修复中 `${idPrefix}-panel-${i}` 不成立——源码无 idPrefix 基础设施（grep 仅命中 role:，无 useId/aria-controls）。且存在结构性陷阱：dots 按 pageCount/currentPage（页）渲染，slides 按子节点（帧）渲染，multi（slidesToShow>1）时两者数量不一致，按同一 index i 做 1:1 aria-controls/aria-labelledby 映射会错位；customDot slot 路径（298-29

### icon
- **[medium]** clickable 图标无 title/ariaLabel 时是无名可聚焦 button  
  `icon/src/icon.tsx` @ 166-179  
  方向：Line 178 — give the interactive (button) branch a fallback accessible name from props.name: `'aria-label': props.ariaLabel || props.title || (interactive ? props.name || undefined : undefined)`. This only affects the clickable path, leaves non-interactive icon

### image
- **[medium]** 预览遮罩无 Escape 键关闭、无焦点/role 语义  
  `image/src/image.tsx` @ 155-189  
  方向：Escape-to-close + dialog semantics are the safe, minimal core. Prefer a watch over previewVisible (covers every open path, avoids duplicate listeners) instead of binding inside onClick:

1) Add handler + lifecycle in setup:
const onKeydown = (e: KeyboardEvent)

### rate
- **[medium]** role=radio 无键盘可达性（缺 tabindex/keydown）  
  `rate/src/rate.tsx` @ 63-71  
  方向：Add roving tabindex and a keydown handler that computes the index directly instead of reusing the MouseEvent-based handler. In iconList(), on the div add: tabindex={props.readOnly ? -1 : (isFullyChecked ? 0 : -1)} and a fallback so at least one item is focusab
- **[medium]** aria-checked 忽略 hover 与半选，半选项永不报 checked  
  `rate/src/rate.tsx` @ 61,66  
  方向：The bug is real, but the proposed aria-checked="mixed" fix is INVALID: the element is role="radio" (line 65), and aria-checked="mixed" is only legal for role checkbox/menuitemcheckbox — for radio only true/false are valid. Minimal correct fix that keeps the ex

### splitter
- **[medium]** 拖拽分隔条 resizer 缺少 role=separator / aria 与键盘支持  
  `splitter/src/splitter.tsx` @ 252  
  方向：Two-part fix; only part 1 is a safe, minimal, non-breaking autofix. Part 1 (apply now): add static ARIA to the resizer at line 252 — `<div class={splitterCls} role="separator" aria-orientation={isHorizontal.value ? 'vertical' : 'horizontal'} tabindex={props.re

### tabs
- **[medium]** 方向键落到 disabled tab 时静默卡死，不跳过  
  `tabs/src/components/tabs-nav/index.tsx` @ 62-65  
  方向：Replace the single-index logic with a directional skip-loop bounded by list.length. Compute a step from the key (Right/Down = +1, Left/Up = -1; Home = start at 0 stepping +1, End = start at list.length-1 stepping -1), then iterate from the start index in that 

### radio
- **[medium]** RadioGroup 内的原生 <input> name 默认为空，破坏方向键键盘导航与原生单选语义  
  `radio.tsx` @ 81  
  方向：建议的 proposedFix 不可直接采用：它写的 `${cls-prefix}-radio-${id}` 中 cls-prefix/id 未定义、不可编译；且 radioGroupProps 当前根本没有 name 这个 prop，radioGroupInject?.name 取不到值。按"不新增公开 prop"约定，应在 radio-group 内部自动生成一个组级 name 并通过现有注入下发，而非新增公开 prop：1) radio-group.tsx 顶部生成内部 id，如 `const groupNa

### date-picker
- **[medium]** ⚠️未复核 role="button" 的 span/li（panel-label、preset-item、clear）无 tabindex 且无 keydown，键盘不可达  
  `date-picker/src/date-picker.tsx` @ 494-498,717,938  
  方向：给三处补 tabindex={0} 与 onKeydown，在 Enter/' ' 时 preventDefault 后调用对应处理器。注意 clear(e: MouseEvent) 内部调用 e.stopPropagation()，KeyboardEvent 同为 Event 也有该方法，可直接复用但需注意类型：可写 onKeydown={(e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cl

### segmented
- **[medium]** ⚠️未复核 role="listbox" 与子项缺 role="option"/aria-selected 语义不匹配  
  `segmented/src/segmented.tsx` @ 32-41  
  方向：Change line 32 to role="radiogroup": `<div class={cls.value} role="radiogroup">`. Then add aria-checked to the radio input (the element carrying the radio role), after line 49: `aria-checked={opt.value === props.modelValue}`. Do not add aria-checked to the <la

### select
- **[medium]** ⚠️未复核 清除按钮与 tag 删除按钮是纯 onClick 的 span，无键盘可达性  
  `select/src/select.tsx` @ 710-712, 466-470  
  方向：缺陷属实，但 proposedFix 直接用 keydown 调 onClear(event)/onRemoveTag(option.value, event) 会有类型不符：onClear(293) 与 onRemoveTag(300) 形参类型为 MouseEvent，传 KeyboardEvent TS 报错；且二者只调用了 event.stopPropagation()，需先把形参类型放宽为 `MouseEvent | KeyboardEvent`。最小修复：1) 把 onClear / onRemoveT

### skeleton-node
- **[medium]** ⚠️未复核 同一元素同时设 aria-busy=true 与 aria-hidden=true，二者矛盾  
  `skeleton-node/src/skeleton-node.tsx` @ 31  
  方向：Skeleton placeholders are decorative, so keep aria-hidden and drop the dead aria-busy. Change line 31 to: `{ class: cls.value, style: style.value, 'aria-hidden': 'true' }`. (Alternatively, if a "loading" announcement is desired, instead remove aria-hidden and 

### tag
- **[medium]** ⚠️未复核 关闭按钮是裸 span，缺 role/aria-label/键盘支持，且与库内其他关闭按钮不一致  
  `tag/src/tag.tsx` @ 48  
  方向：On tag.tsx:48 add `role="button" aria-label="close" tabindex={0}` and an `onKeydown` that triggers close on Enter/Space. Because `onClose` is typed `(e: MouseEvent)` and calls `e.stopPropagation()`, widen its signature to `(e: MouseEvent | KeyboardEvent)` (sto

### textarea
- **[medium]** ⚠️未复核 清除按钮不可键盘聚焦/激活，缺 role=button 与键盘支持  
  `textarea/src/textarea.tsx` @ 218-237  
  方向：Factor a shared a11y attribute set and apply to all branches. Add a keyboard handler and reuse common props:

const onClearKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    clearValue()
  }
}
const clearPr

### transfer
- **[medium]** ⚠️未复核 role=option 的列表项可点但无键盘支持  
  `transfer/src/transfer.tsx` @ 298-309  
  方向：Add to the li (lines 298-309): tabindex={isDisabled ? -1 : 0} and onKeydown={(e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleItem(item.key, isDisabled) } }}. toggleItem(item.key, isDisabled) already early-returns whe

### upload
- **[medium]** ⚠️未复核 文件名 span 可点击触发 preview 但无键盘支持  
  `upload/src/upload.tsx` @ 276  
  方向：Make the preview targets keyboard-accessible. For the text-list filename (line 276) add role/tabindex and a keydown handler that activates on Enter/Space (preventDefault on Space to avoid page scroll):

```tsx
<span
  class={ns.e('item-name')}
  role="button"


### auto-complete
- **[low]** clear 清除按钮无键盘可达性（无 tabindex/keydown，且只绑 mousedown）  
  `auto-complete/src/auto-complete.tsx` @ 293  
  方向：Make the clear control keyboard-reachable. The proposed fix is correct in spirit but the description's `tabindex={-1}` is insufficient (use `0`), and the existing `clear(e: MouseEvent)` at line 220 must be widened to accept a KeyboardEvent. Minimal change:

1)

### carousel
- **[low]** 非 infinite 边界时箭头无 disabled / aria-disabled  
  `carousel/src/carousel.tsx` @ 328-352  
  方向：In renderArrows compute boundary state using the same max the handlers use (single-frame: total-1, multi: maxActive):
const max = isMulti.value ? maxActive.value : total.value - 1
const atStart = !props.infinite && active.value <= 0
const atEnd = !props.infini

### date-picker
- **[low]** role="gridcell" 的单元格缺少父级 role="grid"/role="row" 容器，ARIA grid 结构不完整  
  `date-picker/src/date-picker.tsx` @ 615,642,759,789,820  
  方向：The "minimal" variant (only add role="grid" to the four __grid divs) is ARIA-incomplete: gridcell must be owned by a row, so role="grid" with directly-nested gridcells still violates the owned-elements rule. Full fix: add role="grid" to each __grid container A

### tree-select
- **[low]** aria-haspopup="tree" 与弹层实际 role="dialog" 不一致  
  `tree-select/src/tree-select.tsx` @ 504, 524 / 367  
  方向：Change both aria-haspopup values to 'dialog' to match the popup's role="dialog" (line 367). Specifically: line 504 input aria-haspopup="dialog", and line 524 aria-haspopup={props.multiple ? 'dialog' : undefined}. This is the minimal, safe fix because the popup

### typography
- **[low]** disabled 的 Link 仍可点击且未暴露 aria-disabled  
  `typography/src/typography.tsx` @ 317-320  
  方向：在 tagName === 'a' 分支按 disabled 收口 href/target 与 a11y（最小改动）：

```tsx
if (tagName === 'a') {
  const linkP = props as unknown as LinkProps
  if (linkP.disabled) {
    tagAttrs['aria-disabled'] = true
    tagAttrs.onClick = (e: MouseEvent) => e.preventDefault()
 

## 一致性 — 7 条


### radio
- **[high]** 状态类名写死为裸字符串 'active' / 'disabled'，未走 ns.is() BEM 约定  
  `radio/src/radio.tsx` @ 30-32  
  方向：两处需同步修改，缺一会破坏样式。

1) radio.tsx 第 30-32 行（labelClass 返回数组，JSX class={labelClass.value} 已支持数组+假值过滤，无需改第 76 行）：
```
const labelClass = computed(() => {
  return [ns.b(), isActive.value && ns.is('active'), isDisabled.value && ns.is('disabled')]
})
```

2) radio.sc

### timeline
- **[medium]** center 用 ns.e('center') 把状态/修饰符当成 element 写  
  `timeline/src/timeline-item.tsx` @ 66  
  方向：命名诊断属实，但 proposedFix 不完整且方向偏差。按同库 button.tsx 先例（round/block/disabled 用 ns.m()），应改为 ns.m('center') → ccui-timeline-item--center（保留 block 前缀），而非 ns.is('center')（is-center 丢失前缀）。且必须三处联改、否则破坏现状/测试：(1) timeline-item.tsx:66 改 props.center && ns.m('center')；(2) timel

### button-3d
- **[medium]** ⚠️未复核 子元素类名写死字符串，未用 ns.e() BEM  
  `button-3d/src/button-3d.tsx` @ 34-39  
  方向：真正需修的是子元素类名（tsx + scss 必须同步改，否则样式断裂）：tsx 第34-39行 class="shadow"→{ns.e('shadow')}、"edge"→{ns.e('edge')}、"front"→{ns.e('front')}、"loading-spinner"→{ns.e('loading-spinner')}；同时 button-3d.scss 中所有 .shadow/.edge/.front/.loading-spinner 选择器（含 &--primary/--success/..

### calendar
- **[low]** 状态类 current-month / current-date 为写死字符串，未走 ns 命名空间  
  `calendar/src/calendar.tsx` @ 131-135  
  方向：这是真实的一致性问题，但提案的 ns.is() 不够精确：use-namespace.ts 第33行 is(name) 只返回 `is-${name}`，不带 ccui- / $cls-prefix，单独用并不能真正消除跨库串扰（仅在 SCSS 嵌套到带前缀的块下才隔离）。若目标是真正带前缀隔离，更稳的最小修复是用 ns.m()：tsx 改为 [ns.m('current-month')]: isCurrentMonth, [ns.m('current-date')]: isSelected,（生成 ccui-ca

### check-box
- **[low]** labelClass 用裸字符串 'active'/'disabled'，未走 ns BEM  
  `check-box/src/check-box.tsx` @ 29  
  方向：改 check-box.tsx:29 为：return `${ns.b()} ${isChecked.value ? ns.is('active') : ''} ${isDisabled.value ? ns.is('disabled') : ''}`（输出 is-active / is-disabled）。同步改 check-box.scss 全部四处选择器：第83行 &:not(.disabled):hover → &:not(.is-disabled):hover；第89行 &.active → &.is-a

### rate
- **[low]** 激活态 span 用块级修饰符 ns.m('active') 而非元素修饰符  
  `rate/src/rate.tsx` @ 73  
  方向：Apply the BEM rename AND update the test so it stays green. (1) rate.tsx:73 ns.m('active') -> ns.em('icon','active'). (2) rate.scss: move the block-level `&--active { color: $ccui-color-warning; fill: currentColor; }` block to be nested inside `&__icon` as `&-

### steps
- **[low]** type="navigation" 有声明并输出 class，但 scss 无任何对应样式  
  `steps/src/steps-types.ts` @ 34-37  
  方向：这是真实的 consistency 缺陷，但两种修复都不宜自动应用：(A) 在 steps.scss 补 &--navigation 样式属于设计决策，非最小修复；(B) 从 StepsType 移除 'navigation' 会改动公开类型并可能破坏已传 type="navigation" 的消费者。建议交由人工决定：若产品确认 navigation 形态短期不实现，则在 steps-types.ts:6 将 `export type StepsType = 'default' | 'navigation'` 收

## 深色模式（非等值替换需判断） — 4 条


### button-3d
- **[medium]** 默认 .edge 渐变与 .shadow 用硬编码 hsl，深色模式不适配  
  `button-3d/src/button-3d.scss` @ 38-44  
  方向：分两处、且 .edge 非最小可安全自动修复：

1) .shadow（第25行）安全替换为已存在的语义阴影 token（注意 alpha 由 0.25 变为浅 0.15/深 0.4，属可接受的轻微视觉变化，且深色会变深符合预期）：
  background: $ccui-shadow;

2) .edge 默认渐变（第40-43行）不可简单换 $ccui-color-border —— 该渐变是双层灰阶（中段更深 18%、两端更亮 36%）营造 3D 边缘立体感，替成单色边框 token 会丢失立体效果且浅色模式

### layout
- **[medium]** header / dark sider / trigger 硬编码颜色，深色模式失效  
  `layout/src/layout.scss` @ 26, 45, 72, 75, 81  
  方向：Do not auto-apply the proposed bg/text/fill token swap — it would either turn the intentionally-dark header/sider white (using $ccui-color-bg-container/-layout) or require inventing a new dark-container token, which is a behavior change and violates the no-new

### button
- **[low]** box-shadow 硬编码 rgba 颜色  
  `button/src/button.scss` @ 31, 60  
  方向：The accusation's suggested token `$ccui-box-shadow-tertiary` is WRONG: it exists but is a floating-panel elevation stack (`0 6px 16px 0 ...`, used by card/dropdown), not a `0 2px 0` button accent shadow — reusing it would visually break the button. There is no

### menu
- **[low]** &--dark 整块用硬编码 hex/rgba，未走 token 化深色方案  
  `menu/src/menu.scss` @ 200-232  
  方向：不要把 &--dark 的颜色直接换成 $ccui-color-bg-container/text/border 等"会随主题切换"的语义 token——因为 &--dark 由显式 prop theme="dark"（menu-types.ts:42 默认 light）触发，是"浅色页面上的深色侧边栏"特性，独立于全局 .dark；换成切换型 token 后，theme=dark 的菜单在浅色页会渲染成浅色，破坏现有行为。正确的最小修复是把这块抽成一组固定的 menu 深色专用 token（如 $ccui-men

## 性能 — 4 条


### form
- **[medium]** ⚠️未复核 依赖项重校验被 Form 与 FormItem 双重触发  
  `form/src/form.tsx` @ 130-140  
  方向：删除 form.tsx 第 130-140 行整段 watch(() => props.model, () => { fields.value.forEach(field => { if (field.dependencies.length > 0) void field.validate() }) }, { deep: true });依赖项重校验完全交给 form-item.tsx:297-305 自身的 watcher 负责(该 watcher 在 form 存在时才生效,doValidate 在 !form

### space
- **[medium]** ⚠️未复核 列表用数组下标 idx 作 key，children 变动时复用错位  
  `space/src/space.tsx` @ 50-65  
  方向：Prefer the child VNode's own stable key, falling back to idx only when absent. Inside the map: `const k = child.key ?? idx`. Change line 52 `key={idx}` to `key={k}`, line 58 `<Fragment key={idx}>` to `<Fragment key={k}>`. Optionally distinguish the wrapper fro

### grid
- **[low]** resize 监听未做节流/防抖  
  `grid/src/grid.tsx` @ 30  
  方向：Coalesce resize handling with rAF and cancel the pending frame on unmount. Keep `update` as-is and wrap only the listener:

```ts
let rafId = 0
const onResize = () => {
  if (typeof window === 'undefined' || rafId)
    return
  rafId = window.requestAnimationF

### time-range-picker
- **[low]** ns.m(props.size) 对 default 尺寸输出冗余 --default 类  
  `time-range-picker/src/time-range-picker.tsx` @ 149  
  方向：Do not autofix. If the redundant `--default` class were to be removed, the change must be coordinated: (1) line 149 → `props.size !== 'default' && ns.m(props.size)`, AND (2) update test/time-range-picker.test.ts:102 to drop the 'default' case and instead asser

## 样式去重 — 1 条


### badge
- **[low]** __sup 与 --count-standalone 大段声明重复可抽公共块  
  `badge/src/badge.scss` @ 9-29, 40-53  
  方向：改用 @mixin 而非 %extend，纯声明内联、不产生选择器分组、不改级联顺序：定义 @mixin ccui-badge-count-base { display: inline-block; height: 20px; min-width: 20px; padding: 0 6px; color: #ffffff; font-size: $ccui-font-size-sm; line-height: 20px; text-align: center; background: $ccui-color-err