# Masonry 瀑布流

按列均匀分布内容的多列布局。

## 何时使用

- 卡片墙、画廊、动态列表等高度不一致的内容。

## 基本使用

:::demo

```vue
<script>
export default {
  data() {
    return {
      heights: [80, 120, 60, 100, 140, 90, 70, 110, 130],
    }
  },
}
</script>

<template>
  <c-masonry :columns="3" :gutter="16">
    <div v-for="(h, i) in heights" :key="i" class="mas-item" :style="{ height: `${h}px` }">Item {{ i + 1 }}</div>
  </c-masonry>
</template>

<style>
.mas-item {
  background: rgba(22, 119, 255, 0.08);
  border: 1px solid rgba(22, 119, 255, 0.3);
  color: #1677ff;
  padding: 12px;
  border-radius: 4px;
}
</style>
```

:::

## 响应式列数

:::demo

```vue
<template>
  <c-masonry :columns="{ xs: 1, sm: 2, md: 3, lg: 4 }" :gutter="[12, 12]">
    <div v-for="(h, i) in 8" :key="i" class="mas-item" :style="{ height: `${60 + h * 10}px` }">Item {{ h }}</div>
  </c-masonry>
</template>

<style>
.mas-item {
  background: rgba(22, 119, 255, 0.08);
  padding: 12px;
  border-radius: 4px;
}
</style>
```

:::

## Masonry 参数

| 参数       | 类型                              | 默认值 | 说明                             |
| ---------- | --------------------------------- | ------ | -------------------------------- |
| columns    | number / `{ xs/sm/md/lg/xl/xxl }` | 3      | 列数（响应式）                   |
| gutter     | number / `[number, number]`       | 16     | 间距 [水平, 垂直]                |
| sequential | boolean                           | false  | 顺序填充（顺序优先而非平衡高度） |
