import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Popconfirm } from '../index'

const ns = useNamespace('popconfirm', true)

function makeWrapper(props: Record<string, unknown> = {}) {
  return mount(Popconfirm, {
    props: {
      title: 'Are you sure?',
      visible: true,
      ...props,
    },
    slots: {
      default: '<button>Trigger</button>',
    },
    attachTo: document.body,
  })
}

describe('popconfirm', () => {
  it('renders title and default action buttons', async () => {
    const wrapper = makeWrapper()
    await nextTick()
    expect(document.body.innerHTML).toContain('Are you sure?')
    const buttons = document.body.querySelectorAll(`${ns.e('btn')}`)
    expect(buttons.length).toBe(2)
    expect([...buttons].every((button) => button.getAttribute('type') === 'button')).toBe(true)
    wrapper.unmount()
  })

  it('emits confirm on confirm click', async () => {
    const wrapper = makeWrapper()
    await nextTick()
    const confirmBtn = document.body.querySelector(`${ns.em('btn', 'primary')}`) as HTMLElement
    confirmBtn?.click()
    expect(wrapper.emitted('confirm')).toBeTruthy()
    wrapper.unmount()
  })

  it('emits cancel on cancel click', async () => {
    const wrapper = makeWrapper()
    await nextTick()
    const cancelBtn = document.body.querySelector(`${ns.em('btn', 'cancel')}`) as HTMLElement
    cancelBtn?.click()
    expect(wrapper.emitted('cancel')).toBeTruthy()
    wrapper.unmount()
  })

  it('renders description text', async () => {
    const wrapper = makeWrapper({ description: 'Extra info here' })
    await nextTick()
    expect(document.body.innerHTML).toContain('Extra info here')
    wrapper.unmount()
  })

  it('renders custom confirmText / cancelText', async () => {
    const wrapper = makeWrapper({ confirmText: 'GO', cancelText: 'NO' })
    await nextTick()
    expect(document.body.innerHTML).toContain('GO')
    expect(document.body.innerHTML).toContain('NO')
    wrapper.unmount()
  })

  it('applies confirmType modifier to primary button', async () => {
    const wrapper = makeWrapper({ confirmType: 'danger' })
    await nextTick()
    expect(document.body.querySelector(`${ns.em('btn', 'danger')}`)).not.toBeNull()
    wrapper.unmount()
  })

  it('hides icon when hideIcon=true', async () => {
    const wrapper = makeWrapper({ hideIcon: true })
    await nextTick()
    expect(document.body.querySelector(`${ns.e('icon')}`)).toBeNull()
    wrapper.unmount()
  })

  it('renders title via slot over prop', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'fallback', visible: true },
      slots: {
        default: '<button>Trigger</button>',
        title: '<strong class="slot-title">Custom Title</strong>',
      },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('.slot-title')?.textContent).toBe('Custom Title')
    expect(document.body.innerHTML).not.toContain('fallback')
    wrapper.unmount()
  })

  it('renders description and actions slots', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'fallback', visible: true },
      slots: {
        default: '<button>Trigger</button>',
        description: '<span class="slot-desc">Slot description</span>',
        actions: ({ confirm, cancel }: any) => [
          h('button', { class: 'slot-confirm', onClick: confirm }, 'Yes'),
          h('button', { class: 'slot-cancel', onClick: cancel }, 'No'),
        ],
      },
      attachTo: document.body,
    })
    await nextTick()

    expect(document.body.querySelector('.slot-desc')?.textContent).toBe('Slot description')
    ;(document.body.querySelector('.slot-confirm') as HTMLElement).click()
    expect(wrapper.emitted('confirm')).toBeTruthy()
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false])

    ;(document.body.querySelector('.slot-cancel') as HTMLElement).click()
    expect(wrapper.emitted('cancel')).toBeTruthy()
    wrapper.unmount()
  })

  it('renders custom icon color width and placement', async () => {
    const wrapper = makeWrapper({
      icon: 'icon-alert',
      iconColor: 'rgb(255, 0, 0)',
      width: '220px',
      placement: 'bottom',
    })
    await nextTick()

    const icon = document.body.querySelector(ns.e('icon')) as HTMLElement
    const popper = document.body.querySelector('.ccui-popover__popper') as HTMLElement
    expect(document.body.querySelector('.icon-alert')).not.toBeNull()
    expect(icon.style.color).toBe('rgb(255, 0, 0)')
    expect(popper.style.width).toBe('220px')
    expect(popper.className).toContain('ccui-popover__popper--bottom')
    wrapper.unmount()
  })

  it('内嵌 popover dialog role 与 trigger aria 属性继承', async () => {
    const wrapper = makeWrapper()
    await nextTick()
    const popper = document.body.querySelector('.ccui-popover__popper')
    expect(popper?.getAttribute('role')).toBe('dialog')
    expect(popper?.getAttribute('aria-label')).toBe('Are you sure?')
    const trigger = wrapper.find('.ccui-popover__trigger button')
    expect(trigger.attributes('aria-haspopup')).toBe('dialog')
    expect(trigger.attributes('aria-expanded')).toBe('true')
    wrapper.unmount()
  })

  it('打开后将焦点移入弹层，并在操作按钮间循环 Tab', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: '确认删除？' },
      slots: { default: '<button class="real-trigger">删除</button>' },
      attachTo: document.body,
    })
    const trigger = wrapper.find('.real-trigger').element as HTMLButtonElement
    trigger.focus()
    trigger.click()
    await nextTick()
    await nextTick()

    const cancel = document.body.querySelector(`${ns.em('btn', 'cancel')}`) as HTMLButtonElement
    const confirm = document.body.querySelector(`${ns.em('btn', 'primary')}`) as HTMLButtonElement
    expect(document.activeElement).toBe(cancel)

    cancel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }))
    expect(document.activeElement).toBe(confirm)
    confirm.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))
    expect(document.activeElement).toBe(cancel)
    wrapper.unmount()
  })

  it('初始受控 visible=true 时立即移入焦点、圈闭 Tab 并响应 Escape', async () => {
    const outside = document.createElement('button')
    outside.textContent = 'Outside'
    document.body.appendChild(outside)
    outside.focus()

    const wrapper = makeWrapper({ visible: true })
    await nextTick()
    await nextTick()

    const cancel = document.body.querySelector(`${ns.em('btn', 'cancel')}`) as HTMLButtonElement
    const confirm = document.body.querySelector(`${ns.em('btn', 'primary')}`) as HTMLButtonElement
    expect(document.activeElement).toBe(cancel)

    cancel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }))
    expect(document.activeElement).toBe(confirm)
    confirm.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('update:visible')?.at(-1)).toEqual([false])

    wrapper.unmount()
    outside.remove()
  })

  it('在弹层内按 Escape 关闭并将焦点恢复到真实 trigger', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: '确认删除？' },
      slots: { default: '<button class="real-trigger">删除</button>' },
      attachTo: document.body,
    })
    const trigger = wrapper.find('.real-trigger').element as HTMLButtonElement
    trigger.focus()
    trigger.click()
    await nextTick()
    await nextTick()
    expect(document.activeElement).not.toBe(trigger)

    document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    await nextTick()

    expect(document.body.querySelector('.ccui-popover__popper')).toBeNull()
    expect(document.activeElement).toBe(trigger)
    wrapper.unmount()
  })

  it('opens from internal state in click mode and respects disabled state', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'Open me', visible: undefined },
      slots: { default: '<button>Trigger</button>' },
      attachTo: document.body,
    })

    await wrapper.find('.ccui-popover__trigger').trigger('click')
    await nextTick()

    expect(document.body.innerHTML).toContain('Open me')
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([true])
    wrapper.unmount()

    const disabled = mount(Popconfirm, {
      props: { title: 'Disabled', disabled: true, visible: undefined },
      slots: { default: '<button>Trigger</button>' },
      attachTo: document.body,
    })
    await disabled.find('.ccui-popover__trigger').trigger('click')
    await nextTick()
    expect(document.body.innerHTML).not.toContain('Disabled')
    disabled.unmount()
  })

  describe('visible 控制', () => {
    it('visible=true 显示浮层', async () => {
      const wrapper = mount(Popconfirm, {
        props: { visible: true, title: '确认删除？' },
        slots: { default: '<button>删除</button>' },
        attachTo: document.body,
      })
      await nextTick()
      expect(document.body.innerHTML).toContain('确认删除？')
      wrapper.unmount()
    })

    it('visible=false 隐藏浮层', async () => {
      const wrapper = mount(Popconfirm, {
        props: { visible: false, title: '隐藏' },
        slots: { default: '<button>X</button>' },
        attachTo: document.body,
      })
      await nextTick()
      expect(document.body.innerHTML).not.toContain('隐藏')
      wrapper.unmount()
    })

    it('update:visible 同步触发', async () => {
      const wrapper = mount(Popconfirm, {
        props: { title: 'X' },
        slots: { default: '<button>btn</button>' },
        attachTo: document.body,
      })
      await wrapper.find('.ccui-popover__trigger').trigger('click')
      await nextTick()
      expect(wrapper.emitted('update:visible')).toBeTruthy()
      wrapper.unmount()
    })
  })
})
