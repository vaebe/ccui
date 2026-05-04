# Badge 徽标数

图标右上角的圆形徽标数字。

## 何时使用

- 一般出现在通知图标或头像的右上角，用于显示需要处理的消息条数。
- 用于其他需要展示状态的场景。

## 基本使用

:::demo

```vue
<template>
  <c-badge :count="5">
    <span class="head-example" />
  </c-badge>

  <c-badge :count="0" show-zero>
    <span class="head-example" />
  </c-badge>

  <c-badge :count="99">
    <span class="head-example" />
  </c-badge>

  <c-badge :count="100">
    <span class="head-example" />
  </c-badge>

  <c-badge :count="200" :overflow-count="99">
    <span class="head-example" />
  </c-badge>
</template>

<style>
.head-example {
  width: 42px;
  height: 42px;
  background: #eee;
  border-radius: 4px;
  display: inline-block;
  margin-right: 16px;
}
</style>
```

:::

## 独立使用

:::demo

```vue
<template>
  <c-badge :count="25" />
  <c-badge :count="4" :style="{ backgroundColor: '#52c41a', marginLeft: '12px' }" />
</template>
```

:::

## 小红点

:::demo

```vue
<template>
  <c-badge dot>
    <span class="head-example" />
  </c-badge>
</template>

<style>
.head-example {
  width: 42px;
  height: 42px;
  background: #eee;
  border-radius: 4px;
  display: inline-block;
  margin-right: 16px;
}
</style>
```

:::

## 状态点

:::demo

```vue
<template>
  <c-badge status="success" text="Success" />
  <br>
  <c-badge status="error" text="Error" />
  <br>
  <c-badge status="default" text="Default" />
  <br>
  <c-badge status="processing" text="Processing" />
  <br>
  <c-badge status="warning" text="Warning" />
</template>
```

:::

## Badge 参数

| 参数          | 类型                                                       | 默认值 | 说明                       |
| ------------- | ---------------------------------------------------------- | ------ | -------------------------- |
| count         | number / string                                            | --     | 展示数字，0 默认隐藏       |
| showZero      | boolean                                                    | false  | 当数值为 0 时是否展示      |
| overflowCount | number                                                     | 99     | 展示封顶的数字值           |
| dot           | boolean                                                    | false  | 不展示数字，只有一个小红点 |
| status        | 'success' / 'processing' / 'default' / 'error' / 'warning' | --     | 状态点的颜色               |
| text          | string                                                     | --     | 状态点的文字               |
| color         | string                                                     | --     | 自定义小圆点颜色           |
| offset        | [number, number]                                           | --     | 设置徽标数偏移             |
