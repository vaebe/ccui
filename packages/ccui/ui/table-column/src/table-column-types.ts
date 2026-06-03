import type { ExtractPropTypes, PropType, VNodeChild } from 'vue'
import type {
  TableAlign,
  TableCellRenderProps,
  TableColumn,
  TableFilterOption,
  TableFilterValue,
  TableSortOrder,
} from '../../table/src/table-types'

/**
 * 模板式表格列声明，作为 `<c-table>` 的子组件出现，
 * 在挂载阶段通过 provide/inject 把列定义注册回父 Table；本组件自身不渲染 DOM。
 *
 * 与 `<c-table :columns="...">` 数组式声明互斥（数组优先；都传时数组胜出）。
 */
export const tableColumnProps = {
  title: {
    type: String,
    default: '',
  },
  dataIndex: {
    type: [String, Array] as PropType<string | Array<string | number>>,
    default: undefined,
  },
  columnKey: {
    type: String,
    default: undefined,
  },
  width: {
    type: [String, Number] as PropType<string | number>,
    default: undefined,
  },
  align: {
    type: String as PropType<TableAlign>,
    default: undefined,
  },
  fixed: {
    type: String as PropType<'left' | 'right'>,
    default: undefined,
  },
  sorter: {
    type: [Boolean, Function] as PropType<boolean | ((a: any, b: any) => number)>,
    default: undefined,
  },
  sortOrder: {
    type: String as PropType<TableSortOrder>,
    default: undefined,
  },
  filters: {
    type: Array as PropType<TableFilterOption[]>,
    default: undefined,
  },
  filteredValue: {
    type: Array as PropType<TableFilterValue[]>,
    default: undefined,
  },
  filterMultiple: {
    type: Boolean,
    default: undefined,
  },
  /**
   * 函数式自定义渲染。若同时提供 `customRender` slot（scoped），slot 优先。
   */
  customRender: {
    type: Function as PropType<(scope: { text: any; record: any; index: number; column: TableColumn }) => VNodeChild>,
    default: undefined,
  },
  onCell: {
    type: Function as PropType<(record: any, index: number) => TableCellRenderProps>,
    default: undefined,
  },
  onHeaderCell: {
    type: Function as PropType<(column: TableColumn) => TableCellRenderProps>,
    default: undefined,
  },
} as const

export type TableColumnProps = ExtractPropTypes<typeof tableColumnProps>
