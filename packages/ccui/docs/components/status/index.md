# Status 状态

传达交互结果的组件。

## 何时使用

表示一个任务的执行结果时使用。

## 基本用法

:::demo 基本用法

```vue

<template>
  <c-status>Default</c-status>
  <c-status type="success">Success</c-status>
  <c-status type="error">Error</c-status>
  <c-status type="warning">Warning</c-status>
  <c-status type="initial">Initial</c-status>
  <c-status type="waiting">Waiting</c-status>
  <c-status type="running">Running</c-status>
  <c-status type="invalid">Invalid</c-status>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
  setup() {
    return {
      msg: 'Status 状态 组件文档示例'
    }
  }
})
</script>

<style>

</style>
```

:::

## Status参数

| 参数 | 类型 | 默认 | 说明 |
|------| ---- | ---- | -- |
| type |   [IStatusType](#istatustype)   | invalid | status的类型 |

## Status插槽

| 插槽名 | 说明 |
|-----|--|
| - | 默认插槽 |

## Status类型定义

### IStatusType

```ts
type IStatusType =
  | 'success'
  | 'error'
  | 'initial'
  | 'warning'
  | 'waiting'
  | 'running'
  | 'invalid';
```
