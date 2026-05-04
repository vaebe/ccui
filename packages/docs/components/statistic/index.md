# Statistic 统计数值

展示统计数值。

## 基本使用

:::demo

```vue
<template>
  <c-statistic title="活跃用户" :value="112893" />
  <c-statistic title="账户余额" :value="568.08" prefix="¥" :precision="2" />
</template>
```

:::

## 倒计时

:::demo

```vue
<script>
import { computed } from 'vue'

export default {
  setup() {
    const deadline = computed(() => Date.now() + 1000 * 60 * 60 * 24)
    return { deadline }
  }
}
</script>

<template>
  <c-statistic-countdown title="距离截止" :value="deadline" format="HH:mm:ss" />
</template>
```

:::
