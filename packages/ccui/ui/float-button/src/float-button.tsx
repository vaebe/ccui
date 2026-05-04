import type { FloatButtonProps } from './float-button-types'
import { computed, defineComponent } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { floatButtonProps } from './float-button-types'
import './float-button.scss'

export default defineComponent({
  name: 'CFloatButton',
  props: floatButtonProps,
  emits: ['click'],
  setup(props: FloatButtonProps, { emit, slots }) {
    const ns = useNamespace('float-button')

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m(props.shape)]: true,
      [ns.m(props.type)]: true,
      [ns.m('with-description')]: !!(props.description || slots.description),
    }))

    const onClick = (e: MouseEvent) => {
      emit('click', e)
    }

    const inner = (
      <span class={ns.e('body')}>
        <span class={ns.e('content')}>
          {(slots.icon || props.icon) && (
            <span class={ns.e('icon')}>{slots.icon ? slots.icon() : <i class={props.icon} />}</span>
          )}
          {(slots.description || props.description) && (
            <span class={ns.e('description')}>{slots.description ? slots.description() : props.description}</span>
          )}
        </span>
        {props.badge !== undefined && props.badge !== '' && <sup class={ns.e('badge')}>{props.badge}</sup>}
      </span>
    )

    return () => {
      if (props.href) {
        return (
          <a
            class={cls.value}
            href={props.href}
            target={props.target || undefined}
            title={props.tooltip}
            onClick={onClick}
          >
            {inner}
          </a>
        )
      }
      return (
        <button class={cls.value} type="button" title={props.tooltip} onClick={onClick}>
          {inner}
        </button>
      )
    }
  },
})
