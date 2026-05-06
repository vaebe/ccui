import type { ExtractPropTypes, PropType, VNodeChild } from 'vue'

export type TableRowKey = string | ((record: any, index: number) => string | number)
export type TableSize = 'small' | 'middle' | 'default'
export type TableAlign = 'left' | 'center' | 'right'
export type TableSortOrder = 'ascend' | 'descend' | null
export type TableFilterValue = string | number | boolean

export interface TableFilterOption {
  text: string
  value: TableFilterValue
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
} as const

export type TableProps = ExtractPropTypes<typeof tableProps>
