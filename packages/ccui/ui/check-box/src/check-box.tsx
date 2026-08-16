import type { FormItemInjectedContext } from '../../form/src/form-types'
import type { CheckBoxProps, LabelType } from './check-box-types'
import { computed, defineComponent, inject, onBeforeUnmount, ref, watch } from 'vue'
import { formItemInjectionKey } from '../../form/src/form-types'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { checkBoxGroupInjectionKey, checkBoxProps } from './check-box-types'
import IconActive from './components/icon-active'
import IconDefault from './components/icon-default'
import './check-box.scss'

export default defineComponent({
  name: 'CCheckBox',
  props: checkBoxProps,
  emits: ['change', 'update:modelValue'],
  setup(props: CheckBoxProps, { emit, slots }) {
    const ns = useNamespace('check-box')

    const checkBoxGroupInject = inject(checkBoxGroupInjectionKey, null)
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)
    const isPending = ref(false)
    let requestId = 0
    let isUnmounted = false

    const isDisabled = computed(() => {
      return checkBoxGroupInject?.disabled.value || props.disabled
    })

    const isChecked = computed(() => {
      // group 模式只认 group 状态，独立模式返回纯布尔
      return checkBoxGroupInject ? checkBoxGroupInject.isItemChecked(props.label) : !!props.modelValue
    })

    // 计算组件样式
    const labelClass = computed(() => {
      return `${ns.b()} ${isChecked.value ? 'active' : ''} ${props.indeterminate ? 'indeterminate' : ''} ${isDisabled.value ? 'disabled' : ''}`
    })

    const iconColor = computed(() => {
      const color = checkBoxGroupInject?.color.value || props.color
      const styles = color ? [`color: ${color}`, `fill: ${color}`] : []
      if (isDisabled.value && props.indeterminate) {
        styles.push(
          '--ccui-check-box-indeterminate-background: var(--ccui-color-fill)',
          '--ccui-check-box-indeterminate-mark-color: var(--ccui-color-text-secondary)',
        )
      }
      return styles.join('; ')
    })

    // todo 带测试逻辑
    const judgeCanChange = (hasChecked: boolean, value: LabelType) => {
      // 禁用状态不能切换
      if (isDisabled.value) {
        return Promise.resolve(false)
      }

      const beforeChange = checkBoxGroupInject?.beforeChange.value || props.beforeChange

      // 判断beforeChange事件是否存在
      if (beforeChange) {
        let res: ReturnType<typeof beforeChange>
        try {
          res = beforeChange(hasChecked, value)
        } catch {
          return Promise.resolve(false)
        }
        // 存在boolean 返回对应的值，否则直接返回
        if (typeof res === 'boolean') {
          return Promise.resolve(res)
        }
        return Promise.resolve(res).catch(() => false)
      }

      return Promise.resolve(true)
    }

    watch(
      [isChecked, isDisabled, () => props.label],
      () => {
        // Every observed transition invalidates an in-flight decision, including
        // ABA sequences whose final value happens to equal the request snapshot.
        requestId += 1
        isPending.value = false
      },
      { flush: 'sync' },
    )

    const handleChange = (event: Event) => {
      const input = event.target as HTMLInputElement
      // Native checkbox state changes before `change`. Keep the rendered state
      // stable while an async guard is pending (or when it rejects).
      input.checked = isChecked.value
      input.indeterminate = props.indeterminate
      if (isPending.value) return

      const initialChecked = isChecked.value
      const curStatus = !initialChecked
      const currentLabel = props.label
      const currentRequest = ++requestId
      isPending.value = true

      void judgeCanChange(curStatus, currentLabel).then((res) => {
        if (currentRequest !== requestId || isUnmounted) return
        isPending.value = false
        // External controlled updates and dynamic labels supersede the request
        // that was started against the previous render.
        if (res && !isDisabled.value && isChecked.value === initialChecked && props.label === currentLabel) {
          // 更新选中的数组
          checkBoxGroupInject?.toggleGroupVal(currentLabel)
          emit('change', curStatus)
          emit('update:modelValue', curStatus)
          if (!checkBoxGroupInject) {
            void formItem?.validate('change')
          }
        }
      })
    }

    const handleBlur = () => {
      if (!checkBoxGroupInject) {
        void formItem?.validate('blur')
      }
    }

    onBeforeUnmount(() => {
      isUnmounted = true
      requestId += 1
    })

    return () => {
      return (
        <label class={labelClass.value}>
          <input
            ref={(element: any) => {
              if (element) (element as HTMLInputElement).indeterminate = props.indeterminate
            }}
            type="checkbox"
            class={ns.e('input')}
            onChange={handleChange}
            onBlur={handleBlur}
            name={props.name || checkBoxGroupInject?.name.value}
            value={props.label}
            disabled={isDisabled.value}
            checked={isChecked.value}
            aria-checked={props.indeterminate ? 'mixed' : isChecked.value}
            aria-disabled={isDisabled.value ? true : undefined}
          />
          {/* 判断展示那种icon */}
          <span class={ns.e('icon')} style={iconColor.value}>
            {isChecked.value ? <IconActive /> : <IconDefault />}
          </span>

          {/* 默认插槽 存在展示默认插槽的数据 否则展示label */}
          {slots.default ? slots.default() : props.label}
        </label>
      )
    }
  },
})
