import type { SpaceCompactProps } from './space-compact-types'
import { cloneVNode, computed, defineComponent, mergeProps } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { spaceCompactProps } from './space-compact-types'
import './space-compact.scss'

export default defineComponent({
  name: 'CSpaceCompact',
  props: spaceCompactProps,
  setup(props: SpaceCompactProps, { slots }) {
    const ns = useNamespace('space-compact')

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m(props.direction)]: true,
      [ns.m(props.size)]: props.size && props.size !== 'middle',
      [ns.m('block')]: props.block,
    }))

    return () => {
      const children = slots.default?.() ?? []
      // Pass the compact size to child controls while preserving an explicit child size.
      const sizedChildren = children.map((child) => {
        // Native elements interpret `size` as a numeric HTML attribute; only
        // component VNodes should receive the compact control-size prop.
        if (typeof child.type === 'string') return child
        return cloneVNode(child, mergeProps({ size: props.size }, child.props ?? {}))
      })
      return <div class={cls.value}>{sizedChildren}</div>
    }
  },
})
