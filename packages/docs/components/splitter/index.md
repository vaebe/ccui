# Splitter 分隔面板

通过拖拽分隔条调整面板尺寸。

## 何时使用

- 需要在两个或多个面板间动态分配空间。

## 基本使用

:::demo

```vue
<template>
  <c-splitter style="height: 200px; border: 1px solid #f0f0f0;">
    <c-splitter-panel :default-size="200" :min="100">
      <div style="padding: 16px;">Left</div>
    </c-splitter-panel>
    <c-splitter-panel :min="100">
      <div style="padding: 16px;">Right</div>
    </c-splitter-panel>
  </c-splitter>
</template>
```

:::

## 垂直布局

:::demo

```vue
<template>
  <c-splitter layout="vertical" style="height: 280px; border: 1px solid #f0f0f0;">
    <c-splitter-panel :default-size="100" :min="50">
      <div style="padding: 16px;">Top</div>
    </c-splitter-panel>
    <c-splitter-panel>
      <div style="padding: 16px;">Bottom</div>
    </c-splitter-panel>
  </c-splitter>
</template>
```

:::

## Splitter 参数

| 参数   | 类型                        | 默认值       | 说明     |
| ------ | --------------------------- | ------------ | -------- |
| layout | `'horizontal' / 'vertical'` | 'horizontal' | 布局方向 |

## Splitter 事件

| 事件        | 参数              | 说明           |
| ----------- | ----------------- | -------------- |
| resize      | `sizes: number[]` | 拖拽中持续触发 |
| resizeStart | `sizes: number[]` | 开始拖拽       |
| resizeEnd   | `sizes: number[]` | 结束拖拽       |

## SplitterPanel 参数

| 参数        | 类型            | 默认值 | 说明                 |
| ----------- | --------------- | ------ | -------------------- |
| size        | number / string | --     | 由外部状态接管的尺寸 |
| defaultSize | number / string | --     | 初始尺寸             |
| min         | number / string | 0      | 最小尺寸             |
| max         | number / string | --     | 最大尺寸             |
| resizable   | boolean         | true   | 是否可拖拽           |
