import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Spin } from '../index'

const ns = useNamespace('spin', true)

describe('spin', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

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

  it('renders custom indicator slot', () => {
    const wrapper = mount(Spin, {
      slots: {
        indicator: '<span class="custom-indicator">loading</span>',
      },
    })

    expect(wrapper.find('.custom-indicator').exists()).toBe(true)
    expect(wrapper.find(ns.e('dot')).exists()).toBe(false)
  })

  it('renders fullscreen spinner only when visible', async () => {
    const wrapper = mount(Spin, { props: { fullscreen: true, spinning: false } })
    expect(wrapper.find(ns.m('fullscreen')).exists()).toBe(false)

    await wrapper.setProps({ spinning: true })
    expect(wrapper.find(ns.m('fullscreen')).exists()).toBe(true)
  })

  it('honors delay before showing spinner', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Spin, { props: { spinning: false, delay: 100 } })

    await wrapper.setProps({ spinning: true })
    expect(wrapper.find(ns.b()).exists()).toBe(false)

    vi.advanceTimersByTime(100)
    await wrapper.vm.$nextTick()
    expect(wrapper.find(ns.b()).exists()).toBe(true)
  })

  it('clears pending delay when spinning turns false', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Spin, { props: { spinning: false, delay: 100 } })

    await wrapper.setProps({ spinning: true })
    await wrapper.setProps({ spinning: false })
    vi.advanceTimersByTime(100)
    await wrapper.vm.$nextTick()

    expect(wrapper.find(ns.b()).exists()).toBe(false)
  })
})
