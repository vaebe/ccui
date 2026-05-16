# InputOtp 一次性密码

分格的一次性密码 / 验证码输入框，作为独立顶层组件存在（不挂在 Input 命名空间下）。

## 何时使用

- 短信验证码 / 邮箱验证码输入。
- 一次性 PIN 码 / 安全码输入。
- 需要自动焦点流转 + 粘贴填充体验。

## 基本使用

默认 6 个 cell，每个 cell 输入一个字符后焦点自动跳到下一格。Backspace 退格、ArrowLeft / ArrowRight 跨格、粘贴会逐格填入。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value = ref('')
    const onChange = (val, info) => {
      console.log('change:', val, 'trigger index:', info.index)
    }
    return { value, onChange }
  },
})
</script>

<template>
  <c-input-otp v-model="value" @change="onChange" />
</template>
```

:::

## 自定义长度

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
  <c-input-otp v-model="v1" :length="4" />
  <c-input-otp v-model="v2" :length="8" style="margin-top: 12px" />
</template>
```

:::

## 字符遮罩

`mask=true` 用 `•` 显示，`mask="#"` 用自定义字符。emit 的 modelValue 始终是真实字符。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const value = ref('1234')
    return { value }
  },
})
</script>

<template>
  <c-input-otp v-model="value" :length="4" :mask="true" />
  <c-input-otp v-model="value" :length="4" mask="#" style="margin-top: 12px" />
</template>
```

:::

## 格式化输入

`formatter` 在每个字符写入前调用，常用于强制大写 / 限制只能数字。

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const v1 = ref('')
    const v2 = ref('')
    const upper = (v) => v.toUpperCase()
    const digit = (v) => (/^[0-9]$/.test(v) ? v : '')
    return { v1, v2, upper, digit }
  },
})
</script>

<template>
  <c-input-otp v-model="v1" :length="6" :formatter="upper" />
  <c-input-otp v-model="v2" :length="6" :formatter="digit" style="margin-top: 12px" />
</template>
```

:::

## 校验状态

:::demo

```vue
<template>
  <c-input-otp status="error" :length="6" />
  <c-input-otp status="warning" :length="6" style="margin-top: 12px" />
</template>
```

:::

## 不同尺寸

:::demo

```vue
<template>
  <c-input-otp size="large" :length="4" />
  <c-input-otp :length="4" style="margin-top: 12px" />
  <c-input-otp size="small" :length="4" style="margin-top: 12px" />
</template>
```

:::

## InputOtp 参数

| 参数         | 类型                            | 默认    | 说明                                         |
| ------------ | ------------------------------- | ------- | -------------------------------------------- |
| modelValue   | string                          | ''      | 完整字符串（长度 ≤ length），v-model         |
| defaultValue | string                          | --      | 非受控初值                                   |
| length       | number                          | 6       | 单元格数量                                   |
| mask         | boolean \| string               | false   | true 用 `•`；string 用任意单字符；仅影响显示 |
| formatter    | (v: string) => string           | --      | 单字符变换器，写入 cell 前调用               |
| autoFocus    | boolean                         | false   | 挂载时聚焦首格                               |
| disabled     | boolean                         | false   | 整体禁用                                     |
| size         | 'large' \| 'default' \| 'small' | default | 尺寸                                         |
| status       | '' \| 'error' \| 'warning'      | ''      | 校验状态                                     |

## InputOtp 事件

| 事件名            | 参数               | 说明                                     |
| ----------------- | ------------------ | ---------------------------------------- |
| update:modelValue | value              | v-model                                  |
| change            | (value, { index }) | 任意格内容变化时触发，index 是触发格序号 |
| focus             | event              | 任一 cell 获得焦点                       |
| blur              | event              | 任一 cell 失去焦点                       |

## 行为说明

- **自动焦点流转**：在一格输入字符后焦点自动跳到下一格；一次输入多字符（IME / 安卓 / 粘贴）会逐格填入。
- **Backspace**：当前格有值 → 清掉；当前格为空且不在首格 → 回到上一格并清掉。
- **ArrowLeft / ArrowRight**：显式跨格焦点。
- **`autocomplete="one-time-code"`**：首格设置该属性，配合 iOS / Android 系统自动填充短信验证码。
- **`inputmode="numeric"`**：移动端默认弹出数字键盘。
