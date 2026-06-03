# TableSummary 表格汇总

表格汇总行，在 `<c-table>` 底部渲染 `<tfoot>` 汇总区（**不通过 Table.Summary 静态属性挂载**，平铺独立顶层组件）。

::: tip 使用前提
TableSummary 必须作为 `<c-table>` 的子组件使用。default slot 内放 `<tr>` / `<td>` 原生标签（也可放多个 `<tr>` 行），由 Table 直接挂到 tfoot。
:::

## 何时使用

- 表格底部需要展示「合计」「平均值」「总数」等汇总信息。
- 报表 / 财务 / 数据看板的总计行。

## 基本使用

:::demo

```vue
<script>
import { computed, defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const data = [
      { key: '1', name: '苹果', qty: 10, price: 5 },
      { key: '2', name: '香蕉', qty: 20, price: 3 },
      { key: '3', name: '橙子', qty: 15, price: 4 },
    ]
    const totalQty = computed(() => data.reduce((sum, r) => sum + r.qty, 0))
    const totalAmount = computed(() => data.reduce((sum, r) => sum + r.qty * r.price, 0))
    return { data, totalQty, totalAmount }
  },
})
</script>

<template>
  <c-table :data-source="data">
    <c-table-column title="名称" data-index="name" column-key="name" />
    <c-table-column title="数量" data-index="qty" column-key="qty" />
    <c-table-column title="单价" data-index="price" column-key="price" />
    <c-table-summary>
      <tr>
        <td><b>合计</b></td>
        <td>{{ totalQty }}</td>
        <td>{{ totalAmount }} 元</td>
      </tr>
    </c-table-summary>
  </c-table>
</template>
```

:::

## 多行汇总

可在 default slot 内放多个 `<tr>` 渲染多行汇总。

:::demo

```vue
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {
      data: [
        { key: '1', name: '苹果', qty: 10 },
        { key: '2', name: '香蕉', qty: 20 },
      ],
    }
  },
})
</script>

<template>
  <c-table :data-source="data">
    <c-table-column title="名称" data-index="name" column-key="name" />
    <c-table-column title="数量" data-index="qty" column-key="qty" />
    <c-table-summary>
      <tr>
        <td>小计</td>
        <td>30</td>
      </tr>
      <tr>
        <td>含税</td>
        <td>33</td>
      </tr>
    </c-table-summary>
  </c-table>
</template>
```

:::

## TableSummary 参数

| 参数  | 类型                           | 默认    | 说明                                                   |
| ----- | ------------------------------ | ------- | ------------------------------------------------------ |
| fixed | `boolean \| 'top' \| 'bottom'` | `false` | 滚动场景汇总行是否粘性（真实粘性依赖 `scroll.y` 容器） |

## TableSummary 插槽

| 插槽名  | 说明                                                  |
| ------- | ----------------------------------------------------- |
| default | 汇总行内容，需要包一层或多层 `<tr>` / `<td>` 原生节点 |
