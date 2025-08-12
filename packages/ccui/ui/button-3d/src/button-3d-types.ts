import type { ExtractPropTypes, PropType } from 'vue'

export type Button3DType = | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type Button3DSizeType = 'large' | 'default' | 'small'
export type Button3DNativeType = 'button' | 'submit' | 'reset'

export const button3dProps = {
  size: {
    type: String as PropType<Button3DSizeType>,
    default: '',
  },
  type: {
    type: String as PropType<Button3DType>,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  nativeType: {
    type: String as PropType<Button3DNativeType>,
    default: 'button',
  },
} as const

export type Button3dProps = ExtractPropTypes<typeof button3dProps>
