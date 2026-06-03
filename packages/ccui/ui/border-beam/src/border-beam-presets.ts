import type { BorderBeamColorStop } from './border-beam-types'

export interface BorderBeamPreset {
  /** 预设标识 */
  key: string
  /** 预设名称 */
  name: string
  /** 渐变停靠点 */
  color: BorderBeamColorStop[]
}

/**
 * 内置 6 套流光配色预设，可直接传给 `color`：
 *
 * ```ts
 * import { borderBeamPresets } from '@vaebe/ccui'
 * <c-border-beam :color="borderBeamPresets.ocean.color" />
 * ```
 */
export const borderBeamPresets = {
  ocean: {
    key: 'ocean',
    name: 'Ocean',
    color: [
      { color: '#1677ff', percent: 0 },
      { color: '#36cfc9', percent: 52 },
      { color: '#95de64', percent: 100 },
    ],
  },
  sunset: {
    key: 'sunset',
    name: 'Sunset',
    color: [
      { color: '#ff7a45', percent: 0 },
      { color: '#ff4d4f', percent: 49 },
      { color: '#ff85c0', percent: 100 },
    ],
  },
  aurora: {
    key: 'aurora',
    name: 'Aurora',
    color: [
      { color: '#7c3aed', percent: 0 },
      { color: '#06b6d4', percent: 57 },
      { color: '#67e8f9', percent: 100 },
    ],
  },
  forest: {
    key: 'forest',
    name: 'Forest',
    color: [
      { color: '#22c55e', percent: 0 },
      { color: '#a3e635', percent: 54 },
      { color: '#facc15', percent: 100 },
    ],
  },
  ember: {
    key: 'ember',
    name: 'Ember',
    color: [
      { color: '#fa541c', percent: 0 },
      { color: '#ff7875', percent: 46 },
      { color: '#ffd666', percent: 100 },
    ],
  },
  nebula: {
    key: 'nebula',
    name: 'Nebula',
    color: [
      { color: '#2f54eb', percent: 0 },
      { color: '#722ed1', percent: 44 },
      { color: '#ff85c0', percent: 100 },
    ],
  },
} satisfies Record<string, BorderBeamPreset>

/** 预设 key 列表，顺序与内置定义一致 */
export const borderBeamPresetKeys = Object.keys(borderBeamPresets) as Array<keyof typeof borderBeamPresets>
