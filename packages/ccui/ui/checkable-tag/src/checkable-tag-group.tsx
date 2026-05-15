import type { CheckableTagGroupProps, CheckableTagValue } from './checkable-tag-types'
import { computed, defineComponent, h, provide, ref, watch } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import CheckableTag from './checkable-tag'
import { checkableTagGroupInjectionKey, checkableTagGroupProps } from './checkable-tag-types'

export default defineComponent({
  name: 'CCheckableTagGroup',
  props: checkableTagGroupProps,
  emits: ['update:modelValue', 'change'],
  setup(props: CheckableTagGroupProps, { emit, slots }) {
    const ns = useNamespace('checkable-tag-group')

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
      [ns.m(sizeRef.value)]: true,
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

      return h('div', { class: wrapperCls.value, role: 'group' }, items)
    }
  },
})
