# Watermark 水印

为页面或局部容器盖上重复的、平铺的水印。常用于"版权提示 / 数据保密 / 防截图泄露"等场景。

## 基本使用

把要保护的内容包在 `<c-watermark>` 里，传入 `content`。

:::demo

```vue
<template>
  <c-watermark content="@vaebe/ccui">
    <div style="height: 200px; background: #f6f8fa; padding: 16px">水印保护区域，文字会随宽高密铺。</div>
  </c-watermark>
</template>
```

:::

## 多行文字

`content` 传数组时按多行排列。

:::demo

```vue
<template>
  <c-watermark :content="['CCUI', 'Confidential']">
    <div style="height: 200px; background: #fff; border: 1px dashed #d9d9d9; padding: 16px">多行水印</div>
  </c-watermark>
</template>
```

:::

## 自定义旋转

`rotate` 控制旋转角度（默认 -22°，与常见水印一致）。

:::demo

```vue
<template>
  <c-watermark content="ROTATE 0" :rotate="0">
    <div style="height: 100px; background: #fafafa; padding: 12px">rotate=0</div>
  </c-watermark>
  <c-watermark content="ROTATE -45" :rotate="-45" style="margin-top: 12px">
    <div style="height: 100px; background: #fafafa; padding: 12px">rotate=-45</div>
  </c-watermark>
</template>
```

:::

## 字体样式

`font` 接受 `color` / `fontSize` / `fontWeight` / `fontStyle` / `fontFamily`。

:::demo

```vue
<template>
  <c-watermark content="Important" :font="{ color: 'rgba(255, 0, 0, 0.18)', fontSize: 18, fontWeight: 600 }">
    <div style="height: 160px; background: #fff; border: 1px solid #f0f0f0; padding: 16px">
      自定义颜色 / 字号 / 粗细
    </div>
  </c-watermark>
</template>
```

:::

## 控制密度

`gap` 是相邻水印块的水平 / 垂直间距，`width` / `height` 是单块水印的盒子尺寸。

:::demo

```vue
<template>
  <c-watermark content="dense" :gap="[40, 40]" :width="80" :height="40">
    <div style="height: 160px; background: #f6f8fa; padding: 12px">高密度</div>
  </c-watermark>
  <c-watermark content="sparse" :gap="[180, 120]" style="margin-top: 12px">
    <div style="height: 160px; background: #f6f8fa; padding: 12px">低密度</div>
  </c-watermark>
</template>
```

:::

## 图片水印

`image` 接受图片地址（建议是带透明通道的 PNG / SVG），优先于文字。

:::demo

```vue
<template>
  <c-watermark
    image="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCAxMjAgNjQiPjxyZWN0IHg9IjE0IiB5PSIyMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDAsMCwwLDAuMikiIHN0cm9rZS13aWR0aD0iMi41Ii8+PHRleHQgeD0iNjgiIHk9IjQwIiBmb250LWZhbWlseT0iLWFwcGxlLXN5c3RlbSxTZWdvZSBVSSxzYW5zLXNlcmlmIiBmb250LXNpemU9IjIyIiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSJyZ2JhKDAsMCwwLDAuMTgpIj5jY3VpPC90ZXh0Pjwvc3ZnPg=="
    :width="120"
    :height="64"
  >
    <div style="height: 200px; background: #fff; border: 1px solid #f0f0f0; padding: 16px">图片水印（背景层）</div>
  </c-watermark>
</template>
```

:::

## API

### Props

| 参数    | 类型                 | 默认值       | 说明                                         |
| ------- | -------------------- | ------------ | -------------------------------------------- |
| content | `string \| string[]` | `''`         | 文字水印（数组按多行排列）                   |
| image   | string               | `''`         | 图片水印地址（优先于 `content`）             |
| width   | number               | `120`        | 单个水印块的宽度（px）                       |
| height  | number               | `64`         | 单个水印块的高度（px）                       |
| rotate  | number               | `-22`        | 旋转角度（度）                               |
| zIndex  | number               | `9`          | 水印层 `z-index`                             |
| gap     | `[number, number]`   | `[100, 100]` | 水印间距 `[水平, 垂直]`                      |
| offset  | `[number, number]`   | `undefined`  | 偏移量，控制起点位置                         |
| font    | `WatermarkFont`      | `{}`         | 字体样式（color / fontSize / fontWeight 等） |
