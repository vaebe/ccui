# ErrorBoundary 错误边界

错误边界容器，对标 Ant Design `Alert.ErrorBoundary`，作为独立顶层组件存在（**不挂到 Alert 命名空间**）。Vue 内部用 `onErrorCaptured` 实现。

::: tip 与 Alert 的关系
ccui 不沿用 ant 的 `Alert.ErrorBoundary` 静态属性命名空间；直接平铺 `<c-error-boundary>`。fallback 内部仍用 `<c-alert type="error">` 渲染默认错误视图，但 API 不对外暴露该绑定关系。
:::

::: warning 捕获范围
Vue 的 `onErrorCaptured` 同 React error boundary 一样**只捕同步渲染错误 + lifecycle hook 错误**，不捕：

- 异步操作（`setTimeout` / `Promise.reject`）内部抛的错
- 原生事件处理器内部抛的错（DOM listener 调用栈不在 Vue 调度内）

异步错误应在业务侧用 `try / catch` 包裹，把错误存到 ref 后通过条件渲染传给 ErrorBoundary 的 `setError` 模式（手动控制）。
:::

## 何时使用

- 包裹动态加载的子模块、第三方组件，防止它们抛错导致整个页面白屏。
- 给「用户提交内容渲染」类区域（如富文本、动态表单）兜底。

## 基本使用

子组件抛错时，ErrorBoundary 渲染默认 Alert 错误提示替代 default slot。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { defineComponent } from 'vue'

const boom = ref(false)
const Bomb = defineComponent({
  setup() {
    if (boom.value) throw new Error('演示错误：组件加载失败')
    return () => '正常子组件'
  },
})
</script>

<template>
  <c-space direction="vertical">
    <c-button @click="boom = !boom">{{ boom ? '修复' : '触发错误' }}</c-button>
    <c-error-boundary message="组件加载失败" description="点击上方按钮切换状态">
      <Bomb />
    </c-error-boundary>
  </c-space>
</template>
```

:::

## 自定义 fallback

通过 `#fallback` slot 完全替代内置 Alert。slot scope 包含 `{ error, errorInfo, reset }`。

:::demo

```vue
<script setup lang="ts">
import { defineComponent } from 'vue'

const Bomb = defineComponent({
  setup() {
    throw new Error('Network failed')
  },
})
</script>

<template>
  <c-error-boundary>
    <template #fallback="{ error, reset }">
      <div style="padding: 16px; border: 1px solid #ff4d4f; border-radius: 4px; color: #ff4d4f">
        <p>出错了：{{ error.message }}</p>
        <c-button size="small" @click="reset">重试</c-button>
      </div>
    </template>
    <Bomb />
  </c-error-boundary>
</template>
```

:::

## 监听 @error 事件做日志上报

:::demo

```vue
<script setup lang="ts">
import { defineComponent } from 'vue'

const Bomb = defineComponent({
  setup() {
    throw new Error('Sentry test')
  },
})

function reportError(error, info) {
  // 上报到 Sentry / 自家监控
  console.error('[ErrorBoundary] captured:', error.message, info)
}
</script>

<template>
  <c-error-boundary @error="reportError">
    <Bomb />
  </c-error-boundary>
</template>
```

:::

## reset() 暴露方法

通过 ref 调用 `reset()` 清除错误态，恢复 default slot 渲染。

```vue
<script setup>
import { ref } from 'vue'
const boundRef = ref()
function handleRetry() {
  boundRef.value?.reset()
}
</script>

<template>
  <c-error-boundary ref="boundRef">
    <ChildThatMightThrow />
  </c-error-boundary>
</template>
```

## ErrorBoundary 参数

| 参数        | 类型     | 默认 | 说明                                |
| ----------- | -------- | ---- | ----------------------------------- |
| message     | `string` | `''` | 错误标题（slot `message` 优先）      |
| description | `string` | `''` | 错误描述（slot `description` 优先）  |

## ErrorBoundary 事件

| 事件   | 参数                       | 说明                                     |
| ------ | -------------------------- | ---------------------------------------- |
| error  | `(error: Error, info: string)` | 捕获到错误时触发                          |
| reset  | -                          | 调用 `reset()` 清除错误态后触发           |

## ErrorBoundary 插槽

| 插槽名       | 作用域                              | 说明                                  |
| ------------ | ----------------------------------- | ------------------------------------- |
| default      | -                                   | 受保护的子树                          |
| fallback     | `{ error, errorInfo, reset }`       | 自定义错误视图，完全替代内置 Alert      |
| message      | -                                   | 自定义 Alert 标题                      |
| description  | -                                   | 自定义 Alert 描述                      |

## ErrorBoundary 暴露方法

| 方法名 | 签名         | 说明                                      |
| ------ | ------------ | ----------------------------------------- |
| reset  | `() => void` | 清除错误态，恢复 default slot 渲染          |
| error  | `Ref<Error \| null>` | 当前捕获到的错误（响应式）             |
