# StatisticTimer 计时器

基于时间戳的双向计时器，对标 Ant Design `Statistic.Timer`（v5.25+），作为独立顶层组件存在（**不挂 Statistic.Timer 静态属性**）。

::: tip 与 `<c-statistic-countdown>` 的关系
StatisticTimer 是 Countdown 的**上位替代**：

- `<c-statistic-countdown>` 只支持倒计时（保留为兼容层，不 deprecate）
- `<c-statistic-timer>` 同时支持 `type: 'countdown' | 'countup'` 双向计时

新项目推荐用 `<c-statistic-timer>` 统一表达。
:::

## 何时使用

- 倒计时：限时活动、订单倒计时、抢购截止
- 正计时：在线时长、运行时间、计费计时

## 倒计时

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const target = ref(Date.now() + 60 * 60 * 1000) // 1 小时后
</script>

<template>
  <c-statistic-timer title="倒计时" :value="target" @finish="() => console.log('结束')" />
</template>
```

:::

## 正计时

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const start = ref(Date.now()) // 从现在开始
</script>

<template>
  <c-statistic-timer type="countup" title="已运行" :value="start" format="HH:mm:ss" />
</template>
```

:::

## 自定义格式

支持的 token：`D / DD / H / HH / m / mm / s / ss / SSS`。

:::demo

```vue
<template>
  <c-space>
    <c-statistic-timer title="带天数" :value="Date.now() + 2 * 86400_000" format="D 天 HH:mm:ss" />
    <c-statistic-timer title="毫秒精度" :value="Date.now() + 60_000" format="mm:ss.SSS" />
  </c-space>
</template>
```

:::

## prefix / suffix

:::demo

```vue
<template>
  <c-statistic-timer title="距活动结束" :value="Date.now() + 30_000" prefix="⏱" suffix="后结束" />
</template>
```

:::

## 事件

| 事件名 | 参数               | 触发时机                                     |
| ------ | ------------------ | -------------------------------------------- |
| change | `(diffMs: number)` | 每次 tick；diff 为当前剩余 / 已过去毫秒数    |
| finish | -                  | 仅 `countdown` 模式：归 0 时触发，触发后停表 |

## StatisticTimer 参数

| 参数       | 类型                       | 默认          | 说明                  |
| ---------- | -------------------------- | ------------- | --------------------- |
| type       | `'countdown' \| 'countup'` | `'countdown'` | 计时方向              |
| value      | `number \| string \| Date` | `0`           | 目标 / 起始时间戳     |
| format     | `string`                   | `'HH:mm:ss'`  | 格式化字符串          |
| title      | `string`                   | `''`          | 标题（slot 优先）     |
| prefix     | `string`                   | `''`          | 前缀（slot 优先）     |
| suffix     | `string`                   | `''`          | 后缀（slot 优先）     |
| valueStyle | `CSSProperties`            | `{}`          | 数值元素 inline style |

## StatisticTimer 插槽

| 插槽名 | 说明           |
| ------ | -------------- |
| title  | 自定义标题节点 |
| prefix | 自定义前缀节点 |
| suffix | 自定义后缀节点 |
