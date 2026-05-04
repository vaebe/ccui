import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { BackTop, FloatButton } from '../index'

const ns = useNamespace('float-button', true)

describe('floatButton', () => {
  it('renders as button by default', () => {
    const wrapper = mount(FloatButton, {
      props: { description: 'Help' },
    })
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.find(ns.e('description')).text()).toBe('Help')
  })

  it('renders as anchor when href is set', () => {
    const wrapper = mount(FloatButton, {
      props: { href: 'https://example.com', target: '_blank' },
    })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('https://example.com')
    expect(wrapper.attributes('target')).toBe('_blank')
  })

  it('emits click event', async () => {
    const wrapper = mount(FloatButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('renders badge when set', () => {
    const wrapper = mount(FloatButton, {
      props: { badge: 9 },
    })
    expect(wrapper.find(ns.e('badge')).text()).toBe('9')
  })

  it('applies shape and type modifiers', () => {
    const wrapper = mount(FloatButton, {
      props: { shape: 'square', type: 'primary' },
    })
    expect(wrapper.find(ns.m('square')).exists()).toBe(true)
    expect(wrapper.find(ns.m('primary')).exists()).toBe(true)
  })
})

describe('backTop', () => {
  it('hidden initially when scroll is below threshold', () => {
    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 400 },
    })
    expect(wrapper.find(ns.b()).exists()).toBe(false)
  })
})
