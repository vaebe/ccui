import type { MenuInfo, MenuItem, MenuKey, MenuOpenInfo, MenuProps } from './menu-types'
import type { UseNamespace } from '../../shared/hooks/use-namespace'
import { computed, defineComponent, getCurrentInstance, nextTick, provide, ref, toRef, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { menuContextKey, menuProps } from './menu-types'
import './menu.scss'

interface RenderItemArgs {
  item: MenuItem
  level: number
  keyPath: MenuKey[]
  ns: UseNamespace
  ctx: MenuRenderContext
}

interface FlatItem {
  item: MenuItem
  keyPath: MenuKey[]
  disabled: boolean
  isSubmenu: boolean
}

interface MenuRenderContext {
  mode: MenuProps['mode']
  selectedKeys: MenuKey[]
  openKeys: MenuKey[]
  inlineIndent: number
  collapsed: boolean
  disabled: boolean
  selectable: boolean
  multiple: boolean
  accordion: boolean
  forceSubMenuRender: boolean
  triggerSubMenuAction: MenuProps['triggerSubMenuAction']
  activeKey?: MenuKey
  selectItem: (item: MenuItem, keyPath: MenuKey[], domEvent?: MouseEvent | KeyboardEvent) => void
  toggleSubmenu: (item: MenuItem, keyPath: MenuKey[], domEvent?: MouseEvent | KeyboardEvent, open?: boolean) => void
  setActiveKey: (key: MenuKey) => void
}

function hasPropBinding(name: string): boolean {
  const vnodeProps = getCurrentInstance()?.vnode.props ?? {}
  const kebabName = name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
  return name in vnodeProps || kebabName in vnodeProps
}

function includesKey(keys: MenuKey[], key: MenuKey): boolean {
  return keys.includes(key)
}

function getItemTitle(item: MenuItem): string | undefined {
  if (item.title) {
    return item.title
  }
  return typeof item.label === 'string' ? item.label : undefined
}

function getVisibleItems(
  items: MenuItem[],
  openKeys: MenuKey[],
  disabled = false,
  parentPath: MenuKey[] = [],
): FlatItem[] {
  const result: FlatItem[] = []

  items.forEach((item) => {
    if (item.type === 'divider' || item.type === 'group') {
      if (item.type === 'group' && item.children?.length) {
        result.push(...getVisibleItems(item.children, openKeys, disabled || Boolean(item.disabled), parentPath))
      }
      return
    }

    const keyPath = [item.key, ...parentPath]
    const isSubmenu = Boolean(item.children?.length)
    const itemDisabled = disabled || Boolean(item.disabled)
    result.push({ item, keyPath, disabled: itemDisabled, isSubmenu })

    if (isSubmenu && includesKey(openKeys, item.key)) {
      result.push(...getVisibleItems(item.children!, openKeys, itemDisabled, keyPath))
    }
  })

  return result
}

function renderItem({ item, level, keyPath, ns, ctx }: RenderItemArgs): JSX.Element | null {
  if (item.type === 'divider') {
    return <li class={ns.e('divider')} role="separator" />
  }

  const disabled = ctx.disabled || Boolean(item.disabled)
  const indentStyle =
    ctx.mode === 'inline' && !ctx.collapsed ? { paddingInlineStart: `${ctx.inlineIndent * level}px` } : undefined

  if (item.type === 'group') {
    return (
      <li class={[ns.e('group'), disabled && ns.em('group', 'disabled')]} role="presentation">
        {item.label ? <div class={ns.e('group-title')}>{item.label}</div> : null}
        <ul class={ns.e('group-list')} role="group">
          {(item.children ?? []).map((child) => renderItem({ item: child, level: level + 1, keyPath, ns, ctx }))}
        </ul>
      </li>
    )
  }

  if (item.children?.length) {
    const isOpen = includesKey(ctx.openKeys, item.key)
    const nextKeyPath = [item.key, ...keyPath]

    return (
      <li
        class={[ns.e('submenu'), isOpen && ns.em('submenu', 'open'), disabled && ns.em('submenu', 'disabled')]}
        role="none"
        onMouseenter={(event: MouseEvent) => {
          if (!disabled && ctx.triggerSubMenuAction === 'hover') {
            ctx.toggleSubmenu(item, nextKeyPath, event, true)
          }
        }}
        onMouseleave={(event: MouseEvent) => {
          if (!disabled && ctx.triggerSubMenuAction === 'hover' && ctx.mode !== 'inline') {
            ctx.toggleSubmenu(item, nextKeyPath, event, false)
          }
        }}
      >
        <div
          class={[
            ns.e('submenu-title'),
            isOpen && ns.em('submenu-title', 'open'),
            disabled && ns.em('submenu-title', 'disabled'),
            item.danger && ns.em('submenu-title', 'danger'),
            ctx.activeKey === item.key && ns.em('submenu-title', 'active'),
          ]}
          style={indentStyle}
          role="menuitem"
          data-menu-key={String(item.key)}
          tabindex={-1}
          aria-disabled={disabled}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          title={getItemTitle(item)}
          onFocus={() => ctx.setActiveKey(item.key)}
          onMouseenter={() => ctx.setActiveKey(item.key)}
          onClick={(event: MouseEvent) => {
            if (!disabled && ctx.triggerSubMenuAction === 'click') {
              ctx.toggleSubmenu(item, nextKeyPath, event)
            }
          }}
        >
          {item.icon ? <i class={[ns.e('icon'), item.icon]} /> : null}
          <span class={ns.e('label')}>{item.label}</span>
          {item.extra ? <span class={ns.e('extra')}>{item.extra}</span> : null}
          <span class={[ns.e('arrow'), isOpen && ns.em('arrow', 'open')]} aria-hidden="true">
            &gt;
          </span>
        </div>
        {(isOpen || ctx.forceSubMenuRender) && (
          <ul class={[ns.e('sub'), !isOpen && ns.em('sub', 'hidden')]} role="menu">
            {item.children.map((child) => renderItem({ item: child, level: level + 1, keyPath: nextKeyPath, ns, ctx }))}
          </ul>
        )}
      </li>
    )
  }

  const selected = includesKey(ctx.selectedKeys, item.key)
  const nextKeyPath = [item.key, ...keyPath]

  return (
    <li
      class={[
        ns.e('item'),
        selected && ns.em('item', 'selected'),
        disabled && ns.em('item', 'disabled'),
        item.danger && ns.em('item', 'danger'),
        ctx.activeKey === item.key && ns.em('item', 'active'),
      ]}
      role="menuitem"
      data-menu-key={String(item.key)}
      tabindex={-1}
      aria-disabled={disabled}
      aria-selected={ctx.selectable ? selected : undefined}
      title={getItemTitle(item)}
      style={indentStyle}
      onFocus={() => ctx.setActiveKey(item.key)}
      onMouseenter={() => ctx.setActiveKey(item.key)}
      onClick={(event: MouseEvent) => {
        if (!disabled) {
          ctx.selectItem(item, nextKeyPath, event)
        }
      }}
    >
      {item.icon ? <i class={[ns.e('icon'), item.icon]} /> : null}
      <span class={ns.e('label')}>{item.label}</span>
      {item.extra ? <span class={ns.e('extra')}>{item.extra}</span> : null}
    </li>
  )
}

// 根据 keyPath 找到目标项真实的同级集合（keyPath 为 leaf-first：[item.key, parentKey, ..., rootKey]）
function findSiblingItems(roots: MenuItem[], keyPath: MenuKey[]): MenuItem[] {
  // 去掉自身 key 并反转，得到从根到直接父级的祖先顺序
  const ancestors = keyPath.slice(1).reverse()
  let level = roots
  for (const ancestorKey of ancestors) {
    const parent = level.find((m) => m.key === ancestorKey)
    if (!parent?.children?.length) return level
    level = parent.children
  }
  return level
}

export default defineComponent({
  name: 'CMenu',
  props: menuProps,
  emits: ['update:selectedKeys', 'update:openKeys', 'click', 'select', 'deselect', 'open-change', 'openChange'],
  setup(props: MenuProps, { emit, slots }) {
    const ns = useNamespace('menu')
    const rootRef = ref<HTMLElement | null>(null)
    const selectedControlled = hasPropBinding('selectedKeys')
    const openControlled = hasPropBinding('openKeys')
    const innerSelected = ref<MenuKey[]>(selectedControlled ? [...props.selectedKeys] : [...props.defaultSelectedKeys])
    const innerOpen = ref<MenuKey[]>(openControlled ? [...props.openKeys] : [...props.defaultOpenKeys])
    const activeKey = ref<MenuKey | undefined>()

    watch(
      () => props.selectedKeys,
      (val) => {
        if (selectedControlled) {
          innerSelected.value = [...val]
        }
      },
    )
    watch(
      () => props.openKeys,
      (val) => {
        if (openControlled) {
          innerOpen.value = [...val]
        }
      },
    )

    const actualCollapsed = computed(() => props.inlineCollapsed ?? props.collapsed)
    const selectedKeys = computed(() => (selectedControlled ? props.selectedKeys : innerSelected.value))
    const openKeys = computed(() => (openControlled ? props.openKeys : innerOpen.value))
    const renderedOpenKeys = computed(() => (actualCollapsed.value && props.mode === 'inline' ? [] : openKeys.value))
    const visibleItems = computed(() => getVisibleItems(props.items, renderedOpenKeys.value, props.disabled))

    watch(
      visibleItems,
      (items) => {
        if (!items.length) {
          activeKey.value = undefined
          return
        }
        if (activeKey.value === undefined || !items.some(({ item }) => item.key === activeKey.value)) {
          activeKey.value = items.find(({ disabled }) => !disabled)?.item.key ?? items[0].item.key
        }
      },
      { immediate: true },
    )

    const updateSelectedKeys = (nextKeys: MenuKey[]) => {
      if (!selectedControlled) {
        innerSelected.value = nextKeys
      }
      emit('update:selectedKeys', nextKeys)
    }

    const updateOpenKeys = (nextKeys: MenuKey[], info: MenuOpenInfo) => {
      if (!openControlled) {
        innerOpen.value = nextKeys
      }
      emit('update:openKeys', nextKeys)
      emit('open-change', nextKeys, info)
      emit('openChange', nextKeys, info)
    }

    const buildInfo = (item: MenuItem, keyPath: MenuKey[], domEvent?: MouseEvent | KeyboardEvent): MenuInfo => ({
      key: item.key,
      keyPath,
      item,
      selectedKeys: selectedKeys.value,
      domEvent,
    })

    const selectItem = (item: MenuItem, keyPath: MenuKey[], domEvent?: MouseEvent | KeyboardEvent) => {
      const clickInfo = buildInfo(item, keyPath, domEvent)
      emit('click', clickInfo)

      if (!props.selectable) {
        return
      }

      const isSelected = includesKey(selectedKeys.value, item.key)
      if (props.multiple) {
        const nextKeys = isSelected
          ? selectedKeys.value.filter((selectedKey) => selectedKey !== item.key)
          : [...selectedKeys.value, item.key]
        updateSelectedKeys(nextKeys)
        emit(isSelected ? 'deselect' : 'select', { ...clickInfo, selectedKeys: nextKeys })
        return
      }

      const nextKeys = [item.key]
      updateSelectedKeys(nextKeys)
      emit('select', { ...clickInfo, selectedKeys: nextKeys })
    }

    const toggleSubmenu = (
      item: MenuItem,
      keyPath: MenuKey[],
      domEvent?: MouseEvent | KeyboardEvent,
      open?: boolean,
    ) => {
      const currentOpen = includesKey(openKeys.value, item.key)
      const nextOpen = open ?? !currentOpen
      if (currentOpen === nextOpen) {
        return
      }

      let nextKeys = nextOpen ? [...openKeys.value, item.key] : openKeys.value.filter((openKey) => openKey !== item.key)

      if (props.accordion && nextOpen) {
        const siblings = findSiblingItems(props.items, keyPath)
        const siblingKeys = siblings
          .filter((menuItem) => menuItem.children?.length && menuItem.key !== item.key)
          .map((menuItem) => menuItem.key)
        nextKeys = nextKeys.filter((openKey) => !siblingKeys.includes(openKey) || openKey === item.key)
      }

      const info: MenuOpenInfo = {
        key: item.key,
        keyPath,
        item,
        open: nextOpen,
        openKeys: nextKeys,
        domEvent,
      }
      updateOpenKeys(nextKeys, info)
    }

    const setActiveKey = (key: MenuKey) => {
      activeKey.value = key
    }

    const focusActiveItem = async () => {
      await nextTick()
      if (!rootRef.value || activeKey.value === undefined) {
        return
      }
      const active = Array.from(rootRef.value.querySelectorAll<HTMLElement>('[data-menu-key]')).find(
        (element) => element.dataset.menuKey === String(activeKey.value),
      )
      active?.focus()
    }

    const moveActive = (direction: 1 | -1) => {
      const items = visibleItems.value
      if (!items.length) {
        return
      }
      const currentIndex = Math.max(
        0,
        items.findIndex(({ item }) => item.key === activeKey.value),
      )
      for (let offset = 1; offset <= items.length; offset += 1) {
        const nextIndex = (currentIndex + offset * direction + items.length) % items.length
        if (!items[nextIndex].disabled) {
          activeKey.value = items[nextIndex].item.key
          void focusActiveItem()
          return
        }
      }
    }

    const onKeydown = (event: KeyboardEvent) => {
      const active = visibleItems.value.find(({ item }) => item.key === activeKey.value)
      if (!active) {
        return
      }

      if (event.key === 'ArrowDown' || (props.mode === 'horizontal' && event.key === 'ArrowRight')) {
        event.preventDefault()
        moveActive(1)
        return
      }
      if (event.key === 'ArrowUp' || (props.mode === 'horizontal' && event.key === 'ArrowLeft')) {
        event.preventDefault()
        moveActive(-1)
        return
      }
      if (event.key === 'ArrowRight' && active.isSubmenu && !includesKey(openKeys.value, active.item.key)) {
        event.preventDefault()
        toggleSubmenu(active.item, active.keyPath, event, true)
        return
      }
      if (event.key === 'ArrowLeft' && active.isSubmenu && includesKey(openKeys.value, active.item.key)) {
        event.preventDefault()
        toggleSubmenu(active.item, active.keyPath, event, false)
        return
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        if (active.isSubmenu) {
          toggleSubmenu(active.item, active.keyPath, event)
        } else {
          selectItem(active.item, active.keyPath, event)
        }
      }
    }

    const ctxRef = computed<MenuRenderContext>(() => ({
      mode: props.mode,
      selectedKeys: selectedKeys.value,
      openKeys: renderedOpenKeys.value,
      inlineIndent: props.inlineIndent,
      collapsed: actualCollapsed.value,
      disabled: props.disabled,
      selectable: props.selectable,
      multiple: props.multiple,
      accordion: props.accordion,
      forceSubMenuRender: props.forceSubMenuRender,
      triggerSubMenuAction: props.triggerSubMenuAction,
      activeKey: activeKey.value,
      selectItem,
      toggleSubmenu,
      setActiveKey,
    }))

    provide(menuContextKey, {
      mode: toRef(props, 'mode'),
      theme: toRef(props, 'theme'),
      selectedKeys,
      openKeys,
      inlineIndent: toRef(props, 'inlineIndent'),
      collapsed: actualCollapsed,
      selectItem,
      toggleSubmenu,
    })

    const rootCls = computed(() => ({
      [ns.b()]: true,
      [ns.m(props.mode)]: true,
      [ns.m(props.theme)]: true,
      [ns.m('collapsed')]: actualCollapsed.value,
      [ns.m('disabled')]: props.disabled,
      [ns.m('multiple')]: props.multiple,
    }))

    return () => (
      <ul
        ref={rootRef}
        class={rootCls.value}
        role={props.mode === 'horizontal' ? 'menubar' : 'menu'}
        aria-orientation={props.mode === 'horizontal' ? 'horizontal' : 'vertical'}
        aria-disabled={props.disabled || undefined}
        tabindex={props.disabled ? undefined : 0}
        onKeydown={onKeydown}
      >
        {props.items.length
          ? props.items.map((item) => renderItem({ item, level: 1, keyPath: [], ns, ctx: ctxRef.value }))
          : slots.default?.()}
      </ul>
    )
  },
})
