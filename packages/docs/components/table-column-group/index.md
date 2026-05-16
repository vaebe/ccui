# TableColumnGroup 表格列分组

表格列分组组件，作为 `<c-table>` 的子组件，让 thead 多生成一行「分组标题」，子叶子列在 tbody 中被展平渲染（**不通过 Table.ColumnGroup 静态属性挂载**，平铺独立顶层组件）。

::: tip 使用前提
TableColumnGroup 必须与 [`<c-table-column>`](/components/table-column/) 一起使用（模板式列声明）。
:::

## 何时使用

- 多列共享一个上位标题，需要分组表头展示（如「姓名」分为「姓」「名」两列）。
- 报表场景：横向月份分组、维度分组。

## 基本使用

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {
      data: [
        { key: '1', firstName: '张', lastName: '三', age: 28, role: 'admin' },
        { key: '2', firstName: '李', lastName: '四', age: 32, role: 'user' },
        { key: '3', firstName: '王', lastName: '五', age: 24, role: 'user' },
      ],
    }
  },
})
</script>

<template>
  <c-table :data-source="data">
    <c-table-column-group title="姓名">
      <c-table-column title="姓" data-index="firstName" column-key="firstName" />
      <c-table-column title="名" data-index="lastName" column-key="lastName" />
    </c-table-column-group>
    <c-table-column title="年龄" data-index="age" column-key="age" />
    <c-table-column title="角色" data-index="role" column-key="role" />
  </c-table>
</template>
```

:::

## 多组并存

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {
      data: [
        { key: '1', firstName: '张', lastName: '三', q1: 100, q2: 120 },
        { key: '2', firstName: '李', lastName: '四', q1: 90, q2: 110 },
      ],
    }
  },
})
</script>

<template>
  <c-table :data-source="data">
    <c-table-column-group title="姓名">
      <c-table-column title="姓" data-index="firstName" column-key="firstName" />
      <c-table-column title="名" data-index="lastName" column-key="lastName" />
    </c-table-column-group>
    <c-table-column-group title="销售额">
      <c-table-column title="Q1" data-index="q1" column-key="q1" />
      <c-table-column title="Q2" data-index="q2" column-key="q2" />
    </c-table-column-group>
  </c-table>
</template>
```

:::

## 组外独立列与组并存

非分组的顶层列自动 `rowspan=2` 跨双行。

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {
      data: [
        { key: '1', name: '张三', q1: 100, q2: 120 },
        { key: '2', name: '李四', q1: 90, q2: 110 },
      ],
    }
  },
})
</script>

<template>
  <c-table :data-source="data">
    <c-table-column title="姓名" data-index="name" column-key="name" />
    <c-table-column-group title="销售额">
      <c-table-column title="Q1" data-index="q1" column-key="q1" />
      <c-table-column title="Q2" data-index="q2" column-key="q2" />
    </c-table-column-group>
  </c-table>
</template>
```

:::

## TableColumnGroup 参数

| 参数         | 类型                               | 默认 | 说明                                 |
| ------------ | ---------------------------------- | ---- | ------------------------------------ |
| title        | `string`                           | `''` | 组标题，渲染在 thead 顶部行          |
| align        | `'left' \| 'center' \| 'right'`    | -    | 组标题对齐                           |
| fixed        | `'left' \| 'right'`                | -    | 组固定方向（实际固定行为以子列为准） |
| onHeaderCell | `(column) => TableCellRenderProps` | -    | 组标题单元格 props 工厂              |

## TableColumnGroup 插槽

| 插槽名  | 说明                         |
| ------- | ---------------------------- |
| default | 子 `<c-table-column>` 列声明 |
