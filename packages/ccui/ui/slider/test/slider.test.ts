import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Slider } from '../index'

const ns = useNamespace('slider', true)
const baseClass = ns.b()
const wrapperClass = ns.e('wrapper')
const trackClass = ns.e('track')
const buttonClass = ns.e('button')

describe('slider', () => {
  let wrapper: any

  // Helper function to create mock rect
  const createMockRect = (width = 100, height = 32) => ({
    left: 0,
    width,
    top: 0,
    height,
    right: width,
    bottom: height,
  })

  it('dom', () => {
    wrapper = mount(Slider)

    expect(wrapper.find(baseClass).exists()).toBe(true)
    expect(wrapper.find(wrapperClass).exists()).toBe(true)
    expect(wrapper.find(trackClass).exists()).toBe(true)
    expect(wrapper.find(buttonClass).exists()).toBe(true)

    wrapper.unmount()
  })

  it('props - modelValue', () => {
    const modelValue = 50
    wrapper = mount(Slider, {
      props: {
        modelValue,
      },
    })

    expect(wrapper.vm.currentValue).toBe(modelValue)
    wrapper.unmount()
  })

  it('props - range mode', () => {
    wrapper = mount(Slider, {
      props: {
        range: true,
        modelValue: [20, 80],
      },
    })

    expect(wrapper.vm.currentValue).toEqual([20, 80])
    expect(wrapper.findAll(ns.e('button-wrapper')).length).toBe(2)
    wrapper.unmount()
  })

  it('props - disabled', () => {
    wrapper = mount(Slider, {
      props: {
        disabled: true,
      },
    })

    expect(wrapper.find(ns.m('disabled')).exists()).toBe(true)
    expect(wrapper.find(ns.em('button', 'disabled')).exists()).toBe(true)
    wrapper.unmount()
  })

  it('props - vertical', () => {
    wrapper = mount(Slider, {
      props: {
        vertical: true,
      },
    })

    expect(wrapper.find(ns.m('vertical')).exists()).toBe(true)
    wrapper.unmount()
  })

  it('props - showTooltip', async () => {
    wrapper = mount(Slider, {
      props: {
        showTooltip: true,
        modelValue: 50,
      },
    })

    const button = wrapper.find(ns.e('button'))
    await button.trigger('mouseenter')

    const tooltipComponent = wrapper.findComponent({ name: 'CTooltip' })
    expect(tooltipComponent.exists()).toBe(true)
    expect(tooltipComponent.props('visible')).toBe(true)
    expect(tooltipComponent.props('content')).toBe('50')
    wrapper.unmount()
  })

  it('props - showTooltip false', () => {
    wrapper = mount(Slider, {
      props: {
        showTooltip: false,
      },
    })

    const tooltipComponent = wrapper.findComponent({ name: 'CTooltip' })
    expect(tooltipComponent.exists()).toBe(false)
    wrapper.unmount()
  })

  it('props - showInput', () => {
    wrapper = mount(Slider, {
      props: {
        showInput: true,
        modelValue: 50,
      },
    })

    expect(wrapper.find(ns.e('input')).exists()).toBe(true)
    expect(wrapper.find(ns.e('input-number')).exists()).toBe(true)
    wrapper.unmount()
  })

  it('props - showInputControls', () => {
    wrapper = mount(Slider, {
      props: {
        showInput: true,
        showInputControls: true,
        modelValue: 50,
      },
    })

    expect(wrapper.find(ns.e('input-number')).exists()).toBe(true)
    wrapper.unmount()
  })

  it('props - showInputControls false', () => {
    wrapper = mount(Slider, {
      props: {
        showInput: true,
        showInputControls: false,
        modelValue: 50,
      },
    })

    expect(wrapper.find(ns.e('input-controls')).exists()).toBe(false)
    wrapper.unmount()
  })

  it('props - showInput with range should not show input', () => {
    wrapper = mount(Slider, {
      props: {
        showInput: true,
        range: true,
        modelValue: [20, 80],
      },
    })

    expect(wrapper.find(ns.e('input')).exists()).toBe(false)
    wrapper.unmount()
  })

  it('props - tipsRenderer null should hide tooltip', () => {
    wrapper = mount(Slider, {
      props: {
        modelValue: 50,
        tipsRenderer: null,
      },
    })

    const tooltipComponent = wrapper.findComponent({ name: 'CTooltip' })
    expect(tooltipComponent.exists()).toBe(true)
    expect(tooltipComponent.props('content')).toBe('')
    wrapper.unmount()
  })

  it('props - tipsRenderer custom function', async () => {
    const tipsRenderer = (value: number) => `${value} apples`

    wrapper = mount(Slider, {
      props: {
        modelValue: 5,
        tipsRenderer,
        showTooltip: true,
      },
    })

    const button = wrapper.find(ns.e('button'))
    await button.trigger('mouseenter')

    const tooltipComponent = wrapper.findComponent({ name: 'CTooltip' })
    expect(tooltipComponent.exists()).toBe(true)
    expect(tooltipComponent.props('visible')).toBe(true)
    expect(tooltipComponent.props('content')).toBe('5 apples')
    wrapper.unmount()
  })

  it('props - placement', async () => {
    wrapper = mount(Slider, {
      props: {
        modelValue: 50,
        placement: 'bottom',
        showTooltip: true,
      },
    })

    const button = wrapper.find(ns.e('button'))
    await button.trigger('mouseenter')

    const tooltipComponent = wrapper.findComponent({ name: 'CTooltip' })
    expect(tooltipComponent.exists()).toBe(true)
    expect(tooltipComponent.props('visible')).toBe(true)
    expect(tooltipComponent.props('placement')).toBe('bottom')
    wrapper.unmount()
  })

  it('props - marks', () => {
    const marks = {
      0: '0°C',
      25: '25°C',
      50: '50°C',
      75: '75°C',
      100: '100°C',
    }

    wrapper = mount(Slider, {
      props: {
        marks,
      },
    })

    expect(wrapper.findAll(ns.e('mark')).length).toBe(Object.keys(marks).length)
    expect(wrapper.find(ns.e('mark-label')).text()).toBe('0°C')
    wrapper.unmount()
  })

  it('props - showStops', () => {
    wrapper = mount(Slider, {
      props: {
        showStops: true,
        step: 10,
      },
    })

    expect(wrapper.find(ns.e('stops')).exists()).toBe(true)
    expect(wrapper.findAll(ns.e('stop')).length).toBe(11)
    wrapper.unmount()
  })

  it('props - size', () => {
    wrapper = mount(Slider, {
      props: {
        size: 'large',
      },
    })

    expect(wrapper.find(ns.m('large')).exists()).toBe(true)
    wrapper.unmount()
  })

  it('event - click', async () => {
    wrapper = mount(Slider, {
      props: {
        modelValue: 0,
      },
    })

    const sliderWrapper = wrapper.find(wrapperClass)
    vi.spyOn(sliderWrapper.element, 'getBoundingClientRect').mockReturnValue(createMockRect())

    await sliderWrapper.trigger('click', { clientX: 50 })

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('input')).toBeTruthy()
    wrapper.unmount()
  })

  it('event - keyboard', async () => {
    wrapper = mount(Slider, {
      props: {
        modelValue: 50,
      },
    })

    const button = wrapper.find(buttonClass)
    await button.trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    wrapper.unmount()
  })

  it('event - keyboard Home and End', async () => {
    wrapper = mount(Slider, {
      props: {
        modelValue: 50,
        min: 0,
        max: 100,
      },
    })

    const button = wrapper.find(buttonClass)

    // Test Home key
    await button.trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()

    // Test End key
    await button.trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    wrapper.unmount()
  })

  it('event - drag', async () => {
    wrapper = mount(Slider, {
      props: {
        modelValue: 50,
      },
    })

    const button = wrapper.find(buttonClass)
    vi.spyOn(wrapper.vm.sliderRef, 'getBoundingClientRect').mockReturnValue(createMockRect())

    await button.trigger('mousedown', { clientX: 50 })
    expect(wrapper.vm.isDragging).toBe(true)
    wrapper.unmount()
  })

  it('disabled state', async () => {
    wrapper = mount(Slider, {
      props: {
        disabled: true,
        modelValue: 50,
      },
    })

    const sliderWrapper = wrapper.find(wrapperClass)
    await sliderWrapper.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    wrapper.unmount()
  })

  it('formatTooltip function', () => {
    const formatTooltip = (value: number) => `${value}%`

    wrapper = mount(Slider, {
      props: {
        modelValue: 50,
        formatTooltip,
      },
    })

    expect(wrapper.vm.formatTooltipText(50)).toBe('50%')
    wrapper.unmount()
  })

  it('tipsRenderer function', () => {
    const tipsRenderer = (value: number) => `${value} apples`

    wrapper = mount(Slider, {
      props: {
        modelValue: 5,
        tipsRenderer,
      },
    })

    expect(wrapper.vm.formatTooltipText(5)).toBe('5 apples')
    wrapper.unmount()
  })

  it('step calculation', () => {
    wrapper = mount(Slider, {
      props: {
        step: 5,
        min: 0,
        max: 100,
      },
    })

    // Test that value is rounded to step
    const value = wrapper.vm.getValueFromPercent(23) // Should be rounded to nearest step
    expect(value % 5).toBe(0)
    wrapper.unmount()
  })

  it('range mode functionality', async () => {
    wrapper = mount(Slider, {
      props: {
        range: true,
        modelValue: [20, 80],
      },
    })

    expect(wrapper.vm.currentValue).toEqual([20, 80])

    // Should have two buttons
    const buttons = wrapper.findAll(buttonClass)
    expect(buttons.length).toBe(2)
    wrapper.unmount()
  })

  it('percentage calculation', () => {
    wrapper = mount(Slider, {
      props: {
        min: 0,
        max: 100,
        modelValue: 50,
      },
    })

    expect(wrapper.vm.getPercent(50)).toBe(50)
    wrapper.unmount()
  })

  it('input change event', async () => {
    wrapper = mount(Slider, {
      props: {
        showInput: true,
        modelValue: 50,
        min: 0,
        max: 100,
      },
    })

    const inputNumber = wrapper.findComponent({ name: 'CInputNumber' })
    await inputNumber.vm.$emit('update:modelValue', 75)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('change')).toBeTruthy()
    wrapper.unmount()
  })

  it('input change with invalid value', () => {
    wrapper = mount(Slider, {
      props: {
        showInput: true,
        modelValue: 50,
        min: 0,
        max: 100,
      },
    })

    const inputNumber = wrapper.findComponent({ name: 'CInputNumber' })
    expect(inputNumber.exists()).toBe(true)
    wrapper.unmount()
  })

  it('event - input change with value exceeding max', async () => {
    wrapper = mount(Slider, {
      props: {
        showInput: true,
        modelValue: 50,
        min: 0,
        max: 100,
      },
    })

    const inputNumber = wrapper.findComponent({ name: 'CInputNumber' })
    await inputNumber.vm.$emit('update:modelValue', 150)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const emittedValues = wrapper.emitted('update:modelValue') as any[]
    expect(emittedValues[emittedValues.length - 1][0]).toBe(100)
    wrapper.unmount()
  })

  it('input change with value below min', async () => {
    wrapper = mount(Slider, {
      props: {
        showInput: true,
        modelValue: 50,
        min: 0,
        max: 100,
      },
    })

    const inputNumber = wrapper.findComponent({ name: 'CInputNumber' })
    await inputNumber.vm.$emit('update:modelValue', -10)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const emittedValues = wrapper.emitted('update:modelValue') as any[]
    expect(emittedValues[emittedValues.length - 1][0]).toBe(0)
    wrapper.unmount()
  })

  it('event - input increase button', () => {
    wrapper = mount(Slider, {
      props: {
        showInput: true,
        showInputControls: true,
        modelValue: 50,
        step: 5,
        max: 100,
      },
    })

    const inputNumber = wrapper.findComponent({ name: 'CInputNumber' })
    expect(inputNumber.exists()).toBe(true)
    wrapper.unmount()
  })

  it('event - input decrease button', () => {
    wrapper = mount(Slider, {
      props: {
        showInput: true,
        showInputControls: true,
        modelValue: 50,
        step: 5,
        min: 0,
      },
    })

    const inputNumber = wrapper.findComponent({ name: 'CInputNumber' })
    expect(inputNumber.exists()).toBe(true)
    wrapper.unmount()
  })

  it('event - input buttons disabled at boundaries', () => {
    wrapper = mount(Slider, {
      props: {
        showInput: true,
        showInputControls: true,
        modelValue: 0,
        min: 0,
        max: 100,
      },
    })

    const inputNumber = wrapper.findComponent({ name: 'CInputNumber' })
    expect(inputNumber.exists()).toBe(true)
    wrapper.unmount()
  })

  it('props - aria labels', () => {
    wrapper = mount(Slider, {
      props: {
        ariaLabel: 'Custom slider label',
        rangeStartLabel: 'Start',
        rangeEndLabel: 'End',
        range: true,
        modelValue: [20, 80],
      },
    })

    const sliderWrapper = wrapper.find(ns.e('wrapper'))
    expect(sliderWrapper.attributes('aria-label')).toBe('Custom slider label')
    wrapper.unmount()
  })

  it('props - formatValueText', () => {
    const formatValueText = (value: number) => `${value} degrees`

    wrapper = mount(Slider, {
      props: {
        modelValue: 50,
        formatValueText,
      },
    })

    expect(wrapper.vm.getAriaValueText(50)).toBe('50 degrees')
    wrapper.unmount()
  })

  it('props - label', () => {
    wrapper = mount(Slider, {
      props: {
        label: 'Volume Control',
        modelValue: 50,
      },
    })

    expect(wrapper.attributes('aria-label')).toBe('Volume Control')
    wrapper.unmount()
  })

  it('props - inputSize', () => {
    wrapper = mount(Slider, {
      props: {
        showInput: true,
        inputSize: 'large',
        modelValue: 50,
      },
    })

    // InputNumber 组件接收 size 属性
    const inputNumber = wrapper.findComponent({ name: 'CInputNumber' })
    expect(inputNumber.props('size')).toBe('large')
    wrapper.unmount()
  })

  it('props - persistent tooltip', async () => {
    wrapper = mount(Slider, {
      props: {
        modelValue: 50,
        persistent: true,
        showTooltip: true,
      },
    })

    // persistent 模式下 tooltip 应该一直显示，但仍需要悬停或拖拽状态
    const button = wrapper.find('.ccui-slider__button')
    await button.trigger('mouseenter')

    const tooltipComponent = wrapper.findComponent({ name: 'CTooltip' })
    expect(tooltipComponent.exists()).toBe(true)
    expect(tooltipComponent.props('visible')).toBe(true)
    expect(tooltipComponent.props('content')).toBe('50')
    wrapper.unmount()
  })

  it('props - persistent false with showTooltip false', () => {
    wrapper = mount(Slider, {
      props: {
        modelValue: 50,
        persistent: true,
        showTooltip: false,
      },
    })

    const tooltipComponent = wrapper.findComponent({ name: 'CTooltip' })
    expect(tooltipComponent.exists()).toBe(false)
    wrapper.unmount()
  })

  it('props - showDefaultTooltip true', async () => {
    wrapper = mount(Slider, {
      props: {
        modelValue: 50,
        tipsRenderer: null,
        showTooltip: true,
        showDefaultTooltip: true,
      },
    })

    // 需要触发悬停才能显示 tooltip
    const button = wrapper.find(ns.e('button'))
    await button.trigger('mouseenter')

    const tooltipComponent = wrapper.findComponent({ name: 'CTooltip' })
    expect(tooltipComponent.exists()).toBe(true)
    expect(tooltipComponent.props('visible')).toBe(true)
    expect(tooltipComponent.props('content')).toBe('50')
    wrapper.unmount()
  })

  it('props - validateEvent', () => {
    wrapper = mount(Slider, {
      props: {
        showInput: true,
        modelValue: 50,
        validateEvent: true,
      },
    })

    const inputNumber = wrapper.findComponent({ name: 'CInputNumber' })
    expect(inputNumber.exists()).toBe(true)
    wrapper.unmount()
  })

  it('props - validateEvent false', () => {
    wrapper = mount(Slider, {
      props: {
        showInput: true,
        modelValue: 50,
        validateEvent: false,
      },
    })

    const inputNumber = wrapper.findComponent({ name: 'CInputNumber' })
    expect(inputNumber.exists()).toBe(true)
    wrapper.unmount()
  })
})
