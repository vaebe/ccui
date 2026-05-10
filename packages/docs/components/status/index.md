# Status 状态

带颜色圆点的状态标签，用于表达任务、记录、行的当前生命周期。

## 何时使用

- 列表行尾标识"已完成 / 进行中 / 待处理"等业务状态。
- 详情页头部展示工单状态、订单状态、健康检查结果。

## 基本使用

不传 `type` 时显示中性灰（`initial`）。文本写在默认插槽里。

:::demo

```vue
<template>
  <c-status>默认</c-status>
</template>
```

:::

## 全部类型

七种内置状态对应不同语义色，便于一眼区分。

:::demo

```vue
<template>
  <div class="status-row">
    <c-status type="initial">未开始</c-status>
    <c-status type="waiting">等待中</c-status>
    <c-status type="running">进行中</c-status>
    <c-status type="success">已完成</c-status>
    <c-status type="warning">需关注</c-status>
    <c-status type="error">失败</c-status>
    <c-status type="invalid">作废</c-status>
  </div>
</template>

<style scoped>
.status-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
```

:::

## 配合表格

放在表格的状态列里，比纯文字更易扫读。

:::demo

```vue
<script setup>
const rows = [
  { id: 'T-1001', name: '部署 release-2.4', status: 'success' },
  { id: 'T-1002', name: '同步 CDN 缓存', status: 'running' },
  { id: 'T-1003', name: '回滚 API v3', status: 'error' },
  { id: 'T-1004', name: '审批：变更窗口', status: 'waiting' },
]

const labelMap = {
  success: '完成',
  running: '执行中',
  error: '失败',
  waiting: '排队',
}
</script>

<template>
  <table class="status-table">
    <thead>
      <tr>
        <th>编号</th>
        <th>任务</th>
        <th>状态</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.id">
        <td>{{ row.id }}</td>
        <td>{{ row.name }}</td>
        <td>
          <c-status :type="row.status">{{ labelMap[row.status] }}</c-status>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.status-table {
  border-collapse: collapse;
  width: 100%;
  font-size: 14px;
}
.status-table th,
.status-table td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}
.status-table th {
  color: #666;
  font-weight: 500;
  background: #fafafa;
}
</style>
```

:::

## 配合数字与文字

业务里常和"数量 + 标签"一起用，比如错误计数、活跃用户数。

:::demo

```vue
<template>
  <div class="status-cards">
    <div class="card">
      <div class="num">128</div>
      <c-status type="success">健康</c-status>
    </div>
    <div class="card">
      <div class="num">7</div>
      <c-status type="warning">告警</c-status>
    </div>
    <div class="card">
      <div class="num">2</div>
      <c-status type="error">异常</c-status>
    </div>
  </div>
</template>

<style scoped>
.status-cards {
  display: flex;
  gap: 16px;
}
.card {
  flex: 1;
  padding: 16px 20px;
  background: #fafafa;
  border-radius: 8px;
}
.num {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 4px;
}
</style>
```

:::

## 动态切换

`type` 可绑定响应式变量，跟随业务状态变化。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const types = ['waiting', 'running', 'success', 'error']
const idx = ref(0)
const cur = ref(types[0])

function next() {
  idx.value = (idx.value + 1) % types.length
  cur.value = types[idx.value]
}
</script>

<template>
  <c-status :type="cur">{{ cur }}</c-status>
  <c-button style="margin-inline-start: 12px" @click="next">切换</c-button>
</template>
```

:::

## API

### Props

| 参数 | 类型          | 默认值      | 说明     |
| ---- | ------------- | ----------- | -------- |
| type | `IStatusType` | `'initial'` | 状态类型 |

### IStatusType

```ts
type IStatusType =
  | 'initial' // 未开始（中性灰）
  | 'waiting' // 等待（深灰）
  | 'running' // 进行中（主色）
  | 'success' // 成功（绿）
  | 'warning' // 警告（黄）
  | 'error'   // 失败（红）
  | 'invalid' // 作废（禁用灰）
```

### Slots

| 名称    | 说明                |
| ------- | ------------------- |
| default | 状态标签的文本内容  |
