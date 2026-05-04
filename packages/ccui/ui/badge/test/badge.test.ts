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
})
