import type { TimelineProps } from './timeline-types'
import { defineComponent } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { timelineProps } from './timeline-types'
import './timeline.scss'

export default defineComponent({
  name: 'CTimeline',
  props: timelineProps,
  emits: [],
  setup(props: TimelineProps, { slots }) {
    const ns = useNamespace('timeline')

    return () => {
      return (
        <ul class={ns.b()}>
          {slots.default && slots.default()}
        </ul>
      )
    }
  },
})
