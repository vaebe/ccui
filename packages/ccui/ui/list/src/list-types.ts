import type { ExtractPropTypes, PropType } from 'vue'

export type ListSize = 'large' | 'default' | 'small'
export type ListLayout = 'horizontal' | 'vertical'

export const listProps = {
  dataSource: {
    type: Array as PropType<unknown[]>,
    default: () => [],
  },
  bordered: {
    type: Boolean,
    default: false,
  },
  split: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String as PropType<ListSize>,
    default: 'default' as ListSize,
  },
  layout: {
    type: String as PropType<ListLayout>,
    default: 'horizontal' as ListLayout,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  itemLayout: {
    type: String as PropType<ListLayout>,
    default: 'horizontal' as ListLayout,
  },
  rowKey: {
    type: [String, Function] as PropType<string | ((item: unknown, index: number) => string | number)>,
    default: undefined,
  },
} as const

export type ListProps = ExtractPropTypes<typeof listProps>

export const listItemProps = {
  // List.Item 接受任意结构
} as const

export type ListItemProps = ExtractPropTypes<typeof listItemProps>
