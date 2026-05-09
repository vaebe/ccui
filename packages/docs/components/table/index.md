# Table 表格

展示结构化数据，覆盖列渲染、排序、过滤、分页、行选择、固定列、展开行和合并单元格等高频能力。

## Basic

:::demo

```vue
<template>
  <c-table :columns="columns" :data-source="dataSource" row-key="id" bordered></c-table>
</template>

<script setup>
const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Role', dataIndex: 'role', key: 'role' },
  { title: 'Age', dataIndex: 'age', key: 'age', align: 'right' },
]

const dataSource = [
  { id: 1, name: 'Alice', role: 'Admin', age: 32 },
  { id: 2, name: 'Tom', role: 'Member', age: 28 },
  { id: 3, name: 'Bob', role: 'Member', age: 24 },
]
</script>
```

:::

## Sort And Filter

:::demo

```vue
<template>
  <c-table :columns="columns" :data-source="dataSource" row-key="id"></c-table>
</template>

<script setup>
const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name', sorter: true },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    filterMultiple: false,
    filters: [
      { text: 'Admin', value: 'admin' },
      { text: 'Member', value: 'member' },
    ],
  },
  { title: 'Age', dataIndex: 'age', key: 'age', sorter: (a, b) => a.age - b.age },
]

const dataSource = [
  { id: 1, name: 'Alice', role: 'admin', age: 32 },
  { id: 2, name: 'Tom', role: 'member', age: 28 },
  { id: 3, name: 'Bob', role: 'member', age: 24 },
]
</script>
```

:::

## Pagination

:::demo

```vue
<template>
  <c-table :columns="columns" :data-source="dataSource" row-key="id" :pagination="{ pageSize: 2 }"></c-table>
</template>

<script setup>
const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Role', dataIndex: 'role', key: 'role' },
]

const dataSource = [
  { id: 1, name: 'Alice', role: 'Admin' },
  { id: 2, name: 'Tom', role: 'Member' },
  { id: 3, name: 'Bob', role: 'Member' },
]
</script>
```

:::

## 固定列

通过 `column.fixed = 'left' | 'right'` 把列吸附在左右两侧；为固定列指定 `width`（数值或带 `px` 的字符串）方可正确计算粘性偏移。当存在任意左固定列时，行选择列与展开图标列会自动跟随固定到左侧。

:::demo

```vue
<template>
  <c-table :columns="columns" :data-source="dataSource" row-key="id" :scroll="{ x: 1200 }"></c-table>
</template>

<script setup>
const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name', width: 120, fixed: 'left' },
  { title: 'City', dataIndex: 'city', key: 'city', width: 200 },
  { title: 'Address', dataIndex: 'address', key: 'address', width: 400 },
  { title: 'Phone', dataIndex: 'phone', key: 'phone', width: 200 },
  { title: 'Action', dataIndex: 'action', key: 'action', width: 120, fixed: 'right' },
]

const dataSource = [
  { id: 1, name: 'Alice', city: 'Beijing', address: 'No. 12, Long Road', phone: '13800000001', action: 'Edit' },
  { id: 2, name: 'Tom', city: 'Shanghai', address: 'No. 8, Park Avenue', phone: '13800000002', action: 'Edit' },
]
</script>
```

:::

## 展开行

通过 `expandable.expandedRowRender` 渲染展开内容；支持 `expandedRowKeys` 受控、`defaultExpandAllRows`、`rowExpandable` 和 `expandRowByClick`。

:::demo

```vue
<template>
  <c-table :columns="columns" :data-source="dataSource" row-key="id" :expandable="expandable"></c-table>
</template>

<script setup>
const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Role', dataIndex: 'role', key: 'role' },
]

const dataSource = [
  { id: 1, name: 'Alice', role: 'Admin', detail: 'Joined 2024-08, owns billing module.' },
  { id: 2, name: 'Tom', role: 'Member', detail: 'Joined 2025-02, owns dashboards.' },
]

const expandable = {
  expandedRowRender: (record) => record.detail,
}
</script>
```

:::

## 合并单元格

通过 `column.onCell` 为单元格返回 `rowSpan` / `colSpan`，被覆盖的单元格返回 `0` 即可。`column.onHeaderCell` 同样支持表头的合并。

:::demo

```vue
<template>
  <c-table :columns="columns" :data-source="dataSource" row-key="id" bordered></c-table>
</template>

<script setup>
const columns = [
  {
    title: 'Team',
    dataIndex: 'team',
    key: 'team',
    onCell: (_record, index) => (index === 0 ? { rowSpan: 2 } : { rowSpan: 0 }),
  },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Role', dataIndex: 'role', key: 'role' },
]

const dataSource = [
  { id: 1, team: 'Platform', name: 'Alice', role: 'Lead' },
  { id: 2, team: 'Platform', name: 'Tom', role: 'Engineer' },
]
</script>
```

:::

## Row Selection

:::demo

```vue
<template>
  <c-table :columns="columns" :data-source="dataSource" row-key="id" :row-selection="rowSelection"></c-table>
</template>

<script setup>
import { computed, ref } from 'vue'

const selectedRowKeys = ref([2])

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Role', dataIndex: 'role', key: 'role' },
  { title: 'Age', dataIndex: 'age', key: 'age', align: 'right' },
]

const dataSource = [
  { id: 1, name: 'Alice', role: 'Admin', age: 32 },
  { id: 2, name: 'Tom', role: 'Member', age: 28 },
  { id: 3, name: 'Bob', role: 'Member', age: 24, disabled: true },
]

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  getCheckboxProps: (record) => ({ disabled: record.disabled }),
  onChange: (keys) => {
    selectedRowKeys.value = keys
  },
}))
</script>
```

:::

## 参数

### Table

| 参数         | 类型                               | 默认值  | 说明                                     |
| ------------ | ---------------------------------- | ------- | ---------------------------------------- | ---------- |
| columns      | TableColumn[]                      | []      | 列配置                                   |
| dataSource   | any[]                              | []      | 行数据                                   |
| rowKey       | string / (record, index) => string | number  | 'key'                                    | 行唯一标识 |
| bordered     | boolean                            | false   | 是否带边框                               |
| loading      | boolean                            | false   | 是否显示加载遮罩                         |
| showHeader   | boolean                            | true    | 是否显示表头                             |
| size         | small / middle / default           | default | 紧凑度                                   |
| pagination   | boolean / TablePaginationConfig    | false   | 分页配置，false 关闭                     |
| rowSelection | TableRowSelection                  | --      | 行选择配置                               |
| expandable   | TableExpandable                    | --      | 展开行配置                               |
| scroll       | { x?, y? }                         | --      | 横/纵向滚动；横向滚动通常配合 fixed 使用 |

### TableColumn

| 字段           | 类型                                                      | 说明                        |
| -------------- | --------------------------------------------------------- | --------------------------- |
| title          | string                                                    | 表头标题                    |
| dataIndex      | string / Array<string \| number>                          | 取值路径                    |
| key            | string                                                    | 列唯一标识                  |
| width          | string / number                                           | 列宽（固定列必须给数值）    |
| align          | left / center / right                                     | 对齐方式                    |
| fixed          | left / right                                              | 固定列方向                  |
| sorter         | boolean / (a, b) => number                                | 排序                        |
| sortOrder      | ascend / descend / null                                   | 受控排序顺序                |
| filters        | TableFilterOption[]                                       | 过滤项                      |
| filteredValue  | TableFilterValue[]                                        | 受控过滤值                  |
| filterMultiple | boolean                                                   | 是否多选过滤                |
| customRender   | (scope) => VNodeChild                                     | 单元格自定义渲染            |
| onCell         | (record, index) => { rowSpan?, colSpan?, style?, class? } | 合并单元格 / 单元格属性扩展 |
| onHeaderCell   | (column) => { rowSpan?, colSpan?, style?, class? }        | 表头单元格属性扩展          |

### TableExpandable

| 字段                   | 类型                          | 说明                     |
| ---------------------- | ----------------------------- | ------------------------ |
| expandedRowKeys        | TableSelectionKey[]           | 受控展开行 key           |
| defaultExpandedRowKeys | TableSelectionKey[]           | 非受控初始展开           |
| defaultExpandAllRows   | boolean                       | 是否默认全部展开         |
| expandedRowRender      | (record, index) => VNodeChild | 展开行内容               |
| rowExpandable          | (record) => boolean           | 行是否可展开             |
| columnWidth            | string / number               | 展开图标列宽，默认 48    |
| fixed                  | boolean                       | 是否固定展开图标列到左侧 |
| expandRowByClick       | boolean                       | 是否点击行触发展开       |
| onExpand               | (expanded, record) => void    | 单行展开/收起回调        |
| onChange               | (expandedRowKeys) => void     | 展开 key 集合变化回调    |

## 事件

| 事件                   | 说明                                       |
| ---------------------- | ------------------------------------------ |
| change                 | (pagination, filters, sorter, currentData) |
| update:pagination      | 分页变化                                   |
| update:filters         | 过滤变化                                   |
| update:sorter          | 排序变化                                   |
| update:selectedRowKeys | 行选择变化                                 |
| update:expandedRowKeys | 展开行变化                                 |
| expand                 | (expanded, record) — 单行展开/收起         |
