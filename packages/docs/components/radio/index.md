# Radio 单选框

在多个备选项中选中一个。

## 何时使用

- 在一组备选项中选中单一选项。
- 与 `<c-radio-group>` 搭配，在多个 Radio 之间形成互斥关系。

## 基本使用

将 `v-model` 与每个 `<c-radio>` 的 `label` 比对决定选中状态；值可以是字符串、数字或布尔值。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const value = ref('apple')
</script>

<template>
  <c-radio v-model="value" label="apple">苹果</c-radio>
  <c-radio v-model="value" label="banana">香蕉</c-radio>
  <c-radio v-model="value" label="orange">橙子</c-radio>
  <p style="margin-top: 8px; color: var(--ccui-color-text-secondary)">当前：{{ value }}</p>
</template>
```

:::

## 禁用

`disabled` 让单项不可选；常用于"权限不足 / 暂不开放"。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const value = ref('a')
</script>

<template>
  <c-radio v-model="value" label="a">可选 A</c-radio>
  <c-radio v-model="value" label="b" disabled>禁用 B</c-radio>
  <c-radio v-model="value" label="c">可选 C</c-radio>
</template>
```

:::

## 单选框组

`<c-radio-group>` 把一组 Radio 收纳到统一的 `v-model` 下，免去给每个 Radio 单独绑值。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const city = ref('shanghai')
</script>

<template>
  <c-radio-group v-model="city">
    <c-radio label="beijing">北京</c-radio>
    <c-radio label="shanghai">上海</c-radio>
    <c-radio label="guangzhou">广州</c-radio>
    <c-radio label="shenzhen">深圳</c-radio>
  </c-radio-group>
  <p style="margin-top: 8px; color: var(--ccui-color-text-secondary)">已选：{{ city }}</p>
</template>
```

:::

## 排列方向

`direction` 切换纵向（默认）/ 横向。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const a = ref('1')
const b = ref('1')
</script>

<template>
  <p style="color: var(--ccui-color-text-secondary); margin: 0 0 4px">column（默认）</p>
  <c-radio-group v-model="a" direction="column">
    <c-radio label="1">选项 1</c-radio>
    <c-radio label="2">选项 2</c-radio>
    <c-radio label="3">选项 3</c-radio>
  </c-radio-group>

  <p style="color: var(--ccui-color-text-secondary); margin: 16px 0 4px">row</p>
  <c-radio-group v-model="b" direction="row">
    <c-radio label="1">选项 1</c-radio>
    <c-radio label="2">选项 2</c-radio>
    <c-radio label="3">选项 3</c-radio>
  </c-radio-group>
</template>
```

:::

## 整组禁用

在 `<c-radio-group>` 上加 `disabled` 一次性禁用整组。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const v = ref('1')
</script>

<template>
  <c-radio-group v-model="v" disabled direction="row">
    <c-radio label="1">已选不可改</c-radio>
    <c-radio label="2">禁用</c-radio>
    <c-radio label="3">禁用</c-radio>
  </c-radio-group>
</template>
```

:::

## 切换前钩子

`before-change` 返回 `false` / `Promise<false>` 时阻止本次切换，常用于"二次确认"或"先做异步校验"。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const v = ref('safe')
const log = ref('（无）')

function beforeChange(val) {
  log.value = `尝试切换到 "${val}"`
  if (val === 'danger') {
    log.value += ' → 已被钩子阻止'
    return false
  }
  return true
}
</script>

<template>
  <c-radio-group v-model="v" :before-change="beforeChange" direction="row">
    <c-radio label="safe">安全</c-radio>
    <c-radio label="warn">注意</c-radio>
    <c-radio label="danger">危险（被禁）</c-radio>
  </c-radio-group>
  <p style="margin-top: 8px; color: var(--ccui-color-text-secondary)">日志：{{ log }}</p>
</template>
```

:::

## 监听 change

`change` 事件返回新值，用于联动其他状态。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const v = ref('s')
const lastChange = ref('（无）')

function onChange(val) {
  lastChange.value = val
}
</script>

<template>
  <c-radio-group v-model="v" direction="row" @change="onChange">
    <c-radio label="s">小</c-radio>
    <c-radio label="m">中</c-radio>
    <c-radio label="l">大</c-radio>
  </c-radio-group>
  <p style="margin-top: 8px; color: var(--ccui-color-text-secondary)">最近 change：{{ lastChange }}</p>
</template>
```

:::

## 键盘与表单

RadioGroup 会为组内原生 radio 使用同一个 `name`：Tab 进入当前选中项后，可使用方向键切换选项，并用 Space 选择。向 RadioGroup 传入 `name` 后，选中值会以该字段名随原生表单提交；未传入时组件会自动生成分组名，需要读取原生 `FormData` 时建议显式传入稳定名称。

## API

### Radio Props

| 参数         | 类型                          | 默认值  | 说明                                                   |
| ------------ | ----------------------------- | ------- | ------------------------------------------------------ |
| modelValue   | `string \| number \| boolean` | —       | 绑定值（与 `label` 比较决定是否选中），支持 `v-model`  |
| label        | `string \| number \| boolean` | `''`    | 本项的值                                               |
| name         | string                        | `''`    | 独立使用时的原生 `name`；组内使用 RadioGroup 的 `name` |
| disabled     | boolean                       | `false` | 是否禁用                                               |
| beforeChange | `BeforeChangeType`            | —       | 切换前的钩子，返回 `false` 或拒绝 Promise 时阻止切换   |

### Radio Events

| 事件   | 回调签名                                       | 说明         |
| ------ | ---------------------------------------------- | ------------ |
| change | `(value: string \| number \| boolean) => void` | 值改变时触发 |

### RadioGroup Props

| 参数         | 类型                          | 默认值     | 说明                                    |
| ------------ | ----------------------------- | ---------- | --------------------------------------- |
| modelValue   | `string \| number \| boolean` | —          | 被选中的值，支持 `v-model`              |
| name         | string                        | `''`       | 组内原生 radio 的 `name`，用于表单提交  |
| disabled     | boolean                       | `false`    | 整组禁用                                |
| direction    | `DirectionType`               | `'column'` | 排列方向（`row` / `column`）            |
| beforeChange | `BeforeChangeType`            | —          | 切换前的钩子，返回 `false` 或拒绝时阻止 |

### RadioGroup Events

| 事件   | 回调签名                                       | 说明         |
| ------ | ---------------------------------------------- | ------------ |
| change | `(value: string \| number \| boolean) => void` | 值改变时触发 |

### Slots

| 名称    | 说明           |
| ------- | -------------- |
| default | 单选框右侧文本 |

### 类型定义

```ts
type RadioValue = string | number | boolean
type BeforeChangeType = (value: RadioValue) => boolean | Promise<boolean>
type DirectionType = 'row' | 'column'
```
