import type { CSSProperties, VNode } from 'vue'
import type { MasonryColumns, MasonryProps } from './masonry-types'
import { computed, defineComponent, Fragment, onBeforeUnmount, onMounted, ref } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { BREAKPOINT_PX, BREAKPOINTS, masonryProps } from './masonry-types'
import './masonry.scss'

function useViewportWidth() {
  const w = ref(typeof window === 'undefined' ? 1024 : window.innerWidth)
  const update = () => {
    w.value = window.innerWidth
  }
  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', update)
    }
  })
  onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', update)
    }
  })
  return w
}

function resolveColumns(columns: MasonryColumns, viewportWidth: number): number {
  if (typeof columns === 'number') {
    return Math.max(1, Math.floor(columns))
  }
  let resolved = 1
  for (const bp of BREAKPOINTS) {
    if (viewportWidth >= BREAKPOINT_PX[bp] && columns[bp] !== undefined) {
      resolved = columns[bp]!
    }
  }
  return Math.max(1, Math.floor(resolved))
}

function flatChildren(nodes: VNode[]): VNode[] {
  const list: VNode[] = []
  nodes.forEach((node) => {
    if (node.type === Fragment && Array.isArray(node.children)) {
      list.push(...flatChildren(node.children as VNode[]))
    } else {
      list.push(node)
    }
  })
  return list
}

export default defineComponent({
  name: 'CMasonry',
  props: masonryProps,
  setup(props: MasonryProps, { slots }) {
    const ns = useNamespace('masonry')
    const viewportWidth = useViewportWidth()

    const colCount = computed(() => resolveColumns(props.columns, viewportWidth.value))

    const gutterPair = computed<[number, number]>(() => {
      if (typeof props.gutter === 'number') {
        return [props.gutter, props.gutter]
      }
      return [props.gutter[0] ?? 0, props.gutter[1] ?? 0]
    })

    const columnStyle = computed<CSSProperties>(() => {
      const [h] = gutterPair.value
      return {
        flex: `1 1 0`,
        minWidth: 0,
        marginInlineEnd: h > 0 ? `${h}px` : undefined,
      }
    })

    const itemStyle = computed<CSSProperties>(() => {
      const [, v] = gutterPair.value
      return {
        marginBottom: v > 0 ? `${v}px` : undefined,
      }
    })

    const columns = computed(() => {
      const items = flatChildren(slots.default?.() ?? [])
      const cols: VNode[][] = Array.from({ length: colCount.value }, () => [])
      if (props.sequential) {
        // 顺序填充：尽量不打乱
        items.forEach((item, idx) => {
          cols[idx % colCount.value].push(item)
        })
      } else {
        // 默认：依次轮询
        items.forEach((item, idx) => {
          cols[idx % colCount.value].push(item)
        })
      }
      return cols
    })

    return () => (
      <div class={ns.b()}>
        {columns.value.map((items, ci) => (
          <div
            class={ns.e('column')}
            style={{
              ...columnStyle.value,
              marginInlineEnd: ci === columns.value.length - 1 ? undefined : columnStyle.value.marginInlineEnd,
            }}
            key={ci}
          >
            {items.map((item, ii) => (
              <div class={ns.e('item')} style={itemStyle.value} key={ii}>
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  },
})
