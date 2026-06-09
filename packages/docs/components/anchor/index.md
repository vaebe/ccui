# Anchor 锚点

页面内部跳转导航。点击锚点平滑滚动到对应内容，滚动时自动高亮当前所在区段。

## 基本使用

最简单的用法：传入扁平的 `items` 列表，每项包含 `href`（CSS 选择器形式 `#id`）和 `title`。

:::demo

```vue
<template>
  <div class="anchor-demo">
    <c-anchor
      :items="[
        { href: '#part-1', title: '第一节' },
        { href: '#part-2', title: '第二节' },
        { href: '#part-3', title: '第三节' },
      ]"
      style="width: 160px; flex: none;"
      scroll-container=".anchor-basic"
    />
    <div class="anchor-basic" style="flex: 1; max-height: 280px; overflow: auto;">
      <h3 id="part-1" style="margin-top: 0">第一节</h3>
      <p style="height: 200px; background: var(--ccui-area); padding: 12px">第一节内容</p>
      <h3 id="part-2">第二节</h3>
      <p style="height: 200px; background: var(--ccui-area); padding: 12px">第二节内容</p>
      <h3 id="part-3">第三节</h3>
      <p style="height: 200px; background: var(--ccui-area); padding: 12px">第三节内容</p>
    </div>
  </div>
</template>

<style scoped>
.anchor-demo {
  display: flex;
  gap: 24px;
  border: 1px solid var(--ccui-color-border-secondary);
  border-radius: 8px;
  padding: 12px;
}
</style>
```

:::

## 嵌套层级

`items` 支持 `children` 字段表达父子结构，子级会自动缩进。

:::demo

```vue
<template>
  <div class="anchor-demo">
    <c-anchor :items="items" style="width: 200px; flex: none" scroll-container=".anchor-nested" />
    <div class="anchor-nested" style="flex: 1; max-height: 320px; overflow: auto">
      <h3 id="api">API</h3>
      <p style="height: 100px; background: var(--ccui-area); padding: 12px">概述...</p>
      <h4 id="props">Props</h4>
      <p style="height: 200px; background: var(--ccui-area); padding: 12px">props 列表...</p>
      <h4 id="events">Events</h4>
      <p style="height: 200px; background: var(--ccui-area); padding: 12px">events 列表...</p>
      <h3 id="faq">FAQ</h3>
      <p style="height: 200px; background: var(--ccui-area); padding: 12px">FAQ...</p>
    </div>
  </div>
</template>

<script setup>
const items = [
  {
    href: '#api',
    title: 'API',
    children: [
      { href: '#props', title: 'Props' },
      { href: '#events', title: 'Events' },
    ],
  },
  { href: '#faq', title: 'FAQ' },
]
</script>

<style scoped>
.anchor-demo {
  display: flex;
  gap: 24px;
  border: 1px solid var(--ccui-color-border-secondary);
  border-radius: 8px;
  padding: 12px;
}
</style>
```

:::

## 监听变化

监听 `change` 事件可在锚点切换时触发联动逻辑（如埋点、菜单同步）。

:::demo

```vue
<template>
  <div class="anchor-demo">
    <c-anchor
      :items="[
        { href: '#sec-a', title: 'A 区段' },
        { href: '#sec-b', title: 'B 区段' },
        { href: '#sec-c', title: 'C 区段' },
      ]"
      style="width: 160px; flex: none"
      scroll-container=".anchor-change"
      @change="onChange"
    />
    <div class="anchor-change" style="flex: 1; max-height: 240px; overflow: auto">
      <h3 id="sec-a" style="margin-top: 0">A 区段</h3>
      <p style="height: 180px; background: var(--ccui-area); padding: 12px">A 内容</p>
      <h3 id="sec-b">B 区段</h3>
      <p style="height: 180px; background: var(--ccui-area); padding: 12px">B 内容</p>
      <h3 id="sec-c">C 区段</h3>
      <p style="height: 180px; background: var(--ccui-area); padding: 12px">C 内容</p>
    </div>
  </div>
  <p style="margin-top: 8px; color: var(--ccui-color-text-secondary)">当前激活：{{ active }}</p>
</template>

<script setup>
import { ref } from 'vue'

const active = ref('未滚动')

function onChange(href) {
  active.value = href || '无'
}
</script>

<style scoped>
.anchor-demo {
  display: flex;
  gap: 24px;
  border: 1px solid var(--ccui-color-border-secondary);
  border-radius: 8px;
  padding: 12px;
}
</style>
```

:::

## 调整高亮容差

`bounds` 控制元素到顶部多近时算"激活"（默认 `5`），`offsetTop` 让滚动停留位置距顶部预留空间，避免被 fixed header 遮挡。

:::demo

```vue
<template>
  <div class="anchor-demo">
    <c-anchor
      :items="[
        { href: '#stop-1', title: '段落 1' },
        { href: '#stop-2', title: '段落 2' },
        { href: '#stop-3', title: '段落 3' },
      ]"
      :bounds="40"
      :offset-top="20"
      style="width: 160px; flex: none"
      scroll-container=".anchor-bounds"
    />
    <div class="anchor-bounds" style="flex: 1; max-height: 260px; overflow: auto; position: relative">
      <h3 id="stop-1" style="margin-top: 0">段落 1</h3>
      <p style="height: 200px; background: var(--ccui-area); padding: 12px">点击右侧锚点会留 20px 顶部空隙</p>
      <h3 id="stop-2">段落 2</h3>
      <p style="height: 200px; background: var(--ccui-area); padding: 12px">提前 40px 切高亮</p>
      <h3 id="stop-3">段落 3</h3>
      <p style="height: 200px; background: var(--ccui-area); padding: 12px">最后一节</p>
    </div>
  </div>
</template>

<style scoped>
.anchor-demo {
  display: flex;
  gap: 24px;
  border: 1px solid var(--ccui-color-border-secondary);
  border-radius: 8px;
  padding: 12px;
}
</style>
```

:::

## 拦截点击

监听 `click` 事件可在跳转前后追加业务逻辑，比如埋点。锚点的默认行为已在内部阻止。

:::demo

```vue
<template>
  <div class="anchor-demo">
    <c-anchor
      :items="[
        { href: '#hook-1', title: '点这里' },
        { href: '#hook-2', title: '或这里' },
      ]"
      style="width: 160px; flex: none"
      scroll-container=".anchor-click"
      @click="onClick"
    />
    <div class="anchor-click" style="flex: 1; max-height: 240px; overflow: auto">
      <h3 id="hook-1" style="margin-top: 0">区段 1</h3>
      <p style="height: 180px; background: var(--ccui-area); padding: 12px">内容</p>
      <h3 id="hook-2">区段 2</h3>
      <p style="height: 180px; background: var(--ccui-area); padding: 12px">内容</p>
    </div>
  </div>
  <p style="margin-top: 8px; color: var(--ccui-color-text-secondary)">最近点击：{{ lastClicked || '（无）' }}</p>
</template>

<script setup>
import { ref } from 'vue'

const lastClicked = ref('')

function onClick(_e, link) {
  lastClicked.value = link.title
}
</script>

<style scoped>
.anchor-demo {
  display: flex;
  gap: 24px;
  border: 1px solid var(--ccui-color-border-secondary);
  border-radius: 8px;
  padding: 12px;
}
</style>
```

:::

## API

### Props

| 参数            | 类型                    | 默认值      | 说明                                       |
| --------------- | ----------------------- | ----------- | ------------------------------------------ |
| items           | `AnchorLink[]`          | `[]`        | 锚点列表，支持 `children` 嵌套             |
| affix           | boolean                 | `true`      | 是否固定（保留外观位）                     |
| bounds          | number                  | `5`         | 元素到顶部小于此距离时视为激活（px）       |
| offsetTop       | number                  | `0`         | 高亮判定与点击滚动统一加的顶部偏移（px）   |
| targetOffset    | number                  | `undefined` | 仅点击滚动用的偏移；未传则回退 `offsetTop` |
| scrollContainer | `string \| HTMLElement` | `window`    | 自定义滚动容器（CSS 选择器或元素引用）     |
| showInkInFixed  | boolean                 | `false`     | 固定时是否仍显示墨色滑块                   |

### AnchorLink

| 字段     | 类型           | 说明                        |
| -------- | -------------- | --------------------------- |
| href     | string         | 必填，目标元素 id（带 `#`） |
| title    | string         | 显示文本，省略则用 href     |
| children | `AnchorLink[]` | 子级锚点（可任意层嵌套）    |

### Events

| 事件名 | 回调签名                                | 触发时机               |
| ------ | --------------------------------------- | ---------------------- |
| change | `(activeHref: string)`                  | 当前激活锚点变化时     |
| click  | `(event: MouseEvent, link: AnchorLink)` | 点击锚点时（已阻默认） |

### Slots

| 名称    | 说明                                                     |
| ------- | -------------------------------------------------------- |
| default | 自定义渲染（不使用 `items`，需自行写带 `href` 的 `<a>`） |
