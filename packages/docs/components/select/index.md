# Select 选择器

从一组选项中选择一个或多个值。

## 基本用法

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('lucy')
const options = [
  { label: 'Jack', value: 'jack' },
  { label: 'Lucy', value: 'lucy' },
  { label: 'Disabled', value: 'disabled', disabled: true },
]
</script>

<template>
  <c-select v-model="value" :options="options" placeholder="请选择成员" />
</template>
```

:::

## 多选

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref(['jack'])
const options = [
  { label: 'Jack', value: 'jack' },
  { label: 'Lucy', value: 'lucy' },
  { label: 'Tom', value: 'tom' },
]
</script>

<template>
  <c-select v-model="value" multiple clearable :options="options" placeholder="请选择成员" />
</template>
```

:::

## 可搜索

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref()
const options = [
  { label: 'Beijing', value: 'beijing' },
  { label: 'Shanghai', value: 'shanghai' },
  { label: 'Shenzhen', value: 'shenzhen' },
]
</script>

<template>
  <c-select v-model="value" filterable clearable :options="options" placeholder="搜索城市" />
</template>
```

:::

## 参数

| 参数        | 类型                    | 默认值   | 说明                     |
| ----------- | ----------------------- | -------- | ------------------------ |
| modelValue  | string / number / array | --       | 绑定值                   |
| options     | SelectOption[]          | []       | 选项列表                 |
| placeholder | string                  | 请选择   | 占位文本                 |
| disabled    | boolean                 | false    | 是否禁用                 |
| clearable   | boolean                 | false    | 是否可清空               |
| multiple    | boolean                 | false    | 是否多选                 |
| filterable  | boolean                 | false    | 是否可搜索               |
| loading     | boolean                 | false    | 是否加载中               |
| size        | large / default / small | default  | 尺寸                     |
| noDataText  | string                  | 暂无数据 | 空状态文本               |
| loadingText | string                  | 加载中   | 加载文本                 |
| maxTagCount | number                  | 3        | 多选最多直接展示的标签数 |

## 事件

| 事件           | 说明             |
| -------------- | ---------------- |
| change         | 选中值变化       |
| search         | 搜索文本变化     |
| visible-change | 下拉显示状态变化 |
| clear          | 清空选择         |

## 类型

```ts
interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}
```
