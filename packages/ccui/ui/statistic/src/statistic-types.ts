import type { ExtractPropTypes, PropType } from 'vue'

export type StatisticValueStyle = 'number' | 'countdown'

export const statisticProps = {
  title: {
    type: String,
    default: '',
  },
  value: {
    type: [Number, String] as PropType<number | string>,
    default: 0,
  },
  precision: {
    type: Number,
    default: undefined,
  },
  prefix: {
    type: String,
    default: '',
  },
  suffix: {
    type: String,
    default: '',
  },
  groupSeparator: {
    type: String,
    default: ',',
  },
  decimalSeparator: {
    type: String,
    default: '.',
  },
  valueStyle: {
    type: Object as PropType<Record<string, string | number>>,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
} as const

export type StatisticProps = ExtractPropTypes<typeof statisticProps>

export const statisticCountdownProps = {
  title: {
    type: String,
    default: '',
  },
  value: {
    type: [Number, String, Date] as PropType<number | string | Date>,
    default: 0,
  },
  format: {
    type: String,
    default: 'HH:mm:ss',
  },
  prefix: {
    type: String,
    default: '',
  },
  suffix: {
    type: String,
    default: '',
  },
  valueStyle: {
    type: Object as PropType<Record<string, string | number>>,
    default: () => ({}),
  },
} as const

export type StatisticCountdownProps = ExtractPropTypes<typeof statisticCountdownProps>
