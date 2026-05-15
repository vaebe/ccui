# Modal 对话框

模态对话框。需要确认操作或集中处理一段交互时使用。

## 基本使用

`v-model:visible` 控制开合。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
</script>

<template>
  <c-button type="primary" @click="visible = true">打开 Modal</c-button>
  <c-modal v-model:visible="visible" title="基本对话框">
    <p>这是一个对话框的内容。</p>
    <p>支持任意 vue 内容。</p>
  </c-modal>
</template>
```

:::

## 自定义按钮文字 / 类型

`ok-text` / `cancel-text` 替换文案，`ok-type="danger"` 把确认按钮渲染为危险色。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
const v = ref(false)
</script>

<template>
  <c-button @click="v = true">删除...</c-button>
  <c-modal v-model:visible="v" title="确认删除" ok-text="删除" cancel-text="再想想" ok-type="danger">
    删除后无法恢复，确认要删除吗？
  </c-modal>
</template>
```

:::

## 异步关闭（确认按钮 loading）

通过 `ok-loading` 控制确认按钮的加载状态，常用于点击确认后请求服务端，请求完成再关闭。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const loading = ref(false)

function handleOk() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    visible.value = false
  }, 1500)
}
</script>

<template>
  <c-button type="primary" @click="visible = true">打开</c-button>
  <c-modal v-model:visible="visible" title="异步提交" :ok-loading="loading" @ok="handleOk">
    点击「确定」后会模拟 1.5s 的请求再关闭弹窗。
  </c-modal>
</template>
```

:::

## 居中显示

`centered` 让 Modal 在视口垂直居中（默认距顶部 100px）。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
</script>

<template>
  <c-button @click="visible = true">居中打开</c-button>
  <c-modal v-model:visible="visible" centered title="垂直居中"> 我在视口中央。 </c-modal>
</template>
```

:::

## 自定义宽度

`width` 接受数字（px）或字符串（如 `'80%'`）。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
const v1 = ref(false)
const v2 = ref(false)
</script>

<template>
  <c-button @click="v1 = true">小弹窗</c-button>
  &nbsp;
  <c-button @click="v2 = true">大弹窗</c-button>
  <c-modal v-model:visible="v1" :width="360" title="360px"> 紧凑型。 </c-modal>
  <c-modal v-model:visible="v2" width="80%" title="80% 宽"> 适合表格、表单类内容。 </c-modal>
</template>
```

:::

## 不带按钮 / 自定义页脚

`hide-footer` 隐藏整个页脚；或用 `footer` 插槽完全自定义按钮区。slot 参数 `{ ok, cancel }` 是默认的关闭函数。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
const v = ref(false)
</script>

<template>
  <c-button @click="v = true">自定义 footer</c-button>
  <c-modal v-model:visible="v" title="提示">
    <p>此 Modal 自定义了 footer 区域，提供三个动作。</p>
    <template #footer="{ cancel }">
      <c-button @click="cancel">关闭</c-button>
      <c-button type="primary" @click="cancel" style="margin-inline-start: 8px">保存草稿</c-button>
      <c-button type="primary" @click="cancel" style="margin-inline-start: 8px">提交</c-button>
    </template>
  </c-modal>
</template>
```

:::

## API

### Props

| 参数                   | 类型                                                                                       | 默认值      | 说明                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------ | ----------- | --------------------------------------------------------------------- |
| open                   | boolean                                                                                    | `false`     | 是否可见（Ant 主名，支持 `v-model:open`）                              |
| visible                | boolean                                                                                    | `false`     | @deprecated 请改用 `open`（仍可用 `v-model:visible`）                  |
| title                  | string                                                                                     | `''`        | 标题（也可用 `title` slot 自定义）                                    |
| width                  | `number \| string`                                                                         | `520`       | 宽度，数字为 px                                                       |
| closable               | `boolean \| { closeIcon?: VNode \| string; disabled?: boolean; ariaLabel?: string }`        | `true`      | 关闭按钮配置；对象形支持自定义图标 / 禁用 / aria-label                |
| maskClosable           | boolean                                                                                    | `true`      | 点击蒙层是否关闭                                                      |
| keyboard               | boolean                                                                                    | `true`      | 按 Esc 是否关闭（Ant 主名）                                            |
| closeOnEsc             | boolean                                                                                    | `true`      | @deprecated 请改用 `keyboard`                                          |
| centered               | boolean                                                                                    | `false`     | 是否垂直居中显示                                                      |
| mask                   | boolean                                                                                    | `true`      | 是否显示蒙层                                                          |
| okText                 | string                                                                                     | `'确 定'`   | 确认按钮文案                                                          |
| cancelText             | string                                                                                     | `'取 消'`   | 取消按钮文案                                                          |
| okType                 | `'primary' \| 'danger' \| 'default'`                                                       | `'primary'` | 确认按钮类型                                                          |
| confirmLoading         | boolean                                                                                    | `false`     | 确认按钮加载态（Ant 主名）                                             |
| okLoading              | boolean                                                                                    | `false`     | @deprecated 请改用 `confirmLoading`                                    |
| footer                 | `string \| VNode \| null \| undefined`                                                      | --          | 底部按钮区：`null` 等价旧 `hideFooter=true`；`string` / VNode 直接渲染 |
| hideFooter             | boolean                                                                                    | `false`     | @deprecated 请改用 `footer={null}`                                     |
| destroyOnClose         | boolean                                                                                    | `false`     | 关闭时销毁内部内容（与 `keepAlive` 互斥）                              |
| keepAlive              | boolean                                                                                    | `false`     | 即使未打开也保留 DOM（Vue 化 `forceRender`，与 `destroyOnClose` 互斥） |
| wrapClassName          | string                                                                                     | --          | 自定义根节点 class                                                    |
| transitionName         | string                                                                                     | --          | 自定义 Transition 名（空走内置 `-zoom`）                              |
| maskTransitionName     | string                                                                                     | --          | mask 自定义 Transition 名（空走内置 `-mask-fade`）                     |
| focusTriggerAfterClose | boolean                                                                                    | `true`      | 关闭后聚焦回打开前的触发元素                                          |
| getContainer           | `(trigger: HTMLElement \| null) => HTMLElement \| null`                                     | --          | 自定义挂载容器函数（Ant 主名）；返回 `null` 时内联渲染不 Teleport       |
| appendToBody           | boolean                                                                                    | `true`      | @deprecated 请改用 `getContainer`                                      |
| zIndex                 | number                                                                                     | `1000`      | z-index                                                               |

### Events

| 事件名             | 回调签名             | 触发时机                                              |
| ------------------ | -------------------- | ----------------------------------------------------- |
| update:open        | `(open: boolean)`    | 显示状态变化（v-model:open，Ant 主名）                |
| update:visible     | `(visible: boolean)` | 同步触发的旧名，方便从 `v-model:visible` 渐进迁移      |
| after-open-change  | `(open: boolean)`    | 打开 / 关闭动画完成后触发（immediate watch，首次 false） |
| ok                 | `()`                 | 点击确认按钮                                          |
| cancel             | `()`                 | 点击取消 / 关闭 / Esc                                  |
| close              | `()`                 | 关闭过程中（先于 cancel）                              |
| open               | `()`                 | 开始展开                                              |
| opened             | `()`                 | 展开动画完成                                          |
| closed             | `()`                 | 收起动画完成                                          |

### Slots

| 名称       | slot 参数        | 说明                                          |
| ---------- | ---------------- | --------------------------------------------- |
| default    | -                | 弹窗内容                                      |
| title      | -                | 自定义标题区                                  |
| footer     | `{ ok, cancel }` | 自定义底部按钮（优先级高于 `footer` prop）     |
| close-icon | -                | 自定义关闭图标（优先级高于 `closable.closeIcon`） |
