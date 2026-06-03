# Space 间距

设置组件之间的间距。

## 何时使用

- 避免组件紧贴在一起，拉开统一的空间。
- 适合行内元素的水平间距。
- 可以设置各种水平对齐方式。

## 基本使用

:::demo

```vue
<template>
  <c-space>
    <c-button>Button</c-button>
    <c-tag>Tag</c-tag>
    <span>Text</span>
  </c-space>
</template>
```

:::

## 垂直间距

:::demo

```vue
<template>
  <c-space direction="vertical">
    <c-button>Button 1</c-button>
    <c-button>Button 2</c-button>
    <c-button>Button 3</c-button>
  </c-space>
</template>
```

:::

## 间距大小

:::demo

```vue
<template>
  <c-space size="small">
    <c-button>small</c-button>
    <c-button>small</c-button>
  </c-space>
  <br /><br />
  <c-space size="middle">
    <c-button>middle</c-button>
    <c-button>middle</c-button>
  </c-space>
  <br /><br />
  <c-space size="large">
    <c-button>large</c-button>
    <c-button>large</c-button>
  </c-space>
  <br /><br />
  <c-space :size="40">
    <c-button>40px</c-button>
    <c-button>40px</c-button>
  </c-space>
</template>
```

:::

## 分隔符

:::demo

```vue
<template>
  <c-space split="·">
    <a href="#">Link 1</a>
    <a href="#">Link 2</a>
    <a href="#">Link 3</a>
  </c-space>
</template>
```

:::

## Space 参数

| 参数      | 类型                                                     | 默认值       | 说明                   |
| --------- | -------------------------------------------------------- | ------------ | ---------------------- |
| align     | 'start' / 'end' / 'center' / 'baseline'                  | --           | 对齐方式               |
| direction | 'horizontal' / 'vertical'                                | 'horizontal' | 间距方向               |
| size      | 'small' / 'middle' / 'large' / number / [number, number] | 'small'      | 间距大小               |
| wrap      | boolean                                                  | false        | 自动换行（仅水平方向） |
| split     | string                                                   | --           | 设置拆分               |
