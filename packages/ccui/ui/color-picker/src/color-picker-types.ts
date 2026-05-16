import type { ExtractPropTypes, PropType, VNode } from 'vue'
import type { CcSemanticClasses, CcSemanticStyles } from '../../shared/hooks/use-semantic'

export type ColorPickerSize = 'large' | 'default' | 'small'
export type ColorPickerStatus = '' | 'error' | 'warning' | 'success' | 'validating'
export type ColorPickerPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'

/**
 * 预设色板单项。
 *
 * - 单色：`string`（hex）或 `{ color, label? }`
 * - 分组：`{ label?, colors: Array<string | { color, label? }> }`，多组按 label 区分
 */
export type ColorPickerPresetColor = string | { color: string; label?: string }
export interface ColorPickerPresetGroup {
  label?: string
  colors: ColorPickerPresetColor[]
}
export type ColorPickerPresetItem = string | ColorPickerPresetGroup
/**
 * 颜色格式。
 *
 * - 推荐：`'hex' | 'rgb' | 'hsb'`（HSB = Hue / Saturation / Brightness）
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
  // 预设色板。支持三种形态：
  // 1) `string[]`：扁平 hex 列表，作为单组无 label 渲染
  // 2) `Array<{ color, label? }>`：单色对象列表，作为单组无 label 渲染
  // 3) `Array<{ label?, colors: ColorPickerPresetColor[] }>`：多组（label 区分组别）
  presets: {
    type: Array as PropType<ColorPickerPresetItem[]>,
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
   * 自定义清除图标。接 string（Iconify name / CSS class）或 VNode；
   * 同名 `clearIcon` slot 优先级最高。
   */
  clearIcon: {
    type: [String, Object] as PropType<string | VNode>,
    default: undefined,
  },
  /**
   * 录入组件统一 variant 形态。
   */
  variant: {
    type: String as PropType<ColorPickerVariant>,
    default: 'outlined',
  },
  /**
   * 语义化 DOM className 注入。可用 key：`root` / `trigger` / `popup`。
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

export type ColorPickerProps = ExtractPropTypes<typeof colorPickerProps>

export type ColorPickerVariant = 'outlined' | 'filled' | 'borderless' | 'underlined'
