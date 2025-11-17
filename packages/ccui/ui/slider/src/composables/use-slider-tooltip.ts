import type { Ref } from 'vue'
import type { SliderProps } from '../slider-types'
import { computed, ref } from 'vue'

export function useSliderTooltip(
  props: SliderProps,
  isDragging: Ref<boolean>,
  currentValue: Ref<number | number[]>,
) {
  const isHovering = ref(false)
  const hoverIndex = ref<number | null>(null)

  // 是否显示 Tooltip
  const shouldShowTooltip = computed(() => props.showTooltip)

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

  // 获取默认文本（用于没有 tipsRenderer 的情况）
  const getDefaultText = (value: number) => {
    if (props.formatTooltip) {
      return props.formatTooltip(value)
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
    return shouldShowTooltip.value && (hoverIndex.value === index || isDragging.value)
  }

  // 判断是否显示默认 tooltip（没有 tipsRenderer 的情况）
  const shouldShowDefaultTooltipForButton = (index: number) => {
    return props.showTooltip
      && props.tipsRenderer === null
      && props.showDefaultTooltip
      && (hoverIndex.value === index || isDragging.value || props.persistent)
  }

  // 获取 tooltip 内容
  const getTooltipContent = (index: number) => {
    const value = getCurrentValue(index)

    if (shouldShowTooltipForButton(index) && formatTooltipText(value)) {
      return formatTooltipText(value)
    }

    if (shouldShowDefaultTooltipForButton(index)) {
      return getDefaultText(value)
    }

    return ''
  }

  // 获取 tooltip 可见性
  const getTooltipVisible = (index: number) => {
    return shouldShowTooltipForButton(index) || shouldShowDefaultTooltipForButton(index)
  }

  // 获取 tooltip 位置
  const getTooltipPlacement = () => {
    return props.vertical ? 'right' : 'top'
  }

  return {
    isHovering,
    hoverIndex,
    shouldShowTooltip,
    formatTooltipText,
    getDefaultText,
    getAriaValueText,
    handleButtonMouseEnter,
    handleButtonMouseLeave,
    getCurrentValue,
    shouldShowTooltipForButton,
    shouldShowDefaultTooltipForButton,
    getTooltipContent,
    getTooltipVisible,
    getTooltipPlacement,
  }
}
