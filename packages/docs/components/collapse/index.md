# Collapse 折叠面板

可折叠/展开的内容区域。

## 基本使用

:::demo

```vue
<script>
import { ref } from 'vue'
export default {
  setup() {
    const value = ref(['1'])
    return { value }
  }
}
</script>

<template>
  <c-collapse v-model="value">
    <c-collapse-item name="1" title="面板一">
      默认展开的内容。
    </c-collapse-item>
    <c-collapse-item name="2" title="面板二">
      点击展开。
    </c-collapse-item>
    <c-collapse-item name="3" title="面板三（禁用）" disabled>
      无法展开。
    </c-collapse-item>
  </c-collapse>
</template>
```

:::

## 手风琴模式

:::demo

```vue
<script>
import { ref } from 'vue'
export default {
  setup() {
    const v = ref('a')
    return { v }
  }
}
</script>

<template>
  <c-collapse v-model="v" accordion>
    <c-collapse-item name="a" title="A">A</c-collapse-item>
    <c-collapse-item name="b" title="B">B</c-collapse-item>
    <c-collapse-item name="c" title="C">C</c-collapse-item>
  </c-collapse>
</template>
```

:::
