import type { Component, PropType } from 'vue'

export type IconSize = number | string

export interface IconProps {
  name?: string
  component?: Component
  size?: IconSize
  color?: string
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
