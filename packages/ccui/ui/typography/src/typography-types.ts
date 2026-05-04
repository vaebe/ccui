import type { ExtractPropTypes, PropType } from 'vue'

export type TypographyType = 'secondary' | 'success' | 'warning' | 'danger'
export type TitleLevel = 1 | 2 | 3 | 4 | 5

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
