# Affix 固钉

将页面元素钉在可视区域。常用于侧边目录、操作栏、工具条等需要常驻视野的场景。

## 基本使用

相对顶部 0px 固定，滚动到阈值后元素贴住顶部。下面在一个可滚动容器内演示效果（页面本身带固定导航，直接相对窗口顶部 0px 固定会被导航遮住，故用容器演示）。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
const containerRef = ref<HTMLElement | null>(null)
</script>

<template>
  <div
    ref="containerRef"
    style="height: 220px; overflow: auto; border: 1px solid var(--ccui-color-border-secondary); border-radius: 4px; padding: 12px; position: relative;"
  >
    <div style="height: 60px; color: var(--ccui-color-text-tertiary)">向下滚动这个容器 ↓</div>
    <c-affix :offset-top="0" :target="() => containerRef">
      <c-button type="primary">固定到顶部 0px</c-button>
    </c-affix>
    <div style="height: 600px; padding-top: 12px; color: var(--ccui-color-text-tertiary)">占位内容，撑开滚动空间……</div>
  </div>
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
    <c-button :type="fixed ? 'primary' : 'default'">{{ fixed ? '已固定到顶部 100px' : '未固定，向下滚动' }}</c-button>
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
      border: 1px solid var(--ccui-color-border-secondary);
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

## 自定义层级 zIndex

默认 `z-index: 10`；当页面里有 Drawer / Modal（更高 z-index）时按需调高，确保固钉不被遮罩盖住。

:::demo

```vue
<template>
  <c-affix :offset-top="0" :z-index="1100">
    <c-button type="primary">z-index = 1100</c-button>
  </c-affix>
  <p>常见取值：默认 10、悬浮触发器 100、Modal mask 1000、需要盖住 mask 时 1100+</p>
</template>
```

:::

## 多个 Affix 错开

工具栏吸顶 + 二级筛选条吸顶，靠 `offsetTop` 错开高度，构成「双层 sticky」效果。

:::demo

```vue
<template>
  <c-affix :offset-top="0">
    <div style="background: var(--ccui-color-primary); color: var(--ccui-color-text-light-solid); padding: 8px 12px; border-radius: 4px">
      第一层：主导航（offsetTop=0）
    </div>
  </c-affix>
  <c-affix :offset-top="48" style="margin-top: 8px">
    <div style="background: var(--ccui-color-bg-container); border: 1px solid var(--ccui-color-border); padding: 8px 12px; border-radius: 4px">
      第二层：筛选条（offsetTop=48）
    </div>
  </c-affix>
  <p style="margin-top: 12px">向下滚动，两层依次贴住顶部不重叠</p>
</template>
```

:::

## 表格工具栏吸顶

后台管理页常见：表格行很长，工具栏（搜索 / 新建 / 批量操作）始终可达。

:::demo

```vue
<script setup>
import { ref } from 'vue'

const keyword = ref('')
</script>

<template>
  <c-affix :offset-top="0">
    <div
      style="
        background: var(--ccui-color-bg-container);
        padding: 12px;
        border-bottom: 1px solid var(--ccui-color-border-secondary);
        display: flex;
        gap: 8px;
        align-items: center;
      "
    >
      <c-input v-model="keyword" placeholder="搜索订单号" style="width: 200px" />
      <c-button>批量删除</c-button>
      <c-button type="primary">+ 新建订单</c-button>
    </div>
  </c-affix>
  <p style="margin-top: 12px">下方表格略...</p>
</template>
```

:::

## 章节锚点目录

侧边目录 sticky，配合右侧主内容滚动，是长文档 / 商品详情页常用排版。

:::demo

```vue
<template>
  <div style="display: flex; gap: 24px; align-items: flex-start">
    <c-affix :offset-top="80" style="width: 160px; flex-shrink: 0">
      <div style="background: var(--ccui-area); border-radius: 6px; padding: 12px">
        <p style="margin: 0 0 8px; color: var(--ccui-color-text-secondary); font-size: 12px">目录</p>
        <a href="#" style="display: block; color: var(--ccui-color-primary); margin: 4px 0">第一章 介绍</a>
        <a href="#" style="display: block; color: var(--ccui-color-primary); margin: 4px 0">第二章 安装</a>
        <a href="#" style="display: block; color: var(--ccui-color-primary); margin: 4px 0">第三章 用法</a>
        <a href="#" style="display: block; color: var(--ccui-color-primary); margin: 4px 0">第四章 进阶</a>
      </div>
    </c-affix>
    <div style="flex: 1">
      <h3>正文区</h3>
      <p>左侧目录会随页面滚动贴到 80px 处保持可见。</p>
    </div>
  </div>
</template>
```

:::

## 容器内 vs 全局对比

并列展示「以 window 为参照」和「以容器为参照」两种模式，便于业务侧理解 `target` 的影响范围。

:::demo

```vue
<script setup>
import { ref } from 'vue'
const boxRef = ref(null)
</script>

<template>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
    <div>
      <p style="color: var(--ccui-color-text-secondary); margin: 0 0 8px">target = window（默认）</p>
      <c-affix :offset-top="60">
        <c-button>滚整页时贴顶</c-button>
      </c-affix>
    </div>
    <div ref="boxRef" style="height: 160px; overflow: auto; border: 1px solid var(--ccui-color-border-secondary); padding: 8px">
      <p style="color: var(--ccui-color-text-secondary); margin: 0 0 8px">target = 本容器</p>
      <c-affix :offset-top="0" :target="() => boxRef">
        <c-button type="primary">只在此盒子内贴顶</c-button>
      </c-affix>
      <div style="height: 400px; padding-top: 12px">滚动此处验证 →</div>
    </div>
  </div>
</template>
```

:::

## API

### Props

| 参数         | 类型                                                           | 默认值      | 说明                                                                            |
| ------------ | -------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------- |
| offsetTop    | number                                                         | `0`         | 距离窗口（或目标容器）顶部多少像素后开始固定。`offsetBottom` 未传时启用顶部模式 |
| offsetBottom | number                                                         | `undefined` | 距离窗口（或目标容器）底部多少像素后开始固定。设置该值则忽略 `offsetTop`        |
| target       | `string \| HTMLElement \| () => HTMLElement \| Window \| null` | `window`    | 滚动容器。可传 CSS 选择器、DOM 节点或返回 DOM 节点的函数                        |
| zIndex       | number                                                         | `10`        | 固定时元素的 `z-index`                                                          |

### Events

| 事件名 | 回调签名           | 触发时机                      |
| ------ | ------------------ | ----------------------------- |
| change | `(fixed: boolean)` | 固定状态变化（进入/退出固定） |

## 注意事项

- `c-affix` 内部用一个占位元素保持原始位置和尺寸，固定时把内容切换为 `position: fixed`。所以父容器不要给固钉外层加 `transform`，会让 `position: fixed` 失效。
- 如果固定后宽度异常，请检查父级是否使用 `display: flex` 等会改变子元素宽度计算的布局。
