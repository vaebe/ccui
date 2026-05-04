import type { MenuContext, MenuItem, MenuProps } from './menu-types'
import { computed, defineComponent, provide, ref, toRef, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { menuContextKey, menuProps } from './menu-types'
import './menu.scss'

interface RenderItemArgs {
  item: MenuItem
  level: number
  ns: ReturnType<typeof useNamespace>
  ctx: MenuContext
}

function renderItem({ item, level, ns, ctx }: RenderItemArgs): JSX.Element | null {
  if (item.type === 'divider') {
    return <li class={ns.e('divider')} role="separator" />
  }

  const isSelected = ctx.selectedKeys.value.includes(item.key)
  const indentStyle =
    ctx.mode.value === 'inline' ? { paddingInlineStart: `${ctx.inlineIndent.value * level}px` } : undefined

  if (item.children && item.children.length) {
    const isOpen = ctx.openKeys.value.includes(item.key)
    const titleCls = [
      ns.e('submenu-title'),
      isOpen && ns.em('submenu-title', 'open'),
      item.disabled && ns.em('submenu-title', 'disabled'),
    ]
    return (
      <li class={[ns.e('submenu'), isOpen && ns.em('submenu', 'open')]}>
        <div
          class={titleCls}
          style={indentStyle}
          onClick={() => {
            if (!item.disabled) {
              ctx.toggleSubmenu(item.key)
            }
          }}
        >
          {item.icon && <i class={[ns.e('icon'), item.icon]} />}
          <span class={ns.e('label')}>{item.label}</span>
          <span class={[ns.e('arrow'), isOpen && ns.em('arrow', 'open')]}>›</span>
        </div>
        {isOpen && (
          <ul class={ns.e('sub')} role="menu">
            {item.children.map((child) => renderItem({ item: child, level: level + 1, ns, ctx }))}
          </ul>
        )}
      </li>
    )
  }

  const itemCls = [ns.e('item'), isSelected && ns.em('item', 'selected'), item.disabled && ns.em('item', 'disabled')]
  return (
    <li
      class={itemCls}
      role="menuitem"
      style={indentStyle}
      onClick={() => {
        if (!item.disabled) {
          ctx.selectItem(item.key)
        }
      }}
    >
      {item.icon && <i class={[ns.e('icon'), item.icon]} />}
      <span class={ns.e('label')}>{item.label}</span>
    </li>
  )
}

export default defineComponent({
  name: 'CMenu',
  props: menuProps,
  emits: ['update:selectedKeys', 'update:openKeys', 'select', 'open-change'],
  setup(props: MenuProps, { emit, slots }) {
    const ns = useNamespace('menu')

    const innerSelected = ref<(string | number)[]>([...props.selectedKeys])
    const innerOpen = ref<(string | number)[]>([...props.openKeys])

    watch(
      () => props.selectedKeys,
      (val) => {
        innerSelected.value = [...val]
      },
    )
    watch(
      () => props.openKeys,
      (val) => {
        innerOpen.value = [...val]
      },
    )

    const selectItem = (key: string | number) => {
      innerSelected.value = [key]
      emit('update:selectedKeys', innerSelected.value)
      emit('select', key)
    }
    const toggleSubmenu = (key: string | number) => {
      const idx = innerOpen.value.indexOf(key)
      if (idx === -1) {
        innerOpen.value = [...innerOpen.value, key]
      } else {
        const next = innerOpen.value.slice()
        next.splice(idx, 1)
        innerOpen.value = next
      }
      emit('update:openKeys', innerOpen.value)
      emit('open-change', innerOpen.value)
    }

    const ctx: MenuContext = {
      mode: toRef(props, 'mode'),
      theme: toRef(props, 'theme'),
      selectedKeys: innerSelected,
      openKeys: innerOpen,
      inlineIndent: toRef(props, 'inlineIndent'),
      collapsed: toRef(props, 'collapsed'),
      selectItem,
      toggleSubmenu,
    }
    provide(menuContextKey, ctx)

    const rootCls = computed(() => ({
      [ns.b()]: true,
      [ns.m(props.mode)]: true,
      [ns.m(props.theme)]: true,
      [ns.m('collapsed')]: props.collapsed,
    }))

    return () => (
      <ul class={rootCls.value} role="menu">
        {props.items.length ? props.items.map((item) => renderItem({ item, level: 1, ns, ctx })) : slots.default?.()}
      </ul>
    )
  },
})
