import type { TableSummaryProps } from './table-summary-types'
import { defineComponent, inject, onBeforeUnmount } from 'vue'
import { tableSummaryCollectorKey } from '../../table/src/table-types'
import { tableSummaryProps } from './table-summary-types'

export default defineComponent({
  name: 'CTableSummary',
  props: tableSummaryProps,
  setup(props: TableSummaryProps, { slots }) {
    const collector = inject(tableSummaryCollectorKey, null)

    if (collector) {
      // 把 default slot 引用交给 Table；Table 在 tfoot 内调用渲染。
      // 一次性注册即可：slot 函数在 Table 渲染时调用，自行捕获父作用域响应式。
      collector.setSummary(slots.default ?? null)
      onBeforeUnmount(() => collector.setSummary(null))
    }
    // 脱离 <c-table> 父级时静默渲染 null。

    // 标记 fixed 用法保留，未来 sticky 落地时复用。
    void props.fixed

    return () => null
  },
})
