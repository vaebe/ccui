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
      value,
    }
  },
})
</script>

<template>
  <div>
    <c-input v-model="value" placeholder="请输入内容" />
  </div>
</template>

<style></style>
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
      value3,
    }
  },
})
</script>

<template>
  <div>
    <c-input v-model="value1" size="large" placeholder="大号输入框" class="mb-10" />
    <c-input v-model="value2" placeholder="默认输入框" class="mb-10" />
    <c-input v-model="value3" size="small" placeholder="小号输入框" />
  </div>
</template>

<style></style>
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
  },
})
</script>

<template>
  <div>
    <c-input placeholder="禁用状态" disabled />
  </div>
</template>

<style></style>
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
      value,
    }
  },
})
</script>

<template>
  <div>
    <c-input v-model="value" readonly placeholder="只读状态" />
  </div>
</template>

<style></style>
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
      value,
    }
  },
})
</script>

<template>
  <div>
    <c-input v-model="value" clearable placeholder="可清空的输入框" />
  </div>
</template>

<style></style>
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
      value,
    }
  },
})
</script>

<template>
  <div>
    <c-input v-model="value" type="password" placeholder="密码输入框" class="mb-10" />
    <c-input v-model="value" type="password" show-password placeholder="可切换密码可见性" />
  </div>
</template>

<style></style>
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
      value,
    }
  },
})
</script>

<template>
  <div>
    <c-input v-model="value" prepend="http://" placeholder="请输入网址" class="mb-10" />
    <c-input v-model="value" append=".com" placeholder="请输入域名" class="mb-10" />
    <c-input v-model="value" prepend="https://" append=".org" placeholder="请输入网址" />
  </div>
</template>

<style></style>
```

:::

## Variants

Ant Design v5.13+ 录入组件统一 `variant` 形态。四档：`outlined`（默认）/ `filled`（无边框 + 填充背景）/ `borderless`（无边框无背景）/ `underlined`（仅底部边框）。

:::demo

```vue
<template>
  <div style="margin-bottom: 12px">
    <c-segmented v-model="variant" :options="['outlined', 'filled', 'borderless', 'underlined']" />
  </div>
  <c-input v-model="value" :variant="variant" placeholder="切换 variant 观察样式" style="width: 260px" />
</template>

<script setup>
import { ref } from 'vue'
const variant = ref('outlined')
const value = ref('')
</script>
```

:::

## 校验状态 status

`status='error' | 'warning'` 控制边框 / focus 阴影色。**Form 联动会自动透传**：放进 `<c-form-item>` 里且校验失败时，Input 自动加 `--status-error` 类，无需手写。显式 `status` 优先于 Form 注入。

:::demo

```vue
<template>
  <div style="display: flex; gap: 12px">
    <c-input v-model="v1" status="error" placeholder="error" style="width: 220px" />
    <c-input v-model="v2" status="warning" placeholder="warning" style="width: 220px" />
    <c-input v-model="v3" placeholder="normal" style="width: 220px" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const v1 = ref('')
const v2 = ref('')
const v3 = ref('')
</script>
```

:::

## Input参数

| 参数            | 类型                                          | 默认    | 说明                                                                                  |
| --------------- | --------------------------------------------- | ------- | ------------------------------------------------------------------------------------- |
| type            | [InputType](#inputtype)                       | text    | 输入框类型                                                                            |
| size            | [InputSize](#inputsize)                       | default | 输入框尺寸                                                                            |
| placeholder     | string                                        | --      | 占位符                                                                                |
| disabled        | boolean                                       | false   | 是否为禁用状态                                                                        |
| readonly        | boolean                                       | false   | 是否为只读状态                                                                        |
| modelValue      | string                                        | --      | 绑定值（v-model）                                                                     |
| defaultValue    | string                                        | --      | 非受控初值，仅首次挂载使用                                                            |
| allowClear      | boolean \| { clearIcon?: VNode \| string }    | --      | 是否显示清除按钮（Ant 主名，支持 Iconify name / VNode 自定义图标）                       |
| show-password   | boolean                                       | false   | 密码输入时是否可切换可见性                                                            |
| addonBefore     | string                                        | ''      | 前置 addon 文本（Ant 主名）                                                            |
| addonAfter      | string                                        | ''      | 后置 addon 文本（Ant 主名）                                                            |
| maxLength       | number                                        | --      | 最大长度（透传原生 `maxlength`）                                                      |
| showCount       | boolean \| { formatter?: (info) => string }   | false   | 显示字符计数，配合 `maxLength` 显示 `N / max`；formatter 接 `({ value, count, maxLength })` |
| status          | '' \| 'error' \| 'warning'                    | ''      | 校验状态，Form 联动会自动透传                                                          |
| clearable       | boolean                                       | false   | @deprecated 请改用 `allowClear`                                                       |
| prepend         | string                                        | --      | @deprecated 请改用 `addonBefore` 或 `addon-before` slot                                |
| append          | string                                        | --      | @deprecated 请改用 `addonAfter` 或 `addon-after` slot                                  |

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

| 事件名            | 参数            | 说明                                  |
| ----------------- | --------------- | ------------------------------------- |
| update:modelValue | value           | 绑定值改变时触发（v-model 事件）      |
| input             | value           | 输入框值改变时触发                    |
| change            | value           | 输入框值改变并失去焦点时触发          |
| focus             | event           | 输入框获得焦点时触发                  |
| blur              | event           | 输入框失去焦点时触发                  |
| clear             | --              | 点击清除图标时触发                    |
| press-enter       | KeyboardEvent   | Enter 键按下时触发（对齐 ant `onPressEnter`） |

## Input插槽

| 插槽名       | 说明                              |
| ------------ | --------------------------------- |
| addon-before | 前置 addon 内容（Ant 主名）         |
| addon-after  | 后置 addon 内容（Ant 主名）         |
| prefix       | 输入框内左侧前缀                  |
| suffix       | 输入框内右侧后缀                  |
| prepend      | @deprecated 同 `addon-before`     |
| append       | @deprecated 同 `addon-after`      |
