# InputNumber 数字输入框

数字输入框组件，用于输入数字类型的数据。

## 何时使用

当需要获取标准数值时。

## 基本使用

基础的数字输入框用法。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const value = ref(0)
</script>

<template>
  <c-input-number v-model="value" placeholder="请输入数字" />
  <p>当前值：{{ value }}</p>
</template>
```

:::

## 禁用状态

通过 `disabled` 属性指定是否禁用 input 组件。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const value = ref(10)
</script>

<template>
  <c-input-number v-model="value" disabled />
</template>
```

:::

## 只读状态

`readonly` 让数值不可编辑但仍可读出 / focus，常用于「计算结果展示但允许 copy」的场景。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const value = ref(99.5)
</script>

<template>
  <c-input-number v-model="value" readonly />
  <p style="color: var(--ccui-color-text-secondary)">值由后端计算得出，仅供展示</p>
</template>
```

:::

## 数值范围

使用 `min` 和 `max` 属性限制数值范围。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const value = ref(1)
</script>

<template>
  <c-input-number v-model="value" :min="1" :max="10" />
  <p>范围：1 - 10</p>
</template>
```

:::

## 步数

使用 `step` 属性设置步长。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const value = ref(0)
</script>

<template>
  <c-input-number v-model="value" :step="2" />
  <p>步长：2</p>
</template>
```

:::

## 精度

使用 `precision` 属性设置数值精度。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const value = ref(1.0)
</script>

<template>
  <c-input-number v-model="value" :precision="2" :step="0.1" />
  <p>精度：2 位小数</p>
</template>
```

:::

## 尺寸

支持 `large` / `default` / `small` 三档，与库内其他录入组件（Input / Select 等）统一。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const value = ref(0)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <c-input-number v-model="value" size="large" placeholder="large（大）" />
    <c-input-number v-model="value" placeholder="default（默认）" />
    <c-input-number v-model="value" size="small" placeholder="small（小）" />
  </div>
</template>
```

:::

## 控制按钮位置

使用 `controls-position` 属性设置控制按钮位置。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const value = ref(0)
</script>

<template>
  <div>
    <p style="margin-top: 0">两侧控制</p>
    <c-input-number v-model="value" controls-position="both" placeholder="两侧控制" />

    <p>右侧控制</p>
    <div style="display: flex; gap: 12px">
      <c-input-number v-model="value" size="large" controls-position="right" placeholder="右侧控制" />
      <c-input-number v-model="value" controls-position="right" placeholder="右侧控制" />
      <c-input-number v-model="value" size="small" controls-position="right" placeholder="右侧控制" />
    </div>

    <p>无控制按钮</p>
    <c-input-number v-model="value" :controls="false" placeholder="无控制按钮" />
  </div>
</template>
```

:::

## 允许空值

使用 `allow-empty` 属性允许输入框为空。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const value = ref(undefined)
</script>

<template>
  <c-input-number v-model="value" allow-empty placeholder="允许空值" />
  <p>当前值：{{ value === undefined ? '（空）' : value }}</p>
</template>
```

:::

## 监听 change 事件

`change` 返回当前值与变更前的旧值两个参数，方便埋点 / 撤销栈等场景。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const value = ref(0)
const logs = ref([])

function onChange(curr, prev) {
  logs.value.unshift({ curr, prev, at: new Date().toLocaleTimeString() })
  if (logs.value.length > 5) logs.value.length = 5
}
</script>

<template>
  <c-input-number v-model="value" @change="onChange" />
  <p style="margin-top: 8px; color: var(--ccui-color-text-secondary)">最近 5 次变更：</p>
  <ul style="margin: 4px 0; padding-left: 20px; color: var(--ccui-color-text-secondary)">
    <li v-for="(log, i) in logs" :key="i">[{{ log.at }}] {{ log.prev }} → {{ log.curr }}</li>
  </ul>
</template>
```

:::

## 实例方法（ref）

通过 ref 拿到组件实例后可调用 `focus` / `blur` / `increase` / `decrease` / `getValue` / `setValue` 6 个方法，常用于配合外部按钮操控。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const value = ref(5)
const inputRef = ref(null)

function inc() {
  inputRef.value?.increase()
}
function dec() {
  inputRef.value?.decrease()
}
function focus() {
  inputRef.value?.focus()
}
function reset() {
  inputRef.value?.setValue(0)
}
</script>

<template>
  <c-input-number ref="inputRef" v-model="value" :step="1" :min="0" :max="10" />
  <div style="display: flex; gap: 8px; margin-top: 8px">
    <c-button @click="inc">+1</c-button>
    <c-button @click="dec">-1</c-button>
    <c-button @click="focus">聚焦</c-button>
    <c-button type="primary" @click="reset">重置</c-button>
  </div>
</template>
```

:::

## 货币输入场景

`precision=2` + `step=0.01` + `min=0` + `placeholder="¥ 0.00"` 是常见的金额输入组合。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const price = ref(0)
</script>

<template>
  <c-input-number v-model="price" :precision="2" :step="0.01" :min="0" placeholder="¥ 0.00" controls-position="right" />
  <p style="margin-top: 8px">应付金额：¥ {{ price.toFixed(2) }}</p>
</template>
```

:::

## 正则限制 reg

`reg` 接受 RegExp 或字符串，输入时不匹配的字符会被过滤；常用于「只允许正整数」「只允许非负数」之类的约束。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const intOnly = ref(0)
const positiveOnly = ref(0)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px; max-width: 280px">
    <div>
      <p style="margin: 0 0 4px; color: var(--ccui-color-text-secondary)">仅正整数（reg = /^\d+$/）</p>
      <c-input-number v-model="intOnly" :reg="/^\d+$/" :min="0" placeholder="只能输入整数" />
    </div>
    <div>
      <p style="margin: 0 0 4px; color: var(--ccui-color-text-secondary)">非负小数（reg = /^\d+(\.\d{0,2})?$/）</p>
      <c-input-number v-model="positiveOnly" :reg="/^\d+(\.\d{0,2})?$/" :min="0" :precision="2" placeholder="0.00" />
    </div>
  </div>
</template>
```

:::

## 关闭悬浮发光

`show-glow-style="false"` 关闭 hover / focus 时的发光描边，融入更克制的视觉风格。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const a = ref(10)
const b = ref(10)
</script>

<template>
  <div style="display: flex; gap: 16px">
    <div>
      <p style="margin: 0 0 4px; color: var(--ccui-color-text-secondary)">默认（发光）</p>
      <c-input-number v-model="a" />
    </div>
    <div>
      <p style="margin: 0 0 4px; color: var(--ccui-color-text-secondary)">关闭发光</p>
      <c-input-number v-model="b" :show-glow-style="false" />
    </div>
  </div>
</template>
```

:::

## Variants

录入组件统一 `variant` 形态。四档：`outlined`（默认）/ `filled` / `borderless` / `underlined`。

:::demo

```vue
<template>
  <div style="margin-bottom: 12px">
    <c-segmented v-model="variant" :options="['outlined', 'filled', 'borderless', 'underlined']" />
  </div>
  <c-input-number v-model="value" :variant="variant" />
</template>

<script setup>
import { ref } from 'vue'
const variant = ref('outlined')
const value = ref(10)
</script>
```

:::

## 校验状态 status

`status='error' | 'warning'` 控制边框 / focus 阴影色。Form 联动会自动透传 —— 放进 `<c-form-item>` 内校验失败时自动加 `--status-error` 类。change / blur 都会触发 FormItem 校验。

:::demo

```vue
<template>
  <div style="display: flex; gap: 12px">
    <c-input-number v-model="v1" status="error" />
    <c-input-number v-model="v2" status="warning" />
    <c-input-number v-model="v3" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const v1 = ref(0)
const v2 = ref(0)
const v3 = ref(0)
</script>
```

:::

## InputNumber参数

| 参数              | 类型                                                             | 默认值       | 说明                                                                                         |
| ----------------- | ---------------------------------------------------------------- | ------------ | -------------------------------------------------------------------------------------------- |
| v-model           | `number \| undefined`                                            | `undefined`  | 绑定值                                                                                       |
| step              | `number`                                                         | `1`          | 计数器步长                                                                                   |
| placeholder       | `string`                                                         | `''`         | 输入框占位文本                                                                               |
| max               | `number`                                                         | `Infinity`   | 设置计数器允许的最大值                                                                       |
| min               | `number`                                                         | `-Infinity`  | 设置计数器允许的最小值                                                                       |
| disabled          | `boolean`                                                        | `false`      | 是否禁用计数器                                                                               |
| readonly          | `boolean`                                                        | `false`      | 是否只读                                                                                     |
| precision         | `number`                                                         | `undefined`  | 数值精度                                                                                     |
| size              | `'large' \| 'default' \| 'small'`                                | `'default'`  | 输入框尺寸                                                                                   |
| controls          | `boolean`                                                        | `true`       | 是否显示控制按钮                                                                             |
| controls-position | `'both' \| 'right'`                                              | `'both'`     | 控制按钮位置                                                                                 |
| allow-empty       | `boolean`                                                        | `false`      | 是否允许空值                                                                                 |
| show-glow-style   | `boolean`                                                        | `true`       | 是否显示悬浮发光效果                                                                         |
| reg               | `RegExp \| string`                                               | `undefined`  | 输入限制的正则表达式，不匹配的字符会被过滤                                                   |
| variant           | `'outlined' \| 'filled' \| 'borderless' \| 'underlined'`         | `'outlined'` | 录入组件统一形态                                                                             |
| status            | `'' \| 'error' \| 'warning'`                                     | `''`         | 校验状态，Form 联动会自动透传                                                                |

## InputNumber事件

| 事件名 | 回调参数                                                         | 说明                    |
| ------ | ---------------------------------------------------------------- | ----------------------- |
| change | `(currentVal: number \| undefined, oldVal: number \| undefined)` | 绑定值被改变时触发      |
| blur   | `(event: FocusEvent)`                                            | 在 Input 失去焦点时触发 |
| focus  | `(event: FocusEvent)`                                            | 在 Input 获得焦点时触发 |
| input  | `(currentValue: number \| undefined)`                            | 在 Input 值改变时触发   |

## InputNumber方法

通过 ref 调用：

| 方法名   | 说明                          | 参数                  | 返回值                |
| -------- | ----------------------------- | --------------------- | --------------------- |
| focus    | 使 input 获取焦点             | —                     | `void`                |
| blur     | 使 input 失去焦点             | —                     | `void`                |
| increase | 按 `step` 增加一次            | —                     | `void`                |
| decrease | 按 `step` 减少一次            | —                     | `void`                |
| getValue | 获取当前值                    | —                     | `number \| undefined` |
| setValue | 设置值（受 min/max/精度约束） | `number \| undefined` | `void`                |
