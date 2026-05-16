import type { ExtractPropTypes, PropType } from 'vue'

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
 * `fixed` 控制汇总行是否在垂直滚动时贴底（保留位置）。当前实现把它透传到 SCSS class，
 * 真实粘性效果依赖容器 `scroll.y`。
 */
export const tableSummaryProps = {
  fixed: {
    type: [Boolean, String] as PropType<boolean | 'top' | 'bottom'>,
    default: false,
  },
} as const

export type TableSummaryProps = ExtractPropTypes<typeof tableSummaryProps>
