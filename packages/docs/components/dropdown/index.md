# Dropdown 下拉菜单

点击或悬停后弹出的菜单。

## 基本使用

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

:::demo

```vue
<template>
  <c-dropdown trigger="click" :items="[{ key: '1', label: '点我才显示' }]">
    <c-button>click 触发</c-button>
  </c-dropdown>
  &nbsp;
  <c-dropdown trigger="hover" :items="[{ key: '1', label: '悬停显示' }]">
    <c-button>hover 触发</c-button>
  </c-dropdown>
</template>
```

:::
