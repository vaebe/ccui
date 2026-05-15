import type { ExtractPropTypes } from 'vue'

/**
 * 对标 ant `List.Item.Meta`：
 *
 * - `avatar` slot 左侧头像
 * - `title` / `description` 二段文字（prop 或 slot，slot 优先）
 *
 * 与 `<c-list-item>` 内嵌的 avatar/title/description slot 共享同一 DOM 结构 +
 * 同一组 SCSS 类名，两种写法可二选一。本组件用于贴近 ant 模板写法：
 *
 * ```html
 * <c-list-item>
 *   <c-list-item-meta avatar="..." title="..." description="..." />
 * </c-list-item>
 * ```
 */
export const listItemMetaProps = {
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
} as const

export type ListItemMetaProps = ExtractPropTypes<typeof listItemMetaProps>
