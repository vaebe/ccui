# 2026-05-10 组件批量修复记录

> 决策日期：2026-05-10
> 状态：**已合入**
> 涉及组件：Affix / Tour / Slider / Dropdown / Tabs + 全局 reset

本轮修复一组用户反馈的样式与逻辑问题，按问题列出根因和处理。

## 1. Tour 漫游引导 —— `[plugin:vite:vue] Unexpected token, expected ","`

**根因**：示例里多个 `@click="open = true\n  current = 0"` 用换行分隔两条赋值。Vue 模板表达式编译器走 Babel 解析，看到这种写法会把它当作一个序列表达式，在两条语句之间期望逗号；遇到换行直接报错。

**修复**：把多语句换成单一函数调用 `@click="startTour"`，函数在 `<script setup>` 里定义并显式 `current.value = 0; open.value = true`。同时补一个 primary 主题 + arrow=false 的示例。

文件：`packages/docs/components/tour/index.md`

## 2. Affix 固钉 —— 逻辑健壮性 + 示例不足

**改动**：

- 滚动监听除了绑 `target.addEventListener('scroll')`，当 target 不是 window 时**额外**监听 `window.scroll`，处理嵌套滚动场景
- 用 `ResizeObserver` 监测固钉元素自身尺寸变化，避免内容变高/变宽后占位错乱
- `watch` 监听 `offsetTop` / `offsetBottom` 变化主动重算
- 首次计算用 `requestAnimationFrame` 推迟到下一帧，避免 onMounted 时父级还在布局

**文档**：把示例从 1 个扩到 5 个 —— 基础、offsetTop、offsetBottom、change 事件、target 容器内固定，覆盖了真实业务场景。

文件：`packages/ccui/ui/affix/src/affix.tsx`、`packages/docs/components/affix/index.md`

## 3. Slider 滑块 —— 滑块按钮和进度条没居中（核心问题）

**根因**（实测得出）：

`docs-notes` 的 docs 站点全局 CSS 里有这条规则给所有顶层 ccui 组件加间距：

```css
.vp-doc
  [class*='_example-showcase_']
  :where([class^='ccui-']:not([class*='__']), [class*=' ccui-']:not([class*='__'])) {
  margin-inline-end: 8px;
  margin-block-end: 8px;
}
```

`:where()` specificity 为 0；selector 不带 `>` 直接子元素，会**穿透命中嵌套在 slider 内部的 `.ccui-tooltip`**（tooltip 类名不带 `__`，被规则匹配上）。

slider 的按钮结构是：

```
.ccui-slider__button-wrapper (32×32, flex center)
  └── .ccui-tooltip                  (position:absolute; inset:0)
       └── .ccui-tooltip__trigger    (position:absolute; inset:0)
            └── .ccui-slider__button (16×16)
```

按理 `position:absolute; inset:0` 让 tooltip 撑满 32×32。但 absolute 元素的尺寸算法 `width = container - margin-left - margin-right`，被全局规则的 `margin-right:8; margin-bottom:8` 一减，tooltip 实际尺寸退化成 24×24，按钮就被压到了左上角，垂直方向偏上 4px、水平方向偏左 4px。

实测数据（修复前）：

| 元素           | top | height | centerY |
| -------------- | --- | ------ | ------- |
| wrapper        | 639 | 32     | **655** |
| track          | 652 | 6      | **655** |
| button-wrapper | 639 | 32     | **655** |
| tooltip        | 635 | **24** | 647     |
| **button**     | 643 | 16     | **651** |

button 中心 651 vs track 中心 655 —— 偏上 4px。

**修复**：双管齐下

1. `packages/docs/.vitepress/theme/styles/index.css`：把 selector 加上 `>` 限定为 showcase 直接子元素，不再误伤嵌套组件
2. `packages/ccui/ui/slider/src/slider.scss`：button-wrapper 内的 tooltip / trigger 用 `margin: 0 !important` 兜底，外部项目复用 ccui 时碰到类似全局规则也不会再错位
3. 同时把 slider 的几何居中策略整理成文：wrapper 用 `flex; align-items: center` 让 track 垂直居中（不再依赖 magic margin）；button-wrapper 固定 32×32 + `top:50% + translate(-50%,-50%)` 把几何中心钉在 wrapper 中心；中间嵌套层 `position:absolute; inset:0` 透传

实测数据（修复后）：水平模式 wrapper / track / button-wrapper / tooltip / button 中心 Y 全部 = 655，delta = 0。垂直模式中心 X 全部 = 425，delta = 0。

## 4. Dropdown 下拉菜单 popup 样式

Dropdown 把 `popperClass` 注入 Popover 的 popper，Popover 自身给 popper 加了 12px padding + 1px border + 4px 圆角，完全不是 Ant 风格。

**修复**：用 `.ccui-popover__popper.ccui-dropdown` 双类选择器（specificity 高于 popover 默认）覆盖 padding/border/radius/shadow，对齐 Ant 风格的 elevated 弹层。menu item 改成左右各 4px margin + 4px 圆角的"圆角行"hover 效果。`--divided` 项改成 `::before` 横线分隔，避免破坏 hover 高亮。

文件：`packages/ccui/ui/dropdown/src/dropdown.scss`

## 5. Tabs 选项卡 —— 全面对齐 Ant

原 tabs.scss 几乎是空的，nav 样式还停留在早期不一致的设计上（16px 字号、padding 4px 20px、`okUi-tab` 类名等）。

**修复**：重写 `tabs-nav.scss` 三种风格（line / card / border-card） × 四个方向（top / bottom / left / right）：14px 字号、12px 上下 padding、32px gap、primary 色 + 2px ink-bar 激活、hover 颜色过渡、`color-border-secondary` 分割线。

文件：`packages/ccui/ui/tabs/src/tabs.scss`、`packages/ccui/ui/tabs/src/components/tabs-nav/tabs-nav.scss`

## 6. 全局 ul/li marker 清除

ccui 内部所有 ul/ol 都不应该出现默认列表 marker。原来分散在每个组件 scss 里 `list-style: none`，遗漏的就漏出 marker（包括 Teleport 到 body 的 popper 里的 ul）。

**实施踩坑**：

- 第一次加在 `packages/theme/theme.scss` 末尾 → 被 `cli/commands/generate-theme.js` 重新生成时覆盖
- 第二次加在 `packages/ccui/ui/vue-ccui.ts` 顶部 import → 被 `cli/commands/create.js` 自动生成时覆盖

**最终方案**：

1. 新建 `packages/ccui/ui/shared/styles/base.scss` 存放全局 reset
2. 修改 cli 模板 `packages/cli/templates/vue-ui.js`，让生成的 `vue-ccui.ts` 永远带 `import './shared/styles/base.scss';`
3. 同步把 import 写回当前 `vue-ccui.ts`，并跑一遍 cli 验证再生成后 import 仍保留

reset 内容：

```scss
[class^='ccui-'] ul,
[class^='ccui-'] ol,
[class*=' ccui-'] ul,
[class*=' ccui-'] ol {
  list-style: none;
  margin: 0;
  padding: 0;
}
```

文件：`packages/ccui/ui/shared/styles/base.scss`、`packages/cli/templates/vue-ui.js`

## 经验沉淀

- **下游 docs 站全局规则会污染上游组件内部布局**：`:not([class*="__"])` 这种 BEM 反向匹配在嵌套组件场景下穿透很可怕，要么用 `>` 限定层级，要么彻底放弃这种全局加 margin 的做法。后续做新的全局规则要 review 这一点。
- **Vue 模板表达式不支持多语句换行序列**：示例代码里禁用 `@click="a = 1\n  b = 2"` 写法，统一改成函数调用。
- **被 cli 自动生成的文件**：`packages/theme/theme.scss`、`packages/ccui/ui/vue-ccui.ts`、`packages/docs/.vitepress/config/sidebar.ts` —— 改这些文件无效，必须改对应的 cli 模板。
