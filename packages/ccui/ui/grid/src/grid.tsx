import type { CSSProperties } from 'vue'
import type { Breakpoint, ColProps, ColSize, ColSizeProp, Gutter, RowContext, RowProps } from './grid-types'
import { computed, defineComponent, inject, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { BREAKPOINT_PX, BREAKPOINTS, colProps, ROW_INJECT_KEY, rowProps } from './grid-types'
import './grid.scss'

function useScreens() {
  const screens = ref<Record<Breakpoint, boolean>>({
    xs: true,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    xxl: false,
  })

  const update = () => {
    if (typeof window === 'undefined') {
      return
    }
    const w = window.innerWidth
    BREAKPOINTS.forEach((bp) => {
      screens.value[bp] = w >= BREAKPOINT_PX[bp]
    })
  }

  onMounted(() => {
    update()
    window.addEventListener('resize', update)
  })

  onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', update)
    }
  })

  return screens
}

function resolveGutter(gutter: Gutter, screens: Record<Breakpoint, boolean>): [number, number] {
  if (typeof gutter === 'number') {
    return [gutter, 0]
  }
  if (Array.isArray(gutter)) {
    return [gutter[0] ?? 0, gutter[1] ?? 0]
  }
  if (typeof gutter === 'object' && gutter !== null) {
    let resolved: number | [number, number] | undefined
    for (const bp of BREAKPOINTS) {
      if (screens[bp] && gutter[bp] !== undefined) {
        resolved = gutter[bp]
      }
    }
    if (typeof resolved === 'number') {
      return [resolved, 0]
    }
    if (Array.isArray(resolved)) {
      return [resolved[0] ?? 0, resolved[1] ?? 0]
    }
  }
  return [0, 0]
}

export const Row = defineComponent({
  name: 'CRow',
  props: rowProps,
  setup(props: RowProps, { slots }) {
    const ns = useNamespace('row')
    const screens = useScreens()

    const gutterValue = computed(() => resolveGutter(props.gutter, screens.value))

    provide<RowContext>(ROW_INJECT_KEY, {
      get gutter() {
        return gutterValue.value
      },
    } as unknown as RowContext)

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m(`justify-${props.justify}`)]: true,
      [ns.m(`align-${props.align}`)]: true,
      [ns.m('no-wrap')]: !props.wrap,
    }))

    const style = computed<CSSProperties>(() => {
      const [h, v] = gutterValue.value
      return {
        marginInlineStart: h > 0 ? `${-h / 2}px` : undefined,
        marginInlineEnd: h > 0 ? `${-h / 2}px` : undefined,
        rowGap: v > 0 ? `${v}px` : undefined,
      }
    })

    return () => (
      <div class={cls.value} style={style.value}>
        {slots.default?.()}
      </div>
    )
  },
})

function normalizeSize(size: ColSizeProp | undefined): ColSize {
  if (size === undefined || size === null) {
    return {}
  }
  if (typeof size === 'number' || typeof size === 'string') {
    return { span: Number(size) }
  }
  return size
}

export const Col = defineComponent({
  name: 'CCol',
  props: colProps,
  setup(props: ColProps, { slots }) {
    const ns = useNamespace('col')
    const ctx = inject<RowContext | null>(ROW_INJECT_KEY, null)

    const computedSizes = computed(() => {
      const result: Partial<Record<Breakpoint, ColSize>> = {}
      BREAKPOINTS.forEach((bp) => {
        const raw = (props as any)[bp]
        if (raw !== undefined) {
          result[bp] = normalizeSize(raw)
        }
      })
      return result
    })

    const cls = computed(() => {
      const c: Record<string, boolean> = {
        [ns.b()]: true,
      }
      const span = props.span !== undefined ? Number(props.span) : undefined
      if (span !== undefined) {
        c[ns.m(`span-${span}`)] = true
      }
      if (props.order !== undefined) {
        c[ns.m(`order-${props.order}`)] = true
      }
      if (props.offset !== undefined) {
        c[ns.m(`offset-${props.offset}`)] = true
      }
      if (props.push !== undefined) {
        c[ns.m(`push-${props.push}`)] = true
      }
      if (props.pull !== undefined) {
        c[ns.m(`pull-${props.pull}`)] = true
      }
      Object.entries(computedSizes.value).forEach(([bp, size]) => {
        if (size.span !== undefined) {
          c[ns.m(`${bp}-${size.span}`)] = true
        }
        if (size.offset !== undefined) {
          c[ns.m(`${bp}-offset-${size.offset}`)] = true
        }
        if (size.order !== undefined) {
          c[ns.m(`${bp}-order-${size.order}`)] = true
        }
        if (size.push !== undefined) {
          c[ns.m(`${bp}-push-${size.push}`)] = true
        }
        if (size.pull !== undefined) {
          c[ns.m(`${bp}-pull-${size.pull}`)] = true
        }
      })
      return c
    })

    const style = computed<CSSProperties>(() => {
      const s: CSSProperties = {}
      const [h] = ctx?.gutter ?? [0, 0]
      if (h > 0) {
        s.paddingInlineStart = `${h / 2}px`
        s.paddingInlineEnd = `${h / 2}px`
      }
      if (props.flex !== undefined) {
        const flex = typeof props.flex === 'number' ? `${props.flex} ${props.flex} auto` : String(props.flex)
        s.flex = flex
      }
      return s
    })

    return () => (
      <div class={cls.value} style={style.value}>
        {slots.default?.()}
      </div>
    )
  },
})
