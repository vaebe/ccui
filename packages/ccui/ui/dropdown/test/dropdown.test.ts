import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Dropdown } from '../index'

const ns = useNamespace('dropdown', true)

afterEach(() => {
  vi.restoreAllMocks()
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

  it('opens and closes from internal state in click mode', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        trigger: 'click',
        items: [{ key: '1', label: 'A' }],
      },
      slots: { default: '<button>Trigger</button>' },
      attachTo: document.body,
    })

    await wrapper.find('.ccui-popover__trigger').trigger('click')
    await nextTick()
    expect(document.body.querySelector(ns.e('item'))).not.toBeNull()
    expect(wrapper.emitted('update:visible')?.[0]?.[0]).toBe(true)

    await wrapper.find('.ccui-popover__trigger').trigger('click')
    await nextTick()
    expect(wrapper.emitted('update:visible')?.[1]?.[0]).toBe(false)
    wrapper.unmount()
  })

  it('does not open when disabled', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        trigger: 'click',
        disabled: true,
        items: [{ key: '1', label: 'A' }],
      },
      slots: { default: '<button>Trigger</button>' },
      attachTo: document.body,
    })

    await wrapper.find('.ccui-popover__trigger').trigger('click')
    await nextTick()

    expect(document.body.querySelector(ns.e('item'))).toBeNull()
    expect(wrapper.emitted('update:visible')).toBeUndefined()
    wrapper.unmount()
  })

  it('passes placement and width through to popover content', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        visible: true,
        placement: 'top-start',
        width: '180px',
        items: [{ key: '1', label: 'A' }],
      },
      slots: { default: '<button>Trigger</button>' },
      attachTo: document.body,
    })
    await nextTick()

    const popper = document.body.querySelector('.ccui-popover__popper') as HTMLElement
    expect(popper.className).toContain('ccui-popover__popper--top')
    expect(popper.style.width).toBe('180px')
    wrapper.unmount()
  })

  it('trigger 携带 aria-haspopup=menu / aria-expanded / aria-controls，popper role=menu', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        trigger: 'click',
        items: [{ key: '1', label: 'A' }],
      },
      slots: { default: '<button>Trigger</button>' },
      attachTo: document.body,
    })

    const trigger = wrapper.find('.ccui-popover__trigger')
    // 关闭态
    expect(trigger.attributes('aria-haspopup')).toBe('menu')
    expect(trigger.attributes('aria-expanded')).toBe('false')

    await trigger.trigger('click')
    await nextTick()

    // 打开后
    expect(trigger.attributes('aria-expanded')).toBe('true')
    const popper = document.body.querySelector('.ccui-popover__popper') as HTMLElement
    expect(popper.getAttribute('role')).toBe('menu')
    expect(trigger.attributes('aria-controls')).toBe(popper.id)

    // 菜单项保留 menuitem role
    const item = popper.querySelector(`${ns.e('item')}`)
    expect(item?.getAttribute('role')).toBe('menuitem')
    wrapper.unmount()
  })

  it('updates visible state from v-model prop changes', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        visible: false,
        items: [{ key: '1', label: 'A' }],
      },
      slots: { default: '<button>Trigger</button>' },
      attachTo: document.body,
    })

    expect(document.body.querySelector(ns.e('item'))).toBeNull()
    await wrapper.setProps({ visible: true })
    await nextTick()
    expect(document.body.querySelector(ns.e('item'))).not.toBeNull()
    wrapper.unmount()
  })
})
