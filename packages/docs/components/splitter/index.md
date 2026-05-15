# Splitter 分隔面板

通过拖拽分隔条调整两个或多个面板的相对尺寸。常用于"代码编辑器布局"、"文件浏览器"、"双栏对比"。

## 何时使用

- 需要让用户在多个区域间动态分配空间。
- IDE / 数据浏览器 / Diff 视图等。

## 基本使用

水平布局，左右两栏可拖动调整。

:::demo

```vue
<template>
  <c-splitter style="height: 200px; border: 1px solid #f0f0f0">
    <c-splitter-panel :default-size="200" :min="100">
      <div style="padding: 16px">Left</div>
    </c-splitter-panel>
    <c-splitter-panel :min="100">
      <div style="padding: 16px">Right</div>
    </c-splitter-panel>
  </c-splitter>
</template>
```

:::

## 垂直布局

`layout="vertical"` 切换成上下分隔。

:::demo

```vue
<template>
  <c-splitter layout="vertical" style="height: 280px; border: 1px solid #f0f0f0">
    <c-splitter-panel :default-size="100" :min="50">
      <div style="padding: 16px">Top</div>
    </c-splitter-panel>
    <c-splitter-panel>
      <div style="padding: 16px">Bottom</div>
    </c-splitter-panel>
  </c-splitter>
</template>
```

:::

## 多面板

放多个 `<c-splitter-panel>` 即可形成"三栏布局"，每两栏之间一条分隔条。

:::demo

```vue
<template>
  <c-splitter style="height: 220px; border: 1px solid #f0f0f0">
    <c-splitter-panel :default-size="160" :min="80">
      <div style="padding: 16px; background: #fafafa; height: 100%">侧边栏</div>
    </c-splitter-panel>
    <c-splitter-panel>
      <div style="padding: 16px">主内容</div>
    </c-splitter-panel>
    <c-splitter-panel :default-size="200" :min="100">
      <div style="padding: 16px; background: #fafafa; height: 100%">右侧详情</div>
    </c-splitter-panel>
  </c-splitter>
</template>
```

:::

## 限制最小 / 最大尺寸

每个面板可独立设置 `min` / `max`，防止被拖到不可用尺寸。

:::demo

```vue
<template>
  <c-splitter style="height: 200px; border: 1px solid #f0f0f0">
    <c-splitter-panel :default-size="200" :min="120" :max="320">
      <div style="padding: 12px">min=120, max=320</div>
    </c-splitter-panel>
    <c-splitter-panel :min="80">
      <div style="padding: 12px">min=80</div>
    </c-splitter-panel>
  </c-splitter>
</template>
```

:::

## 不可拖动

设置 `:resizable="false"` 让面板交界处不出现拖拽条（可用作单纯的 flex 布局容器）。

:::demo

```vue
<template>
  <c-splitter style="height: 160px; border: 1px solid #f0f0f0">
    <c-splitter-panel :default-size="200" :resizable="false">
      <div style="padding: 12px; background: #fafafa; height: 100%">固定 200px</div>
    </c-splitter-panel>
    <c-splitter-panel>
      <div style="padding: 12px">弹性</div>
    </c-splitter-panel>
  </c-splitter>
</template>
```

:::

## 监听尺寸变化

`resize` / `resizeStart` / `resizeEnd` 都返回当前各面板像素尺寸数组。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const sizes = ref('（未拖动）')

function onResize(arr) {
  sizes.value = arr.map((n) => Math.round(n)).join(' / ')
}
</script>

<template>
  <c-splitter style="height: 180px; border: 1px solid #f0f0f0" @resize="onResize">
    <c-splitter-panel :default-size="200" :min="80">
      <div style="padding: 12px">A</div>
    </c-splitter-panel>
    <c-splitter-panel :min="80">
      <div style="padding: 12px">B</div>
    </c-splitter-panel>
    <c-splitter-panel :default-size="160" :min="80">
      <div style="padding: 12px">C</div>
    </c-splitter-panel>
  </c-splitter>
  <p style="margin-top: 8px; color: #666">当前尺寸：{{ sizes }}</p>
</template>
```

:::

## API

### Splitter Props

| 参数        | 类型                         | 默认值         | 说明                                                              |
| ----------- | ---------------------------- | -------------- | ----------------------------------------------------------------- |
| layout      | `'horizontal' \| 'vertical'` | `'horizontal'` | 布局方向                                                          |
| orientation | `'horizontal' \| 'vertical'` | -              | L-2.23：`layout` 的别名（对标 ant `Splitter`）；显式 `layout` 优先 |

### Splitter Events

| 事件名      | 回调签名            | 触发时机           |
| ----------- | ------------------- | ------------------ |
| resize      | `(sizes: number[])` | 拖拽过程中持续触发 |
| resizeStart | `(sizes: number[])` | 开始拖拽           |
| resizeEnd   | `(sizes: number[])` | 结束拖拽           |

### SplitterPanel Props

| 参数                | 类型                                                           | 默认值  | 说明                                                                              |
| ------------------- | -------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------- |
| size                | `number \| string`                                             | —       | 由外部状态接管的尺寸                                                              |
| defaultSize         | `number \| string`                                             | —       | 初始尺寸（不接管时生效）                                                          |
| min                 | `number \| string`                                             | `0`     | 最小尺寸                                                                          |
| max                 | `number \| string`                                             | —       | 最大尺寸                                                                          |
| resizable           | `boolean`                                                      | `true`  | 是否在该面板右 / 下侧画拖拽条                                                     |
| collapsible         | `boolean \| { start?: boolean; end?: boolean }`                | `false` | 是否允许折叠；对象形态分别声明两端                                                |
| showCollapsibleIcon | `boolean`                                                      | `false` | L-2.23：是否在 resizer 上渲染折叠 / 展开按钮（需配合 `collapsible`）                |
