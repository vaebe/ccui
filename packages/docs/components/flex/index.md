# Flex 弹性布局

弹性布局组件，用于灵活控制内部内容的排列方式。

## 何时使用

- 适合行内或者垂直布局的简单场景。
- 子元素需要紧贴左右两端、自适应宽度时。

## 基本使用

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

## 垂直布局

:::demo

```vue
<template>
  <c-flex vertical :gap="8">
    <c-button>Button 1</c-button>
    <c-button>Button 2</c-button>
    <c-button>Button 3</c-button>
  </c-flex>
</template>
```

:::

## 对齐方式

:::demo

```vue
<template>
  <c-flex justify="space-between" align="center" gap="middle">
    <c-tag>Tag</c-tag>
    <c-button>Button</c-button>
  </c-flex>
</template>
```

:::

## Flex 参数

| 参数      | 类型               | 默认值   | 说明                          |
| --------- | ------------------ | -------- | ----------------------------- |
| vertical  | boolean            | false    | 是否垂直布局                  |
| wrap      | boolean / FlexWrap | false    | 是否换行                      |
| justify   | string             | 'normal' | justify-content               |
| align     | string             | 'normal' | align-items                   |
| flex      | string             | 'normal' | flex 简写                     |
| gap       | string / number    | --       | small / middle / large / 数字 |
| component | string             | 'div'    | 自定义元素标签                |
