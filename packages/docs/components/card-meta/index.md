# CardMeta 卡片元信息

卡片元信息组件，对标 Ant Design `Card.Meta`，作为独立顶层组件存在（不挂在 Card 命名空间下）。

## 何时使用

- 卡片需要展示头像 + 标题 + 描述的标准元信息布局。
- 列表项、详情卡片的头部信息块。

## 基本使用

`title` / `description` 是字符串 prop，也可以用同名 slot 完全自定义。

:::demo

```vue
<template>
  <c-card style="width: 320px">
    <c-card-meta title="人称的太阳" description="来自瑞典斯德哥尔摩的乐队 Mando Diao" />
  </c-card>
</template>
```

:::

## 带头像

`avatar` slot 用于左侧头像。

:::demo

```vue
<template>
  <c-card style="width: 320px">
    <c-card-meta title="Mando Diao" description="瑞典摇滚乐队">
      <template #avatar>
        <c-avatar name="MD" :width="48" :height="48" />
      </template>
    </c-card-meta>
  </c-card>
</template>
```

:::

## title / description slot

需要标题旁带图标或描述里带富文本时用 slot。

:::demo

```vue
<template>
  <c-card style="width: 360px">
    <c-card-meta>
      <template #title>
        <span>🔥 限时活动</span>
      </template>
      <template #description>
        <span>距结束还有 <b style="color: #f5222d">3 小时</b></span>
      </template>
    </c-card-meta>
  </c-card>
</template>
```

:::

## CardMeta 参数

| 参数        | 类型   | 默认 | 说明                     |
| ----------- | ------ | ---- | ------------------------ |
| title       | string | ''   | 标题文字（slot 优先）    |
| description | string | ''   | 描述文字（slot 优先）    |

## CardMeta 插槽

| 插槽名      | 说明           |
| ----------- | -------------- |
| avatar      | 左侧头像区     |
| title       | 标题区         |
| description | 描述区         |
