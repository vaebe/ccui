import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vite-plus/test'
import { nextTick } from 'vue'
import { InputNumber } from '../index'

// 测试辅助函数
function createWrapper(props = {}) {
  return mount(InputNumber, {
    props,
  })
}

describe('inputNumber', () => {
  it('should render correctly', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.ccui-input-number').exists()).toBe(true)
    expect(wrapper.find('.ccui-input-number__inner').exists()).toBe(true)
  })

  it('should support v-model', async () => {
    const wrapper = createWrapper({ modelValue: 5 })
    const input = wrapper.find('.ccui-input-number__inner')
    expect((input.element as HTMLInputElement).value).toBe('5')
  })

  it('should handle input change', async () => {
    const wrapper = createWrapper({ modelValue: 0 })
    const input = wrapper.find('.ccui-input-number__inner')
    await input.setValue('10')
    await input.trigger('input')
    await input.trigger('change')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('input')).toBeTruthy()
  })

  it('should handle increase and decrease', async () => {
    const wrapper = createWrapper({ modelValue: 5, step: 2 })
    const increaseBtn = wrapper.find('.ccui-input-number__increase')
    const decreaseBtn = wrapper.find('.ccui-input-number__decrease')

    await increaseBtn.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([7])

    await decreaseBtn.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([5])
  })

  it('should respect min and max limits', async () => {
    const wrapper = createWrapper({ modelValue: 5, min: 0, max: 10 })
    const input = wrapper.find('.ccui-input-number__inner')

    // Test max limit
    await input.setValue('15')
    await input.trigger('input')
    await input.trigger('change')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([10])

    // Reset wrapper to test min limit separately
    const wrapper2 = createWrapper({ modelValue: 5, min: 0, max: 10 })
    const input2 = wrapper2.find('.ccui-input-number__inner')

    // Test min limit
    await input2.setValue('-5')
    await input2.trigger('input')
    await input2.trigger('change')
    expect(wrapper2.emitted('update:modelValue')?.[0]).toEqual([0])
  })

  it('should handle precision', async () => {
    const wrapper = createWrapper({ modelValue: 1.234567, precision: 2 })
    const input = wrapper.find('.ccui-input-number__inner')
    expect((input.element as HTMLInputElement).value).toBe('1.23')
  })

  it('should disable buttons when reaching limits', async () => {
    const wrapper = createWrapper({ modelValue: 10, min: 0, max: 10 })
    const increaseBtn = wrapper.find('.ccui-input-number__increase')
    const decreaseBtn = wrapper.find('.ccui-input-number__decrease')

    expect(increaseBtn.classes()).toContain('is-disabled')

    await wrapper.setProps({ modelValue: 0 })
    await nextTick()
    expect(decreaseBtn.classes()).toContain('is-disabled')
  })

  it('should handle disabled state', async () => {
    const wrapper = createWrapper({ modelValue: 5, disabled: true })

    expect(wrapper.classes()).toContain('ccui-input-number--disabled')

    const input = wrapper.find('.ccui-input-number__inner')
    expect((input.element as HTMLInputElement).disabled).toBe(true)

    const increaseBtn = wrapper.find('.ccui-input-number__increase')
    await increaseBtn.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('should handle readonly state', async () => {
    const wrapper = createWrapper({ modelValue: 5, readonly: true })

    expect(wrapper.classes()).toContain('ccui-input-number--readonly')

    const input = wrapper.find('.ccui-input-number__inner')
    expect((input.element as HTMLInputElement).readOnly).toBe(true)
  })

  it('should support different sizes', async () => {
    const wrapper = createWrapper({ size: 'large' })
    expect(wrapper.classes()).toContain('ccui-input-number--large')

    await wrapper.setProps({ size: 'small' })
    expect(wrapper.classes()).toContain('ccui-input-number--small')
  })

  it('should still accept deprecated size literals lg/md/sm and map them', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = createWrapper({ size: 'lg' })
    expect(wrapper.classes()).toContain('ccui-input-number--large')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('size="lg" 已 deprecated'))

    await wrapper.setProps({ size: 'sm' })
    expect(wrapper.classes()).toContain('ccui-input-number--small')

    await wrapper.setProps({ size: 'md' })
    // 'default' 不写 modifier 类
    expect(wrapper.classes()).not.toContain('ccui-input-number--default')
    expect(wrapper.classes()).not.toContain('ccui-input-number--md')

    warn.mockRestore()
  })

  it('should handle controls position', async () => {
    const wrapper = createWrapper({ controlsPosition: 'right' })

    expect(wrapper.classes()).toContain('ccui-input-number--controls-right')
    expect(wrapper.find('.ccui-input-number__controls').exists()).toBe(true)
  })

  it('should hide controls when controls is false', async () => {
    const wrapper = createWrapper({ controls: false })

    expect(wrapper.classes()).toContain('ccui-input-number--without-controls')
    expect(wrapper.find('.ccui-input-number__increase').exists()).toBe(false)
    expect(wrapper.find('.ccui-input-number__decrease').exists()).toBe(false)
  })

  it('should handle keyboard events', async () => {
    const wrapper = createWrapper({ modelValue: 5, step: 1 })
    const input = wrapper.find('.ccui-input-number__inner')

    await input.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([6])

    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([5])
  })

  it('should handle focus and blur events', async () => {
    const wrapper = createWrapper()
    const input = wrapper.find('.ccui-input-number__inner')

    await input.trigger('focus')
    expect(wrapper.emitted('focus')).toBeTruthy()
    expect(wrapper.classes()).toContain('ccui-input-number--focused')

    await input.trigger('blur')
    expect(wrapper.emitted('blur')).toBeTruthy()
  })

  it('should handle allowEmpty option', async () => {
    const wrapper = createWrapper({ allowEmpty: true })
    const input = wrapper.find('.ccui-input-number__inner')
    await input.setValue('')
    await input.trigger('change')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined])
  })

  it('should support custom step', async () => {
    const wrapper = createWrapper({ modelValue: 0, step: 0.1, precision: 1 })
    const increaseBtn = wrapper.find('.ccui-input-number__increase')
    await increaseBtn.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0.1])
  })

  it('should expose methods', () => {
    const wrapper = createWrapper()
    const vm = wrapper.vm as any

    expect(typeof vm.getValue).toBe('function')
    expect(typeof vm.setValue).toBe('function')
    expect(typeof vm.focus).toBe('function')
    expect(typeof vm.blur).toBe('function')
    expect(typeof vm.increase).toBe('function')
    expect(typeof vm.decrease).toBe('function')
  })

  it('should reject invalid input by regexp string', async () => {
    const wrapper = createWrapper({ modelValue: 12, reg: '^\\d*$' })
    const input = wrapper.find('.ccui-input-number__inner')

    await input.setValue('abc')
    await input.trigger('input')

    expect((input.element as HTMLInputElement).value).toBe('12')
  })

  it('should reject invalid input by regexp object', async () => {
    const wrapper = createWrapper({ modelValue: 3, reg: /^\d+$/ })
    const input = wrapper.find('.ccui-input-number__inner')

    await input.setValue('3.5')
    await input.trigger('input')

    expect((input.element as HTMLInputElement).value).toBe('3')
  })

  it('should restore empty input when allowEmpty is false', async () => {
    const wrapper = createWrapper({ modelValue: 5 })
    const input = wrapper.find('.ccui-input-number__inner')

    await input.setValue('')
    await input.trigger('input')
    expect((input.element as HTMLInputElement).value).toBe('5')
  })

  it('should ignore keyboard changes when readonly', async () => {
    const wrapper = createWrapper({ modelValue: 5, readonly: true })
    const input = wrapper.find('.ccui-input-number__inner')

    await input.trigger('keydown', { key: 'ArrowUp' })

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('should render input attributes and glow focus state', async () => {
    const wrapper = createWrapper({
      modelValue: 2,
      min: 1,
      max: 9,
      step: 0.5,
      placeholder: 'Amount',
      showGlowStyle: true,
    })
    const input = wrapper.find('.ccui-input-number__inner')

    expect(input.attributes('placeholder')).toBe('Amount')
    expect(input.attributes('min')).toBe('1')
    expect(input.attributes('max')).toBe('9')
    expect(input.attributes('step')).toBe('0.5')

    await input.trigger('focus')
    expect(wrapper.classes()).toContain('ccui-input-number--glow')
  })

  it('should omit glow class when showGlowStyle is false', async () => {
    const wrapper = createWrapper({ showGlowStyle: false })
    const input = wrapper.find('.ccui-input-number__inner')

    await input.trigger('focus')

    expect(wrapper.classes()).toContain('ccui-input-number--focused')
    expect(wrapper.classes()).not.toContain('ccui-input-number--glow')
  })

  it('should update from exposed methods', async () => {
    const wrapper = createWrapper({ modelValue: 1 })
    const vm = wrapper.vm as any

    vm.setValue(4)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
    expect(vm.getValue()).toBe(4)

    vm.increase()
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([5])

    vm.decrease()
    expect(wrapper.emitted('update:modelValue')?.[2]).toEqual([4])
  })

  describe('variant（v5.13+：outlined / filled / borderless / underlined）', () => {
    it('默认 variant 为 outlined', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.ccui-input-number--variant-outlined').exists()).toBe(true)
    })

    it('variant="filled"', () => {
      const wrapper = createWrapper({ variant: 'filled' })
      expect(wrapper.find('.ccui-input-number--variant-filled').exists()).toBe(true)
    })

    it('variant="borderless"', () => {
      const wrapper = createWrapper({ variant: 'borderless' })
      expect(wrapper.find('.ccui-input-number--variant-borderless').exists()).toBe(true)
    })

    it('variant="underlined"', () => {
      const wrapper = createWrapper({ variant: 'underlined' })
      expect(wrapper.find('.ccui-input-number--variant-underlined').exists()).toBe(true)
    })
  })
})
