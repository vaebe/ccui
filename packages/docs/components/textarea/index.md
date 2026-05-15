# Textarea 多行文本

多行文本输入框，对标 Ant Design `Input.TextArea`，作为独立顶层组件存在（不挂在 Input 命名空间下）。

## 何时使用

- 需要多行长文本输入时。
- 需要根据内容自动调整高度（`autoSize`）。
- 需要显示字符计数 / 限制最大长度（`showCount` / `maxLength`）。

## 基本使用

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value = ref('')
    return { value }
  },
})
</script>

<template>
  <c-textarea v-model="value" placeholder="请输入" :rows="3" />
</template>
```

:::

## 自动调整高度

`autoSize` 支持 `boolean | { minRows, maxRows }` 三种形态：

- `false`（默认）：固定 `rows`。
- `true`：高度跟随内容，无上限。
- 对象：限制最小 / 最大行数。

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
  <c-textarea v-model="v1" :auto-size="true" placeholder="autoSize=true 跟随内容" />
  <c-textarea
    v-model="v2"
    :auto-size="{ minRows: 2, maxRows: 6 }"
    placeholder="autoSize={ minRows:2, maxRows:6 }"
    style="margin-top: 12px"
  />
</template>
```

:::

## 字符计数

`showCount` 支持 `boolean | { formatter }`，与 `maxLength` 配合显示 `N / max`。

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
  <c-textarea v-model="v1" :show-count="true" :max-length="100" placeholder="默认 N / max" />
  <c-textarea
    v-model="v2"
    :show-count="{ formatter: ({ count, maxLength }) => `${count} 字 / ${maxLength}` }"
    :max-length="50"
    placeholder="自定义 formatter"
    style="margin-top: 12px"
  />
</template>
```

:::

## 清除按钮

`allowClear` 支持 `boolean | { clearIcon }`，`clearIcon` 接 Iconify name 或 VNode。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    return {
      v1: ref('可以清除'),
      v2: ref('Iconify 图标'),
    }
  },
})
</script>

<template>
  <c-textarea v-model="v1" allow-clear placeholder="默认清除按钮" />
  <c-textarea
    v-model="v2"
    :allow-clear="{ clearIcon: 'mdi:close-circle' }"
    placeholder="自定义 Iconify 图标"
    style="margin-top: 12px"
  />
</template>
```

:::

## 校验状态

:::demo

```vue
<template>
  <c-textarea status="error" placeholder="error 态" />
  <c-textarea status="warning" placeholder="warning 态" style="margin-top: 12px" />
</template>
```

:::

## Variants

Ant Design v5.13+ 录入组件统一 `variant` 形态。四档：`outlined`（默认）/ `filled` / `borderless` / `underlined`。

:::demo

```vue
<template>
  <div style="margin-bottom: 12px">
    <c-segmented v-model="variant" :options="['outlined', 'filled', 'borderless', 'underlined']" />
  </div>
  <c-textarea v-model="value" :variant="variant" :rows="3" placeholder="切换 variant 观察样式" />
</template>

<script setup>
import { ref } from 'vue'
const variant = ref('outlined')
const value = ref('')
</script>
```

:::

## Textarea 参数

| 参数         | 类型                                            | 默认     | 说明                                              |
| ------------ | ----------------------------------------------- | -------- | ------------------------------------------------- |
| modelValue   | string                                          | --       | 绑定值（v-model）                                 |
| defaultValue | string                                          | --       | 非受控初值，仅首次挂载使用                        |
| placeholder  | string                                          | --       | 占位符                                            |
| rows         | number                                          | 2        | 原生 rows，autoSize 开启时忽略                    |
| autoSize     | boolean \| { minRows?: number; maxRows?: number } | false    | 高度自适应                                        |
| allowClear   | boolean \| { clearIcon?: VNode \| string }      | false    | 是否显示清除按钮                                  |
| showCount    | boolean \| { formatter?: (info) => string }     | false    | 显示字符计数                                      |
| maxLength    | number                                          | --       | 最大长度（透传原生 maxlength）                    |
| size         | 'large' \| 'default' \| 'small'                 | default  | 尺寸                                              |
| disabled     | boolean                                         | false    | 是否禁用                                          |
| readonly     | boolean                                         | false    | 是否只读                                          |
| status       | '' \| 'error' \| 'warning'                      | ''       | 校验状态，Form 联动会自动透传                     |
| resize       | 'none' \| 'both' \| 'horizontal' \| 'vertical'  | vertical | 原生 textarea CSS resize，autoSize=true 时强制 none |

## Textarea 事件

| 事件名            | 参数           | 说明                                |
| ----------------- | -------------- | ----------------------------------- |
| update:modelValue | value          | 绑定值改变时触发（v-model）         |
| input             | value          | 输入时触发                          |
| change            | value          | 失焦时触发                          |
| focus             | event          | 获得焦点                            |
| blur              | event          | 失去焦点                            |
| clear             | --             | 点击清除按钮时触发                  |
| press-enter       | event          | Enter（不含 Shift/Ctrl/Alt/Meta）   |
| resize            | { height }     | autoSize 引起的高度变化             |

## Textarea 插槽

| 插槽名 | 说明                       |
| ------ | -------------------------- |
| suffix | 文本框下方的附加内容       |
