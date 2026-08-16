import type { TimelineProps } from './timeline-types'
import { defineComponent, mergeProps, useAttrs } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { timelineProps } from './timeline-types'
import './timeline.scss'

export default defineComponent({
  name: 'CTimeline',
  inheritAttrs: false,
  props: timelineProps,
  emits: [],
  setup(props: TimelineProps, { slots }) {
    const ns = useNamespace('timeline')
    const attrs = useAttrs()

    return () => {
      // Keep consumer attributes on the semantic list root for labels and test hooks.
      return <ul {...mergeProps(attrs, { class: ns.b() })}>{slots.default && slots.default()}</ul>
    }
  },
})
