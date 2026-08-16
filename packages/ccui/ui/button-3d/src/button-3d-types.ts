import type { ExtractPropTypes, PropType } from 'vue'

/** 空字符串表示不添加色型 modifier，使用默认灰色 3D 基态。 */
export type Button3DType = '' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
/** 空字符串表示不添加尺寸 modifier，使用组件默认高度与字号。 */
export type Button3DSizeType = '' | 'large' | 'default' | 'small'
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
