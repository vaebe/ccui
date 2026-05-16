import type { ExtractPropTypes, PropType } from 'vue'

export type TypographyType = 'secondary' | 'success' | 'warning' | 'danger'
export type TitleLevel = 1 | 2 | 3 | 4 | 5

/** copyable 复合配置（对标 ant `copyable: bool | { ... }`） */
export interface CopyableConfig {
  /** 实际复制的文本；不传则从 default slot 拿 textContent */
  text?: string
  /** 复制后 icon 恢复延时（ms），默认 3000 */
  copyableDelay?: number
  /** [复制前, 复制后] tooltip 文案；保留为 prop 因为是数据不是 render */
  tooltips?: [string, string] | false
  /** 复制完成回调 */
  onCopy?: (text: string) => void
}

/** editable 复合配置（对标 ant `editable: bool | { ... }`，不照搬 React render props） */
export interface EditableConfig {
  /** 编辑触发方式，默认 `['icon']`；可选 `['text']` 让点击文本也进入编辑 */
  triggerType?: Array<'icon' | 'text'>
  /** 切回编辑前的 tooltip 文字 */
  tooltip?: string | false
  /** 受控编辑态 */
  editing?: boolean
  /** 受控 / 非受控初始文本 */
  text?: string
  /** 最大长度 */
  maxLength?: number
  /** autoSize textarea（true 或 { minRows, maxRows }） */
  autoSize?: boolean | { minRows?: number; maxRows?: number }
  onStart?: () => void
  onChange?: (value: string) => void
  onCancel?: () => void
  onEnd?: () => void
}

/** ellipsis 复合配置（对标 ant `ellipsis: bool | { ... }`，render props 全翻 slot） */
export interface EllipsisConfig {
  /** 多行截断行数；默认 1 */
  rows?: number
  /** 是否可展开/收起；true 展开后保留收起按钮；'collapsible' 同 true（向 ant 兼容） */
  expandable?: boolean | 'collapsible'
  /** 受控展开态 */
  expanded?: boolean
  /** 显示原生 title attribute（jsdom 友好的 fallback；后续可接 Tooltip 组件） */
  tooltip?: boolean | string
  onExpand?: (expanded: boolean) => void
  onEllipsis?: (clipped: boolean) => void
}

export const baseTextProps = {
  type: {
    type: String as PropType<TypographyType>,
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  mark: {
    type: Boolean,
    default: false,
  },
  code: {
    type: Boolean,
    default: false,
  },
  keyboard: {
    type: Boolean,
    default: false,
  },
  underline: {
    type: Boolean,
    default: false,
  },
  delete: {
    type: Boolean,
    default: false,
  },
  strong: {
    type: Boolean,
    default: false,
  },
  italic: {
    type: Boolean,
    default: false,
  },
  // copyable / editable / ellipsis 三大交互
  copyable: {
    type: [Boolean, Object] as PropType<boolean | CopyableConfig>,
    default: false,
  },
  editable: {
    type: [Boolean, Object] as PropType<boolean | EditableConfig>,
    default: false,
  },
  ellipsis: {
    type: [Boolean, Object] as PropType<boolean | EllipsisConfig>,
    default: false,
  },
} as const

export const textProps = baseTextProps
export const paragraphProps = baseTextProps

export const titleProps = {
  ...baseTextProps,
  level: {
    type: Number as PropType<TitleLevel>,
    default: 1,
    validator: (v: number) => v >= 1 && v <= 5,
  },
} as const

export const linkProps = {
  ...baseTextProps,
  href: {
    type: String,
    default: undefined,
  },
  target: {
    type: String,
    default: undefined,
  },
} as const

export type TextProps = ExtractPropTypes<typeof textProps>
export type ParagraphProps = ExtractPropTypes<typeof paragraphProps>
export type TitleProps = ExtractPropTypes<typeof titleProps>
export type LinkProps = ExtractPropTypes<typeof linkProps>
