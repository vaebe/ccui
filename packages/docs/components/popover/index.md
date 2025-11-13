# Popover 弹出框

### 何时使用
- 需要在不打断用户流程的情况下展示补充信息和操作内容
- 支持标题、富文本内容、不同触发方式与位置控制

### 基本用法
:::demo

```vue
<template>
  <c-popover title="标题" content="这是一段 Popover 内容">
    <c-button type="primary" plain>点击触发</c-button>
  </c-popover>
</template>
```

:::

### 悬停触发
:::demo

```vue
<template>
  <c-popover trigger="hover" content="鼠标悬停显示">
    <c-button type="primary" plain>Hover</c-button>
  </c-popover>
</template>
```

:::

### 自定义内容与标题插槽
:::demo

```vue
<template>
  <c-popover>
    <template #title>
      <span>自定义标题</span>
    </template>
    <template #content>
      <div style="max-width: 240px">
        <p>支持任意插槽内容</p>
        <c-button type="primary" plain size="small">操作</c-button>
      </div>
    </template>
    <c-button type="primary" plain>自定义内容</c-button>
  </c-popover>
</template>
```

:::

### 位置与主题
:::demo

```vue
<template>
  <div style="display:flex;gap:12px;flex-wrap:wrap">
    <c-popover placement="top" effect="light" content="Top"><c-button type="primary" plain>Top</c-button></c-popover>
    <c-popover placement="bottom" effect="dark" content="Bottom"><c-button type="primary" plain>Bottom</c-button></c-popover>
    <c-popover placement="left" content="Left"><c-button type="primary" plain>Left</c-button></c-popover>
    <c-popover placement="right" content="Right"><c-button type="primary" plain>Right</c-button></c-popover>
  </div>
  
</template>
```

:::

### 受控显示
:::demo

```vue
<script setup>
import { ref } from 'vue'
const v = ref(false)
const toggle = () => v.value = !v.value
</script>

<template>
  <c-popover :visible="v" title="受控" content="通过 v-model 控制显隐">
    <c-button type="primary" plain @click="toggle">切换显隐</c-button>
  </c-popover>
</template>
```

:::

### API

| 参数 | 类型 | 默认 | 说明 |
| ---- | ---- | ---- | ---- |
| `title` | `string` | `''` | 标题文本，支持 `#title` 插槽 |
| `content` | `string` | `''` | 内容文本，支持 `#content` 插槽 |
| `placement` | `'top'\|...` | `'bottom'` | 弹出层位置 |
| `effect` | `'dark'\|'light'` | `'light'` | 主题样式 |
| `visible` | `boolean` | `undefined` | 受控显隐状态，配合 `update:visible` |
| `disabled` | `boolean` | `false` | 是否禁用触发 |
| `showArrow` | `boolean` | `true` | 是否显示箭头 |
| `trigger` | `'hover'\|'click'\|'focus'\|'manual'` | `'click'` | 触发方式 |
| `showAfter` | `number` | `0` | 显示延迟（ms） |
| `hideAfter` | `number` | `200` | 隐藏延迟（ms），`click` 不延迟 |
| `popperClass` | `string` | `''` | 弹出层附加类名 |
| `offset` | `number` | `8` | 触发元素与弹出层的偏移 |
| `rawContent` | `boolean` | `false` | 是否将 `content` 按 HTML 渲染 |
| `enterable` | `boolean` | `true` | 悬停至弹层是否保持显示 |
| `ariaLabel` | `string` | `''` | 触发器 `aria-label` 文本 |
| `width` | `number\|string` | `''` | 弹层宽度，如 `200` 或 `200px` |

| 事件 | 说明 |
| ---- | ---- |
| `before-show` | 显示前触发 |
| `show` | 显示后触发 |
| `before-hide` | 隐藏前触发 |
| `hide` | 隐藏后触发 |
| `update:visible` | 受控模式显隐变更 |

| 插槽名 | 说明 |
| ---- | ---- |
| `default` | 触发器内容 |
| `title` | 标题区域 |
| `content` | 主体内容区域 |
