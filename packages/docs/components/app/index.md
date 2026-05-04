# App 包裹组件

将应用包裹在 App 组件下，可通过 hooks 调用 `message` / `notification` / `modal` 等需要全局上下文的 API。

## 何时使用

- 项目根组件下统一挂载主题、消息上下文。
- 让 message/notification/modal 自动继承 ConfigProvider 配置。

## 基本使用

:::demo

```vue
<template>
  <c-app>
    <div>这里是主体内容</div>
  </c-app>
</template>
```

:::

## useApp

```ts
import { useApp } from 'vue3-ccui'

const { message, notification, modal } = useApp()
message.info?.('Hello')
```

> 当前 `message`/`notification`/`modal` API 为占位，将在中等组件 Message/Notification/Modal 完成时自动挂载实现。

## App 参数

| 参数      | 类型   | 默认值 | 说明       |
| --------- | ------ | ------ | ---------- |
| className | string | --     | 自定义类名 |
