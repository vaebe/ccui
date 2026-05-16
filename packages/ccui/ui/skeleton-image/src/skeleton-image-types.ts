import type { ExtractPropTypes } from 'vue'

/**
 * 对标 ant `Skeleton.Image`：图片形态的骨架占位（带内置图片图标）。
 */
export const skeletonImageProps = {
  /** 是否启用动画。 */
  active: {
    type: Boolean,
    default: false,
  },
} as const

export type SkeletonImageProps = ExtractPropTypes<typeof skeletonImageProps>
