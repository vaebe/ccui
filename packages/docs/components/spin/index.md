# Spin 加载中

用于页面和区块的加载中状态。

## 何时使用

- 页面局部处于等待异步数据或正在渲染过程时，合适的加载动效会有效缓解用户的焦虑。

## 基本使用

:::demo

```vue
<template>
  <c-spin />
</template>
```

:::

## 各种大小与提示文字

:::demo

```vue
<template>
  <c-spin size="small" />
  <c-spin />
  <c-spin size="large" />
  <br>
  <c-spin tip="Loading..." />
</template>
```

:::

## 容器内嵌

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const loading = ref(true)
    return { loading }
  }
})
</script>

<template>
  <c-spin :spinning="loading">
    <div style="padding: 30px; background: #f5f5f5; border-radius: 4px;">
      <p>Alert message title</p>
      <p>Further details about the context of this alert.</p>
    </div>
  </c-spin>
  <br>
  <c-button @click="loading = !loading">
    Toggle
  </c-button>
</template>
```

:::

## Spin 参数

| 参数       | 类型                          | 默认值    | 说明                     |
| ---------- | ----------------------------- | --------- | ------------------------ |
| spinning   | boolean                       | true      | 是否旋转                 |
| size       | 'small' / 'default' / 'large' | 'default' | 大小                     |
| tip        | string                        | --        | 提示文字                 |
| delay      | number                        | 0         | 延迟显示加载效果（毫秒） |
| fullscreen | boolean                       | false     | 全屏模式                 |
