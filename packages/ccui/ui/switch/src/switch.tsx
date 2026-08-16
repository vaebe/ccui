import type { FormItemInjectedContext } from '../../form/src/form-types'
import type { SwitchProps } from './switch-types'
import { computed, defineComponent, inject, onBeforeUnmount, ref, watch } from 'vue'
import { formItemInjectionKey } from '../../form/src/form-types'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { switchProps } from './switch-types'
import './switch.scss'

export default defineComponent({
  name: 'CSwitch',
  inheritAttrs: false,
  props: switchProps,
  emits: ['update:modelValue', 'change', 'click', 'blur'],
  setup(props: SwitchProps, { attrs, slots, emit }) {
    const ns = useNamespace('switch')
    const inputRef = ref<HTMLButtonElement | null>(null)
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)
    const isPending = ref(false)
    let requestId = 0
    let isUnmounted = false

    const checked = computed(() => props.modelValue === props.checkedValue)

    const cls = computed(() => ({
      [ns.b()]: true,
      [ns.m('checked')]: checked.value,
      [ns.m('disabled')]: props.disabled,
      [ns.m('loading')]: props.loading,
      [ns.m(props.size)]: props.size === 'small',
    }))

    // 任何会改变本次决策语义的动态属性都会让旧异步结果失效，避免 ABA 回滚。
    watch(
      [
        () => props.modelValue,
        () => props.checkedValue,
        () => props.uncheckedValue,
        () => props.disabled,
        () => props.loading,
        () => props.beforeChange,
      ],
      () => {
        requestId += 1
        isPending.value = false
      },
      { flush: 'sync' },
    )

    /**
     * 请求一次状态切换；只有最新且上下文未变化的守卫结果可以提交。
     * @param event 触发切换的原生点击事件（包含按钮的 Enter/Space 合成点击）。
     */
    const toggle = async (event: MouseEvent) => {
      if (props.disabled || props.loading || isPending.value) return

      const next = checked.value ? props.uncheckedValue : props.checkedValue
      const initialValue = props.modelValue
      const initialCheckedValue = props.checkedValue
      const initialUncheckedValue = props.uncheckedValue
      const guard = props.beforeChange
      const currentRequest = ++requestId
      isPending.value = true

      let accepted = true
      if (guard) {
        try {
          accepted = await guard(next)
        } catch {
          accepted = false
        }
      }

      if (currentRequest !== requestId || isUnmounted) return
      isPending.value = false
      if (
        !accepted ||
        props.disabled ||
        props.loading ||
        props.modelValue !== initialValue ||
        props.checkedValue !== initialCheckedValue ||
        props.uncheckedValue !== initialUncheckedValue
      ) {
        return
      }

      emit('update:modelValue', next)
      emit('change', next, event)
      emit('click', event)
      void formItem?.validate('change')
    }

    /** 通知 FormItem 用户已离开 Switch。 */
    const handleBlur = (event: FocusEvent) => {
      void formItem?.validate('blur')
      emit('blur', event)
    }

    onBeforeUnmount(() => {
      isUnmounted = true
      requestId += 1
    })

    return () => {
      const { class: rootClass, style: rootStyle, 'aria-describedby': describedBy, ...nativeAttrs } = attrs
      // 保留调用方的帮助文本，同时追加 FormItem 错误信息，避免透传属性覆盖校验关联。
      const descriptionIds = [describedBy, formItem?.messageId?.value]
        .filter((id): id is string => typeof id === 'string' && !!id)
        .flatMap((id) => id.split(/\s+/))
      const ariaDescribedBy = [...new Set(descriptionIds)].join(' ') || undefined

      return (
        <button
          {...nativeAttrs}
          ref={inputRef}
          type="button"
          role="switch"
          aria-checked={checked.value}
          aria-disabled={props.disabled || props.loading || isPending.value ? true : undefined}
          aria-busy={props.loading || isPending.value ? true : undefined}
          aria-invalid={formItem?.validateStatus.value === 'error' ? true : undefined}
          aria-describedby={ariaDescribedBy}
          autofocus={props.autofocus}
          disabled={props.disabled}
          class={[cls.value, rootClass]}
          style={rootStyle}
          onClick={toggle}
          onBlur={handleBlur}
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
    }
  },
})
