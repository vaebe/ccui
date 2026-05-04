# Pagination 分页

数据分页控件。

## 基本使用

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const current = ref(1)
    return { current }
  }
})
</script>

<template>
  <c-pagination v-model:current="current" :total="100" />
  <p style="margin-top: 12px">当前第 {{ current }} 页</p>
</template>
```

:::

## 显示总数 / 每页条数切换

:::demo

```vue
<template>
  <c-pagination :total="500" :current="2" :page-size="20" show-size-changer />
</template>
```

:::

## 简单 / 跳转

:::demo

```vue
<template>
  <c-pagination :total="200" :current="1" simple />
  <br>
  <c-pagination :total="200" :current="1" show-quick-jumper />
</template>
```

:::
