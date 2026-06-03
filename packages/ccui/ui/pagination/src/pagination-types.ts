import type { ExtractPropTypes, PropType } from 'vue'

export type PaginationSize = 'small' | 'default'

export const paginationProps = {
  current: {
    type: Number,
    default: 1,
  },
  total: {
    type: Number,
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  pageSizeOptions: {
    type: Array as PropType<number[]>,
    default: () => [10, 20, 50, 100],
  },
  showSizeChanger: {
    type: Boolean,
    default: false,
  },
  showQuickJumper: {
    type: Boolean,
    default: false,
  },
  showTotal: {
    type: [Boolean, Function] as PropType<boolean | ((total: number, range: [number, number]) => string)>,
    default: false,
  },
  simple: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hideOnSinglePage: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<PaginationSize>,
    default: 'default',
  },
} as const

export type PaginationProps = ExtractPropTypes<typeof paginationProps>
