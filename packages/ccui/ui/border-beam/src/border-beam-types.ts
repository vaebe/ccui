import type { ExtractPropTypes, PropType } from 'vue'

export interface BorderBeamColorStop {
  /** 颜色值，支持任意 CSS 颜色 */
  color: string
  /** 渐变停靠位置，取值 0 ~ 100 */
  percent: number
}

export type BorderBeamColor = string | BorderBeamColorStop[]

/** 用户传入的 0~100 停靠点会被映射进光带前 70%，预留尾段做淡出 */
export const MAX_BEAM_COLOR_STOP_PERCENT = 70

export const borderBeamProps = {
  /** 流光颜色，单色字符串或渐变停靠点数组；不传时使用主题主色渐变 */
  color: {
    type: [String, Array] as PropType<BorderBeamColor>,
    default: undefined,
  },
  /** 流光层相对容器边缘的外扩距离（number 视为 px） */
  outset: {
    type: [Number, String] as PropType<number | string>,
    default: 0,
  },
  /** 边框 / 光带粗细（px） */
  borderWidth: {
    type: Number,
    default: 1,
  },
  /** 容器圆角（px），与被包裹内容保持一致即可严丝合缝 */
  borderRadius: {
    type: Number,
    default: 8,
  },
  /** 跑完一圈的时长（秒） */
  duration: {
    type: Number,
    default: 6,
  },
} as const

export type BorderBeamProps = ExtractPropTypes<typeof borderBeamProps>
