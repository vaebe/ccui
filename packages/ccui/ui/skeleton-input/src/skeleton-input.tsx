import type { SkeletonInputProps } from './skeleton-input-types'
import { computed, defineComponent, h } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { skeletonInputProps } from './skeleton-input-types'
import './skeleton-input.scss'

export default defineComponent({
  name: 'CSkeletonInput',
  props: skeletonInputProps,
  setup(props: SkeletonInputProps) {
    const ns = useNamespace('skeleton-input')
    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m(props.size)]: props.size && props.size !== 'default',
      [ns.m('block')]: props.block,
      [ns.m('active')]: props.active,
    }))
    return () => h('span', { class: cls.value, 'aria-busy': 'true', 'aria-hidden': 'true' })
  },
})
