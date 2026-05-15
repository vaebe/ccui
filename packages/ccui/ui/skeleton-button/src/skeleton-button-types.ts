import type { ExtractPropTypes, PropType } from 'vue'

export type SkeletonButtonSize = 'large' | 'default' | 'small'
export type SkeletonButtonShape = 'default' | 'circle' | 'round' | 'square'

/**
 * 对标 ant `Skeleton.Button`：按钮形态的骨架占位。
 */
export const skeletonButtonProps = {
  /** 是否启用动画。 */
  active: {
    type: Boolean,
    default: false,
  },
  /** 是否撑满父容器宽度。 */
  block: {
    type: Boolean,
    default: false,
  },
  /** 尺寸（与 `<c-button>` size 对齐）。 */
  size: {
    type: String as PropType<SkeletonButtonSize>,
    default: 'default',
  },
  /** 形态。`circle` 圆形；`round` 大圆角；`square` 直角；`default` 默认圆角。 */
  shape: {
    type: String as PropType<SkeletonButtonShape>,
    default: 'default',
  },
} as const

export type SkeletonButtonProps = ExtractPropTypes<typeof skeletonButtonProps>
