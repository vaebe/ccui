import type { Ref } from 'vue'
import type { SliderProps } from '../slider-types'
import { computed, ref } from 'vue'

export function useSliderValue(
  props: SliderProps,
  emit: (event: 'update:modelValue' | 'input' | 'change', value: number | number[]) => void,
) {
  const currentValue = computed({
    get() {
      return props.modelValue
    },
    set(val: number | number[]) {
      emit('update:modelValue', val)
      emit('input', val)
    },
  })

  return {
    currentValue,
  }
}

export function useSliderCalculation(props: SliderProps) {
  const range = props.max - props.min

  // 计算百分比位置
  const getPercent = (value: number) => {
    if (range <= 0)
      return 0

    const percent = ((value - props.min) / range) * 100
    return Math.max(0, Math.min(100, percent))
  }

  // 根据百分比计算值（按 step 和 min 对齐）
  const getValueFromPercent = (percent: number) => {
    if (range <= 0)
      return props.min

    const raw = props.min + (percent / 100) * range

    if (props.step <= 0)
      return Math.max(props.min, Math.min(props.max, raw))

    const stepped
      = props.min + Math.round((raw - props.min) / props.step) * props.step

    return Math.max(props.min, Math.min(props.max, stepped))
  }

  return {
    getPercent,
    getValueFromPercent,
  }
}

export function useSliderStyle(
  props: SliderProps,
  currentValue: Ref<number | number[]>,
  getPercent: (value: number) => number,
) {
  // 计算滑块轨道样式
  const trackStyle = computed(() => {
    if (props.range && Array.isArray(currentValue.value)) {
      const [start, end] = currentValue.value
      if (props.vertical) {
        return {
          bottom: `${getPercent(start)}%`,
          height: `${getPercent(end) - getPercent(start)}%`,
        }
      }

      return {
        left: `${getPercent(start)}%`,
        width: `${getPercent(end) - getPercent(start)}%`,
      }
    }
    else {
      const value = Array.isArray(currentValue.value) ? currentValue.value[0] : currentValue.value
      if (props.vertical) {
        return {
          height: `${getPercent(value)}%`,
        }
      }

      return {
        width: `${getPercent(value)}%`,
      }
    }
  })

  // 计算第一个滑块位置
  const firstButtonStyle = computed(() => {
    const value = Array.isArray(currentValue.value) ? currentValue.value[0] : currentValue.value
    const percent = getPercent(value)

    if (props.vertical) {
      return { bottom: `${percent}%` }
    }

    return { left: `${percent}%` }
  })

  // 计算第二个滑块位置
  const secondButtonStyle = computed(() => {
    if (props.range && Array.isArray(currentValue.value)) {
      if (props.vertical) {
        return {
          bottom: `${getPercent(currentValue.value[1])}%`,
        }
      }

      return {
        left: `${getPercent(currentValue.value[1])}%`,
      }
    }
    return {}
  })

  return {
    trackStyle,
    firstButtonStyle,
    secondButtonStyle,
  }
}

export function useSliderInteraction(
  props: SliderProps,
  currentValue: Ref<number | number[]>,
  emit: (event: 'update:modelValue' | 'input' | 'change', value: number | number[]) => void,
  sliderRef: Ref<HTMLElement | undefined>,
  getValueFromPercent: (percent: number) => number,
) {
  const isDragging = ref(false)
  const dragIndex = ref<number | null>(null)

  // 获取鼠标/触摸位置
  const getPosition = (event: MouseEvent | TouchEvent) => {
    const rect = sliderRef.value?.getBoundingClientRect()
    if (!rect)
      return 0

    if (props.vertical) {
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY
      return ((rect.bottom - clientY) / rect.height) * 100
    }

    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
    return ((clientX - rect.left) / rect.width) * 100
  }

  // 处理滑块点击
  const handleSliderClick = (event: MouseEvent) => {
    if (props.disabled || isDragging.value)
      return

    const percent = getPosition(event)
    const newValue = getValueFromPercent(percent)

    if (props.range && Array.isArray(currentValue.value)) {
      const [start, end] = currentValue.value
      const mid = (start + end) / 2

      if (newValue <= mid) {
        currentValue.value = [Math.max(props.min, Math.min(newValue, end)), end]
      }
      else {
        currentValue.value = [start, Math.min(props.max, Math.max(newValue, start))]
      }
    }
    else {
      currentValue.value = Math.max(props.min, Math.min(props.max, newValue))
    }

    emit('change', currentValue.value)
  }

  // 拖拽移动
  const handleDragMove = (event: MouseEvent | TouchEvent) => {
    if (!isDragging.value)
      return

    event.preventDefault()
    const percent = getPosition(event as MouseEvent)
    const newValue = getValueFromPercent(percent)

    if (props.range && Array.isArray(currentValue.value)) {
      const [start, end] = currentValue.value

      if (dragIndex.value === 0) {
        currentValue.value = [Math.max(props.min, Math.min(newValue, end)), end]
      }
      else {
        currentValue.value = [start, Math.min(props.max, Math.max(newValue, start))]
      }
    }
    else {
      currentValue.value = Math.max(props.min, Math.min(props.max, newValue))
    }
  }

  // 结束拖拽
  const handleDragEnd = () => {
    if (!isDragging.value)
      return

    isDragging.value = false
    dragIndex.value = null

    document.removeEventListener('mousemove', handleDragMove)
    document.removeEventListener('mouseup', handleDragEnd)
    document.removeEventListener('touchmove', handleDragMove)
    document.removeEventListener('touchend', handleDragEnd)

    emit('change', currentValue.value)
  }

  // 开始拖拽
  const handleDragStart = (event: MouseEvent | TouchEvent, index?: number) => {
    if (props.disabled)
      return

    event.preventDefault()
    isDragging.value = true
    dragIndex.value = index ?? 0

    document.addEventListener('mousemove', handleDragMove)
    document.addEventListener('mouseup', handleDragEnd)
    document.addEventListener('touchmove', handleDragMove)
    document.addEventListener('touchend', handleDragEnd)
  }

  // Cleanup function
  const cleanup = () => {
    if (isDragging.value) {
      handleDragEnd()
    }
  }

  return {
    isDragging,
    dragIndex,
    handleSliderClick,
    handleDragStart,
    handleDragEnd,
    cleanup,
  }
}

export function useSliderKeyboard(
  props: SliderProps,
  currentValue: Ref<number | number[]>,
  emit: (event: 'update:modelValue' | 'input' | 'change', value: number | number[]) => void,
) {
  // 键盘事件处理
  const handleKeydown = (event: KeyboardEvent, index?: number) => {
    if (props.disabled)
      return

    let delta = 0
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        delta = -props.step
        break
      case 'ArrowRight':
      case 'ArrowUp':
        delta = props.step
        break
      case 'Home':
        delta = props.min - (Array.isArray(currentValue.value)
          ? currentValue.value[index ?? 0]
          : currentValue.value)
        break
      case 'End':
        delta = props.max - (Array.isArray(currentValue.value)
          ? currentValue.value[index ?? 0]
          : currentValue.value)
        break
      default:
        return
    }

    event.preventDefault()

    if (props.range && Array.isArray(currentValue.value)) {
      const [start, end] = currentValue.value

      if (index === 0) {
        const newStart = Math.max(props.min, Math.min(start + delta, end))
        currentValue.value = [newStart, end]
      }
      else {
        const newEnd = Math.min(props.max, Math.max(end + delta, start))
        currentValue.value = [start, newEnd]
      }
    }
    else {
      const current = Array.isArray(currentValue.value) ? currentValue.value[0] : currentValue.value
      currentValue.value = Math.max(props.min, Math.min(props.max, current + delta))
    }

    emit('change', currentValue.value)
  }

  return {
    handleKeydown,
  }
}

export function useSliderMarks(
  props: SliderProps,
  getPercent: (value: number) => number,
) {
  // 计算标记
  const marks = computed(() => {
    if (!props.marks)
      return {}

    const result: Record<number, any> = {}
    Object.keys(props.marks).forEach((key) => {
      const value = Number(key)
      if (value >= props.min && value <= props.max) {
        result[value] = props.marks![key as any]
      }
    })
    return result
  })

  // 获取标记样式
  const getMarkStyle = (value: number) => {
    const percent = getPercent(value)
    const mark = marks.value[value]

    const baseStyle = props.vertical
      ? { bottom: `${percent}%` }
      : { left: `${percent}%` }

    if (typeof mark === 'object' && mark.style) {
      return { ...baseStyle, ...mark.style }
    }
    return baseStyle
  }

  // 获取标记标签
  const getMarkLabel = (value: number) => {
    const mark = marks.value[value]
    if (typeof mark === 'string') {
      return mark
    }
    else if (typeof mark === 'object' && mark.label !== undefined) {
      return mark.label
    }
    return value
  }

  return {
    marks,
    getMarkStyle,
    getMarkLabel,
  }
}

export function useSliderInput(
  props: SliderProps,
  currentValue: Ref<number | number[]>,
  emit: (event: 'update:modelValue' | 'input' | 'change', value: number | number[]) => void,
) {
  // 处理输入框变化
  const handleInputChange = (value: number | undefined, index?: number) => {
    if (value === undefined || value === null) {
      return
    }

    const clampedValue = Math.max(props.min, Math.min(props.max, value))

    if (props.range && Array.isArray(currentValue.value)) {
      const [start, end] = currentValue.value
      if (index === 0) {
        currentValue.value = [Math.min(clampedValue, end), end]
      }
      else {
        currentValue.value = [start, Math.max(clampedValue, start)]
      }
    }
    else {
      currentValue.value = clampedValue
    }

    emit('change', currentValue.value)

    // 触发表单验证
    if (props.validateEvent) {
      // 这里可以集成表单验证逻辑
      // 例如：formItem?.validate?.('change')
    }
  }

  return {
    handleInputChange,
  }
}
