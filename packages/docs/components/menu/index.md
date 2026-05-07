# Menu 导航菜单

为页面、侧边栏和应用顶部提供导航。功能和视觉优先对齐 Ant Design Menu 的高频用法，同时保持 Vue 组件的声明式 props、`v-model` 和事件风格；React 专属的 `ReactNode`、`items` 渲染约定不会直接照搬。

## 基本用法

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const selectedKeys = ref(['mail'])

const items = [
  { key: 'mail', label: '邮件', icon: 'i-mail' },
  { key: 'app', label: '应用', icon: 'i-appstore' },
  { key: 'disabled', label: '禁用项', disabled: true },
]
</script>

<template>
  <c-menu v-model:selected-keys="selectedKeys" mode="horizontal" :items="items" />
</template>
```

:::

## 内联子菜单

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const selectedKeys = ref(['1'])
const openKeys = ref(['sub1'])

const items = [
  {
    key: 'sub1',
    label: '导航一',
    type: 'submenu',
    children: [
      { key: '1', label: '选项一' },
      { key: '2', label: '选项二' },
    ],
  },
  {
    key: 'sub2',
    label: '导航二',
    type: 'submenu',
    children: [
      { key: '3', label: '选项三' },
      { key: '4', label: '危险操作', danger: true },
    ],
  },
]
</script>

<template>
  <c-menu
    v-model:selected-keys="selectedKeys"
    v-model:open-keys="openKeys"
    mode="inline"
    style="width: 256px"
    :items="items"
  />
</template>
```

:::

## 默认展开与默认选中

适合只需要初始化状态的场景，后续由组件内部状态维护。需要由业务状态接管时，使用 `v-model:selected-keys` 和 `v-model:open-keys`。

:::demo

```vue
<template>
  <c-menu
    mode="inline"
    style="width: 256px"
    :default-selected-keys="['dashboard']"
    :default-open-keys="['workbench']"
    :items="[
      {
        key: 'workbench',
        label: '工作台',
        children: [
          { key: 'dashboard', label: '仪表盘' },
          { key: 'analysis', label: '分析页' },
        ],
      },
    ]"
  />
</template>
```

:::

## 多选菜单

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const selectedKeys = ref(['read'])

const items = [
  { key: 'read', label: '只读权限' },
  { key: 'write', label: '写入权限' },
  { key: 'admin', label: '管理员权限', danger: true },
]
</script>

<template>
  <c-menu v-model:selected-keys="selectedKeys" multiple :items="items" />
</template>
```

:::

## 分组、分割线和额外内容

:::demo

```vue
<template>
  <c-menu
    style="width: 256px"
    :items="[
      {
        key: 'group-basic',
        type: 'group',
        label: '常用',
        children: [
          { key: 'profile', label: '个人资料', extra: 'Ctrl+P' },
          { key: 'settings', label: '设置' },
        ],
      },
      { key: 'divider-1', type: 'divider' },
      { key: 'logout', label: '退出登录', danger: true },
    ]"
  />
</template>
```

:::

## 暗色主题和收起

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const collapsed = ref(false)

const items = [
  { key: 'home', label: '首页', icon: 'i-home' },
  {
    key: 'system',
    label: '系统',
    icon: 'i-setting',
    children: [
      { key: 'users', label: '用户' },
      { key: 'roles', label: '角色' },
    ],
  },
]
</script>

<template>
  <button type="button" @click="collapsed = !collapsed">切换</button>
  <c-menu theme="dark" mode="inline" :inline-collapsed="collapsed" :default-open-keys="['system']" :items="items" />
</template>
```

:::

## Vue 状态语义

Menu 的状态说明以 Vue API 为准：

- 需要业务状态接管时，使用 `v-model:selected-keys` 和 `v-model:open-keys`。
- 只需要初始化状态时，使用 `default-selected-keys` 和 `default-open-keys`，后续由组件内部状态维护。
- 文档中避免使用 React 语境的 controlled / uncontrolled 作为主要说明。

## API 对齐说明

Menu 的功能参考 Ant Design Menu 的常用能力：`items`、`mode`、`theme`、`selectedKeys`、`openKeys`、`defaultSelectedKeys`、`defaultOpenKeys`、`inlineCollapsed`、`multiple`、`selectable`、`forceSubMenuRender`、`triggerSubMenuAction` 等。

Vue 项目优先使用：

- `v-model:selected-keys` 替代 React 语境里的 `selectedKeys + onSelect` 写法。
- `v-model:open-keys` 替代 React 语境里的 `openKeys + onOpenChange` 写法。
- `items` 支持普通对象、分组和分割线；复杂节点建议用 Vue 插槽或 VNode，不要求 ReactNode。

## Menu Props

| 参数                 | 类型                                 | 默认值      | 说明                                           |
| -------------------- | ------------------------------------ | ----------- | ---------------------------------------------- |
| mode                 | `vertical` / `horizontal` / `inline` | `vertical`  | 菜单类型                                       |
| theme                | `light` / `dark`                     | `light`     | 主题                                           |
| items                | `MenuItem[]`                         | `[]`        | 菜单数据                                       |
| selectedKeys         | `(string \| number)[]`               | `[]`        | 当前选中的菜单项，支持 `v-model:selected-keys` |
| defaultSelectedKeys  | `(string \| number)[]`               | `[]`        | 默认选中的菜单项                               |
| openKeys             | `(string \| number)[]`               | `[]`        | 当前展开的子菜单，支持 `v-model:open-keys`     |
| defaultOpenKeys      | `(string \| number)[]`               | `[]`        | 默认展开的子菜单                               |
| inlineIndent         | `number`                             | `24`        | inline 模式下每级缩进                          |
| collapsed            | `boolean`                            | `false`     | 收起菜单，保留兼容属性                         |
| inlineCollapsed      | `boolean`                            | `undefined` | inline 模式收起状态，优先级高于 `collapsed`    |
| multiple             | `boolean`                            | `false`     | 是否允许多选                                   |
| selectable           | `boolean`                            | `true`      | 是否允许选中菜单项                             |
| disabled             | `boolean`                            | `false`     | 是否禁用整个菜单                               |
| accordion            | `boolean`                            | `false`     | 是否只展开一个顶层子菜单                       |
| forceSubMenuRender   | `boolean`                            | `false`     | 是否强制渲染未展开的子菜单 DOM                 |
| triggerSubMenuAction | `click` / `hover`                    | `click`     | 子菜单展开触发方式                             |

## MenuItem

```ts
interface MenuItem {
  key: string | number
  label?: VNodeChild
  title?: string
  icon?: string
  disabled?: boolean
  danger?: boolean
  extra?: VNodeChild
  type?: 'item' | 'submenu' | 'group' | 'divider'
  children?: MenuItem[]
}
```

## Events

| 事件                | 说明                                                  |
| ------------------- | ----------------------------------------------------- |
| update:selectedKeys | 选中项变化，用于 `v-model:selected-keys`              |
| update:openKeys     | 展开项变化，用于 `v-model:open-keys`                  |
| click               | 点击菜单项，参数为 `MenuInfo`                         |
| select              | 选中菜单项，参数为 `MenuInfo`                         |
| deselect            | 多选模式下取消选中，参数为 `MenuInfo`                 |
| open-change         | 子菜单展开状态变化，参数为 `(openKeys, MenuOpenInfo)` |
| openChange          | `open-change` 的 camelCase 事件别名                   |

## 键盘交互

- `ArrowUp` / `ArrowDown`：在可见菜单项中移动焦点。
- `ArrowLeft` / `ArrowRight`：在水平菜单中移动焦点，在子菜单上收起或展开。
- `Enter` / `Space`：选中当前菜单项或切换当前子菜单。
