import type { CSSProperties, ExtractPropTypes, PropType, VNodeChild } from 'vue'

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
}

export interface TablePaginationConfig {
  current?: number
  pageSize?: number
  total?: number
  showSizeChanger?: boolean
  pageSizeOptions?: number[]
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
  pagination: {
    type: [Boolean, Object] as PropType<boolean | TablePaginationConfig>,
    default: false,
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
} as const

export type TableProps = ExtractPropTypes<typeof tableProps>
