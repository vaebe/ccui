# Popconfirm 气泡确认

在被点击的元素附近弹出二次确认气泡。比 Modal 轻量，适合"删除 / 重置 / 注销"等需要明确反悔机会的危险操作。

## 基本使用

`title` 是主问句；用 `description` 补充后果说明。点确定 / 取消都会自动收起。

:::demo

```vue
<script setup>
import { message } from '@vaebe/ccui'

function onConfirm() {
  message.success('已删除')
}
function onCancel() {
  message.info('已取消')
}
</script>

<template>
  <c-popconfirm title="确认删除？" description="此操作不可恢复" @confirm="onConfirm" @cancel="onCancel">
    <c-button type="danger">删除</c-button>
  </c-popconfirm>
</template>
```

:::

## 自定义按钮文案

`confirm-text` / `cancel-text` 调整按钮文字，业务话术更顺。

:::demo

```vue
<template>
  <c-popconfirm title="保存修改？" confirm-text="保存" cancel-text="放弃">
    <c-button type="primary">保存</c-button>
  </c-popconfirm>
</template>
```

:::

## 不同确定按钮风格

`confirm-type` 切换确定按钮风格：`primary`（默认蓝）/ `danger`（红）/ `default`（次按钮）。

:::demo

```vue
<template>
  <c-popconfirm title="确定执行？" confirm-type="primary">
    <c-button type="primary">primary</c-button>
  </c-popconfirm>
  &nbsp;
  <c-popconfirm title="确定删除？" confirm-type="danger">
    <c-button type="danger">danger</c-button>
  </c-popconfirm>
  &nbsp;
  <c-popconfirm title="保留旧数据？" confirm-type="default">
    <c-button>default</c-button>
  </c-popconfirm>
</template>
```

:::

## 改变弹出方位

`placement` 与 Popover 一致，支持 12 个方位。

:::demo

```vue
<template>
  <c-popconfirm title="弹向上方？" placement="top">
    <c-button>top</c-button>
  </c-popconfirm>
  &nbsp;
  <c-popconfirm title="弹向右侧？" placement="right">
    <c-button>right</c-button>
  </c-popconfirm>
  &nbsp;
  <c-popconfirm title="弹向左下？" placement="bottom-end">
    <c-button>bottom-end</c-button>
  </c-popconfirm>
</template>
```

:::

## 隐藏图标 + 自定义图标颜色

`hide-icon` 完全去掉前置感叹号；保留时可用 `icon-color` 调整颜色（默认是警告黄）。

:::demo

```vue
<template>
  <c-popconfirm title="主色感叹号" icon-color="#1677ff">
    <c-button>蓝色图标</c-button>
  </c-popconfirm>
  &nbsp;
  <c-popconfirm title="无图标" hide-icon>
    <c-button>无图标</c-button>
  </c-popconfirm>
</template>
```

:::

## 受控显示

通过 `v-model:visible` 自己掌控开合，常用于"先做异步校验再决定要不要弹"。

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { message } from '@vaebe/ccui'

const visible = ref(false)

async function tryDelete() {
  // 异步校验：模拟 500ms
  await new Promise((r) => setTimeout(r, 300))
  visible.value = true
}

function confirm() {
  message.success('已删除')
  visible.value = false
}
</script>

<template>
  <c-popconfirm v-model:visible="visible" title="后端校验通过，确认删除？" trigger="manual" @confirm="confirm">
    <c-button type="danger" @click="tryDelete">校验后再删</c-button>
  </c-popconfirm>
</template>
```

:::

## API

### Props

| 参数                | 类型                                        | 默认值      | 说明                                                     |
| ------------------- | ------------------------------------------- | ----------- | -------------------------------------------------------- |
| title               | string                                      | `''`        | 主问句                                                   |
| description         | string                                      | `''`        | 补充说明（可选）                                         |
| placement           | `PopoverPlacement`                          | `'top'`     | 12 方位之一                                              |
| okText              | string                                      | `'确 定'`   | 确定按钮文案（未传时走 ConfigProvider locale）           |
| confirmText         | string                                      | `''`        | **(deprecated)** 请改用 `okText`                         |
| cancelText          | string                                      | `'取 消'`   | 取消按钮文案                                             |
| okType              | `'primary' \| 'danger' \| 'default'`        | `'primary'` | 确定按钮类型                                             |
| confirmType         | `'primary' \| 'danger' \| 'default'`        | `'primary'` | **(deprecated)** 请改用 `okType`                         |
| icon                | string                                      | `''`        | 自定义 icon 类名（覆盖默认感叹号）                       |
| iconColor           | string                                      | `'#faad14'` | 图标颜色                                                 |
| hideIcon            | boolean                                     | `false`     | 隐藏前置图标                                             |
| width               | `number \| string`                          | `''`        | 弹出层宽度                                               |
| disabled            | boolean                                     | `false`     | 禁用整个弹出（点击不响应）                               |
| open / v-model:open | boolean                                     | `undefined` | 受控显示状态                                             |
| visible             | boolean                                     | `undefined` | **(deprecated)** 请改用 `open`（仍可 `v-model:visible`） |
| trigger             | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'click'`   | 触发方式                                                 |

### Events

| 事件名         | 回调签名             | 触发时机                              |
| -------------- | -------------------- | ------------------------------------- |
| confirm        | `(e: MouseEvent)`    | 点击"确定"按钮                        |
| cancel         | `(e: MouseEvent)`    | 点击"取消"按钮                        |
| update:open    | `(open: boolean)`    | v-model:open 同步                     |
| update:visible | `(visible: boolean)` | 同步触发，便于 `v-model:visible` 使用 |

### Slots

| 名称        | 说明                                                      |
| ----------- | --------------------------------------------------------- |
| default     | 触发气泡的元素                                            |
| title       | 自定义标题                                                |
| description | 自定义描述                                                |
| actions     | 自定义底部按钮（参数 `{ confirm, cancel }` 用于主动收起） |
