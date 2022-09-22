import { ExtractPropTypes, PropType } from 'vue';

export const tabProps = {
  label: {
    type: [String, Number] as PropType<string | number>,
    default: null
  },
  name: {
    type: String,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  }
} as const;

export type TabProps = ExtractPropTypes<typeof tabProps>;
