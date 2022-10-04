import { ExtractPropTypes, PropType } from 'vue';

export type OnChangeType = (value: number) => void;
export type OnTouchedType = () => void;
export const rateProps = {
  modelValue: {
    type: Number,
    default: 0
  },
  // todo 替换为 disabled
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
    type: Function as PropType<OnChangeType>,
    default: undefined
  },
  onTouched: {
    type: Function as PropType<OnTouchedType>,
    default: undefined
  }
} as const;

export type RateProps = ExtractPropTypes<typeof rateProps>;
