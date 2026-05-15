import type { ExtractPropTypes, PropType } from 'vue'

/**
 * 对标 ant `Skeleton.Node`：自定义形状的骨架占位容器。
 *
 * default slot 内放任意 VNode，最常见是一个 Icon；本组件提供动画背景 + 居中布局。
 */
export const skeletonNodeProps = {
  active: {
    type: Boolean,
    default: false,
  },
  /** 占位宽度（默认 `'160px'`）。 */
  width: {
    type: [String, Number] as PropType<string | number>,
    default: '160px',
  },
  /** 占位高度（默认 `'96px'`）。 */
  height: {
    type: [String, Number] as PropType<string | number>,
    default: '96px',
  },
} as const

export type SkeletonNodeProps = ExtractPropTypes<typeof skeletonNodeProps>
