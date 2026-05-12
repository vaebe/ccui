# Image 图片

带占位、错误兜底、懒加载和大图预览的图片组件。

## 基本使用

最简形式只需要 `src`，可加 `width` / `height` / `alt`。

:::demo

```vue
<template>
  <c-image src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg" width="200" alt="示例图" />
</template>
```

:::

## 大图预览

设置 `preview` 后，点击图片会弹出全屏预览，支持缩放 / 重置 / 关闭。

:::demo

```vue
<template>
  <c-image
    src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
    :width="200"
    :height="200"
    fit="cover"
    preview
  />
  <p style="margin-top: 8px; color: #666">点击图片打开预览</p>
</template>
```

:::

## 适应方式

`fit` 与 CSS `object-fit` 一致：`fill` / `contain` / `cover` / `none` / `scale-down`。

:::demo

```vue
<script setup>
const fits = ['fill', 'contain', 'cover', 'none', 'scale-down']
const url = 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg'
</script>

<template>
  <div style="display: flex; gap: 16px; flex-wrap: wrap">
    <div v-for="f in fits" :key="f" style="text-align: center">
      <c-image :src="url" :fit="f" :width="120" :height="80" />
      <div style="margin-top: 4px; color: #666">{{ f }}</div>
    </div>
  </div>
</template>
```

:::

## 加载失败兜底

加载失败时优先显示 `fallback` 图，否则展示"加载失败"文案；也可用 `#error` slot 完全自定义。

:::demo

```vue
<template>
  <c-image
    src="https://invalid.example.com/x.png"
    width="160"
    height="120"
    fallback="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
  />
  &nbsp;
  <c-image src="https://invalid.example.com/y.png" :width="160" :height="120">
    <template #error>
      <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #ff4d4f">
        资源已下线 ✕
      </div>
    </template>
  </c-image>
</template>
```

:::

## 懒加载

`lazy` 配合 IntersectionObserver，元素进入视口才请求图片，可降低首屏成本。

:::demo

```vue
<template>
  <div style="height: 200px; overflow: auto; border: 1px dashed #d9d9d9; padding: 8px">
    <p style="color: #666">滚动下方查看懒加载图片：</p>
    <div style="height: 240px"></div>
    <c-image
      src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
      :width="200"
      lazy
      root-margin="50px"
    />
  </div>
</template>
```

:::

## 自定义占位

`#placeholder` slot 替换默认的"加载中"提示。

:::demo

```vue
<template>
  <c-image src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg" :width="200" :height="120">
    <template #placeholder>
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, #f5f5f5 25%, #eee 50%, #f5f5f5 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          color: #999;
        "
      >
        loading…
      </div>
    </template>
  </c-image>
</template>

<style>
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
```

:::

## API

### Props

| 参数       | 类型               | 默认值   | 说明                           |
| ---------- | ------------------ | -------- | ------------------------------ |
| src        | string             | —        | 必填，图片地址                 |
| alt        | string             | `''`     | 替代文本                       |
| fit        | `ImageFit`         | `'fill'` | 与 CSS `object-fit` 同义       |
| width      | `number \| string` | `''`     | 宽度（数字按 px）              |
| height     | `number \| string` | `''`     | 高度                           |
| preview    | boolean            | `false`  | 启用大图预览，点击弹层         |
| fallback   | string             | `''`     | 加载失败时使用的兜底图片地址   |
| lazy       | boolean            | `false`  | 懒加载（IntersectionObserver） |
| rootMargin | string             | `'0px'`  | 配合 lazy 的预加载距离         |

### Events

| 事件名 | 回调签名          | 触发时机     |
| ------ | ----------------- | ------------ |
| load   | `(e: Event)`      | 图片加载完成 |
| error  | `(e: Event)`      | 加载失败     |
| click  | `(e: MouseEvent)` | 点击图片     |

### Slots

| 名称        | 说明               |
| ----------- | ------------------ |
| placeholder | 自定义加载中占位   |
| error       | 自定义加载失败展示 |
