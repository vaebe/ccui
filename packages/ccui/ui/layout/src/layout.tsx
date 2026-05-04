import type { CSSProperties } from 'vue'
import type { LayoutContext, SiderProps } from './layout-types'
import { computed, defineComponent, inject, provide, ref, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { contentProps, footerProps, headerProps, LAYOUT_INJECT_KEY, layoutProps, siderProps } from './layout-types'
import './layout.scss'

let siderId = 0

export const Layout = defineComponent({
  name: 'CLayout',
  props: layoutProps,
  setup(props, { slots }) {
    const ns = useNamespace('layout')
    const siders = ref<number[]>([])

    provide<LayoutContext>(LAYOUT_INJECT_KEY, {
      addSider(id) {
        if (!siders.value.includes(id)) {
          siders.value.push(id)
        }
      },
      removeSider(id) {
        const i = siders.value.indexOf(id)
        if (i >= 0) {
          siders.value.splice(i, 1)
        }
      },
    })

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m('has-sider')]: props.hasSider !== undefined ? props.hasSider : siders.value.length > 0,
    }))

    return () => <section class={cls.value}>{slots.default?.()}</section>
  },
})

export const Header = defineComponent({
  name: 'CLayoutHeader',
  props: headerProps,
  setup(_, { slots }) {
    const ns = useNamespace('layout-header')
    return () => <header class={ns.b()}>{slots.default?.()}</header>
  },
})

export const Footer = defineComponent({
  name: 'CLayoutFooter',
  props: footerProps,
  setup(_, { slots }) {
    const ns = useNamespace('layout-footer')
    return () => <footer class={ns.b()}>{slots.default?.()}</footer>
  },
})

export const Content = defineComponent({
  name: 'CLayoutContent',
  props: contentProps,
  setup(_, { slots }) {
    const ns = useNamespace('layout-content')
    return () => <main class={ns.b()}>{slots.default?.()}</main>
  },
})

export const Sider = defineComponent({
  name: 'CLayoutSider',
  props: siderProps,
  emits: ['update:collapsed', 'collapse'],
  setup(props: SiderProps, { slots, emit }) {
    const ns = useNamespace('layout-sider')
    const id = ++siderId
    const ctx = inject<LayoutContext | null>(LAYOUT_INJECT_KEY, null)

    const innerCollapsed = ref(props.defaultCollapsed)
    const isCollapsed = computed(() => (props.collapsed !== undefined ? props.collapsed : innerCollapsed.value))

    watch(
      () => props.collapsed,
      (val) => {
        if (val !== undefined) {
          innerCollapsed.value = val
        }
      },
    )

    if (ctx) {
      ctx.addSider(id)
    }

    const widthPx = computed(() => {
      const w = isCollapsed.value ? props.collapsedWidth : props.width
      return typeof w === 'number' ? `${w}px` : String(w)
    })

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m(props.theme)]: true,
      [ns.m('collapsed')]: isCollapsed.value,
      [ns.m('has-trigger')]: props.collapsible,
    }))

    const style = computed<CSSProperties>(() => ({
      flex: `0 0 ${widthPx.value}`,
      maxWidth: widthPx.value,
      minWidth: widthPx.value,
      width: widthPx.value,
    }))

    const toggle = () => {
      const next = !isCollapsed.value
      innerCollapsed.value = next
      emit('update:collapsed', next)
      emit('collapse', next, 'clickTrigger')
    }

    const renderTrigger = () => {
      if (!props.collapsible) {
        return null
      }
      if (props.trigger === null) {
        return null
      }
      const arrow = props.reverseArrow ? !isCollapsed.value : isCollapsed.value
      return (
        <div class={ns.e('trigger')} onClick={toggle}>
          {slots.trigger ? slots.trigger() : <span class={ns.e('trigger-arrow')}>{arrow ? '›' : '‹'}</span>}
        </div>
      )
    }

    return () => (
      <aside class={cls.value} style={style.value}>
        <div class={ns.e('children')}>{slots.default?.()}</div>
        {renderTrigger()}
      </aside>
    )
  },
})
