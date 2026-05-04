import type { ExtractPropTypes, PropType } from 'vue'

export type ComponentSize = 'small' | 'middle' | 'large'

export interface ThemeConfig {
  token?: Record<string, string | number>
  algorithm?: 'default' | 'dark' | 'compact'
  cssVar?: boolean
}

export interface Locale {
  locale: string
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
