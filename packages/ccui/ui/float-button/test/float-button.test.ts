import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { BackTop, FloatButton } from '../index'

const ns = useNamespace('float-button', true)

function rafNow(callback: FrameRequestCallback) {
  callback(0)
  return 1
}

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
  afterEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('hidden initially when scroll is below threshold', () => {
    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 400 },
    })
    expect(wrapper.find(ns.b()).exists()).toBe(false)
  })

  it('shows when element target scrolls past threshold and scrolls back to top', async () => {
    const target = document.createElement('div')
    target.className = 'scroll-target'
    document.body.appendChild(target)
    target.scrollTop = 120
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(rafNow)

    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 100, duration: 0, target },
      attachTo: document.body,
    })
    await nextTick()

    expect(wrapper.find(ns.b()).exists()).toBe(true)
    await wrapper.find(ns.b()).trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
    expect(target.scrollTop).toBe(0)
  })

  it('resolves string target and updates visibility on scroll', async () => {
    const target = document.createElement('div')
    target.id = 'scroll-root'
    document.body.appendChild(target)

    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 10, target: '#scroll-root' },
      attachTo: document.body,
    })

    target.scrollTop = 11
    target.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(wrapper.find(ns.b()).exists()).toBe(true)

    target.scrollTop = 0
    target.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(wrapper.find(ns.b()).exists()).toBe(false)
  })

  it('resolves function target and scrolls it back to top', async () => {
    const target = document.createElement('div')
    target.scrollTop = 160
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(rafNow)

    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 100, duration: 0, target: () => target },
    })
    await nextTick()

    expect(wrapper.find(ns.b()).exists()).toBe(true)
    await wrapper.find(ns.b()).trigger('click')
    expect(target.scrollTop).toBe(0)
  })
})
