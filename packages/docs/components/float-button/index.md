# FloatButton 悬浮按钮

固定在视图角落的按钮。

## 基本使用

:::demo

```vue
<template>
  <div style="position: relative; height: 200px; background: #f6f8fa">
    <c-float-button
      description="?"
      :style="{ insetBlockEnd: '16px', insetInlineEnd: '16px', position: 'absolute' }"
    />
  </div>
</template>
```

:::

## 主色 + 徽标

:::demo

```vue
<template>
  <div style="position: relative; height: 200px; background: #f6f8fa">
    <c-float-button
      type="primary"
      description="★"
      :badge="5"
      :style="{ insetBlockEnd: '16px', insetInlineEnd: '16px', position: 'absolute' }"
    />
  </div>
</template>
```

:::

## 方形

:::demo

```vue
<template>
  <div style="position: relative; height: 200px; background: #f6f8fa">
    <c-float-button
      shape="square"
      description="HOME"
      :style="{ insetBlockEnd: '16px', insetInlineEnd: '16px', position: 'absolute' }"
    />
  </div>
</template>
```

:::

## BackTop 回到顶部

> 滚动到 400px 以下后右下角出现「回到顶部」按钮，点击平滑滚回顶端。

:::demo

```vue
<template>
  <c-back-top />
</template>
```

:::
