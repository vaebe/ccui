# Carousel 走马灯

旋转切换图像或卡片的容器组件。支持自动播放、循环、四向指示器、`scrollx` / `fade` 两种切换效果、前后切换箭头、键盘导航和触摸滑动手势。当一组同等内容需要在水平方向轮播展示时使用。

## 基本用法

每个直接子节点会被当作一帧，`Carousel` 自动渲染指示器。

:::demo

```vue
<template>
  <c-carousel style="height: 160px">
    <div style="height: 160px; background: #1677ff; color: #fff; line-height: 160px; text-align: center">第 1 帧</div>
    <div style="height: 160px; background: #36ad6a; color: #fff; line-height: 160px; text-align: center">第 2 帧</div>
    <div style="height: 160px; background: #f7b500; color: #fff; line-height: 160px; text-align: center">第 3 帧</div>
  </c-carousel>
</template>
```

:::

## 自动播放

`autoplay` 开启自动播放，`autoplay-speed` 控制间隔。

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

## 悬停暂停

配合 `autoplay` 启用 `pause-on-hover`，鼠标移入时挂起轮播计时器，移出后立即恢复。常用于「Banner / 推荐位」让用户可以从容查看当前帧内容。

:::demo

```vue
<template>
  <c-carousel autoplay pause-on-hover :autoplay-speed="1500" style="height: 160px">
    <div style="height: 160px; background: #1677ff; color: #fff; line-height: 160px; text-align: center">
      鼠标移入即暂停 1
    </div>
    <div style="height: 160px; background: #36ad6a; color: #fff; line-height: 160px; text-align: center">
      鼠标移入即暂停 2
    </div>
    <div style="height: 160px; background: #f7b500; color: #fff; line-height: 160px; text-align: center">
      鼠标移入即暂停 3
    </div>
  </c-carousel>
</template>
```

:::

## 多卡片展示（slidesToShow）

`slides-to-show` 让一次显示多张帧，常用于商品卡片墙 / 头像列表横向轮播。当 `total <= slidesToShow` 时只渲染 1 个指示器。

:::demo

```vue
<template>
  <c-carousel :slides-to-show="3" arrows style="height: 140px">
    <div
      v-for="i in 6"
      :key="i"
      :style="{
        height: '140px',
        margin: '0 6px',
        borderRadius: '8px',
        background: '#f0f5ff',
        color: '#1677ff',
        textAlign: 'center',
        lineHeight: '140px',
        fontSize: '20px',
      }"
    >
      商品 {{ i }}
    </div>
  </c-carousel>
</template>
```

:::

## 一次滚动多张（slidesToScroll）

搭配 `slides-to-show` 一起使用，`slides-to-scroll` 控制 next/prev/autoplay 每次推进的步幅。下例每屏 3 张、每次切 2 张，常用于「成组翻页」式横向列表。

:::demo

```vue
<template>
  <c-carousel :slides-to-show="3" :slides-to-scroll="2" autoplay :autoplay-speed="2000" style="height: 140px">
    <div
      v-for="i in 8"
      :key="i"
      :style="{
        height: '140px',
        margin: '0 6px',
        borderRadius: '8px',
        background: i % 2 ? '#fff7e6' : '#fff1f0',
        color: '#d4380d',
        textAlign: 'center',
        lineHeight: '140px',
        fontSize: '20px',
      }"
    >
      卡片 {{ i }}
    </div>
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

## 触摸滑动

默认启用 swipe 手势（`swipeable`），左右滑动切换帧。`swipe-threshold` 控制触发阈值（默认 40px）。

:::demo

```vue
<template>
  <c-carousel style="height: 160px">
    <div style="height: 160px; background: #1677ff; color: #fff; line-height: 160px; text-align: center">
      ← 左滑下一帧 / 右滑上一帧 →
    </div>
    <div style="height: 160px; background: #36ad6a; color: #fff; line-height: 160px; text-align: center">B</div>
    <div style="height: 160px; background: #f7b500; color: #fff; line-height: 160px; text-align: center">C</div>
  </c-carousel>
</template>
```

:::

## 自定义指示器

通过 `customDot` 作用域插槽自定义每个指示器的渲染内容，接收 `{ index, isActive }`。

:::demo

```vue
<template>
  <c-carousel style="height: 160px">
    <div style="height: 160px; background: #1677ff; color: #fff; line-height: 160px; text-align: center">1</div>
    <div style="height: 160px; background: #36ad6a; color: #fff; line-height: 160px; text-align: center">2</div>
    <div style="height: 160px; background: #f7b500; color: #fff; line-height: 160px; text-align: center">3</div>
    <template #customDot="{ index, isActive }">
      <span
        :style="{
          display: 'inline-block',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: isActive ? '#1677ff' : 'rgba(0,0,0,0.15)',
          cursor: 'pointer',
          transition: 'background 0.3s',
        }"
      >
        {{ index + 1 }}
      </span>
    </template>
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

const carouselRef = ref<{
  next: () => void
  prev: () => void
  goTo: (i: number, dontAnimate?: boolean) => void
} | null>(null)
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

| 参数           | 类型                                     | 默认值      | 说明                                               |
| -------------- | ---------------------------------------- | ----------- | -------------------------------------------------- |
| modelValue     | number                                   | --          | 当前激活索引，支持 `v-model`；不传则非受控         |
| defaultActive  | number                                   | `0`         | 非受控初始索引                                     |
| autoplay       | boolean                                  | `false`     | 是否自动播放                                       |
| autoplaySpeed  | number                                   | `3000`      | 自动播放间隔（毫秒）                               |
| dots           | boolean                                  | `true`      | 是否显示指示器                                     |
| dotPosition    | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'`  | 指示器位置                                         |
| effect         | `'scrollx' \| 'fade'`                    | `'scrollx'` | 切换动效。`scrollx` 横向位移；`fade` 透明度交替    |
| infinite       | boolean                                  | `true`      | 是否循环；末尾点 next 回到 0、首位点 prev 跳到末尾 |
| arrows         | boolean                                  | `false`     | 是否显示前后切换箭头                               |
| pauseOnHover   | boolean                                  | `false`     | autoplay 模式下鼠标 hover 是否暂停                 |
| slidesToShow   | number                                   | `1`         | 一次展示几张幻灯片，仅 `effect='scrollx'` 生效     |
| slidesToScroll | number                                   | `1`         | 一次切换几张幻灯片，仅 `effect='scrollx'` 生效     |
| duration       | number                                   | `500`       | 切换动画时长（毫秒），同时控制 transition-duration |
| swipeable      | boolean                                  | `true`      | 是否启用触摸/指针 swipe 手势                       |
| swipeThreshold | number                                   | `40`        | swipe 触发阈值（像素），滑动距离超过此值才切换     |

### Events

| 事件名            | 回调签名                          | 触发时机                    |
| ----------------- | --------------------------------- | --------------------------- |
| update:modelValue | `(value: number)`                 | 切换时（受控/非受控均触发） |
| change            | `(current: number, prev: number)` | 实际切换帧时（动画开始）    |
| afterChange       | `(current: number)`               | 切换动画结束后              |

### Slots

| 插槽名    | 作用域                                 | 说明                                   |
| --------- | -------------------------------------- | -------------------------------------- |
| default   | --                                     | 每个直接子节点作为一帧                 |
| customDot | `{ index: number, isActive: boolean }` | 自定义每个指示器内容，点击外层 li 跳转 |

### Exposed methods

| 方法            | 签名                                             | 说明                                      |
| --------------- | ------------------------------------------------ | ----------------------------------------- |
| next            | `() => void`                                     | 切到下一帧（受 `infinite` 影响）          |
| prev            | `() => void`                                     | 切到上一帧（受 `infinite` 影响）          |
| goTo            | `(index: number, dontAnimate?: boolean) => void` | 跳到指定索引；`dontAnimate=true` 跳过动画 |
| getCurrentIndex | `() => number`                                   | 获取当前激活索引                          |

### 键盘导航

组件容器 `tabindex=0`，聚焦后可用以下按键：

| 按键                   | 操作         |
| ---------------------- | ------------ |
| ArrowRight / ArrowDown | 切到下一帧   |
| ArrowLeft / ArrowUp    | 切到上一帧   |
| Home                   | 跳到第一帧   |
| End                    | 跳到最后一帧 |

## 已知限制（未交付）

- **adaptiveHeight**：当前所有帧共用容器高度，按内容自适应留给后续。
- **responsive 断点配置**：暂未支持按断点动态切换 `slidesToShow` / `slidesToScroll`。
