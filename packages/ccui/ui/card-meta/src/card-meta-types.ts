import type { ExtractPropTypes } from 'vue'

/**
 * 卡片元信息组件：
 *
 * - `title` / `description` 两段文字
 * - `avatar` slot 左侧 64×64 头像
 * - 三段都可用 slot 替换
 */
export const cardMetaProps = {
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
} as const

export type CardMetaProps = ExtractPropTypes<typeof cardMetaProps>
