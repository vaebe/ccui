import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Drawer } from '../index'

const ns = useNamespace('drawer', true)

afterEach(() => {
  document.body.innerHTML = ''
  delete document.body.dataset.ccuiDrawerCount
  delete document.body.dataset.ccuiDrawerOverflow
  document.body.style.overflow = ''
})

describe('drawer', () => {
  it('renders title and content when visible', async () => {
    const wrapper = mount(Drawer, {
      props: { visible: true, title: 'Drawer Title' },
      slots: { default: '<p>Drawer body</p>' },
    })
    await nextTick()
    expect(document.body.textContent).toContain('Drawer Title')
    expect(document.body.textContent).toContain('Drawer body')
    wrapper.unmount()
  })

  it('applies placement modifier', async () => {
    const wrapper = mount(Drawer, {
      props: { visible: true, placement: 'left' },
    })
    await nextTick()
    expect(document.body.querySelector(ns.m('left'))).not.toBeNull()
    wrapper.unmount()
  })

  it('closes on close button click', async () => {
    const wrapper = mount(Drawer, {
      props: { visible: true },
    })
    await nextTick()
    const closeBtn = document.body.querySelector(ns.e('close')) as HTMLElement
    closeBtn?.click()
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('closes on mask click when maskClosable', async () => {
    const wrapper = mount(Drawer, {
      props: { visible: true, maskClosable: true },
    })
    await nextTick()
    const mask = document.body.querySelector(ns.e('mask')) as HTMLElement
    mask?.click()
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('respects maskClosable=false', async () => {
    const wrapper = mount(Drawer, {
      props: { visible: true, maskClosable: false },
    })
    await nextTick()
    const mask = document.body.querySelector(ns.e('mask')) as HTMLElement
    mask?.click()
    expect(wrapper.emitted('update:visible')).toBeUndefined()
    wrapper.unmount()
  })

  it('closes on escape when closeOnEsc is enabled', async () => {
    const wrapper = mount(Drawer, {
      props: { visible: true },
    })
    await nextTick()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false])
    expect(wrapper.emitted('close')).toBeTruthy()
    wrapper.unmount()
  })

  it('ignores escape when closeOnEsc is disabled', async () => {
    const wrapper = mount(Drawer, {
      props: { visible: true, closeOnEsc: false },
    })
    await nextTick()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    expect(wrapper.emitted('update:visible')).toBeUndefined()
    wrapper.unmount()
  })

  it('renders title and footer slots', async () => {
    const wrapper = mount(Drawer, {
      props: { visible: true, showFooter: true },
      slots: {
        title: '<span class="custom-title">Custom title</span>',
        footer: '<button class="custom-footer">Save</button>',
      },
    })
    await nextTick()

    expect(document.body.querySelector('.custom-title')?.textContent).toBe('Custom title')
    expect(document.body.querySelector('.custom-footer')?.textContent).toBe('Save')
    wrapper.unmount()
  })

  it('applies numeric width for horizontal placement and string height for vertical placement', async () => {
    const horizontal = mount(Drawer, {
      props: { visible: true, placement: 'right', size: 420 },
    })
    await nextTick()
    expect((document.body.querySelector(ns.e('content')) as HTMLElement).style.width).toBe('420px')
    horizontal.unmount()

    const vertical = mount(Drawer, {
      props: { visible: true, placement: 'top', size: '40%' },
    })
    await nextTick()
    expect((document.body.querySelector(ns.e('content')) as HTMLElement).style.height).toBe('40%')
    vertical.unmount()
  })

  it('can render in place without mask or close button', async () => {
    const wrapper = mount(Drawer, {
      props: { visible: true, appendToBody: false, mask: false, closable: false, title: 'Inline' },
    })
    await nextTick()

    expect(wrapper.find(ns.b()).exists()).toBe(true)
    expect(wrapper.find(ns.e('mask')).exists()).toBe(false)
    expect(wrapper.find(ns.e('close')).exists()).toBe(false)
    wrapper.unmount()
  })

  it('locks body scroll for multiple visible drawers and restores on close', async () => {
    const first = mount(Drawer, { props: { visible: true } })
    const second = mount(Drawer, { props: { visible: true } })
    await nextTick()

    expect(document.body.dataset.ccuiDrawerCount).toBe('2')
    expect(document.body.style.overflow).toBe('hidden')

    await first.setProps({ visible: false })
    await nextTick()
    expect(document.body.dataset.ccuiDrawerCount).toBe('1')
    expect(document.body.style.overflow).toBe('hidden')

    await second.setProps({ visible: false })
    await nextTick()
    expect(document.body.dataset.ccuiDrawerCount).toBeUndefined()
    expect(document.body.style.overflow).toBe('')
    first.unmount()
    second.unmount()
  })

  it('emits open when destroyOnClose drawer becomes visible', async () => {
    const wrapper = mount(Drawer, {
      props: { visible: false, destroyOnClose: true },
    })
    expect(document.body.querySelector(ns.b())).toBeNull()

    await wrapper.setProps({ visible: true })
    await nextTick()
    expect(wrapper.emitted('open')).toBeTruthy()
    expect(document.body.querySelector(ns.b())).not.toBeNull()
    wrapper.unmount()
  })
})
