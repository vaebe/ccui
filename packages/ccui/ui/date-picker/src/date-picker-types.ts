import type { Dayjs } from 'dayjs'
import type { ExtractPropTypes, PropType } from 'vue'
import type { DateValue } from '../../shared/utils/date'

export type DatePickerSize = 'large' | 'default' | 'small'
export type DatePickerStatus = '' | 'error' | 'warning' | 'success' | 'validating'
export type DatePickerPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
export type DisabledDate = (current: Dayjs) => boolean
export type GetPopupContainer = (triggerNode: HTMLElement | null) => HTMLElement | null
export type DateOutputFormat = 'string' | 'date' | 'number'

export const datePickerProps = {
  modelValue: {
    type: [String, Number, Date, Object] as PropType<DateValue>,
    default: undefined,
  },
  format: {
    type: String,
    default: 'YYYY-MM-DD',
  },
  // v-model 输出形态：'string' 按 format 输出；'date' 输出原生 Date；'number' 输出毫秒时间戳。
  valueFormat: {
    type: String as PropType<DateOutputFormat>,
    default: 'string',
  },
  placeholder: {
    type: String,
    default: '请选择日期',
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
} as const

export type DatePickerProps = ExtractPropTypes<typeof datePickerProps>
