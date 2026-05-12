# Divider 分隔线

区隔内容的分隔线。

## 何时使用

- 对不同段落的文本进行分隔
- 对行内文字、链接进行分隔，例如表格的操作列
- 配合标题作为章节分割

## 基本用法

最常见的水平分隔线。

:::demo

```vue
<template>
  <p>第一段：我们终将远行，和过去稚嫩的自己告别。</p>
  <c-divider />
  <p>第二段：保持冷静，继续前行。</p>
</template>
```

:::

## 虚线

`border-style="dashed"` 渲染虚线。

:::demo

```vue
<template>
  <p>实线分隔</p>
  <c-divider />
  <p>虚线分隔</p>
  <c-divider border-style="dashed" />
  <p>结束</p>
</template>
```

:::

## 自定义颜色

`color` 改变分隔线颜色。

:::demo

```vue
<template>
  <p>默认</p>
  <c-divider />
  <p>自定义颜色</p>
  <c-divider color="#7693f5" />
</template>
```

:::

## 带文案

把文案放进默认插槽，分隔线会被中断；用 `content-position` 控制文案位置。

:::demo

```vue
<template>
  <c-divider>居中文案</c-divider>
  <c-divider content-position="left">左侧文案</c-divider>
  <c-divider content-position="right">右侧文案</c-divider>
</template>
```

:::

## 自定义文案样式

`content-color` 改文字颜色，`content-background-color` 改文字底色（在彩色背景上常用）。

:::demo

```vue
<template>
  <c-divider content-color="#7693f5">蓝色文字</c-divider>
  <c-divider content-background-color="#fff7e6">米色背景</c-divider>
</template>
```

:::

## 垂直分隔线

`direction="vertical"` 用于行内分隔，常见于操作列。

:::demo

```vue
<template>
  <c-button type="text">编辑</c-button>
  <c-divider direction="vertical" />
  <c-button type="text">复制</c-button>
  <c-divider direction="vertical" />
  <c-button type="text" danger>删除</c-button>
</template>
```

:::

## API

### Props

| 参数                   | 类型                            | 默认值       | 说明           |
| ---------------------- | ------------------------------- | ------------ | -------------- |
| color                  | string                          | -            | 分隔线颜色     |
| direction              | `'horizontal' \| 'vertical'`    | `horizontal` | 分隔线方向     |
| borderStyle            | `'solid' \| 'dashed'`           | `solid`      | 线型           |
| contentPosition        | `'left' \| 'right' \| 'center'` | `center`     | 文案位置       |
| contentColor           | string                          | -            | 文案文字颜色   |
| contentBackgroundColor | string                          | -            | 文案文字背景色 |
