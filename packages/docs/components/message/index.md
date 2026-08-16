# Message 全局提示

轻量的全局反馈提示，从顶部弹入，几秒后自动消失。适合用于操作成功 / 失败的简短确认，不打断用户操作。

## 基本使用

调用 `message.info` / `success` / `warning` / `error` / `loading` 即可弹出对应类型的提示。

:::demo

```vue
<script setup>
import { message } from '@vaebe/ccui'

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
import { message } from '@vaebe/ccui'

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

第二个参数推荐传**秒**；传 `0` 时不会自动关闭，需要手动调用返回的 `close()`。

::: tip 单位规则

- `duration ≤ 100` 视为「秒」（如 `3` → 3 秒、`1.5` → 1.5 秒）
- `duration > 100` 视为「毫秒」（如 `3000`、`8000`）
- `duration === 0` 永远表示不自动关闭

:::

:::demo

```vue
<script setup>
import { message } from '@vaebe/ccui'

function shortToast() {
  message.success('1 秒后消失', 1) // 秒
}
function longToast() {
  message.info('停留 8 秒', 8)
}
function msUnit() {
  message.info('毫秒写法', 5000) // > 100 按 ms 处理
}
</script>

<template>
  <c-button @click="shortToast">短 (1s)</c-button>
  <c-button @click="longToast">长 (8s)</c-button>
  <c-button @click="msUnit">毫秒 (5000)</c-button>
</template>
```

:::

## 多 placement

支持 6 个位置：`top` / `topLeft` / `topRight` / `bottom` / `bottomLeft` / `bottomRight`。默认 `top`。

:::demo

```vue
<script setup>
import { message } from '@vaebe/ccui'
function pop(p) {
  message.open({ content: `placement: ${p}`, placement: p, duration: 2 })
}
</script>

<template>
  <c-button @click="pop('top')">top</c-button>
  <c-button @click="pop('topLeft')">topLeft</c-button>
  <c-button @click="pop('topRight')">topRight</c-button>
  <c-button @click="pop('bottom')">bottom</c-button>
  <c-button @click="pop('bottomLeft')">bottomLeft</c-button>
  <c-button @click="pop('bottomRight')">bottomRight</c-button>
</template>
```

:::

## 全局配置 message.config

`message.config(...)` 可一次性设定 `maxCount` / `stack` / `pauseOnHover` / `role` / `duration` / `top` / `bottom` / `getContainer` 等全局默认值。再次调用以覆盖前一次配置。

:::demo

```vue
<script setup>
import { message } from '@vaebe/ccui'

function setupStack() {
  message.config({ maxCount: 3, stack: true })
  for (let i = 1; i <= 5; i += 1) message.info(`第 ${i} 条`, 0)
}

function setupOffset() {
  message.config({ top: 100 }) // 顶部偏移 100px
  message.success('从顶 100px 处弹出', 2)
}

function reset() {
  message.destroy()
  message.config({ maxCount: Infinity, stack: false, top: undefined })
}
</script>

<template>
  <c-button @click="setupStack">maxCount=3 + stack</c-button>
  <c-button @click="setupOffset">top=100px</c-button>
  <c-button @click="reset">还原</c-button>
</template>
```

:::

## 主动关闭

当 `duration` 设为 `0`，或希望提前关闭时，使用调用返回的 `MessageHandle`。

:::demo

```vue
<script setup>
import { message } from '@vaebe/ccui'
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
import { message } from '@vaebe/ccui'
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
  <span style="margin-inline-start: 12px; color: var(--ccui-color-text-secondary)">已关闭：{{ closedCount }} 次</span>
</template>
```

:::

## 全局清空

`message.destroy()` 关闭所有当前显示的提示并卸载容器；下次再调用 `message.*` 会重新挂载。

:::demo

```vue
<script setup>
import { message } from '@vaebe/ccui'

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

## useMessage composable

`useMessage()` 返回 `{ message, holder }` **对象**（**不是** React 的 `[modal, contextHolder]` 元组）。容器渲染在当前 Vue 子树里，自动继承父组件 provide 的 ConfigProvider / 主题等上下文——**与模块级 `message` 的最大差异**。

::: tip 何时用模块级 vs Hook 版？

- **模块级 `import { message } from '@vaebe/ccui'`**：脚手架 / utils / 命令式弹一条，简单直接，但容器走独立 `createApp`，**拿不到调用方 app 的 inject**（如自定义 ConfigProvider、主题、locale）。
- **Hook `useMessage()`**：当弹层需要继承组件树上下文（深色主题、自定义 locale、自定义 ConfigProvider）时用。**必须**在模板中挂 `<component :is="holder" />`。

:::

:::demo

```vue
<script setup>
import { useMessage } from '@vaebe/ccui'

const { message, holder } = useMessage()

function show() {
  message.success('我能拿到 ConfigProvider 的 locale', 2)
}
</script>

<template>
  <component :is="holder" />
  <c-button type="primary" @click="show">弹出（继承上下文）</c-button>
</template>
```

:::

### UseMessageReturn

| 字段    | 类型         | 说明                                                                              |
| ------- | ------------ | --------------------------------------------------------------------------------- |
| message | `MessageApi` | 与全局 `message` 同 API：`info/success/warning/error/loading/open/config/destroy` |
| holder  | `Component`  | 必须挂到模板：`<component :is="holder" />`                                        |

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
| `message.config(cfg)`                 | 全局默认值配置                                          |
| `message.destroy()`                   | 关闭全部当前提示并卸载容器                              |

### MessageOptions

| 字段         | 类型                  | 默认      | 说明                                                                                 |
| ------------ | --------------------- | --------- | ------------------------------------------------------------------------------------ |
| content      | `string \| VNode`     | —         | 提示内容（必填）                                                                     |
| type         | `MessageType`         | `'info'`  | 类型：`info` / `success` / `warning` / `error` / `loading`                           |
| duration     | number                | `3`       | 停留时长。≤100 按秒，>100 按毫秒；`0` 不自动关闭                                     |
| showClose    | boolean               | `false`   | 是否显示关闭按钮                                                                     |
| icon         | string                | `''`      | 自定义 icon 名（覆盖默认类型图标）                                                   |
| customClass  | string                | `''`      | 自定义类名，便于做样式覆盖                                                           |
| onClose      | `() => void`          | —         | 关闭时回调（自动 / 主动 / destroy 都会触发）                                         |
| key          | `string \| number`    | —         | 标识，便于以同一 key 替换已存在的提示                                                |
| placement    | `MessagePlacement`    | `'top'`   | 6 位置之一：`top` / `topLeft` / `topRight` / `bottom` / `bottomLeft` / `bottomRight` |
| role         | `'alert' \| 'status'` | `'alert'` | DOM `role` + `aria-live`（`alert` → `assertive`；`status` → `polite`）               |
| pauseOnHover | boolean               | `true`    | 鼠标悬停暂停自动关闭计时器                                                           |

### MessageGlobalConfig

通过 `message.config({...})` 设置；优先级低于单次 `open()` 选项。

| 字段         | 类型                  | 默认       | 说明                                      |
| ------------ | --------------------- | ---------- | ----------------------------------------- |
| duration     | number                | `3`        | 默认停留时长（秒）                        |
| maxCount     | number                | `Infinity` | 单 placement 最多并发条数，超出顶掉最旧   |
| stack        | boolean               | `false`    | 视觉堆叠模式（容器加 `--stack` modifier） |
| pauseOnHover | boolean               | `true`     | 全局默认 `pauseOnHover`                   |
| role         | `'alert' \| 'status'` | `'alert'`  | 全局默认 `role`                           |
| top          | `number \| string`    | —          | 顶部偏移（仅作用于 `top*` placement）     |
| bottom       | `number \| string`    | —          | 底部偏移（仅作用于 `bottom*` placement）  |
| getContainer | `() => HTMLElement`   | `body`     | 自定义挂载父节点                          |

### MessageHandle

| 字段  | 类型         | 说明           |
| ----- | ------------ | -------------- |
| close | `() => void` | 主动关闭该提示 |
