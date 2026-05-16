import type { ExtractPropTypes, PropType, VNode } from 'vue'
import type { CcSemanticClasses, CcSemanticStyles } from '../../shared/hooks/use-semantic'
import type { DateValue } from '../../shared/utils/date'

export type TimePickerSize = 'large' | 'default' | 'small'
export type TimePickerStatus = '' | 'error' | 'warning' | 'success' | 'validating'
export type TimePickerPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
export type TimeOutputFormat = 'string' | 'date' | 'number'
export type GetPopupContainer = (triggerNode: HTMLElement | null) => HTMLElement | null

export type DisabledHours = () => number[]
export type DisabledMinutes = (selectedHour: number) => number[]
export type DisabledSeconds = (selectedHour: number, selectedMinute: number) => number[]

export const timePickerProps = {
  modelValue: {
    type: [String, Number, Date, Object] as PropType<DateValue>,
    default: undefined,
  },
  format: {
    type: String,
    default: '',
  },
  // 12 小时制：hour 列展示 12, 1..11，多出 AM/PM 列。format 默认切到 'h:mm:ss a'。
  use12Hours: {
    type: Boolean,
    default: false,
  },
  // v-model 输出形态：'string' 按 format 输出；'date' 输出原生 Date；'number' 输出毫秒时间戳。
  valueFormat: {
    type: String as PropType<TimeOutputFormat>,
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
   * 自定义清除图标。接 string（Iconify name / CSS class）或 VNode；
   * 同名 `clearIcon` slot 优先级最高。
   */
  clearIcon: {
    type: [String, Object] as PropType<string | VNode>,
    default: undefined,
  },
  /**
   * 自定义时钟图标。接 string（Iconify name / CSS class）或 VNode；
   * 同名 `suffixIcon` slot 优先级最高。
   */
  suffixIcon: {
    type: [String, Object] as PropType<string | VNode>,
    default: undefined,
  },
  size: {
    type: String as PropType<TimePickerSize>,
    default: 'default',
  },
  status: {
    type: String as PropType<TimePickerStatus>,
    default: '',
  },
  placement: {
    type: String as PropType<TimePickerPlacement>,
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
    default: 'ccui-time-picker-fade',
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
    type: Function as PropType<DisabledHours>,
    default: undefined,
  },
  disabledMinutes: {
    type: Function as PropType<DisabledMinutes>,
    default: undefined,
  },
  disabledSeconds: {
    type: Function as PropType<DisabledSeconds>,
    default: undefined,
  },
  // 是否显示「此刻」按钮
  showNow: {
    type: Boolean,
    default: true,
  },
  // 是否显示「确定」按钮（false 时点击单元格立即关闭并 emit）
  showOk: {
    type: Boolean,
    default: true,
  },
  nowText: {
    type: String,
    default: '',
  },
  okText: {
    type: String,
    default: '',
  },
  /**
   * 录入组件统一 variant 形态。
   */
  variant: {
    type: String as PropType<TimePickerVariant>,
    default: 'outlined',
  },
  /**
   * 语义化 DOM className 注入。可用 key：`root` / `input` / `popup`。
   */
  classNames: {
    type: Object as PropType<CcSemanticClasses>,
    default: undefined,
  },
  /**
   * 语义化 DOM style 注入。可用 key 与 classNames 一致。
   */
  styles: {
    type: Object as PropType<CcSemanticStyles>,
    default: undefined,
  },
} as const

export type TimePickerProps = ExtractPropTypes<typeof timePickerProps>

export type TimePickerVariant = 'outlined' | 'filled' | 'borderless' | 'underlined'
