# Tree 树

层级数据展示与管理：选中、勾选（含父子半选联动）、展开、异步加载、搜索高亮、自定义渲染、拖拽。

> 说明：本组件相对 1.x 版本进行了 API 重构，新协议参考 Ant Design Tree 的高频用法。旧的 `level` / `open` 字段不再使用，请改用 `defaultExpandedKeys`、`expandedKeys` 或 `defaultExpandAll`。

## 基本用法

不传 `expandedKeys` 时默认全部折叠。点击左侧 switcher 展开 / 折叠。

:::demo

```vue
<script setup lang="ts">
const data = [
  {
    key: '0-0',
    title: '一级 1',
    children: [
      { key: '0-0-0', title: '二级 1-1' },
      {
        key: '0-0-1',
        title: '二级 1-2',
        children: [
          { key: '0-0-1-0', title: '三级 1-2-1' },
          { key: '0-0-1-1', title: '三级 1-2-2' },
        ],
      },
    ],
  },
  { key: '0-1', title: '一级 2' },
]
</script>

<template>
  <c-tree :data="data" default-expand-all />
</template>
```

:::

## 受控 / 非受控

`v-model:selected-keys`、`v-model:expanded-keys`、`v-model:checked-keys` 都支持双向绑定；只想初始化用 `default-*` 系列。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const selected = ref<string[]>([])
const expanded = ref<string[]>(['0-0'])
const data = [
  {
    key: '0-0',
    title: '组 A',
    children: [
      { key: '0-0-0', title: 'A-1' },
      { key: '0-0-1', title: 'A-2' },
    ],
  },
]
</script>

<template>
  <c-tree v-model:selected-keys="selected" v-model:expanded-keys="expanded" :data="data" />
  <p>已选：{{ selected.join(', ') || '(无)' }} ｜ 已展开：{{ expanded.join(', ') }}</p>
</template>
```

:::

## 多选

```vue
<c-tree multiple v-model:selected-keys="selected" :data="data" />
```

## 勾选 + 父子半选联动

`checkable` 开启复选框。默认勾选父级会勾选所有可勾选后代；后代部分勾选时父级显示半选；`checkStrictly` 关闭联动。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const checked = ref<string[]>([])
const data = [
  {
    key: '0-0',
    title: '部门 A',
    children: [
      { key: '0-0-0', title: '小组 1' },
      { key: '0-0-1', title: '小组 2', disableCheckbox: true },
    ],
  },
  {
    key: '0-1',
    title: '部门 B',
    children: [
      { key: '0-1-0', title: '小组 3' },
      { key: '0-1-1', title: '小组 4' },
    ],
  },
]
</script>

<template>
  <c-tree v-model:checked-keys="checked" checkable default-expand-all :data="data" />
  <p>勾选：{{ checked.join(', ') || '(无)' }}</p>
</template>
```

:::

## fieldNames 字段名映射

```vue
<c-tree :data="data" :field-names="{ key: 'id', title: 'name', children: 'items' }" default-expand-all />
```

## 异步加载

`loadData` 在展开非叶子且尚未加载的节点时调用，返回 Promise。回调中给原始 node 写入 `children` 即可。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const data = ref([
  { key: 'a', title: '可异步展开 A', isLeaf: false },
  { key: 'b', title: '可异步展开 B', isLeaf: false },
])

async function loadData(node: any) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  node.children = [
    { key: `${node.key}-1`, title: `${node.title} - 子 1` },
    { key: `${node.key}-2`, title: `${node.title} - 子 2` },
  ]
}
</script>

<template>
  <c-tree :data="data" :load-data="loadData" />
</template>
```

:::

## 搜索 + 高亮

`searchValue` 自动按节点 title 模糊匹配并保留命中节点的祖先；命中部分会用 `__highlight` span 包裹便于自定义颜色。`filterTreeNode` 接受函数自定义匹配逻辑。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const keyword = ref('1-2')
const data = [
  {
    key: '0-0',
    title: '一级 1',
    children: [
      { key: '0-0-0', title: '二级 1-1' },
      {
        key: '0-0-1',
        title: '二级 1-2',
        children: [
          { key: '0-0-1-0', title: '三级 1-2-1' },
          { key: '0-0-1-1', title: '三级 1-2-2' },
        ],
      },
    ],
  },
]
</script>

<template>
  <input v-model="keyword" placeholder="搜索节点 title" style="margin-bottom: 8px;" />
  <c-tree :data="data" :search-value="keyword" default-expand-all />
</template>
```

:::

## 自定义渲染

通过 `title` / `switcher` / `icon` 插槽自定义节点。`title` 插槽接收 `{ node, data, expanded }`，`switcher` 接收 `{ expanded, node }`。

:::demo

```vue
<script setup lang="ts">
const data = [
  { key: 'doc', title: '文档', icon: '📄' },
  {
    key: 'folder',
    title: '资料夹',
    icon: '📁',
    children: [{ key: 'sub', title: '子文档', icon: '📄' }],
  },
]
</script>

<template>
  <c-tree :data="data" default-expand-all>
    <template #title="{ node, expanded }">
      <strong style="color: #1677ff;">{{ node.raw.title }}</strong>
      <span v-if="expanded" style="margin-left: 8px; color: #999;">(展开)</span>
    </template>
    <template #icon="{ node }">{{ node.raw.icon }}</template>
  </c-tree>
</template>
```

:::

## 键盘导航

将焦点设到 Tree 上后，可以用键盘漫游：

| 按键       | 行为                                        |
| ---------- | ------------------------------------------- |
| ↑ / ↓      | 上一个 / 下一个可见节点                     |
| →          | 折叠节点 → 展开；已展开 → 移到第一个子节点  |
| ←          | 已展开 → 折叠；已折叠 → 移到父节点          |
| Home / End | 首个 / 最后一个可见节点                     |
| Enter      | 选中聚焦节点（或勾选，若 `checkable=true`） |
| Space      | 同 Enter                                    |

`focusedKey` 支持受控（`v-model:focused-key`），事件 `focus-change` 同步外部状态。聚焦节点用 roving tabindex（仅它是 `tabindex=0`，其它都是 `-1`），保证 Tab 进入只到一个位置。

## 虚拟滚动

数据量大（数百 / 数千节点）时启用 `virtualScroll`，组件只渲染可视区 + 缓冲区：

```vue
<c-tree :data="hugeData" default-expand-all virtual-scroll :virtual-item-height="32" :virtual-max-height="400" />
```

键盘导航触发的焦点变化会自动滚到可见区。

## 拖拽排序

`draggable` 开启后，`drop` 事件回调里给出 `{ event, node, dragNode, dropPosition }`。组件**不会**自动改写 `data`——业务侧根据 `dropPosition` 改造数据结构。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const data = ref([...])

function onDrop(info: { dragNode: any; node: any; dropPosition: 'before' | 'inside' | 'after' }) {
  // 业务自行从 data 中移动 dragNode 到 node 的 dropPosition 位置
  console.log(info)
}
</script>

<template>
  <c-tree :data="data" draggable default-expand-all @drop="onDrop" />
</template>
```

## Props

| 参数                | 类型                                              | 默认值  | 说明                                           |
| ------------------- | ------------------------------------------------- | ------- | ---------------------------------------------- |
| data                | `TreeNodeData[]`                                  | `[]`    | 树数据                                         |
| fieldNames          | `{ key?, title?, children?, disabled?, isLeaf? }` | --      | 字段名映射                                     |
| selectable          | `boolean`                                         | `true`  | 是否允许选中                                   |
| multiple            | `boolean`                                         | `false` | 是否允许多选                                   |
| selectedKeys        | `(string \| number)[]`                            | --      | 选中 key，配 `v-model:selected-keys` 接管      |
| defaultSelectedKeys | `(string \| number)[]`                            | `[]`    | 初始选中 key                                   |
| checkable           | `boolean`                                         | `false` | 是否显示勾选框                                 |
| checkedKeys         | `(string \| number)[]`                            | --      | 勾选 key，配 `v-model:checked-keys` 接管       |
| defaultCheckedKeys  | `(string \| number)[]`                            | `[]`    | 初始勾选 key                                   |
| checkStrictly       | `boolean`                                         | `false` | 关闭父子勾选联动                               |
| expandedKeys        | `(string \| number)[]`                            | --      | 展开 key，配 `v-model:expanded-keys` 接管      |
| defaultExpandedKeys | `(string \| number)[]`                            | `[]`    | 初始展开 key                                   |
| defaultExpandAll    | `boolean`                                         | `false` | 初始展开所有节点                               |
| disabled            | `boolean`                                         | `false` | 整树禁用                                       |
| loadData            | `(node) => Promise<void>`                         | --      | 异步加载子节点；展开未加载节点时调用           |
| draggable           | `boolean`                                         | `false` | 是否允许拖拽                                   |
| showLine            | `boolean`                                         | `false` | 是否显示连接线（保留接口，样式可由消费者扩展） |
| blockNode           | `boolean`                                         | `false` | 是否独占整行                                   |
| searchValue         | `string`                                          | `''`    | 搜索关键字（默认按 title 子串匹配）            |
| filterTreeNode      | `(node, parentKeys) => boolean`                   | --      | 自定义过滤谓词，返回 true 命中                 |
| indentSize          | `number`                                          | `24`    | 每级缩进像素                                   |
| virtualScroll       | `boolean`                                         | `false` | 启用虚拟滚动                                   |
| virtualItemHeight   | `number`                                          | `32`    | 虚拟滚动单项高度（px）                         |
| virtualMaxHeight    | `number`                                          | `320`   | 虚拟滚动可视高度（px）                         |
| focusedKey          | `string \| number`                                | --      | 聚焦节点 key，配 `v-model:focused-key` 接管    |

## 事件

| 事件                                         | 回调签名                                                                                        | 说明                 |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------- |
| update:selected-keys                         | `(keys)`                                                                                        | 选中变化（v-model）  |
| update:checked-keys                          | `(keys)`                                                                                        | 勾选变化（v-model）  |
| update:expanded-keys                         | `(keys)`                                                                                        | 展开变化（v-model）  |
| update:focused-key                           | `(key)`                                                                                         | 聚焦变化（v-model）  |
| focus-change                                 | `(key)`                                                                                         | 聚焦节点变化         |
| select                                       | `(keys, { selectedKeys, selected, node, event })`                                               | 选中变化             |
| check                                        | `(keys, { checkedKeys, halfCheckedKeys, checked, node, event })`                                | 勾选变化             |
| expand                                       | `(keys, { expanded, node })`                                                                    | 展开变化             |
| load                                         | `(loadedKeys, { node })`                                                                        | 异步加载完成         |
| drop                                         | `({ event, node, dragNode, dropPosition })` <br/> `dropPosition: 'before' / 'inside' / 'after'` | 拖拽放下             |
| dragstart / dragenter / dragover / dragleave | `({ event, node })`                                                                             | 标准拖拽生命周期事件 |

## 插槽

| 插槽     | 参数                       | 说明                  |
| -------- | -------------------------- | --------------------- |
| title    | `{ node, data, expanded }` | 自定义节点标题        |
| switcher | `{ expanded, node }`       | 自定义展开 / 折叠箭头 |
| icon     | `{ node, expanded }`       | 自定义节点前缀图标    |

## 类型

```ts
type TreeNodeKey = string | number

interface TreeNodeData {
  key?: TreeNodeKey
  title?: VNodeChild | string
  children?: TreeNodeData[]
  disabled?: boolean
  disableCheckbox?: boolean
  selectable?: boolean
  isLeaf?: boolean
  icon?: VNodeChild
  [key: string]: unknown
}

interface FlattenedTreeNode {
  key: TreeNodeKey
  raw: TreeNodeData
  title: VNodeChild | string
  level: number
  parentKeys: TreeNodeKey[]
  isLeaf: boolean
  disabled: boolean
  disableCheckbox: boolean
  selectable: boolean
  hasChildren: boolean
  childKeys: TreeNodeKey[]
}

type TreeDropPosition = 'before' | 'inside' | 'after'
```

## 协议要点

- `key` 必须唯一；不传则按渲染顺序自动生成 `__auto_n` 兜底。
- `disableCheckbox` 与 `disabled` 区分：前者只锁勾选，后者锁选中 + 勾选 + 拖拽。
- 父子勾选联动忽略 `disabled` / `disableCheckbox` 后代——它们不计入"全选"判定。
- `loadData` 完成后由消费者直接修改原 `node.children`，组件通过 reactive 检测重新平铺。
- `drop` 事件**不会**自动改 `data`——业务实现移动逻辑。
