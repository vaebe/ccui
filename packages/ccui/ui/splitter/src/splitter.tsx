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

// 百分比字符串按 total 折算为像素，数值仍按像素原样返回（与 computePixel 约定一致）。
function toPixel(v: number | string | undefined, total: number): number | undefined {
  if (typeof v === 'string' && v.endsWith('%')) {
    const n = Number.parseFloat(v)
    return Number.isNaN(n) ? undefined : (n / 100) * total
  }
  return toNumber(v)
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

    const panels = reactive<{ id: number; props: PanelProps; size: number | undefined; pixelized: boolean }[]>([])

    // L-2.23：折叠状态。Map<panelId, prevSize>，prevSize 用于恢复时还原宽度。
    const collapsedPanels = reactive(new Map<number, number | undefined>())

    const registerPanel = (id: number, p: PanelProps) => {
      panels.push({
        id,
        props: p,
        size: toNumber(p.size ?? p.defaultSize),
        pixelized: false,
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
    let previousBodyCursor: string | null = null
    let previousBodyUserSelect: string | null = null

    const computePixel = (
      panel: { props: PanelProps; size: number | undefined; pixelized: boolean },
      total: number,
    ): number => {
      if (panel.size !== undefined) {
        // 仅在首次像素化前命中 % 分支，避免把已经是像素的 size 当成百分比再换算。
        if (!panel.pixelized && typeof panel.props.size === 'string' && panel.props.size.endsWith('%')) {
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
      const minA = toPixel(a.props.min, total) ?? 0
      const maxA = toPixel(a.props.max, total) ?? total
      const minB = toPixel(b.props.min, total) ?? 0
      const maxB = toPixel(b.props.max, total) ?? total
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
      window.removeEventListener('pointercancel', onPointerUp)
      if (previousBodyCursor !== null) {
        document.body.style.cursor = previousBodyCursor
        previousBodyCursor = null
      }
      if (previousBodyUserSelect !== null) {
        document.body.style.userSelect = previousBodyUserSelect
        previousBodyUserSelect = null
      }
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
        p.pixelized = true
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
      window.addEventListener('pointercancel', onPointerUp)
      previousBodyCursor = document.body.style.cursor
      previousBodyUserSelect = document.body.style.userSelect
      document.body.style.cursor = isH ? 'col-resize' : 'row-resize'
      document.body.style.userSelect = 'none'
      emit(
        'resizeStart',
        panels.map((p) => p.size),
      )
    }

    const getSeparatorValue = (id: number) => {
      const panel = panels.find((item) => item.id === id)
      return {
        min: toNumber(panel?.props.min) ?? 0,
        max: toNumber(panel?.props.max),
        now: panel?.size ?? toNumber(panel?.props.size ?? panel?.props.defaultSize) ?? 0,
      }
    }

    const resizeByKeyboard = (id: number, action: 'decrease' | 'increase' | 'min' | 'max') => {
      const idx = panels.findIndex((panel) => panel.id === id)
      if (idx < 0 || idx === panels.length - 1 || !containerRef.value) return
      const rect = containerRef.value.getBoundingClientRect()
      const total = effectiveLayout.value === 'horizontal' ? rect.width : rect.height
      panels.forEach((panel) => {
        panel.size = computePixel(panel, total)
        panel.pixelized = true
      })
      const a = panels[idx]
      const b = panels[idx + 1]
      const pairTotal = a.size! + b.size!
      const minA = toPixel(a.props.min, total) ?? 0
      const maxA = Math.min(toPixel(a.props.max, total) ?? total, pairTotal - (toPixel(b.props.min, total) ?? 0))
      let nextA = action === 'min' ? minA : action === 'max' ? maxA : a.size! + (action === 'increase' ? 10 : -10)
      nextA = Math.max(minA, Math.min(maxA, nextA))
      a.size = nextA
      b.size = pairTotal - nextA
      const sizes = panels.map((panel) => panel.size)
      emit('resize', sizes)
      emit('resizeEnd', sizes)
    }

    onBeforeUnmount(() => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      // 拖拽进行中被卸载时，还原 body 全局样式，避免残留 col-resize 光标与禁用文本选择。
      if (dragState) {
        document.body.style.cursor = previousBodyCursor ?? ''
        document.body.style.userSelect = previousBodyUserSelect ?? ''
      }
      previousBodyCursor = null
      previousBodyUserSelect = null
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
      resizeByKeyboard,
      getSeparatorValue,
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
        return { flex: '0 0 0px', overflow: 'hidden' }
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

    const onSplitterKeydown = (e: KeyboardEvent) => {
      if (!props.resizable || !ctx) return
      const decreaseKey = isHorizontal.value ? 'ArrowLeft' : 'ArrowUp'
      const increaseKey = isHorizontal.value ? 'ArrowRight' : 'ArrowDown'
      const action =
        e.key === decreaseKey
          ? 'decrease'
          : e.key === increaseKey
            ? 'increase'
            : e.key === 'Home'
              ? 'min'
              : e.key === 'End'
                ? 'max'
                : null
      if (!action) return
      e.preventDefault()
      ctx.resizeByKeyboard(id, action)
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
      const separatorValue = ctx?.getSeparatorValue(id)
      // 折叠按钮箭头朝向：未折叠时朝 start（指示「点击折叠到 start」），已折叠时朝 end。
      const arrow = isHorizontal.value ? (collapsed ? '▶' : '◀') : collapsed ? '▼' : '▲'

      return (
        <>
          <div class={ns.b()} style={style.value}>
            {slots.default?.()}
          </div>
          {props.resizable && (
            <div
              class={splitterCls}
              role="separator"
              tabindex={0}
              aria-orientation={isHorizontal.value ? 'vertical' : 'horizontal'}
              aria-valuemin={separatorValue?.min}
              aria-valuemax={separatorValue?.max}
              aria-valuenow={separatorValue?.now}
              onPointerdown={onSplitterPointerDown}
              onKeydown={onSplitterKeydown}
            >
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
