import type { Dayjs } from 'dayjs'
import type { ExtractPropTypes, PropType } from 'vue'
import type { DateValue } from '../../shared/utils/date'

export type RangePickerSize = 'large' | 'default' | 'small'
export type RangePickerStatus = '' | 'error' | 'warning' | 'success' | 'validating'
export type RangePickerPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
export type RangeSide = 'start' | 'end'
// 通用：作用于双侧的旧 API。
export type DisabledDate = (current: Dayjs) => boolean
// 新：只决定某一侧（start/end）是否禁用某天。优先级高于 disabledDate。
export type DisabledDateOf = (current: Dayjs, side: RangeSide) => boolean
export type GetPopupContainer = (triggerNode: HTMLElement | null) => HTMLElement | null
export type DateOutputFormat = 'string' | 'date' | 'number'

export type RangeValue = [DateValue, DateValue] | null

// 预设项：value 为 [start, end] 元组，函数延迟求值。
export interface RangePresetItem {
  label: string | (() => string)
  value: [DateValue, DateValue] | (() => [DateValue, DateValue])
}

// RangePicker showTime 配置。boolean 形式等价 `{}`。
export interface RangeTimeShowConfig {
  format?: string
  /** 起始侧默认时间，未指定 → 00:00:00。 */
  defaultStartTime?: DateValue
  /** 结束侧默认时间，未指定 → 23:59:59。 */
  defaultEndTime?: DateValue
  hourStep?: number
  minuteStep?: number
  secondStep?: number
  disabledHours?: () => number[]
  disabledMinutes?: () => number[]
  disabledSeconds?: () => number[]
  hideDisabledOptions?: boolean
}

export const RANGE_DEFAULT_TIME_FORMAT = 'HH:mm:ss'

export const rangePickerProps = {
  modelValue: {
    type: Array as unknown as PropType<RangeValue>,
    default: undefined,
  },
  format: {
    type: String,
    default: 'YYYY-MM-DD',
  },
  // v-model 输出形态：'string' 按 format 输出 [string, string]；'date' 输出 [Date, Date]；'number' 输出 [ms, ms]。
  valueFormat: {
    type: String as PropType<DateOutputFormat>,
    default: 'string',
  },
  placeholder: {
    type: Array as unknown as PropType<[string, string]>,
    default: () => ['', ''],
  },
  separator: {
    type: String,
    default: '~',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String as PropType<RangePickerSize>,
    default: 'default',
  },
  status: {
    type: String as PropType<RangePickerStatus>,
    default: '',
  },
  disabledDate: {
    type: Function as PropType<DisabledDate>,
    default: undefined,
  },
  // 仅对起始侧生效，优先级高于 disabledDate。
  disabledStartDate: {
    type: Function as PropType<DisabledDate>,
    default: undefined,
  },
  // 仅对结束侧生效，优先级高于 disabledDate。
  disabledEndDate: {
    type: Function as PropType<DisabledDate>,
    default: undefined,
  },
  placement: {
    type: String as PropType<RangePickerPlacement>,
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
    default: 'ccui-range-picker-fade',
  },
  weekStart: {
    type: Number as PropType<0 | 1>,
    default: 0,
  },
  // 预设快捷项。空数组不渲染。
  presets: {
    type: Array as PropType<RangePresetItem[]>,
    default: () => [],
  },
  // showTime: false 不显示时间列；true 启用默认时间列；对象传配置。
  showTime: {
    type: [Boolean, Object] as PropType<boolean | RangeTimeShowConfig>,
    default: false,
  },
  // 是否在 footer 显示「此刻」按钮。仅 showTime 启用时显示。
  showNow: {
    type: Boolean,
    default: true,
  },
} as const

export type RangePickerProps = ExtractPropTypes<typeof rangePickerProps>
