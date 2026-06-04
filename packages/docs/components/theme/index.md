# 主题定制 / 深色模式

ccui 的所有组件样式都建立在一套 `--ccui-*` CSS 变量之上。深色模式、品牌色定制、圆角调整都归结为一件事：**覆盖这些 CSS 变量**。本页梳理三种由浅入深的用法。

## 深色模式怎么生效

深色样式集中在 `darkTheme.css`，所有规则都 scope 在 `.dark` 选择器下，形如：

```css
.dark {
  --ccui-color-bg-container: #141414;
  --ccui-color-text: rgba(255, 255, 255, 0.85);
  /* …整套 token 的深色取值 */
}
```

只要某个祖先元素带上 `.dark` 类，其子树内的 ccui 组件就会就地切换到深色取值。因此「切换深色」=「在合适的元素上挂 `.dark` 类」。`darkTheme.css` 已在文档站全局引入；接入你自己的应用时，从 `@vaebe/ccui-theme/darkTheme.css` 引入一次即可。

## 应用级深色切换（主推）

整站统一切换深色，推荐把 `.dark` 类挂在根元素（`<html>` 或 `<body>`）上。这样所有组件、布局、自定义样式同时切换，无需逐处包裹。

下面是一个「跟随系统 + 手动切换」的最小实现：首屏跟随系统偏好，用户手动点击后记住选择并落到 `localStorage`。

```ts
const STORAGE_KEY = 'ccui-theme'

function applyDark(isDark: boolean) {
  document.documentElement.classList.toggle('dark', isDark)
}

// 1. 初始化：优先读取用户已保存的选择，否则跟随系统
const media = window.matchMedia('(prefers-color-scheme: dark)')
const saved = localStorage.getItem(STORAGE_KEY) // 'dark' | 'light' | null
applyDark(saved ? saved === 'dark' : media.matches)

// 2. 手动切换：写入存储并即时应用
function setTheme(isDark: boolean) {
  localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light')
  applyDark(isDark)
}

// 3. 未手动指定时，继续跟随系统变化
media.addEventListener('change', (e) => {
  if (!localStorage.getItem(STORAGE_KEY)) applyDark(e.matches)
})
```

把 `setTheme(true / false)` 接到你的开关按钮即可。Vue 项目里也可以直接用 `useDark` / `useToggle`（来自 VueUse）托管同样的逻辑，行为一致。

## 局部 / 子树方案

只想让页面的某一块走深色（例如预览面板、对比区域），无需触碰根元素，用 `c-config-provider` 的 `theme.algorithm` 即可。设为 `'dark'` 时，ConfigProvider 会在其包裹层挂上 `.dark` 类，从而只让这棵子树切换深色。

:::demo

```vue
<template>
  <c-config-provider :theme="{ algorithm: 'dark' }">
    <c-card title="子树深色" style="width: 320px">
      <c-space>
        <c-button type="primary">主按钮</c-button>
        <c-button>默认按钮</c-button>
      </c-space>
    </c-card>
  </c-config-provider>
</template>
```

:::

`algorithm` 与 `token` 可以同时使用：先由 `algorithm: 'dark'` 给出整套深色基线，再用 `token` 覆盖个别值。

## token 体系简介

ccui 的设计变量统一以 `--ccui-` 开头，覆盖颜色、圆角、字号、间距、动效、层级等。组件样式只读这些变量，所以你既可以直接在 CSS 里覆盖变量，也可以通过 `c-config-provider` 的 `theme.token` 用 camelCase 形式传入（如 `colorPrimary`、`borderRadius`），ConfigProvider 会自动映射成对应的 `--ccui-*` 变量并下传给子组件。

### 关键色 light / dark 对照

下表节选几个最常用的 token，列出浅色与深色两套取值，方便对照理解变量在两种模式下的差异：

| token（camelCase） | CSS 变量                    | Light             | Dark                    |
| ------------------ | --------------------------- | ----------------- | ----------------------- |
| colorPrimary       | `--ccui-color-primary`      | `#1677ff`         | `#1668dc`               |
| colorSuccess       | `--ccui-color-success`      | `#52c41a`         | `#49aa19`               |
| colorWarning       | `--ccui-color-warning`      | `#faad14`         | `#d89614`               |
| colorError         | `--ccui-color-error`        | `#ff4d4f`         | `#dc4446`               |
| colorText          | `--ccui-color-text`         | `rgba(0,0,0,.88)` | `rgba(255,255,255,.85)` |
| colorBgContainer   | `--ccui-color-bg-container` | `#ffffff`         | `#141414`               |
| colorBgBase        | `--ccui-color-bg-base`      | `#ffffff`         | `#000000`               |
| colorBorder        | `--ccui-color-border`       | `#d9d9d9`         | `#424242`               |
| borderRadius       | `--ccui-border-radius`      | `6px`             | `6px`                   |

### 自定义 token 覆盖品牌色

最常见的需求是换一套品牌主色。把 camelCase 的 token 传给 `theme.token`，作用域内组件就会跟着走新主色。下面的示例可以在几个预设主色之间实时切换：

:::demo

```vue
<template>
  <c-config-provider :theme="{ token: { colorPrimary: color, borderRadius: radius } }">
    <c-space>
      <c-button type="primary">主按钮</c-button>
      <c-button type="primary" danger>危险按钮</c-button>
      <c-switch :default-checked="true" />
    </c-space>
  </c-config-provider>

  <div style="margin-top: 16px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap">
    <c-button v-for="c in colors" :key="c" :style="{ background: c, color: '#fff', border: 'none' }" @click="color = c">
      {{ c }}
    </c-button>
    <span style="margin-inline-start: 8px">圆角</span>
    <c-input-number v-model:value="radius" :min="0" :max="20" style="width: 96px" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const colors = ['#1677ff', '#52c41a', '#722ed1', '#fa541c']
const color = ref('#1677ff')
const radius = ref(6)
</script>
```

:::

`theme.token` 接收的字段与上表的 camelCase 名一一对应，`colorPrimary` / `borderRadius` / `colorError` 等都可以一起传。需要更细的派生色（hover / active / 边框 / 浅底）时，直接覆盖对应的 `--ccui-color-primary-hover` 等 CSS 变量即可。

## 三种方案怎么选

- 整站统一深色：在根元素切 `.dark` 类（**主推**），配合全局引入的 `darkTheme.css`。
- 仅局部子树深色：用 `c-config-provider` 的 `theme.algorithm: 'dark'` 包裹。
- 定制品牌色 / 圆角：用 `c-config-provider` 的 `theme.token`，或直接覆盖 `--ccui-*` 变量。

::: tip 在文档站内试试
本站每个 `:::demo` 演示框右上角都有一个浅色 / 深色开关，点击只会切换该演示框自身的 `.dark`，方便就地预览组件在两种模式下的表现。
:::
