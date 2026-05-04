import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Watermark } from '../index'

const ns = useNamespace('watermark', true)

describe('watermark', () => {
  it('renders default container with slot content', () => {
    const wrapper = mount(Watermark, {
      props: { content: 'demo' },
      slots: { default: '<p class="inside">Hello</p>' },
    })
    expect(wrapper.find(ns.b()).exists()).toBe(true)
    expect(wrapper.find('.inside').text()).toBe('Hello')
  })

  it('appends a watermark layer node', async () => {
    const wrapper = mount(Watermark, {
      props: { content: 'mark' },
    })
    await nextTick()
    await new Promise((r) => setTimeout(r, 0))
    const wm = wrapper.element.querySelector('[data-ccui-watermark]') as HTMLElement | null
    expect(wm).not.toBeNull()
    // canvas may not be available in jsdom — fallback style still has pointer-events
    expect(wm?.getAttribute('style')).toContain('pointer-events')
  })

  it('keeps watermark when content prop changes', async () => {
    const wrapper = mount(Watermark, {
      props: { content: 'first' },
    })
    await nextTick()
    await new Promise((r) => setTimeout(r, 0))
    await wrapper.setProps({ content: 'second' })
    await nextTick()
    await new Promise((r) => setTimeout(r, 0))
    const wm = wrapper.element.querySelector('[data-ccui-watermark]') as HTMLElement | null
    expect(wm).not.toBeNull()
  })

  it('accepts content as string array', async () => {
    const wrapper = mount(Watermark, {
      props: { content: ['line1', 'line2'] },
    })
    await nextTick()
    await new Promise((r) => setTimeout(r, 0))
    expect(wrapper.element.querySelector('[data-ccui-watermark]')).not.toBeNull()
  })

  it('respects custom rotate / zIndex / gap props', async () => {
    const wrapper = mount(Watermark, {
      props: { content: 'demo', rotate: 0, zIndex: 100, gap: [50, 50] },
    })
    await nextTick()
    await new Promise((r) => setTimeout(r, 0))
    const wm = wrapper.element.querySelector('[data-ccui-watermark]') as HTMLElement | null
    expect(wm?.getAttribute('style')).toContain('z-index: 100')
  })

  it('rebuilds watermark when its node is removed (MutationObserver)', async () => {
    const wrapper = mount(Watermark, {
      props: { content: 'guard' },
      attachTo: document.body,
    })
    await nextTick()
    await new Promise((r) => setTimeout(r, 0))
    const first = wrapper.element.querySelector('[data-ccui-watermark]') as HTMLElement
    expect(first).not.toBeNull()
    first.remove()
    await new Promise((r) => setTimeout(r, 0))
    await nextTick()
    await new Promise((r) => setTimeout(r, 0))
    const after = wrapper.element.querySelector('[data-ccui-watermark]') as HTMLElement | null
    expect(after).not.toBeNull()
    wrapper.unmount()
  })

  it('cleans up watermark node on unmount', async () => {
    const wrapper = mount(Watermark, {
      props: { content: 'bye' },
      attachTo: document.body,
    })
    await nextTick()
    await new Promise((r) => setTimeout(r, 0))
    expect(document.body.querySelector('[data-ccui-watermark]')).not.toBeNull()
    wrapper.unmount()
    expect(document.body.querySelector('[data-ccui-watermark]')).toBeNull()
  })
})
