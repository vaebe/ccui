# SkeletonImage 图片骨架

图片形态的骨架占位（带内置图片图标），对标 Ant Design `Skeleton.Image`，作为独立顶层组件存在（**不挂 Skeleton.Image 静态属性**）。

## 基本使用

:::demo

```vue
<template>
  <c-space>
    <c-skeleton-image />
    <c-skeleton-image active />
  </c-space>
</template>
```

:::

## SkeletonImage 参数

| 参数   | 类型      | 默认    | 说明           |
| ------ | --------- | ------- | -------------- |
| active | `boolean` | `false` | 是否启用动画   |
