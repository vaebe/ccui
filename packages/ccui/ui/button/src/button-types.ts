import type { PropType, ExtractPropTypes } from 'vue';

export const buttonProps = {
  type: {
    type: String as PropType<
      'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
    >,
    default: ''
  },
  size: {
    type: String as PropType<'large' | 'default' | 'small'>,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  plain: {
    type: Boolean,
    default: false
  },
  round: {
    type: Boolean,
    default: false
  },
  circle: {
    type: Boolean,
    default: false
  },
  autofocus: {
    type: Boolean,
    default: false
  },
  nativeType: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button'
  }
} as const;

export type ButtonProps = ExtractPropTypes<typeof buttonProps>;
