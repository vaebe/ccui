import type { ExtractPropTypes, PropType } from 'vue'

export type DescriptionsSize = 'small' | 'middle' | 'default'
export type DescriptionsLayout = 'horizontal' | 'vertical'

export interface DescriptionsItem {
  label?: string
  value?: string | number
  span?: number
  labelStyle?: Record<string, string | number>
  contentStyle?: Record<string, string | number>
}

export const descriptionsProps = {
  title: {
    type: String,
    default: '',
  },
  extra: {
    type: String,
    default: '',
  },
  bordered: {
    type: Boolean,
    default: false,
  },
  column: {
    type: Number,
    default: 3,
  },
  size: {
    type: String as PropType<DescriptionsSize>,
    default: 'default',
  },
  layout: {
    type: String as PropType<DescriptionsLayout>,
    default: 'horizontal',
  },
  colon: {
    type: Boolean,
    default: true,
  },
  items: {
    type: Array as PropType<DescriptionsItem[]>,
    default: undefined,
  },
} as const

export type DescriptionsProps = ExtractPropTypes<typeof descriptionsProps>

export const descriptionsItemProps = {
  label: {
    type: String,
    default: '',
  },
  span: {
    type: Number,
    default: 1,
  },
  labelStyle: {
    type: Object as PropType<Record<string, string | number>>,
    default: undefined,
  },
  contentStyle: {
    type: Object as PropType<Record<string, string | number>>,
    default: undefined,
  },
} as const

export type DescriptionsItemProps = ExtractPropTypes<typeof descriptionsItemProps>
