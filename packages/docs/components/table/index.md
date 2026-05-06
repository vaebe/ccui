# Table

Display structured data with basic column rendering, sorting, filtering, and local pagination.

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
