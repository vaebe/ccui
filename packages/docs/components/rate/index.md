# Rate 评分

等级评估。

## 何时使用

- 收集用户对某个对象的「满意度 / 喜爱度」反馈。
- 展示外部聚合评分（只读模式）。

## 基本使用

`v-model` 双向绑定数值（0 ~ `count`）；默认 5 颗星。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const value = ref(3)
</script>

<template>
  <c-rate v-model="value" />
  <span style="margin-inline-start: 12px; color: #666">当前：{{ value }} 星</span>
</template>
```

:::

## 只读模式

`read-only` 用于「展示」场景，无法交互。常见于商品列表、评论汇总。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const value = ref(3.5)
</script>

<template>
  <c-rate v-model="value" :read-only="true" :allow-half="true" />
  <span style="margin-inline-start: 12px; color: #666">{{ value }} 分</span>
</template>
```

:::

## 半选

`allow-half` 允许半颗星选中（0.5 步长），常用于精确评分。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const value = ref(2.5)
</script>

<template>
  <c-rate v-model="value" :allow-half="true" />
  <span style="margin-inline-start: 12px; color: #666">{{ value }}</span>
</template>
```

:::

## 自定义星数

`count` 改变总等级数，常见于「10 分制」打分。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const v5 = ref(3)
const v7 = ref(5)
const v10 = ref(8)
</script>

<template>
  <div style="margin-bottom: 12px">
    <c-rate v-model="v5" :count="5" />
    <span style="margin-inline-start: 12px; color: #666">5 分制：{{ v5 }}</span>
  </div>
  <div style="margin-bottom: 12px">
    <c-rate v-model="v7" :count="7" />
    <span style="margin-inline-start: 12px; color: #666">7 分制：{{ v7 }}</span>
  </div>
  <div>
    <c-rate v-model="v10" :count="10" />
    <span style="margin-inline-start: 12px; color: #666">10 分制：{{ v10 }}</span>
  </div>
</template>
```

:::

## 自定义颜色

`color` 字符串接 CSS 颜色值；可用主题预设关键字（blue / red / orange）或自定义十六进制。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const v1 = ref(4)
const v2 = ref(3)
const v3 = ref(5)
const v4 = ref(2)
</script>

<template>
  <div style="margin-bottom: 12px">
    <c-rate v-model="v1" color="#fadb14" />
    <span style="margin-inline-start: 12px; color: #666">金色（默认风）</span>
  </div>
  <div style="margin-bottom: 12px">
    <c-rate v-model="v2" color="#fa541c" />
    <span style="margin-inline-start: 12px; color: #666">橙红</span>
  </div>
  <div style="margin-bottom: 12px">
    <c-rate v-model="v3" color="#52c41a" />
    <span style="margin-inline-start: 12px; color: #666">绿（好评向）</span>
  </div>
  <div>
    <c-rate v-model="v4" color="#722ed1" />
    <span style="margin-inline-start: 12px; color: #666">紫（品牌向）</span>
  </div>
</template>
```

:::

## 自定义图标

`default` slot 接一个字符或 SVG 元素替换星星。常见用于「心形」「点赞」「字母评分」。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const heart = ref(3)
const letter = ref(2)
</script>

<template>
  <div style="margin-bottom: 12px">
    <c-rate v-model="heart" color="#eb2f96">❤</c-rate>
    <span style="margin-inline-start: 12px; color: #666">心形评分</span>
  </div>
  <div>
    <c-rate v-model="letter" color="#1677ff" :count="5">A</c-rate>
    <span style="margin-inline-start: 12px; color: #666">字母分级</span>
  </div>
</template>
```

:::

## 评分描述（info slot）

`info` slot 接收作用域 `info`（当前选中值），可显示「差 / 一般 / 好 / 很好 / 极好」文案。

:::demo

```vue
<script setup>
import { ref, computed } from 'vue'
const value = ref(3)
const desc = ['极差', '差', '一般', '好', '极好']
const text = computed(() => (value.value > 0 ? desc[value.value - 1] : '请评分'))
</script>

<template>
  <c-rate v-model="value">
    <template #info="info">
      <span style="margin-inline-start: 12px; color: #999">{{ info }} / 5</span>
    </template>
  </c-rate>
  <div style="margin-top: 8px; font-size: 13px; color: #666">{{ text }}</div>
</template>
```

:::

## change 事件

`@change` 在评分改变时触发，回调参数为新值；用于联动日志、表单校验等。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const value = ref(0)
const log = ref([])

function onChange(v) {
  log.value.unshift(`${new Date().toLocaleTimeString()}  改为 ${v} 星`)
  if (log.value.length > 5) log.value.length = 5
}
</script>

<template>
  <c-rate v-model="value" @change="onChange" />
  <ul style="margin-top: 8px; color: #666; font-size: 12px">
    <li v-for="l in log" :key="l">{{ l }}</li>
  </ul>
</template>
```

:::

## 清零按钮

配合外部按钮把绑定值重置为 0；典型「重新评分」交互。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const value = ref(4)
</script>

<template>
  <c-rate v-model="value" :allow-half="true" />
  <c-button style="margin-inline-start: 12px" @click="value = 0">清零</c-button>
  <c-button style="margin-inline-start: 8px" type="primary" @click="value = 5">满分</c-button>
</template>
```

:::

## 在表单中使用

评分通常作为表单字段；与 `<c-form>` 协议无差异。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const form = ref({ score: 0, comment: '' })

function submit() {
  alert(`评分：${form.value.score}，评论：${form.value.comment}`)
}
</script>

<template>
  <c-form :model="form" label-width="80px" style="max-width: 480px">
    <c-form-item label="评分" name="score">
      <c-rate v-model="form.score" :allow-half="true" />
    </c-form-item>
    <c-form-item label="评论" name="comment">
      <c-input v-model="form.comment" placeholder="说点什么吧（可选）" />
    </c-form-item>
    <c-form-item>
      <c-button type="primary" :disabled="form.score === 0" @click="submit">提交</c-button>
    </c-form-item>
  </c-form>
</template>
```

:::

## 只读 + 聚合分数（商品页常见）

多条评分汇总展示，配合主图标说明评分含义。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const overall = ref(4.5)
const desc = ref(4)
const speed = ref(5)
const service = ref(4.5)
</script>

<template>
  <div style="display: grid; gap: 8px; max-width: 360px">
    <div style="display: flex; align-items: center">
      <span style="width: 80px; color: #666">综合：</span>
      <c-rate v-model="overall" :read-only="true" :allow-half="true" />
      <span style="margin-inline-start: 12px; color: #faad14; font-weight: 600">{{ overall }}</span>
    </div>
    <div style="display: flex; align-items: center">
      <span style="width: 80px; color: #666">描述：</span>
      <c-rate v-model="desc" :read-only="true" />
      <span style="margin-inline-start: 12px; color: #faad14">{{ desc }}</span>
    </div>
    <div style="display: flex; align-items: center">
      <span style="width: 80px; color: #666">物流：</span>
      <c-rate v-model="speed" :read-only="true" />
      <span style="margin-inline-start: 12px; color: #faad14">{{ speed }}</span>
    </div>
    <div style="display: flex; align-items: center">
      <span style="width: 80px; color: #666">服务：</span>
      <c-rate v-model="service" :read-only="true" :allow-half="true" />
      <span style="margin-inline-start: 12px; color: #faad14">{{ service }}</span>
    </div>
  </div>
</template>
```

:::

## API

### Props

| 参数        | 类型      | 默认值  | 说明                                       |
| ----------- | --------- | ------- | ------------------------------------------ |
| v-model     | `number`  | `0`     | 评分绑定的值                               |
| read-only   | `boolean` | `false` | 只读模式，无法交互                         |
| count       | `number`  | `5`     | 总等级数                                   |
| color       | `string`  | —       | 选中颜色（CSS 颜色字符串）                 |
| allow-half  | `boolean` | `false` | 是否允许半选（0.5 步长）                   |

### 事件

| 事件   | 回调参数             | 说明                 |
| ------ | -------------------- | -------------------- |
| change | `(value: number)`    | 分值改变时触发       |

### 插槽

| 插槽    | 作用域       | 说明                                                |
| ------- | ------------ | --------------------------------------------------- |
| default | —            | 替代默认星形 icon（接受字符串 / SVG / 单字符等）    |
| info    | `value`      | 评分右侧自定义描述区域，作用域为当前选中值          |
