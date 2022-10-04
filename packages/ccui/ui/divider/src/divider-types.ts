import type { PropType, ExtractPropTypes } from 'vue';

export type DirectionType = 'horizontal' | 'vertical';
export type BorderStyleType = 'dashed' | 'solid';
export type ContentPositionType = 'left' | 'right' | 'center';

export const dividerProps = {
  direction: {
    type: String as PropType<DirectionType>,
    default: 'horizontal'
  },
  color: {
    type: String,
    default: ''
  },
  borderStyle: {
    type: String as PropType<BorderStyleType>,
    default: 'solid'
  },
  contentPosition: {
    type: String as PropType<ContentPositionType>,
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
