import type { ExtractPropTypes, PropType } from 'vue'

export type SkeletonAvatarSize = 'large' | 'default' | 'small' | number
export type SkeletonAvatarShape = 'circle' | 'square'

/**
 * 对标 ant `Skeleton.Avatar`：头像形态的骨架占位。
 */
export const skeletonAvatarProps = {
  active: {
    type: Boolean,
    default: false,
  },
  /** 尺寸：`'large' | 'default' | 'small' | number(px)`。 */
  size: {
    type: [String, Number] as PropType<SkeletonAvatarSize>,
    default: 'default',
  },
  /** 形态：`circle` 圆形；`square` 方形。 */
  shape: {
    type: String as PropType<SkeletonAvatarShape>,
    default: 'circle',
  },
} as const

export type SkeletonAvatarProps = ExtractPropTypes<typeof skeletonAvatarProps>
