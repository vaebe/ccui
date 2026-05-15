import type { CSSProperties, ExtractPropTypes, PropType } from 'vue'

/**
 * 对标 ant `Card.Grid`：卡片内格栅子项。
 *
 * - `hoverable`（默认 true）：hover 阴影
 * - `colSpan` 1~24：占 grid 列数；默认无（自由按 inline-block 33% 排列，与 ant 一致）
 */
export const cardGridProps = {
  hoverable: {
    type: Boolean,
    default: true,
  },
  /**
   * 占据列数（1-24）。不传则默认 1/3 宽。
   */
  colSpan: {
    type: Number,
    default: undefined,
  },
  /**
   * 内边距，默认 24px（与 ant 一致）。
   */
  bodyStyle: {
    type: Object as PropType<CSSProperties>,
    default: undefined,
  },
} as const

export type CardGridProps = ExtractPropTypes<typeof cardGridProps>
