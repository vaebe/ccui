import { ExtractPropTypes, PropType } from 'vue';

export const rateProps = {
  modelValue: {
    type: Number,
    default: 0
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  count: {
    type: Number,
    default: 5
  },
  color: {
    type: String,
    default: ''
  },
  allowHalf: {
    type: Boolean,
    default: false
  },
  onChange: {
    type: Function as PropType<(value: number) => void>,
    default: undefined
  },
  onTouched: {
    type: Function as PropType<() => void>,
    default: undefined
  }
} as const;

export type RateProps = ExtractPropTypes<typeof rateProps>;
