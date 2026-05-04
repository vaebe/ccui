# Skeleton 骨架屏

在需要等待加载内容的位置提供一个占位图形组合。

## 何时使用

- 网络较慢，需要长时间等待加载处理的情况下。
- 图文信息内容较多的列表/卡片中。
- 只在第一次加载数据的时候使用。

## 基本使用

:::demo

```vue
<template>
  <c-skeleton />
</template>
```

:::

## 含头像 + 多行段落

:::demo

```vue
<template>
  <c-skeleton avatar :paragraph="{ rows: 4 }" />
</template>
```

:::

## 动画效果

:::demo

```vue
<template>
  <c-skeleton active />
</template>
```

:::

## Skeleton 参数

| 参数      | 类型                             | 默认值 | 说明                               |
| --------- | -------------------------------- | ------ | ---------------------------------- |
| active    | boolean                          | false  | 是否展示动画效果                   |
| loading   | boolean                          | true   | 为 true 时展示占位，否则展示子节点 |
| avatar    | boolean / SkeletonAvatarShape    | false  | 是否显示头像占位图                 |
| title     | boolean / SkeletonTitleShape     | true   | 是否显示标题占位                   |
| paragraph | boolean / SkeletonParagraphShape | true   | 是否显示段落占位                   |
| round     | boolean                          | false  | 段落骨架圆角化                     |
