import type { StepItem, StepsProps, StepStatus } from './steps-types'
import { computed, defineComponent } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { stepsProps } from './steps-types'
import './steps.scss'

function resolveStatus(index: number, current: number, baseStatus: StepStatus, item?: StepItem): StepStatus {
  if (item?.status) {
    return item.status
  }
  if (index < current) {
    return 'finish'
  }
  if (index === current) {
    return baseStatus
  }
  return 'wait'
}

export default defineComponent({
  name: 'CSteps',
  props: stepsProps,
  emits: ['update:current', 'change'],
  setup(props: StepsProps, { emit, slots }) {
    const ns = useNamespace('steps')

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m(props.direction)]: true,
      [ns.m(props.size)]: true,
      [ns.m(props.type)]: true,
      [ns.m('label-vertical')]: props.direction === 'horizontal' && props.labelPlacement === 'vertical',
      [ns.m('dot')]: props.progressDot,
    }))

    const onItemClick = (index: number, item: StepItem) => {
      if (item.disabled) {
        return
      }
      emit('update:current', index)
      emit('change', index)
    }

    const renderIcon = (status: StepStatus, index: number, item: StepItem) => {
      if (props.progressDot) {
        return <span class={ns.e('dot')} />
      }
      if (item.icon) {
        return <i class={[ns.e('icon-custom'), item.icon]} />
      }
      if (status === 'finish') {
        return <span class={ns.e('check')}>✓</span>
      }
      if (status === 'error') {
        return <span class={ns.e('check')}>✕</span>
      }
      return <span class={ns.e('number')}>{index + 1}</span>
    }

    return () => (
      <div class={cls.value} role="list">
        {props.items.map((item, index) => {
          const status = resolveStatus(index, props.current, props.status, item)
          const isLast = index === props.items.length - 1
          const itemCls = [
            ns.e('item'),
            ns.em('item', status),
            item.disabled && ns.em('item', 'disabled'),
            isLast && ns.em('item', 'last'),
          ]
          return (
            <div key={index} class={itemCls} role="listitem" onClick={() => onItemClick(index, item)}>
              <div class={ns.e('container')}>
                <div class={ns.e('tail')}>
                  <i />
                </div>
                <div class={ns.e('icon')}>{renderIcon(status, index, item)}</div>
                <div class={ns.e('content')}>
                  <div class={ns.e('title')}>
                    {slots.title ? slots.title({ item, index, status }) : item.title}
                    {item.subTitle && <span class={ns.e('subtitle')}>{item.subTitle}</span>}
                  </div>
                  {(item.description || slots.description) && (
                    <div class={ns.e('description')}>
                      {slots.description ? slots.description({ item, index, status }) : item.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  },
})
