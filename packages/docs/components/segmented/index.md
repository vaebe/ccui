# Segmented 分段控制器

用户在多个选项之间切换的分段控制器。

## 何时使用

- 当用户需要在多个数据/视图之间切换时。
- 适合并列展示多个互斥选项的场景。

## 基本使用

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const v = ref('Daily')
    return { v }
  },
})
</script>

<template>
  <c-segmented v-model="v" :options="['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']" />
  <p>当前：{{ v }}</p>
</template>
```

:::

## 禁用 / 块级

:::demo

```vue
<template>
  <c-segmented disabled :options="['Map', 'Transit', 'Satellite']" model-value="Map" />
  <br /><br />
  <c-segmented block :options="['Map', 'Transit', 'Satellite']" model-value="Map" />
</template>
```

:::

## 不同尺寸

:::demo

```vue
<template>
  <c-segmented size="small" :options="['Daily', 'Weekly', 'Monthly']" model-value="Daily" />
  <br /><br />
  <c-segmented :options="['Daily', 'Weekly', 'Monthly']" model-value="Daily" />
  <br /><br />
  <c-segmented size="large" :options="['Daily', 'Weekly', 'Monthly']" model-value="Daily" />
</template>
```

:::

## Segmented 参数

| 参数       | 类型                                  | 默认值   | 说明       |
| ---------- | ------------------------------------- | -------- | ---------- |
| modelValue | string / number                       | --       | 当前选中值 |
| options    | (string / number / SegmentedOption)[] | []       | 选项数据   |
| block      | boolean                               | false    | 撑满宽度   |
| disabled   | boolean                               | false    | 整体禁用   |
| size       | 'small' / 'middle' / 'large'          | 'middle' | 尺寸       |

## Segmented 事件

| 事件名 | 参数    | 说明       |
| ------ | ------- | ---------- |
| change | (value) | 切换时触发 |
