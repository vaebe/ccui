import type { ExtractPropTypes, PropType } from 'vue'

export type ComponentSize = 'small' | 'middle' | 'large'

export interface ThemeConfig {
  token?: Record<string, string | number>
  algorithm?: 'default' | 'dark' | 'compact'
  cssVar?: boolean
}

export interface ModalLocale {
  okText?: string
  cancelText?: string
  justOkText?: string
}

export interface PopconfirmLocale {
  confirmText?: string
  cancelText?: string
}

export interface EmptyLocale {
  description?: string
}

export interface SelectLocale {
  notFoundContent?: string
  searchPlaceholder?: string
}

export interface PaginationLocale {
  itemsPerPage?: string
  jumpTo?: string
  page?: string
  prevPage?: string
  nextPage?: string
  /** showTotal=true 时的默认渲染模板。占位符 {total}。 */
  total?: string
  /** 根 nav 的 aria-label。 */
  pagination?: string
}

export interface ImageLocale {
  loading?: string
  error?: string
  /** Image.PreviewGroup 工具栏；预留 namespace。 */
  preview?: string
}

export interface DatePickerLocale {
  /** 单选 placeholder。 */
  placeholder?: string
  /** RangePicker placeholder 二元组。 */
  rangePlaceholder?: [string, string]
  /** TimePicker placeholder。 */
  timePlaceholder?: string
  /** 7 个周名简写，自然顺序 [周日, 周一, …, 周六]。 */
  weekdaysShort?: string[]
  /** 日期面板标题的 dayjs 格式串，例如 'YYYY 年 M 月' / 'MMM YYYY'。 */
  panelLabelFormat?: string
  /** 月选择面板的 12 个月名简写（picker='month' / date 模式下钻）。 */
  monthNamesShort?: string[]
  /** 季度选择面板的 4 个季度名（picker='quarter'）。 */
  quarterNames?: string[]
  /** picker='week' 显示模板，支持 {weekYear} / {weekNumber} 两个占位符。 */
  weekFormat?: string
  /** picker='week' 时表头周编号列文案。 */
  weekHeader?: string
  /** TimePicker 「此刻」/「确定」按钮文案。 */
  now?: string
  ok?: string
  /** 头部箭头按钮 aria-label。 */
  prevYearLabel?: string
  prevMonthLabel?: string
  nextYearLabel?: string
  nextMonthLabel?: string
  clearLabel?: string
}

export interface CalendarLocale {
  /** 周名简写，自然顺序 [周日, 周一, …, 周六]。 */
  weekdaysShort?: string[]
  /** 头部按钮文案。 */
  prevMonthLabel?: string
  nextMonthLabel?: string
  todayLabel?: string
  /** 月份显示模板（dayjs format token），如 `'YYYY-MM'` / `'MMM YYYY'`。 */
  monthFormat?: string
}

export interface Locale {
  locale: string
  Modal?: ModalLocale
  Popconfirm?: PopconfirmLocale
  Empty?: EmptyLocale
  AutoComplete?: SelectLocale
  Mentions?: SelectLocale
  Cascader?: SelectLocale
  TreeSelect?: SelectLocale
  Select?: SelectLocale
  Pagination?: PaginationLocale
  Image?: ImageLocale
  DatePicker?: DatePickerLocale
  Calendar?: CalendarLocale
  [key: string]: any
}

export const configProviderProps = {
  prefixCls: {
    type: String,
    default: 'ccui',
  },
  componentSize: {
    type: String as PropType<ComponentSize>,
    default: 'middle',
  },
  locale: {
    type: Object as PropType<Locale>,
    default: undefined,
  },
  direction: {
    type: String as PropType<'ltr' | 'rtl'>,
    default: 'ltr',
  },
  theme: {
    type: Object as PropType<ThemeConfig>,
    default: undefined,
  },
  iconPrefixCls: {
    type: String,
    default: 'ccui-icon',
  },
} as const

export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>

export const CONFIG_INJECT_KEY = Symbol('ccui-config')

export interface ConfigContext {
  prefixCls: string
  componentSize: ComponentSize
  locale: Locale | undefined
  direction: 'ltr' | 'rtl'
  theme: ThemeConfig | undefined
  iconPrefixCls: string
}
