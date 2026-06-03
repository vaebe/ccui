import type { ExtractPropTypes, PropType } from 'vue'

export type ResultStatus = 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500'

export const resultProps = {
  status: {
    type: String as PropType<ResultStatus>,
    default: 'info',
  },
  title: {
    type: String,
    default: '',
  },
  subTitle: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
} as const

export type ResultProps = ExtractPropTypes<typeof resultProps>
