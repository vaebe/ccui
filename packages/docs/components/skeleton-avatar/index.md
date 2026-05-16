# SkeletonAvatar 头像骨架

头像形态的骨架占位，对标 Ant Design `Skeleton.Avatar`，作为独立顶层组件存在（**不挂 Skeleton.Avatar 静态属性**）。

## 基本使用

:::demo

```vue
<template>
  <c-space>
    <c-skeleton-avatar />
    <c-skeleton-avatar active />
    <c-skeleton-avatar shape="square" />
    <c-skeleton-avatar shape="square" active />
  </c-space>
</template>
```

:::

## 尺寸

档位（`'large' | 'default' | 'small'`）走预设；数字直接走 inline style。

:::demo

```vue
<template>
  <c-space>
    <c-skeleton-avatar size="small" />
    <c-skeleton-avatar size="default" />
    <c-skeleton-avatar size="large" />
    <c-skeleton-avatar :size="64" />
    <c-skeleton-avatar :size="80" shape="square" />
  </c-space>
</template>
```

:::

## SkeletonAvatar 参数

| 参数   | 类型                                        | 默认        | 说明                      |
| ------ | ------------------------------------------- | ----------- | ------------------------- |
| active | `boolean`                                   | `false`     | 是否启用动画              |
| size   | `'large' \| 'default' \| 'small' \| number` | `'default'` | 尺寸；数字走 inline style |
| shape  | `'circle' \| 'square'`                      | `'circle'`  | 形态                      |
