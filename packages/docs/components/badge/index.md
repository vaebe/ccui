# Badge 徽标数

图标右上角的圆形徽标数字。

## 何时使用

- 一般出现在通知图标或头像的右上角，用于显示需要处理的消息条数。
- 用于其他需要展示状态的场景。

## 基本使用

:::demo

```vue
<template>
  <c-badge :count="5" class="head-badge">
    <span class="head-example" />
  </c-badge>

  <c-badge :count="0" show-zero class="head-badge">
    <span class="head-example" />
  </c-badge>

  <c-badge :count="99" class="head-badge">
    <span class="head-example" />
  </c-badge>

  <c-badge :count="100" class="head-badge">
    <span class="head-example" />
  </c-badge>

  <c-badge :count="200" :overflow-count="99" class="head-badge">
    <span class="head-example" />
  </c-badge>
</template>

<style>
/* 间距加在 badge 外层；若加在被包裹的 .head-example 上，会把徽标锚点一起推开，
   导致窄徽标（如 0）离右上角有空隙 */
.head-badge {
  margin-right: 16px;
}
.head-example {
  width: 42px;
  height: 42px;
  background: var(--ccui-area);
  border-radius: 4px;
  display: inline-block;
}
</style>
```

:::

## 独立使用

:::demo

```vue
<template>
  <c-badge :count="25" />
  <c-badge :count="4" :style="{ backgroundColor: '#52c41a', marginLeft: '12px' }" />
</template>
```

:::

## 小红点

:::demo

```vue
<template>
  <c-badge dot>
    <span class="head-example" />
  </c-badge>
</template>

<style>
.head-example {
  width: 42px;
  height: 42px;
  background: var(--ccui-area);
  border-radius: 4px;
  display: inline-block;
}
</style>
```

:::

## 状态点

:::demo

```vue
<template>
  <c-badge status="success" text="Success" />
  <br />
  <c-badge status="error" text="Error" />
  <br />
  <c-badge status="default" text="Default" />
  <br />
  <c-badge status="processing" text="Processing" />
  <br />
  <c-badge status="warning" text="Warning" />
</template>
```

:::

## 自定义颜色

`color` 接受任意 CSS 颜色字符串（预设色名 / 十六进制 / rgb 都行）。

:::demo

```vue
<template>
  <c-badge :count="5" color="#fa541c" class="head-badge">
    <span class="head-example" />
  </c-badge>
  <c-badge :count="5" color="#52c41a" class="head-badge">
    <span class="head-example" />
  </c-badge>
  <c-badge :count="5" color="#722ed1" class="head-badge">
    <span class="head-example" />
  </c-badge>
  <c-badge :count="5" color="#13c2c2" class="head-badge">
    <span class="head-example" />
  </c-badge>
</template>

<style>
/* 间距加在 badge 外层，避免推开徽标锚点 */
.head-badge {
  margin-right: 16px;
}
.head-example {
  width: 42px;
  height: 42px;
  background: var(--ccui-area);
  border-radius: 4px;
  display: inline-block;
}
</style>
```

:::

## 偏移设置（offset）

`offset: [x, y]` 调整徽标相对默认位置的偏移量（单位 px）。

:::demo

```vue
<template>
  <c-badge :count="5" class="head-badge">
    <span class="head-example" />
  </c-badge>
  默认 &nbsp;&nbsp;&nbsp;
  <c-badge :count="5" :offset="[-4, 4]" class="head-badge">
    <span class="head-example" />
  </c-badge>
  offset=[-4, 4] &nbsp;&nbsp;&nbsp;
  <c-badge :count="5" :offset="[10, -10]" class="head-badge">
    <span class="head-example" />
  </c-badge>
  offset=[10, -10]
</template>

<style>
/* 间距加在 badge 外层，避免推开徽标锚点 */
.head-badge {
  margin-right: 8px;
}
.head-example {
  width: 42px;
  height: 42px;
  background: var(--ccui-area);
  border-radius: 4px;
  display: inline-block;
}
</style>
```

:::

## 字符串 count（NEW / HOT 标签）

`count` 也接受字符串，常用作产品列表的「NEW / HOT / 限时」角标。

:::demo

```vue
<template>
  <c-badge count="NEW" class="head-badge">
    <span class="head-example-lg" />
  </c-badge>
  <c-badge count="HOT" color="#fa541c" class="head-badge">
    <span class="head-example-lg" />
  </c-badge>
  <c-badge count="限时" color="#722ed1" class="head-badge">
    <span class="head-example-lg" />
  </c-badge>
</template>

<style>
/* 间距加在 badge 外层，避免推开徽标锚点 */
.head-badge {
  margin-right: 16px;
}
.head-example-lg {
  width: 60px;
  height: 60px;
  background: var(--ccui-area);
  border-radius: 4px;
  display: inline-block;
}
</style>
```

:::

## 与 Avatar 组合（消息中心常见）

头像 + 消息数徽标，常见于头部导航的「消息中心 / 通知」按钮。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const count = ref(8)
</script>

<template>
  <c-badge :count="count">
    <c-avatar custom-text="🔔" :width="40" :height="40" />
  </c-badge>
  &nbsp;&nbsp;
  <c-badge dot>
    <c-avatar custom-text="📩" :width="40" :height="40" gender="male" />
  </c-badge>
  <br /><br />
  <c-button @click="count += 1">+1</c-button>
  <c-button style="margin-inline-start: 8px" @click="count = 0">清零</c-button>
</template>
```

:::

## Badge 参数

| 参数          | 类型                                                       | 默认值 | 说明                       |
| ------------- | ---------------------------------------------------------- | ------ | -------------------------- |
| count         | number / string                                            | --     | 展示数字，0 默认隐藏       |
| showZero      | boolean                                                    | false  | 当数值为 0 时是否展示      |
| overflowCount | number                                                     | 99     | 展示封顶的数字值           |
| dot           | boolean                                                    | false  | 不展示数字，只有一个小红点 |
| status        | 'success' / 'processing' / 'default' / 'error' / 'warning' | --     | 状态点的颜色               |
| text          | string                                                     | --     | 状态点的文字               |
| color         | string                                                     | --     | 自定义小圆点颜色           |
| offset        | [number, number]                                           | --     | 设置徽标数偏移             |
