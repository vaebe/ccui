# SpaceCompact 紧凑组合

让多个输入类组件视觉上贴边拼接为一组紧凑控件，对标 Ant Design `Space.Compact`，作为独立顶层组件存在（**不挂 Space.Compact 静态属性**）。

::: tip 与 `<c-space>` 的差异

- `<c-space>` 子项之间留 gap，视觉上是独立组件
- `<c-space-compact>` 子项之间**贴边合并**：相邻 border 重叠（`margin: -1px`）、圆角合并（中间项 `border-radius: 0`、首尾项分别保留外侧圆角）

适合「Input + 选择器 + 按钮」类组合（搜索框 + 搜索按钮、Input + InputNumber、Select + Input 等）。
:::

## 基本使用

:::demo

```vue
<template>
  <c-space-compact>
    <c-input style="width: 240px" placeholder="搜索关键词" />
    <c-button type="primary">搜索</c-button>
  </c-space-compact>
</template>
```

:::

## 多个输入拼接

:::demo

```vue
<template>
  <c-space-compact>
    <c-input style="width: 100px" placeholder="国家" />
    <c-input style="width: 140px" placeholder="城市" />
    <c-input style="width: 160px" placeholder="街道" />
    <c-button>提交</c-button>
  </c-space-compact>
</template>
```

:::

## 纵向紧凑

:::demo

```vue
<template>
  <c-space-compact direction="vertical" style="width: 240px">
    <c-input placeholder="第一行" />
    <c-input placeholder="第二行" />
    <c-input placeholder="第三行" />
  </c-space-compact>
</template>
```

:::

## block 撑满父容器

:::demo

```vue
<template>
  <c-space-compact block>
    <c-input placeholder="搜索关键词" />
    <c-button type="primary">搜索</c-button>
  </c-space-compact>
</template>
```

:::

## SpaceCompact 参数

| 参数      | 类型                             | 默认           | 说明                                 |
| --------- | -------------------------------- | -------------- | ------------------------------------ |
| direction | `'horizontal' \| 'vertical'`     | `'horizontal'` | 紧凑布局方向                         |
| size      | `'large' \| 'middle' \| 'small'` | `'middle'`     | 控件尺寸（透传到子项 SCSS modifier） |
| block     | `boolean`                        | `false`        | 撑满父容器宽度                       |

## SpaceCompact 插槽

| 插槽名  | 说明                                  |
| ------- | ------------------------------------- |
| default | 紧凑组合的子控件（input / button 等） |
