import type { Ref } from 'vue'
import type { SliderProps } from '../slider-types'
import { flip, offset, shift } from '@floating-ui/dom'
import { useFloating } from '@floating-ui/vue'
import { computed, ref } from 'vue'

export function useSliderTooltip(
  props: SliderProps,
  isDragging: Ref<boolean>,
  currentValue: Ref<number | number[]>,
) {
  const isHovering = ref(false)
  const hoverIndex = ref<number | null>(null)
  const tooltipRefs = ref<(HTMLElement | null)[]>([])

  // 是否显示 Tooltip
  const shouldShowTooltip = computed(() => {
    return props.showTooltip && props.tipsRenderer !== null
  })

  // Tooltip 是否持久化显示
  const shouldPersistTooltip = computed(() => {
    return props.persistent && shouldShowTooltip.value
  })

  // 是否应该显示 Tooltip（考虑悬停和拖拽状态）
  const shouldDisplayTooltip = computed(() => {
    if (!shouldShowTooltip.value)
      return false
    if (shouldPersistTooltip.value)
      return true
    return isDragging.value || isHovering.value
  })

  // 格式化提示文本
  const formatTooltipText = (value: number) => {
    if (props.tipsRenderer === null) {
      return null
    }
    if (props.formatTooltip) {
      return props.formatTooltip(value)
    }
    if (props.tipsRenderer) {
      return props.tipsRenderer(value)
    }
    return value.toString()
  }

  // 格式化值文本用于无障碍访问
  const getAriaValueText = (value: number) => {
    if (props.formatValueText) {
      return props.formatValueText(value)
    }
    return value.toString()
  }

  // 设置 floating-ui 引用
  const setupTooltipFloating = (buttonRef: Ref<HTMLElement | null>, tooltipRef: Ref<HTMLElement | null>, _index: number) => {
    const { floatingStyles } = useFloating(buttonRef, tooltipRef, {
      placement: props.vertical && props.placement === 'top'
        ? 'right'
        : props.vertical && props.placement === 'bottom'
          ? 'left'
          : props.placement,
      middleware: [
        offset(8),
        flip(),
        shift(),
      ],
    })

    return {
      floatingStyles,
    }
  }

  // 处理按钮悬停
  const handleButtonMouseEnter = (index: number) => {
    if (!props.disabled) {
      isHovering.value = true
      hoverIndex.value = index
    }
  }

  const handleButtonMouseLeave = () => {
    isHovering.value = false
    hoverIndex.value = null
  }

  // 获取当前值
  const getCurrentValue = (index: number) => {
    if (props.range && Array.isArray(currentValue.value)) {
      return currentValue.value[index]
    }
    return Array.isArray(currentValue.value) ? currentValue.value[0] : currentValue.value
  }

  // 判断是否显示 tooltip
  const shouldShowTooltipForButton = (index: number) => {
    return shouldDisplayTooltip.value && (hoverIndex.value === index || isDragging.value)
  }

  return {
    isHovering,
    hoverIndex,
    tooltipRefs,
    shouldShowTooltip,
    shouldPersistTooltip,
    shouldDisplayTooltip,
    formatTooltipText,
    getAriaValueText,
    setupTooltipFloating,
    handleButtonMouseEnter,
    handleButtonMouseLeave,
    getCurrentValue,
    shouldShowTooltipForButton,
  }
}
