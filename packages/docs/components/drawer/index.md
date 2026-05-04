# Drawer 抽屉

侧边滑出的浮层。

## 基本使用

:::demo

```vue
<script>
import { ref } from 'vue'
export default {
  setup() {
    const visible = ref(false)
    return { visible }
  }
}
</script>

<template>
  <c-button type="primary" @click="visible = true">打开右侧抽屉</c-button>
  <c-drawer v-model:visible="visible" title="右侧抽屉">
    <p>抽屉内容</p>
  </c-drawer>
</template>
```

:::

## 四个方向

:::demo

```vue
<script>
import { ref } from 'vue'
export default {
  setup() {
    const top = ref(false)
    const bottom = ref(false)
    const left = ref(false)
    const right = ref(false)
    return { top, bottom, left, right }
  }
}
</script>

<template>
  <c-button @click="top = true">上</c-button>
  <c-button @click="bottom = true">下</c-button>
  <c-button @click="left = true">左</c-button>
  <c-button @click="right = true">右</c-button>
  <c-drawer v-model:visible="top" placement="top" title="顶部">顶部抽屉</c-drawer>
  <c-drawer v-model:visible="bottom" placement="bottom" title="底部">底部抽屉</c-drawer>
  <c-drawer v-model:visible="left" placement="left" title="左侧">左侧抽屉</c-drawer>
  <c-drawer v-model:visible="right" placement="right" title="右侧">右侧抽屉</c-drawer>
</template>
```

:::
