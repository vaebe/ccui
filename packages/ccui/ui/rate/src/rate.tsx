import type { RateProps } from './rate-types'
import { computed, defineComponent, ref } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import iconDefault from './components/icon-default'
import { rateProps } from './rate-types'

import './rate.scss'

export default defineComponent({
  name: 'CRate',
  props: rateProps,
  emits: ['change', 'update:modelValue'],
  setup(props: RateProps, { emit, slots }) {
    const ns = useNamespace('rate')
    const selectedQuantity = ref(props.modelValue)

    const iconStateList = ref(
      Array.from({ length: props.count }, () => ({ width: '0%' })),
    )

    // 设置图标的状态，根据 end 值（选中数）来更新图标的显示状态
    const setIconState = (end: number) => {
      // 判断是否是半选状态
      const isHalfChoice = end % 1 > 0

      // 计算需要填充满的图标数量
      const maxCheckedNum = isHalfChoice ? Math.floor(end) : end - 1

      // 遍历 iconStateList，更新每个图标的显示宽度（选中的宽度为 '50%' 或 '100%'）
      iconStateList.value.forEach((_, index) => {
        iconStateList.value[index].width = maxCheckedNum >= index
          ? isHalfChoice && maxCheckedNum === index
            ? '50%' // 如果是半选且当前图标为最后一个，则宽度为 '50%'
            : '100%' // 完全选中
          : '0%' // 未选中
      })
    }

    setIconState(selectedQuantity.value)

    // 判断当前鼠标事件的目标是否是半选
    const isSemiSelected = (e: MouseEvent) =>
      props.allowHalf && e.offsetX * 2 <= (e.target as HTMLElement).clientWidth

    const handleMouseInteraction = (e: MouseEvent, index: number, isClick = false) => {
      if (props.readOnly)
        return

      const newIndex = isSemiSelected(e) ? index + 0.5 : index + 1
      setIconState(newIndex)

      if (isClick) {
        selectedQuantity.value = newIndex
        emit('update:modelValue', newIndex)
        emit('change', newIndex)
      }
    }

    const rateItem = computed(() => slots.default ? slots.default() : iconDefault())

    const iconList = () =>
      iconStateList.value.map((item, index) => (
        <div
          class={ns.e('icon')}
          onMousemove={(e: MouseEvent) => handleMouseInteraction(e, index)}
          onClick={(e: MouseEvent) => handleMouseInteraction(e, index, true)}
        >
          <span>{rateItem.value}</span>
          <span
            class={ns.m('active')}
            style={{ width: item.width, color: props.color, fill: props.color }}
          >
            {rateItem.value}
          </span>
        </div>
      ))

    const rateCls = computed(() => ({
      [ns.b()]: true,
      [ns.m('read-only')]: props.readOnly,
    }))

    return () => (
      <div
        class={rateCls.value}
        onMouseleave={() => setIconState(selectedQuantity.value)}
      >
        {iconList()}
        {slots.info && <div class={ns.e('info')}>{slots.info(selectedQuantity.value)}</div>}
      </div>
    )
  },
})
