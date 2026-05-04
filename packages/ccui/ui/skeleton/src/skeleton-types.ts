import type { ExtractPropTypes, PropType } from 'vue'

export interface SkeletonAvatarShape { shape?: 'circle' | 'square', size?: 'small' | 'default' | 'large' | number }
export interface SkeletonTitleShape { width?: string | number }
export interface SkeletonParagraphShape { rows?: number, width?: string | number | (string | number)[] }

export const skeletonProps = {
  active: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: true,
  },
  avatar: {
    type: [Boolean, Object] as PropType<boolean | SkeletonAvatarShape>,
    default: false,
  },
  title: {
    type: [Boolean, Object] as PropType<boolean | SkeletonTitleShape>,
    default: true,
  },
  paragraph: {
    type: [Boolean, Object] as PropType<boolean | SkeletonParagraphShape>,
    default: true,
  },
  round: {
    type: Boolean,
    default: false,
  },
} as const

export type SkeletonProps = ExtractPropTypes<typeof skeletonProps>
