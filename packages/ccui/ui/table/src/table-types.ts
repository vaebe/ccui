import type { CSSProperties, ExtractPropTypes, InjectionKey, PropType, Slot, VNodeChild } from 'vue'
import type { CcSemanticClasses, CcSemanticStyles } from '../../shared/hooks/use-semantic'

export type TableRowKey = string | ((record: any, index: number) => string | number)
export type TableSize = 'small' | 'middle' | 'default'
export type TableAlign = 'left' | 'center' | 'right'
export type TableSortOrder = 'ascend' | 'descend' | null
export type TableFilterValue = string | number | boolean
export type TableSelectionType = 'checkbox' | 'radio'
export type TableSelectionKey = string | number

export interface TableFilterOption {
  text: string
  value: TableFilterValue
}

export interface TableCellRenderProps {
  rowSpan?: number
  colSpan?: number
  style?: CSSProperties
  class?: string
}

export interface TableColumn {
  title: string
  dataIndex?: string | Array<string | number>
  key?: string
  width?: string | number
  align?: TableAlign
  fixed?: 'left' | 'right'
  sorter?: boolean | ((a: any, b: any) => number)
  sortOrder?: TableSortOrder
  filters?: TableFilterOption[]
  filteredValue?: TableFilterValue[]
  filterMultiple?: boolean
  customRender?: (scope: { text: any; record: any; index: number; column: TableColumn }) => VNodeChild
  onCell?: (record: any, index: number) => TableCellRenderProps
  onHeaderCell?: (column: TableColumn) => TableCellRenderProps
  /**
   * 列分组：仅当本列由 `<c-table-column-group>` 生成时存在。子列在 tbody 中被展平渲染，
   * 在 thead 中表现为「分组标题 + 子列标题」两行结构。
   */
  children?: TableColumn[]
}

export interface TableSorter {
  column?: TableColumn
  columnKey?: string
  order: TableSortOrder
}

export type TableFilters = Record<string, TableFilterValue[]>

export interface TableRowSelection {
  type?: TableSelectionType
  selectedRowKeys?: TableSelectionKey[]
  defaultSelectedRowKeys?: TableSelectionKey[]
  columnWidth?: string | number
  hideSelectAll?: boolean
  fixed?: boolean
  getCheckboxProps?: (record: any) => {
    disabled?: boolean
    name?: string
  }
  onChange?: (selectedRowKeys: TableSelectionKey[], selectedRows: any[]) => void
  onSelect?: (record: any, selected: boolean, selectedRows: any[]) => void
  onSelectAll?: (selected: boolean, selectedRows: any[], changedRows: any[]) => void
}

export interface TableExpandable {
  expandedRowKeys?: TableSelectionKey[]
  defaultExpandedRowKeys?: TableSelectionKey[]
  defaultExpandAllRows?: boolean
  expandedRowRender?: (record: any, index: number) => VNodeChild
  rowExpandable?: (record: any) => boolean
  columnWidth?: string | number
  fixed?: boolean
  expandRowByClick?: boolean
  onExpand?: (expanded: boolean, record: any) => void
  onChange?: (expandedRowKeys: TableSelectionKey[]) => void
}

export const tableProps = {
  columns: {
    type: Array as PropType<TableColumn[]>,
    default: () => [],
  },
  dataSource: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  rowKey: {
    type: [String, Function] as PropType<TableRowKey>,
    default: 'key',
  },
  bordered: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String as PropType<TableSize>,
    default: 'default',
  },
  rowSelection: {
    type: Object as PropType<TableRowSelection>,
    default: undefined,
  },
  expandable: {
    type: Object as PropType<TableExpandable>,
    default: undefined,
  },
  scroll: {
    type: Object as PropType<{ x?: string | number; y?: string | number }>,
    default: undefined,
  },
  // 树形数据子节点字段名
  childrenColumnName: {
    type: String,
    default: 'children',
  },
  // 树形数据缩进宽度（px）
  indentSize: {
    type: Number,
    default: 15,
  },
  /**
   * 语义化 DOM className 注入。可用 key：`root` / `header` / `body` / `row`。
   */
  classNames: {
    type: Object as PropType<CcSemanticClasses>,
    default: undefined,
  },
  /**
   * 语义化 DOM style 注入。可用 key 与 classNames 一致。
   */
  styles: {
    type: Object as PropType<CcSemanticStyles>,
    default: undefined,
  },
} as const

export type TableProps = ExtractPropTypes<typeof tableProps>

/**
 * 模板式列收集器：`<c-table-column>` / `<c-table-column-group>` 在挂载时把列定义
 * 注册到父 Table；卸载时清理。同一 Table 实例下的子列共享一个收集器。
 *
 * 与 `columns` prop 互斥：`columns` 非空时优先用 prop，否则用收集到的列。
 */
export interface TableColumnsCollector {
  register: (id: symbol, column: TableColumn, order: number) => void
  unregister: (id: symbol) => void
}

export const tableColumnsCollectorKey = Symbol('TableColumnsCollector') as InjectionKey<TableColumnsCollector>

/**
 * 全局单调递增列序号：`<c-table-column>` 与 `<c-table-column-group>` 共享同一计数器，
 * 保证顶层列与分组在同一 order 序列内排序，分组内子列同样按全局序号排序。
 * order 只需全局单调，无需重置。
 */
let columnOrderSeq = 0
export function nextColumnOrder(): number {
  return ++columnOrderSeq
}

/**
 * ColumnGroup 子作用域收集器：内部 `<c-table-column>` 注册到 group，而非 root Table。
 */
export interface TableColumnGroupCollector {
  register: (id: symbol, column: TableColumn, order: number) => void
  unregister: (id: symbol) => void
}

export const tableColumnGroupCollectorKey = Symbol(
  'TableColumnGroupCollector',
) as InjectionKey<TableColumnGroupCollector>

/**
 * Summary slot 注入容器：`<c-table-summary>` 通过此 key 把 default slot 暴露给父 Table 渲染到 tfoot。
 */
export interface TableSummaryCollector {
  setSummary: (slot: Slot | null) => void
}

export const tableSummaryCollectorKey = Symbol('TableSummaryCollector') as InjectionKey<TableSummaryCollector>
