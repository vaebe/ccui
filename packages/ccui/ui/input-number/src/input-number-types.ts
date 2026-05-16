import type { ExtractPropTypes, PropType } from 'vue'
import type { CcSemanticClasses, CcSemanticStyles } from '../../shared/hooks/use-semantic'

/**
 * 数字输入框的值类型
 * - number: 有效的数字值
 * - undefined: 空值（当 allowEmpty 为 true 时）
 */
export type InputNumberValue = number | undefined

/**
 * 输入框尺寸类型。
 *
 * - 推荐：`'large' | 'default' | 'small'`（与库内其他录入组件统一）
 * - 兼容：`'lg' | 'md' | 'sm'`（旧值，运行时自动映射到推荐值；下一大版本移除）
 */
export type ISize = 'large' | 'default' | 'small' | 'lg' | 'md' | 'sm'

/**
 * 控制按钮位置类型
 */
export type ControlsPosition = 'right' | 'both'

/**
 * Ant Design v5.13+ 录入组件统一 variant 形态。
 *
 * - `outlined`（默认）：1px solid 边框
 * - `filled`：无边框 + 浅灰背景填充
 * - `borderless`：完全无边框无背景
 * - `underlined`：仅底部 1px 边框
 */
export type InputNumberVariant = 'outlined' | 'filled' | 'borderless' | 'underlined'

/**
 * Ant Design 风格的校验状态。Form 联动会自动透传。
 */
export type InputNumberStatus = '' | 'error' | 'warning'

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
    default: 'default',
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
  /**
   * Ant Design v5.13+ 录入组件统一 variant 形态。
   * `'outlined' | 'filled' | 'borderless' | 'underlined'`，默认 `'outlined'`。
   */
  variant: {
    type: String as PropType<InputNumberVariant>,
    default: 'outlined',
  },
  /**
   * 校验状态。`'error' | 'warning'`，Form 联动会自动透传。
   */
  status: {
    type: String as PropType<InputNumberStatus>,
    default: '',
  },
  /**
   * Ant Design v5.18+ 语义化 DOM className 注入（M-A2）。可用 key：`root` / `input` / `controls`。
   */
  classNames: {
    type: Object as PropType<CcSemanticClasses>,
    default: undefined,
  },
  /**
   * Ant Design v5.18+ 语义化 DOM style 注入（M-A2）。可用 key 与 classNames 一致。
   */
  styles: {
    type: Object as PropType<CcSemanticStyles>,
    default: undefined,
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
  change: [currentVal: InputNumberValue, oldVal: InputNumberValue]
  /** 失去焦点事件 */
  blur: [event: FocusEvent]
  /** 获得焦点事件 */
  focus: [event: FocusEvent]
  /** 输入事件 */
  input: [currentValue: InputNumberValue]
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
