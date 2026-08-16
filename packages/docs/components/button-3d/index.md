# Button3d 3D按钮

3D 效果按钮，基于 [Building a Magical 3D Button](https://www.joshwcomeau.com/animation/3d-button/) 实现。

## 基础用法

:::demo

```vue
<template>
  <div>
    <c-button-3d>默认按钮</c-button-3d>
    <c-button-3d type="primary"> 主要按钮 </c-button-3d>
    <c-button-3d type="success"> 成功按钮 </c-button-3d>
    <c-button-3d type="warning"> 警告按钮 </c-button-3d>
    <c-button-3d type="danger"> 危险按钮 </c-button-3d>
    <c-button-3d type="info"> 信息按钮 </c-button-3d>
  </div>
</template>
```

:::

## 尺寸

:::demo

```vue
<template>
  <div>
    <c-button-3d size="large"> 大按钮 </c-button-3d>
    <c-button-3d type="primary"> 默认按钮 </c-button-3d>
    <c-button-3d size="small" type="success"> 小按钮 </c-button-3d>
  </div>
</template>
```

:::

## 禁用状态

:::demo

```vue
<template>
  <div>
    <c-button-3d disabled> 禁用按钮 </c-button-3d>

    <c-button-3d type="primary" disabled> 禁用按钮 primary 状态 </c-button-3d>
  </div>
</template>
```

:::

## 加载状态

加载状态会保留按钮原有文字，只增加旋转指示并立即禁用按钮，避免操作名称被替换或重复提交。

:::demo

```vue
<template>
  <div>
    <c-button-3d loading> 加载中 </c-button-3d>
    <c-button-3d type="primary" loading> 加载中 </c-button-3d>
  </div>
</template>
```

:::

## 可访问性与动态效果

- 组件始终渲染原生 `<button>`，支持 `button`、`submit`、`reset` 与浏览器默认的 Enter/Space 键盘操作；纯图标内容请通过 `aria-label` 提供名称。
- `disabled` 与 `loading` 都会设置原生 disabled；loading 额外设置 `aria-busy="true"`。
- 系统启用“减少动态效果”时会关闭 3D 位移过渡与 spinner 旋转；强制色模式使用系统色保留按钮边界和焦点位置。

## API

### Props

| 参数       | 说明       | 类型                 | 可选值                                    | 默认值   |
| ---------- | ---------- | -------------------- | ----------------------------------------- | -------- |
| size       | 尺寸       | `Button3DSizeType`   | [Button3DSizeType](#button3dsizetype)     | `''`     |
| type       | 类型       | `Button3DType`       | [Button3DType](#button3dtype)             | `''`     |
| disabled   | 是否禁用   | `boolean`            | -                                         | `false`  |
| loading    | 是否加载中 | `boolean`            | -                                         | `false`  |
| nativeType | 原生类型   | `Button3DNativeType` | [Button3DNativeType](#button3dnativetype) | `button` |

## Button-3d 类型定义

### Button3DType

```ts
// '' 使用默认灰色 3D 基态，不添加色型 modifier
export type Button3DType = '' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
```

### Button3DSizeType

```ts
// '' 使用组件默认高度与字号，不添加尺寸 modifier
export type Button3DSizeType = '' | 'large' | 'default' | 'small'
```

### Button3DNativeType

```ts
export type Button3DNativeType = 'button' | 'submit' | 'reset'
```

## Slots

| 插槽名  | 说明     |
| ------- | -------- |
| default | 按钮内容 |

## Events

| 事件名 | 回调参数              | 说明                                             |
| ------ | --------------------- | ------------------------------------------------ |
| click  | `(event: MouseEvent)` | 点击时触发；disabled 或 loading 状态下不会触发。 |
