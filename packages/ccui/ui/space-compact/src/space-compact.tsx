import type { SpaceCompactProps } from './space-compact-types'
import { computed, defineComponent } from 'vue'
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

    return () => <div class={cls.value}>{slots.default?.()}</div>
  },
})
