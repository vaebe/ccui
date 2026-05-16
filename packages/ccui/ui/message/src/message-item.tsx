import type { MessageItemProps } from './message-types'
import { defineComponent, onBeforeUnmount, onMounted, ref, Transition } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { messageItemProps } from './message-types'

const ICON_MAP: Record<string, string> = {
  info: 'ⓘ',
  success: '✓',
  warning: '!',
  error: '✕',
  loading: '⟳',
}

export default defineComponent({
  name: 'CMessageItem',
  props: messageItemProps,
  emits: ['close', 'destroy'],
  setup(props: MessageItemProps, { emit, slots }) {
    const ns = useNamespace('message')
    const visible = ref(false)
    let timer: number | null = null

    const startTimer = () => {
      if (props.duration > 0) {
        timer = window.setTimeout(close, props.duration)
      }
    }

    const clearTimer = () => {
      if (timer !== null) {
        clearTimeout(timer)
        timer = null
      }
    }

    const close = () => {
      visible.value = false
      emit('close')
    }

    const onAfterLeave = () => {
      emit('destroy')
    }

    const onMouseenter = () => {
      if (props.pauseOnHover) clearTimer()
    }
    const onMouseleave = () => {
      if (props.pauseOnHover) startTimer()
    }

    onMounted(() => {
      visible.value = true
      startTimer()
    })
    onBeforeUnmount(() => clearTimer())

    return () => (
      <Transition name={`${ns.b()}-fade`} onAfterLeave={onAfterLeave}>
        {visible.value && (
          <div
            class={[ns.e('item'), ns.em('item', props.type), props.customClass, props.classNames?.root]}
            style={props.styles?.root}
            role={props.role}
            aria-live={props.role === 'alert' ? 'assertive' : 'polite'}
            onMouseenter={onMouseenter}
            onMouseleave={onMouseleave}
          >
            <div class={ns.e('inner')}>
              <span
                class={[ns.e('icon'), ns.em('icon', props.type), props.classNames?.icon]}
                style={props.styles?.icon}
              >
                {props.icon ? <i class={props.icon} /> : ICON_MAP[props.type]}
              </span>
              <span class={[ns.e('content'), props.classNames?.content]} style={props.styles?.content}>
                {slots.default ? slots.default() : props.content}
              </span>
              {props.showClose && (
                <button class={ns.e('close')} onClick={close} aria-label="Close">
                  ×
                </button>
              )}
            </div>
          </div>
        )}
      </Transition>
    )
  },
})
