import type { ExtractPropTypes, PropType } from 'vue'

export type SpaceSize = 'small' | 'middle' | 'large' | number | [number, number]
export type SpaceDirection = 'horizontal' | 'vertical'
export type SpaceAlign = 'start' | 'end' | 'center' | 'baseline'

export const spaceProps = {
  align: {
    type: String as PropType<SpaceAlign>,
    default: undefined,
  },
  direction: {
    type: String as PropType<SpaceDirection>,
    default: 'horizontal',
  },
  size: {
    type: [String, Number, Array] as PropType<SpaceSize>,
    default: 'small',
  },
  wrap: {
    type: Boolean,
    default: false,
  },
  split: {
    type: String,
    default: '',
  },
} as const

export type SpaceProps = ExtractPropTypes<typeof spaceProps>

const SIZE_MAP: Record<string, number> = {
  small: 8,
  middle: 16,
  large: 24,
}

export function resolveSize(size: SpaceSize): [number, number] {
  if (Array.isArray(size)) {
    return [size[0] ?? 0, size[1] ?? 0]
  }
  if (typeof size === 'number') {
    return [size, size]
  }
  const v = SIZE_MAP[size] ?? 8
  return [v, v]
}
