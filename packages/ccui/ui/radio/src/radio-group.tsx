import type {
  RadioGroupProps,
} from './radio-types'
import { computed, defineComponent, provide, toRef } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import {
  radioGroupInjectionKey,
  radioGroupProps,
} from './radio-types'
import './radio-group.scss'

export default defineComponent({
  name: 'CRadioGroup',
  props: radioGroupProps,
  emits: ['change', 'update:modelValue'],
  setup(props: RadioGroupProps, { emit, slots }) {
    const ns = useNamespace('radio-group')

    const emitChangeValue = (val: string) => {
      emit('update:modelValue', val)
      emit('change', val)
    }

    provide(radioGroupInjectionKey, {
      modelValue: toRef(props, 'modelValue'),
      disabled: toRef(props, 'disabled'),
      beforeChange: props.beforeChange,
      emitChangeValue,
    })

    const directionType = {
      row: 'is-row',
      column: 'is-column',
    }

    const radioGroupClass = computed(() => {
      return `${ns.b()} ${directionType[props.direction]}`
    })

    return () => {
      return (
        <div class={radioGroupClass.value}>
          {slots.default && slots.default()}
        </div>
      )
    }
  },
})
