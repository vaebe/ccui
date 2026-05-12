# Notification 通知

四角弹出的通知提醒，比 Message 更适合带标题 + 描述的多行内容。默认 4.5 秒自动关闭，右上角弹出。

## 基本使用

`notification.success` / `info` / `warning` / `error` 都接受 `{ title, description }` 形式的对象。

:::demo

```vue
<script setup>
import { notification } from 'vue3-ccui'

function open() {
  notification.success({
    title: '操作成功',
    description: '您的操作已完成，可以继续下一步。',
  })
}
</script>

<template>
  <c-button type="primary" @click="open">显示通知</c-button>
</template>
```

:::

## 不同类型

不同 `type` 对应不同前置图标和强调色。

:::demo

```vue
<script setup>
import { notification } from 'vue3-ccui'

const items = [
  { type: 'info', title: '提示', desc: '有一份新报表生成了。' },
  { type: 'success', title: '成功', desc: '部署已完成。' },
  { type: 'warning', title: '警告', desc: '磁盘空间不足 10%。' },
  { type: 'error', title: '失败', desc: '请求超时，请重试。' },
]

function open(item) {
  notification[item.type]({ title: item.title, description: item.desc })
}
</script>

<template>
  <c-button v-for="it in items" :key="it.type" @click="open(it)">
    {{ it.title }}
  </c-button>
</template>
```

:::

## 弹出位置

通过 `placement` 选择四个角落之一。

:::demo

```vue
<script setup>
import { notification } from 'vue3-ccui'

const placements = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']

function open(placement) {
  notification.info({
    title: placement,
    description: `从 ${placement} 弹入`,
    placement,
  })
}
</script>

<template>
  <c-button v-for="p in placements" :key="p" @click="open(p)">{{ p }}</c-button>
</template>
```

:::

## 自定义停留时长

`duration` 单位为毫秒；传 `0` 则不自动关闭，需要用户手动点 ×。

:::demo

```vue
<script setup>
import { notification } from 'vue3-ccui'

function shortToast() {
  notification.success({
    title: '快闪',
    description: '1.5 秒后自动消失',
    duration: 1500,
  })
}
function sticky() {
  notification.warning({
    title: '常驻提醒',
    description: '不会自动消失，需要点 × 关闭',
    duration: 0,
  })
}
</script>

<template>
  <c-button @click="shortToast">短 (1.5s)</c-button>
  <c-button @click="sticky">常驻 (duration=0)</c-button>
</template>
```

:::

## 主动关闭 + 关闭回调

`open` / 各类型方法都返回 `NotificationHandle`，调用 `handle.close()` 可主动收掉；`onClose` 在关闭时（自动 / 主动 / destroy）触发。

:::demo

```vue
<script setup>
import { notification } from 'vue3-ccui'
import { ref } from 'vue'

const handle = ref(null)
const closedTimes = ref(0)

function openControlled() {
  handle.value = notification.info({
    title: '受控通知',
    description: '可手动关，也会触发回调',
    duration: 0,
    onClose() {
      closedTimes.value += 1
    },
  })
}

function closeManually() {
  handle.value?.close()
  handle.value = null
}
</script>

<template>
  <c-button @click="openControlled">弹出受控通知</c-button>
  <c-button :disabled="!handle" @click="closeManually">手动关闭</c-button>
  <span style="margin-inline-start: 12px; color: #666">已关闭：{{ closedTimes }} 次</span>
</template>
```

:::

## 全局清空

`notification.destroy()` 会关闭四个角的全部通知，并卸载容器；下次再调用会重新挂载。

:::demo

```vue
<script setup>
import { notification } from 'vue3-ccui'

function spam() {
  notification.info({ title: '左上', description: '内容', placement: 'topLeft' })
  notification.success({ title: '右上', description: '内容', placement: 'topRight' })
  notification.warning({ title: '左下', description: '内容', placement: 'bottomLeft' })
  notification.error({ title: '右下', description: '内容', placement: 'bottomRight' })
}
function clear() {
  notification.destroy()
}
</script>

<template>
  <c-button @click="spam">四角各发一条</c-button>
  <c-button type="danger" @click="clear">全部清空</c-button>
</template>
```

:::

## API

### notification 命名空间

| 方法                         | 说明                                                          |
| ---------------------------- | ------------------------------------------------------------- |
| `notification.open(options)` | 通用入口，传 `NotificationOptions`，返回 `NotificationHandle` |
| `notification.info(options)` | info 类型                                                     |
| `notification.success(...)`  | success 类型                                                  |
| `notification.warning(...)`  | warning 类型                                                  |
| `notification.error(...)`    | error 类型                                                    |
| `notification.destroy()`     | 关闭并卸载所有通知容器                                        |

### NotificationOptions

| 字段        | 类型                    | 默认         | 说明                                                            |
| ----------- | ----------------------- | ------------ | --------------------------------------------------------------- |
| title       | string                  | —            | 通知标题（建议必填）                                            |
| description | `string \| VNode`       | —            | 通知正文                                                        |
| type        | `NotificationType`      | `'info'`     | 类型：`info` / `success` / `warning` / `error`                  |
| placement   | `NotificationPlacement` | `'topRight'` | 弹出位置：`topRight` / `topLeft` / `bottomRight` / `bottomLeft` |
| duration    | number                  | `4500`       | 停留毫秒数；`0` 表示不自动关闭                                  |
| showClose   | boolean                 | `true`       | 是否显示关闭按钮                                                |
| icon        | string                  | `''`         | 自定义 icon 名（覆盖默认类型图标）                              |
| customClass | string                  | `''`         | 自定义类名                                                      |
| onClose     | `() => void`            | —            | 关闭时回调                                                      |

### NotificationHandle

| 字段  | 类型         | 说明           |
| ----- | ------------ | -------------- |
| close | `() => void` | 主动关闭该通知 |
