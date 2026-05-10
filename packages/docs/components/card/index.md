# Card 卡片

将信息聚合在卡片容器中展示。

## 何时使用

- 概览展示一组信息
- 信息组合成的入口卡片
- 列表项的独立单元

## 基本用法

通过 `header` 设置卡片标题，默认插槽放内容。

:::demo

```vue
<template>
  <c-card header="基础卡片">
    我们终将远行，和过去稚嫩的自己告别。这是一个流行告别的时代，陪你颠沛流离的人越来越少，
    直至没有。我们也要习惯昔日好友的渐行渐远，因为我们终将长大，长大到可以独自一人抵挡风雨。
  </c-card>
</template>
```

:::

## 阴影效果

`shadow` 控制阴影显示时机：`always`（默认）/ `hover` / `never`。

:::demo

```vue
<template>
  <c-card header="一直显示阴影" style="margin-bottom: 12px">
    shadow="always"
  </c-card>
  <c-card shadow="hover" header="鼠标悬停时显示阴影" style="margin-bottom: 12px">
    shadow="hover"
  </c-card>
  <c-card shadow="never" header="不显示阴影">
    shadow="never"
  </c-card>
</template>
```

:::

## 自定义标题区

`header` 插槽完全自定义标题，可以放图标、按钮、副标题等。

:::demo

```vue
<template>
  <c-card>
    <template #header>
      <div style="display: flex; align-items: center; justify-content: space-between">
        <span style="font-weight: 500">最近订单</span>
        <c-button type="text">查看全部</c-button>
      </div>
    </template>
    最近 7 天产生订单 32 笔，金额 ¥12,840。
  </c-card>
</template>
```

:::

## 不带标题

不传 `header` 也不传 `header` slot 时，卡片只显示内容区。

:::demo

```vue
<template>
  <c-card>
    <p style="margin: 0">没有标题的纯内容卡片，常用作信息聚合面板。</p>
  </c-card>
</template>
```

:::

## 自定义内容内边距

`body-style` 接受 CSS 对象，覆盖默认 20px padding。

:::demo

```vue
<template>
  <c-card header="紧凑模式" :body-style="{ padding: '8px 12px' }" style="margin-bottom: 12px">
    body padding 改为 8px 12px
  </c-card>
  <c-card header="去掉内边距" :body-style="{ padding: '0' }">
    <img
      src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
      style="display: block; width: 100%"
    />
  </c-card>
</template>
```

:::

## 卡片栅格

配合 `c-row` / `c-col` 实现卡片栅格，常见于仪表盘。

:::demo

```vue
<template>
  <c-row :gutter="12">
    <c-col :span="8">
      <c-card header="今日订单">128</c-card>
    </c-col>
    <c-col :span="8">
      <c-card header="今日访客">2,408</c-card>
    </c-col>
    <c-col :span="8">
      <c-card header="今日 GMV">¥38,420</c-card>
    </c-col>
  </c-row>
</template>
```

:::

## API

### Props

| 参数      | 类型                              | 默认值                | 说明                                                                |
| --------- | --------------------------------- | --------------------- | ------------------------------------------------------------------- |
| header    | string                            | `''`                  | 卡片标题（也可用 `header` slot 自定义）                             |
| bodyStyle | object                            | `{ padding: '20px' }` | 内容区样式                                                          |
| shadow    | `'always' \| 'hover' \| 'never'`  | `'always'`            | 阴影显示时机                                                        |

### Slots

| 名称    | 说明           |
| ------- | -------------- |
| default | 卡片内容       |
| header  | 自定义标题区   |
