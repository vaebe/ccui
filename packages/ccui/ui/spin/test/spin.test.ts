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

  it('preserves a consumer aria-label over the localized fallback', () => {
    const wrapper = mount(Spin, { attrs: { 'aria-label': '正在同步' } })
    expect(wrapper.find(ns.b()).attributes('aria-label')).toBe('正在同步')
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

  it('forwards attrs to the visible root without duplicating them in nested mode', () => {
    const standalone = mount(Spin, { attrs: { id: 'standalone', 'data-test': 'spin' } })
    expect(standalone.find(ns.b()).attributes('id')).toBe('standalone')
    expect(standalone.find(ns.b()).attributes('data-test')).toBe('spin')

    const nested = mount(Spin, { attrs: { id: 'nested' }, slots: { default: 'content' } })
    expect(nested.find(ns.e('nested')).attributes('id')).toBe('nested')
    expect(nested.find(ns.b()).attributes('id')).toBeUndefined()
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
