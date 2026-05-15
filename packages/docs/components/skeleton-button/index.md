# SkeletonButton 按钮骨架

按钮形态的骨架占位，对标 Ant Design `Skeleton.Button`，作为独立顶层组件存在（**不挂 Skeleton.Button 静态属性**）。

## 何时使用

- 数据加载时占位渲染一个 Button 形状的灰块，避免布局抖动。
- 常与 `<c-skeleton-avatar>` / `<c-skeleton-input>` 等组合使用。

## 基本使用

:::demo

```vue
<template>
  <c-space>
    <c-skeleton-button />
    <c-skeleton-button active />
    <c-skeleton-button shape="round" />
    <c-skeleton-button shape="circle" />
    <c-skeleton-button shape="square" />
  </c-space>
</template>
```

:::

## 尺寸

:::demo

```vue
<template>
  <c-space>
    <c-skeleton-button size="small" />
    <c-skeleton-button size="default" />
    <c-skeleton-button size="large" />
  </c-space>
</template>
```

:::

## block 撑满父容器

:::demo

```vue
<template>
  <div style="width: 320px">
    <c-skeleton-button block active />
  </div>
</template>
```

:::

## SkeletonButton 参数

| 参数   | 类型                                                | 默认        | 说明                |
| ------ | --------------------------------------------------- | ----------- | ------------------- |
| active | `boolean`                                           | `false`     | 是否启用动画        |
| block  | `boolean`                                           | `false`     | 撑满父容器宽度      |
| size   | `'large' \| 'default' \| 'small'`                   | `'default'` | 尺寸                |
| shape  | `'default' \| 'circle' \| 'round' \| 'square'`      | `'default'` | 形态                |
