import type { TableColumn, TableColumnsCollector } from '../../table/src/table-types'
import type { TableColumnGroupProps } from './table-column-group-types'
import { defineComponent, inject, onBeforeUnmount, provide, shallowRef, triggerRef } from 'vue'
import { tableColumnGroupCollectorKey, tableColumnsCollectorKey } from '../../table/src/table-types'
import { tableColumnGroupProps } from './table-column-group-types'

let groupSeq = 0

interface ChildEntry {
  column: TableColumn
  order: number
}

export default defineComponent({
  name: 'CTableColumnGroup',
  props: tableColumnGroupProps,
  setup(props: TableColumnGroupProps, { slots }) {
    const outer = inject(tableColumnGroupCollectorKey, null) ?? inject(tableColumnsCollectorKey, null)

    const id = Symbol('CTableColumnGroup')
    const order = ++groupSeq

    // 子列收集器：内部 TableColumn 注册到这里。
    const childEntries = new Map<symbol, ChildEntry>()
    // shallowRef 让外层 Table 的 render 读 children 时建立依赖；子列增删时 triggerRef 通知更新。
    const childrenRef = shallowRef<TableColumn[]>([])
    const recomputeChildren = () => {
      childrenRef.value = Array.from(childEntries.values())
        .sort((a, b) => a.order - b.order)
        .map((entry) => entry.column)
      triggerRef(childrenRef)
    }

    // 用 getter 暴露字段，与 TableColumn 同模式，避免 watch 触发递归。
    const column = {} as TableColumn
    Object.defineProperties(column, {
      title: { get: () => props.title, enumerable: true, configurable: true },
      align: { get: () => props.align, enumerable: true, configurable: true },
      fixed: { get: () => props.fixed, enumerable: true, configurable: true },
      onHeaderCell: { get: () => props.onHeaderCell, enumerable: true, configurable: true },
      children: { get: () => childrenRef.value, enumerable: true, configurable: true },
    })

    const groupCollector: TableColumnsCollector = {
      register(childId, childColumn, childOrder) {
        childEntries.set(childId, { column: childColumn, order: childOrder })
        recomputeChildren()
      },
      unregister(childId) {
        childEntries.delete(childId)
        recomputeChildren()
      },
    }

    // 暴露 group 收集器给嵌套的 TableColumn；优先级高于 root。
    provide(tableColumnGroupCollectorKey, groupCollector)

    if (outer) {
      outer.register(id, column, order)
      onBeforeUnmount(() => outer.unregister(id))
    }
    // 脱离 <c-table> 父级时静默渲染 null。

    // 默认 slot 必须渲染出来让子 TableColumn 走完 setup（触发 register）。
    // 子 TableColumn 自身返回 null，因此这里渲染的是「一组空节点」，不产生 DOM。
    return () => (slots.default ? slots.default() : null)
  },
})
