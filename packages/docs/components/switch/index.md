# Switch 开关

开关选择器。

## 何时使用

- 需要表示开关状态/两种状态之间的切换时。
- 与 Checkbox 的区别：切换 Switch 会直接触发状态改变。

## 基本使用

最简形式，绑 `v-model`。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
const v = ref(true)
</script>

<template>
  <c-switch v-model="v" />
  <span style="margin-left: 12px">{{ v }}</span>
</template>
```

:::

## 内嵌文字

`checked-children` / `unchecked-children` 在开关内部显示文字。

:::demo

```vue
<template>
  <c-switch checked-children="开" unchecked-children="关" :model-value="true" />
  &nbsp;
  <c-switch checked-children="ON" unchecked-children="OFF" :model-value="false" />
</template>
```

:::

## 尺寸

:::demo

```vue
<template>
  <c-switch :model-value="true" />
  &nbsp;
  <c-switch size="small" :model-value="true" />
</template>
```

:::

## 禁用 / 加载

:::demo

```vue
<template>
  <c-switch disabled :model-value="false" />
  &nbsp;
  <c-switch disabled :model-value="true" />
  &nbsp;
  <c-switch loading :model-value="true" />
  &nbsp;
  <c-switch loading :model-value="false" />
</template>
```

:::

## 自定义开关值

`checkedValue` / `uncheckedValue` 改变开关绑定值，常用于 `'on' / 'off'`、`1 / 0` 这类二元枚举。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
const status = ref('on')
</script>

<template>
  <c-switch v-model="status" checked-value="on" unchecked-value="off" />
  <span style="margin-left: 12px">当前状态：{{ status }}</span>
</template>
```

:::

## 监听 change 事件

`change` 在状态改变时触发，回调里可发请求、做联动等。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
const enabled = ref(false)
const log = ref<string[]>([])

function onChange(val: boolean) {
  log.value.unshift(`${new Date().toLocaleTimeString()}：切到 ${val ? '开' : '关'}`)
  if (log.value.length > 5) log.value.length = 5
}
</script>

<template>
  <c-switch v-model="enabled" @change="onChange" />
  <ul style="margin-top: 12px; color: #888; font-size: 12px">
    <li v-for="(item, i) in log" :key="i">{{ item }}</li>
  </ul>
</template>
```

:::

## API

### Props

| 参数              | 类型                          | 默认值      | 说明                       |
| ----------------- | ----------------------------- | ----------- | -------------------------- |
| modelValue        | `boolean \| string \| number` | `false`     | v-model 绑定值             |
| checkedValue      | `boolean \| string \| number` | `true`      | 选中时的值                 |
| uncheckedValue    | `boolean \| string \| number` | `false`     | 未选中时的值               |
| disabled          | boolean                       | `false`     | 禁用                       |
| loading           | boolean                       | `false`     | 加载状态                   |
| size              | `'default' \| 'small'`        | `'default'` | 大小                       |
| checkedChildren   | string                        | `--`        | 选中时显示的内容           |
| uncheckedChildren | string                        | `--`        | 未选中时显示的内容         |
| autofocus         | boolean                       | `false`     | 自动聚焦                   |

### Events

| 事件名 | 回调签名                  | 触发时机       |
| ------ | ------------------------- | -------------- |
| change | `(value, e: MouseEvent)`  | 状态改变时触发 |
| click  | `(e: MouseEvent)`         | 点击时触发     |
