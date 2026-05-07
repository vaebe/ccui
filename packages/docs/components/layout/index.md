# Layout 布局

协助进行页面整体布局，含 Header/Sider/Content/Footer。

## 何时使用

- 中后台典型布局，含顶部导航/侧边导航/主体内容/底部信息。

## 基本使用

:::demo

```vue
<template>
  <c-layout style="min-height: 240px;">
    <c-layout-header style="background: #1677ff; color: #fff;"> Header </c-layout-header>
    <c-layout-content style="padding: 24px; background: #f5f5f5;"> Content </c-layout-content>
    <c-layout-footer style="text-align: center;"> Footer </c-layout-footer>
  </c-layout>
</template>
```

:::

## 含侧边栏

:::demo

```vue
<template>
  <c-layout style="min-height: 240px;">
    <c-layout-sider>Sider</c-layout-sider>
    <c-layout>
      <c-layout-header style="background: #1677ff;" />
      <c-layout-content style="padding: 24px;"> Main </c-layout-content>
    </c-layout>
  </c-layout>
</template>
```

:::

## 可折叠侧边栏

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const collapsed = ref(false)
    return { collapsed }
  },
})
</script>

<template>
  <c-layout style="min-height: 280px;">
    <c-layout-sider v-model:collapsed="collapsed" collapsible> Sider menu </c-layout-sider>
    <c-layout>
      <c-layout-header style="background: #1677ff;" />
      <c-layout-content style="padding: 24px;"> Collapsed: {{ collapsed }} </c-layout-content>
    </c-layout>
  </c-layout>
</template>
```

:::

## Sider 参数

| 参数             | 类型             | 默认值 | 说明                                   |
| ---------------- | ---------------- | ------ | -------------------------------------- |
| width            | number / string  | 200    | 宽度                                   |
| collapsedWidth   | number / string  | 80     | 折叠后的宽度                           |
| collapsed        | boolean          | --     | 当前折叠状态，支持 `v-model:collapsed` |
| defaultCollapsed | boolean          | false  | 初始折叠状态                           |
| collapsible      | boolean          | false  | 是否可折叠                             |
| reverseArrow     | boolean          | false  | 反转箭头方向                           |
| theme            | 'light' / 'dark' | 'dark' | 主题色                                 |

## Sider 事件

| 事件             | 参数                             | 说明         |
| ---------------- | -------------------------------- | ------------ |
| update:collapsed | `(value: boolean)`               | 折叠状态变更 |
| collapse         | `(value: boolean, type: string)` | 折叠触发     |
