import type { SliderProps } from './slider-types'
import { defineComponent, onUnmounted, ref } from 'vue'
import { InputNumber } from '../../input-number'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Tooltip } from '../../tooltip'
import {
  useSliderCalculation,
  useSliderInput,
  useSliderInteraction,
  useSliderKeyboard,
  useSliderMarks,
  useSliderStyle,
  useSliderValue,
} from './composables/use-slider'
import { useSliderTooltip } from './composables/use-slider-tooltip'
import { sliderProps } from './slider-types'
import './slider.scss'

export default defineComponent({
  name: 'CSlider',
  props: sliderProps,
  emits: ['update:modelValue', 'change', 'input'],
  setup(props: SliderProps, { emit }) {
    const ns = useNamespace('slider')
    const sliderRef = ref<HTMLElement>()

    // 使用组合式函数
    const { currentValue } = useSliderValue(props, emit)
    const { getPercent, getValueFromPercent } = useSliderCalculation(props)
    const { trackStyle, firstButtonStyle, secondButtonStyle } = useSliderStyle(
      props,
      currentValue,
      getPercent,
    )
    const { isDragging, handleSliderClick, handleDragStart, handleDragEnd } = useSliderInteraction(
      props,
      currentValue,
      emit,
      sliderRef,
      getValueFromPercent,
    )
    const { handleKeydown } = useSliderKeyboard(props, currentValue, emit)
    const { marks, getMarkStyle, getMarkLabel } = useSliderMarks(props, getPercent)
    const { handleInputChange } = useSliderInput(props, currentValue, emit)
    const {
      formatTooltipText,
      getDefaultText,
      getAriaValueText,
      handleButtonMouseEnter,
      handleButtonMouseLeave,
      shouldShowTooltipForButton,
      shouldShowDefaultTooltipForButton,
      getCurrentValue,
      getTooltipContent,
      getTooltipVisible,
      getTooltipPlacement,
    } = useSliderTooltip(props, isDragging, currentValue)

    // 清理事件监听器
    onUnmounted(() => {
      document.removeEventListener('mousemove', handleDragEnd)
      document.removeEventListener('mouseup', handleDragEnd)
      document.removeEventListener('touchmove', handleDragEnd)
      document.removeEventListener('touchend', handleDragEnd)
    })

    // 渲染滑块按钮的函数
    const renderButton = (index: number, value: number, style: any, ariaLabel: string) => {
      const buttonProps = {
        'class': [
          ns.e('button'),
          { [ns.em('button', 'disabled')]: props.disabled },
        ],
        'tabindex': props.disabled ? -1 : 0,
        'onMousedown': (e: MouseEvent) => handleDragStart(e, index),
        'onTouchstart': (e: TouchEvent) => handleDragStart(e, index),
        'onKeydown': (e: KeyboardEvent) => handleKeydown(e, index),
        'onMouseenter': () => handleButtonMouseEnter(index),
        'onMouseleave': handleButtonMouseLeave,
        'role': 'slider',
        'aria-label': ariaLabel,
        'aria-valuemin': props.min,
        'aria-valuemax': props.max,
        'aria-valuenow': value,
        'aria-valuetext': getAriaValueText(value),
        'aria-orientation': props.vertical ? 'vertical' : 'horizontal',
      }

      return props.showTooltip
        ? (
            <Tooltip
              content={getTooltipContent(index)}
              visible={getTooltipVisible(index)}
              placement={getTooltipPlacement()}
              effect="dark"
              showArrow={true}
              trigger="manual"
              popperClass={props.tooltipClass}
            >
              <div {...buttonProps} />
            </Tooltip>
          )
        : (
            <div {...buttonProps} />
          )
    }

    return {
      ns,
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
      getDefaultText,
      getPercent,
      getValueFromPercent,
      handleInputChange,
      getAriaValueText,
      handleButtonMouseEnter,
      handleButtonMouseLeave,
      shouldShowTooltipForButton,
      shouldShowDefaultTooltipForButton,
      getCurrentValue,
      getTooltipContent,
      getTooltipVisible,
      getTooltipPlacement,
      renderButton,
    }
  },
  render() {
    const isRange = this.range && Array.isArray(this.currentValue)
    const firstValue = this.getCurrentValue(0)
    const secondValue = isRange ? this.getCurrentValue(1) : 0

    return (
      <div
        class={[
          this.ns.b(),
          {
            [this.ns.m('disabled')]: this.disabled,
            [this.ns.m('vertical')]: this.vertical,
            [this.ns.m('with-input')]: this.showInput && !this.range,
            [this.ns.m(this.size)]: this.size !== 'default',
          },
        ]}
        style={this.vertical ? { height: this.height } : {}}
        aria-label={this.label || this.ariaLabel}
      >
        {/* 输入框 */}
        {this.showInput && !this.range && (
          <div class={this.ns.e('input')}>
            <InputNumber
              modelValue={this.currentValue as number}
              min={this.min}
              max={this.max}
              step={this.step}
              disabled={this.disabled}
              size={this.inputSize}
              controls={this.showInputControls}
              precision={this.precision}
              onUpdate:modelValue={this.handleInputChange}
              onChange={this.handleInputChange}
              class={this.ns.e('input-number')}
            />
          </div>
        )}

        {/* 滑块容器 */}
        <div
          ref="sliderRef"
          class={this.ns.e('wrapper')}
          onClick={this.handleSliderClick}
          role="slider"
          aria-label={this.ariaLabel || (this.range ? 'range slider' : 'slider')}
          aria-valuemin={this.min}
          aria-valuemax={this.max}
          aria-orientation={this.vertical ? 'vertical' : 'horizontal'}
        >
          {/* 轨道 */}
          <div class={this.ns.e('track')}>
            <div class={this.ns.e('bar')} style={this.trackStyle}></div>
          </div>

          {/* 刻度点 */}
          {this.showStops && (
            <div class={this.ns.e('stops')}>
              {Array.from({ length: Math.floor((this.max - this.min) / this.step) + 1 })
                .map((_, index) => {
                  const stopValue = this.min + index * this.step
                  const percent = this.getPercent(stopValue)
                  return (
                    <div
                      key={index}
                      class={this.ns.e('stop')}
                      style={{ [this.vertical ? 'bottom' : 'left']: `${percent}%` }}
                    >
                    </div>
                  )
                })}
            </div>
          )}

          {/* 标记 */}
          {this.marks && Object.keys(this.marks).length > 0 && (
            <div class={this.ns.e('marks')}>
              {Object.keys(this.marks).map((key) => {
                const value = Number(key)
                return (
                  <div
                    key={value}
                    class={this.ns.e('mark')}
                    style={this.getMarkStyle(value)}
                  >
                    <div class={this.ns.e('mark-line')}></div>
                    <span class={this.ns.e('mark-label')}>
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
              this.ns.e('button-wrapper'),
              { [this.ns.em('button-wrapper', 'first')]: isRange },
            ]}
            style={this.firstButtonStyle}
          >
            {this.renderButton(0, firstValue, this.firstButtonStyle, this.rangeStartLabel || 'start value')}
          </div>

          {/* 第二个滑块按钮（范围模式） */}
          {isRange && (
            <div
              class={[this.ns.e('button-wrapper'), this.ns.em('button-wrapper', 'second')]}
              style={this.secondButtonStyle}
            >
              {this.renderButton(1, secondValue, this.secondButtonStyle, this.rangeEndLabel || 'end value')}
            </div>
          )}
        </div>
      </div>
    )
  },
})
