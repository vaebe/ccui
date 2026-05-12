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
