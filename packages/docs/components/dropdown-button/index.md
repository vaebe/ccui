# DropdownButton 下拉按钮

主按钮 + 下拉触发按钮的组合控件，作为独立顶层组件存在（**不通过 Dropdown.Button 静态属性挂载**）。

::: tip 与 `<c-dropdown>` / `<c-button>` 的关系
DropdownButton 是 `<c-button>` + `<c-dropdown>` 的组合外壳：

- **主按钮**（左）承担主操作，点击发 `@click`；可独立配置 `loading` / `href` / `htmlType`。
- **下拉触发按钮**（右）打开 Dropdown 菜单；trigger / placement / items / `menu` slot 与 `<c-dropdown>` 完全一致。
- 两个按钮共享 `type` / `size` / `disabled` / `danger` 等视觉 props。
  :::

## 何时使用

- 主操作旁边附带次级操作菜单（如「保存 / 保存并继续 / 另存为」）。
- 表格行操作列：主按钮 + 「更多」下拉。

## 基本使用

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {
      items: [
        { key: '1', label: 'Edit' },
        { key: '2', label: 'Copy' },
        { key: '3', label: 'Delete', danger: true },
      ],
      onClick: () => console.log('main click'),
      onSelect: (item) => console.log('select', item),
    }
  },
})
</script>

<template>
  <c-dropdown-button :items="items" label="Action" @click="onClick" @select="onSelect" />
</template>
```

:::

## 主按钮自定义内容（default slot）

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {
      items: [
        { key: '1', label: 'Edit' },
        { key: '2', label: 'Delete', danger: true },
      ],
    }
  },
})
</script>

<template>
  <c-dropdown-button :items="items" type="primary"> <i class="i-tabler-bolt" /> Quick Action </c-dropdown-button>
</template>
```

:::

## 类型 / 尺寸 / 危险

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {
      items: [
        { key: '1', label: 'Edit' },
        { key: '2', label: 'Delete' },
      ],
    }
  },
})
</script>

<template>
  <c-space>
    <c-dropdown-button :items="items" label="Default" />
    <c-dropdown-button :items="items" label="Primary" type="primary" />
    <c-dropdown-button :items="items" label="Danger" danger />
    <c-dropdown-button :items="items" label="Small" size="small" />
    <c-dropdown-button :items="items" label="Large" size="large" />
    <c-dropdown-button :items="items" label="Disabled" disabled />
    <c-dropdown-button :items="items" label="Loading" loading />
  </c-space>
</template>
```

:::

## menu slot 自定义菜单

完全自渲染菜单结构；slot 接 `{ select }` 用于触发选择回调。

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  },
})
</script>

<template>
  <c-dropdown-button label="Custom" trigger="click">
    <template #menu="{ select }">
      <li class="ccui-dropdown__item" @click="select({ key: 'one', label: 'One' })">🍎 苹果</li>
      <li class="ccui-dropdown__item" @click="select({ key: 'two', label: 'Two' })">🍌 香蕉</li>
      <li class="ccui-dropdown__item ccui-dropdown__item--divided" @click="select({ key: 'three', label: 'Three' })">
        🍇 葡萄
      </li>
    </template>
  </c-dropdown-button>
</template>
```

:::

## 自定义下拉触发图标

`icon` slot > `icon` prop > 默认 CSS 三角。

:::demo

```vue
<template>
  <c-space>
    <c-dropdown-button label="Icon Slot">
      <template #icon><i class="i-tabler-dots" /></template>
    </c-dropdown-button>
    <c-dropdown-button label="Icon Prop" icon="i-tabler-chevron-down" />
  </c-space>
</template>
```

:::

## DropdownButton 参数

| 参数        | 类型                                  | 默认           | 说明                               |
| ----------- | ------------------------------------- | -------------- | ---------------------------------- |
| items       | `DropdownItem[]`                      | `[]`           | 下拉菜单项；menu slot 优先         |
| trigger     | `'hover' \| 'click' \| 'contextmenu'` | `'hover'`      | 下拉触发方式                       |
| placement   | `PopoverPlacement`                    | `'bottom-end'` | 下拉位置                           |
| visible     | `boolean`                             | -              | 受控可见态（v-model:visible）      |
| hideOnClick | `boolean`                             | `true`         | 选中后自动关闭                     |
| width       | `number \| string`                    | `''`           | 下拉菜单宽度                       |
| type        | `ButtonType`                          | `'default'`    | 两个按钮共享的 type                |
| size        | `'large' \| 'default' \| 'small'`     | `'default'`    | 两个按钮共享的 size                |
| disabled    | `boolean`                             | `false`        | 整体禁用                           |
| danger      | `boolean`                             | `false`        | 危险型，两个按钮同时变红           |
| loading     | `boolean`                             | `false`        | 主按钮 loading（下拉触发按钮不变） |
| label       | `string`                              | `''`           | 主按钮文本，default slot 优先      |
| icon        | `string`                              | `''`           | 下拉触发图标 class，icon slot 优先 |
| htmlType    | `'button' \| 'submit' \| 'reset'`     | `'button'`     | 主按钮原生 type                    |
| href        | `string`                              | `''`           | 主按钮 href（设置后渲染为 `<a>`）  |

## DropdownButton 事件

| 事件名         | 参数           | 说明                      |
| -------------- | -------------- | ------------------------- |
| click          | `MouseEvent`   | 点击主按钮                |
| select         | `DropdownItem` | 选中下拉菜单项            |
| update:visible | `boolean`      | 下拉可见态变化（v-model） |
| visible-change | `boolean`      | 下拉可见态变化            |

## DropdownButton 插槽

| 插槽名  | 作用域             | 说明                              |
| ------- | ------------------ | --------------------------------- |
| default | -                  | 主按钮内容（优先于 `label` prop） |
| icon    | -                  | 下拉触发按钮图标                  |
| menu    | `{ select(item) }` | 自渲染整个菜单（透传 Dropdown）   |
