import type { SwitchProps } from './switch-types'
import { computed, defineComponent, ref } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { switchProps } from './switch-types'
import './switch.scss'

export default defineComponent({
  name: 'CSwitch',
  props: switchProps,
  emits: ['update:modelValue', 'change', 'click'],
  setup(props: SwitchProps, { slots, emit }) {
    const ns = useNamespace('switch')
    const inputRef = ref<HTMLButtonElement | null>(null)

    const checked = computed(() => props.modelValue === props.checkedValue)

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m('checked')]: checked.value,
      [ns.m('disabled')]: props.disabled,
      [ns.m('loading')]: props.loading,
      [ns.m(props.size)]: props.size === 'small',
    }))

    const toggle = (e: MouseEvent) => {
      if (props.disabled || props.loading) {
        return
      }
      const next = checked.value ? props.uncheckedValue : props.checkedValue
      emit('update:modelValue', next)
      emit('change', next, e)
      emit('click', e)
    }

    return () => (
      <button
        ref={inputRef}
        type="button"
        role="switch"
        aria-checked={checked.value}
        autofocus={props.autofocus}
        disabled={props.disabled}
        class={cls.value}
        onClick={toggle}
      >
        {props.loading && <span class={ns.e('loading')} />}
        <span class={ns.e('inner')}>
          {checked.value
            ? slots.checkedChildren
              ? slots.checkedChildren()
              : props.checkedChildren && <span>{props.checkedChildren}</span>
            : slots.uncheckedChildren
              ? slots.uncheckedChildren()
              : props.uncheckedChildren && <span>{props.uncheckedChildren}</span>}
        </span>
        <span class={ns.e('handle')} />
      </button>
    )
  },
})
