# Rate 评分

等级评估。

## 何时使用

用户对一个产品进行评分时可以使用。

## 只读模式

:::demo

```vue

<template>
  <c-rate v-model="value1" :read-only="true"/>
</template>
<script>
import {ref} from 'vue'

export default {
  setup() {
    const value1 = ref(3.5)
    return {
      value1,
    }
  },
}
</script>
```

:::

## 动态模式

:::demo

```vue

<template>
  <c-rate v-model="value" icon="star-o"/>
</template>
<script>
import {ref} from 'vue'

export default {
  setup() {
    const value = ref(2)
    return {
      value,
    }
  },
}
</script>
```

:::

## 动态模式-自定义

:::demo

```vue

<template>
  <c-rate color="#ffa500" v-model="value" :count="6">A</c-rate>
</template>
<script>
import {ref} from 'vue'

export default {
  setup() {
    const value = ref(3)
    return {
      value,
    }
  },
}
</script>
```

:::

## 半选模式

:::demo

```vue

<template>
  <c-rate v-model="value" :allow-half="true" @change="change">
    <template v-slot:info="info">
      {{info}}
    </template>
  </c-rate>
</template>
<script>
import {ref} from 'vue'

export default {
  setup() {
    const value = ref(2.5)
    const change = (val) => {
      console.log(val)
    }
    return {
      value,
      change,
    }
  },
}
</script>
```

:::

## 使用color参数

:::demo

```vue

<template>
  <div class="mb20">
    <c-rate
        v-model="value1"
        :read-only="true"
        color="blue"
        :count="5"
        icon="star"
    />
  </div>
  <div class="mb20">
    <c-rate
        v-model="value2"
        :read-only="true"
        color="orange"
        :count="5"
        icon="star"
    />
  </div>
  <div class="mb20">
    <c-rate v-model="value3" :read-only="true" color="red" :count="5"/>
  </div>
  <div>
    <c-rate v-model="value4" :read-only="true" color="#67c23a" :count="5">N</c-rate>
  </div>
</template>
<script>
import {ref} from 'vue'

export default {
  setup() {
    const value1 = ref(3.5)
    const value2 = ref(2)
    const value3 = ref(3)
    const value4 = ref(1)
    return {
      value1,
      value2,
      value3,
      value4,
    }
  },
}
</script>
<style scoped>
.mb20 {
  margin-bottom: 20px;
}
</style>
```

:::

### Rate参数

|   参数    |              类型               | 默认值 | 描述                                                     |
| :-------: | :-----------------------------: | :----: | :------------------------------------------------------- |
|   v-model   | `number` | 0  | 必选，评分绑定的值             |
|   read-only | `boolean` | false  | 可选，设置是否为只读模式，只读模式无法交互               |
|   count   |  `number` |   5    | 可选，设置总等级数                                       |
|   color   | `string` |   --   | 可选，星星选中颜色                                           |
| allow-half | `boolean` | false  | 可选，动态模式下是否允许半选                             |

## Rate事件

| 参数   | 类型 | 说明           | 回调参数     |
| ------ |---| -------------- | ------------ |
| change | `(value: number) => void`  | 分值改变时触发 | 改变后的分值 |

## Rate类型定义

### OnTouchedType

```ts
export type OnTouchedType = () => void;

```

## Rate插槽

| 插槽名 | 说明 |
| ---- | ---- |
| default | 支持传入一个文本字符或svg图标（可以被color、fill改变颜色的）|
| info | 返回当前选中的值 可用于自定义评分描述|
