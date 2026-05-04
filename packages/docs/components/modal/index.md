# Modal 对话框

模态对话框。

## 基本使用

:::demo

```vue
<script>
import { ref } from 'vue'
export default {
  setup() {
    const visible = ref(false)
    return { visible }
  },
}
</script>

<template>
  <c-button type="primary" @click="visible = true">打开 Modal</c-button>
  <c-modal v-model:visible="visible" title="基本对话框">
    <p>这是一个对话框的内容。</p>
    <p>支持任意 vue 内容。</p>
  </c-modal>
</template>
```

:::

## 自定义按钮文字

:::demo

```vue
<script>
import { ref } from 'vue'
export default {
  setup() {
    const v = ref(false)
    return { v }
  },
}
</script>

<template>
  <c-button @click="v = true">打开</c-button>
  <c-modal v-model:visible="v" title="自定义" ok-text="保存" cancel-text="放弃"> 自定义按钮文字 </c-modal>
</template>
```

:::
