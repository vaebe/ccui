import type { MenuInfo, MenuItem, MenuKey, MenuOpenInfo, MenuProps } from './menu-types'
import type { UseNamespace } from '../../shared/hooks/use-namespace'
import {
  computed,
  defineComponent,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  provide,
  ref,
  toRef,
  watch,
} from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { menuContextKey, menuProps } from './menu-types'
import './menu.scss'

interface RenderItemArgs {
  item: MenuItem
  level: number
  keyPath: MenuKey[]
  ancestorDisabled?: boolean
  keyPathValid?: boolean
  seenKeys: Set<string>
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
  setActiveKey: (key: MenuKey, clearPending?: boolean) => void
}

interface PendingSubmenuFocus {
  key: MenuKey
  boundary: 1 | -1
  intendedOpenKeys: MenuKey[]
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

/** 开发期报告全树 String(key) 冲突；DOM data 属性只能可靠区分该规范化结果。 */
function warnDuplicateKeys(items: MenuItem[]): void {
  const env = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env
  if (env?.NODE_ENV === 'production') return
  const seen = new Set<string>()
  const warned = new Set<string>()
  const visit = (entries: MenuItem[]) => {
    entries.forEach((item) => {
      const normalized = String(item.key)
      if (seen.has(normalized) && !warned.has(normalized)) {
        warned.add(normalized)
        console.warn(
          `[CCUI Menu] duplicate normalized key "${normalized}"; the first item is used for keyboard lookup.`,
        )
      }
      seen.add(normalized)
      if (item.children?.length) visit(item.children)
    })
  }
  visit(items)
}

function getVisibleItems(
  items: MenuItem[],
  openKeys: MenuKey[],
  disabled = false,
  parentPath: MenuKey[] = [],
  seenKeys = new Set<string>(),
): FlatItem[] {
  const result: FlatItem[] = []

  items.forEach((item) => {
    const normalizedKey = String(item.key)
    if (seenKeys.has(normalizedKey)) return
    seenKeys.add(normalizedKey)
    if (item.type === 'divider' || item.type === 'group') {
      if (item.type === 'group' && item.children?.length) {
        result.push(
          ...getVisibleItems(item.children, openKeys, disabled || Boolean(item.disabled), parentPath, seenKeys),
        )
      }
      return
    }

    const keyPath = [item.key, ...parentPath]
    const isSubmenu = Boolean(item.children?.length)
    const itemDisabled = disabled || Boolean(item.disabled)
    result.push({ item, keyPath, disabled: itemDisabled, isSubmenu })

    if (isSubmenu && includesKey(openKeys, item.key)) {
      result.push(...getVisibleItems(item.children!, openKeys, itemDisabled, keyPath, seenKeys))
    }
  })

  return result
}

/** 判断两个扁平项是否属于同一个菜单层，避免 popup 方向键越过兄弟边界。 */
function isSameLevel(left: FlatItem, right: FlatItem): boolean {
  const leftParents = left.keyPath.slice(1)
  const rightParents = right.keyPath.slice(1)
  return leftParents.length === rightParents.length && leftParents.every((key, index) => key === rightParents[index])
}

/**
 * 为失效的 roving 项寻找同层后继；移除项使用旧索引，禁用项从当前项之后开始。
 * 同层已无可用项时回退到首个全局可见项，确保菜单仍有一个键盘入口。
 */
function findActiveReplacement(
  items: FlatItem[],
  previousItems: FlatItem[],
  currentKey: MenuKey,
): FlatItem | undefined {
  const current = items.find(({ item }) => item.key === currentKey)
  const previous = previousItems.find(({ item }) => item.key === currentKey)
  const source = current ?? previous
  if (!source) {
    return items.find(({ disabled }) => !disabled)
  }

  const nextLevel = items.filter((candidate) => isSameLevel(candidate, source))
  const previousLevel = previousItems.filter((candidate) => isSameLevel(candidate, source))
  const startIndex = current
    ? nextLevel.findIndex(({ item }) => item.key === currentKey) + 1
    : previousLevel.findIndex(({ item }) => item.key === currentKey)
  for (let offset = 0; offset < nextLevel.length; offset += 1) {
    const candidate = nextLevel[(Math.max(0, startIndex) + offset) % nextLevel.length]
    if (!candidate.disabled) return candidate
  }
  return items.find(({ disabled }) => !disabled)
}

function renderItem({
  item,
  level,
  keyPath,
  ancestorDisabled = false,
  keyPathValid = true,
  seenKeys,
  ns,
  ctx,
}: RenderItemArgs): JSX.Element | null {
  const normalizedKey = String(item.key)
  const isFirstKey = keyPathValid && !seenKeys.has(normalizedKey)
  if (keyPathValid) seenKeys.add(normalizedKey)
  if (item.type === 'divider') {
    return <li key={item.key} class={ns.e('divider')} role="separator" />
  }

  // group/submenu 的 disabled 是树级约束，递归传递后点击、键盘和 ARIA 才会使用同一有效状态。
  const disabled = ctx.disabled || ancestorDisabled || Boolean(item.disabled)
  const indentStyle =
    ctx.mode === 'inline' && !ctx.collapsed ? { paddingInlineStart: `${ctx.inlineIndent * level}px` } : undefined

  if (item.type === 'group') {
    return (
      <li key={item.key} class={[ns.e('group'), disabled && ns.em('group', 'disabled')]} role="presentation">
        {item.label ? <div class={ns.e('group-title')}>{item.label}</div> : null}
        <ul class={ns.e('group-list')} role="group">
          {(item.children ?? []).map((child) =>
            renderItem({
              item: child,
              level: level + 1,
              keyPath,
              ancestorDisabled: disabled,
              keyPathValid: isFirstKey,
              seenKeys,
              ns,
              ctx,
            }),
          )}
        </ul>
      </li>
    )
  }

  if (item.children?.length) {
    const isOpen = includesKey(ctx.openKeys, item.key)
    const nextKeyPath = [item.key, ...keyPath]

    return (
      <li
        key={item.key}
        class={[ns.e('submenu'), isOpen && ns.em('submenu', 'open'), disabled && ns.em('submenu', 'disabled')]}
        role="none"
        onMouseenter={(event: MouseEvent) => {
          if (isFirstKey && !disabled && ctx.triggerSubMenuAction === 'hover') {
            ctx.toggleSubmenu(item, nextKeyPath, event, true)
          }
        }}
        onMouseleave={(event: MouseEvent) => {
          if (isFirstKey && !disabled && ctx.triggerSubMenuAction === 'hover' && ctx.mode !== 'inline') {
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
            isFirstKey && ctx.activeKey === item.key && ns.em('submenu-title', 'active'),
          ]}
          style={indentStyle}
          role="menuitem"
          data-menu-key={String(item.key)}
          tabindex={isFirstKey && !disabled && ctx.activeKey === item.key ? 0 : -1}
          aria-disabled={disabled || !isFirstKey}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          title={getItemTitle(item)}
          onFocus={() => {
            if (isFirstKey) ctx.setActiveKey(item.key)
          }}
          onMouseenter={() => {
            if (isFirstKey) ctx.setActiveKey(item.key, true)
          }}
          onClickCapture={(event: MouseEvent) => {
            if (disabled || !isFirstKey) {
              // capture 阶段必须截断，才能阻止 VNode/RouterLink 自己的目标 click handler 先执行。
              event.preventDefault()
              event.stopPropagation()
            }
          }}
          onClick={(event: MouseEvent) => {
            if (disabled || !isFirstKey) {
              // 禁用 submenu title 的 VNode label 也不得保留嵌套链接导航能力。
              event.preventDefault()
              event.stopPropagation()
              return
            }
            ctx.setActiveKey(item.key, true)
            if (ctx.triggerSubMenuAction === 'click') {
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
            {item.children.map((child) =>
              renderItem({
                item: child,
                level: level + 1,
                keyPath: nextKeyPath,
                ancestorDisabled: disabled,
                keyPathValid: isFirstKey,
                seenKeys,
                ns,
                ctx,
              }),
            )}
          </ul>
        )}
      </li>
    )
  }

  const selected = includesKey(ctx.selectedKeys, item.key)
  const nextKeyPath = [item.key, ...keyPath]
  // 可选择菜单使用 ARIA menuitemradio/checkbox，而不是 menuitem 不支持的 aria-selected。
  const itemRole = ctx.selectable ? (ctx.multiple ? 'menuitemcheckbox' : 'menuitemradio') : 'menuitem'

  return (
    <li
      key={item.key}
      class={[
        ns.e('item'),
        selected && ns.em('item', 'selected'),
        disabled && ns.em('item', 'disabled'),
        item.danger && ns.em('item', 'danger'),
        isFirstKey && ctx.activeKey === item.key && ns.em('item', 'active'),
      ]}
      role={itemRole}
      data-menu-key={String(item.key)}
      tabindex={isFirstKey && !disabled && ctx.activeKey === item.key ? 0 : -1}
      aria-disabled={disabled || !isFirstKey}
      aria-checked={ctx.selectable ? selected : undefined}
      title={getItemTitle(item)}
      style={indentStyle}
      onFocus={() => {
        if (isFirstKey) ctx.setActiveKey(item.key)
      }}
      onMouseenter={() => {
        if (isFirstKey) ctx.setActiveKey(item.key, true)
      }}
      onClickCapture={(event: MouseEvent) => {
        if (disabled || !isFirstKey) {
          // bubble 阶段才拦截会晚于嵌套链接自身 handler，禁用项必须在 capture 阶段终止激活。
          event.preventDefault()
          event.stopPropagation()
        }
      }}
      onClick={(event: MouseEvent) => {
        if (disabled || !isFirstKey) {
          // label 允许 VNode；禁用项必须同时阻止其中原生链接或 RouterLink 的默认导航和冒泡。
          event.preventDefault()
          event.stopPropagation()
          return
        }
        ctx.setActiveKey(item.key, true)
        ctx.selectItem(item, nextKeyPath, event)
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
  emits: ['update:selectedKeys', 'update:openKeys', 'click', 'select', 'deselect', 'open-change'],
  setup(props: MenuProps, { emit, slots }) {
    const ns = useNamespace('menu')
    const rootRef = ref<HTMLElement | null>(null)
    const selectedControlled = hasPropBinding('selectedKeys')
    const openControlled = hasPropBinding('openKeys')
    const innerSelected = ref<MenuKey[]>(selectedControlled ? [...props.selectedKeys] : [...props.defaultSelectedKeys])
    const innerOpen = ref<MenuKey[]>(openControlled ? [...props.openKeys] : [...props.defaultOpenKeys])
    const activeKey = ref<MenuKey | undefined>()
    const slotHasTabstop = ref(false)
    let pendingSubmenuFocus: PendingSubmenuFocus | null = null
    let focusingInternally = false
    let focusGeneration = 0
    let unmounted = false
    let focusRoot: HTMLElement | null = null

    /** 所有跨 tick 的焦点任务共用一个代次；新意图只需递增即可令所有旧任务失效。 */
    const invalidateFocusTasks = () => {
      focusGeneration += 1
    }

    const clearPendingFocus = () => {
      pendingSubmenuFocus = null
      invalidateFocusTasks()
    }

    watch(
      () => props.items,
      (items) => warnDuplicateKeys(items),
      { deep: true, immediate: true },
    )

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

    watch([() => props.mode, actualCollapsed], clearPendingFocus)

    const isCurrentMenuTarget = (target: HTMLElement): boolean =>
      target === rootRef.value || target.closest(`.${ns.b()}`) === rootRef.value

    const isFocusTaskCurrent = (generation: number): boolean =>
      !unmounted && generation === focusGeneration && Boolean(rootRef.value)

    /** 最终 focus 前再次核对代次和 root 所有权；内部同步事件不能反向取消当前任务。 */
    const focusForTask = (target: HTMLElement, generation: number) => {
      if (!isFocusTaskCurrent(generation) || !isCurrentMenuTarget(target)) return
      focusingInternally = true
      target.focus()
      focusingInternally = false
    }

    watch(
      visibleItems,
      (items, previousItems = []) => {
        // pre-flush 时旧 DOM 焦点仍可被识别；只有焦点原本在菜单内才迁移，避免抢占页面其他区域。
        const shouldRestoreFocus = Boolean(rootRef.value?.contains(document.activeElement))
        const current = items.find(({ item }) => item.key === activeKey.value)
        if (current && !current.disabled) return
        if (activeKey.value === undefined) {
          activeKey.value = items.find(({ disabled }) => !disabled)?.item.key
        } else {
          activeKey.value = findActiveReplacement(items, previousItems, activeKey.value)?.item.key
        }
        if (shouldRestoreFocus) {
          const generation = ++focusGeneration
          void nextTick(() => {
            if (!isFocusTaskCurrent(generation)) return
            const active = Array.from(rootRef.value?.querySelectorAll<HTMLElement>('[data-menu-key]') ?? []).find(
              (element) => element.dataset.menuKey === String(activeKey.value),
            )
            const target = active ?? rootRef.value
            if (!target) return
            const strategyStillValid = active
              ? active.tabIndex === 0 && active.dataset.menuKey === String(activeKey.value)
              : activeKey.value === undefined && target.tabIndex === 0
            if (strategyStillValid) focusForTask(target, generation)
          })
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
      // Vue 会把 kebab/camel listener 统一解析为 onOpenChange；只发一次 canonical 事件，避免同一 handler 重复。
      emit('open-change', nextKeys, info)
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
      baseOpenKeys: MenuKey[] = openKeys.value,
    ): MenuKey[] => {
      const currentOpen = includesKey(baseOpenKeys, item.key)
      const nextOpen = open ?? !currentOpen
      if (currentOpen === nextOpen) {
        return baseOpenKeys
      }

      let nextKeys = nextOpen ? [...baseOpenKeys, item.key] : baseOpenKeys.filter((openKey) => openKey !== item.key)

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
      return nextKeys
    }

    const setActiveKey = (key: MenuKey, clearPending = false) => {
      // 指针产生的新操作取代 pending；内部 focus() 触发的 onFocus 必须保留等待父级确认的请求。
      if (clearPending) clearPendingFocus()
      activeKey.value = key
    }

    const focusActiveItem = async (generation = ++focusGeneration, strategyIsValid: () => boolean = () => true) => {
      await nextTick()
      if (!isFocusTaskCurrent(generation) || !strategyIsValid() || !rootRef.value || activeKey.value === undefined) {
        return
      }
      const active = Array.from(rootRef.value.querySelectorAll<HTMLElement>('[data-menu-key]')).find(
        (element) => element.dataset.menuKey === String(activeKey.value),
      )
      const targetStillValid = active?.tabIndex === 0 && active.dataset.menuKey === String(activeKey.value)
      if (active && targetStillValid && strategyIsValid()) focusForTask(active, generation)
    }

    /** 只接管最近 menu/menubar 为当前 root 的 slot menuitem，嵌套 Menu 保持独立 roving 所有权。 */
    const getOwnedSlotItems = (includeDisabled = false) =>
      Array.from(rootRef.value?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []).filter((element) => {
        const owned = element.closest('[role="menu"], [role="menubar"]') === rootRef.value
        const disabled = element.getAttribute('aria-disabled') === 'true' || element.hasAttribute('disabled')
        return owned && (includeDisabled || !disabled)
      })

    /** 规范化 slot menuitem 的唯一 tab stop，并尽量保留当前 DOM 焦点/既有 tab stop。 */
    const syncSlotRoving = () => {
      if (props.items.length) {
        slotHasTabstop.value = false
        return
      }
      const allItems = getOwnedSlotItems(true)
      const enabledItems = getOwnedSlotItems()
      const current = enabledItems.find((element) => element === document.activeElement || element.tabIndex === 0)
      const active = current ?? enabledItems[0]
      allItems.forEach((element) => element.setAttribute('tabindex', element === active ? '0' : '-1'))
      slotHasTabstop.value = Boolean(active)
    }

    /** slot-only fallback 只依赖标准 role，提供最小 roving 与原生 click 激活，不推断业务 key/选中状态。 */
    const handleSlotKeydown = (event: KeyboardEvent): boolean => {
      const items = getOwnedSlotItems()
      const eventItem = (event.target as HTMLElement | null)?.closest?.<HTMLElement>('[role="menuitem"]')
      const activeItem = (document.activeElement as HTMLElement | null)?.closest?.<HTMLElement>('[role="menuitem"]')
      const ownedItems = getOwnedSlotItems(true)
      const target = eventItem && ownedItems.includes(eventItem) ? eventItem : undefined
      const active = activeItem && ownedItems.includes(activeItem) ? activeItem : undefined
      const activationItem = target ?? active
      if (
        (event.key === 'Enter' || event.key === ' ') &&
        activationItem &&
        (activationItem.getAttribute('aria-disabled') === 'true' || activationItem.hasAttribute('disabled'))
      ) {
        // 禁用目标不得回退激活另一个 roving 项；祖先 Menu 也不能再次处理同一按键。
        event.preventDefault()
        event.stopPropagation()
        return true
      }
      if (!items.length) return false
      const current =
        (target && items.includes(target) ? target : undefined) ??
        (active && items.includes(active) ? active : undefined) ??
        items.find((element) => element.tabIndex === 0) ??
        items[0]
      let next: HTMLElement | undefined
      if (event.key === 'Home') next = items[0]
      if (event.key === 'End') next = items.at(-1)
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        const direction = event.key === 'ArrowDown' ? 1 : -1
        const currentIndex = Math.max(0, items.indexOf(current))
        next = items[(currentIndex + direction + items.length) % items.length]
      }
      if (next) {
        event.preventDefault()
        event.stopPropagation()
        items.forEach((element) => element.setAttribute('tabindex', element === next ? '0' : '-1'))
        next.focus()
        return true
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        event.stopPropagation()
        current.click()
        return true
      }
      return false
    }

    /** popup 的上下键只遍历当前父级的直接同层项，不能跳到相邻 popup 或 menubar 根。 */
    const moveActive = (active: FlatItem, direction: 1 | -1) => {
      const candidates =
        props.mode === 'inline'
          ? visibleItems.value
          : visibleItems.value.filter((candidate) => isSameLevel(candidate, active))
      moveWithinItems(candidates, direction)
    }

    /** 在指定菜单项集合内循环移动，跳过所有禁用项。 */
    const moveWithinItems = (items: FlatItem[], direction: 1 | -1) => {
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

    /** 返回水平 menubar 的根项，排除已展开 popup 的子项。 */
    const horizontalRootItems = () => {
      const rootKeys = new Set(
        props.items.filter((item) => item.type !== 'divider' && item.type !== 'group').map((item) => item.key),
      )
      return visibleItems.value.filter(({ item }) => rootKeys.has(item.key))
    }

    /** 展开 submenu 后将焦点送入首/末个直接可用子项；受控未确认时不读取尚不存在的 DOM。 */
    const focusSubmenuBoundary = async (submenu: FlatItem, boundary: 1 | -1) => {
      const generation = ++focusGeneration
      await nextTick()
      if (!isFocusTaskCurrent(generation) || !includesKey(renderedOpenKeys.value, submenu.item.key)) return
      const children = visibleItems.value.filter((candidate) => {
        const parentPath = candidate.keyPath.slice(1)
        return (
          !candidate.disabled &&
          parentPath.length === submenu.keyPath.length &&
          parentPath.every((key, index) => key === submenu.keyPath[index])
        )
      })
      const child = boundary === 1 ? children[0] : children.at(-1)
      if (!child) return
      activeKey.value = child.item.key
      await focusActiveItem(generation, () => {
        if (!includesKey(renderedOpenKeys.value, submenu.item.key)) return false
        return visibleItems.value.some(
          (candidate) =>
            !candidate.disabled &&
            candidate.item.key === child.item.key &&
            candidate.keyPath.length === child.keyPath.length &&
            candidate.keyPath.every((key, index) => key === child.keyPath[index]),
        )
      })
    }

    /** 请求打开并进入 submenu；受控父级接受 openKeys 后才实际迁移焦点。 */
    const enterSubmenu = (submenu: FlatItem, boundary: 1 | -1, event: KeyboardEvent) => {
      const baseOpenKeys = pendingSubmenuFocus?.intendedOpenKeys ?? openKeys.value
      const alreadyIntendedOpen = includesKey(baseOpenKeys, submenu.item.key)
      const alreadyRenderedOpen = includesKey(renderedOpenKeys.value, submenu.item.key)
      const intendedOpenKeys = alreadyIntendedOpen
        ? baseOpenKeys
        : toggleSubmenu(submenu.item, submenu.keyPath, event, true, baseOpenKeys)
      if (openControlled && !alreadyRenderedOpen) {
        // 连续 Down/Up 只更新同一意图的边界，不再把旧受控 props 中已请求关闭的 key 合并回来。
        pendingSubmenuFocus = { key: submenu.item.key, boundary, intendedOpenKeys }
        activeKey.value = submenu.item.key
        void focusActiveItem()
        return
      }
      void focusSubmenuBoundary(submenu, boundary)
    }

    /**
     * 水平 popup 内的左右键切换根项时先关闭旧根；若相邻根也是 submenu，则打开并进入其首个子项。
     * 根 title 上未展开时仍只做普通 menubar roving，不擅自打开菜单。
     */
    const moveHorizontal = (active: FlatItem, direction: 1 | -1, event: KeyboardEvent) => {
      const roots = horizontalRootItems()
      if (!roots.length) return
      const rootKey = active.keyPath.at(-1) ?? active.item.key
      const rootIndex = Math.max(
        0,
        roots.findIndex(({ item }) => item.key === rootKey),
      )
      const nextRoot = Array.from({ length: roots.length - 1 }, (_, offset) => {
        const index = (rootIndex + (offset + 1) * direction + roots.length) % roots.length
        return roots[index]
      }).find(({ disabled }) => !disabled)
      if (!nextRoot) return

      const oldRoot = roots[rootIndex]
      const baseOpenKeys = pendingSubmenuFocus?.intendedOpenKeys ?? openKeys.value
      const switchingOpenPopup = active.keyPath.length > 1 || includesKey(baseOpenKeys, oldRoot.item.key)
      let intendedOpenKeys = baseOpenKeys
      activeKey.value = nextRoot.item.key
      if (switchingOpenPopup) {
        // 一次性替换 openKeys，避免受控模式连续 close/open 都基于尚未更新的旧 props，并清掉旧焦点路径上的祖先。
        const oldAncestorKeys = new Set(
          [oldRoot.item.key, ...active.keyPath.slice(1)].filter((key) => includesKey(baseOpenKeys, key)),
        )
        const nextKeys = baseOpenKeys.filter((key) => !oldAncestorKeys.has(key))
        const opensNext = nextRoot.isSubmenu && !includesKey(nextKeys, nextRoot.item.key)
        if (opensNext) nextKeys.push(nextRoot.item.key)
        const changedItem = opensNext ? nextRoot : oldRoot
        updateOpenKeys(nextKeys, {
          key: changedItem.item.key,
          keyPath: changedItem.keyPath,
          item: changedItem.item,
          open: opensNext,
          openKeys: nextKeys,
          domEvent: event,
        })
        intendedOpenKeys = nextKeys
      }
      if (switchingOpenPopup && nextRoot.isSubmenu) {
        const alreadyRendered = includesKey(renderedOpenKeys.value, nextRoot.item.key)
        if (openControlled && !alreadyRendered) {
          pendingSubmenuFocus = { key: nextRoot.item.key, boundary: 1, intendedOpenKeys }
          void focusActiveItem()
        } else {
          clearPendingFocus()
          void focusSubmenuBoundary(nextRoot, 1)
        }
      } else {
        clearPendingFocus()
        void focusActiveItem()
      }
    }

    watch(
      () => props.openKeys,
      (keys) => {
        const pending = pendingSubmenuFocus
        if (!openControlled || !pending) return
        clearPendingFocus()
        const submenu = visibleItems.value.find(({ item }) => item.key === pending.key)
        if (keys.includes(pending.key) && submenu) {
          void focusSubmenuBoundary(submenu, pending.boundary)
        } else {
          // 父级拒绝请求时不渲染/进入子项，焦点明确留在当前根 title。
          void focusActiveItem()
        }
      },
    )

    /** 聚焦给定集合中的首个或末个可用项，用于 Home/End 的 roving tabindex 行为。 */
    const moveToBoundary = (direction: 1 | -1) => {
      const candidates = props.mode === 'horizontal' ? horizontalRootItems() : visibleItems.value
      const items = direction === 1 ? candidates : [...candidates].reverse()
      const target = items.find(({ disabled }) => !disabled)
      if (!target) return
      activeKey.value = target.item.key
      void focusActiveItem()
    }

    /** 关闭当前子菜单或最近的展开祖先，并把焦点送回对应 title。 */
    const closeCurrentSubmenu = (active: FlatItem, event: KeyboardEvent): boolean => {
      const submenuKey =
        active.isSubmenu && includesKey(openKeys.value, active.item.key)
          ? active.item.key
          : active.keyPath.slice(1).find((key) => includesKey(openKeys.value, key))
      if (submenuKey === undefined) return false
      const submenu = visibleItems.value.find(({ item }) => item.key === submenuKey)
      if (!submenu) return false
      toggleSubmenu(submenu.item, submenu.keyPath, event, false)
      activeKey.value = submenu.item.key
      void focusActiveItem()
      return true
    }

    const onKeydown = (event: KeyboardEvent) => {
      if (!props.items.length) {
        clearPendingFocus()
        if (handleSlotKeydown(event)) return
      }
      // programmatic focus may land on tabindex=-1 disabled VNode；按真实事件目标判定，不能误激活旧 tab stop。
      const targetKey = (event.target as HTMLElement | null)?.closest?.<HTMLElement>('[data-menu-key]')?.dataset.menuKey
      const active = visibleItems.value.find(({ item }) =>
        targetKey === undefined ? item.key === activeKey.value : String(item.key) === targetKey,
      )
      if (!active) {
        return
      }

      if (event.key === 'Home' || event.key === 'End') {
        clearPendingFocus()
        event.preventDefault()
        moveToBoundary(event.key === 'Home' ? 1 : -1)
        return
      }
      if (event.key === 'Escape') {
        clearPendingFocus()
        if (closeCurrentSubmenu(active, event)) event.preventDefault()
        return
      }
      if (props.mode === 'horizontal' && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
        event.preventDefault()
        moveHorizontal(active, event.key === 'ArrowRight' ? 1 : -1, event)
        return
      }
      if (event.key === 'ArrowDown') {
        if (props.mode === 'horizontal' && active.isSubmenu && active.keyPath.length === 1) {
          event.preventDefault()
          enterSubmenu(active, 1, event)
          return
        }
        if (props.mode === 'horizontal' && active.keyPath.length === 1) return
        clearPendingFocus()
        event.preventDefault()
        moveActive(active, 1)
        return
      }
      if (event.key === 'ArrowUp') {
        if (props.mode === 'horizontal' && active.isSubmenu && active.keyPath.length === 1) {
          event.preventDefault()
          enterSubmenu(active, -1, event)
          return
        }
        if (props.mode === 'horizontal' && active.keyPath.length === 1) return
        clearPendingFocus()
        event.preventDefault()
        moveActive(active, -1)
        return
      }
      if (event.key === 'ArrowRight' && active.isSubmenu) {
        event.preventDefault()
        enterSubmenu(active, 1, event)
        return
      }
      if (event.key === 'ArrowLeft') {
        clearPendingFocus()
        if (closeCurrentSubmenu(active, event)) event.preventDefault()
        return
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        const baseOpenKeys = pendingSubmenuFocus?.intendedOpenKeys ?? openKeys.value
        clearPendingFocus()
        if (active.disabled) return
        if (active.isSubmenu) {
          toggleSubmenu(active.item, active.keyPath, event, undefined, baseOpenKeys)
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
    const rootTabindex = computed(() =>
      props.items.length
        ? visibleItems.value.some(({ item, disabled }) => !disabled && item.key === activeKey.value)
          ? undefined
          : 0
        : slotHasTabstop.value
          ? undefined
          : 0,
    )

    /** 真实 focusin 或离开 root 的 focusout 都取消 pending；内部预期 focus() 由同步标志豁免。 */
    const onRealFocusChange = () => {
      if (!focusingInternally) clearPendingFocus()
    }

    onMounted(() => {
      focusRoot = rootRef.value
      syncSlotRoving()
    })
    onUpdated(() => {
      if (focusRoot !== rootRef.value) {
        focusRoot = rootRef.value
        clearPendingFocus()
      }
      syncSlotRoving()
    })
    onBeforeUnmount(() => {
      unmounted = true
      clearPendingFocus()
    })

    return () => (
      <ul
        ref={rootRef}
        class={rootCls.value}
        role={props.mode === 'horizontal' ? 'menubar' : 'menu'}
        aria-orientation={props.mode === 'horizontal' ? 'horizontal' : 'vertical'}
        aria-disabled={props.disabled || undefined}
        tabindex={rootTabindex.value}
        onFocusin={onRealFocusChange}
        onFocusout={onRealFocusChange}
        onKeydown={onKeydown}
      >
        {props.items.length
          ? (() => {
              const seenKeys = new Set<string>()
              return props.items.map((item) =>
                renderItem({
                  item,
                  level: 1,
                  keyPath: [],
                  ancestorDisabled: false,
                  keyPathValid: true,
                  seenKeys,
                  ns,
                  ctx: ctxRef.value,
                }),
              )
            })()
          : slots.default?.()}
      </ul>
    )
  },
})
