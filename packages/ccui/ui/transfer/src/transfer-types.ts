import type { ExtractPropTypes, PropType } from 'vue'

export type TransferDirection = 'left' | 'right'

export interface TransferItem {
  key: string
  title?: string
  description?: string
  disabled?: boolean
  [extra: string]: unknown
}

export interface TransferLocale {
  itemUnit?: string
  itemsUnit?: string
  notFoundContent?: string
  searchPlaceholder?: string
}

export type TransferRender = (item: TransferItem) => unknown

export const transferProps = {
  dataSource: {
    type: Array as PropType<TransferItem[]>,
    default: () => [],
  },
  // 在右侧（target）展示的 key 集合，支持 v-model:targetKeys
  targetKeys: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  // 跨两列勾选的 key 集合，支持 v-model:selectedKeys
  selectedKeys: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  titles: {
    type: Array as unknown as PropType<[string, string]>,
    default: () => ['', ''],
  },
  // 操作按钮文案：[右移, 左移]
  operations: {
    type: Array as unknown as PropType<[string, string]>,
    default: () => ['>', '<'],
  },
  showSearch: {
    type: Boolean,
    default: false,
  },
  filterOption: {
    type: Function as PropType<(input: string, item: TransferItem) => boolean>,
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  render: {
    type: Function as PropType<TransferRender>,
    default: undefined,
  },
  locale: {
    type: Object as PropType<TransferLocale>,
    default: () => ({}),
  },
} as const

export type TransferProps = ExtractPropTypes<typeof transferProps>

export const DEFAULT_LOCALE: Required<TransferLocale> = {
  itemUnit: '项',
  itemsUnit: '项',
  notFoundContent: '列表为空',
  searchPlaceholder: '请输入搜索内容',
}
