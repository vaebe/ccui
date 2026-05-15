import type { CSSProperties } from 'vue'
import type { SkeletonNodeProps } from './skeleton-node-types'
import { computed, defineComponent, h } from 'vue'
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
        { class: cls.value, style: style.value, 'aria-busy': 'true', 'aria-hidden': 'true' },
        slots.default ? [slots.default()] : [],
      )
  },
})
