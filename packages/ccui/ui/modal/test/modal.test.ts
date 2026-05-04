import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
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
})
