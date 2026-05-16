import type { ExtractPropTypes, PropType, VNode } from 'vue'
import type { CcSemanticClasses, CcSemanticStyles } from '../../shared/hooks/use-semantic'

export type TextareaSize = 'large' | 'default' | 'small'
export type TextareaStatus = '' | 'error' | 'warning'

/**
 * 录入组件统一 variant 形态。
 *
 * - `outlined`（默认）：1px solid 边框
 * - `filled`：无边框 + 浅灰背景填充
 * - `borderless`：完全无边框无背景
 * - `underlined`：仅底部 1px 边框
 */
export type TextareaVariant = 'outlined' | 'filled' | 'borderless' | 'underlined'

/**
 * `autoSize` 复合配置：
 *
 * - `false`（默认）：不自动调高度，行数走原生 `rows` 属性。
 * - `true`：高度跟随内容自动撑开，无上限。
 * - `{ minRows, maxRows }`：限制最小 / 最大行数。
 */
export interface TextareaAutoSizeObject {
  minRows?: number
  maxRows?: number
}
export type TextareaAutoSize = boolean | TextareaAutoSizeObject

/**
 * `allowClear` 复合配置（与 Input 对齐）：
 *
 * - `boolean`：开启/关闭清除按钮
 * - `{ clearIcon }`：自定义清除图标（接 string Iconify name / VNode）
 */
export interface TextareaAllowClearObject {
  clearIcon?: VNode | string
}
export type TextareaAllowClear = boolean | TextareaAllowClearObject

/**
 * `showCount` 复合配置（与 Input 对齐）：
 *
 * - `boolean`：开启右侧字符计数
 * - `{ formatter }`：自定义计数格式
 */
export interface TextareaShowCountObject {
  formatter?: (info: { value: string; count: number; maxLength?: number }) => string
}
export type TextareaShowCount = boolean | TextareaShowCountObject

export const textareaProps = {
  modelValue: {
    type: String,
    default: '',
  },
  /**
   * 非受控模式初始值。设置后首次挂载从 `defaultValue` 取值，之后忽略；与 `v-model:value` 并存。
   */
  defaultValue: {
    type: String,
    default: undefined,
  },
  placeholder: {
    type: String,
    default: '',
  },
  size: {
    type: String as PropType<TextareaSize>,
    default: 'default',
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
   * 原生 `rows` 属性。autoSize=true 时被忽略。
   */
  rows: {
    type: Number,
    default: 2,
  },
  /**
   * 高度自适应（与 Ant `Input.TextArea` autoSize 对齐）。
   */
  autoSize: {
    type: [Boolean, Object] as PropType<TextareaAutoSize>,
    default: false,
  },
  /**
   * 清除按钮。与 Input 对齐。
   */
  allowClear: {
    type: [Boolean, Object] as PropType<TextareaAllowClear>,
    default: false,
  },
  /**
   * 显示字符计数。与 Input 对齐。
   */
  showCount: {
    type: [Boolean, Object] as PropType<TextareaShowCount>,
    default: false,
  },
  /**
   * 最大长度（透传原生 maxlength）。
   */
  maxLength: {
    type: Number,
    default: undefined,
  },
  /**
   * 校验状态。与 Input 对齐，Form 联动会自动透传。
   */
  status: {
    type: String as PropType<TextareaStatus>,
    default: '',
  },
  /**
   * resize 行为，对齐原生 textarea 的 CSS resize 属性。
   */
  resize: {
    type: String as PropType<'none' | 'both' | 'horizontal' | 'vertical'>,
    default: 'vertical',
  },
  /**
   * 录入组件统一 variant 形态。
   * `'outlined' | 'filled' | 'borderless' | 'underlined'`，默认 `'outlined'`。
   */
  variant: {
    type: String as PropType<TextareaVariant>,
    default: 'outlined',
  },
  /**
   * 语义化 DOM className 注入。可用 key：`root` / `textarea` / `count`。
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

export type TextareaProps = ExtractPropTypes<typeof textareaProps>
