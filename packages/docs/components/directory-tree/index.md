# DirectoryTree 目录树

基于 [`<c-tree>`](/components/tree/) 的目录树预设外壳，对标 Ant Design `Tree.DirectoryTree`，作为独立顶层组件存在（**不挂 Tree.DirectoryTree 静态属性**）。

::: tip 与 `<c-tree>` 的关系
DirectoryTree 不重写树形渲染，而是把 Tree 的部分默认值改为更适合「文件管理器」语境的值（全展开、行宽高亮、多选），并提供内置 folder / file SVG 图标 + `expandAction` 配置。**所有 props / events / slots 完全透传给 Tree**。
:::

## 何时使用

- 文件管理器、代码仓库、组件库导航等「文件系统」风格的展示。
- 需要默认全展开 + 行宽 hover + 内置图标的树形场景。

## 默认值差异（与 Tree 对比）

| Prop                 | Tree 默认 | DirectoryTree 默认 |
| -------------------- | --------- | ------------------ |
| `defaultExpandAll`   | `false`   | `true`             |
| `blockNode`          | `false`   | `true`             |
| `multiple`           | `false`   | `true`             |

## 基本使用

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {
      data: [
        {
          key: 'src',
          title: 'src',
          children: [
            { key: 'src/main.ts', title: 'main.ts', isLeaf: true },
            { key: 'src/App.vue', title: 'App.vue', isLeaf: true },
            {
              key: 'src/views',
              title: 'views',
              children: [
                { key: 'src/views/home.vue', title: 'home.vue', isLeaf: true },
                { key: 'src/views/about.vue', title: 'about.vue', isLeaf: true },
              ],
            },
          ],
        },
        { key: 'README.md', title: 'README.md', isLeaf: true },
        { key: 'package.json', title: 'package.json', isLeaf: true },
      ],
    }
  },
})
</script>

<template>
  <c-directory-tree :data="data" />
</template>
```

:::

## expandAction 控制点击行为

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const action = ref('click')
    return {
      action,
      actions: [
        { label: 'click（默认）', value: 'click' },
        { label: 'false（仅 switcher 展开）', value: false },
      ],
      data: [
        {
          key: 'src',
          title: 'src',
          children: [{ key: 'src/main.ts', title: 'main.ts', isLeaf: true }],
        },
      ],
    }
  },
})
</script>

<template>
  <div>
    <c-radio-group v-model="action" :options="actions" />
    <c-directory-tree :data="data" :default-expand-all="false" :expand-action="action" />
  </div>
</template>
```

:::

## 自定义图标

`icon` slot 优先于内置 folder / file SVG；`node.raw.icon` 次之。

:::demo

```vue
<script>
import { defineComponent, h } from 'vue'

export default defineComponent({
  setup() {
    return {
      data: [
        { key: 'src', title: 'src', children: [{ key: 'src/index.ts', title: 'index.ts', isLeaf: true }] },
        { key: 'README.md', title: 'README.md', isLeaf: true, icon: '📄' },
      ],
    }
  },
})
</script>

<template>
  <c-directory-tree :data="data">
    <template #icon="{ node, expanded }">
      <span v-if="node.raw.icon">{{ node.raw.icon }}</span>
      <span v-else-if="node.hasChildren">{{ expanded ? '📂' : '📁' }}</span>
      <span v-else>📄</span>
    </template>
  </c-directory-tree>
</template>
```

:::

## 关闭内置图标

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {
      data: [
        {
          key: 'src',
          title: 'src',
          children: [{ key: 'src/main.ts', title: 'main.ts', isLeaf: true }],
        },
      ],
    }
  },
})
</script>

<template>
  <c-directory-tree :data="data" :show-icon="false" />
</template>
```

:::

## DirectoryTree 参数

| 参数                | 类型                                            | 默认      | 说明                                                                              |
| ------------------- | ----------------------------------------------- | --------- | --------------------------------------------------------------------------------- |
| data                | `TreeNodeData[]`                                | `[]`      | 树形数据                                                                          |
| fieldNames          | `TreeFieldNames`                                | -         | 字段名映射                                                                        |
| selectable          | `boolean`                                       | `true`    | 是否可选                                                                          |
| multiple            | `boolean`                                       | `true`    | 是否多选（DirectoryTree 默认 true）                                                |
| v-model:selectedKeys| `TreeNodeKey[]`                                 | -         | 受控选中                                                                          |
| checkable           | `boolean`                                       | `false`   | 是否显示 checkbox                                                                 |
| v-model:checkedKeys | `TreeNodeKey[]`                                 | -         | 受控勾选                                                                          |
| v-model:expandedKeys| `TreeNodeKey[]`                                 | -         | 受控展开                                                                          |
| defaultExpandAll    | `boolean`                                       | `true`    | 初始全展开（DirectoryTree 默认 true）                                              |
| blockNode           | `boolean`                                       | `true`    | 行宽 hover / 选中高亮（DirectoryTree 默认 true）                                   |
| **expandAction**    | `'click' \| false`                              | `'click'` | DirectoryTree 独有。`'click'` 单击节点正文切换展开，`false` 仅 switcher 展开           |
| **showIcon**        | `boolean`                                       | `true`    | DirectoryTree 独有。关闭后不渲染内置 folder / file SVG                              |
| 其他                | -                                               | -         | 透传给 Tree（draggable / showLine / virtualScroll 等）                              |

## DirectoryTree 事件

完全透传 Tree 事件：`update:selectedKeys` / `update:checkedKeys` / `update:expandedKeys` / `select` / `check` / `expand` / `load` / `drop` / `dragstart` / `dragenter` / `dragover` / `dragleave` / `focus-change` / `load-error`。

## DirectoryTree 插槽

| 插槽名       | 作用域                              | 说明                                              |
| ------------ | ----------------------------------- | ------------------------------------------------- |
| icon         | `{ node, expanded }`                | 自定义节点图标，覆盖内置 folder / file SVG          |
| title        | `{ node, data, expanded }`          | 自定义节点标题                                    |
| switcher     | `{ node, expanded }`                | 自定义展开/折叠开关图标                            |
| connector    | `{ depth, node }`                   | 自定义 showLine 模式下的连接线                     |
