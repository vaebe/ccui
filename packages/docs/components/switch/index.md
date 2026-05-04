# Switch 开关

开关选择器。

## 何时使用

- 需要表示开关状态/两种状态之间的切换时。
- 和 checkbox 的区别是，切换 switch 会直接触发状态改变。

## 基本使用

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const v = ref(true)
    return { v }
  },
})
</script>

<template>
  <c-switch v-model="v" />
  <span style="margin-left: 12px;">{{ v }}</span>
</template>
```

:::

## 文字与小尺寸

:::demo

```vue
<template>
  <c-switch checked-children="开" unchecked-children="关" :model-value="true" />
  <c-switch size="small" :model-value="true" style="margin-left: 12px;" />
  <c-switch disabled :model-value="false" style="margin-left: 12px;" />
  <c-switch loading :model-value="true" style="margin-left: 12px;" />
</template>
```

:::

## Switch 参数

| 参数              | 类型                      | 默认值    | 说明           |
| ----------------- | ------------------------- | --------- | -------------- |
| modelValue        | boolean / string / number | false     | v-model 绑定值 |
| checkedValue      | boolean / string / number | true      | 选中时的值     |
| uncheckedValue    | boolean / string / number | false     | 未选中时的值   |
| disabled          | boolean                   | false     | 禁用           |
| loading           | boolean                   | false     | 加载状态       |
| size              | 'default' / 'small'       | 'default' | 大小           |
| checkedChildren   | string                    | --        | 选中时的内容   |
| uncheckedChildren | string                    | --        | 未选中时的内容 |
| autofocus         | boolean                   | false     | 自动聚焦       |

## Switch 事件

| 事件名 | 参数                   | 说明           |
| ------ | ---------------------- | -------------- |
| change | (value, e: MouseEvent) | 状态改变时触发 |
| click  | (e: MouseEvent)        | 点击时触发     |
