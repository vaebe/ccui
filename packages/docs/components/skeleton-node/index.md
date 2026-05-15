# SkeletonNode 自定义骨架

自定义形状的骨架占位容器，对标 Ant Design `Skeleton.Node`，作为独立顶层组件存在（**不挂 Skeleton.Node 静态属性**）。

default slot 内可放任意 VNode（最常见是一个 Icon）；本组件提供动画背景 + 居中布局。

## 基本使用

:::demo

```vue
<template>
  <c-space>
    <c-skeleton-node active>
      <svg viewBox="0 0 1024 1024" width="48" height="48" fill="currentColor">
        <path d="M512 64L128 256l384 192 384-192L512 64zM128 768l384 192 384-192V384L512 576 128 384v384z" />
      </svg>
    </c-skeleton-node>
    <c-skeleton-node :width="200" :height="200" />
  </c-space>
</template>
```

:::

## 自定义尺寸

`width` / `height` 接 number（自动加 px）或 CSS 字符串（`'50%'` / `'10rem'`）。

:::demo

```vue
<template>
  <c-space direction="vertical">
    <c-skeleton-node width="100%" height="120px" active />
    <c-skeleton-node :width="240" :height="80" />
  </c-space>
</template>
```

:::

## SkeletonNode 参数

| 参数   | 类型               | 默认     | 说明                            |
| ------ | ------------------ | -------- | ------------------------------- |
| active | `boolean`          | `false`  | 是否启用动画                    |
| width  | `string \| number` | `'160px'`| 占位宽度；number 自动加 px       |
| height | `string \| number` | `'96px'` | 占位高度；number 自动加 px       |

## SkeletonNode 插槽

| 插槽名  | 说明                              |
| ------- | --------------------------------- |
| default | 占位内部内容（图标 / VNode 等）    |
