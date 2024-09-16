import { computed, defineComponent } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import type { StatusProps } from './status-types'
import { statusProps } from './status-types'

import './status.scss'

export default defineComponent({
  name: 'CStatus',
  props: statusProps,
  setup(props: StatusProps, { slots }) {
    const ns = useNamespace('status')

    const cls = computed(() => {
      return `${ns.b()} ${ns.m(props.type)}`
    })

    return () => {
      return (
        <div class={cls.value}>
          <span>{slots.default && slots.default()}</span>
        </div>
      )
    }
  },
})
