import { ExtractPropTypes, PropType } from 'vue';

export type LabelType = string | number;
export type NameType = string | number;

export const tabProps = {
  label: {
    type: [String, Number] as PropType<LabelType>,
    default: null
  },
  name: {
    type: [String, Number] as PropType<NameType>,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  }
} as const;

export type TabProps = ExtractPropTypes<typeof tabProps>;
