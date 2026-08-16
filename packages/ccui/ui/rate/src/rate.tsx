import type { RateProps } from './rate-types'
import { computed, defineComponent, nextTick, ref, watch } from 'vue'
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

    const iconStateList = ref(Array.from({ length: props.count }, () => ({ width: '0%' })))

    // 设置图标的状态，根据 end 值（选中数）来更新图标的显示状态
    const setIconState = (end: number) => {
      // 判断是否是半选状态
      const isHalfChoice = end % 1 > 0

      // 计算需要填充满的图标数量
      const maxCheckedNum = isHalfChoice ? Math.floor(end) : end - 1

      // 遍历 iconStateList，更新每个图标的显示宽度（选中的宽度为 '50%' 或 '100%'）
      iconStateList.value.forEach((_, index) => {
        iconStateList.value[index].width =
          maxCheckedNum >= index
            ? isHalfChoice && maxCheckedNum === index
              ? '50%' // 如果是半选且当前图标为最后一个，则宽度为 '50%'
              : '100%' // 完全选中
            : '0%' // 未选中
      })
    }

    setIconState(selectedQuantity.value)

    // 监听外部 modelValue 变化（受控更新 / 编程式重置），同步内部选中状态与图标宽度
    watch(
      () => props.modelValue,
      (v) => {
        selectedQuantity.value = v
        setIconState(v)
      },
    )

    // 判断当前鼠标事件的目标是否是半选
    // 从监听器自身元素（currentTarget）计算几何，避免 e.target 落在内部 svg/span 导致 offsetX 与 clientWidth 取自不同元素而错判
    const isSemiSelected = (e: MouseEvent) => {
      if (!props.allowHalf) return false
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      return (e.clientX - rect.left) * 2 <= rect.width
    }

    const handleMouseInteraction = (e: MouseEvent, index: number, isClick = false) => {
      if (props.readOnly) return

      const newIndex = isSemiSelected(e) ? index + 0.5 : index + 1
      setIconState(newIndex)

      if (isClick) {
        selectedQuantity.value = newIndex
        emit('update:modelValue', newIndex)
        emit('change', newIndex)
      }
    }

    // 键盘操作与点击保持相同的更新路径，确保受控值和 change 事件一致。
    const focusRateItem = async (root: HTMLElement | null, index: number) => {
      // 状态更新会重算 roving tabindex；等待 DOM 刷新后再把焦点移到新的评分项。
      await nextTick()
      const items = root?.querySelectorAll<HTMLElement>(`.${ns.e('icon')}`)
      items?.[index]?.focus()
    }

    const handleKeyInteraction = async (e: KeyboardEvent, index: number) => {
      if (props.readOnly) return
      const key = e.key
      const delta = key === 'ArrowRight' || key === 'ArrowUp' ? 1 : key === 'ArrowLeft' || key === 'ArrowDown' ? -1 : 0
      const target =
        key === 'Home'
          ? 1
          : key === 'End'
            ? props.count
            : delta
              ? Math.min(props.count, Math.max(1, index + 1 + delta))
              : 0
      if (!target && key !== 'Enter' && key !== ' ') return
      e.preventDefault()
      const next = target || index + 1
      selectedQuantity.value = next
      setIconState(next)
      emit('update:modelValue', next)
      emit('change', next)
      await focusRateItem((e.currentTarget as HTMLElement).parentElement, next - 1)
    }

    const rateItem = computed(() => (slots.default ? slots.default() : iconDefault()))

    const iconList = () =>
      iconStateList.value.map((item, index) => {
        const rank = index + 1
        // 视觉填充可以累计，但 radio 语义必须只有当前评分对应的一项为 checked。
        const activeIndex = Math.max(0, Math.min(props.count - 1, Math.ceil(selectedQuantity.value) - 1))
        const isCurrentRating = selectedQuantity.value > 0 && index === activeIndex
        return (
          <div
            class={ns.e('icon')}
            role="radio"
            aria-checked={isCurrentRating}
            aria-label={`${rank} stars`}
            aria-disabled={props.readOnly ? true : undefined}
            aria-setsize={props.count}
            aria-posinset={rank}
            tabindex={!props.readOnly && index === activeIndex ? 0 : -1}
            onMousemove={(e: MouseEvent) => handleMouseInteraction(e, index)}
            onClick={(e: MouseEvent) => handleMouseInteraction(e, index, true)}
            onKeydown={(e: KeyboardEvent) => handleKeyInteraction(e, index)}
          >
            <span>{rateItem.value}</span>
            <span class={ns.m('active')} style={{ width: item.width, color: props.color, fill: props.color }}>
              {rateItem.value}
            </span>
          </div>
        )
      })

    const rateCls = computed(() => ({
      [ns.b()]: true,
      [ns.m('read-only')]: props.readOnly,
    }))

    return () => (
      <div
        class={rateCls.value}
        role="radiogroup"
        aria-label="rate"
        aria-readonly={props.readOnly ? true : undefined}
        tabindex={props.readOnly ? 0 : undefined}
        onMouseleave={() => setIconState(selectedQuantity.value)}
      >
        {iconList()}
        {slots.info && <div class={ns.e('info')}>{slots.info(selectedQuantity.value)}</div>}
      </div>
    )
  },
})
