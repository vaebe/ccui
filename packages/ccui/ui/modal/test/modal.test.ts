import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Modal } from '../index'

const ns = useNamespace('modal', true)

afterEach(() => {
  document.body.innerHTML = ''
  delete document.body.dataset.ccuiModalCount
  delete document.body.dataset.ccuiOriginalOverflow
  document.body.style.overflow = ''
})

describe('modal', () => {
  it('renders content when visible', async () => {
    const wrapper = mount(Modal, {
      props: { visible: true, title: 'Hello', appendToBody: true },
      slots: { default: '<p>Body content</p>' },
    })
    await nextTick()
    expect(document.body.textContent).toContain('Hello')
    expect(document.body.textContent).toContain('Body content')
    wrapper.unmount()
  })

  it('does not render content when hidden', async () => {
    const wrapper = mount(Modal, {
      props: { visible: false, title: 'Hello', appendToBody: true },
    })
    await nextTick()
    expect(document.body.querySelector(ns.e('content'))).toBeNull()
    wrapper.unmount()
  })

  it('emits ok and cancel events', async () => {
    const wrapper = mount(Modal, {
      props: { visible: true, appendToBody: true },
    })
    await nextTick()
    const okBtn = document.body.querySelector(ns.em('btn', 'primary')) as HTMLElement
    okBtn?.click()
    expect(wrapper.emitted('ok')).toBeTruthy()

    const cancelBtn = document.body.querySelector(ns.em('btn', 'cancel')) as HTMLElement
    cancelBtn?.click()
    expect(wrapper.emitted('cancel')).toBeTruthy()
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('closes on close button click', async () => {
    const wrapper = mount(Modal, {
      props: { visible: true, appendToBody: true },
    })
    await nextTick()
    const closeBtn = document.body.querySelector(ns.e('close')) as HTMLElement
    closeBtn?.click()
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('closes on mask click when maskClosable', async () => {
    const wrapper = mount(Modal, {
      props: { visible: true, appendToBody: true, maskClosable: true },
    })
    await nextTick()
    const mask = document.body.querySelector(ns.e('mask')) as HTMLElement
    mask?.click()
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('does not close on mask click when maskClosable is false', async () => {
    const wrapper = mount(Modal, {
      props: { visible: true, appendToBody: true, maskClosable: false },
    })
    await nextTick()
    const mask = document.body.querySelector(ns.e('mask')) as HTMLElement
    mask?.click()
    expect(wrapper.emitted('update:visible')).toBeUndefined()
    wrapper.unmount()
  })

  it('closes on escape when enabled and ignores escape when disabled', async () => {
    const enabled = mount(Modal, {
      props: { visible: true, appendToBody: true },
    })
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(enabled.emitted('update:visible')?.[0]).toEqual([false])
    expect(enabled.emitted('close')).toBeTruthy()
    enabled.unmount()

    const disabled = mount(Modal, {
      props: { visible: true, appendToBody: true, closeOnEsc: false },
    })
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(disabled.emitted('update:visible')).toBeUndefined()
    disabled.unmount()
  })

  it('renders custom title and footer slot actions', async () => {
    const wrapper = mount(Modal, {
      props: { visible: true, appendToBody: true },
      slots: {
        title: '<span class="modal-title-slot">Slot title</span>',
        footer: ({ ok, cancel }: any) => [
          h('button', { class: 'slot-ok', onClick: ok }, 'OK'),
          h('button', { class: 'slot-cancel', onClick: cancel }, 'Cancel'),
        ],
      },
    })
    await nextTick()

    expect(document.body.querySelector('.modal-title-slot')?.textContent).toBe('Slot title')
    ;(document.body.querySelector('.slot-ok') as HTMLElement).click()
    expect(wrapper.emitted('ok')).toBeTruthy()
    ;(document.body.querySelector('.slot-cancel') as HTMLElement).click()
    expect(wrapper.emitted('cancel')).toBeTruthy()
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('applies centered width zIndex and ok loading state', async () => {
    const wrapper = mount(Modal, {
      props: {
        visible: true,
        appendToBody: true,
        centered: true,
        width: 640,
        zIndex: 3000,
        okLoading: true,
        okType: 'danger',
      },
    })
    await nextTick()

    const root = document.body.querySelector(ns.b()) as HTMLElement
    const content = document.body.querySelector(ns.e('content')) as HTMLElement
    const okButton = document.body.querySelector(ns.em('btn', 'danger')) as HTMLButtonElement
    expect(root.className).toContain(ns.m('centered').slice(1))
    expect(root.style.zIndex).toBe('3000')
    expect(content.style.width).toBe('640px')
    expect(okButton.disabled).toBe(true)
    expect(okButton.className).toContain('is-loading')
    expect(document.body.querySelector(ns.e('spinner'))).not.toBeNull()
    wrapper.unmount()
  })

  it('can hide footer and close button', async () => {
    const wrapper = mount(Modal, {
      props: { visible: true, appendToBody: true, hideFooter: true, closable: false },
    })
    await nextTick()

    expect(document.body.querySelector(ns.e('footer'))).toBeNull()
    expect(document.body.querySelector(ns.e('close'))).toBeNull()
    wrapper.unmount()
  })

  it('closes on wrap click when mask is hidden and maskClosable is true', async () => {
    const wrapper = mount(Modal, {
      props: { visible: true, appendToBody: false, mask: false, maskClosable: true },
    })
    await nextTick()

    await wrapper.find(ns.e('wrap')).trigger('click')
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false])
    wrapper.unmount()
  })

  it('locks body scroll for multiple visible modals and restores on close', async () => {
    const first = mount(Modal, { props: { visible: true, appendToBody: true } })
    const second = mount(Modal, { props: { visible: true, appendToBody: true } })
    await nextTick()

    expect(document.body.dataset.ccuiModalCount).toBe('2')
    expect(document.body.style.overflow).toBe('hidden')

    await first.setProps({ visible: false })
    await nextTick()
    expect(document.body.dataset.ccuiModalCount).toBe('1')

    await second.setProps({ visible: false })
    await nextTick()
    expect(document.body.dataset.ccuiModalCount).toBeUndefined()
    expect(document.body.style.overflow).toBe('')
    first.unmount()
    second.unmount()
  })

  it('renders destroyOnClose modal only after it becomes visible', async () => {
    const wrapper = mount(Modal, {
      props: { visible: false, destroyOnClose: true, appendToBody: true },
    })
    expect(document.body.querySelector(ns.b())).toBeNull()

    await wrapper.setProps({ visible: true })
    await nextTick()
    expect(wrapper.emitted('open')).toBeTruthy()
    expect(document.body.querySelector(ns.b())).not.toBeNull()
    wrapper.unmount()
  })
})
