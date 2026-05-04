import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Dropdown } from '../index'

const ns = useNamespace('dropdown', true)

afterEach(() => {
  document.body.innerHTML = ''
})

describe('dropdown', () => {
  it('renders menu items when visible', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        visible: true,
        items: [
          { key: '1', label: 'One' },
          { key: '2', label: 'Two' },
        ],
      },
      slots: { default: '<button>Trigger</button>' },
      attachTo: document.body,
    })
    await nextTick()
    const items = document.body.querySelectorAll(ns.e('item'))
    expect(items.length).toBe(2)
    expect(document.body.textContent).toContain('One')
    wrapper.unmount()
  })

  it('emits select event on item click', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        visible: true,
        items: [
          { key: 'a', label: 'A' },
          { key: 'b', label: 'B' },
        ],
      },
      slots: { default: '<button>Trigger</button>' },
      attachTo: document.body,
    })
    await nextTick()
    const items = document.body.querySelectorAll(ns.e('item'))
    ;(items[1] as HTMLElement).click()
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ key: 'b', label: 'B' })
    wrapper.unmount()
  })

  it('does not emit select on disabled item', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        visible: true,
        items: [{ key: 'x', label: 'X', disabled: true }],
      },
      slots: { default: '<button>Trigger</button>' },
      attachTo: document.body,
    })
    await nextTick()
    const item = document.body.querySelector(ns.e('item')) as HTMLElement
    item?.click()
    expect(wrapper.emitted('select')).toBeUndefined()
    wrapper.unmount()
  })

  it('renders danger and divided item classes', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        visible: true,
        items: [
          { key: '1', label: 'A' },
          { key: '2', label: 'B', danger: true, divided: true },
        ],
      },
      slots: { default: '<button>Trigger</button>' },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector(ns.em('item', 'danger'))).not.toBeNull()
    expect(document.body.querySelector(ns.em('item', 'divided'))).not.toBeNull()
    wrapper.unmount()
  })

  it('renders item icon class when icon provided', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        visible: true,
        items: [{ key: '1', label: 'A', icon: 'icon-edit' }],
      },
      slots: { default: '<button>Trigger</button>' },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('.icon-edit')).not.toBeNull()
    wrapper.unmount()
  })

  it('emits both visible-change and update:visible on selection', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        visible: true,
        items: [{ key: '1', label: 'A' }],
      },
      slots: { default: '<button>Trigger</button>' },
      attachTo: document.body,
    })
    await nextTick()
    const item = document.body.querySelector(ns.e('item')) as HTMLElement
    item?.click()
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('update:visible')?.[0]?.[0]).toBe(false)
    expect(wrapper.emitted('visible-change')?.[0]?.[0]).toBe(false)
    wrapper.unmount()
  })

  it('skips hiding when hideOnClick=false', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        visible: true,
        hideOnClick: false,
        items: [{ key: '1', label: 'A' }],
      },
      slots: { default: '<button>Trigger</button>' },
      attachTo: document.body,
    })
    await nextTick()
    const item = document.body.querySelector(ns.e('item')) as HTMLElement
    item?.click()
    expect(wrapper.emitted('select')).toBeTruthy()
    // hide events should NOT be emitted
    expect(wrapper.emitted('update:visible')).toBeUndefined()
    wrapper.unmount()
  })

  it('renders custom menu via menu slot', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        visible: true,
        items: [{ key: '1', label: 'A' }],
      },
      slots: {
        default: '<button>Trigger</button>',
        menu: '<li class="custom-menu-item">Custom</li>',
      },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('.custom-menu-item')).not.toBeNull()
    // built-in items should NOT render when menu slot is provided
    expect(document.body.querySelector(ns.e('item'))).toBeNull()
    wrapper.unmount()
  })
})
