import type { ExtractPropTypes, PropType } from 'vue'
import type { CcSemanticClasses, CcSemanticStyles } from '../../shared/hooks/use-semantic'

export type AlertType = 'success' | 'info' | 'warning' | 'error'

export const alertProps = {
  type: {
    type: String as PropType<AlertType>,
    default: 'info',
  },
  message: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  showIcon: {
    type: Boolean,
    default: false,
  },
  closable: {
    type: Boolean,
    default: false,
  },
  closeText: {
    type: String,
    default: '',
  },
  banner: {
    type: Boolean,
    default: false,
  },
  /**
   * 语义化 DOM className 注入。可用 key：`root` / `icon` / `message` / `description`。
   */
  classNames: {
    type: Object as PropType<CcSemanticClasses>,
    default: undefined,
  },
  /**
   * 语义化 DOM style 注入。可用 key 与 classNames 一致。
   */
  styles: {
    type: Object as PropType<CcSemanticStyles>,
    default: undefined,
  },
} as const

export type AlertProps = ExtractPropTypes<typeof alertProps>
