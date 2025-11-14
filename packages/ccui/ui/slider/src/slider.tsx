import type { SliderMarks, SliderProps } from './slider-types'
import { computed, defineComponent, onUnmounted, ref } from 'vue'
import { sliderProps } from './slider-types'
import './slider.scss'

export default defineComponent({
  name: 'CSlider',
  props: sliderProps,
  emits: ['update:modelValue', 'change', 'input'],
  setup(props: SliderProps, { emit }) {
    const sliderRef = ref<HTMLElement>()
    const isDragging = ref(false)
    const dragIndex = ref<number | null>(null)

    // 计算当前值
    const currentValue = computed({
      get() {
        return props.modelValue
      },
      set(val: number | number[]) {
        emit('update:modelValue', val)
        emit('input', val)
      },
    })

    // 计算百分比位置
    const getPercent = (value: number) => {
      return Math.max(0, Math.min(100, ((value - props.min) / (props.max - props.min)) * 100))
    }

    // 根据百分比计算值
    const getValueFromPercent = (percent: number) => {
      const value = props.min + (percent / 100) * (props.max - props.min)
      return Math.round(value / props.step) * props.step
    }

    // 计算滑块轨道样式
    const trackStyle = computed(() => {
      if (props.range && Array.isArray(currentValue.value)) {
        const [start, end] = currentValue.value
        return {
          left: `${getPercent(start)}%`,
          width: `${getPercent(end) - getPercent(start)}%`,
        }
      }
      else {
        const value = Array.isArray(currentValue.value) ? currentValue.value[0] : currentValue.value
        return {
          width: `${getPercent(value)}%`,
        }
      }
    })

    // 计算第一个滑块位置
    const firstButtonStyle = computed(() => {
      const value = Array.isArray(currentValue.value) ? currentValue.value[0] : currentValue.value
      return {
        left: `${getPercent(value)}%`,
      }
    })

    // 计算第二个滑块位置
    const secondButtonStyle = computed(() => {
      if (props.range && Array.isArray(currentValue.value)) {
        return {
          left: `${getPercent(currentValue.value[1])}%`,
        }
      }
      return {}
    })

    // 获取鼠标/触摸位置
    const getPosition = (event: MouseEvent | TouchEvent) => {
      const rect = sliderRef.value?.getBoundingClientRect()
      if (!rect)
        return 0

      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
      return props.vertical
        ? (rect.bottom - clientX) / rect.height * 100
        : (clientX - rect.left) / rect.width * 100
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

    // 计算标记
    const marks = computed(() => {
      if (!props.marks)
        return {}

      const result: SliderMarks = {}
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

    // 处理输入框变化
    const handleInputChange = (event: Event) => {
      const target = event.target as HTMLInputElement
      const value = target.value
      const numValue = value === '' ? props.min : Number(value)

      if (!Number.isNaN(numValue)) {
        const clampedValue = Math.max(props.min, Math.min(props.max, numValue))
        currentValue.value = clampedValue
        emit('change', clampedValue)
      }
    }

    // 计算 Tooltip 样式
    const getTooltipStyle = (placement: string) => {
      const baseStyle: Record<string, string> = {}

      switch (placement) {
        case 'top':
          baseStyle.bottom = '100%'
          baseStyle.left = '50%'
          baseStyle.transform = 'translateX(-50%)'
          baseStyle.marginBottom = '8px'
          break
        case 'right':
          baseStyle.left = '100%'
          baseStyle.top = '50%'
          baseStyle.transform = 'translateY(-50%)'
          baseStyle.marginLeft = '8px'
          break
        case 'bottom':
          baseStyle.top = '100%'
          baseStyle.left = '50%'
          baseStyle.transform = 'translateX(-50%)'
          baseStyle.marginTop = '8px'
          break
        case 'left':
          baseStyle.right = '100%'
          baseStyle.top = '50%'
          baseStyle.transform = 'translateY(-50%)'
          baseStyle.marginRight = '8px'
          break
        default:
          baseStyle.bottom = '100%'
          baseStyle.left = '50%'
          baseStyle.transform = 'translateX(-50%)'
          baseStyle.marginBottom = '8px'
      }

      return baseStyle
    }

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

    // 是否显示 Tooltip
    const shouldShowTooltip = computed(() => {
      return props.showTooltip && props.tipsRenderer !== null
    })

    // 清理事件监听器
    onUnmounted(() => {
      document.removeEventListener('mousemove', handleDragMove)
      document.removeEventListener('mouseup', handleDragEnd)
      document.removeEventListener('touchmove', handleDragMove)
      document.removeEventListener('touchend', handleDragEnd)
    })

    return {
      sliderRef,
      isDragging,
      currentValue,
      trackStyle,
      firstButtonStyle,
      secondButtonStyle,
      handleSliderClick,
      handleDragStart,
      handleKeydown,
      marks,
      getMarkStyle,
      getMarkLabel,
      formatTooltipText,
      getPercent,
      getValueFromPercent,
      handleInputChange,
      getTooltipStyle,
      shouldShowTooltip,
    }
  },
  render() {
    const isRange = this.range && Array.isArray(this.currentValue)
    const firstValue = isRange ? (this.currentValue as number[])[0] : (this.currentValue as number)
    const secondValue = isRange ? (this.currentValue as number[])[1] : 0

    return (
      <div
        class={[
          'ccui-slider',
          {
            'ccui-slider--disabled': this.disabled,
            'ccui-slider--vertical': this.vertical,
            'ccui-slider--with-input': this.showInput && !this.range,
            [`ccui-slider--${this.size}`]: this.size !== 'default',
          },
        ]}
        style={this.vertical ? { height: this.height } : {}}
      >
        {/* 输入框 */}
        {this.showInput && !this.range && (
          <div class="ccui-slider__input">
            <input
              type="number"
              class="ccui-slider__input-inner"
              value={this.currentValue as number}
              min={this.min}
              max={this.max}
              step={this.step}
              disabled={this.disabled}
              onInput={(e: Event) => this.handleInputChange(e)}
              onChange={(e: Event) => this.handleInputChange(e)}
            />
          </div>
        )}

        {/* 滑块容器 */}
        <div
          ref="sliderRef"
          class="ccui-slider__wrapper"
          onClick={this.handleSliderClick}
        >
          {/* 轨道 */}
          <div class="ccui-slider__track">
            <div class="ccui-slider__bar" style={this.trackStyle}></div>
          </div>

          {/* 刻度点 */}
          {this.showStops && (
            <div class="ccui-slider__stops">
              {Array.from({ length: Math.floor((this.max - this.min) / this.step) + 1 })
                .map((_, index) => {
                  const stopValue = this.min + index * this.step
                  const percent = ((stopValue - this.min) / (this.max - this.min)) * 100
                  return (
                    <div
                      key={index}
                      class="ccui-slider__stop"
                      style={{ [this.vertical ? 'bottom' : 'left']: `${percent}%` }}
                    >
                    </div>
                  )
                })}
            </div>
          )}

          {/* 标记 */}
          {this.marks && Object.keys(this.marks).length > 0 && (
            <div class="ccui-slider__marks">
              {Object.keys(this.marks).map((key) => {
                const value = Number(key)
                return (
                  <div
                    key={value}
                    class="ccui-slider__mark"
                    style={this.getMarkStyle(value)}
                  >
                    <div class="ccui-slider__mark-line"></div>
                    <span class="ccui-slider__mark-label">
                      {this.getMarkLabel(value)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {/* 第一个滑块按钮 */}
          <div
            class={[
              'ccui-slider__button-wrapper',
              { 'ccui-slider__button-wrapper--first': isRange },
            ]}
            style={this.firstButtonStyle}
          >
            <div
              class={[
                'ccui-slider__button',
                { 'ccui-slider__button--disabled': this.disabled },
              ]}
              tabindex={this.disabled ? -1 : 0}
              onMousedown={(e: MouseEvent) => this.handleDragStart(e, 0)}
              onTouchstart={(e: TouchEvent) => this.handleDragStart(e, 0)}
              onKeydown={(e: KeyboardEvent) => this.handleKeydown(e, 0)}
            >
              {this.shouldShowTooltip && this.formatTooltipText(firstValue) && (
                <div
                  class={[
                    'ccui-slider__tooltip',
                    `ccui-slider__tooltip--${this.placement}`,
                    this.tooltipClass,
                  ]}
                  style={this.getTooltipStyle(this.placement)}
                >
                  {this.formatTooltipText(firstValue)}
                </div>
              )}
            </div>
          </div>

          {/* 第二个滑块按钮（范围模式） */}
          {isRange && (
            <div
              class="ccui-slider__button-wrapper ccui-slider__button-wrapper--second"
              style={this.secondButtonStyle}
            >
              <div
                class={[
                  'ccui-slider__button',
                  { 'ccui-slider__button--disabled': this.disabled },
                ]}
                tabindex={this.disabled ? -1 : 0}
                onMousedown={(e: MouseEvent) => this.handleDragStart(e, 1)}
                onTouchstart={(e: TouchEvent) => this.handleDragStart(e, 1)}
                onKeydown={(e: KeyboardEvent) => this.handleKeydown(e, 1)}
              >
                {this.shouldShowTooltip && this.formatTooltipText(secondValue) && (
                  <div
                    class={[
                      'ccui-slider__tooltip',
                      `ccui-slider__tooltip--${this.placement}`,
                      this.tooltipClass,
                    ]}
                    style={this.getTooltipStyle(this.placement)}
                  >
                    {this.formatTooltipText(secondValue)}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  },
})
