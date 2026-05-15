import type { ExtractPropTypes, PropType } from 'vue'

export type ColorPickerSize = 'large' | 'default' | 'small'
export type ColorPickerStatus = '' | 'error' | 'warning' | 'success' | 'validating'
export type ColorPickerPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
/**
 * 颜色格式。
 *
 * - 推荐：`'hex' | 'rgb' | 'hsb'`（与 Ant Design 一致，HSB = Hue / Saturation / Brightness）
 * - 兼容：`'hsv'`（旧名，运行时等价于 `'hsb'`；下一大版本移除）
 */
export type ColorPickerFormat = 'hex' | 'rgb' | 'hsb' | 'hsv'
export type GetPopupContainer = (triggerNode: HTMLElement | null) => HTMLElement | null

export const colorPickerProps = {
  // 当前颜色（hex 字符串），支持 v-model
  modelValue: {
    type: String as PropType<string | null>,
    default: undefined,
  },
  // 非受控默认值
  defaultValue: {
    type: String,
    default: '#1677ff',
  },
  // 显示与输出格式
  format: {
    type: String as PropType<ColorPickerFormat>,
    default: 'hex',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<ColorPickerSize>,
    default: 'default',
  },
  status: {
    type: String as PropType<ColorPickerStatus>,
    default: '',
  },
  // 是否在 swatch 旁显示色值文本
  showText: {
    type: Boolean,
    default: false,
  },
  // 关闭 alpha 滑块（强制 alpha=1）
  disabledAlpha: {
    type: Boolean,
    default: false,
  },
  // 预设色板，每项 hex 字符串
  presets: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  placement: {
    type: String as PropType<ColorPickerPlacement>,
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
  transitionName: {
    type: String,
    default: 'ccui-color-picker-fade',
  },
  // 是否允许清空（触发器上显示 × 按钮）
  allowClear: {
    type: Boolean,
    default: false,
  },
  /**
   * Ant Design v5.13+ 录入组件统一 variant 形态。
   * `'outlined' | 'filled' | 'borderless' | 'underlined'`，默认 `'outlined'`。
   */
  variant: {
    type: String as PropType<ColorPickerVariant>,
    default: 'outlined',
  },
} as const

export type ColorPickerProps = ExtractPropTypes<typeof colorPickerProps>

/**
 * Ant Design v5.13+ 录入组件统一 variant 形态。
 */
export type ColorPickerVariant = 'outlined' | 'filled' | 'borderless' | 'underlined'
