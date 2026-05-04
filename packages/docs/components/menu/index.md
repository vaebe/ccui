# Menu 导航菜单

垂直、水平、嵌套菜单。

## 水平菜单

:::demo

```vue
<template>
  <c-menu
    mode="horizontal"
    :selected-keys="['mail']"
    :items="[
      { key: 'mail', label: '邮件' },
      { key: 'app', label: '应用' },
      { key: 'link', label: '禁用', disabled: true },
    ]"
  />
</template>
```

:::

## 垂直 + 子菜单

:::demo

```vue
<template>
  <c-menu
    mode="inline"
    style="width: 240px"
    :open-keys="['sub1']"
    :items="[
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
        children: [{ key: '3', label: '选项三' }],
      },
    ]"
  />
</template>
```

:::

## 暗色主题

:::demo

```vue
<template>
  <c-menu
    theme="dark"
    mode="horizontal"
    :selected-keys="['1']"
    :items="[
      { key: '1', label: '首页' },
      { key: '2', label: '产品' },
      { key: '3', label: '关于' },
    ]"
  />
</template>
```

:::
