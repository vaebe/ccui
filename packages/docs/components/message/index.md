# Message 全局提示

全局展示操作反馈。

## 基本使用

:::demo

```vue
<script>
import { message } from 'vue3-ccui'
export default {
  methods: {
    showInfo() { message.info('这是一条信息') },
    showSuccess() { message.success('操作成功') },
    showWarning() { message.warning('警告') },
    showError() { message.error('出错了') },
    showLoading() { message.loading('加载中…') },
  }
}
</script>

<template>
  <c-button @click="showInfo">Info</c-button>
  <c-button type="primary" @click="showSuccess">Success</c-button>
  <c-button @click="showWarning">Warning</c-button>
  <c-button type="danger" @click="showError">Error</c-button>
  <c-button @click="showLoading">Loading</c-button>
</template>
```

:::
