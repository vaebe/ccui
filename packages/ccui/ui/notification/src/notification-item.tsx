import type { NotificationItemProps } from './notification-types'
import { defineComponent, onBeforeUnmount, onMounted, ref, Transition } from 'vue'
import { renderIconNode } from '../../shared/hooks/use-icon'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { notificationItemProps } from './notification-types'

const ICON_MAP: Record<string, string> = {
  info: 'ⓘ',
  success: 'mdi:check-circle',
  warning: '!',
  error: 'mdi:close-circle',
}

function renderTypeIcon(type: string) {
  const value = ICON_MAP[type]
  if (!value) return null
  if (value.includes(':')) {
    return renderIconNode(value) ?? value
  }
  return value
}

export default defineComponent({
  name: 'CNotificationItem',
  props: notificationItemProps,
  emits: ['close', 'destroy'],
  setup(props: NotificationItemProps, { emit, slots }) {
    const ns = useNamespace('notification')
    const visible = ref(false)
    let timer: number | null = null
    let remaining = props.duration
    let startedAt = 0
    const autoClose = props.duration > 0

    const startTimer = () => {
      clearTimer()
      if (!autoClose) return
      if (remaining <= 0) {
        close()
        return
      }
      startedAt = Date.now()
      timer = window.setTimeout(close, remaining)
    }
    const clearTimer = () => {
      if (timer !== null) {
        clearTimeout(timer)
        timer = null
      }
    }

    const close = () => {
      if (!visible.value) return
      clearTimer()
      visible.value = false
      emit('close')
    }

    const onMouseenter = () => {
      if (props.pauseOnHover && timer !== null) {
        remaining = Math.max(0, remaining - (Date.now() - startedAt))
        clearTimer()
      }
    }
    const onMouseleave = () => {
      if (props.pauseOnHover && autoClose) startTimer()
    }

    onMounted(() => {
      visible.value = true
      remaining = props.duration
      startTimer()
    })
    onBeforeUnmount(() => clearTimer())

    return () => (
      <Transition name={`${ns.b()}-fade`} onAfterLeave={() => emit('destroy')}>
        {visible.value && (
          <div
            class={[ns.e('item'), ns.em('item', props.type), props.customClass, props.classNames?.root]}
            style={props.styles?.root}
            role={props.role}
            aria-live={props.role === 'alert' ? 'assertive' : 'polite'}
            aria-atomic={true}
            onMouseenter={onMouseenter}
            onMouseleave={onMouseleave}
          >
            <div class={ns.e('inner')}>
              <span
                class={[ns.e('icon'), ns.em('icon', props.type), props.classNames?.icon]}
                style={props.styles?.icon}
              >
                {props.icon ? <i class={props.icon} /> : renderTypeIcon(props.type)}
              </span>
              <div class={[ns.e('main'), props.classNames?.content]} style={props.styles?.content}>
                {props.title && <div class={ns.e('title')}>{props.title}</div>}
                <div class={ns.e('desc')}>{slots.default ? slots.default() : props.description}</div>
              </div>
              {props.showClose && (
                <button
                  type="button"
                  class={[ns.e('close'), props.classNames?.close]}
                  style={props.styles?.close}
                  onClick={close}
                  aria-label="Close"
                >
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
