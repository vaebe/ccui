# CheckBox 多选框

在一组备选项中可选多个。

## 何时使用

- 在一组选项中进行多项选择。
- 单独使用时表示"是 / 否"两态切换。

## 基本使用

`v-model` 直接绑定布尔值，默认插槽是右侧文字。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const checked = ref(true)
</script>

<template>
  <c-check-box v-model="checked">这是一个多选框</c-check-box>
  <p style="margin-top: 8px; color: #666">当前：{{ checked ? '选中' : '未选中' }}</p>
</template>
```

:::

## 用 label 属性显示文字

不写默认插槽时，`label` 属性直接作为说明文字。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const a = ref(false)
const b = ref(true)
</script>

<template>
  <c-check-box v-model="a" label="使用 label 作为文案" />
  <c-check-box v-model="b" label="另一个" />
</template>
```

:::

## 禁用

`disabled` 让选项不可切换。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const a = ref(true)
const b = ref(false)
</script>

<template>
  <c-check-box v-model="a" disabled>禁用且选中</c-check-box>
  <c-check-box v-model="b" disabled>禁用未选</c-check-box>
</template>
```

:::

## 自定义颜色

`color` 改变选中态色块（与品牌色冲突时常用，如警示型业务）。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const a = ref(true)
const b = ref(true)
const c = ref(true)
</script>

<template>
  <c-check-box v-model="a" color="#52c41a">绿色</c-check-box>
  <c-check-box v-model="b" color="#fa541c">橙色</c-check-box>
  <c-check-box v-model="c" color="#722ed1">紫色</c-check-box>
</template>
```

:::

## 多选框组

`<c-check-box-group>` 把一组 CheckBox 放进同一个数组 `v-model`。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const cities = ref(['shanghai'])
</script>

<template>
  <c-check-box-group v-model="cities">
    <c-check-box label="beijing">北京</c-check-box>
    <c-check-box label="shanghai">上海</c-check-box>
    <c-check-box label="guangzhou">广州</c-check-box>
    <c-check-box label="shenzhen">深圳</c-check-box>
  </c-check-box-group>
  <p style="margin-top: 8px; color: #666">已选：{{ cities.join(', ') || '（空）' }}</p>
</template>
```

:::

## 排列方向

`direction` 切换纵向（默认）/ 横向。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const a = ref([])
const b = ref([])
</script>

<template>
  <p style="color: #666; margin: 0 0 4px">column（默认）</p>
  <c-check-box-group v-model="a" direction="column">
    <c-check-box label="1">选项 1</c-check-box>
    <c-check-box label="2">选项 2</c-check-box>
    <c-check-box label="3">选项 3</c-check-box>
  </c-check-box-group>

  <p style="color: #666; margin: 16px 0 4px">row</p>
  <c-check-box-group v-model="b" direction="row">
    <c-check-box label="1">选项 1</c-check-box>
    <c-check-box label="2">选项 2</c-check-box>
    <c-check-box label="3">选项 3</c-check-box>
  </c-check-box-group>
</template>
```

:::

## 整组禁用 / 整组着色

在 group 上设置 `disabled` 或 `color` 一次性应用到组内所有项。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const a = ref(['1', '2'])
const b = ref(['1'])
</script>

<template>
  <p style="color: #666; margin: 0 0 4px">整组禁用</p>
  <c-check-box-group v-model="a" disabled direction="row">
    <c-check-box label="1">选项 1</c-check-box>
    <c-check-box label="2">选项 2</c-check-box>
    <c-check-box label="3">选项 3</c-check-box>
  </c-check-box-group>

  <p style="color: #666; margin: 16px 0 4px">整组改颜色</p>
  <c-check-box-group v-model="b" color="#fa541c" direction="row">
    <c-check-box label="1">选项 1</c-check-box>
    <c-check-box label="2">选项 2</c-check-box>
    <c-check-box label="3">选项 3</c-check-box>
  </c-check-box-group>
</template>
```

:::

## 切换前钩子

group 的 `before-change` 接收 `(isChecked, label)`，返回 `false` 阻止本次操作。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const v = ref(['a'])
const log = ref('（无）')

function beforeChange(isChecked, label) {
  log.value = `${isChecked ? '尝试选中' : '尝试取消'} "${label}"`
  if (label === 'locked') {
    log.value += ' → 被钩子拦截'
    return false
  }
  return true
}
</script>

<template>
  <c-check-box-group v-model="v" :before-change="beforeChange" direction="row">
    <c-check-box label="a">A</c-check-box>
    <c-check-box label="b">B</c-check-box>
    <c-check-box label="locked">锁定项（被禁切换）</c-check-box>
  </c-check-box-group>
  <p style="margin-top: 8px; color: #666">日志：{{ log }}</p>
</template>
```

:::

## API

### CheckBox Props

| 参数         | 类型                                                       | 默认值  | 说明                                                                                                        |
| ------------ | ---------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| modelValue   | boolean                                                    | —       | 必选，单独使用时绑定布尔；group 内由 group 接管                                                             |
| label        | `string \| number \| boolean`                              | —       | 单独使用且无插槽时作为文案；与 group 配合时作为本项的值                                                     |
| disabled     | boolean                                                    | `false` | 是否禁用                                                                                                    |
| color        | string                                                     | —       | 自定义选中色                                                                                                |
| beforeChange | `(isChecked: boolean, v: string) => boolean \| Promise<boolean>` | —       | 切换前的钩子                                                                                                |

### CheckBox Events

| 事件   | 回调签名                  | 说明                  |
| ------ | ------------------------- | --------------------- |
| change | `(value: boolean)`        | 值改变时触发          |

### CheckBoxGroup Props

| 参数         | 类型                                                       | 默认值     | 说明                          |
| ------------ | ---------------------------------------------------------- | ---------- | ----------------------------- |
| modelValue   | `Array<string \| number>`                                  | `[]`       | 已选项数组，支持 `v-model`    |
| disabled     | boolean                                                    | `false`    | 整组禁用                      |
| color        | string                                                     | —          | 整组的选中色                  |
| direction    | `'row' \| 'column'`                                        | `'column'` | 排列方向                      |
| beforeChange | `(isChecked: boolean, v: string) => boolean \| Promise<boolean>` | —          | 切换前的钩子                  |

### CheckBoxGroup Events

| 事件   | 回调签名                  | 说明           |
| ------ | ------------------------- | -------------- |
| change | `(values: string[])`      | 选中项改变时触发 |

### Slots

| 名称    | 说明           |
| ------- | -------------- |
| default | 多选框右侧文本 |
