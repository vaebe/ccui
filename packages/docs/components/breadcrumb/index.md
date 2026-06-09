# Breadcrumb 面包屑

显示当前页面在系统层级中的位置，并提供向上导航能力。

## 何时使用

- 系统层级 ≥ 3 级时辅助用户定位。
- 详情页头部展示 "返回路径"，支持多级跳转回。

## 基本使用

最常见的写法：用一组 `<c-breadcrumb-item>` 组合，最末一级是当前页（不带链接）。

:::demo

```vue
<template>
  <c-breadcrumb>
    <c-breadcrumb-item>
      <a href="#">首页</a>
    </c-breadcrumb-item>
    <c-breadcrumb-item>
      <a href="#">应用中心</a>
    </c-breadcrumb-item>
    <c-breadcrumb-item>
      <a href="#">应用列表</a>
    </c-breadcrumb-item>
    <c-breadcrumb-item>某个应用</c-breadcrumb-item>
  </c-breadcrumb>
</template>
```

:::

## 用 routes 数据驱动

适合从路由表 / 后端响应直接生成路径。`routes[i].href` 提供链接，`routes[i].breadcrumbName` 提供文字；最末一项不渲染为 `<a>`。

:::demo

```vue
<script setup>
const routes = [
  { breadcrumbName: '首页', href: '/' },
  { breadcrumbName: '应用列表', href: '/apps' },
  { breadcrumbName: '应用详情' },
]
</script>

<template>
  <c-breadcrumb :routes="routes" />
</template>
```

:::

## 自定义分隔符

`separator` 可以是任意字符串。

:::demo

```vue
<template>
  <c-breadcrumb separator=">">
    <c-breadcrumb-item><a href="#">Home</a></c-breadcrumb-item>
    <c-breadcrumb-item><a href="#">Docs</a></c-breadcrumb-item>
    <c-breadcrumb-item>Breadcrumb</c-breadcrumb-item>
  </c-breadcrumb>

  <c-breadcrumb separator="·" style="margin-top: 8px">
    <c-breadcrumb-item><a href="#">A</a></c-breadcrumb-item>
    <c-breadcrumb-item><a href="#">B</a></c-breadcrumb-item>
    <c-breadcrumb-item>C</c-breadcrumb-item>
  </c-breadcrumb>
</template>
```

:::

## 单项自定义分隔符

某项的 `separator` 属性会覆盖整组的分隔符。

:::demo

```vue
<template>
  <c-breadcrumb>
    <c-breadcrumb-item><a href="#">首页</a></c-breadcrumb-item>
    <c-breadcrumb-item separator="→"><a href="#">商品</a></c-breadcrumb-item>
    <c-breadcrumb-item>详情</c-breadcrumb-item>
  </c-breadcrumb>
</template>
```

:::

## 用 #separator 插槽

用 slot 写自定义分隔符，可以放图标 / SVG / 文字组合。

:::demo

```vue
<template>
  <c-breadcrumb>
    <c-breadcrumb-item href="#">
      首页
      <template #separator>
        <span style="color: var(--ccui-color-primary); margin: 0 8px">»</span>
      </template>
    </c-breadcrumb-item>
    <c-breadcrumb-item href="#">
      工单
      <template #separator>
        <span style="color: var(--ccui-color-primary); margin: 0 8px">»</span>
      </template>
    </c-breadcrumb-item>
    <c-breadcrumb-item>详情</c-breadcrumb-item>
  </c-breadcrumb>
</template>
```

:::

## 配合按钮

面包屑右侧常和操作按钮并列，可用 flex 布局。

:::demo

```vue
<template>
  <div
    style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: var(--ccui-area); border-radius: 6px"
  >
    <c-breadcrumb>
      <c-breadcrumb-item><a href="#">首页</a></c-breadcrumb-item>
      <c-breadcrumb-item><a href="#">订单</a></c-breadcrumb-item>
      <c-breadcrumb-item>#202504</c-breadcrumb-item>
    </c-breadcrumb>
    <c-button type="primary">新建订单</c-button>
  </div>
</template>
```

:::

## API

### Breadcrumb Props

| 参数      | 类型                | 默认值 | 说明                           |
| --------- | ------------------- | ------ | ------------------------------ |
| separator | string              | `'/'`  | 分隔符                         |
| routes    | `BreadcrumbRoute[]` | `[]`   | 路由数据，提供时优先于默认插槽 |

### BreadcrumbRoute

| 字段           | 类型   | 说明                                 |
| -------------- | ------ | ------------------------------------ |
| breadcrumbName | string | 显示文本                             |
| title          | string | `breadcrumbName` 的别名              |
| href           | string | 链接地址                             |
| path           | string | 链接地址（兼容字段，与 `href` 等价） |

### BreadcrumbItem Props

| 参数      | 类型   | 默认值 | 说明                         |
| --------- | ------ | ------ | ---------------------------- |
| href      | string | `''`   | 设置后整项渲染为 `<a>`       |
| separator | string | `''`   | 单项级别覆盖父级 `separator` |

### BreadcrumbItem Slots

| 名称      | 说明                         |
| --------- | ---------------------------- |
| default   | 内容                         |
| separator | 自定义分隔符（覆盖字符形式） |
