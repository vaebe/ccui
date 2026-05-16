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

## 命令式 Modal.confirm

`Modal.confirm({...})` / `.info` / `.success` / `.error` / `.warning` 命令式弹窗，**纯函数调用**，不需要在模板中预写组件。返回 `{ destroy, update }` 句柄。

::: tip 命名空间约定

ccui Vue 风格：**不挂静态属性子组件**（如 `Modal.Header` / `Modal.Footer` 这类我们一律拆为顶层平铺组件）。但 `Modal.confirm` / `.info` 等是**命令式函数调用**，是命名空间下挂函数（而非组件），符合 JS 模块惯例，保留。

:::

:::demo

```vue
<script setup>
import { Modal } from '@vaebe/ccui'

function ask() {
  Modal.confirm({
    title: '确认删除',
    content: '此操作不可恢复，确认继续？',
    okText: '删除',
    okType: 'danger',
    onOk: () => fetch('/api/delete'),
    onCancel: () => console.log('canceled'),
  })
}

function showInfo() {
  Modal.info({ title: '系统提示', content: '已生成新报表，请到列表查看。' })
}

function showSuccess() {
  Modal.success({ title: '部署成功', content: '版本 v2.0.0 已上线。' })
}

function showError() {
  Modal.error({ title: '请求失败', content: '网络异常，请稍后重试。' })
}

function showWarning() {
  Modal.warning({ title: '警告', content: '磁盘空间不足 10%。' })
}
</script>

<template>
  <c-button type="danger" @click="ask">弹 confirm</c-button>
  <c-button @click="showInfo">info</c-button>
  <c-button type="primary" @click="showSuccess">success</c-button>
  <c-button @click="showError">error</c-button>
  <c-button @click="showWarning">warning</c-button>
</template>
```

:::

### onOk 返回 Promise（loading 串行）

`onOk` 返回 Promise 时，OK 按钮自动进入 loading 状态直到 resolve；reject 时**不关闭** modal（错误传给调用方）。

:::demo

```vue
<script setup>
import { Modal } from '@vaebe/ccui'

function asyncConfirm() {
  Modal.confirm({
    title: '提交订单',
    content: '请稍候 1.5 秒...',
    onOk: () => new Promise((resolve) => setTimeout(resolve, 1500)),
  })
}
</script>

<template>
  <c-button type="primary" @click="asyncConfirm">异步 confirm</c-button>
</template>
```

:::

### update / destroy 句柄

返回的 handle 可动态更新 title / content，或强制销毁。

:::demo

```vue
<script setup>
import { Modal } from '@vaebe/ccui'

function progressDemo() {
  let i = 1
  const handle = Modal.info({ title: '进度', content: `当前 ${i} / 3` })
  const timer = setInterval(() => {
    i += 1
    if (i > 3) {
      clearInterval(timer)
      handle.destroy()
      return
    }
    handle.update({ content: `当前 ${i} / 3` })
  }, 1000)
}
</script>

<template>
  <c-button @click="progressDemo">进度条 demo</c-button>
</template>
```

:::

### Modal.destroyAll

```ts
Modal.destroyAll() // 关闭所有当前活跃命令式 modal（不影响 <c-modal> 模板实例）
```

## useModal composable

`useModal()` 返回 `{ modal, holder }` **对象**（**不是** React `[modal, contextHolder]` 元组）。命令式调用会继承调用组件的 provide / ConfigProvider / 主题 / locale 链——**与全局 `Modal.confirm` 的最大差异**：全局版走独立 `createApp`，拿不到调用方 app 的 inject。

::: tip 何时用模块级 vs Hook 版？

- **`Modal.confirm({...})`**：脚手架 / utils / 命令式弹一条，简单直接，但**拿不到调用方 app 的 inject**。
- **`useModal()`**：当 confirm 弹窗需要继承父链 inject（自定义 ConfigProvider、主题、locale、formContext）时用。**必须**在模板中挂 `<component :is="holder" />` 保持 API 一致；hook 在 setup 阶段捕获 instance 并在 `modal.confirm()` 调用时**懒读** `inst.provides` 拿到最终 provides 链。

:::

:::demo

```vue
<script setup>
import { useModal } from '@vaebe/ccui'

const { modal, holder } = useModal()

function ask() {
  modal.confirm({
    title: '继承上下文',
    content: '我能读到父组件 provide 的 theme / locale / ConfigProvider',
    onOk: () => Promise.resolve(),
  })
}
</script>

<template>
  <component :is="holder" />
  <c-button type="primary" @click="ask">弹出（继承上下文）</c-button>
</template>
```

:::

### UseModalReturn

| 字段   | 类型        | 说明                                                             |
| ------ | ----------- | ---------------------------------------------------------------- |
| modal  | `ModalApi`  | 命令式 API：`confirm` / `info` / `success` / `error` / `warning` |
| holder | `Component` | 必须挂到模板：`<component :is="holder" />`                       |

### ModalFuncOptions

| 字段          | 类型                                 | 默认         | 说明                                                             |
| ------------- | ------------------------------------ | ------------ | ---------------------------------------------------------------- |
| title         | `string \| VNode`                    | —            | 标题                                                             |
| content       | `string \| VNode`                    | —            | 正文                                                             |
| type          | `ModalFuncType`                      | `'confirm'`  | `confirm` / `info` / `success` / `error` / `warning`             |
| icon          | `string \| VNode`                    | —            | 自定义图标（不传则按 type 渲染默认图标；传空字符串隐藏图标）     |
| width         | `number \| string`                   | `416`        | 弹窗宽度（命令式默认 416 比常规 Modal 的 520 更窄）              |
| centered      | boolean                              | `false`      | 垂直居中                                                         |
| mask          | boolean                              | `true`       | 遮罩                                                             |
| maskClosable  | boolean                              | `false`      | 点击遮罩关闭（confirm 系列默认 false）                           |
| keyboard      | boolean                              | `true`       | Esc 关闭                                                         |
| closable      | boolean                              | `false`      | 显示右上角关闭按钮                                               |
| okText        | string                               | `'确 定'`    | OK 按钮文字                                                      |
| cancelText    | string                               | `'取 消'`    | Cancel 按钮文字（仅 type='confirm' 渲染）                        |
| okType        | `'primary' \| 'danger' \| 'default'` | 按 type 推导 | OK 按钮类型                                                      |
| onOk          | `() => void \| Promise<unknown>`     | —            | OK 回调；返回 Promise 时按钮 loading 直到 resolve；reject 不关闭 |
| onCancel      | `() => void \| Promise<unknown>`     | —            | Cancel 回调                                                      |
| afterClose    | `() => void`                         | —            | 弹窗完全关闭并卸载 DOM 后触发（含离场动画完成）                  |
| zIndex        | number                               | —            | 透传 Modal `zIndex`                                              |
| wrapClassName | string                               | —            | 透传 Modal `wrapClassName`                                       |
| getContainer  | `(trigger) => HTMLElement \| null`   | `body`       | 透传 Modal `getContainer`                                        |

### ModalFuncReturn

| 字段    | 类型                                                                       | 说明                         |
| ------- | -------------------------------------------------------------------------- | ---------------------------- |
| destroy | `() => void`                                                               | 强制关闭并卸载               |
| update  | `(updater: Partial<ModalFuncOptions> \| ((prev) => Partial<...>)) => void` | 更新部分选项（合并，不替换） |

## API

### Props

| 参数                   | 类型                                                                                 | 默认值      | 说明                                                   |
| ---------------------- | ------------------------------------------------------------------------------------ | ----------- | ------------------------------------------------------ |
| open                   | boolean                                                                              | `false`     | 是否可见（支持 `v-model:open`）                        |
| visible                | boolean                                                                              | `false`     | @deprecated 请改用 `open`（仍可用 `v-model:visible`）  |
| title                  | string                                                                               | `''`        | 标题（也可用 `title` slot 自定义）                     |
| width                  | `number \| string`                                                                   | `520`       | 宽度，数字为 px                                        |
| closable               | `boolean \| { closeIcon?: VNode \| string; disabled?: boolean; ariaLabel?: string }` | `true`      | 关闭按钮配置；对象形支持自定义图标 / 禁用 / aria-label |
| maskClosable           | boolean                                                                              | `true`      | 点击蒙层是否关闭                                       |
| keyboard               | boolean                                                                              | `true`      | 按 Esc 是否关闭                                        |
| closeOnEsc             | boolean                                                                              | `true`      | @deprecated 请改用 `keyboard`                          |
| centered               | boolean                                                                              | `false`     | 是否垂直居中显示                                       |
| mask                   | boolean                                                                              | `true`      | 是否显示蒙层                                           |
| okText                 | string                                                                               | `'确 定'`   | 确认按钮文案                                           |
| cancelText             | string                                                                               | `'取 消'`   | 取消按钮文案                                           |
| okType                 | `'primary' \| 'danger' \| 'default'`                                                 | `'primary'` | 确认按钮类型                                           |
| confirmLoading         | boolean                                                                              | `false`     | 确认按钮加载态                                         |
| okLoading              | boolean                                                                              | `false`     | @deprecated 请改用 `confirmLoading`                    |
| footer                 | `string \| VNode \| null \| undefined`                                               | --          | 底部按钮区：`null` 隐藏；`string` / VNode 直接渲染     |
| hideFooter             | boolean                                                                              | `false`     | @deprecated 请改用 `footer={null}`                     |
| destroyOnClose         | boolean                                                                              | `false`     | 关闭时销毁内部内容（与 `keepAlive` 互斥）              |
| keepAlive              | boolean                                                                              | `false`     | 即使未打开也保留 DOM（与 `destroyOnClose` 互斥）       |
| wrapClassName          | string                                                                               | --          | 自定义根节点 class                                     |
| transitionName         | string                                                                               | --          | 自定义 Transition 名（空走内置 `-zoom`）               |
| maskTransitionName     | string                                                                               | --          | mask 自定义 Transition 名（空走内置 `-mask-fade`）     |
| focusTriggerAfterClose | boolean                                                                              | `true`      | 关闭后聚焦回打开前的触发元素                           |
| getContainer           | `(trigger: HTMLElement \| null) => HTMLElement \| null`                              | --          | 自定义挂载容器函数；返回 `null` 时内联渲染不 Teleport  |
| appendToBody           | boolean                                                                              | `true`      | @deprecated 请改用 `getContainer`                      |
| zIndex                 | number                                                                               | `1000`      | z-index                                                |

### Events

| 事件名            | 回调签名             | 触发时机                                                 |
| ----------------- | -------------------- | -------------------------------------------------------- |
| update:open       | `(open: boolean)`    | 显示状态变化（v-model:open）                             |
| update:visible    | `(visible: boolean)` | 同步触发，便于 `v-model:visible` 使用                    |
| after-open-change | `(open: boolean)`    | 打开 / 关闭动画完成后触发（immediate watch，首次 false） |
| ok                | `()`                 | 点击确认按钮                                             |
| cancel            | `()`                 | 点击取消 / 关闭 / Esc                                    |
| close             | `()`                 | 关闭过程中（先于 cancel）                                |
| open              | `()`                 | 开始展开                                                 |
| opened            | `()`                 | 展开动画完成                                             |
| closed            | `()`                 | 收起动画完成                                             |

### Slots

| 名称       | slot 参数        | 说明                                              |
| ---------- | ---------------- | ------------------------------------------------- |
| default    | -                | 弹窗内容                                          |
| title      | -                | 自定义标题区                                      |
| footer     | `{ ok, cancel }` | 自定义底部按钮（优先级高于 `footer` prop）        |
| close-icon | -                | 自定义关闭图标（优先级高于 `closable.closeIcon`） |
