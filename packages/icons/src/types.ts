import type { CSSProperties, FunctionalComponent } from 'vue'

export interface IconBaseProps {
  size?: number | string
  color?: string
  rotate?: number | string
  spin?: boolean
  class?: string
  style?: CSSProperties | string
}

export type CcuiIconComponent = FunctionalComponent<IconBaseProps>
