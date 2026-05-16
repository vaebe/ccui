import type { ExtractPropTypes, PropType } from 'vue'
import type { CcSemanticClasses, CcSemanticStyles } from '../../shared/hooks/use-semantic'

export const calendarProps = {
  modelValue: {
    type: Date,
    default: new Date(),
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  /**
   * Ant Design v5.18+ 语义化 DOM className 注入（M-A2）。可用 key：`root` / `header` / `body` / `cell`。
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

export type CalendarProps = ExtractPropTypes<typeof calendarProps>

export interface dateItem {
  index: number
  date: string
  day: string
  week: string
}
