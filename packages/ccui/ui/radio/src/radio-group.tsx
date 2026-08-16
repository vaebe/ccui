import type { FormItemInjectedContext } from '../../form/src/form-types'
import type { BeforeChangeType, RadioGroupProps, RadioValue } from './radio-types'
import { computed, defineComponent, inject, onBeforeUnmount, provide, ref, toRef, useId, watch } from 'vue'
import { formItemInjectionKey } from '../../form/src/form-types'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { radioGroupInjectionKey, radioGroupProps } from './radio-types'
import './radio-group.scss'

export default defineComponent({
  name: 'CRadioGroup',
  props: radioGroupProps,
  emits: ['change', 'update:modelValue'],
  setup(props: RadioGroupProps, { emit, slots }) {
    const ns = useNamespace('radio-group')
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)
    const generatedName = `ccui-radio-${useId()}`
    const groupName = computed(() => props.name || generatedName)
    const requestVersion = ref(0)
    const radioInputs = new Map<HTMLInputElement, () => boolean>()
    let requestId = 0
    let isUnmounted = false

    const emitChangeValue = (val: RadioValue) => {
      emit('update:modelValue', val)
      emit('change', val)
      void formItem?.validate('change')
    }

    watch(
      [() => props.modelValue, () => props.disabled, () => props.beforeChange],
      () => {
        requestId += 1
        requestVersion.value += 1
      },
      { flush: 'sync' },
    )

    const requestChange = async (value: RadioValue, fallback?: BeforeChangeType | null) => {
      if (props.disabled || props.modelValue === value) return false

      const initialValue = props.modelValue
      const guard = props.beforeChange || fallback
      const currentRequest = ++requestId
      requestVersion.value += 1
      let allowed = true
      if (guard) {
        try {
          allowed = await guard(value)
        } catch {
          allowed = false
        }
      }

      return (
        allowed && !isUnmounted && currentRequest === requestId && !props.disabled && props.modelValue === initialValue
      )
    }

    const registerRadio = (input: HTMLInputElement, isChecked: () => boolean) => {
      radioInputs.set(input, isChecked)
      return () => radioInputs.delete(input)
    }

    const restoreCheckedState = () => {
      radioInputs.forEach((isChecked, input) => {
        input.checked = isChecked()
      })
    }

    provide(radioGroupInjectionKey, {
      modelValue: toRef(props, 'modelValue'),
      disabled: toRef(props, 'disabled'),
      name: groupName,
      requestVersion,
      registerRadio,
      restoreCheckedState,
      requestChange,
      emitChangeValue,
    })

    const radioGroupClass = computed(() => {
      return `${ns.b()} ${ns.is(props.direction)}`
    })

    const handleFocusout = (event: FocusEvent) => {
      const currentTarget = event.currentTarget as HTMLElement
      if (!currentTarget.contains(event.relatedTarget as Node | null)) {
        void formItem?.validate('blur')
      }
    }

    onBeforeUnmount(() => {
      isUnmounted = true
      requestId += 1
      radioInputs.clear()
    })

    return () => {
      return (
        <div
          class={radioGroupClass.value}
          role="radiogroup"
          aria-disabled={props.disabled ? true : undefined}
          aria-invalid={formItem?.validateStatus.value === 'error' ? true : undefined}
          aria-describedby={formItem?.messageId?.value}
          onFocusout={handleFocusout}
        >
          {slots.default && slots.default()}
        </div>
      )
    }
  },
})
