# Flex 弹性布局

封装 CSS flexbox 的常用属性，配合主题间距 token 让"行内 / 垂直 / 两端对齐"等场景更直白。

## 何时使用

- 行内或垂直排列一组组件，间距用 token 控制。
- 两端对齐：左侧标题 + 右侧操作按钮。
- 子元素需要 `flex-grow` 自动撑开剩余空间。

## 基本使用

默认水平方向，`gap` 决定间距（数字按 px，也可用 `small` / `middle` / `large`）。

:::demo

```vue
<template>
  <c-flex :gap="12">
    <c-button>Button 1</c-button>
    <c-button>Button 2</c-button>
    <c-button>Button 3</c-button>
  </c-flex>
</template>
```

:::

## 间距预设

`gap` 接收 `'small'` / `'middle'` / `'large'`，分别对应 8 / 16 / 24px。

:::demo

```vue
<template>
  <p style="color: #666; margin: 0 0 4px">small</p>
  <c-flex gap="small"><c-tag>tag</c-tag><c-tag>tag</c-tag><c-tag>tag</c-tag></c-flex>

  <p style="color: #666; margin: 12px 0 4px">middle</p>
  <c-flex gap="middle"><c-tag>tag</c-tag><c-tag>tag</c-tag><c-tag>tag</c-tag></c-flex>

  <p style="color: #666; margin: 12px 0 4px">large</p>
  <c-flex gap="large"><c-tag>tag</c-tag><c-tag>tag</c-tag><c-tag>tag</c-tag></c-flex>
</template>
```

:::

## 垂直布局

`vertical` 把方向切到列。

:::demo

```vue
<template>
  <c-flex vertical :gap="8" style="width: 200px">
    <c-button>Button 1</c-button>
    <c-button>Button 2</c-button>
    <c-button>Button 3</c-button>
  </c-flex>
</template>
```

:::

## 对齐方式

`justify` 对应 `justify-content`，`align` 对应 `align-items`。

:::demo

```vue
<template>
  <p style="color: #666; margin: 0 0 4px">justify="space-between"（两端对齐）</p>
  <c-flex justify="space-between" align="center" style="background: #fafafa; padding: 8px; border-radius: 6px">
    <c-tag>左</c-tag>
    <c-button>右</c-button>
  </c-flex>

  <p style="color: #666; margin: 12px 0 4px">justify="space-evenly"（等距）</p>
  <c-flex justify="space-evenly" align="center" style="background: #fafafa; padding: 8px; border-radius: 6px">
    <c-tag>1</c-tag>
    <c-tag>2</c-tag>
    <c-tag>3</c-tag>
  </c-flex>

  <p style="color: #666; margin: 12px 0 4px">justify="center"（居中）</p>
  <c-flex justify="center" align="center" gap="small" style="background: #fafafa; padding: 8px; border-radius: 6px">
    <c-tag>居中</c-tag>
    <c-button type="primary">操作</c-button>
  </c-flex>
</template>
```

:::

## 自动换行

`wrap` 设为 `true`（或具体的 `wrap` / `wrap-reverse` / `nowrap`）控制超出容器时是否换行。

:::demo

```vue
<template>
  <c-flex wrap gap="small" style="background: #fafafa; padding: 8px; border-radius: 6px">
    <c-tag v-for="i in 12" :key="i">Tag {{ i }}</c-tag>
  </c-flex>
</template>
```

:::

## 用 `flex` 简写撑满剩余空间

子组件包一层 `<c-flex>` 并设置 `flex="1"` 可以让它独占剩余空间。

:::demo

```vue
<template>
  <c-flex gap="middle" style="background: #fafafa; padding: 8px; border-radius: 6px">
    <c-button>固定</c-button>
    <c-flex flex="1" justify="center" align="center" style="background: white; border-radius: 4px; padding: 8px">
      撑开剩余空间
    </c-flex>
    <c-button type="primary">固定</c-button>
  </c-flex>
</template>
```

:::

## 自定义元素

`component` 改变渲染的标签，常用于语义化（`section` / `nav` / `header` 等）。

:::demo

```vue
<template>
  <c-flex component="nav" gap="middle" style="background: #fafafa; padding: 12px; border-radius: 6px">
    <a href="#" style="color: inherit">首页</a>
    <a href="#" style="color: inherit">文档</a>
    <a href="#" style="color: inherit">关于</a>
  </c-flex>
</template>
```

:::

## API

### Props

| 参数      | 类型                                          | 默认值     | 说明                                  |
| --------- | --------------------------------------------- | ---------- | ------------------------------------- |
| vertical  | boolean                                       | `false`    | 垂直方向                              |
| wrap      | `boolean \| 'wrap' \| 'nowrap' \| 'wrap-reverse'` | `false`  | 是否换行                              |
| justify   | `CSSProperties['justifyContent']`             | `'normal'` | 对应 `justify-content`                |
| align     | `CSSProperties['alignItems']`                 | `'normal'` | 对应 `align-items`                    |
| flex      | string                                        | `'normal'` | flex 简写（如 `'1'`, `'0 0 auto'`）   |
| gap       | `string \| number`                            | —          | 间距：`small` / `middle` / `large` 或数字 |
| component | string                                        | `'div'`    | 渲染的标签                            |
