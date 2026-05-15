# CardGrid 卡片网格

卡片内的网格子项，对标 Ant Design `Card.Grid`，作为独立顶层组件存在（不挂在 Card 命名空间下）。

## 何时使用

- 卡片需要把内部空间切成多个等宽 / 自定义宽度的网格区块。
- 替代 Tab 进行内容分区，hover 浮起增强可点击感。

## 基本使用

放进 Card 的 default slot，默认每个网格占 1/3 宽（与 Ant 一致），自动按行流动。

:::demo

```vue
<template>
  <c-card title="网格示例">
    <c-card-grid>第一块</c-card-grid>
    <c-card-grid>第二块</c-card-grid>
    <c-card-grid>第三块</c-card-grid>
    <c-card-grid>第四块</c-card-grid>
    <c-card-grid>第五块</c-card-grid>
    <c-card-grid>第六块</c-card-grid>
  </c-card>
</template>
```

:::

## colSpan 自定义宽度

`colSpan` 取值 1-24，按 24 栅格换算成百分比。越界自动夹紧到 [1, 24]。

:::demo

```vue
<template>
  <c-card title="自定义宽度">
    <c-card-grid :col-span="12">colSpan=12 (50%)</c-card-grid>
    <c-card-grid :col-span="12">colSpan=12 (50%)</c-card-grid>
    <c-card-grid :col-span="8">colSpan=8</c-card-grid>
    <c-card-grid :col-span="8">colSpan=8</c-card-grid>
    <c-card-grid :col-span="8">colSpan=8</c-card-grid>
    <c-card-grid :col-span="24">colSpan=24（独占一行）</c-card-grid>
  </c-card>
</template>
```

:::

## 关闭 hoverable

某些信息展示型 grid 不需要 hover 效果。

:::demo

```vue
<template>
  <c-card title="只读网格">
    <c-card-grid :hoverable="false">不可点 A</c-card-grid>
    <c-card-grid :hoverable="false">不可点 B</c-card-grid>
    <c-card-grid :hoverable="false">不可点 C</c-card-grid>
  </c-card>
</template>
```

:::

## 自定义内边距

`bodyStyle` 透传 inline style 到 grid 节点。

:::demo

```vue
<template>
  <c-card title="紧凑网格">
    <c-card-grid :body-style="{ padding: '12px' }">紧凑 A</c-card-grid>
    <c-card-grid :body-style="{ padding: '12px' }">紧凑 B</c-card-grid>
    <c-card-grid :body-style="{ padding: '12px' }">紧凑 C</c-card-grid>
  </c-card>
</template>
```

:::

## CardGrid 参数

| 参数      | 类型           | 默认 | 说明                                              |
| --------- | -------------- | ---- | ------------------------------------------------- |
| hoverable | boolean        | true | hover 时浮起阴影                                  |
| colSpan   | number         | --   | 占据列数（1-24，按 24 栅格换算百分比；越界夹紧） |
| bodyStyle | CSSProperties  | --   | inline style 直接透传到 grid 节点                 |

## CardGrid 插槽

| 插槽名  | 说明     |
| ------- | -------- |
| default | 网格内容 |
