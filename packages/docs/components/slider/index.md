# Slider 滑块

滑块组件用于在数值区间内进行选择。

## 何时使用

- 当用户需要在数值区间内进行选择时
- 当需要调整设置值时，如音量、亮度等
- 当需要选择范围值时

## 基本用法

基本的滑块用法。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value = ref(50)

    return {
      value
    }
  }
})
</script>

<template>
  <div>
    <c-slider v-model="value" />
    <p>当前值: {{ value }}</p>
  </div>
</template>

<style>
</style>
```

:::

## 范围选择

支持选择数值范围。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const range = ref([20, 80])

    return {
      range
    }
  }
})
</script>

<template>
  <div>
    <c-slider v-model="range" :range="true" />
    <p>当前范围: {{ range }}</p>
  </div>
</template>

<style>
</style>
```

:::

## 垂直模式

垂直方向的滑块。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value = ref(30)

    return {
      value
    }
  }
})
</script>

<template>
  <div style="height: 200px;">
    <c-slider v-model="value" vertical />
  </div>
</template>

<style>
</style>
```

:::

## 步长

设置步长，取值必须大于 0，并且可被 (max - min) 整除。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value = ref(40)

    return {
      value
    }
  }
})
</script>

<template>
  <div>
    <c-slider v-model="value" :step="10" />
    <p>当前值: {{ value }}</p>
  </div>
</template>

<style>
</style>
```

:::

## 显示间断点

使用 `show-stops` 属性可以显示间断点。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value = ref(40)

    return {
      value
    }
  }
})
</script>

<template>
  <div>
    <c-slider v-model="value" :step="10" show-stops />
  </div>
</template>

<style>
</style>
```

:::

## 带标记

使用 `marks` 属性可以显示标记。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value = ref(40)
    const marks = {
      0: '0°C',
      26: '26°C',
      37: '37°C',
      50: '50°C'
    }

    return {
      value,
      marks
    }
  }
})
</script>

<template>
  <div>
    <c-slider v-model="value" :marks="marks" />
  </div>
</template>

<style>
</style>
```

:::

## 带输入框

通过设置 `show-input` 属性可以显示输入框，仅在非范围选择时有效。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value = ref(50)

    return {
      value
    }
  }
})
</script>

<template>
  <div>
    <c-slider v-model="value" show-input />
    <p>当前值: {{ value }}</p>
  </div>
</template>

<style>
</style>
```

:::

## 定制 Tooltip 显示内容

通过 `tips-renderer` 属性可以定制 Tooltip 显示内容，设置 `show-tooltip="false"` 可以隐藏 Tooltip。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value1 = ref(50)
    const value2 = ref(30)

    function formatTooltip(value) {
      return `${value}%`
    }

    return {
      value1,
      value2,
      formatTooltip
    }
  }
})
</script>

<template>
  <div>
    <h4>自定义 Tooltip 内容</h4>
    <c-slider v-model="value1" :tips-renderer="formatTooltip" />
    <p>当前值: {{ value1 }}</p>

    <h4>隐藏 Tooltip</h4>
    <c-slider v-model="value2" :show-tooltip="false" />
    <p>当前值: {{ value2 }}</p>
  </div>
</template>

<style>
</style>
```

:::

## Tooltip 位置

通过 `placement` 属性可以设置 Tooltip 的显示位置。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value1 = ref(25)
    const value2 = ref(50)
    const value3 = ref(75)
    const value4 = ref(90)

    return {
      value1,
      value2,
      value3,
      value4
    }
  }
})
</script>

<template>
  <div>
    <h4>顶部显示（默认）</h4>
    <c-slider v-model="value1" placement="top" />

    <h4>底部显示</h4>
    <c-slider v-model="value2" placement="bottom" />

    <h4>右侧显示</h4>
    <c-slider v-model="value3" placement="right" />

    <h4>左侧显示</h4>
    <c-slider v-model="value4" placement="left" />
  </div>
</template>

<style>
</style>
```

:::

## 禁用状态

通过设置 `disabled` 属性来禁用滑块。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value = ref(50)

    return {
      value
    }
  }
})
</script>

<template>
  <div>
    <c-slider v-model="value" disabled />
  </div>
</template>

<style>
</style>
```

:::

## API

### Slider Props

| 参数                  | 说明                                                                                  | 类型                   | 可选值                      | 默认值  |
| --------------------- | ------------------------------------------------------------------------------------- | ---------------------- | --------------------------- | ------- |
| model-value / v-model | 绑定值                                                                                | number / number[]      | —                           | 0       |
| min                   | 最小值                                                                                | number                 | —                           | 0       |
| max                   | 最大值                                                                                | number                 | —                           | 100     |
| disabled              | 是否禁用                                                                              | boolean                | —                           | false   |
| step                  | 步长                                                                                  | number                 | —                           | 1       |
| show-input            | 是否显示输入框，仅在非范围选择时有效                                                  | boolean                | —                           | false   |
| show-input-controls   | 在显示输入框的情况下，是否显示输入框的控制按钮                                        | boolean                | —                           | true    |
| input-size            | 输入框的尺寸                                                                          | string                 | large / default / small     | default |
| show-stops            | 是否显示间断点                                                                        | boolean                | —                           | false   |
| show-tooltip          | 是否显示 tooltip                                                                      | boolean                | —                           | true    |
| format-tooltip        | 格式化 tooltip message                                                                | function(value)        | —                           | —       |
| tips-renderer         | 自定义 tooltip 内容                                                                 | function(value) / null | —                           | —       |
| placement             | Tooltip 显示位置                                                                      | string                 | top / right / bottom / left | top     |
| range                 | 是否为范围选择                                                                        | boolean                | —                           | false   |
| vertical              | 是否竖向模式                                                                          | boolean                | —                           | false   |
| height                | Slider 高度，竖向模式时必填                                                           | string                 | —                           | —       |
| label                 | 屏幕阅读器标签                                                                        | string                 | —                           | —       |
| debounce              | 输入时的去抖延迟，毫秒                                                                | number                 | —                           | 300     |
| tooltip-class         | tooltip 的自定义类名                                                                  | string                 | —                           | —       |
| marks                 | 标记， key 的类型必须为 number 且取值在闭区间 [min, max] 内，每个标记可以单独设置样式 | object                 | —                           | —       |

### Slider Events

| 事件名 | 说明                                               | 回调参数   |
| ------ | -------------------------------------------------- | ---------- |
| change | 值改变时触发（使用鼠标拖拽时，只在松开鼠标后触发） | 改变后的值 |
| input  | 数据改变时触发（使用鼠标拖拽时，活动过程实时触发） | 改变后的值 |
