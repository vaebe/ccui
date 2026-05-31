# Transfer 穿梭框

双列穿梭框。左侧"源"，右侧"目标"，通过中间按钮把选中项从一侧移到另一侧。常见于权限分配 / 字段挑选 / 角色管理等场景。

## 基本使用

`data-source` 给全集，`v-model:target-keys` 控制右侧 keys，`v-model:selected-keys` 控制双列勾选状态。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const data = Array.from({ length: 8 }).map((_, i) => ({
  key: String(i),
  title: `内容 ${i}`,
  description: `描述 ${i}`,
}))
const target = ref<string[]>(['2', '3'])
const selected = ref<string[]>([])
</script>

<template>
  <c-transfer
    v-model:target-keys="target"
    v-model:selected-keys="selected"
    :data-source="data"
    :titles="['源', '目标']"
  />
</template>
```

:::

## 搜索

`show-search` 在两列上方各显示一个搜索框，按 `title`（或自定义 `filterOption`）过滤当前列。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const data = ['Apple', 'Banana', 'Cherry', 'Durian', 'Elderberry'].map((t, i) => ({
  key: String(i),
  title: t,
}))
const target = ref<string[]>([])
const selected = ref<string[]>([])
</script>

<template>
  <c-transfer v-model:target-keys="target" v-model:selected-keys="selected" :data-source="data" show-search />
</template>
```

:::

## 自定义渲染

`render` 函数（或 `render` slot）自定义单项展示，可以加图标、副标题、tag 等。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const data = [
  { key: '1', title: '管理员', description: '可读写' },
  { key: '2', title: '编辑', description: '可读写文档' },
  { key: '3', title: '访客', description: '只读' },
]
const target = ref<string[]>([])
const selected = ref<string[]>([])
</script>

<template>
  <c-transfer v-model:target-keys="target" v-model:selected-keys="selected" :data-source="data">
    <template #render="{ item }">
      <span
        ><strong>{{ item.title }}</strong> · <small style="color:#999">{{ item.description }}</small></span
      >
    </template>
  </c-transfer>
</template>
```

:::

## 禁用单项 / 整体

每条数据可单独 `disabled`；整体 `disabled` 让两列都失去交互。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const data = [
  { key: '1', title: 'Apple' },
  { key: '2', title: 'Banana', disabled: true },
  { key: '3', title: 'Cherry' },
]
const target = ref<string[]>([])
const selected = ref<string[]>([])
</script>

<template>
  <c-transfer v-model:target-keys="target" v-model:selected-keys="selected" :data-source="data" />
</template>
```

:::

## 自定义文案

`titles` 替换列标题；`operations` 替换中间按钮文案；`locale` 替换搜索 placeholder / 空数据提示 / 单位词。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const data = [
  { key: '1', title: 'Apple' },
  { key: '2', title: 'Banana' },
  { key: '3', title: 'Cherry' },
]
const target = ref<string[]>([])
const selected = ref<string[]>([])
</script>

<template>
  <c-transfer
    v-model:target-keys="target"
    v-model:selected-keys="selected"
    :data-source="data"
    :titles="['可选', '已选']"
    :operations="['加入', '移除']"
    :locale="{ itemUnit: '项', itemsUnit: '项', searchPlaceholder: '过滤', notFoundContent: '空' }"
    show-search
  />
</template>
```

:::

## 自定义全选区图标

`selections-icon` slot 在每列头部全选区追加一枚状态图标，scope 是 `{ direction, selectedCount, totalCount }`，可以根据「左/右列、当前已勾几个」切换图标。同名 prop 接 Iconify 名或 CSS 类名，slot 优先级更高。

:::demo

```vue
<script setup lang="ts">
import { ref } from 'vue'

const data = [
  { key: '1', title: '管理员' },
  { key: '2', title: '编辑' },
  { key: '3', title: '访客' },
  { key: '4', title: '审计员' },
]
const target = ref<string[]>(['2'])
const selected = ref<string[]>([])
</script>

<template>
  <c-transfer
    v-model:target-keys="target"
    v-model:selected-keys="selected"
    :data-source="data"
    :titles="['可选角色', '已分配']"
  >
    <template #selections-icon="{ direction, selectedCount, totalCount }">
      <span v-if="direction === 'right'"><c-icon name="mdi:star" /> {{ selectedCount }}/{{ totalCount }}</span>
      <span v-else><c-icon name="mdi:checkbox-blank-outline" /> {{ selectedCount }}/{{ totalCount }}</span>
    </template>
  </c-transfer>
</template>
```

:::

## API

### Props

| 参数           | 类型                                                          | 默认值       | 说明                                                                    |
| -------------- | ------------------------------------------------------------- | ------------ | ----------------------------------------------------------------------- |
| dataSource     | `TransferItem[]`                                              | `[]`         | 全部数据。`{ key, title?, description?, disabled? }`                    |
| targetKeys     | `string[]`                                                    | `[]`         | 在右侧（target）的 key 集合，支持 `v-model:targetKeys`                  |
| selectedKeys   | `string[]`                                                    | `[]`         | 跨两列勾选的 key，支持 `v-model:selectedKeys`                           |
| titles         | `[string, string]`                                            | `['', '']`   | 两列标题                                                                |
| operations     | `[string, string]`                                            | `['', '']`   | 中间按钮文案：[右移, 左移]；为空时回退到内置 chevron 图标               |
| showSearch     | boolean                                                       | `false`      | 显示搜索框                                                              |
| filterOption   | `(input: string, item: TransferItem) => boolean`              | --           | 自定义过滤；不传走默认 title 包含匹配                                   |
| disabled       | boolean                                                       | `false`      | 整体禁用                                                                |
| render         | `(item: TransferItem) => string \| VNode`                     | --           | 自定义单项渲染                                                          |
| locale         | `{ itemUnit, itemsUnit, notFoundContent, searchPlaceholder }` | --           | 自定义文案                                                              |
| pagination     | `boolean \| number`                                           | `false`      | 分页配置：`true` 用默认 pageSize=10，数字指定 pageSize                  |
| draggable      | boolean                                                       | `false`      | 是否允许右侧列表拖拽排序                                                |
| selectionsIcon | `string \| VNode`                                             | --           | 头部全选区状态图标，string 为 Iconify 名或 CSS 类。同名 slot 优先级更高 |

### Events

| 事件名              | 回调签名                                               | 触发时机                     |
| ------------------- | ------------------------------------------------------ | ---------------------------- |
| update:targetKeys   | `(keys: string[])`                                     | 移动后右侧 keys 变化         |
| update:selectedKeys | `(keys: string[])`                                     | 勾选 / 全选变化              |
| change              | `(targetKeys, direction: 'left' \| 'right', moveKeys)` | 点击移动按钮                 |
| select-change       | `(sourceSelectedKeys, targetSelectedKeys)`             | 双列勾选状态变化（拆出左右） |
| search              | `(direction: 'left' \| 'right', value: string)`        | 搜索框输入                   |

### Slots

| 名称            | 参数                                       | 说明                         |
| --------------- | ------------------------------------------ | ---------------------------- |
| render          | `{ item }`                                 | 自定义单项渲染               |
| selectAllLabels | `{ direction, selectedCount, totalCount }` | 自定义每列头部全选区标签内容 |
| selectionsIcon  | `{ direction, selectedCount, totalCount }` | 自定义每列头部全选区状态图标 |

## 已知限制（未交付）

- **虚拟滚动**：列表项 > 1000 时滚动不优化，复用 `use-virtual-list` 留后续。
- **direction='rtl'**：阿语等 RTL 语言下左右布局未做反转。
