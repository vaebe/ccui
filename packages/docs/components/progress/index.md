# Progress 进度条

可视化操作的完成度。

## 何时使用

- 操作耗时 ≥ 2 秒，需向用户反馈进度。
- 文件上传 / 下载 / 后台任务的实时进度。
- 数据填充率、目标完成率等"百分比"指标。

## 基本使用

线形进度条，`percent` 取值 0–100。

:::demo

```vue
<template>
  <c-progress :percent="30" />
  <c-progress :percent="50" />
  <c-progress :percent="100" />
</template>
```

:::

## 不同状态

`status` 决定进度条颜色与图标：`normal` / `active`（带流光动画）/ `success` / `exception`。

:::demo

```vue
<template>
  <c-progress :percent="30" status="normal" />
  <c-progress :percent="50" status="active" />
  <c-progress :percent="70" status="exception" />
  <c-progress :percent="100" status="success" />
</template>
```

:::

## 自定义颜色

`stroke-color` 改进度条主色，`trail-color` 改未完成部分的灰底色。

:::demo

```vue
<template>
  <c-progress :percent="60" stroke-color="#52c41a" />
  <c-progress :percent="60" stroke-color="#fa541c" />
  <c-progress :percent="60" stroke-color="#722ed1" trail-color="#f0e6ff" />
</template>
```

:::

## 自定义文案

`format` 接收百分比，返回任意字符串，常用于"已完成 / 总数"展示。

:::demo

```vue
<template>
  <c-progress :percent="50" :format="(p) => `${p} / 100`" />
  <c-progress :percent="80" :format="(p) => `进度 ${p}%`" />
  <c-progress :percent="100" :format="() => '已完成 ✓'" />
</template>
```

:::

## 圆形

`type="circle"` 渲染为圆环；`width` 控制画布大小。

:::demo

```vue
<template>
  <div style="display: flex; gap: 24px; flex-wrap: wrap">
    <c-progress type="circle" :percent="75" />
    <c-progress type="circle" :percent="70" status="exception" />
    <c-progress type="circle" :percent="100" />
    <c-progress type="circle" :percent="50" :width="80" />
  </div>
</template>
```

:::

## 仪表盘

`type="dashboard"` 是底部留缺口的圆形，常见于"剩余配额 / 容量占用"。

:::demo

```vue
<template>
  <div style="display: flex; gap: 24px">
    <c-progress type="dashboard" :percent="60" />
    <c-progress type="dashboard" :percent="80" status="active" />
    <c-progress type="dashboard" :percent="92" status="exception" :format="(p) => `${p}%\n紧张`" />
  </div>
</template>
```

:::

## 动态进度

配合 `setInterval` 模拟一个上传进度。

:::demo

```vue
<script setup>
import { ref, onBeforeUnmount } from 'vue'

const percent = ref(0)
let timer = null

function start() {
  stop()
  percent.value = 0
  timer = setInterval(() => {
    percent.value = Math.min(100, percent.value + Math.round(Math.random() * 12))
    if (percent.value >= 100) {
      stop()
    }
  }, 400)
}

function stop() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onBeforeUnmount(stop)
</script>

<template>
  <c-progress :percent="percent" status="active" />
  <div style="margin-top: 12px">
    <c-button type="primary" @click="start">开始</c-button>
    <c-button style="margin-inline-start: 8px" @click="stop">暂停</c-button>
  </div>
</template>
```

:::

## 不同尺寸

`size` 支持 `'small' | 'default' | number | [number, number]` 四种形式。

:::demo

```vue
<template>
  <div style="margin-bottom: 12px">
    <c-progress :percent="60" size="small" />
    <span style="color: #999; font-size: 12px">size="small"</span>
  </div>
  <div style="margin-bottom: 12px">
    <c-progress :percent="60" />
    <span style="color: #999; font-size: 12px">size="default"</span>
  </div>
  <div style="margin-bottom: 12px">
    <c-progress :percent="60" :size="16" />
    <span style="color: #999; font-size: 12px">:size="16"（线宽 16px）</span>
  </div>
  <div>
    <c-progress :percent="60" :size="[240, 12]" />
    <span style="color: #999; font-size: 12px">:size="[240, 12]"（宽 240 高 12）</span>
  </div>
</template>
```

:::

## 隐藏百分比数字

`show-info="false"` 关闭右侧 / 中心的数字，常用于「占位条」或紧凑列表。

:::demo

```vue
<template>
  <c-progress :percent="40" :show-info="false" />
  <c-progress :percent="80" :show-info="false" stroke-color="#52c41a" />
  <div style="display: flex; gap: 16px; margin-top: 16px">
    <c-progress type="circle" :percent="70" :show-info="false" :width="60" />
    <c-progress type="dashboard" :percent="50" :show-info="false" :width="60" />
  </div>
</template>
```

:::

## 自定义线宽

`stroke-width` 改进度条线宽（line：高度 px；circle / dashboard：描边粗细）。

:::demo

```vue
<template>
  <div style="margin-bottom: 12px">
    <c-progress :percent="50" :stroke-width="4" />
  </div>
  <div style="margin-bottom: 12px">
    <c-progress :percent="50" :stroke-width="8" />
  </div>
  <div style="margin-bottom: 12px">
    <c-progress :percent="50" :stroke-width="16" />
  </div>
  <div style="display: flex; gap: 16px">
    <c-progress type="circle" :percent="75" :stroke-width="4" />
    <c-progress type="circle" :percent="75" :stroke-width="10" />
    <c-progress type="circle" :percent="75" :stroke-width="16" />
  </div>
</template>
```

:::

## 圆形不同尺寸

`width` 改圆形 / 仪表盘的画布尺寸（px），适合卡片中不同大小的指标圈。

:::demo

```vue
<template>
  <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap">
    <c-progress type="circle" :percent="60" :width="48" />
    <c-progress type="circle" :percent="60" :width="80" />
    <c-progress type="circle" :percent="60" :width="120" />
    <c-progress type="circle" :percent="60" :width="180" />
  </div>
</template>
```

:::

## 渐变色（line-gradient）

`stroke-color` 接受 CSS `linear-gradient` 字符串，实现渐变填充。

:::demo

```vue
<template>
  <div style="margin-bottom: 12px">
    <c-progress :percent="70" stroke-color="linear-gradient(90deg, #108ee9, #87d068)" />
  </div>
  <div style="margin-bottom: 12px">
    <c-progress :percent="85" stroke-color="linear-gradient(90deg, #faad14, #fa541c)" />
  </div>
  <div>
    <c-progress :percent="100" stroke-color="linear-gradient(90deg, #722ed1, #eb2f96, #fa541c)" />
  </div>
</template>
```

:::

## 步骤式进度（多段）

通过多个 `<c-progress>` 实现「步骤完成度」展示，每段代表一个步骤。

:::demo

```vue
<script setup>
import { ref, computed } from 'vue'
const step = ref(2)
const steps = ['创建', '审核', '部署', '验收']
const segPercents = computed(() => steps.map((_, i) => (i < step.value ? 100 : i === step.value ? 50 : 0)))
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px">
    <div v-for="(p, i) in segPercents" :key="i">
      <div style="font-size: 12px; color: #666; margin-bottom: 4px">{{ steps[i] }}</div>
      <c-progress :percent="p" :show-info="false" size="small" :stroke-color="i < step ? '#52c41a' : '#1677ff'" />
    </div>
  </div>
  <c-button @click="step = Math.max(0, step - 1)">上一步</c-button>
  <c-button style="margin-inline-start: 8px" type="primary" @click="step = Math.min(4, step + 1)">下一步</c-button>
</template>
```

:::

## 失败 + 重试

`status="exception"` 显示失败态，业务侧改 percent 与 status 切回 `active` 即可重试。

:::demo

```vue
<script setup>
import { ref, onBeforeUnmount } from 'vue'
const percent = ref(45)
const status = ref('exception')
let timer = null

function retry() {
  if (timer) clearInterval(timer)
  status.value = 'active'
  timer = setInterval(() => {
    percent.value = Math.min(100, percent.value + 5)
    if (percent.value >= 100) {
      status.value = 'success'
      clearInterval(timer)
      timer = null
    }
  }, 300)
}

function fail() {
  if (timer) clearInterval(timer)
  status.value = 'exception'
}

onBeforeUnmount(() => timer && clearInterval(timer))
</script>

<template>
  <c-progress :percent="percent" :status="status" />
  <div style="margin-top: 12px">
    <c-button type="primary" @click="retry">重试</c-button>
    <c-button style="margin-inline-start: 8px" type="danger" @click="fail">模拟失败</c-button>
  </div>
</template>
```

:::

## 剩余时间提示（format 计算）

`format` 是普通函数，可结合外部状态计算 ETA。

:::demo

```vue
<script setup>
import { ref, onBeforeUnmount } from 'vue'
const percent = ref(0)
const startedAt = ref(0)
let timer = null

function start() {
  if (timer) clearInterval(timer)
  percent.value = 0
  startedAt.value = Date.now()
  timer = setInterval(() => {
    percent.value = Math.min(100, percent.value + 4)
    if (percent.value >= 100) {
      clearInterval(timer)
      timer = null
    }
  }, 500)
}

function fmt(p) {
  if (p === 0) return '准备中'
  if (p >= 100) return '完成'
  const elapsed = (Date.now() - startedAt.value) / 1000
  const remaining = (elapsed / p) * (100 - p)
  return `${p}% · 约剩 ${remaining.toFixed(0)}s`
}

onBeforeUnmount(() => timer && clearInterval(timer))
</script>

<template>
  <c-progress :percent="percent" :format="fmt" status="active" />
  <c-button style="margin-top: 12px" type="primary" @click="start">开始</c-button>
</template>
```

:::

## API

### Props

| 参数        | 类型                                                 | 默认值      | 说明                               |
| ----------- | ---------------------------------------------------- | ----------- | ---------------------------------- |
| percent     | number                                               | `0`         | 百分比 0–100                       |
| type        | `'line' \| 'circle' \| 'dashboard'`                  | `'line'`    | 形态                               |
| status      | `'normal' \| 'active' \| 'success' \| 'exception'`   | `'normal'`  | 状态                               |
| showInfo    | boolean                                              | `true`      | 显示百分比数字                     |
| strokeColor | string                                               | —           | 进度条颜色（不传走主色 token）     |
| trailColor  | string                                               | —           | 未完成段颜色                       |
| strokeWidth | number                                               | —           | 线宽（line: px；circle: 描边粗细） |
| width       | number                                               | `120`       | 圆形 / 仪表盘的画布尺寸（px）      |
| size        | `'default' \| 'small' \| number \| [number, number]` | `'default'` | 尺寸                               |
| format      | `(percent: number) => string`                        | —           | 自定义中心 / 后置文案              |
