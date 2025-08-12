# Button3d 3D按钮

3D 效果按钮，基于 [Building a Magical 3D Button](https://www.joshwcomeau.com/animation/3d-button/) 实现。

## 基础用法

:::demo

```vue
<template>
  <c-button-3d>北京</c-button-3d>
  <c-button-3d type="primary">
    上海
  </c-button-3d>
  <c-button-3d type="success">
    深圳
  </c-button-3d>
  <c-button-3d type="warning">
    河南
  </c-button-3d>
  <c-button-3d type="danger">
    合肥
  </c-button-3d>
  <c-button-3d type="info">
    河北
  </c-button-3d>
</template>
```

:::

## 尺寸

:::demo

```vue
<template>
  <c-button-3d size="large">
    大按钮
  </c-button-3d>
  <c-button-3d>中按钮</c-button-3d>
  <c-button-3d size="small">
    小按钮
  </c-button-3d>
</template>
```

:::

## 禁用状态

:::demo

```vue
<template>
  <c-button-3d disabled>
    禁用按钮
  </c-button-3d>
  <c-button-3d type="primary" disabled>
    禁用按钮
  </c-button-3d>
</template>
```

:::

## 加载状态

:::demo

```vue
<template>
  <c-button-3d loading>
    加载中
  </c-button-3d>
</template>
```

:::

## API

### Props

| 参数     | 说明       | 类型          | 可选值                           | 默认值    |
| -------- | ---------- | ------------- | -------------------------------- | --------- |
| size     | 尺寸       | `IButtonSize` | `large` / `medium` / `small`     | `medium`  |
| type     | 类型       | `IButtonType` | `primary` / `secondary` / `text` | `primary` |
| disabled | 是否禁用   | `boolean`     | -                                | `false`   |
| loading  | 是否加载中 | `boolean`     | -                                | `false`   |

### Events

| 事件名 | 说明           | 回调参数                  |
| ------ | -------------- | ------------------------- |
| click  | 点击按钮时触发 | `(e: MouseEvent) => void` |
