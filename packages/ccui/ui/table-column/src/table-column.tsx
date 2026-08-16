import type { TableColumn, TableColumnsCollector } from '../../table/src/table-types'
import type { TableColumnProps } from './table-column-types'
import { defineComponent, getCurrentInstance, inject, onBeforeUnmount, onUpdated, watch } from 'vue'
import { nextColumnOrder, tableColumnGroupCollectorKey, tableColumnsCollectorKey } from '../../table/src/table-types'
import { tableColumnProps } from './table-column-types'

export default defineComponent({
  name: 'CTableColumn',
  props: {
    ...tableColumnProps,
    // Table 内部注入的声明位置；不属于公开 TableColumnProps，也不会渲染到 DOM。
    __ccuiDeclarationOrder: { type: Number, default: undefined },
  },
  setup(props: TableColumnProps & { __ccuiDeclarationOrder?: number }, { slots }) {
    // 优先注册到外层 ColumnGroup；不在 group 内则注册到 root Table。
    const group = inject(tableColumnGroupCollectorKey, null)
    const root = inject(tableColumnsCollectorKey, null)
    const collector: TableColumnsCollector | null = group ?? root

    const id = Symbol('CTableColumn')
    const order = nextColumnOrder()
    const instance = getCurrentInstance()!

    /**
     * 只读取当前 VNode 是否声明 customRender slot，不比较每次 render 都可能变化的函数引用，
     * 以便 slot 有无切换时只刷新父 Table 一次。
     */
    const readCustomRenderSlotPresence = () => {
      const children = instance.vnode.children
      return Boolean(
        children &&
        typeof children === 'object' &&
        !Array.isArray(children) &&
        typeof (children as Record<string, unknown>).customRender === 'function',
      )
    }
    let hasCustomRenderSlot = readCustomRenderSlotPresence()

    // 稳定的渲染代理：闭包内部读 slot/prop 最新值（slot 优先于 function prop，且保留响应式），
    // 引用始终复用，避免 getter 每次读取都新建临时闭包。
    const renderProxy = (scope: { text: any; record: any; index: number; column: TableColumn }) => {
      if (hasCustomRenderSlot && slots.customRender) return slots.customRender(scope)
      return props.customRender?.(scope)
    }

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
      // slot 优先于 function prop；复用稳定闭包代理，仅在两者皆无时返回 undefined。
      customRender: {
        get: () => (hasCustomRenderSlot || props.customRender ? renderProxy : undefined),
        enumerable: true,
        configurable: true,
      },
    })

    if (collector) {
      collector.register(id, column, order)
      // keyed 子组件重排不会重新 setup，必须显式同步位置，不能依赖首次挂载序号或 DOM 查询。
      watch(
        () => props.__ccuiDeclarationOrder,
        (declarationOrder) => {
          if (declarationOrder !== undefined) collector.updateOrder?.(id, declarationOrder)
        },
        { immediate: true },
      )
      onUpdated(() => {
        const nextHasCustomRenderSlot = readCustomRenderSlotPresence()
        if (nextHasCustomRenderSlot === hasCustomRenderSlot) return
        // 必须先更新 gate 再刷新父表，否则父 render 仍会读取旧 slot 形态并形成重复更新。
        hasCustomRenderSlot = nextHasCustomRenderSlot
        collector.refresh?.(id)
      })
      onBeforeUnmount(() => collector.unregister(id))
    }
    // 脱离 <c-table> 父级时静默渲染 null —— 用户语义错误由开发者审视，不打 warn 避免污染日志。

    // 自身不渲染 DOM；列定义已注册到 Table。
    return () => null
  },
})
