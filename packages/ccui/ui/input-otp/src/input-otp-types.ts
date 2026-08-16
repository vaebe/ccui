import type { ExtractPropTypes, PropType } from 'vue'

export type InputOtpSize = 'large' | 'default' | 'small'
export type InputOtpStatus = '' | 'error' | 'warning'
export type InputOtpType = 'number' | 'text'

export type InputOtpFormatter = (value: string) => string

/**
 * 一次性密码 / 验证码输入框：单元格数量 + 单字符受控 + 自动焦点流转。
 */
export const inputOtpProps = {
  /**
   * 受控完整字符串（长度 = length）。短于 length 时右侧补空。
   */
  modelValue: {
    type: String,
    default: '',
  },
  /**
   * 非受控初值。首次挂载使用，与 v-model 并存。
   */
  defaultValue: {
    type: String,
    default: undefined,
  },
  /**
   * OTP 单元格数量。取整并限制在 1–64，默认 6。
   */
  length: {
    type: Number,
    default: 6,
  },
  /**
   * 移动端软键盘提示。`number` 使用数字键盘，`text` 使用文本键盘。
   * 字符过滤仍由 formatter 控制。
   */
  type: {
    type: String as PropType<InputOtpType>,
    default: 'number',
  },
  /**
   * 自动获得首个 cell 焦点。
   */
  autoFocus: {
    type: Boolean,
    default: false,
  },
  /**
   * 整体禁用。
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * 只读。仍可聚焦和选择内容，但不会接受输入、粘贴或删除操作。
   */
  readOnly: {
    type: Boolean,
    default: false,
  },
  /**
   * 字符遮罩：`true` 用 `•`，`string` 用任意单字符（仅取首字符）。
   * 注意：mask 只影响显示，emit 仍是真实字符。
   */
  mask: {
    type: [Boolean, String] as PropType<boolean | string>,
    default: false,
  },
  /**
   * 单字符变换器（在写入 cell 之前调用）。例如 `v => v.toUpperCase()`。
   */
  formatter: {
    type: Function as PropType<InputOtpFormatter>,
    default: undefined,
  },
  size: {
    type: String as PropType<InputOtpSize>,
    default: 'default',
  },
  status: {
    type: String as PropType<InputOtpStatus>,
    default: '',
  },
} as const

export type InputOtpProps = ExtractPropTypes<typeof inputOtpProps>
