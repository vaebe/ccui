import type { ExtractPropTypes, PropType } from 'vue'

export type TagColor
  = | 'default'
    | 'primary'
    | 'success'
    | 'processing'
    | 'error'
    | 'warning'
    | 'magenta'
    | 'red'
    | 'volcano'
    | 'orange'
    | 'gold'
    | 'lime'
    | 'green'
    | 'cyan'
    | 'blue'
    | 'geekblue'
    | 'purple'

export const tagProps = {
  color: {
    type: String as PropType<TagColor | string>,
    default: 'default',
  },
  bordered: {
    type: Boolean,
    default: true,
  },
  closable: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: '',
  },
} as const

export type TagProps = ExtractPropTypes<typeof tagProps>

const PRESET_COLORS = new Set<string>([
  'default',
  'primary',
  'success',
  'processing',
  'error',
  'warning',
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
])

export function isPresetColor(color: string): boolean {
  return PRESET_COLORS.has(color)
}
