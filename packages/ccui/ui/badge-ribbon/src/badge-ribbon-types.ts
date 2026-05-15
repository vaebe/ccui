import type { ExtractPropTypes, PropType } from 'vue'

export type BadgeRibbonPlacement = 'start' | 'end'

/**
 * 与 Tag / Badge 对齐的 ant v6 预设色名（小写）。
 */
const PRESET_COLORS = new Set<string>([
  'pink',
  'magenta',
  'red',
  'volcano',
  'orange',
  'yellow',
  'gold',
  'cyan',
  'lime',
  'green',
  'blue',
  'geekblue',
  'purple',
])

export function isRibbonPresetColor(color: string): boolean {
  return PRESET_COLORS.has(color)
}

export const badgeRibbonProps = {
  /**
   * 缎带文字。slot 同名 `text` 优先级更高。
   */
  text: {
    type: String,
    default: '',
  },
  /**
   * 缎带颜色：
   *
   * - 预设色名（`'pink' | 'red' | ...`）：走 SCSS preset class
   * - CSS 字符串（`'#1677ff'` / `'rgb(...)'`）：走 inline background
   */
  color: {
    type: String,
    default: '',
  },
  /**
   * 缎带位置。`'end'`（默认）右上；`'start'` 左上。
   */
  placement: {
    type: String as PropType<BadgeRibbonPlacement>,
    default: 'end',
  },
} as const

export type BadgeRibbonProps = ExtractPropTypes<typeof badgeRibbonProps>
