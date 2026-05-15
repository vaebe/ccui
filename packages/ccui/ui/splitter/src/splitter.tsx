import type { CSSProperties } from 'vue'
import type { PanelProps, SplitterContext, SplitterLayout } from './splitter-types'
import { computed, defineComponent, inject, onBeforeUnmount, provide, reactive, ref } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { panelProps, SPLITTER_INJECT_KEY, splitterProps } from './splitter-types'
import './splitter.scss'

let panelId = 0

function toNumber(v: number | string | undefined): number | undefined {
  if (v === undefined || v === null || v === '') {
    return undefined
  }
  if (typeof v === 'number') {
    return v
  }
  const n = Number.parseFloat(v)
  return Number.isNaN(n) ? undefined : n
}

export const Splitter = defineComponent({
  name: 'CSplitter',
  props: splitterProps,
  emits: ['resize', 'resizeStart', 'resizeEnd'],
  setup(props, { slots, emit }) {
    const ns = useNamespace('splitter')
    const containerRef = ref<HTMLElement | null>(null)

    // L-2.23：layout 显式优先；缺省时回落到 orientation 别名；都没传则默认 horizontal。
    const effectiveLayout = computed<SplitterLayout>(() => props.layout ?? props.orientation ?? 'horizontal')

    const panels = reactive<{ id: number; props: PanelProps; size: number | undefined }[]>([])

    // L-2.23：折叠状态。Map<panelId, prevSize>，prevSize 用于恢复时还原宽度。
    const collapsedPanels = reactive(new Map<number, number | undefined>())

    const registerPanel = (id: number, p: PanelProps) => {
      panels.push({
        id,
        props: p,
        size: toNumber(p.size ?? p.defaultSize),
      })
    }
    const unregisterPanel = (id: number) => {
      const i = panels.findIndex((p) => p.id === id)
      if (i >= 0) {
        panels.splice(i, 1)
      }
    }
    const getSize = (id: number) => panels.find((p) => p.id === id)?.size

    let dragState: { panelIdx: number; startPos: number; startA: number; startB: number; total: number } | null = null

    const computePixel = (panel: { props: PanelProps; size: number | undefined }, total: number): number => {
      if (panel.size !== undefined) {
        if (typeof panel.props.size === 'string' && panel.props.size.endsWith('%')) {
          return (panel.size / 100) * total
        }
        return panel.size
      }
      return total / panels.length
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!dragState || !containerRef.value) {
        return
      }
      const isH = effectiveLayout.value === 'horizontal'
      const delta = (isH ? e.clientX : e.clientY) - dragState.startPos
      const a = panels[dragState.panelIdx]
      const b = panels[dragState.panelIdx + 1]
      if (!a || !b) {
        return
      }
      const total = dragState.total
      const minA = toNumber(a.props.min) ?? 0
      const maxA = toNumber(a.props.max) ?? total
      const minB = toNumber(b.props.min) ?? 0
      const maxB = toNumber(b.props.max) ?? total
      let newA = dragState.startA + delta
      let newB = dragState.startB - delta
      newA = Math.max(minA, Math.min(maxA, newA))
      newB = dragState.startA + dragState.startB - newA
      newB = Math.max(minB, Math.min(maxB, newB))
      newA = dragState.startA + dragState.startB - newB
      a.size = newA
      b.size = newB
      emit(
        'resize',
        panels.map((p) => p.size),
      )
    }

    const onPointerUp = () => {
      if (dragState) {
        emit(
          'resizeEnd',
          panels.map((p) => p.size),
        )
      }
      dragState = null
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    const startResize = (id: number, e: PointerEvent) => {
      const idx = panels.findIndex((p) => p.id === id)
      if (idx < 0 || idx === panels.length - 1 || !containerRef.value) {
        return
      }
      const isH = effectiveLayout.value === 'horizontal'
      const rect = containerRef.value.getBoundingClientRect()
      const total = isH ? rect.width : rect.height
      // 把所有 panel size 转换为像素
      panels.forEach((p) => {
        p.size = computePixel(p, total)
      })
      const a = panels[idx]
      const b = panels[idx + 1]
      dragState = {
        panelIdx: idx,
        startPos: isH ? e.clientX : e.clientY,
        startA: a.size!,
        startB: b.size!,
        total,
      }
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
      document.body.style.cursor = isH ? 'col-resize' : 'row-resize'
      document.body.style.userSelect = 'none'
      emit(
        'resizeStart',
        panels.map((p) => p.size),
      )
    }

    onBeforeUnmount(() => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    })

    // L-2.23：折叠 panel 入口。toggle 时记录或恢复 size，让 panel style 计算走 collapsed=0 分支。
    const isCollapsed = (id: number) => collapsedPanels.has(id)
    const toggleCollapse = (id: number) => {
      const panel = panels.find((p) => p.id === id)
      if (!panel) return
      if (collapsedPanels.has(id)) {
        // 恢复：写回 prev size（可能是 undefined，等于 flex:1 1 0）。
        panel.size = collapsedPanels.get(id)
        collapsedPanels.delete(id)
      } else {
        collapsedPanels.set(id, panel.size)
        panel.size = 0
      }
    }

    provide<SplitterContext>(SPLITTER_INJECT_KEY, {
      // L-2.23：context 用 getter 暴露 layout，保证 orientation 别名生效后子 Panel 能拿到最新值。
      get layout() {
        return effectiveLayout.value
      },
      registerPanel,
      unregisterPanel,
      getSize,
      startResize,
      isCollapsed,
      toggleCollapse,
    })

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m(effectiveLayout.value)]: true,
    }))

    return () => (
      <div ref={containerRef} class={cls.value}>
        {slots.default?.()}
      </div>
    )
  },
})

export const Panel = defineComponent({
  name: 'CSplitterPanel',
  props: panelProps,
  setup(props: PanelProps, { slots }) {
    const ns = useNamespace('splitter-panel')
    const ctx = inject<SplitterContext | null>(SPLITTER_INJECT_KEY, null)
    const id = ++panelId

    if (ctx) {
      ctx.registerPanel(id, props)
    }
    onBeforeUnmount(() => {
      ctx?.unregisterPanel(id)
    })

    const isHorizontal = computed(() => ctx?.layout === 'horizontal')

    const style = computed<CSSProperties>(() => {
      // L-2.23：折叠状态下强制 flex:0 0 0 + 隐藏溢出。
      if (ctx?.isCollapsed(id)) {
        return { flex: '0 0 0', overflow: 'hidden' }
      }
      const size = ctx?.getSize(id)
      if (size === undefined) {
        return { flex: '1 1 0' }
      }
      const dim = isHorizontal.value ? 'width' : 'height'
      return {
        flex: '0 0 auto',
        [dim]: typeof size === 'number' ? `${size}px` : size,
      }
    })

    // L-2.23：collapsible 归一化为 { start, end } 对象。
    const collapsibleConfig = computed<{ start: boolean; end: boolean }>(() => {
      const c = props.collapsible
      if (c === true) return { start: true, end: true }
      if (!c) return { start: false, end: false }
      return { start: !!c.start, end: !!c.end }
    })

    const onSplitterPointerDown = (e: PointerEvent) => {
      if (!props.resizable || !ctx) {
        return
      }
      e.preventDefault()
      ctx.startResize(id, e)
    }

    return () => {
      const splitterCls = [
        ns.e('resizer'),
        isHorizontal.value ? ns.em('resizer', 'horizontal') : ns.em('resizer', 'vertical'),
      ]
      // L-2.23：折叠图标。collapsible.start → 把本 panel 折叠（向 start 方向消失）；collapsible.end → 把下一个 panel 折叠（向 end 方向消失）。
      // 这里简化为：showCollapsibleIcon 时把本 panel 的折叠按钮挂在 resizer 上，方向由 layout 决定。
      const showIcon = props.showCollapsibleIcon && (collapsibleConfig.value.start || collapsibleConfig.value.end)
      const collapsed = ctx?.isCollapsed(id) ?? false
      // 折叠按钮箭头朝向：未折叠时朝 start（指示「点击折叠到 start」），已折叠时朝 end。
      const arrow = isHorizontal.value ? (collapsed ? '▶' : '◀') : collapsed ? '▼' : '▲'

      return (
        <>
          <div class={ns.b()} style={style.value}>
            {slots.default?.()}
          </div>
          {props.resizable && (
            <div class={splitterCls} onPointerdown={onSplitterPointerDown}>
              {showIcon && (
                <button
                  type="button"
                  class={[ns.e('collapse-btn'), ns.em('collapse-btn', collapsed ? 'collapsed' : 'expanded')]}
                  aria-label={collapsed ? 'Expand panel' : 'Collapse panel'}
                  onClick={(e: MouseEvent) => {
                    e.stopPropagation()
                    ctx?.toggleCollapse(id)
                  }}
                  onPointerdown={(e: PointerEvent) => e.stopPropagation()}
                >
                  {arrow}
                </button>
              )}
            </div>
          )}
        </>
      )
    }
  },
})
