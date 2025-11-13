import type { Component, ExtractPropTypes, PropType } from 'vue'

// Timeline 主组件的 props
export const timelineProps = {
  // 暂时没有特殊的 props，主要通过插槽传递 TimelineItem
} as const

export type TimelineProps = ExtractPropTypes<typeof timelineProps>

export type TimelineItemType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | ''

// TimelineItem 组件的 props
export const timelineItemProps = {
  /**
   * 时间戳内容
   */
  timestamp: {
    type: String,
    default: '',
  },
  /**
   * 是否隐藏时间戳
   */
  hideTimestamp: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否垂直居中
   */
  center: {
    type: Boolean,
    default: false,
  },
  /**
   * 时间戳位置
   */
  placement: {
    type: String as PropType<'top' | 'bottom'>,
    default: 'bottom',
    validator: (value: string) => ['top', 'bottom'].includes(value),
  },
  /**
   * 节点类型
   */
  type: {
    type: String as PropType<TimelineItemType>,
    default: '',
    validator: (value: string) => ['primary', 'success', 'warning', 'danger', 'info', ''].includes(value),
  },
  /**
   * 节点颜色
   */
  color: {
    type: String,
    default: '',
  },
  /**
   * 节点尺寸
   */
  size: {
    type: String as PropType<'normal' | 'large'>,
    default: 'normal',
    validator: (value: string) => ['normal', 'large'].includes(value),
  },
  /**
   * 自定义图标
   */
  icon: {
    type: [String, Object] as PropType<string | Component>,
  },
  /**
   * 是否空心点
   */
  hollow: {
    type: Boolean,
    default: false,
  },
} as const

export type TimelineItemProps = ExtractPropTypes<typeof timelineItemProps>
