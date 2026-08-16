import type { ExtractPropTypes, PropType } from 'vue'
import type { TableSummaryFixed } from '../../table/src/table-types'

/**
 * 表格汇总行：在表格底部渲染 `<tfoot>` 汇总区。
 *
 * 用法：
 *
 * ```html
 * <c-table :data-source="data">
 *   <c-table-column title="名称" data-index="name" />
 *   <c-table-column title="数量" data-index="qty" />
 *   <c-table-summary>
 *     <tr>
 *       <td>合计</td>
 *       <td>{{ total }}</td>
 *     </tr>
 *   </c-table-summary>
 * </c-table>
 * ```
 *
 * `fixed` 控制汇总行是否在垂直滚动时贴顶或贴底；`true` 等同于 `'bottom'`，
 * 真实粘性效果依赖 Table 的 `scroll.y` 容器。
 */
export const tableSummaryProps = {
  fixed: {
    type: [Boolean, String] as PropType<TableSummaryFixed>,
    default: false,
  },
} as const

export type TableSummaryProps = ExtractPropTypes<typeof tableSummaryProps>
