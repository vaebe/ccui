# Tour 漫游引导

新功能上线时一步步带用户认识页面。蒙层 + 镂空高亮 + 浮层说明 + 上一步/下一步/完成。基于 floating-ui 做相对目标元素的浮层定位。

## 基本用法

`v-model:open` 控制显示，`v-model:current` 控制当前步骤索引，`steps` 提供每步的标题、描述、目标元素。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const current = ref(0)
const btn1 = ref<HTMLElement | null>(null)
const btn2 = ref<HTMLElement | null>(null)

const steps = [
  {
    title: '步骤一：保存',
    description: '点这里保存当前内容',
    target: () => btn1.value,
    placement: 'bottom' as const,
  },
  {
    title: '步骤二：导出',
    description: '点这里导出 PDF',
    target: () => btn2.value,
    placement: 'bottom' as const,
  },
  { title: '搞定', description: '后面就靠你自己了 🎉' },
]

function startTour() {
  current.value = 0
  open.value = true
}
</script>

<template>
  <div style="display: flex; gap: 12px">
    <c-button ref="btn1" type="primary">保存</c-button>
    <c-button ref="btn2">导出 PDF</c-button>
    <c-button @click="startTour">开始引导</c-button>
  </div>
  <c-tour v-model:open="open" v-model:current="current" :steps="steps" />
</template>
```

:::

## 无目标元素（居中模态）

step 不带 `target` 时，浮层在视口中央显示，蒙层覆盖整屏。常用于「最后一步：感谢」类总结页。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const current = ref(0)
const steps = [
  { title: '欢迎', description: '欢迎使用 ccui，本次引导大约 30 秒' },
  { title: '完成', description: '后续可以在帮助中心重新查看' },
]

function startTour() {
  current.value = 0
  open.value = true
}
</script>

<template>
  <c-button @click="startTour">触发居中引导</c-button>
  <c-tour v-model:open="open" v-model:current="current" :steps="steps" />
</template>
```

:::

## 关闭蒙层

整体 `mask=false` 或单步 `mask: false` 关掉蒙层，让用户在引导过程中也能与页面交互。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const current = ref(0)
const btn = ref<HTMLElement | null>(null)
const steps = [
  { title: '提示一', description: '这步不挡操作', target: () => btn.value, mask: false },
  { title: '提示二', description: '这步加上蒙层', target: () => btn.value, mask: true },
]

function startTour() {
  current.value = 0
  open.value = true
}
</script>

<template>
  <c-button ref="btn">页面按钮</c-button>
  <c-button @click="startTour">开始（混合 mask）</c-button>
  <c-tour v-model:open="open" v-model:current="current" :steps="steps" />
</template>
```

:::

## 自定义按钮文案

`prev-text` / `next-text` / `finish-text` 替换三个按钮文案。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
const current = ref(0)
const steps = [{ title: '一' }, { title: '二' }, { title: '三' }]

function startTour() {
  current.value = 0
  open.value = true
}
</script>

<template>
  <c-button @click="startTour">英文按钮</c-button>
  <c-tour
    v-model:open="open"
    v-model:current="current"
    :steps="steps"
    prev-text="Prev"
    next-text="Next"
    finish-text="Done"
  />
</template>
```

:::

## 主题与箭头

`type="primary"` 切换为蓝底白字主题；`arrow="false"` 隐藏指向目标的小箭头。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const current = ref(0)
const target = ref<HTMLElement | null>(null)
const steps = [
  { title: '主要操作', description: '蓝底白字、强调主题', target: () => target.value },
  { title: '辅助提示', description: '这一步取消了箭头', target: () => target.value },
]

function startTour() {
  current.value = 0
  open.value = true
}
</script>

<template>
  <c-button ref="target" type="primary">演示按钮</c-button>
  <c-button @click="startTour" style="margin-inline-start: 12px">primary 主题</c-button>
  <c-tour v-model:open="open" v-model:current="current" :steps="steps" type="primary" :arrow="false" />
</template>
```

:::

## API

### Props

| 参数                   | 类型                                                    | 默认值      | 说明                                      |
| ---------------------- | ------------------------------------------------------- | ----------- | ----------------------------------------- |
| open                   | boolean                                                 | `false`     | 是否打开，支持 `v-model:open`             |
| current                | number                                                  | `0`         | 当前步骤索引，支持 `v-model:current`      |
| steps                  | `TourStep[]`                                            | `[]`        | 步骤定义                                  |
| mask                   | boolean                                                 | `true`      | 全局蒙层开关；每步可单独 `step.mask` 覆盖 |
| placement              | `'top' \| 'topLeft' \| ... \| 'rightBottom'`（12 方位） | `'bottom'`  | 默认浮层方位；每步可单独 `step.placement` |
| prevText               | string                                                  | `上一步`    | 上一步按钮文案                            |
| nextText               | string                                                  | `下一步`    | 下一步按钮文案                            |
| finishText             | string                                                  | `完成`      | 末步按钮文案                              |
| panelWidth             | number                                                  | `320`       | 浮层最大宽度（px）                        |
| closeOnEsc             | boolean                                                 | `true`      | Esc 是否关闭                              |
| type                   | `'default' \| 'primary'`                                | `'default'` | 主题类型；`primary` 蓝底白字              |
| arrow                  | boolean                                                 | `true`      | 是否显示箭头（仅有 target 时渲染）        |
| scrollIntoViewIfNeeded | boolean                                                 | `true`      | target 在视口外时是否自动滚动到目标       |

### TourStep

| 字段        | 类型                                       | 说明                                        |
| ----------- | ------------------------------------------ | ------------------------------------------- |
| target      | `HTMLElement \| () => HTMLElement \| null` | 高亮目标；无 target 时浮层居中显示          |
| title       | `string \| VNode`                          | 标题（必填）                                |
| description | `string \| VNode`                          | 描述                                        |
| placement   | TourPlacement                              | 单步方位，覆盖全局 `placement`              |
| mask        | boolean                                    | 单步蒙层，覆盖全局 `mask`                   |
| cover       | `string \| VNode`                          | 封面图（string 渲染为 img，VNode 直接渲染） |

### Events

| 事件名         | 回调签名          | 触发时机                               |
| -------------- | ----------------- | -------------------------------------- |
| update:open    | `(open: boolean)` | open 状态变化                          |
| update:current | `(index: number)` | current 步骤变化                       |
| change         | `(index: number)` | 同 update:current                      |
| close          | `()`              | 用户主动关闭（×按钮 / Esc / 蒙层点击） |
| finish         | `()`              | 末步「完成」按钮按下                   |

## 已知限制（未交付）

- **per-step nextButtonProps / prevButtonProps**：每步独立的按钮自定义（loading / disabled / 自定义点击 hook）暂不支持。
- **onPrev / onNext per-step async hooks**：单步切换前后的 hook 暂未提供。
