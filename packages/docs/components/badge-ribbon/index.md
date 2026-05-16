# BadgeRibbon 缎带徽标

带折角缎带的徽标，对标 Ant Design `Badge.Ribbon`，作为独立顶层组件存在（不挂在 Badge 命名空间下）。

## 何时使用

- 卡片 / 商品 / 列表项需要在角落标注「新」「热」「限时」等带视觉冲击的徽标。

## 基本使用

`text` 设置缎带文字，默认 slot 是被装饰的内容。

:::demo

```vue
<template>
  <c-badge-ribbon text="Hippies">
    <c-card title="缎带示例" style="width: 280px"> 内容主体... </c-card>
  </c-badge-ribbon>
</template>
```

:::

## 不同位置

`placement: 'start' | 'end'`，默认 `end`（右上）。

:::demo

```vue
<template>
  <c-badge-ribbon text="右上" placement="end">
    <div style="width: 200px; height: 80px; background: #f5f5f5; border-radius: 4px"></div>
  </c-badge-ribbon>
  <br />
  <c-badge-ribbon text="左上" placement="start" style="margin-top: 12px">
    <div style="width: 200px; height: 80px; background: #f5f5f5; border-radius: 4px"></div>
  </c-badge-ribbon>
</template>
```

:::

## 预设色

13 种预设色名：`pink` / `magenta` / `red` / `volcano` / `orange` / `yellow` / `gold` / `cyan` / `lime` / `green` / `blue` / `geekblue` / `purple`。

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {
      colors: [
        'pink',
        'red',
        'volcano',
        'orange',
        'gold',
        'lime',
        'green',
        'cyan',
        'blue',
        'geekblue',
        'purple',
        'magenta',
      ],
    }
  },
})
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 16px">
    <c-badge-ribbon v-for="c in colors" :key="c" :text="c" :color="c">
      <div style="width: 120px; height: 56px; background: #f5f5f5; border-radius: 4px"></div>
    </c-badge-ribbon>
  </div>
</template>
```

:::

## 自定义色

非预设字符串作为 CSS color 字面量（`#hex` / `rgb()` / 命名色）。

:::demo

```vue
<template>
  <c-badge-ribbon text="自定义" color="#ff5500">
    <div style="width: 200px; height: 80px; background: #f5f5f5; border-radius: 4px"></div>
  </c-badge-ribbon>
  <br />
  <c-badge-ribbon text="渐变色" color="hotpink" style="margin-top: 12px">
    <div style="width: 200px; height: 80px; background: #f5f5f5; border-radius: 4px"></div>
  </c-badge-ribbon>
</template>
```

:::

## 文字 slot

需要图标 + 文字时用 `text` slot 完全自定义。

:::demo

```vue
<template>
  <c-badge-ribbon color="red">
    <template #text>
      <span>🔥 限时</span>
    </template>
    <div style="width: 200px; height: 80px; background: #f5f5f5; border-radius: 4px"></div>
  </c-badge-ribbon>
</template>
```

:::

## BadgeRibbon 参数

| 参数      | 类型             | 默认 | 说明                                                               |
| --------- | ---------------- | ---- | ------------------------------------------------------------------ |
| text      | string           | ''   | 缎带文字（slot `text` 优先）                                       |
| color     | string           | ''   | 预设色名 / CSS color 字符串；预设色走 modifier，其余走 inline 背景 |
| placement | 'start' \| 'end' | end  | 缎带位置（右上 / 左上）                                            |

## BadgeRibbon 插槽

| 插槽名  | 说明                                      |
| ------- | ----------------------------------------- |
| default | 被装饰的内容（缎带浮于其右/左上角）       |
| text    | 缎带内文字 / 节点，优先级高于 `text` prop |
