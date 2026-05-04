import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Spin } from '../index'

const ns = useNamespace('spin', true)

describe('spin', () => {
  it('renders spinner standalone', () => {
    const wrapper = mount(Spin)
    expect(wrapper.find(ns.b()).exists()).toBe(true)
    expect(wrapper.find(ns.e('dot')).exists()).toBe(true)
  })

  it('renders tip text', () => {
    const wrapper = mount(Spin, { props: { tip: 'Loading...' } })
    expect(wrapper.text()).toContain('Loading...')
  })

  it('hides spinner when spinning false', () => {
    const wrapper = mount(Spin, { props: { spinning: false } })
    expect(wrapper.find(ns.b()).exists()).toBe(false)
  })

  it('wraps default slot', () => {
    const wrapper = mount(Spin, { slots: { default: '<div class="content">Hi</div>' } })
    expect(wrapper.find('.content').exists()).toBe(true)
    expect(wrapper.find(ns.e('overlay')).exists()).toBe(true)
  })
})
