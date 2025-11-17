import type { ExtractPropTypes, PropType } from 'vue'

/**
 * 数字输入框的值类型
 * - number: 有效的数字值
 * - undefined: 空值（当 allowEmpty 为 true 时）
 */
export type InputNumberValue = number | undefined

/**
 * 输入框尺寸类型
 */
export type ISize = 'lg' | 'md' | 'sm'

/**
 * 控制按钮位置类型
 */
export type ControlsPosition = 'right' | 'both'

/**
 * 格式化选项接口
 */
export interface FormatOptions {
  /** 数字精度，小数点后保留位数 */
  precision?: number
  /** 是否允许空值 */
  allowEmpty: boolean
  /** 最小值 */
  min: number
  /** 最大值 */
  max: number
}

export const inputNumberProps = {
  modelValue: {
    type: Number as PropType<number | undefined>,
    default: undefined,
  },
  step: {
    type: Number,
    default: 1,
  },
  placeholder: {
    type: String,
    default: '',
  },
  max: {
    type: Number,
    default: Infinity,
  },
  min: {
    type: Number,
    default: -Infinity,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  precision: {
    type: Number as PropType<number | undefined>,
    default: undefined,
  },
  size: {
    type: String as PropType<ISize>,
    default: 'md',
  },
  reg: {
    type: [RegExp, String] as PropType<RegExp | string | undefined>,
    default: undefined,
  },
  allowEmpty: {
    type: Boolean,
    default: false,
  },
  showGlowStyle: {
    type: Boolean,
    default: true,
  },
  controls: {
    type: Boolean,
    default: true,
  },
  controlsPosition: {
    type: String as PropType<ControlsPosition>,
    default: 'both',
  },
} as const

export type InputNumberProps = ExtractPropTypes<typeof inputNumberProps>

/**
 * 数字输入框事件类型定义
 */
export interface InputNumberEmits {
  /** 值更新事件 */
  'update:modelValue': [value: InputNumberValue]
  /** 值变化事件 */
  'change': [currentVal: InputNumberValue, oldVal: InputNumberValue]
  /** 失去焦点事件 */
  'blur': [event: FocusEvent]
  /** 获得焦点事件 */
  'focus': [event: FocusEvent]
  /** 输入事件 */
  'input': [currentValue: InputNumberValue]
}

/**
 * 数字输入框实例类型
 */
export interface InputNumberInstance {
  /** 获取当前值 */
  getValue: () => InputNumberValue
  /** 设置值 */
  setValue: (value: InputNumberValue) => void
  /** 聚焦 */
  focus: () => void
  /** 失焦 */
  blur: () => void
  /** 增加值 */
  increase: () => void
  /** 减少值 */
  decrease: () => void
}
