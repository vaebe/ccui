import type { ExtractPropTypes } from 'vue'

export const emptyProps = {
  description: {
    type: String,
    default: '暂无数据',
  },
  image: {
    type: String,
    default: '',
  },
  imageStyle: {
    type: Object,
    default: () => ({}),
  },
} as const

export type EmptyProps = ExtractPropTypes<typeof emptyProps>
