# Button3d 3D按钮

3D 效果按钮，基于 [Building a Magical 3D Button](https://www.joshwcomeau.com/animation/3d-button/) 实现。

## 基础用法

:::demo

```vue
<template>
  <div>
    <c-button-3d>默认按钮</c-button-3d>
    <c-button-3d type="primary">
      主要按钮
    </c-button-3d>
    <c-button-3d type="success">
      成功按钮
    </c-button-3d>
    <c-button-3d type="warning">
      警告按钮
    </c-button-3d>
    <c-button-3d type="danger">
      危险按钮
    </c-button-3d>
    <c-button-3d type="info">
      信息按钮
    </c-button-3d>
  </div>
</template>
```

:::

## 尺寸

:::demo

```vue
<template>
  <div>
    <c-button-3d size="large">
      大按钮
    </c-button-3d>
    <c-button-3d type="primary">
      默认按钮
    </c-button-3d>
    <c-button-3d size="small" type="success">
      小按钮
    </c-button-3d>
  </div>
</template>
```

:::

## 禁用状态

:::demo

```vue
<template>
  <div>
    <c-button-3d disabled>
      禁用按钮
    </c-button-3d>

    <c-button-3d type="primary" disabled>
      禁用按钮 primary 状态
    </c-button-3d>
  </div>
</template>
```

:::

## 加载状态

:::demo

```vue
<template>
  <div>
    <c-button-3d loading>
      加载中
    </c-button-3d>
    <c-button-3d type="primary" loading>
      加载中
    </c-button-3d>
  </div>
</template>
```

:::

## API

### Props

| 参数       | 说明       | 类型                 | 可选值                                                                       | 默认值    |
| ---------- | ---------- | -------------------- | ---------------------------------------------------------------------------- | --------- |
| size       | 尺寸       | `Button3DSize`       | `large` / `default` / `small`                                                | `default` |
| type       | 类型       | `Button3DType`       | `primary` / `success` / `warning` / `danger` / `info` / `secondary` / `text` | `primary` |
| disabled   | 是否禁用   | `boolean`            | -                                                                            | `false`   |
| loading    | 是否加载中 | `boolean`            | -                                                                            | `false`   |
| nativeType | 原生类型   | `Button3DNativeType` | `button` / `submit` / `reset`                                                | `button`  |

### Events

| 事件名 | 说明           | 回调参数                  |
| ------ | -------------- | ------------------------- |
| click  | 点击按钮时触发 | `(e: MouseEvent) => void` |
