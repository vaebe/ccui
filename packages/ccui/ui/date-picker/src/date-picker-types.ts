import type { Dayjs } from 'dayjs'
import type { ExtractPropTypes, PropType, VNode } from 'vue'
import type { DateValue } from '../../shared/utils/date'

export type DatePickerSize = 'large' | 'default' | 'small'
export type DatePickerStatus = '' | 'error' | 'warning' | 'success' | 'validating'
export type DatePickerPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
export type DatePickerType = 'date' | 'week' | 'month' | 'year' | 'quarter'
export type DisabledDate = (current: Dayjs) => boolean
export type GetPopupContainer = (triggerNode: HTMLElement | null) => HTMLElement | null
export type DateOutputFormat = 'string' | 'date' | 'number'

// 预设项。label / value 可传函数延迟求值（例如「今天」需要每次重算）。
export interface PresetItem {
  label: string | (() => string)
  value: DateValue | (() => DateValue)
}

// showTime 配置项。boolean 形式等价于 showTime: {}，使用全部默认值。
export interface TimeShowConfig {
  /** 时间部分格式，默认 'HH:mm:ss'。仅含 H/h:m 时省略秒列。 */
  format?: string
  /** 初始时间，未指定时新选日期的时间部分按已存在 pending 或 0:0:0 起步。 */
  defaultValue?: DateValue
  hourStep?: number
  minuteStep?: number
  secondStep?: number
  disabledHours?: () => number[]
  disabledMinutes?: () => number[]
  disabledSeconds?: () => number[]
  /** true 时把 disabled 的时间值从列表中剔除；默认 false（保留并打 disabled 标记）。 */
  hideDisabledOptions?: boolean
}

// picker 不同模式下，未显式设置 format 时的兜底显示/解析格式。
export const DEFAULT_FORMAT_BY_PICKER: Record<DatePickerType, string> = {
  date: 'YYYY-MM-DD',
  week: 'YYYY-MM-DD',
  month: 'YYYY-MM',
  year: 'YYYY',
  quarter: 'YYYY-[Q]Q',
}

export const DEFAULT_TIME_FORMAT = 'HH:mm:ss'

export const datePickerProps = {
  modelValue: {
    type: [String, Number, Date, Object] as PropType<DateValue>,
    default: undefined,
  },
  // 选择粒度：date 日 / week 周 / month 月 / year 年 / quarter 季度。
  picker: {
    type: String as PropType<DatePickerType>,
    default: 'date',
  },
  // 空串表示走 DEFAULT_FORMAT_BY_PICKER 的兜底；显式传值优先。
  format: {
    type: String,
    default: '',
  },
  // v-model 输出形态：'string' 按 format 输出；'date' 输出原生 Date；'number' 输出毫秒时间戳。
  valueFormat: {
    type: String as PropType<DateOutputFormat>,
    default: 'string',
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  /**
   * Ant Design 风格自定义清除图标（M-A4）。接 string（Iconify name / CSS class）或 VNode；
   * 同名 `clearIcon` slot 优先级最高。
   */
  clearIcon: {
    type: [String, Object] as PropType<string | VNode>,
    default: undefined,
  },
  /**
   * Ant Design 风格自定义日历图标（M-A4）。接 string（Iconify name / CSS class）或 VNode；
   * 同名 `suffixIcon` slot 优先级最高。
   */
  suffixIcon: {
    type: [String, Object] as PropType<string | VNode>,
    default: undefined,
  },
  size: {
    type: String as PropType<DatePickerSize>,
    default: 'default',
  },
  status: {
    type: String as PropType<DatePickerStatus>,
    default: '',
  },
  disabledDate: {
    type: Function as PropType<DisabledDate>,
    default: undefined,
  },
  placement: {
    type: String as PropType<DatePickerPlacement>,
    default: 'bottomLeft',
  },
  popupClassName: {
    type: String,
    default: '',
  },
  popupAppendToBody: {
    type: Boolean,
    default: false,
  },
  getPopupContainer: {
    type: Function as PropType<GetPopupContainer>,
    default: undefined,
  },
  autoFocus: {
    type: Boolean,
    default: false,
  },
  inputReadOnly: {
    type: Boolean,
    default: true,
  },
  transitionName: {
    type: String,
    default: 'ccui-date-picker-fade',
  },
  // 周起始：0 = 周日，1 = 周一。默认与 Calendar 现有约定一致（周日开头）。
  weekStart: {
    type: Number as PropType<0 | 1>,
    default: 0,
  },
  // showTime: false 不显示时间列；true 启用默认时间列；对象传配置。仅 picker='date' 生效。
  showTime: {
    type: [Boolean, Object] as PropType<boolean | TimeShowConfig>,
    default: false,
  },
  // 是否在 footer 显示「此刻」按钮。仅 showTime 启用时显示。
  showNow: {
    type: Boolean,
    default: true,
  },
  // 预设快捷项。非空数组渲染左侧 rail；与 showTime 共存时，点击预设更新 pendingValue（仍需 ok）。
  presets: {
    type: Array as PropType<PresetItem[]>,
    default: () => [],
  },
  /**
   * Ant Design v5.13+ 录入组件统一 variant 形态。
   * `'outlined' | 'filled' | 'borderless' | 'underlined'`，默认 `'outlined'`。
   */
  variant: {
    type: String as PropType<DatePickerVariant>,
    default: 'outlined',
  },
} as const

export type DatePickerProps = ExtractPropTypes<typeof datePickerProps>

/**
 * Ant Design v5.13+ 录入组件统一 variant 形态。
 */
export type DatePickerVariant = 'outlined' | 'filled' | 'borderless' | 'underlined'
