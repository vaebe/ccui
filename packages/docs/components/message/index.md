# Message 全局提示

轻量的全局反馈提示，从顶部弹入，几秒后自动消失。适合用于操作成功 / 失败的简短确认，不打断用户操作。

## 基本使用

调用 `message.info` / `success` / `warning` / `error` / `loading` 即可弹出对应类型的提示。

:::demo

```vue
<script setup>
import { message } from 'vue3-ccui'

function showInfo() {
  message.info('这是一条信息')
}
function showSuccess() {
  message.success('操作成功')
}
function showWarning() {
  message.warning('注意：磁盘空间不足')
}
function showError() {
  message.error('保存失败，请稍后重试')
}
</script>

<template>
  <c-button @click="showInfo">Info</c-button>
  <c-button type="primary" @click="showSuccess">Success</c-button>
  <c-button @click="showWarning">Warning</c-button>
  <c-button type="danger" @click="showError">Error</c-button>
</template>
```

:::

## 加载中

`message.loading` 用于异步操作前的占位提示，自动播放旋转图标。

:::demo

```vue
<script setup>
import { message } from 'vue3-ccui'

function showLoading() {
  message.loading('加载中…')
}
</script>

<template>
  <c-button @click="showLoading">Loading</c-button>
</template>
```

:::

## 自定义停留时长

第二个参数为毫秒数，传 `0` 时不会自动关闭，需要手动调用返回的 `close()`。

:::demo

```vue
<script setup>
import { message } from 'vue3-ccui'

function shortToast() {
  message.success('1 秒后消失', 1000)
}
function longToast() {
  message.info('停留 8 秒', 8000)
}
</script>

<template>
  <c-button @click="shortToast">短 (1s)</c-button>
  <c-button @click="longToast">长 (8s)</c-button>
</template>
```

:::

## 主动关闭

当 `duration` 设为 `0`，或希望提前关闭时，使用调用返回的 `MessageHandle`。

:::demo

```vue
<script setup>
import { message } from 'vue3-ccui'
import { ref } from 'vue'

const handle = ref(null)

function openSticky() {
  handle.value = message.open({
    content: '这条不会自动消失',
    type: 'warning',
    duration: 0,
  })
}

function closeSticky() {
  handle.value?.close()
  handle.value = null
}
</script>

<template>
  <c-button @click="openSticky">弹出常驻提示</c-button>
  <c-button @click="closeSticky" :disabled="!handle">手动关闭</c-button>
</template>
```

:::

## 显示关闭按钮 + 回调

`showClose` 显示关闭图标；`onClose` 在关闭（自动 / 主动）时触发，用于清理或埋点。

:::demo

```vue
<script setup>
import { message } from 'vue3-ccui'
import { ref } from 'vue'

const closedCount = ref(0)

function withClose() {
  message.open({
    content: '5 秒后自动关，可点 × 提前关闭',
    type: 'info',
    duration: 5000,
    showClose: true,
    onClose() {
      closedCount.value += 1
    },
  })
}
</script>

<template>
  <c-button @click="withClose">弹出可关闭提示</c-button>
  <span style="margin-inline-start: 12px; color: #666">已关闭：{{ closedCount }} 次</span>
</template>
```

:::

## 全局清空

`message.destroy()` 关闭所有当前显示的提示并卸载容器；下次再调用 `message.*` 会重新挂载。

:::demo

```vue
<script setup>
import { message } from 'vue3-ccui'

function spawnFive() {
  for (let i = 1; i <= 5; i += 1) {
    message.info(`第 ${i} 条`)
  }
}
function destroyAll() {
  message.destroy()
}
</script>

<template>
  <c-button @click="spawnFive">连发 5 条</c-button>
  <c-button type="danger" @click="destroyAll">全部清空</c-button>
</template>
```

:::

## API

### message 命名空间

| 方法                                  | 说明                                                    |
| ------------------------------------- | ------------------------------------------------------- |
| `message.open(options)`               | 通用入口，传完整 `MessageOptions`，返回 `MessageHandle` |
| `message.info(content, duration?)`    | 信息（默认 3 秒），返回 `MessageHandle`                 |
| `message.success(content, duration?)` | 成功                                                    |
| `message.warning(content, duration?)` | 警告                                                    |
| `message.error(content, duration?)`   | 错误                                                    |
| `message.loading(content, duration?)` | 加载（带旋转图标）                                      |
| `message.destroy()`                   | 关闭全部当前提示并卸载容器                              |

### MessageOptions

| 字段        | 类型               | 默认     | 说明                                                       |
| ----------- | ------------------ | -------- | ---------------------------------------------------------- |
| content     | `string \| VNode`  | —        | 提示内容（必填）                                           |
| type        | `MessageType`      | `'info'` | 类型：`info` / `success` / `warning` / `error` / `loading` |
| duration    | number             | `3000`   | 停留毫秒数；`0` 表示不自动关闭                             |
| showClose   | boolean            | `false`  | 是否显示关闭按钮                                           |
| icon        | string             | `''`     | 自定义 icon 名（覆盖默认类型图标）                         |
| customClass | string             | `''`     | 自定义类名，便于做样式覆盖                                 |
| onClose     | `() => void`       | —        | 关闭时回调（自动 / 主动 / destroy 都会触发）               |
| key         | `string \| number` | —        | 标识，便于以同一 key 替换已存在的提示                      |

### MessageHandle

| 字段  | 类型         | 说明           |
| ----- | ------------ | -------------- |
| close | `() => void` | 主动关闭该提示 |
