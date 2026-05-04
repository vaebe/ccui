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
})
