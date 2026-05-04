# Watermark 水印

为页面或组件添加水印。

## 基本使用

:::demo

```vue
<template>
  <c-watermark content="vue3-ccui">
    <div style="height: 240px; background: #f6f8fa; padding: 16px">水印保护区域</div>
  </c-watermark>
</template>
```

:::

## 多行 / 旋转

:::demo

```vue
<template>
  <c-watermark :content="['CCUI', 'Confidential']" :rotate="-30">
    <div style="height: 240px; background: #fff; border: 1px dashed #d9d9d9; padding: 16px">
      多行水印 + 自定义旋转角度
    </div>
  </c-watermark>
</template>
```

:::
