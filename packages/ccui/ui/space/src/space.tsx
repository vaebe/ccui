import type { CSSProperties, VNode } from 'vue'
import type { SpaceProps } from './space-types'
import { computed, defineComponent, Fragment } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { resolveSize, spaceProps } from './space-types'
import './space.scss'

function flatChildren(nodes: VNode[]): VNode[] {
  const list: VNode[] = []
  nodes.forEach((node) => {
    if (node.type === Fragment && Array.isArray(node.children)) {
      list.push(...flatChildren(node.children as VNode[]))
    } else if (node.type !== Comment) {
      list.push(node)
    }
  })
  return list
}

export default defineComponent({
  name: 'CSpace',
  props: spaceProps,
  setup(props: SpaceProps, { slots }) {
    const ns = useNamespace('space')

    const gap = computed(() => resolveSize(props.size))

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m(props.direction)]: true,
      [ns.m(`align-${props.align}`)]: !!props.align,
      [ns.m('wrap')]: props.wrap,
    }))

    const style = computed<CSSProperties>(() => {
      const [h, v] = gap.value
      return {
        columnGap: `${h}px`,
        rowGap: `${v}px`,
      }
    })

    return () => {
      const children = flatChildren(slots.default?.() ?? [])
      const splitContent = slots.split?.() ?? props.split
      const total = children.length

      return (
        <div class={cls.value} style={style.value}>
          {children.map((child, idx) => {
            const item = (
              <div class={ns.e('item')} key={idx}>
                {child}
              </div>
            )
            if (splitContent && idx < total - 1) {
              return (
                <Fragment key={idx}>
                  {item}
                  <span class={ns.e('split')}>{splitContent}</span>
                </Fragment>
              )
            }
            return item
          })}
        </div>
      )
    }
  },
})
