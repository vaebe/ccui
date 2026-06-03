# Notification 通知

四角弹出的通知提醒，比 Message 更适合带标题 + 描述的多行内容。默认 4.5 秒自动关闭，右上角弹出。

## 基本使用

`notification.success` / `info` / `warning` / `error` 都接受 `{ title, description }` 形式的对象。

:::demo

```vue
<script setup>
import { notification } from '@vaebe/ccui'

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
import { notification } from '@vaebe/ccui'

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

支持 6 个位置：`topRight` / `topLeft` / `top`（顶部居中）/ `bottomRight` / `bottomLeft` / `bottom`（底部居中）。

:::demo

```vue
<script setup>
import { notification } from '@vaebe/ccui'

const placements = ['top', 'topLeft', 'topRight', 'bottom', 'bottomLeft', 'bottomRight']

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

`duration` 推荐传**秒**；传 `0` 则不自动关闭，需要用户手动点 ×。

::: tip 单位规则

- `duration ≤ 100` 视为「秒」（如 `4.5` → 4.5 秒）
- `duration > 100` 视为「毫秒」（如 `4500`）
- `duration === 0` 永远表示不自动关闭

:::

:::demo

```vue
<script setup>
import { notification } from '@vaebe/ccui'

function shortToast() {
  notification.success({
    title: '快闪',
    description: '1.5 秒后自动消失',
    duration: 1.5, // 秒
  })
}
function sticky() {
  notification.warning({
    title: '常驻提醒',
    description: '不会自动消失，需要点 × 关闭',
    duration: 0,
  })
}
function msUnit() {
  notification.info({
    title: '毫秒写法',
    description: '4500ms = 4.5s',
    duration: 4500,
  })
}
</script>

<template>
  <c-button @click="shortToast">短 (1.5s)</c-button>
  <c-button @click="sticky">常驻 (duration=0)</c-button>
  <c-button @click="msUnit">毫秒 (4500)</c-button>
</template>
```

:::

## 全局配置 notification.config

`notification.config(...)` 设置 `maxCount` / `stack` / `pauseOnHover` / `role` / `duration` / `top` / `bottom` / `placement` / `getContainer` 等全局默认值。再次调用以覆盖前一次配置。

:::demo

```vue
<script setup>
import { notification } from '@vaebe/ccui'

function setupStack() {
  notification.config({ maxCount: 3, stack: true })
  for (let i = 1; i <= 5; i += 1) {
    notification.info({ title: `第 ${i} 条`, duration: 0 })
  }
}
function setupOffset() {
  notification.config({ top: 100 })
  notification.success({ title: '顶部偏移 100px', duration: 3 })
}
function reset() {
  notification.destroy()
  notification.config({ maxCount: Infinity, stack: false, top: undefined })
}
</script>

<template>
  <c-button @click="setupStack">maxCount=3 + stack</c-button>
  <c-button @click="setupOffset">top=100px</c-button>
  <c-button @click="reset">还原</c-button>
</template>
```

:::

## 主动关闭 + 关闭回调

`open` / 各类型方法都返回 `NotificationHandle`，调用 `handle.close()` 可主动收掉；`onClose` 在关闭时（自动 / 主动 / destroy）触发。

:::demo

```vue
<script setup>
import { notification } from '@vaebe/ccui'
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
import { notification } from '@vaebe/ccui'

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

## useNotification composable

`useNotification()` 返回 `{ notification, holder }` **对象**（**不是** React 风格元组）。容器渲染在当前 Vue 子树里，自动继承父组件 provide 的 ConfigProvider / 主题等上下文——**与模块级 `notification` 的最大差异**。

::: tip 何时用模块级 vs Hook 版？

- **模块级 `import { notification } from '@vaebe/ccui'`**：脚手架 / utils / 命令式弹一条，简单直接，但容器走独立 `createApp`，**拿不到调用方 app 的 inject**（自定义 ConfigProvider、主题、locale）。
- **Hook `useNotification()`**：当通知需要继承组件树上下文时用。**必须**在模板中挂 `<component :is="holder" />`。

:::

:::demo

```vue
<script setup>
import { useNotification } from '@vaebe/ccui'

const { notification, holder } = useNotification()

function show() {
  notification.success({ title: '继承上下文', description: 'locale / theme 都来自父组件', duration: 3 })
}
</script>

<template>
  <component :is="holder" />
  <c-button type="primary" @click="show">弹出（继承上下文）</c-button>
</template>
```

:::

### UseNotificationReturn

| 字段         | 类型              | 说明                                                                           |
| ------------ | ----------------- | ------------------------------------------------------------------------------ |
| notification | `NotificationApi` | 与全局 `notification` 同 API：`info/success/warning/error/open/config/destroy` |
| holder       | `Component`       | 必须挂到模板：`<component :is="holder" />`                                     |

## API

### notification 命名空间

| 方法                         | 说明                                                          |
| ---------------------------- | ------------------------------------------------------------- |
| `notification.open(options)` | 通用入口，传 `NotificationOptions`，返回 `NotificationHandle` |
| `notification.info(options)` | info 类型                                                     |
| `notification.success(...)`  | success 类型                                                  |
| `notification.warning(...)`  | warning 类型                                                  |
| `notification.error(...)`    | error 类型                                                    |
| `notification.config(cfg)`   | 全局默认值配置                                                |
| `notification.destroy()`     | 关闭并卸载所有通知容器                                        |

### NotificationOptions

| 字段         | 类型                    | 默认         | 说明                                                                             |
| ------------ | ----------------------- | ------------ | -------------------------------------------------------------------------------- |
| title        | string                  | —            | 通知标题（建议必填）                                                             |
| description  | `string \| VNode`       | —            | 通知正文                                                                         |
| type         | `NotificationType`      | `'info'`     | 类型：`info` / `success` / `warning` / `error`                                   |
| placement    | `NotificationPlacement` | `'topRight'` | 6 位置：`top` / `topRight` / `topLeft` / `bottom` / `bottomRight` / `bottomLeft` |
| duration     | number                  | `4.5`        | 停留时长。≤100 按秒，>100 按毫秒；`0` 不自动关闭                                 |
| showClose    | boolean                 | `true`       | 是否显示关闭按钮                                                                 |
| icon         | string                  | `''`         | 自定义 icon 名（覆盖默认类型图标）                                               |
| customClass  | string                  | `''`         | 自定义类名                                                                       |
| onClose      | `() => void`            | —            | 关闭时回调                                                                       |
| role         | `'alert' \| 'status'`   | `'alert'`    | DOM `role` + `aria-live`（`alert` → `assertive`；`status` → `polite`）           |
| pauseOnHover | boolean                 | `true`       | 鼠标悬停暂停自动关闭计时器                                                       |

### NotificationGlobalConfig

通过 `notification.config({...})` 设置；优先级低于单次 `open()` 选项。

| 字段         | 类型                    | 默认         | 说明                                      |
| ------------ | ----------------------- | ------------ | ----------------------------------------- |
| duration     | number                  | `4.5`        | 默认停留时长（秒）                        |
| maxCount     | number                  | `Infinity`   | 单 placement 最多并发条数，超出顶掉最旧   |
| stack        | boolean                 | `false`      | 视觉堆叠模式（容器加 `--stack` modifier） |
| pauseOnHover | boolean                 | `true`       | 全局默认 `pauseOnHover`                   |
| role         | `'alert' \| 'status'`   | `'alert'`    | 全局默认 `role`                           |
| placement    | `NotificationPlacement` | `'topRight'` | 全局默认弹出位置                          |
| top          | `number \| string`      | —            | 顶部偏移（仅作用于 `top*` placement）     |
| bottom       | `number \| string`      | —            | 底部偏移（仅作用于 `bottom*` placement）  |
| getContainer | `() => HTMLElement`     | `body`       | 自定义挂载父节点                          |

### NotificationHandle

| 字段  | 类型         | 说明           |
| ----- | ------------ | -------------- |
| close | `() => void` | 主动关闭该通知 |
