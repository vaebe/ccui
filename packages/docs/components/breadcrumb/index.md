# Breadcrumb 面包屑

显示当前页面在系统层级结构中的位置，并能向上返回。

## 何时使用

- 当系统拥有超过两级以上的层级结构时。
- 需要告知用户当前位置时。
- 需要向上导航的功能时。

## 基本使用

:::demo

```vue
<template>
  <c-breadcrumb>
    <c-breadcrumb-item>
      <a href="#">Home</a>
    </c-breadcrumb-item>
    <c-breadcrumb-item>
      <a href="#">Application Center</a>
    </c-breadcrumb-item>
    <c-breadcrumb-item>
      <a href="#">Application List</a>
    </c-breadcrumb-item>
    <c-breadcrumb-item>An Application</c-breadcrumb-item>
  </c-breadcrumb>
</template>
```

:::

## 通过 routes 配置

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {
      routes: [
        { breadcrumbName: 'Home', href: '/' },
        { breadcrumbName: 'Application List', path: '/list' },
        { breadcrumbName: 'Detail' },
      ],
    }
  },
})
</script>

<template>
  <c-breadcrumb :routes="routes" separator=">" />
</template>
```

:::

## Breadcrumb 参数

| 参数      | 类型              | 默认值 | 说明     |
| --------- | ----------------- | ------ | -------- |
| separator | string            | '/'    | 分隔符   |
| routes    | BreadcrumbRoute[] | []     | 路由数据 |

## BreadcrumbItem 参数

| 参数      | 类型   | 默认值 | 说明         |
| --------- | ------ | ------ | ------------ |
| href      | string | --     | 链接地址     |
| separator | string | --     | 自定义分隔符 |

## BreadcrumbItem 插槽

| 插槽名    | 说明         |
| --------- | ------------ |
| default   | 内容         |
| separator | 自定义分隔符 |
