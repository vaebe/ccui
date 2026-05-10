import type { ExtractPropTypes } from 'vue'

export const emptyProps = {
  // 默认从 ConfigProvider.locale.Empty.description 取值（'暂无数据' / 'No data'）；
  // 显式传 description 仍优先。
  description: {
    type: String,
    default: '',
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
