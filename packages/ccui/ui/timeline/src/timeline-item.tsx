import type { TimelineItemProps } from './timeline-types'
import { computed, defineComponent, h } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { timelineItemProps } from './timeline-types'

export default defineComponent({
  name: 'CTimelineItem',
  props: timelineItemProps,
  emits: [],
  setup(props: TimelineItemProps, { slots }) {
    const ns = useNamespace('timeline-item')

    // 计算节点的样式类名
    const nodeClasses = computed(() => {
      return [
        ns.e('node'),
        ns.em('node', props.size),
        props.type && ns.em('node', props.type),
        props.hollow && ns.is('hollow'),
      ].filter(Boolean)
    })

    // 计算时间戳的样式类名
    const timestampClasses = computed(() => {
      return [
        ns.e('timestamp'),
        ns.is(props.placement),
      ]
    })

    // 渲染图标
    const renderIcon = () => {
      if (props.icon) {
        if (typeof props.icon === 'string') {
          return <i class={[props.icon, ns.e('icon')]}></i>
        }
        else {
          // 如果是组件，使用 h 函数渲染
          return h(props.icon, { class: ns.e('icon') })
        }
      }
      return null
    }

    // 渲染节点
    const renderNode = () => {
      if (slots.dot) {
        return (
          <div class={ns.e('dot')}>
            {slots.dot()}
          </div>
        )
      }

      return (
        <div
          class={nodeClasses.value}
          style={props.color ? { backgroundColor: props.color, borderColor: props.color } : {}}
        >
          {renderIcon()}
        </div>
      )
    }

    // 渲染时间戳
    const renderTimestamp = () => {
      if (props.hideTimestamp)
        return null

      return (
        <div class={timestampClasses.value}>
          {props.timestamp}
        </div>
      )
    }

    return () => {
      return (
        <li class={[ns.b(), props.center && ns.e('center')]}>
          {/* 连接线 */}
          <div class={ns.e('tail')}></div>

          {/* 节点 */}
          {renderNode()}

          {/* 内容区域 */}
          <div class={ns.e('wrapper')}>
            {/* 顶部时间戳 */}
            {props.placement === 'top' && renderTimestamp()}

            {/* 内容 */}
            <div class={ns.e('content')}>
              {slots.default && slots.default()}
            </div>

            {/* 底部时间戳 */}
            {props.placement === 'bottom' && renderTimestamp()}
          </div>
        </li>
      )
    }
  },
})
