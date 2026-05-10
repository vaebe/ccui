# Collapse 折叠面板

将复杂的内容折叠收起，按需展开。常用于"分组配置"、"问答列表"、"层级日志"。

## 基本使用

`v-model` 绑定数组，元素是当前展开的 `name`。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const value = ref(['1'])
</script>

<template>
  <c-collapse v-model="value">
    <c-collapse-item name="1" title="面板一">默认展开的内容。</c-collapse-item>
    <c-collapse-item name="2" title="面板二">点击标题展开。</c-collapse-item>
    <c-collapse-item name="3" title="面板三（禁用）" disabled>
      面板被禁用，无法展开。
    </c-collapse-item>
  </c-collapse>
</template>
```

:::

## 手风琴模式

`accordion` 让任意时刻最多只展开一项；此时 `v-model` 是单值。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const v = ref('a')
</script>

<template>
  <c-collapse v-model="v" accordion>
    <c-collapse-item name="a" title="A 面板">A 的详情内容</c-collapse-item>
    <c-collapse-item name="b" title="B 面板">B 的详情内容</c-collapse-item>
    <c-collapse-item name="c" title="C 面板">C 的详情内容</c-collapse-item>
  </c-collapse>
</template>
```

:::

## 无边框 / 幽灵风格

`bordered={false}` 去掉外圈描边；`ghost` 进一步去掉背景色，与页面融为一体。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const a = ref(['1'])
const b = ref(['1'])
</script>

<template>
  <p style="color: #666; margin-bottom: 4px">bordered=false</p>
  <c-collapse v-model="a" :bordered="false">
    <c-collapse-item name="1" title="无边框面板一">内容</c-collapse-item>
    <c-collapse-item name="2" title="无边框面板二">内容</c-collapse-item>
  </c-collapse>

  <p style="color: #666; margin-top: 16px; margin-bottom: 4px">ghost</p>
  <c-collapse v-model="b" ghost>
    <c-collapse-item name="1" title="幽灵面板一">内容</c-collapse-item>
    <c-collapse-item name="2" title="幽灵面板二">内容</c-collapse-item>
  </c-collapse>
</template>
```

:::

## 展开图标位置

`expand-icon-position` 把箭头放在 `start`（默认）或 `end`（标题右端）。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const v = ref(['1'])
</script>

<template>
  <c-collapse v-model="v" expand-icon-position="end">
    <c-collapse-item name="1" title="箭头放右边">内容靠右展开图标</c-collapse-item>
    <c-collapse-item name="2" title="另一面板">内容</c-collapse-item>
  </c-collapse>
</template>
```

:::

## 自定义标题

每个 item 都可用 `#title` slot 自定义标题，放图标 / 标签 / 副文案都可以。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const v = ref(['1'])
</script>

<template>
  <c-collapse v-model="v">
    <c-collapse-item name="1">
      <template #title>
        <span style="font-weight: 600">订单 #2025-001</span>
        <c-tag color="success" style="margin-inline-start: 8px">已发货</c-tag>
      </template>
      <p>订单详情内容…</p>
    </c-collapse-item>
    <c-collapse-item name="2" title="订单 #2025-002">
      <p>另一笔订单</p>
    </c-collapse-item>
  </c-collapse>
</template>
```

:::

## 监听变化

`change` 事件在展开 / 收起时触发，参数是当前激活的 name 数组（accordion 模式下是单值）。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const v = ref(['1'])
const log = ref('（无）')

function onChange(names) {
  log.value = JSON.stringify(names)
}
</script>

<template>
  <c-collapse v-model="v" @change="onChange">
    <c-collapse-item name="1" title="面板一">内容 1</c-collapse-item>
    <c-collapse-item name="2" title="面板二">内容 2</c-collapse-item>
    <c-collapse-item name="3" title="面板三">内容 3</c-collapse-item>
  </c-collapse>
  <p style="margin-top: 8px; color: #666">最近一次激活：{{ log }}</p>
</template>
```

:::

## API

### Collapse Props

| 参数               | 类型                                       | 默认值    | 说明                                                  |
| ------------------ | ------------------------------------------ | --------- | ----------------------------------------------------- |
| modelValue         | `string \| number \| (string\|number)[]`   | `[]`      | 展开的 name；accordion 模式下是单值                   |
| accordion          | boolean                                    | `false`   | 手风琴模式（同时只展开一项）                          |
| bordered           | boolean                                    | `true`    | 是否带外框                                            |
| ghost              | boolean                                    | `false`   | 透明背景（无填充）                                    |
| expandIconPosition | `'start' \| 'end'`                         | `'start'` | 展开图标位置                                          |

### Collapse Events

| 事件名            | 回调签名                                   | 触发时机              |
| ----------------- | ------------------------------------------ | --------------------- |
| update:modelValue | `(names: string \| number \| (...)[])`     | 激活项变化            |
| change            | 同上                                       | 同上（语义化别名）    |

### CollapseItem Props

| 参数      | 类型                | 默认值 | 说明                       |
| --------- | ------------------- | ------ | -------------------------- |
| name      | `string \| number`  | —      | 必填，唯一标识             |
| title     | string              | `''`   | 标题（也可用 `#title` slot） |
| disabled  | boolean             | `false`| 禁用展开                   |
| showArrow | boolean             | `true` | 是否显示展开箭头           |

### CollapseItem Slots

| 名称    | 说明        |
| ------- | ----------- |
| default | 面板内容    |
| title   | 自定义标题  |
