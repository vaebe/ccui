import type { Dayjs } from 'dayjs'
import type { ExtractPropTypes, PropType } from 'vue'
import type { DateValue } from '../../shared/utils/date'

export type RangePickerSize = 'large' | 'default' | 'small'
export type RangePickerStatus = '' | 'error' | 'warning' | 'success' | 'validating'
export type RangePickerPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
export type DisabledDate = (current: Dayjs) => boolean
export type GetPopupContainer = (triggerNode: HTMLElement | null) => HTMLElement | null
export type DateOutputFormat = 'string' | 'date' | 'number'

export type RangeValue = [DateValue, DateValue] | null

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
    default: () => ['开始日期', '结束日期'],
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
} as const

export type RangePickerProps = ExtractPropTypes<typeof rangePickerProps>
