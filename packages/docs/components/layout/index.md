# Layout 布局

帮助构建中后台页面的整体框架，提供 `<c-layout>`、`<c-layout-header>`、`<c-layout-sider>`、`<c-layout-content>`、`<c-layout-footer>` 五个组件。

## 何时使用

- 中后台典型布局：顶部导航 / 侧边导航 / 主体内容 / 底部信息。
- 在 `<c-layout>` 嵌套 `<c-layout>` 实现复杂分栏。

## 基本使用

最简的"上中下"结构。

:::demo

```vue
<template>
  <c-layout style="min-height: 240px">
    <c-layout-header style="background: #1677ff; color: #fff">Header</c-layout-header>
    <c-layout-content style="padding: 24px; background: #f5f5f5">Content</c-layout-content>
    <c-layout-footer style="text-align: center">Footer</c-layout-footer>
  </c-layout>
</template>
```

:::

## 含侧边栏

`<c-layout-sider>` 直接放在 `<c-layout>` 第一位作为左栏。

:::demo

```vue
<template>
  <c-layout style="min-height: 240px">
    <c-layout-sider style="background: #001529; color: rgba(255, 255, 255, 0.65); padding: 12px">
      Sider
    </c-layout-sider>
    <c-layout>
      <c-layout-header style="background: #1677ff; color: #fff">Header</c-layout-header>
      <c-layout-content style="padding: 24px">Main</c-layout-content>
      <c-layout-footer style="text-align: center">Footer</c-layout-footer>
    </c-layout>
  </c-layout>
</template>
```

:::

## 可折叠侧边栏

`collapsible` 在底部加上一个折叠按钮；用 `v-model:collapsed` 双向同步状态。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <c-layout style="min-height: 280px">
    <c-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      style="background: #001529; color: rgba(255, 255, 255, 0.65); padding: 12px"
    >
      Sider menu
    </c-layout-sider>
    <c-layout>
      <c-layout-header style="background: #1677ff" />
      <c-layout-content style="padding: 24px">
        当前 collapsed = {{ collapsed }}
      </c-layout-content>
    </c-layout>
  </c-layout>
</template>
```

:::

## 自定义宽度

`width` 设置展开宽度，`collapsedWidth` 设置折叠后的宽度。

:::demo

```vue
<template>
  <c-layout style="min-height: 240px">
    <c-layout-sider
      :width="240"
      :collapsed-width="60"
      collapsible
      :default-collapsed="true"
      style="background: #001529; color: rgba(255, 255, 255, 0.65); padding: 12px"
    >
      <p>展开 240，折叠 60</p>
    </c-layout-sider>
    <c-layout-content style="padding: 24px">主体</c-layout-content>
  </c-layout>
</template>
```

:::

## 浅色侧边栏

`theme="light"` 用浅色背景的 sider，更适合品牌色顶栏 + 白色侧栏的搭配。

:::demo

```vue
<template>
  <c-layout style="min-height: 240px">
    <c-layout-sider theme="light" style="border-inline-end: 1px solid #f0f0f0; padding: 12px">
      浅色 Sider
    </c-layout-sider>
    <c-layout>
      <c-layout-header style="background: white; border-bottom: 1px solid #f0f0f0; color: #333">
        Header
      </c-layout-header>
      <c-layout-content style="padding: 24px; background: #fafafa">主体</c-layout-content>
    </c-layout>
  </c-layout>
</template>
```

:::

## 监听折叠

`collapse` 事件回调 `(collapsed, type)`，`type` 标识触发来源（`'clickTrigger'`）。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const collapsed = ref(false)
const log = ref('（无）')

function onCollapse(val, type) {
  log.value = `collapsed=${val} type=${type}`
}
</script>

<template>
  <c-layout style="min-height: 240px">
    <c-layout-sider v-model:collapsed="collapsed" collapsible @collapse="onCollapse">
      Sider
    </c-layout-sider>
    <c-layout-content style="padding: 24px">最近一次折叠：{{ log }}</c-layout-content>
  </c-layout>
</template>
```

:::

## API

### Layout / Header / Content / Footer

直接渲染对应语义化标签，无额外 props。`style` 可自由覆盖背景 / 内边距等。

### LayoutSider Props

| 参数             | 类型                  | 默认值   | 说明                                   |
| ---------------- | --------------------- | -------- | -------------------------------------- |
| width            | `number \| string`    | `200`    | 展开宽度                               |
| collapsedWidth   | `number \| string`    | `80`     | 折叠后宽度                             |
| collapsed        | boolean               | —        | 当前折叠状态，支持 `v-model:collapsed` |
| defaultCollapsed | boolean               | `false`  | 初始折叠状态                           |
| collapsible      | boolean               | `false`  | 显示底部折叠按钮                       |
| reverseArrow     | boolean               | `false`  | 折叠按钮的箭头反向                     |
| theme            | `'light' \| 'dark'`   | `'dark'` | 主题色                                 |

### LayoutSider Events

| 事件             | 回调签名                          | 说明           |
| ---------------- | --------------------------------- | -------------- |
| update:collapsed | `(value: boolean)`                | 折叠状态变化   |
| collapse         | `(value: boolean, type: string)`  | 折叠被触发     |
