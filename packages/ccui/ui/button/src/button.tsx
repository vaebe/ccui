import type { ButtonProps } from './button-types'
import { computed, defineComponent } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { buttonProps } from './button-types'
import './button.scss'

export default defineComponent({
  name: 'CButton',
  props: buttonProps,
  emits: ['click'],
  setup(props: ButtonProps, { slots, emit }) {
    const ns = useNamespace('button')
    const butCls = computed(() => {
      return {
        [ns.b()]: true,
        [ns.m(props.type)]: !!props.type,
        [ns.m(`plain-${props.type}`)]: !!props.plain,
        [ns.m(props.size)]: !!props.size,
        [ns.m('round')]: props.round,
        [ns.m('circle')]: props.circle,
        [ns.m('loading')]: props.loading,
        [ns.m('disabled')]: props.disabled || props.loading,
      }
    })

    const onClick = (e: MouseEvent) => {
      // 如果按钮处于加载状态或禁用状态，则不触发点击事件
      if (props.disabled || props.loading) {
        e.preventDefault()
        return
      }
      emit('click', e)
    }

    return () => {
      return (
        <button
          class={butCls.value}
          type={props.nativeType}
          autofocus={props.autofocus}
          disabled={props.disabled || props.loading}
          onClick={onClick}
        >
          {props.loading && <span class={ns.e('loading-icon')}></span>}
          {slots.icon ? slots.icon() : props.icon && <i class={props.icon}></i>}
          <span class={ns.e('content')}>
            {slots.default && slots.default()}
          </span>
        </button>
      )
    }
  },
})
