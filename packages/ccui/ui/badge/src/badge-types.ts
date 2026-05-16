import type { ExtractPropTypes, PropType } from 'vue'
import type { CcSemanticClasses, CcSemanticStyles } from '../../shared/hooks/use-semantic'

export type BadgeStatus = 'success' | 'processing' | 'default' | 'error' | 'warning'

export const badgeProps = {
  count: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },
  showZero: {
    type: Boolean,
    default: false,
  },
  overflowCount: {
    type: Number,
    default: 99,
  },
  dot: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String as PropType<BadgeStatus>,
    default: undefined,
  },
  text: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
  offset: {
    type: Array as unknown as PropType<[number, number]>,
    default: undefined,
  },
  /**
   * Ant Design v5.18+ 语义化 DOM className 注入（M-A2）。可用 key：`root` / `dot` / `count`。
   */
  classNames: {
    type: Object as PropType<CcSemanticClasses>,
    default: undefined,
  },
  /**
   * Ant Design v5.18+ 语义化 DOM style 注入（M-A2）。可用 key 与 classNames 一致。
   */
  styles: {
    type: Object as PropType<CcSemanticStyles>,
    default: undefined,
  },
} as const

export type BadgeProps = ExtractPropTypes<typeof badgeProps>
