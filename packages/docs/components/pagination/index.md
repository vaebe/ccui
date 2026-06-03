# Pagination 分页

切分大列表为多页展示。

## 基本使用

`v-model:current` 双向绑定当前页码；`total` 提供总条数，分页器自动按 `pageSize`（默认 10）算页数。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const current = ref(1)
</script>

<template>
  <c-pagination v-model:current="current" :total="100" />
  <p style="margin-top: 8px; color: #666">当前第 {{ current }} 页</p>
</template>
```

:::

## 显示总数

`show-total` 设为 `true` 显示"共 N 条"，传函数则可自定义文案。

:::demo

```vue
<template>
  <c-pagination :total="500" :current="1" :page-size="20" show-total />
  <c-pagination
    style="margin-top: 12px"
    :total="500"
    :current="2"
    :page-size="20"
    :show-total="(total, range) => `第 ${range[0]}-${range[1]} 项 / 共 ${total} 项`"
  />
</template>
```

:::

## 切换每页条数

`show-size-changer` 显示一个下拉用于改 `pageSize`，可用 `page-size-options` 指定可选数。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const current = ref(1)
const size = ref(20)
</script>

<template>
  <c-pagination
    v-model:current="current"
    v-model:page-size="size"
    :total="500"
    :page-size-options="[10, 20, 50, 100]"
    show-size-changer
    show-total
  />
  <p style="margin-top: 8px; color: #666">page={{ current }} pageSize={{ size }}</p>
</template>
```

:::

## 快速跳页

`show-quick-jumper` 在右侧显示一个数字输入框，输入后回车跳转。

:::demo

```vue
<template>
  <c-pagination :total="800" :current="3" :page-size="20" show-quick-jumper show-total />
</template>
```

:::

## 简洁模式

`simple` 仅显示"当前/总页数 + 上一页 / 下一页"，常用于移动端或紧凑场景。

:::demo

```vue
<template>
  <c-pagination :total="200" :current="1" simple />
</template>
```

:::

## 小尺寸

`size="small"` 缩小整体高度与字号，适合放在表格 toolbar 里。

:::demo

```vue
<template>
  <c-pagination :total="100" :current="1" size="small" show-total />
</template>
```

:::

## 禁用 / 单页隐藏

`disabled` 整体禁用；`hide-on-single-page` 在只有一页时隐藏自身。

:::demo

```vue
<template>
  <c-pagination :total="100" :current="1" disabled />
  <c-pagination :total="5" :page-size="10" hide-on-single-page />
  <p style="color: #666">↑ 上方 disabled，下方因只有 1 页被隐藏</p>
</template>
```

:::

## API

### Props

| 参数             | 类型                                  | 默认值              | 说明                              |
| ---------------- | ------------------------------------- | ------------------- | --------------------------------- |
| current          | number                                | `1`                 | 当前页，支持 `v-model:current`    |
| total            | number                                | `0`                 | 总条数                            |
| pageSize         | number                                | `10`                | 每页条数，支持 `v-model:pageSize` |
| pageSizeOptions  | `number[]`                            | `[10, 20, 50, 100]` | 切换 pageSize 的下拉选项          |
| showSizeChanger  | boolean                               | `false`             | 显示每页条数切换器                |
| showQuickJumper  | boolean                               | `false`             | 显示快速跳页输入                  |
| showTotal        | `boolean \| (total, range) => string` | `false`             | 显示总数；传函数自定义文案        |
| simple           | boolean                               | `false`             | 简洁模式                          |
| disabled         | boolean                               | `false`             | 整体禁用                          |
| hideOnSinglePage | boolean                               | `false`             | 只有 1 页时隐藏自身               |
| size             | `'default' \| 'small'`                | `'default'`         | 尺寸                              |

### Events

| 事件名          | 回调签名                           | 说明           |
| --------------- | ---------------------------------- | -------------- |
| update:current  | `(page: number)`                   | 页码变化       |
| update:pageSize | `(size: number)`                   | 每页条数变化   |
| change          | `(page: number, pageSize: number)` | 页码或条数变化 |
