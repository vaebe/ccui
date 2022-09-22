import type { PropType, ExtractPropTypes } from 'vue';

export const dividerProps = {
  direction: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: 'horizontal'
  },
  color: {
    type: String,
    default: ''
  },
  borderStyle: {
    type: String as PropType<'dashed' | 'solid'>,
    default: 'solid'
  },
  contentPosition: {
    type: String as PropType<'left' | 'right' | 'center'>,
    default: 'center'
  },
  contentColor: {
    type: String,
    default: ''
  },
  contentBackgroundColor: {
    type: String,
    default: ''
  }
} as const;

export type DividerProps = ExtractPropTypes<typeof dividerProps>;
