import type { CheckableTagProps } from './checkable-tag-types'
import type { FormItemInjectedContext } from '../../form/src/form-types'
import { computed, defineComponent, h, inject, mergeProps, ref, useAttrs, watch } from 'vue'
import { formItemInjectionKey } from '../../form/src/form-types'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { checkableTagGroupInjectionKey, checkableTagProps } from './checkable-tag-types'
import './checkable-tag.scss'

export default defineComponent({
  name: 'CCheckableTag',
  inheritAttrs: false,
  props: checkableTagProps,
  emits: ['update:checked', 'change'],
  setup(props: CheckableTagProps, { emit, slots }) {
    const ns = useNamespace('checkable-tag')
    const attrs = useAttrs()
    const group = inject(checkableTagGroupInjectionKey, null)
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)

    // 本地 checked 状态：group 模式下用 group 决定，独立模式下由 prop 同步。
    const localChecked = ref(props.checked ?? false)

    watch(
      () => props.checked,
      (newVal) => {
        if (newVal !== undefined) localChecked.value = newVal
      },
    )

    const isChecked = computed(() => {
      if (group && props.value !== undefined) return group.isChecked(props.value)
      return localChecked.value
    })

    const isDisabled = computed(() => props.disabled || (group?.disabled.value ?? false))

    const canToggle = computed(() => {
      if (isDisabled.value) return false
      if (group && props.value !== undefined && !isChecked.value) {
        return group.canCheck(props.value)
      }
      return true
    })

    const handleClick = () => {
      if (isDisabled.value) return
      if (group && props.value !== undefined) {
        if (!canToggle.value) return
        group.toggle(props.value)
        return
      }
      const next = !localChecked.value
      localChecked.value = next
      emit('update:checked', next)
      emit('change', next)
      void formItem?.validate('change')
    }

    const wrapperCls = computed(() => ({
      [ns.b()]: true,
      [ns.m('checked')]: isChecked.value,
      [ns.m('disabled')]: isDisabled.value,
      [ns.m(group?.size.value ?? 'default')]: true,
    }))

    return () =>
      h(
        'span',
        mergeProps(attrs, {
          class: wrapperCls.value,
          role: 'checkbox',
          'aria-checked': isChecked.value,
          'aria-disabled': isDisabled.value ? true : undefined,
          tabindex: isDisabled.value ? -1 : 0,
          onClick: handleClick,
          onKeydown: (e: KeyboardEvent) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault()
              handleClick()
            }
          },
        }),
        slots.default?.(),
      )
  },
})
