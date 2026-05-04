# Image 图片

支持预览的图片组件。

## 基本使用

:::demo

```vue
<template>
  <c-image src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg" width="200" />
</template>
```

:::

## 加载失败兜底

:::demo

```vue
<template>
  <c-image src="https://invalid.example.com/x.png" width="200" alt="占位图片" />
</template>
```

:::
