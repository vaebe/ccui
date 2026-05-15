# ListItemMeta 列表项元信息

列表项的元信息组件，对标 Ant Design `List.Item.Meta`，作为独立顶层组件存在（不挂在 List 命名空间下）。

::: tip 与 `<c-list-item>` 内嵌 slot 的关系
ccui 的 `<c-list-item>` 本身已支持 `avatar` / `title` / `description` slot，本组件与那套写法 **DOM 完全相同**（复用同一组 SCSS 类）。两种写法二选一：

- **ccui 风（推荐）**：直接在 `<c-list-item>` 上挂 slot。
- **ant 风**：在 `<c-list-item>` 内嵌 `<c-list-item-meta>`，更贴近 Ant Design 模板风格。
:::

## 何时使用

- 列表项需要展示头像 + 标题 + 描述的标准元信息块。
- 配合 `<c-list>` + `<c-list-item>` 渲染社交、消息、好友等列表。

## 基本使用（ant 风嵌套）

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {
      items: [
        { title: '设计模式', desc: '23 种 GoF 模式速查' },
        { title: '响应式原理', desc: 'Vue 3 reactivity 深入' },
        { title: '工程化', desc: 'Vite + pnpm 单 repo' },
      ],
    }
  },
})
</script>

<template>
  <c-list>
    <c-list-item v-for="it in items" :key="it.title">
      <c-list-item-meta :title="it.title" :description="it.desc">
        <template #avatar>
          <c-avatar :name="it.title[0]" :width="40" :height="40" />
        </template>
      </c-list-item-meta>
    </c-list-item>
  </c-list>
</template>
```

:::

## 等价写法（ccui 风：slot 直挂 ListItem）

DOM 与上面完全相同，不需要嵌套 `<c-list-item-meta>`。

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {
      items: [
        { title: '设计模式', desc: '23 种 GoF 模式速查' },
        { title: '响应式原理', desc: 'Vue 3 reactivity 深入' },
      ],
    }
  },
})
</script>

<template>
  <c-list>
    <c-list-item v-for="it in items" :key="it.title">
      <template #avatar>
        <c-avatar :name="it.title[0]" :width="40" :height="40" />
      </template>
      <template #title>{{ it.title }}</template>
      <template #description>{{ it.desc }}</template>
    </c-list-item>
  </c-list>
</template>
```

:::

## title / description slot

需要图标或富文本时用 slot 覆盖 prop。

:::demo

```vue
<template>
  <c-list>
    <c-list-item>
      <c-list-item-meta>
        <template #avatar>
          <c-avatar name="🔥" :width="40" :height="40" />
        </template>
        <template #title>
          <span>🔥 限时活动</span>
        </template>
        <template #description>
          剩余 <b style="color: #f5222d">3 小时</b>
        </template>
      </c-list-item-meta>
    </c-list-item>
  </c-list>
</template>
```

:::

## 在 meta 下方追加内容

ListItemMeta 的 default slot 会渲染在 meta 文字之后、仍在 `item-main` 内。

:::demo

```vue
<template>
  <c-list>
    <c-list-item>
      <c-list-item-meta title="主标题" description="副标题描述">
        <p style="margin-top: 8px; color: #595959">这里是 meta 下方的额外内容（default slot）。</p>
      </c-list-item-meta>
    </c-list-item>
  </c-list>
</template>
```

:::

## ListItemMeta 参数

| 参数        | 类型   | 默认 | 说明                  |
| ----------- | ------ | ---- | --------------------- |
| title       | string | ''   | 标题文字（slot 优先） |
| description | string | ''   | 描述文字（slot 优先） |

## ListItemMeta 插槽

| 插槽名      | 说明                            |
| ----------- | ------------------------------- |
| avatar      | 左侧头像区                      |
| title       | 标题节点                        |
| description | 描述节点                        |
| default     | meta 下方的额外内容             |
