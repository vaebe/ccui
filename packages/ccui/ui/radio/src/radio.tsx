import type { FormItemInjectedContext } from '../../form/src/form-types'
import type { RadioProps, RadioValue } from './radio-types'
import { computed, defineComponent, inject, onBeforeUnmount, ref, watch } from 'vue'
import { formItemInjectionKey } from '../../form/src/form-types'
import { useNamespace } from '../../shared/hooks/use-namespace'
import IconActive from './components/icon-active'
import IconCircle from './components/icon-circle'
import { radioGroupInjectionKey, radioProps } from './radio-types'
import './radio.scss'

export default defineComponent({
  name: 'CRadio',
  props: radioProps,
  emits: ['change', 'update:modelValue'],
  setup(props: RadioProps, { emit, slots }) {
    const ns = useNamespace('radio')

    const radioGroupInject = inject(radioGroupInjectionKey, null)
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)
    const isPending = ref(false)
    let requestId = 0
    let isUnmounted = false
    let inputElement: HTMLInputElement | null = null
    let unregisterRadio: (() => void) | undefined

    // 是否可以切换
    const isDisabled = computed(() => {
      return radioGroupInject?.disabled.value || props.disabled
    })

    // 是否激活
    const isActive = computed(() => {
      const value = radioGroupInject ? radioGroupInject.modelValue.value : props.modelValue
      return value === props.label
    })

    // 计算组件样式
    const labelClass = computed(() => {
      return `${ns.b()} ${isActive.value ? 'active' : ''} ${isDisabled.value ? 'disabled' : ''}`
    })

    const judgeCanChange = async (value: RadioValue) => {
      // 禁用状态不能切换
      if (isDisabled.value) {
        return false
      }

      if (radioGroupInject) {
        return radioGroupInject.requestChange(value, props.beforeChange)
      }

      const beforeChange = props.beforeChange

      // 判断beforeChange事件是否存在
      if (beforeChange) {
        try {
          return await beforeChange(value)
        } catch {
          return false
        }
      }

      return true
    }

    watch(
      [
        isActive,
        isDisabled,
        () => props.modelValue,
        () => props.label,
        () => props.beforeChange,
        () => radioGroupInject?.requestVersion.value,
      ],
      () => {
        requestId += 1
        isPending.value = false
      },
      { flush: 'sync' },
    )

    const handleChange = (event: Event) => {
      const input = event.target as HTMLInputElement
      // Native radio state changes before `change`; controlled state remains
      // authoritative until the async decision has been accepted.
      if (radioGroupInject) radioGroupInject.restoreCheckedState()
      else input.checked = isActive.value
      if (isPending.value || isActive.value || isDisabled.value) return

      const label = props.label
      const initialValue = radioGroupInject ? radioGroupInject.modelValue.value : props.modelValue
      // Group requests advance their shared version synchronously. Start the
      // local token afterwards so this request survives while older siblings
      // and requests are invalidated immediately.
      const decision = judgeCanChange(label)
      const currentRequest = ++requestId
      isPending.value = true

      void decision.then((res) => {
        if (currentRequest !== requestId || isUnmounted) return
        isPending.value = false
        if (
          res &&
          !isDisabled.value &&
          !isActive.value &&
          props.label === label &&
          (radioGroupInject ? radioGroupInject.modelValue.value : props.modelValue) === initialValue
        ) {
          // 触发 radioGroup 的 emitChangeValue 事件更新数据
          if (radioGroupInject) {
            radioGroupInject.emitChangeValue(label)
          }

          // 更新双向绑定的数据
          emit('update:modelValue', label)
          // 触发change事件
          emit('change', label)
          if (!radioGroupInject) {
            void formItem?.validate('change')
          }
        }
      })
    }

    const handleBlur = () => {
      if (!radioGroupInject) {
        void formItem?.validate('blur')
      }
    }

    const setInputElement = (element: unknown) => {
      const nextInput = element as HTMLInputElement | null
      if (nextInput === inputElement) return
      unregisterRadio?.()
      unregisterRadio = undefined
      inputElement = nextInput
      if (nextInput && radioGroupInject) {
        unregisterRadio = radioGroupInject.registerRadio(nextInput, () => isActive.value)
      }
    }

    onBeforeUnmount(() => {
      isUnmounted = true
      requestId += 1
      unregisterRadio?.()
    })

    return () => {
      return (
        <label class={labelClass.value}>
          <input
            ref={setInputElement}
            class={ns.e('input')}
            onChange={handleChange}
            onBlur={handleBlur}
            type="radio"
            name={radioGroupInject?.name.value || props.name}
            value={String(props.label)}
            disabled={isDisabled.value}
            checked={isActive.value}
            aria-checked={isActive.value}
            aria-disabled={isDisabled.value ? true : undefined}
            aria-busy={isPending.value ? true : undefined}
            aria-invalid={!radioGroupInject && formItem?.validateStatus.value === 'error' ? true : undefined}
            aria-describedby={!radioGroupInject ? formItem?.messageId?.value : undefined}
          />
          {/* 判断展示那种icon */}
          <span class={ns.e('icon')}>{isActive.value ? <IconActive /> : <IconCircle />}</span>

          {/* 默认插槽 存在展示默认插槽的数据 否则展示label */}
          {slots.default ? slots.default() : props.label}
        </label>
      )
    }
  },
})
