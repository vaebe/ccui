import type { ExtractPropTypes, PropType } from 'vue'

export type SkeletonInputSize = 'large' | 'default' | 'small'

/**
 * 对标 ant `Skeleton.Input`：输入框形态的骨架占位。
 */
export const skeletonInputProps = {
  active: {
    type: Boolean,
    default: false,
  },
  block: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<SkeletonInputSize>,
    default: 'default',
  },
} as const

export type SkeletonInputProps = ExtractPropTypes<typeof skeletonInputProps>
