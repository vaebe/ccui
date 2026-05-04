import type { ExtractPropTypes, InjectionKey, PropType, Ref } from 'vue'

export type MenuMode = 'vertical' | 'horizontal' | 'inline'
export type MenuTheme = 'light' | 'dark'

export interface MenuItem {
  key: string | number
  label?: string
  icon?: string
  disabled?: boolean
  type?: 'item' | 'submenu' | 'group' | 'divider'
  children?: MenuItem[]
}

export const menuProps = {
  mode: {
    type: String as PropType<MenuMode>,
    default: 'vertical' as MenuMode,
  },
  theme: {
    type: String as PropType<MenuTheme>,
    default: 'light' as MenuTheme,
  },
  selectedKeys: {
    type: Array as PropType<(string | number)[]>,
    default: () => [],
  },
  openKeys: {
    type: Array as PropType<(string | number)[]>,
    default: () => [],
  },
  items: {
    type: Array as PropType<MenuItem[]>,
    default: () => [],
  },
  inlineIndent: {
    type: Number,
    default: 24,
  },
  collapsed: {
    type: Boolean,
    default: false,
  },
} as const

export type MenuProps = ExtractPropTypes<typeof menuProps>

export interface MenuContext {
  mode: Ref<MenuMode>
  theme: Ref<MenuTheme>
  selectedKeys: Ref<(string | number)[]>
  openKeys: Ref<(string | number)[]>
  inlineIndent: Ref<number>
  collapsed: Ref<boolean>
  selectItem: (key: string | number) => void
  toggleSubmenu: (key: string | number) => void
}

export const menuContextKey: InjectionKey<MenuContext> = Symbol('MenuContext')
