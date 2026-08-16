import type { CSSProperties } from 'vue'
import type { SkeletonNodeProps } from './skeleton-node-types'
import { computed, defineComponent, h, mergeProps, useAttrs } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { skeletonNodeProps } from './skeleton-node-types'
import './skeleton-node.scss'

function toCss(value: string | number): string {
  return typeof value === 'number' ? `${value}px` : value
}

export default defineComponent({
  name: 'CSkeletonNode',
  props: skeletonNodeProps,
  setup(props: SkeletonNodeProps, { slots }) {
    const ns = useNamespace('skeleton-node')
    const attrs = useAttrs()

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m('active')]: props.active,
    }))

    const style = computed<CSSProperties>(() => ({
      width: toCss(props.width),
      height: toCss(props.height),
    }))

    return () =>
      h(
        'span',
        {
          ...mergeProps(attrs, {
            class: cls.value,
            style: style.value,
            // The node is decorative placeholder content and must not be announced twice.
            'aria-busy': 'true',
            'aria-hidden': 'true',
          }),
        },
        slots.default ? [slots.default()] : [],
      )
  },
})
