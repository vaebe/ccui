import type { CSSProperties, ExtractPropTypes, PropType } from 'vue'

export type FlexJustify = CSSProperties['justifyContent']
export type FlexAlign = CSSProperties['alignItems']
export type FlexWrap = CSSProperties['flexWrap']

export const flexProps = {
  vertical: {
    type: Boolean,
    default: false,
  },
  wrap: {
    type: [Boolean, String] as PropType<boolean | FlexWrap>,
    default: false,
  },
  justify: {
    type: String as PropType<FlexJustify>,
    default: 'normal',
  },
  align: {
    type: String as PropType<FlexAlign>,
    default: 'normal',
  },
  flex: {
    type: String,
    default: 'normal',
  },
  gap: {
    type: [String, Number] as PropType<string | number>,
    default: undefined,
  },
  component: {
    type: String,
    default: 'div',
  },
} as const

export type FlexProps = ExtractPropTypes<typeof flexProps>

export const PRESET_GAP: Record<string, string> = {
  small: '8px',
  middle: '16px',
  large: '24px',
}
