# Skeleton 骨架屏

在内容真正加载完成前先显示一个轮廓占位，缓解"白屏 + 跳动"的视觉割裂。

## 何时使用

- 网络较慢，加载需 1 秒以上。
- 图文混排的列表 / 详情页。
- 第一次加载数据时使用；后续刷新优先用 `loading` 状态。

## 基本使用

完全无参时显示一个标题 + 三段段落的默认占位。

:::demo

```vue
<template>
  <c-skeleton />
</template>
```

:::

## 带动画

`active` 开启微光扫描动画，提示"正在加载"。

:::demo

```vue
<template>
  <c-skeleton active />
</template>
```

:::

## 带头像

`avatar` 设为 `true` 显示左侧圆形占位；传对象可调形状与大小。

:::demo

```vue
<template>
  <c-skeleton avatar />
  <hr style="margin: 16px 0; border: 0; border-top: 1px dashed #d9d9d9" />
  <c-skeleton :avatar="{ shape: 'square', size: 'large' }" active />
</template>
```

:::

## 段落自定义

`paragraph` 传对象可改 `rows`（行数）和 `width`（宽度，可数组分别设每行宽）。

:::demo

```vue
<template>
  <c-skeleton :paragraph="{ rows: 4 }" />
  <hr style="margin: 16px 0; border: 0; border-top: 1px dashed #d9d9d9" />
  <c-skeleton :paragraph="{ rows: 3, width: ['80%', '95%', '60%'] }" active />
</template>
```

:::

## 标题自定义

`title` 传对象可控制宽度。

:::demo

```vue
<template>
  <c-skeleton :title="{ width: 240 }" :paragraph="false" />
  <hr style="margin: 16px 0; border: 0; border-top: 1px dashed #d9d9d9" />
  <c-skeleton :title="{ width: '50%' }" :paragraph="{ rows: 2 }" active />
</template>
```

:::

## 圆角化

`round` 让占位条变圆角，与圆角文本组件视觉更协调。

:::demo

```vue
<template>
  <c-skeleton round active avatar :paragraph="{ rows: 3 }" />
</template>
```

:::

## 切换为真实内容

`loading=false` 时直接渲染默认插槽，常用于异步加载完成后揭示真实内容。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const loading = ref(true)

function refresh() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1500)
}
refresh()
</script>

<template>
  <c-skeleton :loading="loading" active avatar :paragraph="{ rows: 3 }">
    <div style="display: flex; gap: 12px">
      <div style="width: 48px; height: 48px; border-radius: 50%; background: #1677ff; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600">CC</div>
      <div>
        <h4 style="margin: 0">真实标题已加载</h4>
        <p style="margin: 4px 0; color: #666">这里是异步取回的内容…</p>
      </div>
    </div>
  </c-skeleton>
  <c-button style="margin-top: 12px" @click="refresh">重新加载</c-button>
</template>
```

:::

## API

### Props

| 参数      | 类型                                                  | 默认值  | 说明                                                       |
| --------- | ----------------------------------------------------- | ------- | ---------------------------------------------------------- |
| active    | boolean                                               | `false` | 显示扫光动画                                               |
| loading   | boolean                                               | `true`  | `false` 时显示默认插槽内容                                 |
| avatar    | `boolean \| { shape, size }`                          | `false` | 头像占位                                                   |
| title     | `boolean \| { width }`                                | `true`  | 标题占位                                                   |
| paragraph | `boolean \| { rows, width }`                          | `true`  | 段落占位                                                   |
| round     | boolean                                               | `false` | 圆角化占位条                                               |

### Slots

| 名称    | 说明                                |
| ------- | ----------------------------------- |
| default | `loading=false` 时的真实内容渲染区   |
