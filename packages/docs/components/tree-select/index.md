# TreeSelect 树选择

把 `Tree` 嵌进下拉浮层做为选项面板的选择器。`v-model` 在单选模式下是单值（节点 value），多选模式下是 value 数组。多选默认渲染 checkbox（`treeCheckable=true`），关闭后回退到 `c-tree` 的 multiple selectable 模式。fieldNames 与 Cascader/Select 保持一致（`label/value/children/disabled`），内部映射到 `c-tree` 的 `title/key/...`。

## 单选

最简单用法。点击任意节点（含父节点）提交并关闭面板。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string | null>(null)
const treeData = [
  {
    value: 'parent-1',
    label: '父节点 1',
    children: [
      { value: 'leaf-1-1', label: '叶子 1-1' },
      { value: 'leaf-1-2', label: '叶子 1-2' },
    ],
  },
  {
    value: 'parent-2',
    label: '父节点 2',
    children: [
      { value: 'leaf-2-1', label: '叶子 2-1' },
      { value: 'leaf-2-2', label: '叶子 2-2' },
    ],
  },
]
</script>

<template>
  <c-tree-select v-model="value" :tree-data="treeData" tree-default-expand-all />
</template>
```

:::

## 多选（默认 checkable）

`multiple` 打开多选；默认 `treeCheckable=true`，节点前显示 checkbox。父节点勾选默认会带上子节点（除非 `treeCheckStrictly`）。多选模式下输入框渲染 tags，超过 `maxTagCount` 折叠成 `+ N`。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string[] | null>(null)
const treeData = [
  {
    value: 'p1',
    label: '父 1',
    children: [
      { value: 'p1-1', label: '子 1-1' },
      { value: 'p1-2', label: '子 1-2' },
    ],
  },
  {
    value: 'p2',
    label: '父 2',
    children: [
      { value: 'p2-1', label: '子 2-1' },
      { value: 'p2-2', label: '子 2-2' },
    ],
  },
]
</script>

<template>
  <c-tree-select v-model="value" :tree-data="treeData" multiple tree-default-expand-all :max-tag-count="2" />
</template>
```

:::

## treeCheckStrictly

开启后父子节点的勾选状态完全独立（勾父不连子，勾子不影响父）。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string[] | null>(null)
const treeData = [
  {
    value: 'p1',
    label: '父 1',
    children: [
      { value: 'p1-1', label: '子 1-1' },
      { value: 'p1-2', label: '子 1-2' },
    ],
  },
]
</script>

<template>
  <c-tree-select v-model="value" :tree-data="treeData" multiple tree-check-strictly tree-default-expand-all />
</template>
```

:::

## 多选 selectable（无 checkbox）

`treeCheckable=false` 时多选走 `c-tree` 的 multiple selectable 模式：不显示 checkbox，点击节点高亮并加入选中集合。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string[] | null>(null)
const treeData = [
  {
    value: 'a',
    label: 'A',
    children: [{ value: 'a1', label: 'A1' }],
  },
]
</script>

<template>
  <c-tree-select v-model="value" :tree-data="treeData" multiple :tree-checkable="false" tree-default-expand-all />
</template>
```

:::

## 自定义字段名 (fieldNames)

如果数据源字段不叫 `label / value / children / disabled`，用 `fieldNames` 映射。组件内部会自动转成 `c-tree` 期望的 `title / key / children / disabled`。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string | null>(null)
const treeData = [
  {
    v: 'a',
    l: 'A',
    kids: [{ v: 'a1', l: 'A1' }],
  },
]
const fieldNames = { label: 'l', value: 'v', children: 'kids' }
</script>

<template>
  <c-tree-select v-model="value" :tree-data="treeData" :field-names="fieldNames" tree-default-expand-all />
</template>
```

:::

## 三种尺寸

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string | null>(null)
const treeData = [{ value: 'a', label: 'A', children: [{ value: 'a1', label: 'A1' }] }]
</script>

<template>
  <c-tree-select v-model="value" :tree-data="treeData" size="small" />
  <c-tree-select v-model="value" :tree-data="treeData" />
  <c-tree-select v-model="value" :tree-data="treeData" size="large" />
</template>
```

:::

## 表单联动

放进 `c-form-item` 内时，`status` 会自动跟随 `FormItem` 的校验状态。

:::demo

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'

const form = reactive<{ owner: string | null }>({ owner: null })
const formRef = ref<{ validate: () => Promise<boolean> } | null>(null)
const rules = { owner: [{ required: true, message: '请选择负责人' }] }
const treeData = [
  {
    value: 'team-a',
    label: '团队 A',
    children: [
      { value: 'alice', label: 'Alice' },
      { value: 'bob', label: 'Bob' },
    ],
  },
]
</script>

<template>
  <c-form ref="formRef" :model="form" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
    <c-form-item name="owner" label="负责人" prop="owner">
      <c-tree-select v-model="form.owner" :tree-data="treeData" tree-default-expand-all />
    </c-form-item>
    <c-form-item :wrapper-col="{ span: 24 }">
      <c-button type="primary" @click="formRef?.validate()"> 校验 </c-button>
    </c-form-item>
  </c-form>
</template>
```

:::

## 弹层容器

把面板挂到 `document.body` 或自定义容器，避开 overflow 滚动裁切。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string | null>(null)
const treeData = [{ value: 'a', label: 'A', children: [{ value: 'a1', label: 'A1' }] }]
</script>

<template>
  <c-tree-select v-model="value" :tree-data="treeData" popup-append-to-body />
</template>
```

:::

## Variants

录入组件统一 `variant` 形态。四档：`outlined`（默认）/ `filled` / `borderless` / `underlined`。

:::demo

```vue
<template>
  <div style="margin-bottom: 12px">
    <c-segmented v-model="variant" :options="['outlined', 'filled', 'borderless', 'underlined']" />
  </div>
  <c-tree-select v-model="value" :variant="variant" :tree-data="data" placeholder="请选择" />
</template>

<script setup>
import { ref } from 'vue'
const variant = ref('outlined')
const value = ref('')
const data = [
  {
    key: '1',
    title: '父节点 1',
    children: [
      { key: '1-1', title: '叶子 1-1' },
      { key: '1-2', title: '叶子 1-2' },
    ],
  },
  { key: '2', title: '父节点 2' },
]
</script>
```

:::

## API

### Props

| 参数                    | 类型                                                       | 默认值                  | 说明                                                                            |
| ----------------------- | ---------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------- |
| modelValue              | `string \| number \| (string \| number)[] \| null`         | --                      | 选中值（单选时为单值，多选时为数组）                                            |
| treeData                | `TreeNodeData[]`                                           | `[]`                    | 数据源（递归 children）                                                         |
| fieldNames              | `{ label?, value?, children?, disabled? }`                 | `{}`                    | 字段名映射                                                                      |
| multiple                | boolean                                                    | `false`                 | 是否多选                                                                        |
| treeCheckable           | boolean                                                    | `true`                  | 多选模式下是否在节点前展示 checkbox（false 则走 multiple selectable）           |
| treeCheckStrictly       | boolean                                                    | `false`                 | 多选 + checkable 时，父子节点是否严格独立                                       |
| treeDefaultExpandAll    | boolean                                                    | `false`                 | 默认全部展开                                                                    |
| treeDefaultExpandedKeys | `(string \| number)[]`                                     | `[]`                    | 默认展开的节点 keys                                                             |
| placeholder             | string                                                     | `请选择`                | 占位文案                                                                        |
| disabled                | boolean                                                    | `false`                 | 是否禁用                                                                        |
| clearable               | boolean                                                    | `true`                  | 是否显示清除按钮                                                                |
| size                    | `'small' \| 'default' \| 'large'`                          | `'default'`             | 输入框尺寸                                                                      |
| status                  | `'' \| 'error' \| 'warning' \| ...`                        | `''`                    | 校验状态；置于 `FormItem` 时自动继承                                            |
| placement               | `'bottomLeft' \| 'bottomRight' \| 'topLeft' \| 'topRight'` | `'bottomLeft'`          | 浮层方位                                                                        |
| popupClassName          | string                                                     | --                      | 浮层根元素自定义 class                                                          |
| popupAppendToBody       | boolean                                                    | `false`                 | 是否把浮层 Teleport 到 `document.body`                                          |
| getPopupContainer       | `(trigger: HTMLElement \| null) => HTMLElement \| null`    | --                      | 自定义浮层挂载点                                                                |
| autoFocus               | boolean                                                    | `false`                 | 挂载后自动 focus 输入框                                                         |
| inputReadOnly           | boolean                                                    | `true`                  | 输入框只读（仅单选模式有 input 元素）                                           |
| transitionName          | string                                                     | `ccui-tree-select-fade` | 浮层过渡名                                                                      |
| maxTagCount             | number                                                     | `3`                     | 多选模式输入框最多渲染几个 tag                                                  |
| notFoundContent         | string                                                     | `暂无数据`              | 空数据文案                                                                      |
| popupMaxHeight          | number                                                     | `280`                   | 浮层最大高度（px）                                                              |
| showSearch              | `boolean \| TreeSelectShowSearchConfig`                    | `false`                 | 是否开启搜索过滤；对象形态 `{ filterTreeNode?, treeNodeFilterProp? }`           |
| searchPlaceholder       | string                                                     | `搜索`                  | 搜索框占位文案（`showSearch` 启用时生效；走 ConfigProvider locale 兜底）        |
| loadData                | `(node: TreeNodeData) => Promise<void>`                    | --                      | 异步加载子节点；与节点的 `isLeaf=false` 配合，resolve 后向 node.children mutate |

### Events

| 事件名               | 回调签名                                                  | 触发时机                          |
| -------------------- | --------------------------------------------------------- | --------------------------------- |
| update:modelValue    | `(value: string \| number \| (string\|number)[] \| null)` | 选中变化或清除时                  |
| change               | `(value, labels: string[])`                               | 选中变化或清除时（带 label 数组） |
| popup-visible-change | `(open: boolean)`                                         | 浮层打开 / 关闭时                 |
| focus                | --                                                        | 输入框聚焦                        |
| blur                 | --                                                        | 输入框失焦                        |

## 搜索过滤 showSearch

设置 `showSearch=true` 在浮层顶部渲染搜索框，默认按节点 label 子串匹配（大小写不敏感），命中的节点及其祖先都会显示。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string | null>(null)
const treeData = [
  {
    value: 'beijing',
    label: '北京',
    children: [
      { value: 'haidian', label: '海淀区' },
      { value: 'chaoyang', label: '朝阳区' },
      { value: 'xicheng', label: '西城区' },
    ],
  },
  {
    value: 'shanghai',
    label: '上海',
    children: [
      { value: 'pudong', label: '浦东新区' },
      { value: 'huangpu', label: '黄浦区' },
      { value: 'minhang', label: '闵行区' },
    ],
  },
]
</script>

<template>
  <c-tree-select v-model="value" :tree-data="treeData" show-search tree-default-expand-all />
</template>
```

:::

## 自定义过滤逻辑 filterTreeNode

`showSearch` 对象形态 `{ filterTreeNode, treeNodeFilterProp }`：`filterTreeNode(input, node)` 自定义命中规则；`treeNodeFilterProp` 切到非 label 字段做子串匹配。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string | null>(null)
const treeData = [
  {
    value: 'fe',
    label: '前端',
    pinyin: 'qianduan',
    children: [
      { value: 'vue', label: 'Vue.js', pinyin: 'vue' },
      { value: 'react', label: 'React', pinyin: 'react' },
    ],
  },
  {
    value: 'be',
    label: '后端',
    pinyin: 'houduan',
    children: [
      { value: 'go', label: 'Go', pinyin: 'go' },
      { value: 'node', label: 'Node.js', pinyin: 'node' },
    ],
  },
]

// 业务：拼音 + label 双字段匹配
function filterTreeNode(input: string, node: Record<string, unknown>) {
  if (!input) return true
  const kw = input.toLowerCase()
  return String(node.label).toLowerCase().includes(kw) || String(node.pinyin).includes(kw)
}
</script>

<template>
  <c-tree-select v-model="value" :tree-data="treeData" :show-search="{ filterTreeNode }" tree-default-expand-all />
</template>
```

:::

## 异步加载子节点 loadData

`loadData(node)` 返回 Promise；resolve 后向 node.children 写入数据并触发响应式更新。父节点须显式 `isLeaf: false` 才会触发懒加载。

:::demo

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'

const value = ref<string | null>(null)
const treeData = reactive([
  { value: 'org-a', label: '部门 A', isLeaf: false },
  { value: 'org-b', label: '部门 B', isLeaf: false },
])

async function loadData(node: { value: string; label: string; children?: unknown[] }) {
  await new Promise((r) => setTimeout(r, 500))
  // mutate 注入子节点
  node.children = [
    { value: `${node.value}-1`, label: `${node.label} 小组 1` },
    { value: `${node.value}-2`, label: `${node.label} 小组 2` },
  ]
}
</script>

<template>
  <c-tree-select v-model="value" :tree-data="treeData" :load-data="loadData" placeholder="点开节点触发懒加载" />
</template>
```

:::

## 键盘导航

输入框聚焦后支持：

- `Enter` / `Space` / `↓`：打开面板
- `Esc` / `Tab`：关闭面板
- 面板打开后 `↑ ↓ ← →` / `Enter` 由 `c-tree` 接管（移动 focus / 展开收起 / 选中）

`showSearch` 启用时，搜索框聚焦后方向键 / `Enter` 仍会转发到 tree。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string | null>(null)
const treeData = [
  {
    value: '1',
    label: '部门 A',
    children: [
      { value: '1-1', label: '小组 1' },
      { value: '1-2', label: '小组 2' },
    ],
  },
  { value: '2', label: '部门 B' },
]
</script>

<template>
  <c-tree-select v-model="value" :tree-data="treeData" tree-default-expand-all placeholder="聚焦后按方向键试试" />
</template>
```

:::

## 顶层常量

`showCheckedStrategy` 的取值常量：**不挂命名空间**，从 `@vaebe/ccui` 顶层 export。

```ts
import { TREE_SELECT_SHOW_ALL, TREE_SELECT_SHOW_CHILD, TREE_SELECT_SHOW_PARENT } from '@vaebe/ccui'

// TREE_SELECT_SHOW_PARENT === 'SHOW_PARENT'
// TREE_SELECT_SHOW_CHILD  === 'SHOW_CHILD'
// TREE_SELECT_SHOW_ALL    === 'SHOW_ALL'
```

| 常量                    | 说明                                                    |
| ----------------------- | ------------------------------------------------------- |
| TREE_SELECT_SHOW_PARENT | `showCheckedStrategy` 取值：父子都选中时只输出父节点    |
| TREE_SELECT_SHOW_CHILD  | `showCheckedStrategy` 取值：只输出叶子节点              |
| TREE_SELECT_SHOW_ALL    | `showCheckedStrategy` 取值：输出所有选中节点（父 + 子） |

> 当前 TreeSelect 尚未接入 `showCheckedStrategy` 这条 API；常量先 export 出去，方便外部代码提前引用，待后续接入实际逻辑时直接对接。

## 已知限制（未交付）

- **showCheckedStrategy**：多选 checkable 模式下，输出的 v-model 总是 `c-tree` 的 `checkedKeys` 全集；不暴露 `SHOW_PARENT` / `SHOW_CHILD` / `SHOW_ALL` 切换。常量符号已顶层 export，未来接入实际逻辑后即可直接使用。
- **半选 v-model 输出**：多选模式 v-model 不携带 `halfCheckedKeys`（业务需要时可监听 `c-tree` 的 check 事件自取）。
