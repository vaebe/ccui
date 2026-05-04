# Notification 通知

四角弹出的通知提醒。

## 基本使用

:::demo

```vue
<script>
import { notification } from 'vue3-ccui'
export default {
  methods: {
    open() {
      notification.success({
        title: '操作成功',
        description: '您的操作已完成，可以继续下一步。',
      })
    }
  }
}
</script>

<template>
  <c-button type="primary" @click="open">显示通知</c-button>
</template>
```

:::

## 不同位置

:::demo

```vue
<script>
import { notification } from 'vue3-ccui'
export default {
  methods: {
    open(placement) {
      notification.info({ title: placement, description: '位置示例', placement })
    }
  }
}
</script>

<template>
  <c-button @click="open('topLeft')">topLeft</c-button>
  <c-button @click="open('topRight')">topRight</c-button>
  <c-button @click="open('bottomLeft')">bottomLeft</c-button>
  <c-button @click="open('bottomRight')">bottomRight</c-button>
</template>
```

:::
