# TableColumn 表格列

模板式表格列声明，作为 `<c-table>` 的子组件出现（**不通过 Table.Column 静态属性挂载**，平铺独立顶层组件）。

::: tip 与 `columns` prop 的关系
`<c-table>` 同时支持两种列声明，**二选一**：

- **数组式（默认）**：`<c-table :columns="columns" :data-source="data" />`。简洁，适合列定义可序列化、来自后端的场景。
- **模板式**：在 `<c-table>` 默认 slot 内放 `<c-table-column>`。适合需要把列结构写在模板里、配合 `v-if` / `v-for` 动态增删列、或者用 scoped slot 渲染单元格的场景。

**两者互斥：`columns` prop 非空时优先用 prop，模板式子组件被忽略**。
:::

## 何时使用

- 列定义需要写在模板里、配合 `v-if` 条件渲染。
- 单元格内容需要复杂的 `scoped slot`（嵌套组件、表单控件等）。
- 偏好把列结构写成 JSX 风格的模板而不是数组配置。

## 基本使用

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {
      data: [
        { key: '1', name: 'Tom', age: 28, role: 'admin' },
        { key: '2', name: 'Alice', age: 32, role: 'user' },
        { key: '3', name: 'Bob', age: 24, role: 'user' },
      ],
    }
  },
})
</script>

<template>
  <c-table :data-source="data">
    <c-table-column title="姓名" data-index="name" column-key="name" />
    <c-table-column title="年龄" data-index="age" column-key="age" :sorter="true" />
    <c-table-column title="角色" data-index="role" column-key="role" />
  </c-table>
</template>
```

:::

## customRender slot 自定义单元格

`customRender` scoped slot 优先于同名 prop；`scope` 含 `{ text, record, index, column }`。

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {
      data: [
        { key: '1', name: 'Tom', age: 28 },
        { key: '2', name: 'Alice', age: 32 },
      ],
    }
  },
})
</script>

<template>
  <c-table :data-source="data">
    <c-table-column title="姓名" data-index="name" column-key="name" />
    <c-table-column title="年龄" data-index="age" column-key="age">
      <template #customRender="{ text }">
        <c-tag :type="text > 30 ? 'warning' : 'info'">{{ text }} 岁</c-tag>
      </template>
    </c-table-column>
  </c-table>
</template>
```

:::

## 动态列（v-if / v-for）

:::demo

```vue
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const showRole = ref(true)
    return {
      showRole,
      data: [
        { key: '1', name: 'Tom', age: 28, role: 'admin' },
        { key: '2', name: 'Alice', age: 32, role: 'user' },
      ],
    }
  },
})
</script>

<template>
  <c-space direction="vertical">
    <c-switch v-model="showRole" /> 显示角色列
    <c-table :data-source="data">
      <c-table-column title="姓名" data-index="name" column-key="name" />
      <c-table-column title="年龄" data-index="age" column-key="age" />
      <c-table-column v-if="showRole" title="角色" data-index="role" column-key="role" />
    </c-table>
  </c-space>
</template>
```

:::

## 排序 + 过滤

`sorter` / `filters` 与 columns 数组里同名字段语义一致。

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {
      data: [
        { key: '1', name: 'Tom', age: 28, role: 'admin' },
        { key: '2', name: 'Alice', age: 32, role: 'user' },
        { key: '3', name: 'Bob', age: 24, role: 'user' },
      ],
      roleFilters: [
        { text: '管理员', value: 'admin' },
        { text: '普通用户', value: 'user' },
      ],
    }
  },
})
</script>

<template>
  <c-table :data-source="data">
    <c-table-column title="姓名" data-index="name" column-key="name" />
    <c-table-column title="年龄" data-index="age" column-key="age" :sorter="true" />
    <c-table-column title="角色" data-index="role" column-key="role" :filters="roleFilters" :filter-multiple="false" />
  </c-table>
</template>
```

:::

## TableColumn 参数

| 参数           | 类型                                      | 默认   | 说明                                                    |
| -------------- | ----------------------------------------- | ------ | ------------------------------------------------------- |
| title          | `string`                                  | `''`   | 列标题                                                  |
| dataIndex      | `string \| Array<string \| number>`       | -      | 字段路径，支持 `'a.b'` 字符串或 `['a','b']` 数组        |
| columnKey      | `string`                                  | -      | 列 key（用于 sorter / filter 标识；不传则用 dataIndex） |
| width          | `string \| number`                        | -      | 列宽度                                                  |
| align          | `'left' \| 'center' \| 'right'`           | -      | 内容对齐                                                |
| fixed          | `'left' \| 'right'`                       | -      | 固定列方向                                              |
| sorter         | `boolean \| (a, b) => number`             | -      | 是否可排序 / 自定义排序函数                             |
| sortOrder      | `'ascend' \| 'descend' \| null`           | -      | 受控排序态                                              |
| filters        | `{ text, value }[]`                       | -      | 过滤选项                                                |
| filteredValue  | `Array`                                   | -      | 受控过滤态                                              |
| filterMultiple | `boolean`                                 | `true` | 是否多选过滤                                            |
| customRender   | `(scope) => VNodeChild`                   | -      | 函数式自定义渲染（slot 优先）                           |
| onCell         | `(record, index) => TableCellRenderProps` | -      | 单元格 props 工厂                                       |
| onHeaderCell   | `(column) => TableCellRenderProps`        | -      | 表头单元格 props 工厂                                   |

## TableColumn 插槽

| 插槽名       | 作用域参数                        | 说明             |
| ------------ | --------------------------------- | ---------------- |
| customRender | `{ text, record, index, column }` | 自定义单元格内容 |
