import type { TimelineProps } from './timeline-types'
import { defineComponent, provide } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { timelineProps } from './timeline-types'
import './timeline.scss'

// Timeline 注入的 key，用于 TimelineItem 获取父组件信息
export const TIMELINE_INJECTION_KEY = Symbol('timeline')

export default defineComponent({
  name: 'CTimeline',
  props: timelineProps,
  emits: [],
  setup(props: TimelineProps, { slots }) {
    const ns = useNamespace('timeline')

    // 向子组件提供 Timeline 的插槽信息
    provide(TIMELINE_INJECTION_KEY, slots)

    return () => {
      return (
        <ul class={ns.b()}>
          {slots.default && slots.default()}
        </ul>
      )
    }
  },
})
