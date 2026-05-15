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

## 模板式列声明

通过 `<c-table-column>` 子组件声明列，替代 `columns` 数组写法；用 `<c-table-column-group>` 把多列合并到一个表头分组（thead 双行）；用 `<c-table-summary>` 在 `<tfoot>` 渲染汇总行。三者都是平铺顶层组件，与 `:columns` 数组互斥（数组非空时优先）。

:::demo

```vue
<template>
  <c-table :data-source="dataSource" row-key="id" bordered>
    <c-table-column title="姓名" data-index="name" column-key="name" :width="120" />
    <c-table-column-group title="成绩">
      <c-table-column title="语文" data-index="chinese" column-key="chinese" align="right" />
      <c-table-column title="数学" data-index="math" column-key="math" align="right" />
      <c-table-column title="英语" data-index="english" column-key="english" align="right" />
    </c-table-column-group>
    <c-table-column title="班级" data-index="grade" column-key="grade" />
    <c-table-summary>
      <tr>
        <td>合计</td>
        <td style="text-align:right">{{ sum('chinese') }}</td>
        <td style="text-align:right">{{ sum('math') }}</td>
        <td style="text-align:right">{{ sum('english') }}</td>
        <td>—</td>
      </tr>
    </c-table-summary>
  </c-table>
</template>

<script setup>
const dataSource = [
  { id: 1, name: 'Alice', chinese: 92, math: 88, english: 95, grade: '高一(1)班' },
  { id: 2, name: 'Tom', chinese: 78, math: 96, english: 82, grade: '高一(1)班' },
  { id: 3, name: 'Bob', chinese: 85, math: 90, english: 76, grade: '高一(2)班' },
]

function sum(field) {
  return dataSource.reduce((s, r) => s + r[field], 0)
}
</script>
```

:::

## 自定义单元格渲染

三种写法：列上 `customRender` 函数 / 全局 `#body-cell` slot（按 `column.key` 区分） / 全局 `#header-cell` slot（自定义表头标签）。函数式与 slot 同时存在时 slot 优先。

:::demo

```vue
<template>
  <c-table :columns="columns" :data-source="dataSource" row-key="id" bordered>
    <template #body-cell="{ column, record }">
      <template v-if="column.key === 'status'">
        <span :style="{ color: record.status === 'active' ? '#52c41a' : '#999', fontWeight: 600 }">
          ● {{ record.status === 'active' ? '在职' : '离职' }}
        </span>
      </template>
      <template v-else-if="column.key === 'action'">
        <a style="margin-inline-end: 12px" @click="onEdit(record)">编辑</a>
        <a style="color:#ff4d4f" @click="onDelete(record)">删除</a>
      </template>
    </template>
    <template #header-cell="{ column }">
      <template v-if="column.key === 'salary'">💰 {{ column.title }}</template>
    </template>
  </c-table>
  <p style="color:#666;margin-top:8px">{{ log || '点击编辑 / 删除查看回调' }}</p>
</template>

<script setup>
import { ref } from 'vue'

const log = ref('')

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  {
    title: 'Salary',
    dataIndex: 'salary',
    key: 'salary',
    align: 'right',
    customRender: ({ text }) => `¥${text.toLocaleString()}`,
  },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'action', width: 160 },
]

const dataSource = [
  { id: 1, name: 'Alice', salary: 18000, status: 'active' },
  { id: 2, name: 'Tom', salary: 25000, status: 'inactive' },
  { id: 3, name: 'Bob', salary: 12000, status: 'active' },
]

function onEdit(r) {
  log.value = `编辑 #${r.id} ${r.name}`
}
function onDelete(r) {
  log.value = `删除 #${r.id} ${r.name}`
}
</script>
```

:::

## 树形数据

`dataSource` 中的行通过 `children` 字段携带子节点即自动展开为树（默认字段名 `children`，可通过 `childrenColumnName` 改）；`indentSize` 控制每层缩进像素，默认 15。

:::demo

```vue
<template>
  <c-table :columns="columns" :data-source="dataSource" row-key="id" bordered :indent-size="24"></c-table>
</template>

<script setup>
const columns = [
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '类型', dataIndex: 'type', key: 'type', width: 120 },
  { title: '负责人', dataIndex: 'owner', key: 'owner', width: 120 },
]

const dataSource = [
  {
    id: 1,
    name: '产品研发中心',
    type: '部门',
    owner: 'Alice',
    children: [
      {
        id: 11,
        name: '前端组',
        type: '小组',
        owner: 'Tom',
        children: [
          { id: 111, name: 'Web 团队', type: '团队', owner: 'Bob' },
          { id: 112, name: '移动团队', type: '团队', owner: 'Carol' },
        ],
      },
      { id: 12, name: '后端组', type: '小组', owner: 'Dan' },
    ],
  },
  { id: 2, name: '市场部', type: '部门', owner: 'Eve' },
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

## 受控分页

`pagination` 传入完整对象（`current` / `pageSize` / `total` / `showSizeChanger` / `pageSizeOptions`），配合 `@update:pagination` 实现 current / pageSize 受控；适合分页与后端 API 联动。

:::demo

```vue
<template>
  <c-table
    :columns="columns"
    :data-source="dataSource"
    row-key="id"
    :pagination="pagination"
    @update:pagination="onPaginationChange"
  ></c-table>
  <p style="color:#666;margin-top:8px">
    当前页：{{ pagination.current }} / 每页：{{ pagination.pageSize }} / 总计：{{ pagination.total }}
  </p>
</template>

<script setup>
import { reactive } from 'vue'

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '部门', dataIndex: 'dept', key: 'dept' },
]

const dataSource = Array.from({ length: 28 }, (_, i) => ({
  id: i + 1,
  name: `用户${i + 1}`,
  dept: ['研发', '市场', '运营'][i % 3],
}))

const pagination = reactive({
  current: 1,
  pageSize: 5,
  total: dataSource.length,
  showSizeChanger: true,
  pageSizeOptions: [5, 10, 20],
})

function onPaginationChange(next) {
  pagination.current = next.current
  pagination.pageSize = next.pageSize
}
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

## 单选 + 选中行实时统计

`rowSelection.type = 'radio'` 把多选改成单选。配合 `getCheckboxProps` 可禁用特定行；`onSelect` 在每次勾选时回传当前行 + 全部选中行，便于做实时汇总。

:::demo

```vue
<template>
  <c-table :columns="columns" :data-source="dataSource" row-key="id" :row-selection="rowSelection"></c-table>
  <p style="color:#666;margin-top:8px">
    当前已选：<b>{{ selected ? selected.name : '（未选）' }}</b>
    ，价格：<b>¥{{ selected ? selected.price.toLocaleString() : 0 }}</b>
  </p>
</template>

<script setup>
import { computed, ref } from 'vue'

const selectedKey = ref(1)

const columns = [
  { title: '套餐', dataIndex: 'name', key: 'name' },
  { title: '说明', dataIndex: 'desc', key: 'desc' },
  { title: '价格', dataIndex: 'price', key: 'price', align: 'right', customRender: ({ text }) => `¥${text.toLocaleString()}` },
]

const dataSource = [
  { id: 1, name: '基础版', desc: '个人使用 / 1 用户', price: 0 },
  { id: 2, name: '团队版', desc: '5 用户 / 优先支持', price: 199 },
  { id: 3, name: '企业版', desc: '需联系销售', price: 999, disabled: true },
]

const rowSelection = computed(() => ({
  type: 'radio',
  selectedRowKeys: [selectedKey.value],
  getCheckboxProps: (record) => ({ disabled: record.disabled }),
  onChange: (keys) => {
    selectedKey.value = keys[0]
  },
}))

const selected = computed(() => dataSource.find((r) => r.id === selectedKey.value))
</script>
```

:::

## loading / size / showHeader

`loading=true` 显示遮罩；`size` 三档紧凑度（`small` / `middle` / `default`）；`showHeader=false` 隐藏表头变成卡片化数据列表。

:::demo

```vue
<template>
  <div style="display:flex;gap:8px;margin-bottom:12px;align-items:center">
    <c-segmented v-model="size" :options="['small', 'middle', 'default']" />
    <c-button @click="reload">刷新（模拟 loading）</c-button>
    <label style="margin-inline-start:8px;color:#666">
      <input v-model="showHeader" type="checkbox" /> 显示表头
    </label>
  </div>
  <c-table
    :columns="columns"
    :data-source="dataSource"
    row-key="id"
    bordered
    :size="size"
    :loading="loading"
    :show-header="showHeader"
  ></c-table>
</template>

<script setup>
import { ref } from 'vue'

const size = ref('default')
const loading = ref(false)
const showHeader = ref(true)

const columns = [
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '更新时间', dataIndex: 'updated', key: 'updated' },
]

const dataSource = [
  { id: 1, name: '部署 #1024', status: 'success', updated: '2025-05-15 10:32' },
  { id: 2, name: '部署 #1025', status: 'failed', updated: '2025-05-15 11:08' },
  { id: 3, name: '部署 #1026', status: 'pending', updated: '2025-05-15 12:14' },
]

function reload() {
  loading.value = true
  setTimeout(() => (loading.value = false), 1200)
}
</script>
```

:::

## 自定义空态

`#empty` slot 接管「无数据」占位区，常用于「未筛选到结果」与「真的没数据」分文案，或在空态嵌入引导按钮。

:::demo

```vue
<template>
  <div style="margin-bottom:8px">
    <c-segmented v-model="mode" :options="[{ label: '空数据', value: 'empty' }, { label: '有数据', value: 'full' }]" />
  </div>
  <c-table :columns="columns" :data-source="mode === 'empty' ? [] : dataSource" row-key="id" bordered>
    <template #empty>
      <div style="padding:24px 0;text-align:center;color:#999">
        <div style="font-size:32px">📭</div>
        <div style="margin-top:6px">还没有任何记录</div>
        <c-button type="primary" size="small" style="margin-top:12px" @click="onCreate">创建第一条</c-button>
      </div>
    </template>
  </c-table>
  <p v-if="log" style="color:#666;margin-top:8px">{{ log }}</p>
</template>

<script setup>
import { ref } from 'vue'

const mode = ref('empty')
const log = ref('')

const columns = [
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '状态', dataIndex: 'status', key: 'status' },
]

const dataSource = [{ id: 1, name: '示例', status: 'active' }]

function onCreate() {
  log.value = '点击「创建第一条」按钮'
}
</script>
```

:::

## change 事件全量追踪

`@change` 在分页 / 过滤 / 排序任意一项变化时触发，回调签名 `(pagination, filters, sorter, currentData)`。业务侧最常用于埋点 / 后端 API 联动 / 持久化筛选状态。

:::demo

```vue
<template>
  <c-table
    :columns="columns"
    :data-source="dataSource"
    row-key="id"
    :pagination="{ pageSize: 3 }"
    @change="onChange"
  ></c-table>
  <pre style="margin-top:8px;padding:8px;background:#f5f5f5;font-size:12px;max-height:200px;overflow:auto">{{ log }}</pre>
</template>

<script setup>
import { ref } from 'vue'

const log = ref('（操作分页 / 过滤 / 排序后查看回调参数）')

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
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
  { id: 4, name: 'Carol', role: 'admin', age: 41 },
  { id: 5, name: 'Dan', role: 'member', age: 36 },
]

function onChange(pagination, filters, sorter, currentData) {
  log.value = JSON.stringify(
    {
      pagination: { current: pagination?.current, pageSize: pagination?.pageSize },
      filters,
      sorter: { columnKey: sorter?.columnKey, order: sorter?.order },
      currentDataCount: currentData?.length,
    },
    null,
    2,
  )
}
</script>
```

:::

## 参数

### Table

| 参数               | 类型                               | 默认值     | 说明                                                |
| ------------------ | ---------------------------------- | ---------- | --------------------------------------------------- |
| columns            | TableColumn[]                      | []         | 列配置（与子组件 `<c-table-column>` 互斥；数组优先）|
| dataSource         | any[]                              | []         | 行数据                                              |
| rowKey             | string / (record, index) => string | 'key'      | 行唯一标识                                          |
| bordered           | boolean                            | false      | 是否带边框                                          |
| loading            | boolean                            | false      | 是否显示加载遮罩                                    |
| showHeader         | boolean                            | true       | 是否显示表头                                        |
| size               | 'small' / 'middle' / 'default'     | 'default'  | 紧凑度                                              |
| pagination         | boolean / TablePaginationConfig    | false      | 分页配置，false 关闭                                |
| rowSelection       | TableRowSelection                  | --         | 行选择配置                                          |
| expandable         | TableExpandable                    | --         | 展开行配置                                          |
| scroll             | { x?, y? }                         | --         | 横/纵向滚动；横向滚动通常配合 fixed 使用            |
| childrenColumnName | string                             | 'children' | 树形数据子节点字段名                                |
| indentSize         | number                             | 15         | 树形数据每层缩进 px                                 |

### Slots

| 名称        | 作用域                                  | 说明                                                     |
| ----------- | --------------------------------------- | -------------------------------------------------------- |
| default     | --                                      | 模板式列声明容器，放 `<c-table-column>` 等子组件         |
| body-cell   | `{ text, record, index, column }`       | 单元格统一自定义渲染，按 `column.key` 区分列              |
| header-cell | `{ column, index }`                     | 表头单元格统一自定义渲染                                 |
| empty       | --                                      | 空数据占位                                               |

### TableColumn

| 字段           | 类型                                                      | 说明                        |
| -------------- | --------------------------------------------------------- | --------------------------- |
| title          | string                                                    | 表头标题                    |
| dataIndex      | string / Array<string \| number>                          | 取值路径                    |
| key            | string                                                    | 列唯一标识                  |
| width          | string / number                                           | 列宽（固定列必须给数值）    |
| align          | 'left' / 'center' / 'right'                               | 对齐方式                    |
| fixed          | 'left' / 'right'                                          | 固定列方向                  |
| sorter         | boolean / (a, b) => number                                | 排序                        |
| sortOrder      | 'ascend' / 'descend' / null                               | 受控排序顺序                |
| filters        | TableFilterOption[]                                       | 过滤项                      |
| filteredValue  | TableFilterValue[]                                        | 受控过滤值                  |
| filterMultiple | boolean                                                   | 是否多选过滤                |
| customRender   | (scope) => VNodeChild                                     | 单元格自定义渲染            |
| onCell         | (record, index) => { rowSpan?, colSpan?, style?, class? } | 合并单元格 / 单元格属性扩展 |
| onHeaderCell   | (column) => { rowSpan?, colSpan?, style?, class? }        | 表头单元格属性扩展          |
| children       | TableColumn[]                                             | 子列（仅 ColumnGroup 生成） |

### TablePaginationConfig

| 字段            | 类型      | 说明                                       |
| --------------- | --------- | ------------------------------------------ |
| current         | number    | 当前页码（受控）                            |
| pageSize        | number    | 每页条数                                    |
| total           | number    | 总条数                                      |
| showSizeChanger | boolean   | 是否显示「每页条数」切换器                  |
| pageSizeOptions | number[]  | 可选每页条数                                |

### TableRowSelection

| 字段                   | 类型                                                          | 说明                                       |
| ---------------------- | ------------------------------------------------------------- | ------------------------------------------ |
| type                   | 'checkbox' / 'radio'                                          | 选择方式，默认多选                          |
| selectedRowKeys        | (string \| number)[]                                          | 受控选中行 key                              |
| defaultSelectedRowKeys | (string \| number)[]                                          | 非受控初始选中                              |
| columnWidth            | string / number                                               | 选择列宽                                    |
| hideSelectAll          | boolean                                                       | 是否隐藏「全选」表头复选框                  |
| fixed                  | boolean                                                       | 是否固定到左侧（有 left fixed 列时自动跟随）|
| getCheckboxProps       | (record) => { disabled?, name? }                              | 单行复选框属性扩展，最常用于禁用特定行     |
| onChange               | (selectedRowKeys, selectedRows) => void                       | 选中变化回调                                |
| onSelect               | (record, selected, selectedRows) => void                      | 单行勾选变化                                |
| onSelectAll            | (selected, selectedRows, changedRows) => void                 | 表头全选 / 反选                             |

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

### TableColumn（子组件 `<c-table-column>`）

与上表 `TableColumn` 字段一一对应，作为子组件 props 时命名调整：`key` → `column-key`（避开 Vue 保留属性）；`children` 由嵌入的 `<c-table-column>` 子组件自动收集，不需手写。

| Slots         | 作用域                            | 说明                              |
| ------------- | --------------------------------- | --------------------------------- |
| customRender  | `{ text, record, index, column }` | 列内单元格自定义渲染（slot 优先于 customRender prop） |

### TableColumnGroup（子组件 `<c-table-column-group>`）

| 参数         | 类型                                  | 说明                              |
| ------------ | ------------------------------------- | --------------------------------- |
| title        | string                                | 分组表头标题                       |
| align        | 'left' / 'center' / 'right'           | 分组表头对齐                       |
| fixed        | 'left' / 'right'                      | 整组固定列方向                     |
| onHeaderCell | (column) => TableCellRenderProps      | 表头单元格属性扩展                 |

默认 slot 放 `<c-table-column>` 子列；子列在 tbody 中被展平渲染，在 thead 表现为「分组标题 + 子列标题」双行结构。

### TableSummary（子组件 `<c-table-summary>`）

| 参数  | 类型                          | 默认值 | 说明                                          |
| ----- | ----------------------------- | ------ | --------------------------------------------- |
| fixed | boolean / 'top' / 'bottom'    | false  | 汇总行是否贴底/贴顶（依赖容器 `scroll.y`）    |

默认 slot 直接写 `<tr><td>...</td></tr>`，Table 渲染到 `<tfoot>`。

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
