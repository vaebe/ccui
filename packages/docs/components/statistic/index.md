# Statistic 统计数值

突出展示一个数字指标。常用于驾驶舱卡片、数据概览、订单详情。

## 基本使用

最简版：`title` + `value`。

:::demo

```vue
<template>
  <c-statistic title="活跃用户" :value="112893" />
</template>
```

:::

## 加前缀 / 后缀 / 精度

`prefix` / `suffix` 用作单位，`precision` 控制小数位数。

:::demo

```vue
<template>
  <div style="display: flex; gap: 32px">
    <c-statistic title="账户余额（CNY）" :value="568.0788" prefix="¥" :precision="2" />
    <c-statistic title="完成率" :value="93.6" suffix="%" :precision="1" />
    <c-statistic title="订单量" :value="1024" suffix="单" />
  </div>
</template>
```

:::

## 千分位与小数分隔符

`group-separator` 改千分位符（默认 `,`），`decimal-separator` 改小数点（默认 `.`）。欧式排版常用 `.` 千分 + `,` 小数。

:::demo

```vue
<template>
  <div style="display: flex; gap: 32px">
    <c-statistic title="EN" :value="1234567.89" :precision="2" />
    <c-statistic
      title="EU"
      :value="1234567.89"
      :precision="2"
      group-separator="."
      decimal-separator=","
    />
  </div>
</template>
```

:::

## 自定义颜色 / 强调样式

`value-style` 接受 CSSProperties 对象，常用于按好坏给数字着色。

:::demo

```vue
<template>
  <div style="display: flex; gap: 32px">
    <c-statistic title="今日盈利" :value="12.32" prefix="+" suffix="%" :value-style="{ color: '#3f8600' }" />
    <c-statistic title="今日亏损" :value="-3.18" suffix="%" :value-style="{ color: '#cf1322' }" />
    <c-statistic title="待办" :value="42" :value-style="{ color: '#1677ff', fontWeight: 700 }" />
  </div>
</template>
```

:::

## 加载中

`loading` 显示骨架占位，常用于异步数据未就绪时。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const loading = ref(true)
const value = ref(0)

function refresh() {
  loading.value = true
  setTimeout(() => {
    value.value = Math.round(Math.random() * 100000)
    loading.value = false
  }, 800)
}

refresh()
</script>

<template>
  <c-statistic title="今日访问" :value="value" :loading="loading" />
  <c-button style="margin-top: 8px" @click="refresh">刷新</c-button>
</template>
```

:::

## 倒计时

`<c-statistic-countdown>` 接收时间戳 / Date，按 `format` 渲染剩余时间。

:::demo

```vue
<script setup>
import { computed } from 'vue'

const deadlineHM = computed(() => Date.now() + 1000 * 60 * 60 * 5 + 1000 * 32)
const deadlineFull = computed(() => Date.now() + 1000 * 60 * 60 * 28)
</script>

<template>
  <div style="display: flex; gap: 32px; flex-wrap: wrap">
    <c-statistic-countdown title="距开始" :value="deadlineHM" format="HH:mm:ss" />
    <c-statistic-countdown
      title="距活动结束"
      :value="deadlineFull"
      format="DD 天 HH:mm:ss"
    />
  </div>
</template>
```

:::

## API

### Statistic Props

| 参数             | 类型                | 默认值 | 说明                                              |
| ---------------- | ------------------- | ------ | ------------------------------------------------- |
| title            | string              | `''`   | 数字上方的小标题                                  |
| value            | `number \| string`  | `0`    | 数值                                              |
| precision        | number              | —      | 小数位数；不传按原值                              |
| prefix           | string              | `''`   | 前缀（如 `¥`、`+`）                               |
| suffix           | string              | `''`   | 后缀（如 `%`、`单`）                              |
| groupSeparator   | string              | `','`  | 千分位符                                          |
| decimalSeparator | string              | `'.'`  | 小数分隔符                                        |
| valueStyle       | `CSSProperties`     | `{}`   | 数字行内样式                                      |
| loading          | boolean             | `false`| 加载中（显示骨架）                                |

### StatisticCountdown Props

| 参数       | 类型                              | 默认值        | 说明                              |
| ---------- | --------------------------------- | ------------- | --------------------------------- |
| title      | string                            | `''`          | 标题                              |
| value      | `number \| string \| Date`        | `0`           | 截止时间（毫秒时间戳 / Date 等）  |
| format     | string                            | `'HH:mm:ss'`  | 格式串：`DD HH mm ss SSS`         |
| prefix     | string                            | `''`          | 前缀                              |
| suffix     | string                            | `''`          | 后缀                              |
| valueStyle | `CSSProperties`                   | `{}`          | 数字行内样式                      |
