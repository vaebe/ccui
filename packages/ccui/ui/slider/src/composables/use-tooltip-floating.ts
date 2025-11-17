import type { Ref } from 'vue'
import type { SliderProps } from '../slider-types'
import { flip, offset, shift } from '@floating-ui/dom'
import { useFloating } from '@floating-ui/vue'
import { computed, ref, watch } from 'vue'

export function useSliderTooltipWithFloating(
  props: SliderProps,
  isDragging: Ref<boolean>,
  currentValue: Ref<number | number[]>,
) {
  const isHovering = ref(false)
  const hoverIndex = ref<number | null>(null)
  const buttonRefs = ref<(HTMLElement | null)[]>([])
  const tooltipRefs = ref<(HTMLElement | null)[]>([])

  // 是否显示 Tooltip
  const shouldShowTooltip = computed(() => props.showTooltip && props.tipsRenderer !== null)

  // 是否应该显示 Tooltip（考虑悬停和拖拽状态）
  const shouldDisplayTooltip = computed(() => {
    return shouldShowTooltip.value && (isDragging.value || isHovering.value)
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

  // 设置 floating-ui
  const setupTooltipFloating = (buttonIndex: number) => {
    const buttonRef = ref<HTMLElement | null>(null)
    const tooltipRef = ref<HTMLElement | null>(null)

    const placement = props.vertical && props.placement === 'top'
      ? 'right'
      : props.vertical && props.placement === 'bottom'
        ? 'left'
        : props.placement

    const { floatingStyles } = useFloating(buttonRef, tooltipRef, {
      placement,
      middleware: [
        offset(8),
        flip(),
        shift(),
      ],
    })

    // 更新 refs
    watch(buttonRef, (el) => {
      if (buttonRefs.value.length <= buttonIndex) {
        buttonRefs.value.length = buttonIndex + 1
      }
      buttonRefs.value[buttonIndex] = el
    })

    watch(tooltipRef, (el) => {
      if (tooltipRefs.value.length <= buttonIndex) {
        tooltipRefs.value.length = buttonIndex + 1
      }
      tooltipRefs.value[buttonIndex] = el
    })

    return {
      buttonRef,
      tooltipRef,
      floatingStyles,
    }
  }

  return {
    isHovering,
    hoverIndex,
    buttonRefs,
    tooltipRefs,
    shouldShowTooltip,
    shouldDisplayTooltip,
    formatTooltipText,
    getAriaValueText,
    handleButtonMouseEnter,
    handleButtonMouseLeave,
    getCurrentValue,
    shouldShowTooltipForButton,
    setupTooltipFloating,
  }
}
