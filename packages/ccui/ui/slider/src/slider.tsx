import type { SliderProps } from './slider-types'
import { defineComponent, onUnmounted, ref } from 'vue'
import { InputNumber } from '../../input-number'
import { useNamespace } from '../../shared/hooks/use-namespace'
import {
  useSliderCalculation,
  useSliderInput,
  useSliderInteraction,
  useSliderKeyboard,
  useSliderMarks,
  useSliderStyle,
  useSliderValue,
} from './composables/use-slider'
import { useSliderTooltipWithFloating } from './composables/use-tooltip-floating'
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
      getAriaValueText,
      handleButtonMouseEnter,
      handleButtonMouseLeave,
      shouldShowTooltipForButton,
      getCurrentValue,
      setupTooltipFloating,
    } = useSliderTooltipWithFloating(props, isDragging, currentValue)

    // 设置 floating-ui tooltip
    const { buttonRef: firstButtonRef, tooltipRef: firstTooltipRef, floatingStyles: firstTooltipStyles } = setupTooltipFloating(0)
    const { buttonRef: secondButtonRef, tooltipRef: secondTooltipRef, floatingStyles: secondTooltipStyles } = setupTooltipFloating(1)

    // 清理事件监听器
    onUnmounted(() => {
      document.removeEventListener('mousemove', handleDragEnd)
      document.removeEventListener('mouseup', handleDragEnd)
      document.removeEventListener('touchmove', handleDragEnd)
      document.removeEventListener('touchend', handleDragEnd)
    })

    return {
      ns,
      sliderRef,
      firstButtonRef,
      firstTooltipRef,
      firstTooltipStyles,
      secondButtonRef,
      secondTooltipRef,
      secondTooltipStyles,
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
      getAriaValueText,
      handleButtonMouseEnter,
      handleButtonMouseLeave,
      shouldShowTooltipForButton,
      getCurrentValue,
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
            <div
              ref={this.firstButtonRef}
              class={[
                this.ns.e('button'),
                { [this.ns.em('button', 'disabled')]: this.disabled },
              ]}
              tabindex={this.disabled ? -1 : 0}
              onMousedown={(e: MouseEvent) => this.handleDragStart(e, 0)}
              onTouchstart={(e: TouchEvent) => this.handleDragStart(e, 0)}
              onKeydown={(e: KeyboardEvent) => this.handleKeydown(e, 0)}
              onMouseenter={() => this.handleButtonMouseEnter(0)}
              onMouseleave={this.handleButtonMouseLeave}
              role="slider"
              aria-label={this.rangeStartLabel || 'start value'}
              aria-valuemin={this.min}
              aria-valuemax={this.max}
              aria-valuenow={firstValue}
              aria-valuetext={this.getAriaValueText(firstValue)}
              aria-orientation={this.vertical ? 'vertical' : 'horizontal'}
            >
              {this.shouldShowTooltipForButton(0) && this.formatTooltipText(firstValue) && (
                <div
                  ref={this.firstTooltipRef}
                  style={this.firstTooltipStyles}
                  class={[
                    this.ns.e('tooltip'),
                    this.tooltipClass,
                    { [this.ns.em('tooltip', 'persistent')]: this.persistent },
                  ]}
                >
                  {this.formatTooltipText(firstValue)}
                </div>
              )}
            </div>
          </div>

          {/* 第二个滑块按钮（范围模式） */}
          {isRange && (
            <div
              class={[this.ns.e('button-wrapper'), this.ns.em('button-wrapper', 'second')]}
              style={this.secondButtonStyle}
            >
              <div
                ref={this.secondButtonRef}
                class={[
                  this.ns.e('button'),
                  { [this.ns.em('button', 'disabled')]: this.disabled },
                ]}
                tabindex={this.disabled ? -1 : 0}
                onMousedown={(e: MouseEvent) => this.handleDragStart(e, 1)}
                onTouchstart={(e: TouchEvent) => this.handleDragStart(e, 1)}
                onKeydown={(e: KeyboardEvent) => this.handleKeydown(e, 1)}
                onMouseenter={() => this.handleButtonMouseEnter(1)}
                onMouseleave={this.handleButtonMouseLeave}
                role="slider"
                aria-label={this.rangeEndLabel || 'end value'}
                aria-valuemin={this.min}
                aria-valuemax={this.max}
                aria-valuenow={secondValue}
                aria-valuetext={this.getAriaValueText(secondValue)}
                aria-orientation={this.vertical ? 'vertical' : 'horizontal'}
              >
                {this.shouldShowTooltipForButton(1) && this.formatTooltipText(secondValue) && (
                  <div
                    ref={this.secondTooltipRef}
                    style={this.secondTooltipStyles}
                    class={[
                      this.ns.e('tooltip'),
                      this.tooltipClass,
                      { [this.ns.em('tooltip', 'persistent')]: this.persistent },
                    ]}
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
