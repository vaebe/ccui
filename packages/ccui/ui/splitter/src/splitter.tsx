import type { CSSProperties } from 'vue'
import type { PanelProps, SplitterContext } from './splitter-types'
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

    const panels = reactive<{ id: number; props: PanelProps; size: number | undefined }[]>([])

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
      const isH = props.layout === 'horizontal'
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
      const isH = props.layout === 'horizontal'
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

    provide<SplitterContext>(SPLITTER_INJECT_KEY, {
      layout: props.layout,
      registerPanel,
      unregisterPanel,
      getSize,
      startResize,
    })

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m(props.layout)]: true,
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

    const isHorizontal = ctx?.layout === 'horizontal'

    const style = computed<CSSProperties>(() => {
      const size = ctx?.getSize(id)
      if (size === undefined) {
        return { flex: '1 1 0' }
      }
      const dim = isHorizontal ? 'width' : 'height'
      return {
        flex: '0 0 auto',
        [dim]: typeof size === 'number' ? `${size}px` : size,
      }
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
        isHorizontal ? ns.em('resizer', 'horizontal') : ns.em('resizer', 'vertical'),
      ]
      return (
        <>
          <div class={ns.b()} style={style.value}>
            {slots.default?.()}
          </div>
          {props.resizable && <div class={splitterCls} onPointerdown={onSplitterPointerDown} />}
        </>
      )
    }
  },
})
