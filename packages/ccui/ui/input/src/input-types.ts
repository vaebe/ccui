import type { ExtractPropTypes, PropType, VNode } from 'vue'

export type InputType = 'text' | 'password'
export type InputSize = 'large' | 'default' | 'small'

/**
 * Ant Design 风格的校验状态。Form 联动会自动透传。
 */
export type InputStatus = '' | 'error' | 'warning'

/**
 * `allowClear` 复合配置：
 *
 * - `boolean`：开启/关闭清除按钮
 * - `{ clearIcon }`：自定义清除图标（接 Iconify name / VNode）
 */
export interface InputAllowClearObject {
  clearIcon?: VNode | string
}
export type InputAllowClear = boolean | InputAllowClearObject

/**
 * `showCount` 复合配置：
 *
 * - `boolean`：开启右侧字符计数
 * - `{ formatter }`：自定义计数格式（接 `({ value, count, maxLength }) => string`）
 */
export interface InputShowCountObject {
  formatter?: (info: { value: string; count: number; maxLength?: number }) => string
}
export type InputShowCount = boolean | InputShowCountObject

export const inputProps = {
  type: {
    type: String as PropType<InputType>,
    default: 'text',
  },
  size: {
    type: String as PropType<InputSize>,
    default: 'default',
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  /**
   * @deprecated 请改用 `allowClear`（Ant Design 主名）。下一大版本移除。
   */
  clearable: {
    type: Boolean,
    default: false,
  },
  /**
   * Ant Design 主名：是否显示清除按钮，支持 `{ clearIcon }` 自定义图标。
   * 显式 `allowClear` 优先于 `clearable`。
   */
  allowClear: {
    type: [Boolean, Object] as PropType<InputAllowClear>,
    default: undefined,
  },
  showPassword: {
    type: Boolean,
    default: false,
  },
  /**
   * @deprecated 旧 string 形式 prepend；推荐使用 `addon-before` slot 或 prop。
   */
  prepend: {
    type: String,
    default: '',
  },
  /**
   * @deprecated 旧 string 形式 append；推荐使用 `addon-after` slot 或 prop。
   */
  append: {
    type: String,
    default: '',
  },
  /**
   * Ant Design 主名：左侧 addon 内容（字符串或 slot 同名 `addon-before`）。
   */
  addonBefore: {
    type: String,
    default: '',
  },
  /**
   * Ant Design 主名：右侧 addon 内容（字符串或 slot 同名 `addon-after`）。
   */
  addonAfter: {
    type: String,
    default: '',
  },
  /**
   * 最大长度（同时透传给原生 `maxlength`）。
   */
  maxLength: {
    type: Number,
    default: undefined,
  },
  /**
   * 显示字符计数。`true` 用内置格式 `count[/maxLength]`；对象 `{ formatter }` 自定义。
   */
  showCount: {
    type: [Boolean, Object] as PropType<InputShowCount>,
    default: false,
  },
  /**
   * 校验状态。`'error' | 'warning'`，Form 联动会自动透传。
   */
  status: {
    type: String as PropType<InputStatus>,
    default: '',
  },
  /**
   * 非受控模式初始值。设置后首次挂载从 `defaultValue` 取值，之后忽略；与 `v-model:value` 并存。
   */
  defaultValue: {
    type: String,
    default: undefined,
  },
  modelValue: {
    type: String,
    default: '',
  },
} as const

export type InputProps = ExtractPropTypes<typeof inputProps>
