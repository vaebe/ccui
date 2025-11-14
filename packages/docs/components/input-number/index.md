# InputNumber 数字输入框

数字输入框组件，用于输入数字类型的数据。

## 何时使用

当需要获取标准数值时。

## 基本用法

基础的数字输入框用法。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value1 = ref(0)

    return {
      value1
    }
  }
})
</script>

<template>
  <div class="input-number-demo">
    <c-input-number v-model="value1" placeholder="请输入数字" />
    <p>当前值：{{ value1 }}</p>
  </div>
</template>

<style>
.input-number-demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
```

:::

## 禁用状态

通过 `disabled` 属性指定是否禁用 input 组件。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value2 = ref(10)

    return {
      value2
    }
  }
})
</script>

<template>
  <div class="input-number-demo">
    <c-input-number v-model="value2" disabled />
  </div>
</template>
```

:::

## 数值范围

使用 `min` 和 `max` 属性限制数值范围。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value3 = ref(1)

    return {
      value3
    }
  }
})
</script>

<template>
  <div class="input-number-demo">
    <c-input-number v-model="value3" :min="1" :max="10" />
    <p>范围：1 - 10</p>
  </div>
</template>
```

:::

## 步数

使用 `step` 属性设置步长。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value4 = ref(0)

    return {
      value4
    }
  }
})
</script>

<template>
  <div class="input-number-demo">
    <c-input-number v-model="value4" :step="2" />
    <p>步长：2</p>
  </div>
</template>
```

:::

## 精度

使用 `precision` 属性设置数值精度。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value5 = ref(1.00)

    return {
      value5
    }
  }
})
</script>

<template>
  <div class="input-number-demo">
    <c-input-number v-model="value5" :precision="2" :step="0.1" />
    <p>精度：2 位小数</p>
  </div>
</template>
```

:::

## 尺寸

使用 `size` 属性设置不同尺寸。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value6 = ref(0)

    return {
      value6
    }
  }
})
</script>

<template>
  <div class="input-number-demo">
    <c-input-number v-model="value6" size="lg" placeholder="大尺寸" />
    <c-input-number v-model="value6" size="md" placeholder="中等尺寸" />
    <c-input-number v-model="value6" size="sm" placeholder="小尺寸" />
  </div>
</template>
```

:::

## 控制按钮位置

使用 `controls-position` 属性设置控制按钮位置。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value7 = ref(0)

    return {
      value7
    }
  }
})
</script>

<template>
  <div class="input-number-demo">
    <c-input-number v-model="value7" controls-position="both" placeholder="两侧控制" />
    <div>
      <c-input-number v-model="value7" size="lg" controls-position="right" placeholder="右侧控制" />

      <c-input-number v-model="value7" controls-position="right" placeholder="右侧控制" />

      <c-input-number v-model="value7" size="sm" controls-position="right" placeholder="右侧控制" />
    </div>
    <c-input-number v-model="value7" :controls="false" placeholder="无控制按钮" />
  </div>
</template>
```

:::

## 允许空值

使用 `allow-empty` 属性允许输入框为空。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value8 = ref(undefined)

    return {
      value8
    }
  }
})
</script>

<template>
  <div class="input-number-demo">
    <c-input-number v-model="value8" allow-empty placeholder="允许空值" />
    <p>当前值：{{ value8 }}</p>
  </div>
</template>
```

:::

## InputNumber参数

| 参数              | 类型                   | 默认值      | 说明                   |
| ----------------- | ---------------------- | ----------- | ---------------------- |
| v-model           | `number \| undefined`  | `undefined` | 绑定值                 |
| step              | `number`               | `1`         | 计数器步长             |
| placeholder       | `string`               | `''`        | 输入框占位文本         |
| max               | `number`               | `Infinity`  | 设置计数器允许的最大值 |
| min               | `number`               | `-Infinity` | 设置计数器允许的最小值 |
| disabled          | `boolean`              | `false`     | 是否禁用计数器         |
| readonly          | `boolean`              | `false`     | 是否只读               |
| precision         | `number`               | `undefined` | 数值精度               |
| size              | `'lg' \| 'md' \| 'sm'` | `'md'`      | 计数器尺寸             |
| controls          | `boolean`              | `true`      | 是否显示控制按钮       |
| controls-position | `'both' \| 'right'`    | `'both'`    | 控制按钮位置           |
| allow-empty       | `boolean`              | `false`     | 是否允许空值           |
| show-glow-style   | `boolean`              | `true`      | 是否显示悬浮发光效果   |
| reg               | `RegExp \| string`     | `undefined` | 输入限制的正则表达式   |

## InputNumber事件

| 事件名 | 回调参数                                                         | 说明                    |
| ------ | ---------------------------------------------------------------- | ----------------------- |
| change | `(currentVal: number \| undefined, oldVal: number \| undefined)` | 绑定值被改变时触发      |
| blur   | `(event: Event)`                                                 | 在 Input 失去焦点时触发 |
| focus  | `(event: Event)`                                                 | 在 Input 获得焦点时触发 |
| input  | `(currentValue: number \| undefined)`                            | 在 Input 值改变时触发   |

## InputNumber方法

| 方法名 | 说明                | 参数 |
| ------ | ------------------- | ---- |
| focus  | 使 input 获取焦点   | -    |
| blur   | 使 input 失去焦点   | -    |
| select | 选中 input 中的文字 | -    |
