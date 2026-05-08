import type { Component, PropType } from 'vue'

export type IconSizePreset = 'small' | 'default' | 'large'
// Use `(string & {})` to keep IconSizePreset literal autocomplete without lint absorbing them into string.
export type IconSize = IconSizePreset | number | (string & {})
export type IconTheme = 'outlined' | 'filled' | 'two-tone'

export interface IconProps {
  name?: string
  component?: Component
  size?: IconSize
  color?: string
  twoToneColor?: string
  theme?: IconTheme
  rotate?: number
  spin?: boolean
  title?: string
  ariaLabel?: string
  prefixCls?: string
}

export const iconProps = {
  name: {
    type: String,
    default: '',
  },
  component: {
    type: Object as PropType<Component>,
    default: undefined,
  },
  size: {
    type: [Number, String] as PropType<IconSize>,
    default: undefined,
  },
  color: {
    type: String,
    default: '',
  },
  twoToneColor: {
    type: String,
    default: '',
  },
  theme: {
    type: String as PropType<IconTheme>,
    default: undefined,
  },
  rotate: {
    type: Number,
    default: 0,
  },
  spin: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  ariaLabel: {
    type: String,
    default: '',
  },
  prefixCls: {
    type: String,
    default: '',
  },
} as const
