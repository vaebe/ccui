# Dropdown 下拉菜单

点击或悬停后弹出的菜单。

## 基本使用

`items` 提供菜单项，触发器写在默认插槽里。

:::demo

```vue
<template>
  <c-dropdown
    :items="[
      { key: '1', label: '编辑' },
      { key: '2', label: '复制' },
      { key: '3', label: '删除', danger: true, divided: true },
    ]"
  >
    <c-button>更多操作 ▾</c-button>
  </c-dropdown>
</template>
```

:::

## 触发方式

通过 `trigger` 切换触发方式：`hover`（默认）/ `click` / `contextmenu`（右键）。

:::demo

```vue
<template>
  <c-dropdown trigger="hover" :items="[{ key: '1', label: '悬停显示' }]">
    <c-button>hover 触发</c-button>
  </c-dropdown>
  &nbsp;
  <c-dropdown trigger="click" :items="[{ key: '1', label: '点我才显示' }]">
    <c-button>click 触发</c-button>
  </c-dropdown>
  &nbsp;
  <c-dropdown trigger="contextmenu" :items="[{ key: '1', label: '右键菜单' }]">
    <c-button>右键此处</c-button>
  </c-dropdown>
</template>
```

:::

## 禁用项与危险项

`disabled` 让单项不可点；`danger` 让单项使用错误色突出（常用于"删除"）；`divided` 在该项上方加分隔线。

:::demo

```vue
<template>
  <c-dropdown
    :items="[
      { key: '1', label: '查看' },
      { key: '2', label: '编辑（禁用）', disabled: true },
      { key: '3', label: '导出' },
      { key: '4', label: '删除', danger: true, divided: true },
    ]"
  >
    <c-button>操作</c-button>
  </c-dropdown>
</template>
```

:::

## 监听选择

`select` 事件返回被选中的菜单项对象。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const last = ref('未选择')

function onSelect(item) {
  last.value = `${item.label}（key=${item.key}）`
}
</script>

<template>
  <c-dropdown
    :items="[
      { key: 'a', label: '选项 A' },
      { key: 'b', label: '选项 B' },
      { key: 'c', label: '选项 C' },
    ]"
    @select="onSelect"
  >
    <c-button>请选择</c-button>
  </c-dropdown>
  <p style="margin-top: 12px">最近选中：{{ last }}</p>
</template>
```

:::

## 弹出方位

`placement` 与 Popover 一致，支持 12 个方位。

:::demo

```vue
<template>
  <c-dropdown placement="top-start" :items="[{ key: '1', label: '弹向上方' }]">
    <c-button>top-start</c-button>
  </c-dropdown>
  &nbsp;
  <c-dropdown placement="bottom-end" :items="[{ key: '1', label: '右下对齐' }]">
    <c-button>bottom-end</c-button>
  </c-dropdown>
  &nbsp;
  <c-dropdown placement="right-start" :items="[{ key: '1', label: '弹向右侧' }]">
    <c-button>right-start</c-button>
  </c-dropdown>
</template>
```

:::

## 受控显示

通过 `v-model:visible` 自己控制开合，便于联动外部逻辑。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <c-button @click="visible = !visible">外部按钮：{{ visible ? '关闭' : '打开' }}</c-button>
  <c-dropdown
    v-model:visible="visible"
    trigger="click"
    :items="[
      { key: '1', label: '受控状态项 1' },
      { key: '2', label: '受控状态项 2' },
    ]"
  >
    <c-button style="margin-inline-start: 12px">触发器</c-button>
  </c-dropdown>
</template>
```

:::

## API

### Props

| 参数        | 类型                                  | 默认值           | 说明                                 |
| ----------- | ------------------------------------- | ---------------- | ------------------------------------ |
| items       | `DropdownItem[]`                      | `[]`             | 菜单项列表                           |
| trigger     | `'hover' \| 'click' \| 'contextmenu'` | `'hover'`        | 触发方式                             |
| placement   | `PopoverPlacement`                    | `'bottom-start'` | 弹出方位（与 Popover 一致）          |
| disabled    | boolean                               | `false`          | 禁用整个下拉                         |
| visible     | boolean                               | `undefined`      | 受控显示状态，支持 `v-model:visible` |
| hideOnClick | boolean                               | `true`           | 点击菜单项后是否自动收起             |
| width       | `number \| string`                    | `''`             | 弹层最小宽度                         |

### DropdownItem

| 字段     | 类型               | 说明                                   |
| -------- | ------------------ | -------------------------------------- |
| key      | `string \| number` | 唯一标识                               |
| label    | string             | 显示文本                               |
| icon     | string             | 图标 class（可选）                     |
| disabled | boolean            | 是否禁用                               |
| divided  | boolean            | 在该项上方加分隔线                     |
| danger   | boolean            | 危险项样式（红色文本，hover 红底白字） |

### Events

| 事件名         | 回调签名               | 触发时机            |
| -------------- | ---------------------- | ------------------- |
| select         | `(item: DropdownItem)` | 点击某一项时触发    |
| update:visible | `(visible: boolean)`   | 弹层显示状态变化    |
| visible-change | `(visible: boolean)`   | 同 `update:visible` |

### Slots

| 名称    | 说明                                                                      |
| ------- | ------------------------------------------------------------------------- |
| default | 触发器                                                                    |
| menu    | 自定义菜单内容（不使用 `items`），slot 参数 `{ select }` 用于主动收起菜单 |
