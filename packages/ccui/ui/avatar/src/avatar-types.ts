import type { ExtractPropTypes, PropType } from 'vue'
import type { CcSemanticClasses, CcSemanticStyles } from '../../shared/hooks/use-semantic'

export type FitType = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
export type GenderType = 'male' | 'female' | (string & {})

export const avatarProps = {
  name: {
    type: String,
    default: null,
  },
  gender: {
    type: String as PropType<GenderType>,
    default: null,
  },
  width: {
    type: Number,
    default: 36,
  },
  height: {
    type: Number,
    default: 36,
  },
  isRound: {
    type: Boolean,
    default: true,
  },
  imgSrc: {
    type: String,
    default: '',
  },
  customText: {
    type: String,
    default: null,
  },
  fit: {
    type: String as PropType<FitType>,
    default: 'cover',
  },
  /**
   * Ant Design v5.18+ 语义化 DOM className 注入（M-A2）。可用 key：`root` / `image` / `text`。
   */
  classNames: {
    type: Object as PropType<CcSemanticClasses>,
    default: undefined,
  },
  /**
   * Ant Design v5.18+ 语义化 DOM style 注入（M-A2）。可用 key 与 classNames 一致。
   */
  styles: {
    type: Object as PropType<CcSemanticStyles>,
    default: undefined,
  },
} as const

export type AvatarProps = ExtractPropTypes<typeof avatarProps>
