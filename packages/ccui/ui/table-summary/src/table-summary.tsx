import type { Slot } from 'vue'
import type { TableSummaryProps } from './table-summary-types'
import { defineComponent, getCurrentInstance, inject, nextTick, onBeforeUnmount, onUpdated } from 'vue'
import { tableSummaryCollectorKey } from '../../table/src/table-types'
import { tableSummaryProps } from './table-summary-types'

export default defineComponent({
  name: 'CTableSummary',
  inheritAttrs: false,
  props: {
    ...tableSummaryProps,
    // Table 内部注入的 Summary 声明位置；不属于公开 TableSummaryProps，也不会渲染到 DOM。
    __ccuiDeclarationOrder: { type: Number, default: undefined },
  },
  setup(props: TableSummaryProps & { __ccuiDeclarationOrder?: number }, { attrs, slots }) {
    const collector = inject(tableSummaryCollectorKey, null)
    const instance = getCurrentInstance()!
    const id = Symbol('CTableSummary')
    let currentDeclaredSlot: Slot | null = null
    let hasDefaultSlot = false
    let currentFixed = props.fixed
    let currentOrder = props.__ccuiDeclarationOrder
    let currentAttrs = { ...attrs }
    let skipNextCollectorUpdate = false

    /** 读取当前 VNode 声明的 slot 函数，用引用变化识别稳定 slot 替换，同时不依赖旧 slots 代理形态。 */
    const readDeclaredDefaultSlot = (): Slot | null => {
      const children = instance.vnode.children
      if (!children || typeof children !== 'object' || Array.isArray(children)) return null
      const defaultSlot = (children as Record<string, unknown>).default
      return typeof defaultSlot === 'function' ? (defaultSlot as Slot) : null
    }

    currentDeclaredSlot = readDeclaredDefaultSlot()
    hasDefaultSlot = Boolean(currentDeclaredSlot)
    // collector 始终持有稳定代理；slot 形态变化只更新 gate，避免父 Table 直接订阅子 slots 更新。
    const renderProxy: Slot = (...args) => (hasDefaultSlot ? (slots.default?.(...args) ?? []) : [])

    if (collector) {
      collector.register(id, hasDefaultSlot ? renderProxy : null, currentFixed, currentAttrs, currentOrder)
      onUpdated(() => {
        const nextDeclaredSlot = readDeclaredDefaultSlot()
        const nextHasDefaultSlot = Boolean(nextDeclaredSlot)
        const nextFixed = props.fixed
        const nextOrder = props.__ccuiDeclarationOrder
        const nextAttrs = { ...attrs }
        const attrsChanged =
          Object.keys(nextAttrs).length !== Object.keys(currentAttrs).length ||
          Object.keys(nextAttrs).some((key) => nextAttrs[key] !== currentAttrs[key])
        const changed =
          nextDeclaredSlot !== currentDeclaredSlot ||
          nextHasDefaultSlot !== hasDefaultSlot ||
          nextFixed !== currentFixed ||
          nextOrder !== currentOrder ||
          attrsChanged
        currentDeclaredSlot = nextDeclaredSlot
        hasDefaultSlot = nextHasDefaultSlot
        currentFixed = nextFixed
        currentOrder = nextOrder
        currentAttrs = nextAttrs
        if (!changed) return
        if (skipNextCollectorUpdate) {
          // collector 更新引起的 inline slot 新引用只更新代理目标，不再次更新父 Table。
          skipNextCollectorUpdate = false
          return
        }
        skipNextCollectorUpdate = true
        collector.update(id, hasDefaultSlot ? renderProxy : null, currentFixed, currentAttrs, currentOrder)
        // 稳定 slot/fixed 更新不一定再次触发本组件；下一 tick 兜底清除跳过标记。
        void nextTick(() => {
          skipNextCollectorUpdate = false
        })
      })
      onBeforeUnmount(() => collector.unregister(id))
    }
    // 脱离 <c-table> 父级时静默渲染 null。

    return () => null
  },
})
