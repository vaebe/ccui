# Progress 进度条

展示操作的当前进度。

## 何时使用

- 当一个操作会打断当前界面，或者需要在后台运行，且耗时可能超过 2 秒时。
- 当需要显示一个操作完成的百分比时。

## 基本使用

:::demo

```vue
<template>
  <c-progress :percent="30" />
  <c-progress :percent="50" status="active" />
  <c-progress :percent="70" status="exception" />
  <c-progress :percent="100" />
</template>
```

:::

## 圆形进度

:::demo

```vue
<template>
  <c-progress type="circle" :percent="75" />
  <c-progress type="circle" :percent="70" status="exception" />
  <c-progress type="circle" :percent="100" />
</template>
```

:::

## 仪表盘

:::demo

```vue
<template>
  <c-progress type="dashboard" :percent="75" />
</template>
```

:::

## Progress 参数

| 参数        | 类型                                          | 默认值    | 说明               |
| ----------- | --------------------------------------------- | --------- | ------------------ |
| percent     | number                                        | 0         | 百分比             |
| type        | 'line' / 'circle' / 'dashboard'               | 'line'    | 类型               |
| status      | 'success' / 'exception' / 'normal' / 'active' | 'normal'  | 状态               |
| showInfo    | boolean                                       | true      | 是否显示进度数值   |
| strokeColor | string                                        | --        | 进度条颜色         |
| trailColor  | string                                        | --        | 未完成的分段颜色   |
| strokeWidth | number                                        | --        | 进度条线的宽度     |
| width       | number                                        | 120       | 圆形进度条画布宽度 |
| size        | 'default' / 'small' / number                  | 'default' | 进度条尺寸         |
| format      | (percent: number) => string                   | --        | 内容的模板函数     |
