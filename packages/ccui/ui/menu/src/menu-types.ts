import type { ExtractPropTypes, InjectionKey, PropType, Ref, VNodeChild } from 'vue'

export type MenuMode = 'vertical' | 'horizontal' | 'inline'
export type MenuTheme = 'light' | 'dark'
export type MenuKey = string | number
export type MenuTriggerAction = 'click' | 'hover'

export interface MenuInfo {
  key: MenuKey
  keyPath: MenuKey[]
  item: MenuItem
  selectedKeys: MenuKey[]
  domEvent?: MouseEvent | KeyboardEvent
}

export interface MenuOpenInfo {
  key: MenuKey
  open: boolean
  openKeys: MenuKey[]
  keyPath: MenuKey[]
  item: MenuItem
  domEvent?: MouseEvent | KeyboardEvent
}

export interface MenuItem {
  key: MenuKey
  label?: VNodeChild
  title?: string
  icon?: string
  disabled?: boolean
  danger?: boolean
  extra?: VNodeChild
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
    type: Array as PropType<MenuKey[]>,
    default: () => [],
  },
  defaultSelectedKeys: {
    type: Array as PropType<MenuKey[]>,
    default: () => [],
  },
  openKeys: {
    type: Array as PropType<MenuKey[]>,
    default: () => [],
  },
  defaultOpenKeys: {
    type: Array as PropType<MenuKey[]>,
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
  inlineCollapsed: {
    type: Boolean,
    default: undefined,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  selectable: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  accordion: {
    type: Boolean,
    default: false,
  },
  forceSubMenuRender: {
    type: Boolean,
    default: false,
  },
  triggerSubMenuAction: {
    type: String as PropType<MenuTriggerAction>,
    default: 'click' as MenuTriggerAction,
  },
} as const

export type MenuProps = ExtractPropTypes<typeof menuProps>

export interface MenuContext {
  mode: Ref<MenuMode>
  theme: Ref<MenuTheme>
  selectedKeys: Ref<MenuKey[]>
  openKeys: Ref<MenuKey[]>
  inlineIndent: Ref<number>
  collapsed: Ref<boolean>
  selectItem: (item: MenuItem, keyPath: MenuKey[], domEvent?: MouseEvent | KeyboardEvent) => void
  toggleSubmenu: (item: MenuItem, keyPath: MenuKey[], domEvent?: MouseEvent | KeyboardEvent, open?: boolean) => void
}

export const menuContextKey: InjectionKey<MenuContext> = Symbol('MenuContext')
