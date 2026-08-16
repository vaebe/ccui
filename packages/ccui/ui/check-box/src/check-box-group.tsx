import type { FormItemInjectedContext } from '../../form/src/form-types'
import type { CheckBoxGroupProps, LabelType } from './check-box-types'
import { computed, defineComponent, inject, provide, toRef } from 'vue'
import { formItemInjectionKey } from '../../form/src/form-types'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { checkBoxGroupInjectionKey, checkBoxGroupProps } from './check-box-types'
import './check-box-group.scss'

export default defineComponent({
  name: 'CCheckBoxGroup',
  props: checkBoxGroupProps,
  emits: ['change', 'update:modelValue'],
  setup(props: CheckBoxGroupProps, { emit, slots }) {
    const ns = useNamespace('check-box-group')
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)

    const valueList = toRef(props, 'modelValue')

    const toggleGroupVal = (val: LabelType) => {
      // 只限制v-model绑定的值是一个数组 数组里有什么不做限制
      // 查找对应元素在数组的下标
      const index = valueList.value.findIndex((item) => item === val)

      // 如果找不到就把元素添加到数组
      if (index === -1) {
        const res = [...valueList.value, val]
        emit('change', res)
        emit('update:modelValue', res)
        void formItem?.validate('change')
        return
      }

      // 如果找到了就生成删除该元素后的新数组并更新数据（不原地 mutate prop）
      const res = valueList.value.filter((item) => item !== val)
      emit('change', res)
      emit('update:modelValue', res)
      void formItem?.validate('change')
    }
    const isItemChecked = (val: LabelType) => {
      // 验证数组中是否存在该项 返回boolean
      return valueList.value.includes(val)
    }

    provide(checkBoxGroupInjectionKey, {
      disabled: toRef(props, 'disabled'),
      color: toRef(props, 'color'),
      name: toRef(props, 'name'),
      beforeChange: toRef(props, 'beforeChange'),
      toggleGroupVal,
      isItemChecked,
    })

    const checkBoxGroupClass = computed(() => {
      return `${ns.b()} ${ns.is(props.direction)}`
    })

    const handleFocusout = (event: FocusEvent) => {
      const currentTarget = event.currentTarget as HTMLElement
      if (!currentTarget.contains(event.relatedTarget as Node | null)) {
        void formItem?.validate('blur')
      }
    }

    return () => {
      return (
        <div
          class={checkBoxGroupClass.value}
          role="group"
          aria-disabled={props.disabled ? true : undefined}
          onFocusout={handleFocusout}
        >
          {slots.default && slots.default()}
        </div>
      )
    }
  },
})
