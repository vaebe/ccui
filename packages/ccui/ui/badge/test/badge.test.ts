import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Badge } from '../index'

const ns = useNamespace('badge', true)

describe('badge', () => {
  it('renders count number', () => {
    const wrapper = mount(Badge, { props: { count: 5 } })
    expect(wrapper.text()).toBe('5')
  })

  it('shows overflow when count exceeds limit', () => {
    const wrapper = mount(Badge, { props: { count: 200, overflowCount: 99 } })
    expect(wrapper.text()).toBe('99+')
  })

  it('hides zero by default', () => {
    const wrapper = mount(Badge, { props: { count: 0 } })
    expect(wrapper.find(ns.b()).exists()).toBe(false)
  })

  it('shows zero when showZero is true', () => {
    const wrapper = mount(Badge, { props: { count: 0, showZero: true } })
    expect(wrapper.text()).toBe('0')
  })

  it('renders status dot', () => {
    const wrapper = mount(Badge, { props: { status: 'success', text: 'Success' } })
    expect(wrapper.find(ns.em('status-dot', 'success')).exists()).toBe(true)
    expect(wrapper.text()).toContain('Success')
  })

  it('renders dot when dot prop is true', () => {
    const wrapper = mount(Badge, { props: { dot: true }, slots: { default: '<a>link</a>' } })
    expect(wrapper.find(ns.em('sup', 'dot')).exists()).toBe(true)
  })

  it('renders standalone dot and custom color', () => {
    const wrapper = mount(Badge, { props: { dot: true, color: '#f00' } })
    expect(wrapper.find(ns.m('dot-standalone')).exists()).toBe(true)
    expect(wrapper.find(ns.b()).attributes('style')).toContain('background-color: rgb(255, 0, 0)')
  })

  it('renders status with custom color and no text', () => {
    const wrapper = mount(Badge, { props: { color: '#00ff00' } })
    expect(wrapper.find(ns.e('status-dot')).exists()).toBe(true)
    expect(wrapper.find(ns.e('status-text')).exists()).toBe(false)
  })

  it('renders string count and offset in wrapped mode', () => {
    const wrapper = mount(Badge, {
      props: { count: 'new', offset: [4, 8] },
      slots: { default: '<button>Inbox</button>' },
    })
    const sup = wrapper.find(ns.e('sup'))

    expect(sup.text()).toBe('new')
    expect(sup.attributes('style')).toContain('translate')
  })

  it('hides empty count in wrapped mode', () => {
    const wrapper = mount(Badge, {
      props: { count: '' },
      slots: { default: '<button>Inbox</button>' },
    })

    expect(wrapper.find(ns.e('sup')).exists()).toBe(false)
    expect(wrapper.text()).toBe('Inbox')
  })
})
