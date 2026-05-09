# Carousel 走马灯

旋转切换图像或卡片的容器组件。支持自动播放、循环、四向指示器、`scrollx` / `fade` 两种切换效果以及前后切换箭头。当一组同等内容需要在水平方向轮播展示时使用。

## 基本用法

每个直接子节点会被当作一帧，`Carousel` 自动渲染指示器。

:::demo

```vue
<template>
  <c-carousel style="height: 160px">
    <div style="height: 160px; background: #1677ff; color: #fff; line-height: 160px; text-align: center">
      第 1 帧
    </div>
    <div style="height: 160px; background: #36ad6a; color: #fff; line-height: 160px; text-align: center">
      第 2 帧
    </div>
    <div style="height: 160px; background: #f7b500; color: #fff; line-height: 160px; text-align: center">
      第 3 帧
    </div>
  </c-carousel>
</template>
```

:::

## 自动播放

`autoplay` 开启自动播放，`autoplay-speed` 控制间隔。鼠标移入时默认暂停（`pause-on-hover`）。

:::demo

```vue
<template>
  <c-carousel autoplay :autoplay-speed="2000" style="height: 160px">
    <div style="height: 160px; background: #1677ff; color: #fff; line-height: 160px; text-align: center">A</div>
    <div style="height: 160px; background: #36ad6a; color: #fff; line-height: 160px; text-align: center">B</div>
    <div style="height: 160px; background: #f7b500; color: #fff; line-height: 160px; text-align: center">C</div>
  </c-carousel>
</template>
```

:::

## 指示器位置

`dot-position` 支持 `top` / `bottom`（默认）/ `left` / `right`。

:::demo

```vue
<template>
  <c-carousel dot-position="top" style="height: 140px">
    <div style="height: 140px; background: #1677ff; color: #fff; line-height: 140px; text-align: center">top</div>
    <div style="height: 140px; background: #36ad6a; color: #fff; line-height: 140px; text-align: center">top</div>
  </c-carousel>
  <c-carousel dot-position="left" style="height: 140px; margin-top: 16px">
    <div style="height: 140px; background: #1677ff; color: #fff; line-height: 140px; text-align: center">left</div>
    <div style="height: 140px; background: #36ad6a; color: #fff; line-height: 140px; text-align: center">left</div>
  </c-carousel>
</template>
```

:::

## 渐隐切换

`effect="fade"` 用透明度做切换，适合海报类内容。

:::demo

```vue
<template>
  <c-carousel effect="fade" autoplay :autoplay-speed="2500" style="height: 160px">
    <div style="height: 160px; background: linear-gradient(135deg, #1677ff, #69c0ff)" />
    <div style="height: 160px; background: linear-gradient(135deg, #36ad6a, #95de64)" />
    <div style="height: 160px; background: linear-gradient(135deg, #f7b500, #ffd666)" />
  </c-carousel>
</template>
```

:::

## 前后切换箭头

`arrows` 显示左右切换箭头。配合 `infinite="false"` 在边界停住。

:::demo

```vue
<template>
  <c-carousel arrows :infinite="false" style="height: 160px">
    <div style="height: 160px; background: #1677ff; color: #fff; line-height: 160px; text-align: center">1</div>
    <div style="height: 160px; background: #36ad6a; color: #fff; line-height: 160px; text-align: center">2</div>
    <div style="height: 160px; background: #f7b500; color: #fff; line-height: 160px; text-align: center">3</div>
  </c-carousel>
</template>
```

:::

## 受控模式

通过 `v-model` 接管激活索引，外部按钮也能驱动跳转。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const active = ref(0)
</script>

<template>
  <c-carousel v-model="active" style="height: 160px">
    <div style="height: 160px; background: #1677ff; color: #fff; line-height: 160px; text-align: center">0</div>
    <div style="height: 160px; background: #36ad6a; color: #fff; line-height: 160px; text-align: center">1</div>
    <div style="height: 160px; background: #f7b500; color: #fff; line-height: 160px; text-align: center">2</div>
  </c-carousel>
  <div style="margin-top: 12px; display: flex; gap: 8px">
    <c-button @click="active = (active + 2) % 3">上一帧</c-button>
    <c-button @click="active = (active + 1) % 3">下一帧</c-button>
    <c-button @click="active = 0">回到首帧</c-button>
  </div>
</template>
```

:::

## 命令式调用

通过模板 ref 拿到 `next` / `prev` / `goTo` 三个方法，做更复杂的外部联动。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const carouselRef = ref<{ next: () => void; prev: () => void; goTo: (i: number, dontAnimate?: boolean) => void } | null>(null)
</script>

<template>
  <c-carousel ref="carouselRef" style="height: 160px">
    <div style="height: 160px; background: #1677ff; color: #fff; line-height: 160px; text-align: center">A</div>
    <div style="height: 160px; background: #36ad6a; color: #fff; line-height: 160px; text-align: center">B</div>
    <div style="height: 160px; background: #f7b500; color: #fff; line-height: 160px; text-align: center">C</div>
  </c-carousel>
  <div style="margin-top: 12px; display: flex; gap: 8px">
    <c-button @click="carouselRef?.prev()">prev()</c-button>
    <c-button @click="carouselRef?.next()">next()</c-button>
    <c-button @click="carouselRef?.goTo(2, true)">goTo(2, true)</c-button>
  </div>
</template>
```

:::

## API

### Props

| 参数          | 类型                                          | 默认值       | 说明                                                          |
| ------------- | --------------------------------------------- | ------------ | ------------------------------------------------------------- |
| modelValue    | number                                        | --           | 当前激活索引，支持 `v-model`；不传则非受控                    |
| defaultActive | number                                        | `0`          | 非受控初始索引                                                |
| autoplay      | boolean                                       | `false`      | 是否自动播放                                                  |
| autoplaySpeed | number                                        | `3000`       | 自动播放间隔（毫秒）                                          |
| dots          | boolean                                       | `true`       | 是否显示指示器                                                |
| dotPosition   | `'top' \| 'bottom' \| 'left' \| 'right'`      | `'bottom'`   | 指示器位置                                                    |
| effect        | `'scrollx' \| 'fade'`                         | `'scrollx'`  | 切换动效。`scrollx` 横向位移；`fade` 透明度交替               |
| infinite      | boolean                                       | `true`       | 是否循环；末尾点 next 回到 0、首位点 prev 跳到末尾            |
| arrows        | boolean                                       | `false`      | 是否显示前后切换箭头                                          |
| pauseOnHover  | boolean                                       | `true`       | 鼠标悬浮时是否暂停 autoplay                                   |
| duration      | number                                        | `500`        | 切换动画时长（毫秒），同时控制 transition-duration            |

### Events

| 事件名            | 回调签名                                | 触发时机             |
| ----------------- | --------------------------------------- | -------------------- |
| update:modelValue | `(value: number)`                       | 切换时（受控/非受控均触发） |
| change            | `(current: number, prev: number)`       | 实际切换帧时         |

### Exposed methods

| 方法 | 签名                                       | 说明                                  |
| ---- | ------------------------------------------ | ------------------------------------- |
| next | `() => void`                               | 切到下一帧（受 `infinite` 影响）      |
| prev | `() => void`                               | 切到上一帧（受 `infinite` 影响）      |
| goTo | `(index: number, dontAnimate?: boolean) => void` | 跳到指定索引；`dontAnimate=true` 时不加动画类 |

## 已知限制（未交付）

- **手势滑动 / 触屏 swipe**：移动端左右滑动切换暂未实现，需要单独一批做指针事件 + 阈值判定。
- **键盘无障碍**：ArrowLeft / ArrowRight / Home / End 键盘导航和 `aria-roledescription="carousel"` / `aria-live` 通告暂缺。
- **afterChange 钩子**：当前 `change` 在切换发起时触发；切换动画结束后的精确回调需要补一个 transitionend 监听。
- **adaptiveHeight / 多帧并排（slidesToShow）**：当前一帧占满 viewport，多帧并排和按内容高度自适应留给后续。
- **自定义指示器渲染**：`dots-render` slot 暂未提供，目前固定为短条样式。
