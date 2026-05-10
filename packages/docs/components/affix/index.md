# Affix 固钉

将页面元素钉在可视区域。常用于侧边目录、操作栏、工具条等需要常驻视野的场景。

## 基本使用

默认相对窗口顶部 0px 固定。滚动页面查看效果。

:::demo

```vue
<template>
  <c-affix :offset-top="0">
    <c-button type="primary">固定到顶部 0px</c-button>
  </c-affix>
  <p style="margin-top: 12px">滚动页面查看效果</p>
</template>
```

:::

## 偏移量 offsetTop

通过 `offset-top` 设置距顶部固定的距离。多个固定元素错开摆放。

:::demo

```vue
<template>
  <c-affix :offset-top="80">
    <c-button type="primary">距顶 80px</c-button>
  </c-affix>
  <p>向下滚动查看固定效果</p>
</template>
```

:::

## 固定到底部 offsetBottom

`offset-bottom` 把元素固定在视口底部，常用于「返回顶部」、底部操作栏。

:::demo

```vue
<template>
  <c-affix :offset-bottom="20">
    <c-button type="primary">距底 20px</c-button>
  </c-affix>
  <p>滚动直到容器超出视口下边界，按钮会贴在底部</p>
</template>
```

:::

## 监听固定状态变化

通过 `change` 事件感知是否进入/退出固定状态，可联动展示阴影、收起等。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const fixed = ref(false)

function onChange(val: boolean) {
  fixed.value = val
}
</script>

<template>
  <p>当前是否固定：{{ fixed ? '是' : '否' }}</p>
  <c-affix :offset-top="100" @change="onChange">
    <c-button :type="fixed ? 'primary' : 'default'">{{
      fixed ? '已固定到顶部 100px' : '未固定，向下滚动'
    }}</c-button>
  </c-affix>
</template>
```

:::

## 在滚动容器中

通过 `target` 指定一个可滚动的父容器（CSS 选择器或 DOM 元素返回函数），固钉相对容器边界进行计算。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
const containerRef = ref<HTMLElement | null>(null)
</script>

<template>
  <div
    ref="containerRef"
    style="
      height: 200px;
      overflow: auto;
      border: 1px solid #f0f0f0;
      padding: 12px;
      position: relative;
    "
  >
    <div style="height: 80px">先滚动这个容器</div>
    <c-affix :offset-top="0" :target="() => containerRef">
      <c-button type="primary">在容器内固定</c-button>
    </c-affix>
    <div style="height: 600px; padding-top: 12px">
      <p>占位内容用来撑开滚动空间...</p>
      <p>继续滚动...</p>
    </div>
  </div>
</template>
```

:::

## API

### Props

| 参数         | 类型                                                              | 默认值      | 说明                                                                                       |
| ------------ | ----------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------ |
| offsetTop    | number                                                            | `0`         | 距离窗口（或目标容器）顶部多少像素后开始固定。`offsetBottom` 未传时启用顶部模式            |
| offsetBottom | number                                                            | `undefined` | 距离窗口（或目标容器）底部多少像素后开始固定。设置该值则忽略 `offsetTop`                   |
| target       | `string \| HTMLElement \| () => HTMLElement \| Window \| null`    | `window`    | 滚动容器。可传 CSS 选择器、DOM 节点或返回 DOM 节点的函数                                   |
| zIndex       | number                                                            | `10`        | 固定时元素的 `z-index`                                                                     |

### Events

| 事件名 | 回调签名             | 触发时机                       |
| ------ | -------------------- | ------------------------------ |
| change | `(fixed: boolean)`   | 固定状态变化（进入/退出固定）  |

## 注意事项

- `c-affix` 内部用一个占位元素保持原始位置和尺寸，固定时把内容切换为 `position: fixed`。所以父容器不要给固钉外层加 `transform`，会让 `position: fixed` 失效。
- 如果固定后宽度异常，请检查父级是否使用 `display: flex` 等会改变子元素宽度计算的布局。
