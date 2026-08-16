import type { VNode } from 'vue'
import type { TableColumn, TableColumnsCollector } from '../../table/src/table-types'
import type { TableColumnGroupProps } from './table-column-group-types'
import {
  cloneVNode,
  defineComponent,
  Fragment,
  inject,
  nextTick,
  onBeforeUnmount,
  onUpdated,
  provide,
  shallowRef,
  triggerRef,
  watch,
} from 'vue'
import { nextColumnOrder, tableColumnGroupCollectorKey, tableColumnsCollectorKey } from '../../table/src/table-types'
import { tableColumnGroupProps } from './table-column-group-types'

interface ChildEntry {
  column: TableColumn
  order: number
  declarationOrder?: number
}

export default defineComponent({
  name: 'CTableColumnGroup',
  props: {
    ...tableColumnGroupProps,
    // Table 内部注入的顶层声明位置；不属于公开 TableColumnGroupProps，也不会渲染到 DOM。
    __ccuiDeclarationOrder: { type: Number, default: undefined },
  },
  setup(props: TableColumnGroupProps & { __ccuiDeclarationOrder?: number }, { slots }) {
    const outer: TableColumnsCollector | null =
      inject(tableColumnGroupCollectorKey, null) ?? inject(tableColumnsCollectorKey, null)

    const id = Symbol('CTableColumnGroup')
    const order = nextColumnOrder()
    let currentOnHeaderCell = props.onHeaderCell
    let hasOnHeaderCell = Boolean(currentOnHeaderCell)
    let skipNextOnHeaderCellRefresh = false

    // 父 Table 始终读取稳定代理，避免 inline 函数 prop 每次 render 换引用后形成父子递归订阅。
    const onHeaderCellProxy = (currentColumn: TableColumn) => currentOnHeaderCell?.(currentColumn) ?? {}

    // 子列收集器：内部 TableColumn 注册到这里。
    const childEntries = new Map<symbol, ChildEntry>()
    let outerRegistered = false
    let syncOuterRegistration = () => undefined
    // shallowRef 让外层 Table 的 render 读 children 时建立依赖；子列增删时 triggerRef 通知更新。
    const childrenRef = shallowRef<TableColumn[]>([])
    const recomputeChildren = () => {
      const entries = Array.from(childEntries.values()).sort((a, b) => a.order - b.order)
      const declarativeEntries = entries
        .filter((entry) => entry.declarationOrder !== undefined)
        .sort((a, b) => a.declarationOrder! - b.declarationOrder!)
      let declarativeIndex = 0
      // 仅替换声明式 TableColumn 原本占据的位置，避免改变未参与协议的嵌套组件相对位置。
      childrenRef.value = entries.map((entry) =>
        entry.declarationOrder === undefined ? entry.column : declarativeEntries[declarativeIndex++].column,
      )
      triggerRef(childrenRef)
      syncOuterRegistration()
    }

    // 用 getter 暴露字段，与 TableColumn 同模式，避免 watch 触发递归。
    const column = {} as TableColumn
    Object.defineProperties(column, {
      title: { get: () => props.title, enumerable: true, configurable: true },
      align: { get: () => props.align, enumerable: true, configurable: true },
      fixed: { get: () => props.fixed, enumerable: true, configurable: true },
      onHeaderCell: {
        get: () => (hasOnHeaderCell ? onHeaderCellProxy : undefined),
        enumerable: true,
        configurable: true,
      },
      children: { get: () => childrenRef.value, enumerable: true, configurable: true },
    })

    syncOuterRegistration = () => {
      if (!outer) return
      const shouldRegister = childrenRef.value.length > 0
      if (shouldRegister === outerRegistered) return
      outerRegistered = shouldRegister
      // 空 Group 不应退化成 tbody 的空白叶子列；首个子列出现时再注册，最后一个移除时同步注销。
      if (shouldRegister) {
        outer.register(id, column, order)
        if (props.__ccuiDeclarationOrder !== undefined) {
          outer.updateOrder?.(id, props.__ccuiDeclarationOrder)
        }
      } else outer.unregister(id)
    }

    const groupCollector: TableColumnsCollector = {
      register(childId, childColumn, childOrder) {
        childEntries.set(childId, { column: childColumn, order: childOrder })
        recomputeChildren()
      },
      updateOrder(childId, declarationOrder) {
        const entry = childEntries.get(childId)
        // 相同声明位置保持 no-op，防止子列更新反复触发外层 Table render。
        if (!entry || entry.declarationOrder === declarationOrder) return
        entry.declarationOrder = declarationOrder
        recomputeChildren()
      },
      refresh(childId) {
        // slot 形态更新可能晚于父 Table render；仅刷新仍已注册的子列，避免卸载后重新引入条目。
        if (!childEntries.has(childId)) return
        recomputeChildren()
      },
      unregister(childId) {
        childEntries.delete(childId)
        recomputeChildren()
      },
    }

    // 暴露 group 收集器给嵌套的 TableColumn；优先级高于 root。
    provide(tableColumnGroupCollectorKey, groupCollector)

    watch(
      () => props.__ccuiDeclarationOrder,
      (declarationOrder) => {
        if (declarationOrder !== undefined) outer?.updateOrder?.(id, declarationOrder)
      },
      { immediate: true },
    )

    onUpdated(() => {
      const nextOnHeaderCell = props.onHeaderCell
      const nextHasOnHeaderCell = Boolean(nextOnHeaderCell)
      const callbackChanged = nextOnHeaderCell !== currentOnHeaderCell
      currentOnHeaderCell = nextOnHeaderCell
      if (!callbackChanged && nextHasOnHeaderCell === hasOnHeaderCell) return
      hasOnHeaderCell = nextHasOnHeaderCell
      if (skipNextOnHeaderCellRefresh) {
        // refresh 产生的 inline 新函数只更新代理目标，不再次刷新父表，避免递归更新。
        skipNextOnHeaderCellRefresh = false
        return
      }
      const refresh = outer?.refresh
      if (!refresh) return
      skipNextOnHeaderCellRefresh = true
      refresh(id)
      // 稳定 fnA→fnB 时 refresh 不一定再次更新 Group；下一 tick 兜底清除跳过标记。
      void nextTick(() => {
        skipNextOnHeaderCellRefresh = false
      })
    })

    onBeforeUnmount(() => {
      if (!outerRegistered) return
      // 父级 beforeUnmount 早于子列注销；先清标记，避免子列随后清空时对同一 id 再注销一次。
      outerRegistered = false
      outer?.unregister(id)
    })
    // 脱离 <c-table> 父级时静默渲染 null。

    // 默认 slot 必须渲染出来让子 TableColumn 走完 setup（触发 register）。
    // 子 TableColumn 自身返回 null，因此这里渲染的是「一组空节点」，不产生 DOM。
    return () => {
      if (!slots.default) return null
      let declarationOrder = 0
      /**
       * keyed 子列重排不会重新 setup，因此显式传递当前 slot 顺序；只递归 Fragment，
       * 不查询 DOM，也不进入嵌套 Group 或其他组件的私有 slot。
       */
      const attachDeclarationOrder = (vnode: VNode): VNode => {
        const componentName =
          typeof vnode.type === 'object' && vnode.type !== null ? (vnode.type as { name?: string }).name : undefined
        if (componentName === 'CTableColumn') {
          return cloneVNode(vnode, { __ccuiDeclarationOrder: declarationOrder++ })
        }
        if (vnode.type === Fragment && Array.isArray(vnode.children)) {
          const cloned = cloneVNode(vnode)
          cloned.children = vnode.children.map((child) =>
            typeof child === 'object' && child !== null && '__v_isVNode' in child
              ? attachDeclarationOrder(child as VNode)
              : child,
          )
          return cloned
        }
        return vnode
      }
      return slots.default().map(attachDeclarationOrder)
    }
  },
})
