# Icon 图标

统一图标尺寸、颜色和旋转表现的基础包装器。

## 基本用法

:::demo

```vue
<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { registerIcon } from 'vue3-ccui'

const SearchIcon = defineComponent({
  name: 'SearchIcon',
  setup() {
    return () =>
      h('svg', { viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true' }, [
        h('path', { d: 'M10 4a6 6 0 1 0 3.87 10.59L20 20.7 20.7 20 14.59 13.87A6 6 0 0 0 10 4z' }),
      ])
  },
})

registerIcon('search', SearchIcon)
</script>

<template>
  <div style="display: flex; gap: 16px; align-items: center;">
    <c-icon name="search" />
    <c-icon name="search" size="20" color="#1677ff" />
    <c-icon name="search" spin />
    <c-icon size="20" color="#52c41a">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2 2 22h20L12 2z" />
      </svg>
    </c-icon>
  </div>
</template>
```

:::

## 参数

| 参数      | 类型            | 默认值 | 说明                       |
| --------- | --------------- | ------ | -------------------------- |
| name      | string          | --     | 图标名称，优先从注册表解析 |
| component | Component       | --     | 直接传入图标组件           |
| size      | string / number | --     | 图标尺寸                   |
| color     | string          | --     | 图标颜色                   |
| rotate    | number          | 0      | 旋转角度                   |
| spin      | boolean         | false  | 是否旋转动画               |
| title     | string          | --     | 可访问标题                 |
| ariaLabel | string          | --     | 可访问标签                 |

## 注册 API

| 方法                            | 说明             |
| ------------------------------- | ---------------- |
| `registerIcon(name, component)` | 注册一个命名图标 |
| `resolveIcon(name)`             | 读取已注册图标   |
| `unregisterIcon(name)`          | 移除已注册图标   |
| `clearIconRegistry()`           | 清空注册表       |
