# AvatarGroup 头像组

头像分组组件，对标 Ant Design `Avatar.Group`，作为独立顶层组件存在（不挂在 Avatar 命名空间下）。

## 何时使用

- 评论区、协作者列表等需要展示多个头像。
- 头像数量较多时需要折叠为 `+N` 浮层。

## 基本使用

子项放进默认 slot，组件按顺序重叠排布。

:::demo

```vue
<template>
  <c-avatar-group>
    <c-avatar name="U1" :width="36" :height="36" />
    <c-avatar name="U2" :width="36" :height="36" />
    <c-avatar name="U3" :width="36" :height="36" />
    <c-avatar name="U4" :width="36" :height="36" />
  </c-avatar-group>
</template>
```

:::

## 最大数量 + 折叠

超出 `maxCount` 的子项折叠为 `+N` 头像，hover 展开。

:::demo

```vue
<template>
  <c-avatar-group :max-count="3">
    <c-avatar name="赵" :width="36" :height="36" />
    <c-avatar name="钱" :width="36" :height="36" />
    <c-avatar name="孙" :width="36" :height="36" />
    <c-avatar name="李" :width="36" :height="36" />
    <c-avatar name="周" :width="36" :height="36" />
    <c-avatar name="吴" :width="36" :height="36" />
  </c-avatar-group>
</template>
```

:::

## 自定义 +N 样式

通过 `maxStyle` 修改 `+N` 头像的背景 / 文字色。

:::demo

```vue
<template>
  <c-avatar-group :max-count="3" :max-style="{ backgroundColor: '#f56a00', color: '#fff' }">
    <c-avatar name="A" :width="36" :height="36" />
    <c-avatar name="B" :width="36" :height="36" />
    <c-avatar name="C" :width="36" :height="36" />
    <c-avatar name="D" :width="36" :height="36" />
    <c-avatar name="E" :width="36" :height="36" />
  </c-avatar-group>
</template>
```

:::

## 不同尺寸

`size` 支持数字（px）或语义化字面值（`large` 40 / `default` 32 / `small` 24），透传到 `+N` 节点。

:::demo

```vue
<template>
  <c-avatar-group :max-count="2" size="large">
    <c-avatar name="A" :width="40" :height="40" />
    <c-avatar name="B" :width="40" :height="40" />
    <c-avatar name="C" :width="40" :height="40" />
    <c-avatar name="D" :width="40" :height="40" />
  </c-avatar-group>
  <br />
  <c-avatar-group :max-count="2" :size="48" style="margin-top: 12px">
    <c-avatar name="A" :width="48" :height="48" />
    <c-avatar name="B" :width="48" :height="48" />
    <c-avatar name="C" :width="48" :height="48" />
    <c-avatar name="D" :width="48" :height="48" />
  </c-avatar-group>
</template>
```

:::

## 触发方式

`maxPopoverTrigger` 支持 `hover` / `click` / `focus`。

:::demo

```vue
<template>
  <c-avatar-group :max-count="2" max-popover-trigger="click">
    <c-avatar name="A" :width="36" :height="36" />
    <c-avatar name="B" :width="36" :height="36" />
    <c-avatar name="C" :width="36" :height="36" />
    <c-avatar name="D" :width="36" :height="36" />
    <c-avatar name="E" :width="36" :height="36" />
  </c-avatar-group>
</template>
```

:::

## 弹出方向

`maxPopoverPlacement` 支持 `top` / `bottom` / `left` / `right` 各 `-start` / `-end` 共 12 方向。

:::demo

```vue
<template>
  <c-avatar-group :max-count="2" max-popover-placement="bottom">
    <c-avatar name="A" :width="36" :height="36" />
    <c-avatar name="B" :width="36" :height="36" />
    <c-avatar name="C" :width="36" :height="36" />
    <c-avatar name="D" :width="36" :height="36" />
  </c-avatar-group>
  <br />
  <c-avatar-group :max-count="2" max-popover-placement="right-start" style="margin-top: 12px">
    <c-avatar name="A" :width="36" :height="36" />
    <c-avatar name="B" :width="36" :height="36" />
    <c-avatar name="C" :width="36" :height="36" />
    <c-avatar name="D" :width="36" :height="36" />
  </c-avatar-group>
</template>
```

:::

## AvatarGroup 参数

| 参数                | 类型                                                                     | 默认    | 说明                          |
| ------------------- | ------------------------------------------------------------------------ | ------- | ----------------------------- |
| maxCount            | number                                                                   | --      | 最大展示数量，超出折叠为 `+N` |
| maxStyle            | CSSProperties                                                            | --      | `+N` 头像自定义 style         |
| maxPopoverPlacement | 'top' \| 'top-start' \| 'top-end' \| 'bottom\*' \| 'left\*' \| 'right\*' | top     | popover 弹出方向（共 12 种）  |
| maxPopoverTrigger   | 'hover' \| 'click' \| 'focus'                                            | hover   | popover 触发方式              |
| size                | number \| 'large' \| 'default' \| 'small'                                | default | 头像尺寸（透传 `+N` 节点）    |
| shape               | 'circle' \| 'square'                                                     | circle  | 头像形状（影响 `+N` 圆角）    |

## AvatarGroup 插槽

| 插槽名  | 说明                                  |
| ------- | ------------------------------------- |
| default | 子头像列表（`<c-avatar />` 顺序排布） |
