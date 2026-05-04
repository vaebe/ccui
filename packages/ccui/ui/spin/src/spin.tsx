import type { SpinProps } from './spin-types'
import { computed, defineComponent, onBeforeUnmount, ref, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { spinProps } from './spin-types'
import './spin.scss'

export default defineComponent({
  name: 'CSpin',
  props: spinProps,
  setup(props: SpinProps, { slots }) {
    const ns = useNamespace('spin')
    const visible = ref(props.spinning)
    let timer: ReturnType<typeof setTimeout> | null = null

    const clearDelay = () => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }

    watch(
      () => props.spinning,
      (val) => {
        clearDelay()
        if (val && props.delay > 0) {
          timer = setTimeout(() => {
            visible.value = true
          }, props.delay)
          visible.value = false
        }
        else {
          visible.value = val
        }
      },
      { immediate: true },
    )

    onBeforeUnmount(clearDelay)

    const indicatorCls = computed(() => ({
      [ns.e('dot')]: true,
      [ns.em('dot', props.size)]: true,
    }))

    const renderIndicator = () => {
      if (slots.indicator) {
        return slots.indicator()
      }
      return (
        <span class={indicatorCls.value}>
          <i class={[ns.e('dot-item'), ns.em('dot-item', '1')]} />
          <i class={[ns.e('dot-item'), ns.em('dot-item', '2')]} />
          <i class={[ns.e('dot-item'), ns.em('dot-item', '3')]} />
          <i class={[ns.e('dot-item'), ns.em('dot-item', '4')]} />
        </span>
      )
    }

    const renderSpinner = () => (
      <div class={[ns.b(), ns.m(props.size), ns.m('spinning')]}>
        {renderIndicator()}
        {props.tip && <div class={ns.e('text')}>{props.tip}</div>}
      </div>
    )

    return () => {
      if (props.fullscreen) {
        if (!visible.value) {
          return null
        }
        return (
          <div class={ns.m('fullscreen')}>
            {renderSpinner()}
          </div>
        )
      }

      if (!slots.default) {
        return visible.value ? renderSpinner() : null
      }

      return (
        <div class={[ns.e('nested'), visible.value && ns.is('blur')]}>
          {visible.value && (
            <div class={ns.e('overlay')}>
              {renderSpinner()}
            </div>
          )}
          <div class={[ns.e('container'), visible.value && ns.is('blur')]}>
            {slots.default()}
          </div>
        </div>
      )
    }
  },
})
