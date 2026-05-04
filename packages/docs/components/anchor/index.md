# Anchor 锚点

页面内部跳转导航。

## 基本使用

:::demo

```vue
<template>
  <div style="display: flex; gap: 24px">
    <c-anchor
      :items="[
        { href: '#part-1', title: '第一节' },
        { href: '#part-2', title: '第二节' },
        { href: '#part-3', title: '第三节' },
      ]"
      style="width: 160px"
    />
    <div style="flex: 1">
      <h3 id="part-1">第一节</h3>
      <p style="height: 200px; background: #f6f8fa; padding: 12px">第一节内容</p>
      <h3 id="part-2">第二节</h3>
      <p style="height: 200px; background: #f6f8fa; padding: 12px">第二节内容</p>
      <h3 id="part-3">第三节</h3>
      <p style="height: 200px; background: #f6f8fa; padding: 12px">第三节内容</p>
    </div>
  </div>
</template>
```

:::
