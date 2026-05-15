import type { SkeletonButtonProps } from './skeleton-button-types'
import { computed, defineComponent, h } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { skeletonButtonProps } from './skeleton-button-types'
import './skeleton-button.scss'

export default defineComponent({
  name: 'CSkeletonButton',
  props: skeletonButtonProps,
  setup(props: SkeletonButtonProps) {
    const ns = useNamespace('skeleton-button')
    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m(props.size)]: props.size && props.size !== 'default',
      [ns.m(props.shape)]: props.shape && props.shape !== 'default',
      [ns.m('block')]: props.block,
      [ns.m('active')]: props.active,
    }))
    return () => h('span', { class: cls.value, 'aria-busy': 'true', 'aria-hidden': 'true' })
  },
})
