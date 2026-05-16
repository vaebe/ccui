# SkeletonInput 输入框骨架

输入框形态的骨架占位，对标 Ant Design `Skeleton.Input`，作为独立顶层组件存在（**不挂 Skeleton.Input 静态属性**）。

## 基本使用

:::demo

```vue
<template>
  <c-space direction="vertical">
    <c-skeleton-input />
    <c-skeleton-input active />
    <c-skeleton-input size="small" />
    <c-skeleton-input size="large" />
  </c-space>
</template>
```

:::

## block 撑满父容器

:::demo

```vue
<template>
  <div style="width: 320px">
    <c-skeleton-input block active />
  </div>
</template>
```

:::

## SkeletonInput 参数

| 参数   | 类型                              | 默认        | 说明           |
| ------ | --------------------------------- | ----------- | -------------- |
| active | `boolean`                         | `false`     | 是否启用动画   |
| block  | `boolean`                         | `false`     | 撑满父容器宽度 |
| size   | `'large' \| 'default' \| 'small'` | `'default'` | 尺寸           |
