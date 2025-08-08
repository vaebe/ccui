import type { ExtractPropTypes, PropType } from 'vue'

export type IButtonType = 'primary' | 'secondary' | 'text'
export type IButtonSize = 'large' | 'medium' | 'small'

export const button3dProps = {
  size: {
    type: String as PropType<IButtonSize>,
    default: 'medium',
  },
  type: {
    type: String as PropType<IButtonType>,
    default: 'primary',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
} as const

export type Button3dProps = ExtractPropTypes<typeof button3dProps>
