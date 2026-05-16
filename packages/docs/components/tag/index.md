# Tag 标签

进行标记和分类的小标签。

## 何时使用

- 用于标记事物的属性和维度。
- 进行分类。

## 基本使用

:::demo

```vue
<template>
  <c-tag>Tag 1</c-tag>
  <c-tag color="primary"> Primary </c-tag>
  <c-tag color="success"> Success </c-tag>
  <c-tag color="warning"> Warning </c-tag>
  <c-tag color="error"> Error </c-tag>
  <c-tag color="processing"> Processing </c-tag>
</template>
```

:::

## 多彩标签

:::demo

```vue
<template>
  <div>
    <c-tag color="magenta"> magenta </c-tag>
    <c-tag color="red"> red </c-tag>
    <c-tag color="volcano"> volcano </c-tag>
    <c-tag color="orange"> orange </c-tag>
    <c-tag color="gold"> gold </c-tag>
    <c-tag color="lime"> lime </c-tag>
    <c-tag color="green"> green </c-tag>
    <c-tag color="cyan"> cyan </c-tag>
    <c-tag color="blue"> blue </c-tag>
    <c-tag color="geekblue"> geekblue </c-tag>
    <c-tag color="purple"> purple </c-tag>
  </div>
</template>
```

:::

## 可关闭

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const visible = ref(true)
    return { visible }
  },
})
</script>

<template>
  <c-tag v-if="visible" closable @close="visible = false"> 可关闭 </c-tag>
  <c-button v-else size="small" @click="visible = true"> 重置 </c-button>
</template>
```

:::

## 自定义颜色

:::demo

```vue
<template>
  <c-tag color="#f50"> #f50 </c-tag>
  <c-tag color="#2db7f5"> #2db7f5 </c-tag>
  <c-tag color="#87d068"> #87d068 </c-tag>
</template>
```

:::

## Tag 参数

| 参数     | 类型    | 默认值    | 说明                                 |
| -------- | ------- | --------- | ------------------------------------ |
| color    | string  | 'default' | 颜色：预设色板名 / 状态色 / 任意 hex |
| bordered | boolean | true      | **(deprecated)** 请改用 `variant`    |
| closable | boolean | false     | 是否可关闭                           |
| icon     | string  | --        | 图标类名                             |

## Tag 事件

| 事件名 | 参数       | 说明           |
| ------ | ---------- | -------------- |
| close  | (e: Event) | 关闭按钮被点击 |

## Tag 插槽

| 插槽名  | 说明       |
| ------- | ---------- |
| default | 标签内容   |
| icon    | 自定义图标 |
