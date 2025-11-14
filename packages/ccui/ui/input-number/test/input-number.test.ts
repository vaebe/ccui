import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { InputNumber } from '../index'

describe('inputNumber', () => {
  it('should render correctly', () => {
    const wrapper = mount(InputNumber)
    expect(wrapper.find('.ccui-input-number').exists()).toBe(true)
    expect(wrapper.find('.ccui-input-number__inner').exists()).toBe(true)
  })

  it('should support v-model', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 5,
      },
    })

    const input = wrapper.find('.ccui-input-number__inner')
    expect((input.element as HTMLInputElement).value).toBe('5')
  })

  it('should handle input change', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 0,
      },
    })

    const input = wrapper.find('.ccui-input-number__inner')
    await input.setValue('10')
    await input.trigger('input')
    await input.trigger('change')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('input')).toBeTruthy()
  })

  it('should handle increase and decrease', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 5,
        step: 2,
      },
    })

    const increaseBtn = wrapper.find('.ccui-input-number__increase')
    const decreaseBtn = wrapper.find('.ccui-input-number__decrease')

    await increaseBtn.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([7])

    await decreaseBtn.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([5])
  })

  it('should respect min and max limits', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 5,
        min: 0,
        max: 10,
      },
    })

    const input = wrapper.find('.ccui-input-number__inner')

    // Test max limit
    await input.setValue('15')
    await input.trigger('input')
    await input.trigger('change')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([10])

    // Reset wrapper to test min limit separately
    const wrapper2 = mount(InputNumber, {
      props: {
        modelValue: 5,
        min: 0,
        max: 10,
      },
    })

    const input2 = wrapper2.find('.ccui-input-number__inner')

    // Test min limit
    await input2.setValue('-5')
    await input2.trigger('input')
    await input2.trigger('change')
    expect(wrapper2.emitted('update:modelValue')?.[0]).toEqual([0])
  })

  it('should handle precision', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 1.234,
        precision: 2,
      },
    })

    const input = wrapper.find('.ccui-input-number__inner')
    expect((input.element as HTMLInputElement).value).toBe('1.23')
  })

  it('should disable buttons when reaching limits', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 10,
        min: 0,
        max: 10,
      },
    })

    const increaseBtn = wrapper.find('.ccui-input-number__increase')
    const decreaseBtn = wrapper.find('.ccui-input-number__decrease')

    expect(increaseBtn.classes()).toContain('is-disabled')

    await wrapper.setProps({ modelValue: 0 })
    await nextTick()
    expect(decreaseBtn.classes()).toContain('is-disabled')
  })

  it('should handle disabled state', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 5,
        disabled: true,
      },
    })

    expect(wrapper.classes()).toContain('ccui-input-number--disabled')

    const input = wrapper.find('.ccui-input-number__inner')
    expect((input.element as HTMLInputElement).disabled).toBe(true)

    const increaseBtn = wrapper.find('.ccui-input-number__increase')
    await increaseBtn.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('should handle readonly state', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 5,
        readonly: true,
      },
    })

    expect(wrapper.classes()).toContain('ccui-input-number--readonly')

    const input = wrapper.find('.ccui-input-number__inner')
    expect((input.element as HTMLInputElement).readOnly).toBe(true)
  })

  it('should support different sizes', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        size: 'lg',
      },
    })

    expect(wrapper.classes()).toContain('ccui-input-number--lg')

    await wrapper.setProps({ size: 'sm' })
    expect(wrapper.classes()).toContain('ccui-input-number--sm')
  })

  it('should handle controls position', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        controlsPosition: 'right',
      },
    })

    expect(wrapper.classes()).toContain('ccui-input-number--controls-right')
    expect(wrapper.find('.ccui-input-number__controls').exists()).toBe(true)
  })

  it('should hide controls when controls is false', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        controls: false,
      },
    })

    expect(wrapper.classes()).toContain('ccui-input-number--without-controls')
    expect(wrapper.find('.ccui-input-number__increase').exists()).toBe(false)
    expect(wrapper.find('.ccui-input-number__decrease').exists()).toBe(false)
  })

  it('should handle keyboard events', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 5,
        step: 1,
      },
    })

    const input = wrapper.find('.ccui-input-number__inner')

    await input.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([6])

    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([5])
  })

  it('should handle focus and blur events', async () => {
    const wrapper = mount(InputNumber)
    const input = wrapper.find('.ccui-input-number__inner')

    await input.trigger('focus')
    expect(wrapper.emitted('focus')).toBeTruthy()
    expect(wrapper.classes()).toContain('ccui-input-number--focused')

    await input.trigger('blur')
    expect(wrapper.emitted('blur')).toBeTruthy()
  })

  it('should handle allowEmpty option', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        allowEmpty: true,
      },
    })

    const input = wrapper.find('.ccui-input-number__inner')
    await input.setValue('')
    await input.trigger('change')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined])
  })

  it('should expose methods', () => {
    const wrapper = mount(InputNumber)
    const vm = wrapper.vm as any

    expect(typeof vm.getValue).toBe('function')
    expect(typeof vm.setValue).toBe('function')
    expect(typeof vm.focus).toBe('function')
    expect(typeof vm.blur).toBe('function')
    expect(typeof vm.increase).toBe('function')
    expect(typeof vm.decrease).toBe('function')
  })

  it('应该正确处理精度设置', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 1.234567,
        precision: 2,
      },
    })

    const input = wrapper.find('input')
    expect(input.element.value).toBe('1.23')
  })

  it('应该支持自定义步长', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 0,
        step: 0.1,
        precision: 1,
      },
    })

    const increaseBtn = wrapper.find('.ccui-input-number__increase')
    await increaseBtn.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0.1])
  })

  it('应该在达到边界值时禁用按钮', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 10,
        min: 0,
        max: 10,
      },
    })

    const increaseBtn = wrapper.find('.ccui-input-number__increase')
    const decreaseBtn = wrapper.find('.ccui-input-number__decrease')

    expect(increaseBtn.classes()).toContain('is-disabled')

    await wrapper.setProps({ modelValue: 0 })
    expect(decreaseBtn.classes()).toContain('is-disabled')
  })
})
