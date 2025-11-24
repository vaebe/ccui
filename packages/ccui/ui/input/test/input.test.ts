import type { InputSize } from '../src/input-types'
import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Input } from '../index'

const ns = useNamespace('input', true)
const baseClass = ns.b()
const _wrapperClass = ns.e('wrapper')
function getSizeClass(type: InputSize) {
  return ns.em('wrapper', type)
}

// 测试辅助函数
function createWrapper(props = {}) {
  return mount(Input, { props })
}

function createShallowWrapper(props = {}) {
  return shallowMount(Input, { props })
}

describe('input', () => {
  it('dom', () => {
    const wrapper = createShallowWrapper({ modelValue: 'test' })
    expect(wrapper.find(baseClass).exists()).toBeTruthy()
    expect(wrapper.find('input').exists()).toBeTruthy()
    wrapper.unmount()
  })

  it('type', async () => {
    const wrapper = createShallowWrapper({ type: 'text' })
    expect(wrapper.find('input').attributes('type')).toBe('text')

    await wrapper.setProps({ type: 'password' })
    expect(wrapper.find('input').attributes('type')).toBe('password')
  })

  it('size', async () => {
    const wrapper = createShallowWrapper({ size: 'small' })
    expect(wrapper.find(getSizeClass('small')).exists()).toBeTruthy()

    await wrapper.setProps({ size: 'large' })
    expect(wrapper.find(getSizeClass('large')).exists()).toBeTruthy()
  })

  it('placeholder', async () => {
    const wrapper = createShallowWrapper({ placeholder: '请输入内容' })
    expect(wrapper.find('input').attributes('placeholder')).toBe('请输入内容')
  })

  it('disabled', async () => {
    const wrapper = createShallowWrapper({ disabled: true })
    const disabledClass = ns.m('disabled').substring(1)
    expect(wrapper.find('input').classes()).toContain(disabledClass)
    expect(wrapper.find('input').attributes('disabled')).toBe('')
  })

  it('readonly', async () => {
    const wrapper = createShallowWrapper({ readonly: true })
    expect(wrapper.find('input').attributes('readonly')).toBe('')
  })

  it('clearable', async () => {
    const wrapper = createShallowWrapper({ clearable: true, modelValue: 'test' })
    expect(wrapper.find(ns.e('clear')).exists()).toBeTruthy()
  })

  it('prepend', async () => {
    const wrapper = createShallowWrapper({ prepend: 'http://' })
    expect(wrapper.find(ns.e('prepend')).exists()).toBeTruthy()
    expect(wrapper.find(ns.e('prepend')).text()).toBe('http://')
  })

  it('append', async () => {
    const wrapper = createShallowWrapper({ append: '.com' })
    expect(wrapper.find(ns.e('append')).exists()).toBeTruthy()
    expect(wrapper.find(ns.e('append')).text()).toBe('.com')
  })

  it('emits input event when input value changes', async () => {
    const handleInput = vi.fn()
    const wrapper = createWrapper({ onInput: handleInput })
    const input = wrapper.find('input')
    await input.setValue('test')
    expect(handleInput).toBeCalled()
    wrapper.unmount()
  })

  it('emits change event when input value changes and loses focus', async () => {
    const handleChange = vi.fn()
    const wrapper = createWrapper({ onChange: handleChange })
    const input = wrapper.find('input')
    await input.setValue('test')
    await input.trigger('change')
    expect(handleChange).toBeCalled()
    wrapper.unmount()
  })

  it('emits focus and blur events', async () => {
    const handleFocus = vi.fn()
    const handleBlur = vi.fn()
    const wrapper = createWrapper({ onFocus: handleFocus, onBlur: handleBlur })
    const input = wrapper.find('input')
    await input.trigger('focus')
    expect(handleFocus).toBeCalled()
    await input.trigger('blur')
    expect(handleBlur).toBeCalled()
    wrapper.unmount()
  })

  it('clears input value when clear icon is clicked', async () => {
    const handleClear = vi.fn()
    const wrapper = createWrapper({
      clearable: true,
      modelValue: 'test',
      onClear: handleClear,
    })
    const clearIcon = wrapper.find(ns.e('clear'))
    await clearIcon.trigger('click')
    expect(handleClear).toBeCalled()
    expect(wrapper.find('input').element.value).toBe('')
    wrapper.unmount()
  })

  it('toggles password visibility when showPassword is true', async () => {
    const wrapper = createWrapper({
      type: 'password',
      showPassword: true,
      modelValue: 'test',
    })

    expect(wrapper.find(ns.e('password-hidden')).exists()).toBeTruthy()

    const passwordIcon = wrapper.find(ns.e('password-hidden'))
    await passwordIcon.trigger('click')
    expect(wrapper.find(ns.e('password-visible')).exists()).toBeTruthy()

    const passwordIcon2 = wrapper.find(ns.e('password-visible'))
    await passwordIcon2.trigger('click')
    expect(wrapper.find(ns.e('password-hidden')).exists()).toBeTruthy()

    wrapper.unmount()
  })
})
