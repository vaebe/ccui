import type { ExtractPropTypes, PropType } from 'vue'

/**
 * Tag 视觉变体。
 *
 * - `'outlined'`（默认）：描边款（等价于 ccui 旧 `bordered=true`）
 * - `'filled'`：填充款，无外边框（等价于 ccui 旧 `bordered=false`）
 * - `'solid'`：实色款，预设色更饱和
 */
export type TagVariant = 'outlined' | 'filled' | 'solid'

export type TagColor =
  | 'default'
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
    type: String,
    default: 'default',
  },
  /**
   * 视觉变体。
   *
   * - `'outlined'`（默认）：描边款
   * - `'filled'`：填充款，无外边框
   * - `'solid'`：实色款，预设色更饱和
   */
  variant: {
    type: String as PropType<TagVariant>,
    default: 'outlined',
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
