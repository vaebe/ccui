# Image 图片

带占位、错误兜底、懒加载和大图预览的图片组件。

## 基本使用

最简形式只需要 `src`，可加 `width` / `height` / `alt`。

:::demo

```vue
<template>
  <c-image src="https://picsum.photos/seed/c-image/600/400" width="200" alt="示例图" />
</template>
```

:::

## 大图预览

设置 `preview` 后，点击图片会弹出全屏预览，支持缩放 / 重置 / 关闭。

:::demo

```vue
<template>
  <c-image src="https://picsum.photos/seed/c-image-preview/600/400" :width="200" :height="200" fit="cover" preview />
  <p style="margin-top: 8px; color: var(--ccui-color-text-secondary)">点击图片打开预览</p>
</template>
```

:::

## 适应方式

`fit` 与 CSS `object-fit` 一致：`fill` / `contain` / `cover` / `none` / `scale-down`。

:::demo

```vue
<script setup>
const fits = ['fill', 'contain', 'cover', 'none', 'scale-down']
const url = 'https://picsum.photos/seed/c-image-fit/600/400'
</script>

<template>
  <div style="display: flex; gap: 16px; flex-wrap: wrap">
    <div v-for="f in fits" :key="f" style="text-align: center">
      <c-image :src="url" :fit="f" :width="120" :height="80" />
      <div style="margin-top: 4px; color: var(--ccui-color-text-secondary)">{{ f }}</div>
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
    fallback="https://picsum.photos/seed/c-image-fallback/600/400"
  />
  &nbsp;
  <c-image src="https://invalid.example.com/y.png" :width="160" :height="120">
    <template #error>
      <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--ccui-color-error)">
        资源已下线 <c-icon name="mdi:close-circle" />
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
  <div style="height: 200px; overflow: auto; border: 1px dashed var(--ccui-color-border); padding: 8px">
    <p style="color: var(--ccui-color-text-secondary)">滚动下方查看懒加载图片：</p>
    <div style="height: 240px"></div>
    <c-image src="https://picsum.photos/seed/c-image-lazy/600/400" :width="200" lazy root-margin="50px" />
  </div>
</template>
```

:::

## 自定义占位

`#placeholder` slot 替换默认的"加载中"提示。

:::demo

```vue
<template>
  <c-image src="https://picsum.photos/seed/c-image-ph/600/400" :width="200" :height="120">
    <template #placeholder>
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, var(--ccui-area) 25%, var(--ccui-color-border-secondary) 50%, var(--ccui-area) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          color: var(--ccui-color-text-tertiary);
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

## 事件追踪（load / error / click）

`load` / `error` / `click` 三个事件覆盖图片完整生命周期，可用于埋点、上报、统计。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const logs = ref([])
function trace(type, e) {
  logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${type}`)
  if (logs.value.length > 5) logs.value.length = 5
}
</script>

<template>
  <div style="display: flex; gap: 12px; align-items: flex-start">
    <c-image
      src="https://picsum.photos/seed/c-image-event/600/400"
      :width="160"
      :height="120"
      @load="trace('load')"
      @error="trace('error')"
      @click="trace('click')"
    />
    <ul style="margin: 0; padding-left: 18px; color: var(--ccui-color-text-secondary); font-size: 12px">
      <li v-if="!logs.length">尚无事件</li>
      <li v-for="(log, i) in logs" :key="i">{{ log }}</li>
    </ul>
  </div>
</template>
```

:::

## 多张图片相册（ImagePreview）

`<c-image-preview>` 把多张图聚成一组，点击任一张进入统一预览：左右切换 / 缩放 / 关闭。

:::demo

```vue
<script setup>
const photos = [
  'https://picsum.photos/seed/c-image-g1/600/400',
  'https://picsum.photos/seed/c-image-g2/600/400',
  'https://picsum.photos/seed/c-image-g3/600/400',
]
</script>

<template>
  <c-image-preview :items="photos">
    <div style="display: flex; gap: 12px">
      <c-image v-for="(url, i) in photos" :key="i" :src="url" :width="120" :height="80" fit="cover" />
    </div>
  </c-image-preview>
  <p style="margin-top: 8px; color: var(--ccui-color-text-secondary)">点击任一张图片打开相册预览</p>
</template>
```

:::

## 受控预览（外部按钮唤起）

`preview` 传对象进入受控模式：父组件决定 `visible` / `current`，预览状态变化通过 `update:preview` 与 `change` 回写。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const photos = ['https://picsum.photos/seed/c-image-ctl1/600/400', 'https://picsum.photos/seed/c-image-ctl2/600/400']
const previewState = ref({ visible: false, current: 0 })

function openAt(idx) {
  previewState.value = { visible: true, current: idx }
}
</script>

<template>
  <div style="display: flex; gap: 8px; margin-bottom: 12px">
    <c-button @click="openAt(0)">从第 1 张开始</c-button>
    <c-button @click="openAt(1)">从第 2 张开始</c-button>
  </div>
  <c-image-preview v-model:preview="previewState" :items="photos" />
</template>
```

:::

## 失败兜底链

`fallback` 与 `#error` slot 可同时存在：fallback 是「先重试一次」，再失败才走 error slot。常用于 CDN 多重备份场景。

:::demo

```vue
<template>
  <c-image
    src="https://invalid.example.com/y.png"
    :width="200"
    :height="120"
    fallback="https://also-invalid.example.com/x.png"
  >
    <template #error>
      <div
        style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          background: var(--ccui-area);
          color: #cf1322;
          font-size: 12px;
          gap: 4px;
        "
      >
        <c-icon name="mdi:alert" />
        <span>主图与备份图均失败</span>
      </div>
    </template>
  </c-image>
</template>
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
