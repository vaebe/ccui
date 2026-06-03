import type { ExtractPropTypes, PropType } from 'vue'

export interface WatermarkFont {
  color?: string
  fontSize?: number
  fontWeight?: 'normal' | 'light' | 'weight' | number
  fontStyle?: 'none' | 'normal' | 'italic' | 'oblique'
  fontFamily?: string
}

export const watermarkProps = {
  content: {
    type: [String, Array] as PropType<string | string[]>,
    default: '',
  },
  width: {
    type: Number,
    default: 120,
  },
  height: {
    type: Number,
    default: 64,
  },
  rotate: {
    type: Number,
    default: -22,
  },
  zIndex: {
    type: Number,
    default: 9,
  },
  gap: {
    type: Array as unknown as PropType<[number, number]>,
    default: () => [100, 100],
  },
  offset: {
    type: Array as unknown as PropType<[number, number]>,
    default: undefined,
  },
  font: {
    type: Object as PropType<WatermarkFont>,
    default: () => ({}),
  },
  image: {
    type: String,
    default: '',
  },
} as const

export type WatermarkProps = ExtractPropTypes<typeof watermarkProps>
