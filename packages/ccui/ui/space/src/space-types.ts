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
  // CSS gaps must be finite and non-negative; normalize malformed runtime values
  // so an accidental NaN/negative prop cannot invalidate the whole layout rule.
  const normalize = (value: unknown): number => {
    const numeric = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(numeric) ? Math.max(0, numeric) : 0
  }

  if (Array.isArray(size)) {
    return [normalize(size[0]), normalize(size[1])]
  }
  if (typeof size === 'number') {
    const value = normalize(size)
    return [value, value]
  }
  const v = SIZE_MAP[size] ?? 8
  return [v, v]
}
