import type { CSSProperties, VNode } from 'vue'
import type { MasonryColumns, MasonryProps } from './masonry-types'
import { computed, defineComponent, Fragment, onBeforeUnmount, onMounted, ref } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { BREAKPOINT_PX, BREAKPOINTS, masonryProps } from './masonry-types'
import './masonry.scss'

function useViewportWidth() {
  // SSR 与 hydration 首帧必须使用同一宽度；真实视口在挂载后再应用，避免列结构不一致。
  const w = ref(1024)
  const update = () => {
    w.value = window.innerWidth
  }
  onMounted(() => {
    if (typeof window !== 'undefined') {
      update()
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
  const clamp = (value: number) => (Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1)
  if (typeof columns === 'number') {
    return clamp(columns)
  }
  let resolved = 1
  for (const bp of BREAKPOINTS) {
    if (viewportWidth >= BREAKPOINT_PX[bp] && columns[bp] !== undefined) {
      resolved = columns[bp]!
    }
  }
  return clamp(resolved)
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

    // 末列样式：与 columnStyle 同源派生，仅去掉右间距，避免渲染时为每列新建 style 对象
    const columnStyleLast = computed<CSSProperties>(() => ({
      ...columnStyle.value,
      marginInlineEnd: undefined,
    }))

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
        // 顺序填充保持子项顺序，按固定列轮询，避免依赖浏览器布局测量。
        items.forEach((item, idx) => cols[idx % colCount.value].push(item))
      } else {
        // 默认轮询分列，避免依赖浏览器布局测量，SSR 与客户端结果保持一致。
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
            style={ci === columns.value.length - 1 ? columnStyleLast.value : columnStyle.value}
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
