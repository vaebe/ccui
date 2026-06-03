# ImagePreview 图片预览

多图预览组件，作为独立顶层组件存在（不挂在 Image 命名空间下）。

## 何时使用

- 多张图片需要统一预览，支持上一张 / 下一张切换。
- 缩略图列表 + 大图预览的画廊场景。
- 需要受控预览状态（外部按钮触发打开第 N 张）。

## items 模式

最简用法：把图片数组传给 `items`，组件自动渲染缩略图列表，点击打开预览。

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const items = [
      { src: 'https://picsum.photos/seed/a/600/400', alt: '风景 A' },
      { src: 'https://picsum.photos/seed/b/600/400', alt: '风景 B' },
      { src: 'https://picsum.photos/seed/c/600/400', alt: '风景 C' },
    ]
    return { items }
  },
})
</script>

<template>
  <c-image-preview :items="items" />
</template>
```

:::

`items` 也接 `string[]` 简写：

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {
      items: ['https://picsum.photos/seed/x/600/400', 'https://picsum.photos/seed/y/600/400'],
    }
  },
})
</script>

<template>
  <c-image-preview :items="items" />
</template>
```

:::

## 受控预览

传 `preview` 对象进入受控模式。外部按钮控制打开 / 关闭 / 当前下标。

:::demo

```vue
<script>
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  setup() {
    const preview = reactive({ visible: false, current: 0 })
    const items = [
      { src: 'https://picsum.photos/seed/m/600/400', alt: 'M' },
      { src: 'https://picsum.photos/seed/n/600/400', alt: 'N' },
      { src: 'https://picsum.photos/seed/o/600/400', alt: 'O' },
    ]
    const onUpdate = (next) => {
      Object.assign(preview, next)
    }
    return {
      preview,
      items,
      onUpdate,
      open: (i) => {
        preview.current = i
        preview.visible = true
      },
    }
  },
})
</script>

<template>
  <c-button @click="open(0)">看第 1 张</c-button>
  <c-button @click="open(1)" style="margin-left: 8px">看第 2 张</c-button>
  <c-button @click="open(2)" style="margin-left: 8px">看第 3 张</c-button>
  <c-image-preview :items="items" :preview="preview" @update:preview="onUpdate" />
</template>
```

:::

## 缩放 + 键盘导航

打开预览后：

- `+` / `−` / `⟳` 按钮缩放（默认上限 6×，下限 0.25×）。
- `ArrowLeft` / `ArrowRight` 切换上 / 下一张（循环）。
- `Escape` 关闭预览。

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {
      items: [
        'https://picsum.photos/seed/p/600/400',
        'https://picsum.photos/seed/q/600/400',
        'https://picsum.photos/seed/r/600/400',
      ],
    }
  },
})
</script>

<template>
  <c-image-preview :items="items" :max-zoom="8" :min-zoom="0.5" />
</template>
```

:::

## 默认 slot 模式

不传 `items` 时，缩略图完全由父组件渲染；预览状态走受控，由父组件决定当前显示哪张。

:::demo

```vue
<script>
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  setup() {
    const preview = reactive({ visible: false, current: 0 })
    const items = [
      { src: 'https://picsum.photos/seed/u/600/400', alt: 'U' },
      { src: 'https://picsum.photos/seed/v/600/400', alt: 'V' },
    ]
    const onUpdate = (next) => Object.assign(preview, next)
    const open = (i) => {
      preview.current = i
      preview.visible = true
    }
    return { preview, items, onUpdate, open }
  },
})
</script>

<template>
  <c-image-preview :items="items" :preview="preview" @update:preview="onUpdate">
    <div style="display: flex; gap: 12px">
      <img
        v-for="(it, i) in items"
        :key="i"
        :src="it.src"
        style="width: 100px; height: 100px; object-fit: cover; cursor: zoom-in"
        @click="open(i)"
      />
    </div>
  </c-image-preview>
</template>
```

:::

## ImagePreview 参数

| 参数    | 类型                                        | 默认 | 说明                                               |
| ------- | ------------------------------------------- | ---- | -------------------------------------------------- |
| items   | string[] \| { src: string; alt?: string }[] | --   | 图片数组；传则自动渲染缩略图，不传走默认 slot 模式 |
| preview | { visible?: boolean; current?: number }     | --   | 受控预览状态；传则受控，未传则内部维护             |
| maxZoom | number                                      | 6    | 缩放上限                                           |
| minZoom | number                                      | 0.25 | 缩放下限                                           |

## ImagePreview 事件

| 事件名         | 参数                                  | 说明                 |
| -------------- | ------------------------------------- | -------------------- |
| update:preview | { visible: boolean; current: number } | 受控模式回写         |
| change         | current: number                       | 当前显示图片下标变化 |
| visible-change | visible: boolean                      | 打开 / 关闭预览      |

## ImagePreview 插槽

| 插槽名  | 说明                                                  |
| ------- | ----------------------------------------------------- |
| default | 仅未传 `items` 时生效；缩略图等内容由父组件自定义渲染 |

## 行为说明

- **循环切换**：`prev` 在首张回到末尾；`next` 在末尾回到首张。
- **键盘监听**：仅在 `visible=true` 时绑定 `window.keydown`，关闭后解绑；组件卸载强制解绑防泄漏。
- **缩放重置**：每次切换图片自动 `scale=1`。
- **z-index 1100**：高于 Modal / Drawer，避免被覆盖。
