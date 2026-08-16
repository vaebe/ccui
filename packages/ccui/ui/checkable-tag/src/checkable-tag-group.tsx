import type { CheckableTagGroupProps, CheckableTagValue } from './checkable-tag-types'
import { computed, defineComponent, h, inject, provide, ref, useAttrs, watch } from 'vue'
import type { FormItemInjectedContext } from '../../form/src/form-types'
import { formItemInjectionKey } from '../../form/src/form-types'
import { useNamespace } from '../../shared/hooks/use-namespace'
import CheckableTag from './checkable-tag'
import { checkableTagGroupInjectionKey, checkableTagGroupProps } from './checkable-tag-types'

export default defineComponent({
  name: 'CCheckableTagGroup',
  inheritAttrs: false,
  props: checkableTagGroupProps,
  emits: ['update:modelValue', 'change'],
  setup(props: CheckableTagGroupProps, { emit, slots }) {
    const ns = useNamespace('checkable-tag-group')
    const attrs = useAttrs()
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)

    // 内部状态镜像：保持 modelValue 单向流，但避免 toggle 时连续读旧值。
    const inner = ref<CheckableTagValue[]>([...(props.modelValue ?? [])])
    const disabledRef = computed(() => props.disabled)
    const sizeRef = computed(() => props.size)
    const maxCountRef = computed(() => props.maxCount)

    watch(
      () => props.modelValue,
      (newVal) => {
        const next = [...(newVal ?? [])]
        if (next.length !== inner.value.length || next.some((v, i) => v !== inner.value[i])) {
          inner.value = next
        }
      },
    )

    const isChecked = (value: CheckableTagValue) => inner.value.includes(value)

    const canCheck = (_value: CheckableTagValue) => {
      const limit = maxCountRef.value
      if (limit === undefined) return true
      return inner.value.length < limit
    }

    const toggle = (value: CheckableTagValue) => {
      const exist = inner.value.includes(value)
      const next = exist ? inner.value.filter((v) => v !== value) : [...inner.value, value]
      const limit = maxCountRef.value
      if (!exist && limit !== undefined && inner.value.length >= limit) return
      inner.value = next
      emit('update:modelValue', next)
      emit('change', next)
      void formItem?.validate('change')
    }

    provide(checkableTagGroupInjectionKey, {
      modelValue: inner,
      disabled: disabledRef,
      size: sizeRef,
      maxCount: maxCountRef,
      toggle,
      isChecked,
      canCheck,
    })

    const wrapperCls = computed(() => ({
      [ns.b()]: true,
      [ns.m('disabled')]: props.disabled,
    }))

    return () => {
      const items = props.options
        ? props.options.map((opt) =>
            h(
              CheckableTag,
              {
                key: String(opt.value),
                value: opt.value,
                disabled: !!opt.disabled,
              },
              { default: () => opt.label },
            ),
          )
        : slots.default?.()

      return h(
        'div',
        {
          ...attrs,
          class: [wrapperCls.value, attrs.class],
          role: 'group',
          'aria-disabled': props.disabled ? true : undefined,
          'aria-invalid': formItem?.validateStatus.value === 'error' ? true : undefined,
          'aria-describedby': formItem?.messageId?.value,
        },
        items,
      )
    }
  },
})
