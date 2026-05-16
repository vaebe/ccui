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
    <c-statistic title="EU" :value="1234567.89" :precision="2" group-separator="." decimal-separator="," />
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
    <c-statistic-countdown title="距活动结束" :value="deadlineFull" format="DD 天 HH:mm:ss" />
  </div>
</template>
```

:::

## 倒计时事件 finish / change

`finish` 在倒计时归零时触发；`change` 每 tick 回传剩余毫秒数，可联动状态切换或上报。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const deadline = ref(Date.now() + 1000 * 5)
const status = ref('进行中')
const lastTick = ref('—')

function onFinish() {
  status.value = '已结束'
}

function onChange(remaining) {
  lastTick.value = `${remaining} ms`
}

function reset() {
  deadline.value = Date.now() + 1000 * 5
  status.value = '进行中'
}
</script>

<template>
  <c-statistic-countdown title="距活动结束" :value="deadline" format="ss.SSS" @finish="onFinish" @change="onChange" />
  <p style="margin: 8px 0 4px; color: #666">状态：{{ status }} · 上次 tick：{{ lastTick }}</p>
  <c-button size="small" @click="reset">重置 5 秒</c-button>
</template>
```

:::

## 字符串值与占位

`value` 也可以是字符串，常用于「数据未就绪 / 不适用」的占位（如 `'—'` / `'N/A'`），与异步加载状态配合使用。

:::demo

```vue
<template>
  <div style="display: flex; gap: 32px; flex-wrap: wrap">
    <c-statistic title="待审核" value="—" />
    <c-statistic title="健康度" value="N/A" :value-style="{ color: '#bfbfbf' }" />
    <c-statistic title="评分" value="A+" :value-style="{ color: '#fa8c16', fontWeight: 700 }" />
  </div>
</template>
```

:::

## 涨跌趋势

把箭头放进 `prefix`，再配合 `value-style.color` 达成「绿涨红跌」的金融视觉风格。

:::demo

```vue
<template>
  <div style="display: flex; gap: 32px; flex-wrap: wrap">
    <c-statistic title="日活" :value="11.28" prefix="▲" suffix="%" :precision="2" :value-style="{ color: '#3f8600' }" />
    <c-statistic title="跳出率" :value="9.3" prefix="▼" suffix="%" :precision="1" :value-style="{ color: '#cf1322' }" />
    <c-statistic title="留存" :value="0" prefix="—" suffix="%" :value-style="{ color: '#bfbfbf' }" />
  </div>
</template>
```

:::

## 仪表盘四卡片

最常见的指标卡片排版：Row + Col + Card + Statistic 组合，4 张卡片一行。

:::demo

```vue
<template>
  <c-row :gutter="12">
    <c-col :span="6">
      <c-card :body-style="{ padding: '16px' }">
        <c-statistic title="今日订单" :value="3892" :value-style="{ color: '#1677ff' }" />
      </c-card>
    </c-col>
    <c-col :span="6">
      <c-card :body-style="{ padding: '16px' }">
        <c-statistic title="GMV" :value="128400.32" prefix="¥" :precision="2" :value-style="{ color: '#52c41a' }" />
      </c-card>
    </c-col>
    <c-col :span="6">
      <c-card :body-style="{ padding: '16px' }">
        <c-statistic title="客单价" :value="156" prefix="¥" suffix="/单" />
      </c-card>
    </c-col>
    <c-col :span="6">
      <c-card :body-style="{ padding: '16px' }">
        <c-statistic title="退款率" :value="2.3" suffix="%" :value-style="{ color: '#cf1322' }" />
      </c-card>
    </c-col>
  </c-row>
</template>
```

:::

## 限时活动卡片

倒计时 + Card + 行动按钮 = 经典的「限时秒杀 / 课程报名」业务卡。

:::demo

```vue
<script setup>
import { computed } from 'vue'

const deadline = computed(() => Date.now() + 1000 * 60 * 60 * 12 + 1000 * 60 * 34 + 1000 * 56)
</script>

<template>
  <c-card style="max-width: 360px" :body-style="{ padding: '20px' }">
    <c-statistic-countdown
      title="距活动结束"
      :value="deadline"
      format="HH:mm:ss"
      :value-style="{ color: '#cf1322', fontSize: '28px', fontWeight: 700 }"
    />
    <p style="margin: 12px 0 16px; color: #666">优惠券将在倒计时结束后失效。</p>
    <c-button type="primary" block>立即领取</c-button>
  </c-card>
</template>
```

:::

## API

### Statistic Props

| 参数             | 类型               | 默认值  | 说明                 |
| ---------------- | ------------------ | ------- | -------------------- |
| title            | string             | `''`    | 数字上方的小标题     |
| value            | `number \| string` | `0`     | 数值                 |
| precision        | number             | —       | 小数位数；不传按原值 |
| prefix           | string             | `''`    | 前缀（如 `¥`、`+`）  |
| suffix           | string             | `''`    | 后缀（如 `%`、`单`） |
| groupSeparator   | string             | `','`   | 千分位符             |
| decimalSeparator | string             | `'.'`   | 小数分隔符           |
| valueStyle       | `CSSProperties`    | `{}`    | 数字行内样式         |
| loading          | boolean            | `false` | 加载中（显示骨架）   |

### StatisticCountdown Props

| 参数       | 类型                       | 默认值       | 说明                             |
| ---------- | -------------------------- | ------------ | -------------------------------- |
| title      | string                     | `''`         | 标题                             |
| value      | `number \| string \| Date` | `0`          | 截止时间（毫秒时间戳 / Date 等） |
| format     | string                     | `'HH:mm:ss'` | 格式串：`DD HH mm ss SSS`        |
| prefix     | string                     | `''`         | 前缀                             |
| suffix     | string                     | `''`         | 后缀                             |
| valueStyle | `CSSProperties`            | `{}`         | 数字行内样式                     |

### StatisticCountdown Events

| 事件名 | 回调签名              | 触发时机                         |
| ------ | --------------------- | -------------------------------- |
| finish | `()`                  | 倒计时归零（剩余时间 ≤ 0）       |
| change | `(remaining: number)` | 每 tick 触发，回传剩余时间（ms） |
