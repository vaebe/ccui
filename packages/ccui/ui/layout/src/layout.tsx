import type { CSSProperties } from 'vue'
import type { LayoutContext, SiderProps } from './layout-types'
import { computed, defineComponent, inject, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import {
  contentProps,
  footerProps,
  headerProps,
  LAYOUT_INJECT_KEY,
  layoutProps,
  SIDER_BREAKPOINT_PX,
  siderProps,
} from './layout-types'
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
  emits: ['update:collapsed', 'collapse', 'breakpoint'],
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

    // L-2.21：matchMedia 监听 breakpoint，命中（窗口变窄到断点以下）时自动 collapse；
    // 不命中时自动 uncollapse。同步 emit @breakpoint(broken)。
    let mql: MediaQueryList | null = null
    const onBreakpointChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const broken = e.matches
      emit('breakpoint', broken)
      // 自动切换 collapsed 态（受控时不覆盖父值）。
      if (props.collapsed === undefined) {
        innerCollapsed.value = broken
        emit('update:collapsed', broken)
        emit('collapse', broken, 'responsive')
      }
    }

    onMounted(() => {
      if (!props.breakpoint || typeof window === 'undefined' || !window.matchMedia) return
      const px = SIDER_BREAKPOINT_PX[props.breakpoint]
      mql = window.matchMedia(`(max-width: ${px - 1}px)`)
      // 首次主动评估一次（addEventListener 不会回放当前态）。
      onBreakpointChange(mql)
      mql.addEventListener('change', onBreakpointChange)
    })

    onBeforeUnmount(() => {
      if (mql) {
        mql.removeEventListener('change', onBreakpointChange)
        mql = null
      }
      // 卸载时从 Layout 注销自身，避免 siders 数组只增不减导致 has-sider 残留。
      ctx?.removeSider(id)
    })

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

    // L-2.21：collapsedWidth=0 时 Sider 在折叠态完全消失；此时触发器需要独立浮动渲染。
    const isZeroWidthMode = computed(
      () => isCollapsed.value && (props.collapsedWidth === 0 || props.collapsedWidth === '0'),
    )

    const renderTrigger = () => {
      if (!props.collapsible) {
        return null
      }
      if (props.trigger === null) {
        return null
      }
      const arrow = props.reverseArrow ? !isCollapsed.value : isCollapsed.value
      // L-2.21：zero-width 模式下应用 zeroWidthTriggerStyle inline，便于用户做浮动定位。
      const triggerStyle = isZeroWidthMode.value ? props.zeroWidthTriggerStyle : undefined
      const triggerCls = [ns.e('trigger'), isZeroWidthMode.value && ns.em('trigger', 'zero-width')]
      return (
        <div
          class={triggerCls}
          style={triggerStyle}
          role="button"
          tabindex={0}
          aria-expanded={!isCollapsed.value}
          onClick={toggle}
          onKeydown={(e: KeyboardEvent) => {
            // 键盘可达：Enter / Space 触发与 onClick 一致的折叠/展开逻辑
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              toggle()
            }
          }}
        >
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
