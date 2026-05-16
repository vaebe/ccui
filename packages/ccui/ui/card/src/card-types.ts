import type { ExtractPropTypes, PropType } from 'vue'
import type { CcSemanticClasses, CcSemanticStyles } from '../../shared/hooks/use-semantic'

export type ShadowType = PropType<'always' | 'hover' | 'never'>

export const cardProps = {
  shadow: {
    type: String as ShadowType,
    default: 'always',
  },
  header: {
    type: String,
    default: '',
  },
  bodyStyle: {
    type: Object,
    default: () => {
      return { padding: '20px' }
    },
  },
  /**
   * Ant Design v5.18+ 语义化 DOM className 注入（M-A2）。可用 key：`root` / `header` / `body` / `cover`。
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

export type CardProps = ExtractPropTypes<typeof cardProps>
