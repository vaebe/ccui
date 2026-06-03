import type { TableColumn } from '../../table/src/table-types'
import type { TableColumnProps } from './table-column-types'
import { defineComponent, inject, onBeforeUnmount } from 'vue'
import { tableColumnGroupCollectorKey, tableColumnsCollectorKey } from '../../table/src/table-types'
import { tableColumnProps } from './table-column-types'

let columnSeq = 0

export default defineComponent({
  name: 'CTableColumn',
  props: tableColumnProps,
  setup(props: TableColumnProps, { slots }) {
    // 优先注册到外层 ColumnGroup；不在 group 内则注册到 root Table。
    const group = inject(tableColumnGroupCollectorKey, null)
    const root = inject(tableColumnsCollectorKey, null)
    const collector = group ?? root

    const id = Symbol('CTableColumn')
    const order = ++columnSeq

    // 关键：用 getter 暴露字段，让 Table 端的 render 读取时直接跟 props 建立响应式依赖。
    // 这样 props 变动不需要在本组件 watch 里 re-register —— 避免 function prop 引用频繁变化导致的递归刷新。
    const column = {} as TableColumn

    Object.defineProperties(column, {
      title: { get: () => props.title, enumerable: true, configurable: true },
      dataIndex: { get: () => props.dataIndex, enumerable: true, configurable: true },
      key: { get: () => props.columnKey, enumerable: true, configurable: true },
      width: { get: () => props.width, enumerable: true, configurable: true },
      align: { get: () => props.align, enumerable: true, configurable: true },
      fixed: { get: () => props.fixed, enumerable: true, configurable: true },
      sorter: { get: () => props.sorter, enumerable: true, configurable: true },
      sortOrder: { get: () => props.sortOrder, enumerable: true, configurable: true },
      filters: { get: () => props.filters, enumerable: true, configurable: true },
      filteredValue: { get: () => props.filteredValue, enumerable: true, configurable: true },
      filterMultiple: { get: () => props.filterMultiple, enumerable: true, configurable: true },
      onCell: { get: () => props.onCell, enumerable: true, configurable: true },
      onHeaderCell: { get: () => props.onHeaderCell, enumerable: true, configurable: true },
      // slot 优先于 function prop；用稳定闭包代理，闭包内部读 slot/prop 最新值。
      customRender: {
        get: () => {
          if (!slots.customRender && !props.customRender) return undefined
          return (scope: { text: any; record: any; index: number; column: TableColumn }) => {
            if (slots.customRender) return slots.customRender(scope)
            return props.customRender?.(scope)
          }
        },
        enumerable: true,
        configurable: true,
      },
    })

    if (collector) {
      collector.register(id, column, order)
      onBeforeUnmount(() => collector.unregister(id))
    }
    // 脱离 <c-table> 父级时静默渲染 null —— 用户语义错误由开发者审视，不打 warn 避免污染日志。

    // 自身不渲染 DOM；列定义已注册到 Table。
    return () => null
  },
})
