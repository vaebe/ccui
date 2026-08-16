# Breadcrumb 面包屑

显示当前页面在系统层级中的位置，并提供向上导航能力。

组件输出 `<nav><ol><li>…</li></ol></nav>` 列表语义；routes 与纯 BreadcrumbItem 用法仅将最后一项标记为 `aria-current="page"`，分隔符对辅助技术隐藏。

## 何时使用

- 系统层级 ≥ 3 级时辅助用户定位。
- 详情页头部展示 "返回路径"，支持多级跳转回。

## 基本使用

最常见的写法：用一组 `<c-breadcrumb-item>` 组合，最末一级是当前页（不带链接）。

:::demo

```vue
<template>
  <c-breadcrumb>
    <c-breadcrumb-item href="#">首页</c-breadcrumb-item>
    <c-breadcrumb-item href="#">应用中心</c-breadcrumb-item>
    <c-breadcrumb-item href="#">应用列表</c-breadcrumb-item>
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

## 导航与响应式边界

- `href` / `path` 渲染原生 `<a>`，组件不拦截点击，也不依赖特定 Router。SPA 路由可在默认插槽中直接放置项目使用的 RouterLink；混用自定义节点时，当前态由 RouterLink 或业务节点维护，Breadcrumb 不会覆盖其 `aria-current`。
- 当前页或不可点击层级不传 `href`；组件没有 `disabled` prop，也不会把无链接文本加入 Tab 顺序。
- 面包屑默认允许换行以适应窄容器，不自动折叠或隐藏层级；需要折叠时由业务侧裁剪 `routes` 或默认插槽内容。

## 自定义分隔符

`separator` 可以是任意字符串；BreadcrumbItem 显式传入空字符串可隐藏该项后的字符分隔符。

:::demo

```vue
<template>
  <c-breadcrumb separator=">">
    <c-breadcrumb-item href="#">Home</c-breadcrumb-item>
    <c-breadcrumb-item href="#">Docs</c-breadcrumb-item>
    <c-breadcrumb-item>Breadcrumb</c-breadcrumb-item>
  </c-breadcrumb>

  <c-breadcrumb separator="·" style="margin-top: 8px">
    <c-breadcrumb-item href="#">A</c-breadcrumb-item>
    <c-breadcrumb-item href="#">B</c-breadcrumb-item>
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
    <c-breadcrumb-item href="#">首页</c-breadcrumb-item>
    <c-breadcrumb-item href="#" separator="→">商品</c-breadcrumb-item>
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
      <c-breadcrumb-item href="#">首页</c-breadcrumb-item>
      <c-breadcrumb-item href="#">订单</c-breadcrumb-item>
      <c-breadcrumb-item>#202504</c-breadcrumb-item>
    </c-breadcrumb>
    <c-button type="primary">新建订单</c-button>
  </div>
</template>
```

:::

## API

### Breadcrumb Props

| 参数      | 类型                | 默认值 | 说明                 |
| --------- | ------------------- | ------ | -------------------- |
| separator | string              | `'/'`  | 分隔符               |
| routes    | `BreadcrumbRoute[]` | `[]`   | 非空时优先于默认插槽 |

### BreadcrumbRoute

| 字段           | 类型   | 说明                                 |
| -------------- | ------ | ------------------------------------ |
| breadcrumbName | string | 显示文本                             |
| title          | string | `breadcrumbName` 的别名              |
| href           | string | 链接地址                             |
| path           | string | 链接地址（兼容字段，与 `href` 等价） |

### BreadcrumbItem Props

| 参数      | 类型   | 默认值 | 说明                                        |
| --------- | ------ | ------ | ------------------------------------------- |
| href      | string | `''`   | 设置后整项渲染为 `<a>`                      |
| separator | string | -      | 单项级别覆盖父级 `separator`；`''` 表示隐藏 |

### BreadcrumbItem Slots

| 名称      | 说明                         |
| --------- | ---------------------------- |
| default   | 内容                         |
| separator | 自定义分隔符（覆盖字符形式） |
