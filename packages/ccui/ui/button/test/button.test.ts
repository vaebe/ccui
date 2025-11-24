import type { ButtonSizeType, ButtonType } from '../src/button-types'
import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Button } from '../index'

const ns = useNamespace('button', true)
const baseClass = ns.b()
function getTypeClass(type: ButtonType) {
  return ns.m(type)
}

function getSizeClass(type: ButtonSizeType) {
  return ns.m(type)
}

const roundClass = ns.m('round')
const circleClass = ns.m('circle')
const loadingClass = ns.m('loading')

// 测试辅助函数
function createWrapper(props = {}, slots = {}) {
  return mount(Button, {
    props,
    slots: {
      default: 'Button',
      ...slots,
    },
  })
}

function createShallowWrapper(props = {}, slots = {}) {
  return shallowMount(Button, {
    props,
    slots: {
      default: 'Button',
      ...slots,
    },
  })
}

describe('button', () => {
  it('dom', () => {
    const wrapper = createShallowWrapper({}, { default: '确定' })
    expect(wrapper.find(baseClass).exists()).toBeTruthy()
    expect(wrapper.find(baseClass).text()).toBe('确定')
    wrapper.unmount()
  })

  it('type', async () => {
    const wrapper = createShallowWrapper({ type: 'primary' })
    expect(wrapper.find(getTypeClass('primary')).exists()).toBeTruthy()

    await wrapper.setProps({ type: 'success' })
    expect(wrapper.find(getTypeClass('success')).exists()).toBeTruthy()

    await wrapper.setProps({ type: 'warning' })
    expect(wrapper.find(getTypeClass('warning')).exists()).toBeTruthy()

    await wrapper.setProps({ type: 'danger' })
    expect(wrapper.find(getTypeClass('danger')).exists()).toBeTruthy()

    await wrapper.setProps({ type: 'info' })
    expect(wrapper.find(getTypeClass('info')).exists()).toBeTruthy()
  })

  it('size', async () => {
    const wrapper = createShallowWrapper({ size: 'small' })
    expect(wrapper.find(getSizeClass('small')).exists()).toBeTruthy()

    await wrapper.setProps({ size: 'large' })
    expect(wrapper.find(getSizeClass('large')).exists()).toBeTruthy()
  })

  it('round', async () => {
    const wrapper = createShallowWrapper({ round: true })
    expect(wrapper.find(roundClass).exists()).toBeTruthy()
  })

  it('circle', async () => {
    const wrapper = createShallowWrapper({ circle: true })
    expect(wrapper.find(circleClass).exists()).toBeTruthy()
  })

  it('click events', async () => {
    const handleClick = vi.fn()

    // Test normal click
    const wrapper = createWrapper({}, { default: 'Click me' })
    wrapper.element.addEventListener('click', handleClick)
    await wrapper.trigger('click')
    expect(handleClick).toBeCalled()
    wrapper.unmount()

    // Test disabled - no click
    handleClick.mockClear()
    const disabledWrapper = createWrapper({ disabled: true })
    const disabledClass = ns.m('disabled').substring(1)
    expect(disabledWrapper.find('button').classes()).toContain(disabledClass)
    disabledWrapper.element.addEventListener('click', handleClick)
    await disabledWrapper.trigger('click')
    expect(handleClick).not.toBeCalled()
    disabledWrapper.unmount()

    // Test loading - no click
    handleClick.mockClear()
    const loadingWrapper = createWrapper({ loading: true })
    expect(loadingWrapper.find(loadingClass).exists()).toBeTruthy()
    expect(loadingWrapper.find('button').attributes('disabled')).toBe('')
    expect(loadingWrapper.find('button').classes()).toContain(disabledClass)
    loadingWrapper.element.addEventListener('click', handleClick)
    await loadingWrapper.trigger('click')
    expect(handleClick).not.toBeCalled()
    loadingWrapper.unmount()
  })

  it('renders icon slot when provided', () => {
    const wrapper = createWrapper({}, {
      icon: '<i class="cc-icon-heart"></i>',
      default: 'Like',
    })
    expect(wrapper.find('.cc-icon-heart').exists()).toBe(true)
    wrapper.unmount()
  })

  it('applies plain style when plain prop is true', async () => {
    const wrapper = createShallowWrapper({ type: 'primary', plain: true })
    expect(wrapper.find(ns.m('plain-primary')).exists()).toBeTruthy()
    wrapper.unmount()
  })

  it('sets nativeType attribute correctly', () => {
    const wrapper = createWrapper({ nativeType: 'submit' }, { default: 'Submit' })
    expect(wrapper.find('button').attributes('type')).toBe('submit')
    wrapper.unmount()
  })

  it('sets autofocus attribute when autofocus is true', () => {
    const wrapper = createWrapper({ autofocus: true }, { default: 'Focus' })
    expect(wrapper.find('button').attributes('autofocus')).toBe('')
    wrapper.unmount()
  })

  it('renders icon when icon prop is provided', () => {
    const wrapper = createWrapper({ icon: 'cc-icon-star' }, { default: 'Star' })
    expect(wrapper.find('.cc-icon-star').exists()).toBe(true)
    wrapper.unmount()
  })

  it('renders loading icon when loading is true', () => {
    const wrapper = createWrapper({ loading: true }, { default: 'Loading' })
    expect(wrapper.find(ns.e('loading-icon')).exists()).toBe(true)
    expect(wrapper.find(ns.e('loading-icon')).text()).toBe('')
    wrapper.unmount()
  })
})
