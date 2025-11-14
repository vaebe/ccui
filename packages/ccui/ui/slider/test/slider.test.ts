import { mount, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Slider } from '../index'

const ns = useNamespace('slider', true)
const baseClass = ns.b()
const wrapperClass = ns.e('wrapper')
const trackClass = ns.e('track')
const buttonClass = ns.e('button')

describe('slider', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = null
  })

  it('dom', () => {
    wrapper = shallowMount(Slider)

    expect(wrapper.find(baseClass).exists()).toBe(true)
    expect(wrapper.find(wrapperClass).exists()).toBe(true)
    expect(wrapper.find(trackClass).exists()).toBe(true)
    expect(wrapper.find(buttonClass).exists()).toBe(true)

    wrapper.unmount()
  })

  it('props - modelValue', async () => {
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

  it('props - showTooltip', () => {
    wrapper = mount(Slider, {
      props: {
        showTooltip: true,
        modelValue: 50,
      },
    })

    expect(wrapper.find(ns.e('tooltip')).exists()).toBe(true)
    expect(wrapper.find(ns.e('tooltip')).text()).toBe('50')
    wrapper.unmount()
  })

  it('props - showTooltip false', () => {
    wrapper = mount(Slider, {
      props: {
        showTooltip: false,
      },
    })

    expect(wrapper.find(ns.e('tooltip')).exists()).toBe(false)
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
    expect(wrapper.find(ns.e('input-inner')).exists()).toBe(true)
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

    expect(wrapper.find(ns.e('input-controls')).exists()).toBe(true)
    expect(wrapper.find(ns.e('input-decrease')).exists()).toBe(true)
    expect(wrapper.find(ns.e('input-increase')).exists()).toBe(true)
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

    expect(wrapper.find(ns.e('tooltip')).exists()).toBe(false)
    wrapper.unmount()
  })

  it('props - tipsRenderer custom function', () => {
    const tipsRenderer = (value: number) => `${value} apples`

    wrapper = mount(Slider, {
      props: {
        modelValue: 5,
        tipsRenderer,
      },
    })

    expect(wrapper.find(ns.e('tooltip')).text()).toBe('5 apples')
    wrapper.unmount()
  })

  it('props - placement', () => {
    wrapper = mount(Slider, {
      props: {
        modelValue: 50,
        placement: 'bottom',
      },
    })

    expect(wrapper.find('.ccui-slider__tooltip--bottom').exists()).toBe(true)
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
    expect(wrapper.findAll(ns.e('stop')).length).toBe(11) // 0-100 with step 10
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

    // 模拟点击滑块
    const sliderWrapper = wrapper.find(wrapperClass)

    // 模拟 getBoundingClientRect
    const mockRect = {
      left: 0,
      width: 100,
      top: 0,
      height: 32,
      right: 100,
      bottom: 32,
    }

    vi.spyOn(sliderWrapper.element, 'getBoundingClientRect').mockReturnValue(mockRect)

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

    // Mock getBoundingClientRect
    const mockRect = {
      left: 0,
      width: 100,
      top: 0,
      height: 32,
      right: 100,
      bottom: 32,
    }

    vi.spyOn(wrapper.vm.sliderRef, 'getBoundingClientRect').mockReturnValue(mockRect)

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

    const input = wrapper.find('.ccui-slider__input-inner')
    await input.setValue('75')
    await input.trigger('input')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('change')).toBeTruthy()
    wrapper.unmount()
  })

  it('input change with invalid value', async () => {
    wrapper = mount(Slider, {
      props: {
        showInput: true,
        modelValue: 50,
        min: 0,
        max: 100,
      },
    })

    const input = wrapper.find('.ccui-slider__input-inner')
    await input.setValue('abc')
    await input.trigger('input')

    // Should not emit update when value is invalid
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
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

    const input = wrapper.find(ns.e('input-inner'))
    await input.setValue('150')
    await input.trigger('input')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    // Should clamp to max value
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

    const input = wrapper.find(ns.e('input-inner'))
    await input.setValue('-10')
    await input.trigger('input')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    // Should clamp to min value
    const emittedValues = wrapper.emitted('update:modelValue') as any[]
    expect(emittedValues[emittedValues.length - 1][0]).toBe(0)
    wrapper.unmount()
  })

  it('event - input increase button', async () => {
    wrapper = mount(Slider, {
      props: {
        showInput: true,
        showInputControls: true,
        modelValue: 50,
        step: 5,
        max: 100,
      },
    })

    const increaseButton = wrapper.find(ns.e('input-increase'))
    await increaseButton.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('change')).toBeTruthy()
    const emittedValues = wrapper.emitted('update:modelValue') as any[]
    expect(emittedValues[emittedValues.length - 1][0]).toBe(55)
    wrapper.unmount()
  })

  it('event - input decrease button', async () => {
    wrapper = mount(Slider, {
      props: {
        showInput: true,
        showInputControls: true,
        modelValue: 50,
        step: 5,
        min: 0,
      },
    })

    const decreaseButton = wrapper.find(ns.e('input-decrease'))
    await decreaseButton.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('change')).toBeTruthy()
    const emittedValues = wrapper.emitted('update:modelValue') as any[]
    expect(emittedValues[emittedValues.length - 1][0]).toBe(45)
    wrapper.unmount()
  })

  it('event - input buttons disabled at boundaries', async () => {
    wrapper = mount(Slider, {
      props: {
        showInput: true,
        showInputControls: true,
        modelValue: 0,
        min: 0,
        max: 100,
      },
    })

    const decreaseButton = wrapper.find(ns.e('input-decrease'))
    expect(decreaseButton.attributes('disabled')).toBeDefined()

    const increaseButton = wrapper.find(ns.e('input-increase'))
    expect(increaseButton.attributes('disabled')).toBeUndefined()
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
})
