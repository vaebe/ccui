import type { ExtractPropTypes, PropType, VNode } from 'vue'
import type { CcSemanticClasses, CcSemanticStyles } from '../../shared/hooks/use-semantic'
import type { DateValue } from '../../shared/utils/date'

export type TimeRangePickerSize = 'large' | 'default' | 'small'
export type TimeRangePickerStatus = '' | 'error' | 'warning' | 'success' | 'validating'
export type TimeRangePickerPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
export type TimeRangeOutputFormat = 'string' | 'date' | 'number'
export type TimeRangePickerVariant = 'outlined' | 'filled' | 'borderless' | 'underlined'

// v-model 形态：tuple `[start, end]`，单值为 null 时表示该端未选。
export type TimeRangeValue = [DateValue, DateValue] | null

export type DisabledRangeHours = (which: 'start' | 'end') => number[]
export type DisabledRangeMinutes = (which: 'start' | 'end', selectedHour: number) => number[]
export type DisabledRangeSeconds = (which: 'start' | 'end', selectedHour: number, selectedMinute: number) => number[]

export const timeRangePickerProps = {
  modelValue: {
    type: Array as unknown as PropType<TimeRangeValue>,
    default: undefined,
  },
  format: {
    type: String,
    default: '',
  },
  use12Hours: {
    type: Boolean,
    default: false,
  },
  valueFormat: {
    type: String as PropType<TimeRangeOutputFormat>,
    default: 'string',
  },
  // 占位文案；接元组 [start, end]，单 string 时两端共用。
  placeholder: {
    type: [String, Array] as PropType<string | [string, string]>,
    default: '',
  },
  // 两端独立 disabled；接 boolean 或 [boolean, boolean]
  disabled: {
    type: [Boolean, Array] as PropType<boolean | [boolean, boolean]>,
    default: false,
  },
  // 两端独立 allowEmpty；接 boolean 或 [boolean, boolean]，默认 [false, false]
  allowEmpty: {
    type: [Boolean, Array] as PropType<boolean | [boolean, boolean]>,
    default: false,
  },
  // 是否自动调整 start/end 顺序（start > end 时交换）；默认 true
  order: {
    type: Boolean,
    default: true,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  clearIcon: {
    type: [String, Object] as PropType<string | VNode>,
    default: undefined,
  },
  suffixIcon: {
    type: [String, Object] as PropType<string | VNode>,
    default: undefined,
  },
  size: {
    type: String as PropType<TimeRangePickerSize>,
    default: 'default',
  },
  status: {
    type: String as PropType<TimeRangePickerStatus>,
    default: '',
  },
  placement: {
    type: String as PropType<TimeRangePickerPlacement>,
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
  autoFocus: {
    type: Boolean,
    default: false,
  },
  inputReadOnly: {
    type: Boolean,
    default: true,
  },
  showHour: {
    type: Boolean,
    default: true,
  },
  showMinute: {
    type: Boolean,
    default: true,
  },
  showSecond: {
    type: Boolean,
    default: true,
  },
  hourStep: {
    type: Number,
    default: 1,
  },
  minuteStep: {
    type: Number,
    default: 1,
  },
  secondStep: {
    type: Number,
    default: 1,
  },
  disabledHours: {
    type: Function as PropType<DisabledRangeHours>,
    default: undefined,
  },
  disabledMinutes: {
    type: Function as PropType<DisabledRangeMinutes>,
    default: undefined,
  },
  disabledSeconds: {
    type: Function as PropType<DisabledRangeSeconds>,
    default: undefined,
  },
  showNow: {
    type: Boolean,
    default: true,
  },
  showOk: {
    type: Boolean,
    default: true,
  },
  variant: {
    type: String as PropType<TimeRangePickerVariant>,
    default: 'outlined',
  },
  // 范围分隔符；默认 '~'
  separator: {
    type: String,
    default: '~',
  },
  classNames: {
    type: Object as PropType<CcSemanticClasses>,
    default: undefined,
  },
  styles: {
    type: Object as PropType<CcSemanticStyles>,
    default: undefined,
  },
} as const

export type TimeRangePickerProps = ExtractPropTypes<typeof timeRangePickerProps>
