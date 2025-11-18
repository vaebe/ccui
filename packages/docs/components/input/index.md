# Input 输入框

通过鼠标或键盘输入字符，可以设置输入框的类型、大小和状态。

## 何时使用

- 需要用户输入文本内容时。
- 需要收集用户的简短信息时。
- 需要搜索、过滤或表单输入时。

## 基本使用

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value = ref('')
    return {
      value
    }
  }
})
</script>

<template>
  <div>
    <c-input v-model="value" placeholder="请输入内容" />
  </div>
</template>

<style>
</style>
```

:::

## 不同尺寸

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value1 = ref('')
    const value2 = ref('')
    const value3 = ref('')
    return {
      value1,
      value2,
      value3
    }
  }
})
</script>

<template>
  <div>
    <c-input v-model="value1" size="large" placeholder="大号输入框" class="mb-10" />
    <c-input v-model="value2" placeholder="默认输入框" class="mb-10" />
    <c-input v-model="value3" size="small" placeholder="小号输入框" />
  </div>
</template>

<style>
</style>
```

:::

## 禁用状态

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  }
})
</script>

<template>
  <div>
    <c-input placeholder="禁用状态" disabled />
  </div>
</template>

<style>
</style>
```

:::

## 只读状态

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value = ref('只读内容')
    return {
      value
    }
  }
})
</script>

<template>
  <div>
    <c-input v-model="value" readonly placeholder="只读状态" />
  </div>
</template>

<style>
</style>
```

:::

## 清空功能

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value = ref('可以清空的内容')
    return {
      value
    }
  }
})
</script>

<template>
  <div>
    <c-input v-model="value" clearable placeholder="可清空的输入框" />
  </div>
</template>

<style>
</style>
```

:::

## 密码输入

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value = ref('')
    return {
      value
    }
  }
})
</script>

<template>
  <div>
    <c-input v-model="value" type="password" placeholder="密码输入框" class="mb-10" />
    <c-input v-model="value" type="password" show-password placeholder="可切换密码可见性" />
  </div>
</template>

<style>
</style>
```

:::

## 前置/后置内容

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value = ref('')
    return {
      value
    }
  }
})
</script>

<template>
  <div>
    <c-input v-model="value" prepend="http://" placeholder="请输入网址" class="mb-10" />
    <c-input v-model="value" append=".com" placeholder="请输入域名" class="mb-10" />
    <c-input v-model="value" prepend="https://" append=".org" placeholder="请输入网址" />
  </div>
</template>

<style>
</style>
```

:::

## Input参数

| 参数          | 类型                    | 默认    | 说明                       |
| ------------- | ----------------------- | ------- | -------------------------- |
| type          | [InputType](#inputtype) | text    | 输入框类型                 |
| size          | [InputSize](#inputsize) | default | 输入框尺寸                 |
| placeholder   | string                  | --      | 占位符                     |
| disabled      | boolean                 | false   | 是否为禁用状态             |
| readonly      | boolean                 | false   | 是否为只读状态             |
| clearable     | boolean                 | false   | 是否显示清空图标           |
| show-password | boolean                 | false   | 密码输入时是否可切换可见性 |
| prepend       | string                  | --      | 前置内容文本               |
| append        | string                  | --      | 后置内容文本               |
| value         | string                  | --      | 绑定值                     |

## Input类型定义

### InputType

```ts
export type InputType = 'text' | 'password'
```

### InputSize

```ts
export type InputSize = 'large' | 'default' | 'small'
```

## Input事件

| 事件名 | 参数  | 说明                             |
| ------ | ----- | -------------------------------- |
| update | value | 绑定值改变时触发（v-model 事件） |
| input  | value | 输入框值改变时触发               |
| change | value | 输入框值改变并失去焦点时触发     |
| focus  | event | 输入框获得焦点时触发             |
| blur   | event | 输入框失去焦点时触发             |
| clear  | --    | 点击清空图标时触发               |

## Input插槽

| 插槽名  | 说明     |
| ------- | -------- |
| prepend | 前置内容 |
| append  | 后置内容 |
| prefix  | 前缀图标 |
| suffix  | 后缀图标 |
