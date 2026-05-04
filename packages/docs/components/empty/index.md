# Empty 空状态

空状态时的展示占位。

## 何时使用

- 当目前没有数据时，用于显式的用户提示。
- 初始化场景时的引导创建过程。

## 基本使用

:::demo

```vue
<template>
  <c-empty />
</template>
```

:::

## 自定义描述与额外内容

:::demo

```vue
<template>
  <c-empty description="自定义提示文案">
    <c-button type="primary"> 创建 </c-button>
  </c-empty>
</template>
```

:::

## Empty 参数

| 参数        | 类型   | 默认值     | 说明           |
| ----------- | ------ | ---------- | -------------- |
| description | string | '暂无数据' | 描述文案       |
| image       | string | --         | 自定义图片地址 |
| imageStyle  | object | --         | 图片样式       |

## Empty 插槽

| 插槽名      | 说明           |
| ----------- | -------------- |
| default     | 自定义底部内容 |
| description | 自定义描述内容 |
| image       | 自定义图片内容 |
