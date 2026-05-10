# Masonry 瀑布流

按列分布、高度自适应的多列布局。卡片墙、画廊、动态列表的常见排版方式。

## 基本使用

设置 `columns`（列数）和 `gutter`（间距），把任意子节点放进默认插槽。

:::demo

```vue
<script setup>
const heights = [80, 120, 60, 100, 140, 90, 70, 110, 130]
</script>

<template>
  <c-masonry :columns="3" :gutter="16">
    <div v-for="(h, i) in heights" :key="i" class="mas-item" :style="{ height: `${h}px` }">
      Item {{ i + 1 }}
    </div>
  </c-masonry>
</template>

<style>
.mas-item {
  background: #e6f4ff;
  border: 1px solid #91caff;
  color: #1677ff;
  padding: 12px;
  border-radius: 4px;
}
</style>
```

:::

## 响应式列数

`columns` 也可以传断点对象，Masonry 会按当前视口宽度选择对应列数。

:::demo

```vue
<template>
  <c-masonry :columns="{ xs: 1, sm: 2, md: 3, lg: 4 }" :gutter="12">
    <div v-for="i in 8" :key="i" class="mas-item" :style="{ height: `${60 + i * 12}px` }">
      Item {{ i }}
    </div>
  </c-masonry>
  <p style="margin-top: 8px; color: #666">缩窄浏览器观察列数变化</p>
</template>

<style>
.mas-item {
  background: #fafafa;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
}
</style>
```

:::

## 控制水平 / 垂直间距

`gutter` 可传单值（同时控制 H/V）或 `[h, v]` 数组分别指定。

:::demo

```vue
<template>
  <p style="color: #666; margin: 0 0 8px">水平 24, 垂直 8</p>
  <c-masonry :columns="3" :gutter="[24, 8]">
    <div v-for="i in 6" :key="i" class="mas-item" :style="{ height: `${60 + i * 8}px` }">
      Item {{ i }}
    </div>
  </c-masonry>
</template>

<style>
.mas-item {
  background: #fafafa;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
}
</style>
```

:::

## 卡片墙

把 `<c-card>` 放进 Masonry，立刻得到卡片瀑布流。

:::demo

```vue
<script setup>
const cards = [
  { title: '日报', body: '第 14 周 项目进展……' },
  { title: '需求池', body: '本周提交 12 项需求，已排期 5 项。' },
  { title: '待办', body: '今日 4 项必做：评审、上线、巡检、夜会。' },
  { title: '复盘', body: '上线问题 3 例，根因总结附后。' },
  { title: '人员', body: '在岗 12 人，请假 1 人。' },
  { title: '风险', body: '依赖外部 API，关注 9 月窗口期。' },
]
</script>

<template>
  <c-masonry :columns="{ xs: 1, sm: 2, md: 3 }" :gutter="16">
    <c-card v-for="(c, i) in cards" :key="i" :title="c.title">
      <p>{{ c.body }}</p>
    </c-card>
  </c-masonry>
</template>
```

:::

## 内容动态变化

Masonry 在子节点变化时会重新分列，方便做"加载更多"。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const list = ref(Array.from({ length: 6 }, (_, i) => i + 1))

function loadMore() {
  const start = list.value.length + 1
  list.value = [...list.value, ...Array.from({ length: 4 }, (_, i) => start + i)]
}
function reset() {
  list.value = Array.from({ length: 6 }, (_, i) => i + 1)
}
</script>

<template>
  <c-masonry :columns="3" :gutter="12">
    <div v-for="n in list" :key="n" class="mas-item" :style="{ height: `${60 + (n % 4) * 20}px` }">
      Item {{ n }}
    </div>
  </c-masonry>
  <div style="margin-top: 8px">
    <c-button type="primary" @click="loadMore">加载更多</c-button>
    <c-button style="margin-inline-start: 8px" @click="reset">重置</c-button>
  </div>
</template>

<style>
.mas-item {
  background: #fafafa;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
}
</style>
```

:::

## API

### Props

| 参数       | 类型                                                    | 默认值 | 说明                                              |
| ---------- | ------------------------------------------------------- | ------ | ------------------------------------------------- |
| columns    | `number \| { xs?, sm?, md?, lg?, xl?, xxl?: number }`   | `3`    | 列数；对象形式按断点响应                          |
| gutter     | `number \| [number, number]`                            | `16`   | 间距：单值 = H/V 同；数组 = `[水平, 垂直]`        |
| sequential | boolean                                                 | `false`| 顺序填充（保持原序，不做高度平衡）                |

### 断点对照（与 c-grid 一致）

| 断点 | 触发宽度（px） |
| ---- | -------------- |
| xs   | 0              |
| sm   | 576            |
| md   | 768            |
| lg   | 992            |
| xl   | 1200           |
| xxl  | 1600           |
