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
  /** 边框 / 光带粗细（number 视为 px） */
  borderWidth: {
    type: [Number, String] as PropType<number | string>,
    default: 1,
  },
  /** 容器圆角（number 视为 px）；asChild 时不传则继承目标元素 */
  borderRadius: {
    type: [Number, String] as PropType<number | string>,
    default: 8,
  },
  /** 流光渐变层边长，同时控制拐角处的平滑转弯半径（number 视为 px） */
  size: {
    type: [Number, String] as PropType<number | string>,
    default: 100,
  },
  /** 跑完一圈的时长（秒） */
  duration: {
    type: Number,
    default: 6,
  },
  /** 同时显示的流光数量，动画会均匀错开 */
  count: {
    type: Number,
    default: 1,
  },
  /** 是否移除包装层，并把流光层挂载到唯一的默认插槽元素中 */
  asChild: {
    type: Boolean,
    default: false,
  },
} as const

export type BorderBeamProps = ExtractPropTypes<typeof borderBeamProps>
