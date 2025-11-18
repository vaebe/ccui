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

describe('input', () => {
  it('dom', () => {
    const wrapper = shallowMount(Input, {
      props: {
        value: 'test',
      },
    })

    // 元素是否存在
    expect(wrapper.find(baseClass).exists()).toBeTruthy()

    // 输入框是否存在
    expect(wrapper.find('input').exists()).toBeTruthy()

    wrapper.unmount()
  })

  it('type', async () => {
    const wrapper = shallowMount(Input, { props: { type: 'text' } })
    expect(wrapper.find('input').attributes('type')).toBe('text')

    await wrapper.setProps({ type: 'password' })
    expect(wrapper.find('input').attributes('type')).toBe('password')
  })

  it('size', async () => {
    const wrapper = shallowMount(Input, { props: { size: 'small' } })
    expect(wrapper.find(getSizeClass('small')).exists()).toBeTruthy()

    await wrapper.setProps({ size: 'large' })
    expect(wrapper.find(getSizeClass('large')).exists()).toBeTruthy()
  })

  it('placeholder', async () => {
    const wrapper = shallowMount(Input, { props: { placeholder: '请输入内容' } })
    expect(wrapper.find('input').attributes('placeholder')).toBe('请输入内容')
  })

  it('disabled', async () => {
    const wrapper = shallowMount(Input, { props: { disabled: true } })

    // 检查是否应用了禁用样式类
    const disabledClass = ns.m('disabled').substring(1) // 移除开头的点
    expect(wrapper.find('input').classes()).toContain(disabledClass)

    // 检查是否应用了禁用属性
    expect(wrapper.find('input').attributes('disabled')).toBe('')
  })

  it('readonly', async () => {
    const wrapper = shallowMount(Input, { props: { readonly: true } })

    // 检查是否应用了只读属性
    expect(wrapper.find('input').attributes('readonly')).toBe('')
  })

  it('clearable', async () => {
    const wrapper = shallowMount(Input, { props: { clearable: true, value: 'test' } })

    // 检查是否显示清空图标
    expect(wrapper.find(ns.e('clear')).exists()).toBeTruthy()
  })

  it('prepend', async () => {
    const wrapper = shallowMount(Input, { props: { prepend: 'http://' } })

    // 检查是否显示前置内容
    expect(wrapper.find(ns.e('prepend')).exists()).toBeTruthy()
    expect(wrapper.find(ns.e('prepend')).text()).toBe('http://')
  })

  it('append', async () => {
    const wrapper = shallowMount(Input, { props: { append: '.com' } })

    // 检查是否显示后置内容
    expect(wrapper.find(ns.e('append')).exists()).toBeTruthy()
    expect(wrapper.find(ns.e('append')).text()).toBe('.com')
  })

  it('emits input event when input value changes', async () => {
    const handleInput = vi.fn()
    const wrapper = mount(Input, {
      attrs: {
        onInput: handleInput,
      },
    })

    const input = wrapper.find('input')
    await input.setValue('test')
    expect(handleInput).toBeCalled()

    wrapper.unmount()
  })

  it('emits change event when input value changes and loses focus', async () => {
    const handleChange = vi.fn()
    const wrapper = mount(Input, {
      attrs: {
        onChange: handleChange,
      },
    })

    const input = wrapper.find('input')
    await input.setValue('test')
    await input.trigger('change')
    expect(handleChange).toBeCalled()

    wrapper.unmount()
  })

  it('emits focus event when input is focused', async () => {
    const handleFocus = vi.fn()
    const wrapper = mount(Input, {
      attrs: {
        onFocus: handleFocus,
      },
    })

    const input = wrapper.find('input')
    await input.trigger('focus')
    expect(handleFocus).toBeCalled()

    wrapper.unmount()
  })

  it('emits blur event when input loses focus', async () => {
    const handleBlur = vi.fn()
    const wrapper = mount(Input, {
      attrs: {
        onBlur: handleBlur,
      },
    })

    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('blur')
    expect(handleBlur).toBeCalled()

    wrapper.unmount()
  })

  it('clears input value when clear icon is clicked', async () => {
    const handleClear = vi.fn()
    const wrapper = mount(Input, {
      props: {
        clearable: true,
        value: 'test',
      },
      attrs: {
        onClear: handleClear,
      },
    })

    const clearIcon = wrapper.find(ns.e('clear'))
    await clearIcon.trigger('click')
    expect(handleClear).toBeCalled()

    // 检查输入框值是否被清空
    expect(wrapper.find('input').element.value).toBe('')

    wrapper.unmount()
  })

  it('toggles password visibility when showPassword is true', async () => {
    const wrapper = mount(Input, {
      props: {
        type: 'password',
        showPassword: true,
        value: 'test',
      },
    })

    // 检查是否显示密码切换图标
    expect(wrapper.find(ns.e('password-hidden')).exists()).toBeTruthy()

    // 点击密码切换图标
    const passwordIcon = wrapper.find(ns.e('password-hidden'))
    await passwordIcon.trigger('click')

    // 检查密码是否变为可见
    expect(wrapper.find(ns.e('password-visible')).exists()).toBeTruthy()

    // 再次点击密码切换图标
    const passwordIcon2 = wrapper.find(ns.e('password-visible'))
    await passwordIcon2.trigger('click')

    // 检查密码是否变为隐藏
    expect(wrapper.find(ns.e('password-hidden')).exists()).toBeTruthy()

    wrapper.unmount()
  })
})
