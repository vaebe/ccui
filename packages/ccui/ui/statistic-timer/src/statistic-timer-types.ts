import type { CSSProperties, ExtractPropTypes, PropType } from 'vue'

export type StatisticTimerType = 'countdown' | 'countup'

/**
 * 对标 ant `Statistic.Timer`：基于时间戳的双向计时器。
 *
 * - `type: 'countdown'`：从 `value`（目标时间戳）倒计时到 0。归 0 时 emit `finish`。
 * - `type: 'countup'`：从 `value`（起始时间戳）开始正数计时（无终止）。
 *
 * 与现有 `<c-statistic-countdown>` 的关系：StatisticTimer 是 Countdown 的上位替代，**不直接 deprecate**
 * `StatisticCountdown`（保留为兼容层），新项目推荐用 StatisticTimer 统一表达倒/正计时。
 *
 * **不挂 Statistic.Timer 静态属性**，平铺独立顶层组件。
 */
export const statisticTimerProps = {
  /**
   * 计时方向：
   *
   * - `'countdown'`：倒计时到 0
   * - `'countup'`：正计时（无终止）
   */
  type: {
    type: String as PropType<StatisticTimerType>,
    default: 'countdown',
  },
  /**
   * 目标 / 起始时间戳。接 number（ms）/ string（任意 Date.parse 兼容格式）/ Date 实例。
   */
  value: {
    type: [Number, String, Date] as PropType<number | string | Date>,
    default: 0,
  },
  /**
   * 格式化字符串，支持 `D / DD / H / HH / m / mm / s / ss / SSS` token。
   * 默认 `'HH:mm:ss'`。
   */
  format: {
    type: String,
    default: 'HH:mm:ss',
  },
  title: {
    type: String,
    default: '',
  },
  prefix: {
    type: String,
    default: '',
  },
  suffix: {
    type: String,
    default: '',
  },
  valueStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({}),
  },
} as const

export type StatisticTimerProps = ExtractPropTypes<typeof statisticTimerProps>
