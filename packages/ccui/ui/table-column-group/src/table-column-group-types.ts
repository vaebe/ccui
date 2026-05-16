import type { ExtractPropTypes, PropType } from 'vue'
import type { TableCellRenderProps, TableColumn } from '../../table/src/table-types'

/**
 * 表格列分组：在 thead 多生成一行「分组标题」，子列在 tbody 中被展平。
 *
 * 模板用法：
 *
 * ```html
 * <c-table :data-source="data">
 *   <c-table-column-group title="姓名">
 *     <c-table-column title="姓" data-index="firstName" />
 *     <c-table-column title="名" data-index="lastName" />
 *   </c-table-column-group>
 *   <c-table-column title="年龄" data-index="age" />
 * </c-table>
 * ```
 */
export const tableColumnGroupProps = {
  title: {
    type: String,
    default: '',
  },
  align: {
    type: String as PropType<'left' | 'center' | 'right'>,
    default: undefined,
  },
  fixed: {
    type: String as PropType<'left' | 'right'>,
    default: undefined,
  },
  onHeaderCell: {
    type: Function as PropType<(column: TableColumn) => TableCellRenderProps>,
    default: undefined,
  },
} as const

export type TableColumnGroupProps = ExtractPropTypes<typeof tableColumnGroupProps>
