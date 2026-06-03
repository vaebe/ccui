# BorderBeam 边框流光

一道渐变光沿容器边框循环流动，用于给卡片、容器等内容加一层灵动的视觉强调。

## 何时使用

- 想突出某个卡片 / 面板，让它在页面中更吸睛。
- 营销页、活动入口、AI 能力卡片等需要动态氛围感的场景。

## 基本使用

默认插槽放置被包裹的内容，流光会绕着容器边框流动。`borderRadius` 默认 `8`，与 `c-card` 圆角一致，直接包裹卡片即可严丝合缝；不传 `color` 时使用主题主色渐变。

:::demo

```vue
<script setup lang="ts"></script>

<template>
  <c-border-beam style="width: 280px">
    <c-card header="智能助手">边框流光让卡片更有氛围感。</c-card>
  </c-border-beam>
</template>
```

:::

## 自定义配色

通过 `color` 传入单个颜色字符串。

:::demo

```vue
<script setup lang="ts"></script>

<template>
  <c-border-beam color="#ff4d4f" style="width: 280px">
    <c-card header="限时活动">距开始还有 2 天，先到先得。</c-card>
  </c-border-beam>
</template>
```

:::

## 渐变停靠点

`color` 传入停靠点数组（`percent` 取值 0 ~ 100）可得到多色渐变光带。

:::demo

```vue
<script setup lang="ts">
const beamColor = [
  { color: '#1677ff', percent: 0 },
  { color: '#36cfc9', percent: 52 },
  { color: '#95de64', percent: 100 },
]
</script>

<template>
  <c-border-beam :color="beamColor" style="width: 280px">
    <c-card header="多色渐变">蓝 → 青 → 绿 的流光。</c-card>
  </c-border-beam>
</template>
```

:::

## 内置配色预设

内置 6 套配色预设（Ocean / Sunset / Aurora / Forest / Ember / Nebula），从 `@vaebe/ccui` 导出 `borderBeamPresets`，直接把 `preset.color` 传给 `color` 即可。下方可切换预览。

:::demo

```vue
<script setup lang="ts">
import { borderBeamPresetKeys, borderBeamPresets } from '@vaebe/ccui'
import { computed, ref } from 'vue'

const current = ref('ocean')
const options = borderBeamPresetKeys.map((key) => ({ label: borderBeamPresets[key].name, value: key }))
const preset = computed(() => borderBeamPresets[current.value])
</script>

<template>
  <div style="max-width: 380px">
    <c-segmented v-model="current" :options="options" block style="margin-bottom: 16px" />
    <c-border-beam :color="preset.color">
      <c-card :header="preset.name">
        内置 {{ borderBeamPresetKeys.length }} 套配色，可直接传给 <code>color</code>。
      </c-card>
    </c-border-beam>
  </div>
</template>
```

:::

## 调速

`duration` 控制跑完一圈的时长（秒），值越小越快。

:::demo

```vue
<script setup lang="ts"></script>

<template>
  <div style="display: flex; gap: 24px">
    <c-border-beam :duration="3" style="width: 200px">
      <c-card header="快速">3s 一圈</c-card>
    </c-border-beam>
    <c-border-beam :duration="10" style="width: 200px">
      <c-card header="慢速">10s 一圈</c-card>
    </c-border-beam>
  </div>
</template>
```

:::

## 外扩与圆角

`outset` 让流光层相对容器边缘向外扩展，`borderWidth` 调整光带粗细，`borderRadius` 决定边框环圆角。

:::demo

```vue
<script setup lang="ts"></script>

<template>
  <c-border-beam :outset="6" :border-width="2" :border-radius="16" style="width: 240px">
    <c-card>外扩 6px、2px 粗光带</c-card>
  </c-border-beam>
</template>
```

:::

## API

### Props

| 参数         | 说明                                                       | 类型                                | 默认值 |
| ------------ | ---------------------------------------------------------- | ----------------------------------- | ------ |
| color        | 流光颜色，单色字符串或渐变停靠点数组；不传时用主题主色渐变 | [BorderBeamColor](#borderbeamcolor) | -      |
| outset       | 流光层相对容器边缘的外扩距离（number 视为 px）             | `number \| string`                  | `0`    |
| borderWidth  | 边框 / 光带粗细（px）                                      | `number`                            | `1`    |
| borderRadius | 容器圆角（px），与被包裹内容保持一致即可严丝合缝           | `number`                            | `8`    |
| duration     | 跑完一圈的时长（秒）                                       | `number`                            | `6`    |

### Slots

| 插槽名  | 说明             |
| ------- | ---------------- |
| default | 被流光包裹的内容 |

## BorderBeam 类型定义

### BorderBeamColor

```ts
export interface BorderBeamColorStop {
  /** 颜色值，支持任意 CSS 颜色 */
  color: string
  /** 渐变停靠位置，取值 0 ~ 100 */
  percent: number
}

export type BorderBeamColor = string | BorderBeamColorStop[]
```

## 内置预设

从 `@vaebe/ccui` 导出，按定义顺序提供 6 套配色：

```ts
import { borderBeamPresetKeys, borderBeamPresets } from '@vaebe/ccui'

// borderBeamPresetKeys: ['ocean', 'sunset', 'aurora', 'forest', 'ember', 'nebula']
// borderBeamPresets.ocean.color → BorderBeamColorStop[]

export interface BorderBeamPreset {
  key: string
  name: string
  color: BorderBeamColorStop[]
}
```
