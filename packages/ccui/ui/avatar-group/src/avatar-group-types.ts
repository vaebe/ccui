import type { CSSProperties, ExtractPropTypes, InjectionKey, PropType, Ref } from 'vue'

export type AvatarGroupSize = 'large' | 'default' | 'small' | number
export type AvatarGroupShape = 'circle' | 'square'
export type AvatarGroupTrigger = 'hover' | 'click' | 'focus'
export type AvatarGroupPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

export const avatarGroupProps = {
  /**
   * 子 avatar 最多展示数量，超出部分合并为 `+N`。不传则全部展示。
   */
  maxCount: {
    type: Number,
    default: undefined,
  },
  /**
   * `+N` 头像自定义 style（背景 / 文字色等）。
   */
  maxStyle: {
    type: Object as PropType<CSSProperties>,
    default: undefined,
  },
  /**
   * `+N` 头像悬浮 popover 的弹出方向。默认 `top`。
   */
  maxPopoverPlacement: {
    type: String as PropType<AvatarGroupPlacement>,
    default: 'top',
  },
  /**
   * `+N` 头像 popover 触发方式。默认 `hover`。
   */
  maxPopoverTrigger: {
    type: String as PropType<AvatarGroupTrigger>,
    default: 'hover',
  },
  /**
   * 头像尺寸：数字（px）或语义化字面值。透传到子 avatar。
   */
  size: {
    type: [Number, String] as PropType<AvatarGroupSize>,
    default: 'default',
  },
  /**
   * 头像形状。透传到子 avatar（影响 `is-round`）。
   */
  shape: {
    type: String as PropType<AvatarGroupShape>,
    default: 'circle',
  },
} as const

export type AvatarGroupProps = ExtractPropTypes<typeof avatarGroupProps>

export interface AvatarGroupContext {
  size: Ref<AvatarGroupSize>
  shape: Ref<AvatarGroupShape>
}

export const avatarGroupInjectionKey = Symbol('AvatarGroup') as InjectionKey<AvatarGroupContext>

const SIZE_MAP: Record<string, number> = {
  large: 40,
  default: 32,
  small: 24,
}

export function resolveAvatarSize(size: AvatarGroupSize): number {
  if (typeof size === 'number') return size
  return SIZE_MAP[size] ?? 32
}
