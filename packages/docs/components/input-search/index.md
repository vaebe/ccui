# InputSearch 搜索框

带搜索按钮的输入框，作为独立顶层组件存在（不挂在 Input 命名空间下）。

## 何时使用

- 需要带搜索按钮的输入场景，配合 `@search` 事件触发查询。
- 需要在按钮内显示加载状态（`loading`）。
- 需要自定义按钮文字或完全自定义按钮内容（`enter-button` slot）。

## 基本使用

`enterButton=false`（默认）时右侧仅显示放大镜图标，点击放大镜或按 Enter 触发 `@search`。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value = ref('')
    const onSearch = (val) => {
      console.log('search:', val)
    }
    return { value, onSearch }
  },
})
</script>

<template>
  <c-input-search v-model="value" placeholder="输入关键字后按 Enter" @search="onSearch" />
</template>
```

:::

## 带搜索按钮

`enterButton=true` 显示放大镜按钮；`enterButton="搜索"` 显示文字按钮。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    return {
      v1: ref(''),
      v2: ref(''),
    }
  },
})
</script>

<template>
  <c-input-search v-model="v1" :enter-button="true" placeholder="enterButton=true" />
  <c-input-search v-model="v2" enter-button="搜索" placeholder="enterButton='搜索'" style="margin-top: 12px" />
</template>
```

:::

## 加载状态

`loading=true` 时按钮内的放大镜替换为旋转 loading 图标，按钮 disabled 且不触发 `@search`。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    return {
      value: ref(''),
    }
  },
})
</script>

<template>
  <c-input-search :loading="true" :enter-button="true" placeholder="loading" />
  <c-input-search :loading="true" placeholder="loading 无按钮态" style="margin-top: 12px" />
</template>
```

:::

## 自定义按钮内容

`enter-button` slot 完全自定义按钮内容（优先级高于 prop）。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    return { value: ref('') }
  },
})
</script>

<template>
  <c-input-search v-model="value" placeholder="自定义按钮内容">
    <template #enter-button>
      <span>🔍 立即搜</span>
    </template>
  </c-input-search>
</template>
```

:::

## 清除按钮 + 搜索

`allowClear` 开启后，清除会同时 emit `@search('')`。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value = ref('内容')
    return { value }
  },
})
</script>

<template>
  <c-input-search v-model="value" allow-clear enter-button="搜索" />
</template>
```

:::

## InputSearch 参数

| 参数         | 类型                                       | 默认    | 说明                                                                               |
| ------------ | ------------------------------------------ | ------- | ---------------------------------------------------------------------------------- |
| modelValue   | string                                     | --      | 绑定值（v-model）                                                                  |
| defaultValue | string                                     | --      | 非受控初值                                                                         |
| placeholder  | string                                     | --      | 占位符                                                                             |
| enterButton  | boolean \| string \| VNode                 | false   | 搜索按钮：false 仅 suffix 放大镜；true 默认图标按钮；string 文字按钮；VNode 自定义 |
| loading      | boolean                                    | false   | 搜索中状态，按钮变 disabled                                                        |
| size         | 'large' \| 'default' \| 'small'            | default | 尺寸                                                                               |
| disabled     | boolean                                    | false   | 整体禁用                                                                           |
| readonly     | boolean                                    | false   | 只读                                                                               |
| allowClear   | boolean \| { clearIcon?: VNode \| string } | false   | 清除按钮，清除时同步 emit @search('')                                              |
| maxLength    | number                                     | --      | 最大长度                                                                           |
| status       | '' \| 'error' \| 'warning'                 | ''      | 校验状态                                                                           |

## InputSearch 事件

| 事件名            | 参数            | 说明                                                                                    |
| ----------------- | --------------- | --------------------------------------------------------------------------------------- |
| search            | (value, event?) | 点击 enterButton / 点击 suffix 放大镜 / Enter / clear 都触发；disabled/loading 时不触发 |
| press-enter       | event           | Enter 时触发（与 search 共存）                                                          |
| update:modelValue | value           | v-model                                                                                 |
| input             | value           | 输入时触发                                                                              |
| change            | value           | 失焦时触发                                                                              |
| focus             | event           | 获得焦点                                                                                |
| blur              | event           | 失去焦点                                                                                |
| clear             | --              | 点击清除按钮                                                                            |

## InputSearch 插槽

| 插槽名       | 说明                                       |
| ------------ | ------------------------------------------ |
| enter-button | 完全自定义按钮内容，优先级高于 enterButton |
| prefix       | 输入框左侧前缀                             |
| suffix       | 输入框右侧后缀（与放大镜共存）             |
