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

describe('button', () => {
  it('dom', () => {
    const wrapper = shallowMount(Button, {
      slots: {
        default: '确定',
      },
    })

    // 元素是否存在
    expect(wrapper.find(baseClass).exists()).toBeTruthy()

    // 默认插槽的文本是否正确
    expect(wrapper.find(baseClass).text()).toBe('确定')

    wrapper.unmount()
  })

  it('type', async () => {
    const wrapper = shallowMount(Button, { props: { type: 'primary' } })
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
    const wrapper = shallowMount(Button, { props: { size: 'small' } })
    expect(wrapper.find(getSizeClass('small')).exists()).toBeTruthy()

    await wrapper.setProps({ size: 'large' })
    expect(wrapper.find(getSizeClass('large')).exists()).toBeTruthy()
  })

  it('round', async () => {
    const wrapper = shallowMount(Button, { props: { round: true } })
    expect(wrapper.find(roundClass).exists()).toBeTruthy()
  })

  it('circle', async () => {
    const wrapper = shallowMount(Button, { props: { circle: true } })
    expect(wrapper.find(circleClass).exists()).toBeTruthy()
  })

  it('disabled', async () => {
    const handleClick = vi.fn()
    const wrapper = shallowMount(Button, { props: { disabled: true } })

    await wrapper.trigger('click')
    expect(handleClick).not.toBeCalled()
  })

  it('emits click event when clicked', async () => {
    const handleClick = vi.fn()
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me',
      },
      attrs: {
        onClick: handleClick,
      },
    })

    await wrapper.trigger('click')
    expect(handleClick).toBeCalled()

    wrapper.unmount()
  })

  it('does not emit click event when disabled', async () => {
    const handleClick = vi.fn()
    const wrapper = mount(Button, {
      props: {
        disabled: true,
      },
      slots: {
        default: 'Click me',
      },
      attrs: {
        onClick: handleClick,
      },
    })

    await wrapper.trigger('click')
    expect(handleClick).not.toBeCalled()

    wrapper.unmount()
  })

  it('renders icon slot when provided', () => {
    const wrapper = mount(Button, {
      slots: {
        icon: '<i class="cc-icon-heart"></i>',
        default: 'Like',
      },
    })

    expect(wrapper.find('.cc-icon-heart').exists()).toBe(true)

    wrapper.unmount()
  })

  it('applies plain style when plain prop is true', async () => {
    const wrapper = shallowMount(Button, {
      props: {
        type: 'primary',
        plain: true,
      },
    })

    expect(wrapper.find(ns.m('plain-primary')).exists()).toBeTruthy()

    wrapper.unmount()
  })

  it('sets nativeType attribute correctly', () => {
    const wrapper = mount(Button, {
      props: {
        nativeType: 'submit',
      },
      slots: {
        default: 'Submit',
      },
    })

    expect(wrapper.find('button').attributes('type')).toBe('submit')

    wrapper.unmount()
  })

  it('sets autofocus attribute when autofocus is true', () => {
    const wrapper = mount(Button, {
      props: {
        autofocus: true,
      },
      slots: {
        default: 'Focus',
      },
    })

    expect(wrapper.find('button').attributes('autofocus')).toBe('')

    wrapper.unmount()
  })
})
