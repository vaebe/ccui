# Spin 加载中

加载状态的占位指示器。

## 何时使用

- 异步加载需要 0.5 – 2 秒，给用户一个"正在处理"的反馈。
- 区块级 loading：在表格 / 卡片 / 表单上覆盖加载态。
- 全屏 loading：路由切换或重要异步任务。

## 基本使用

不带任何参数即可显示一个旋转指示。

:::demo

```vue
<template>
  <c-spin />
</template>
```

:::

## 不同尺寸

`size` 接受 `small` / `default` / `large`。

:::demo

```vue
<template>
  <div style="display: flex; gap: 24px; align-items: center">
    <c-spin size="small" />
    <c-spin />
    <c-spin size="large" />
  </div>
</template>
```

:::

## 加上提示文字

`tip` 在指示器下方加一行说明，让等待原因更明确。

:::demo

```vue
<template>
  <c-spin tip="加载中…" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <c-spin size="large" tip="正在打包，请稍候" />
</template>
```

:::

## 容器内嵌

包裹任意子元素后，`spinning=true` 时在子元素上方覆盖一层加载蒙板。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const loading = ref(true)
</script>

<template>
  <c-spin :spinning="loading">
    <div style="padding: 30px; background: #f5f5f5; border-radius: 4px">
      <h4 style="margin-top: 0">面板标题</h4>
      <p style="margin: 0">这块内容会被遮罩盖住，加载结束后浮现。</p>
    </div>
  </c-spin>
  <c-button style="margin-top: 12px" @click="loading = !loading"> {{ loading ? '关闭' : '打开' }} loading </c-button>
</template>
```

:::

## 延迟显示

`delay` 让 loading 在异步任务很快完成时根本不闪一下，避免"闪屏"。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const loading = ref(false)

function fast() {
  loading.value = true
  setTimeout(() => (loading.value = false), 200)
}
function slow() {
  loading.value = true
  setTimeout(() => (loading.value = false), 1500)
}
</script>

<template>
  <c-spin :spinning="loading" :delay="500">
    <div style="padding: 30px; background: #f5f5f5; border-radius: 4px">
      <p style="margin: 0">delay=500ms：仅当请求 ≥ 500ms 才出现 loading</p>
    </div>
  </c-spin>
  <c-button style="margin-top: 12px" @click="fast">短任务（200ms，不出 loading）</c-button>
  <c-button type="primary" style="margin-inline-start: 8px" @click="slow"> 长任务（1.5s，出 loading） </c-button>
</template>
```

:::

## 全屏模式

`fullscreen` 把 Spin 提到 body 顶层、覆盖整屏，常用于路由切换或重要异步操作。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const visible = ref(false)

function trigger() {
  visible.value = true
  setTimeout(() => (visible.value = false), 1500)
}
</script>

<template>
  <c-button type="primary" @click="trigger">触发 1.5 秒全屏 loading</c-button>
  <c-spin v-if="visible" fullscreen tip="处理中…" />
</template>
```

:::

## API

### Props

| 参数       | 类型                              | 默认值      | 说明                             |
| ---------- | --------------------------------- | ----------- | -------------------------------- |
| spinning   | boolean                           | `true`      | 是否显示                         |
| size       | `'small' \| 'default' \| 'large'` | `'default'` | 尺寸                             |
| tip        | string                            | —           | 指示器下方的说明                 |
| delay      | number                            | `0`         | 延迟显示（毫秒），避免快任务闪屏 |
| fullscreen | boolean                           | `false`     | 全屏覆盖                         |

### Slots

| 名称    | 说明                         |
| ------- | ---------------------------- |
| default | 被包裹的内容（容器内嵌模式） |
