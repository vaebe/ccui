import type { ExtractPropTypes, PropType } from 'vue'

export interface SegmentedOption {
  label?: string
  value: string | number
  disabled?: boolean
  icon?: string
}

export type SegmentedSize = 'small' | 'middle' | 'large'

export const segmentedProps = {
  modelValue: {
    type: [String, Number] as PropType<string | number>,
    default: '',
  },
  options: {
    type: Array as PropType<(SegmentedOption | string | number)[]>,
    default: () => [],
  },
  block: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<SegmentedSize>,
    default: 'middle',
  },
} as const

export type SegmentedProps = ExtractPropTypes<typeof segmentedProps>

export function normalizeOptions(opts: (SegmentedOption | string | number)[]): SegmentedOption[] {
  return opts.map((opt) => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { label: String(opt), value: opt }
    }
    return { ...opt, label: opt.label ?? String(opt.value) }
  })
}
