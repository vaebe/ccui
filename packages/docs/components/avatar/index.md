# Avatar 头像

代表用户或对象的图标，支持图片、文字、自定义文本。

## 何时使用

- 用户列表、评论、消息中显示用户身份
- 当头像没有图片时，用文字首字母替代

## 基本用法

最简单的方式 —— 传 `name`，组件按规则提取最后/前两个字符。

:::demo

```vue
<template>
  <c-avatar name="张三" />
  &nbsp;
  <c-avatar name="李四" />
  &nbsp;
  <c-avatar name="lihua" />
  &nbsp;
  <c-avatar name="hua li" />
</template>
```

:::

## 不同尺寸

`width` / `height` 控制头像大小（单位 px）。

:::demo

```vue
<template>
  <c-avatar :width="24" :height="24" name="张三" />
  &nbsp;
  <c-avatar :width="32" :height="32" name="张三" />
  &nbsp;
  <c-avatar :width="40" :height="40" name="张三" />
  &nbsp;
  <c-avatar :width="56" :height="56" name="张三" />
</template>
```

:::

## 方形头像

`is-round=false` 渲染为方形，常用于品牌、产品图标。

:::demo

```vue
<template>
  <c-avatar name="张三" :is-round="false" />
  &nbsp;
  <c-avatar :width="40" :height="40" name="hua li" :is-round="false" />
</template>
```

:::

## 图片头像

`img-src` 指定图片地址。图片加载失败时回退到文字。`fit` 控制图片填充方式（同 CSS `object-fit`）。

:::demo

```vue
<template>
  <c-avatar name="刘武" img-src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" />
  &nbsp;
  <c-avatar
    name="刘武"
    fit="contain"
    img-src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
  />
  &nbsp;
  <c-avatar name="孙六" :is-round="false" img-src="https://invalid-url.example/x.png" />
</template>
```

:::

## 自定义显示文字

`custom-text` 优先级高于 `name`，按原文展示，不做提取。

:::demo

```vue
<template>
  <c-avatar name="李六" custom-text="王二" />
  &nbsp;
  <c-avatar name="anything" custom-text="VIP" />
</template>
```

:::

## 性别配色

`gender` 影响默认背景色。

:::demo

```vue
<template>
  <c-avatar name="女用户" gender="female" />
  &nbsp;
  <c-avatar name="男用户" gender="male" />
  &nbsp;
  <c-avatar name="未知" />
</template>
```

:::

## 显示规则

- 优先级：`imgSrc > customText > name`
- 文字提取规则：
  1. 中文开头：取最后两个字符
  2. 英文开头：取前两个字符
  3. 多个英文名连用：取每个英文名的首字母
  4. 非中英文开头：取前两个字符

## API

### Props

| 参数       | 类型                                                       | 默认值  | 说明                                       |
| ---------- | ---------------------------------------------------------- | ------- | ------------------------------------------ |
| name       | string                                                     | -       | 用于生成头像文字（可不传，回退到默认占位） |
| gender     | `'male' \| 'female' \| string`                             | -       | 影响默认背景色                             |
| width      | number                                                     | `36`    | 宽度（px）                                 |
| height     | number                                                     | `36`    | 高度（px）                                 |
| isRound    | boolean                                                    | `true`  | 是否圆形                                   |
| imgSrc     | string                                                     | -       | 自定义图片                                 |
| customText | string                                                     | -       | 自定义文字（不做提取）                     |
| fit        | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `cover` | 图片填充方式                               |
