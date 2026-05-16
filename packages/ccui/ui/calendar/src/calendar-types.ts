import type { ExtractPropTypes, PropType } from 'vue'
import type { CcSemanticClasses, CcSemanticStyles } from '../../shared/hooks/use-semantic'
import type { DateValue } from '../../shared/utils/date'

export type CalendarValueFormat = 'string' | 'date' | 'number'

export const calendarProps = {
  /**
   * 选中日期。支持 string / Date / number(timestamp) / Dayjs / null。
   * 字符串按 `format` 解析；解析失败回退到今天。
   */
  modelValue: {
    type: [String, Number, Date, Object] as PropType<DateValue>,
    default: undefined,
  },
  /**
   * 日期解析 / 格式化模板（dayjs format token）。
   */
  format: {
    type: String,
    default: 'YYYY-MM-DD',
  },
  /**
   * v-model 输出协议：
   * - `'string'`：按 `format` 输出字符串（默认）
   * - `'date'`：输出原生 `Date`
   * - `'number'`：输出毫秒级 timestamp
   */
  valueFormat: {
    type: String as PropType<CalendarValueFormat>,
    default: 'string',
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  /**
   * 语义化 DOM className 注入。可用 key：`root` / `header` / `body` / `cell`。
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

export type CalendarProps = ExtractPropTypes<typeof calendarProps>

export interface dateItem {
  index: number
  date: string
  day: string
  week: string
}
