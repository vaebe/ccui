# Popconfirm 气泡确认

二次确认气泡。

## 基本使用

:::demo

```vue
<template>
  <c-popconfirm title="确认删除？" description="此操作不可恢复">
    <c-button type="danger">删除</c-button>
  </c-popconfirm>
</template>
```

:::

## 自定义按钮文字

:::demo

```vue
<template>
  <c-popconfirm title="保存修改？" confirm-text="保存" cancel-text="放弃">
    <c-button type="primary">保存</c-button>
  </c-popconfirm>
</template>
```

:::
