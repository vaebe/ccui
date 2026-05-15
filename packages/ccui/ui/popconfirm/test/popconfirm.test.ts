import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { __resetDeprecationWarningsForTest } from '../../shared/hooks/use-deprecation-warning'
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

  // ─────────────────────────────────────────────────────────────
  // L-1.5 Ant Design API alignment
  // ─────────────────────────────────────────────────────────────

  describe('L-1.5 Ant 别名', () => {
    it('open=true 等价 visible=true', async () => {
      const wrapper = mount(Popconfirm, {
        props: { open: true, title: '确认删除？' },
        slots: { default: '<button>删除</button>' },
        attachTo: document.body,
      })
      await nextTick()
      expect(document.body.innerHTML).toContain('确认删除？')
      wrapper.unmount()
    })

    it('显式 open 优先于 visible', async () => {
      const wrapper = mount(Popconfirm, {
        props: { open: false, visible: true, title: '隐藏' },
        slots: { default: '<button>X</button>' },
        attachTo: document.body,
      })
      await nextTick()
      expect(document.body.innerHTML).not.toContain('隐藏')
      wrapper.unmount()
    })

    it('okText 优先于旧 confirmText', async () => {
      const wrapper = mount(Popconfirm, {
        props: { visible: true, title: 'X', okText: 'OK!', confirmText: '旧' },
        slots: { default: '<button>btn</button>' },
        attachTo: document.body,
      })
      await nextTick()
      expect(document.body.innerHTML).toContain('OK!')
      expect(document.body.innerHTML).not.toContain('旧')
      wrapper.unmount()
    })

    it('okType 优先于旧 confirmType（class 按 okType 走）', async () => {
      const wrapper = mount(Popconfirm, {
        props: { visible: true, title: 'X', okType: 'danger', confirmType: 'primary' },
        slots: { default: '<button>btn</button>' },
        attachTo: document.body,
      })
      await nextTick()
      const confirmBtn = document.body.querySelector('.ccui-popconfirm__btn--danger')
      expect(confirmBtn).not.toBeNull()
      wrapper.unmount()
    })

    it('update:open 与 update:visible 同步触发', async () => {
      const wrapper = mount(Popconfirm, {
        props: { title: 'X' },
        slots: { default: '<button>btn</button>' },
        attachTo: document.body,
      })
      await wrapper.find('.ccui-popover__trigger').trigger('click')
      await nextTick()
      expect(wrapper.emitted('update:visible')).toBeTruthy()
      expect(wrapper.emitted('update:open')).toBeTruthy()
      wrapper.unmount()
    })
  })

  describe('deprecation warn (M-A5)', () => {
    beforeEach(() => {
      __resetDeprecationWarningsForTest()
    })

    it('visible 显式传入触发 deprecation warn 一次', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const w = mount(Popconfirm, { props: { visible: true, title: 'X' }, slots: { default: '<button>btn</button>' } })
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('Popconfirm'))
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('visible 已 deprecated'))
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('open'))
      const w2 = mount(Popconfirm, { props: { visible: true, title: 'X' }, slots: { default: '<button>btn</button>' } })
      // 全局 Set 缓存，Popconfirm.visible 只 warn 一次（注：Popover.visible 在内部用 open 传入，不会触发）
      const visibleCalls = warn.mock.calls.filter((c) => String(c[0]).includes('[ccui][Popconfirm] visible'))
      expect(visibleCalls).toHaveLength(1)
      w.unmount()
      w2.unmount()
      warn.mockRestore()
    })

    it('confirmText 显式传入触发 deprecation warn 一次', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const w = mount(Popconfirm, {
        props: { confirmText: '好的', title: 'X' },
        slots: { default: '<button>btn</button>' },
      })
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('confirmText 已 deprecated'))
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('okText'))
      w.unmount()
      warn.mockRestore()
    })

    it('confirmType 显式传入触发 deprecation warn 一次', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const w = mount(Popconfirm, {
        props: { confirmType: 'danger', title: 'X' },
        slots: { default: '<button>btn</button>' },
      })
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('confirmType 已 deprecated'))
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('okType'))
      w.unmount()
      warn.mockRestore()
    })
  })
})
