import type { ExtractPropTypes, PropType } from 'vue'

export type SpaceCompactDirection = 'horizontal' | 'vertical'
export type SpaceCompactSize = 'large' | 'middle' | 'small'

/**
 * 让多个输入类组件（Input / Button / Select / DatePicker 等）视觉上贴边拼接为一组紧凑控件，
 * **子组件之间的圆角与 border 自动合并**。
 *
 * 作为独立顶层组件 `<c-space-compact>`，不挂 Space.Compact 命名空间。
 */
export const spaceCompactProps = {
  /** 紧凑布局方向。 */
  direction: {
    type: String as PropType<SpaceCompactDirection>,
    default: 'horizontal',
  },
  /** 控件尺寸（透传到子项）。 */
  size: {
    type: String as PropType<SpaceCompactSize>,
    default: 'middle',
  },
  /** 是否撑满父容器宽度。 */
  block: {
    type: Boolean,
    default: false,
  },
} as const

export type SpaceCompactProps = ExtractPropTypes<typeof spaceCompactProps>
