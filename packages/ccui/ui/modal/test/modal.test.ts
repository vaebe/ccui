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

  // ─────────────────────────────────────────────────────────────
  // L-1.3: Ant Design API alignment
  // ─────────────────────────────────────────────────────────────

  describe('open（Ant 主名 + v-model:open）', () => {
    it('open=true 等价于旧 visible=true', async () => {
      const wrapper = mount(Modal, {
        props: { open: true, title: 'X' },
      })
      await nextTick()
      expect(document.body.textContent).toContain('X')
      wrapper.unmount()
    })

    it('显式 open 优先于 visible', async () => {
      const wrapper = mount(Modal, {
        props: { open: false, visible: true },
      })
      await nextTick()
      // open=false 关闭，visible=true 被忽略
      expect(document.body.querySelector(ns.e('content'))).toBeNull()
      wrapper.unmount()
    })

    it('关闭时同时 emit update:open 和 update:visible', async () => {
      const wrapper = mount(Modal, { props: { open: true } })
      await nextTick()
      const closeBtn = document.body.querySelector(ns.e('close')) as HTMLElement
      closeBtn?.click()
      expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
      expect(wrapper.emitted('update:visible')?.[0]).toEqual([false])
      wrapper.unmount()
    })
  })

  describe('closable 复合对象', () => {
    it('closable={ disabled: true } 关闭按钮渲染但点击无效', async () => {
      const wrapper = mount(Modal, {
        props: { open: true, closable: { disabled: true } },
      })
      await nextTick()
      const closeBtn = document.body.querySelector(ns.e('close')) as HTMLButtonElement
      expect(closeBtn).not.toBeNull()
      expect(closeBtn.disabled).toBe(true)
      closeBtn.click()
      expect(wrapper.emitted('update:open')).toBeUndefined()
      wrapper.unmount()
    })

    it('closable={ ariaLabel: "关闭弹窗" } 自定义 aria-label', async () => {
      const wrapper = mount(Modal, {
        props: { open: true, closable: { ariaLabel: '关闭弹窗' } },
      })
      await nextTick()
      const closeBtn = document.body.querySelector(ns.e('close'))
      expect(closeBtn?.getAttribute('aria-label')).toBe('关闭弹窗')
      wrapper.unmount()
    })

    it('close-icon slot 优先于 closable.closeIcon', async () => {
      const wrapper = mount(Modal, {
        props: { open: true, closable: { closeIcon: 'mdi:close' } },
        slots: { 'close-icon': '<i class="custom-x">X</i>' },
      })
      await nextTick()
      expect(document.body.querySelector('.custom-x')).not.toBeNull()
      wrapper.unmount()
    })
  })

  describe('footer prop + slot', () => {
    it('footer=null 隐藏 footer（等价 hideFooter=true）', async () => {
      const wrapper = mount(Modal, { props: { open: true, footer: null } })
      await nextTick()
      expect(document.body.querySelector(ns.e('footer'))).toBeNull()
      wrapper.unmount()
    })

    it('footer 接 string 渲染纯文本', async () => {
      const wrapper = mount(Modal, { props: { open: true, footer: '自定义页脚文字' } })
      await nextTick()
      expect(document.body.querySelector(ns.e('footer'))?.textContent).toBe('自定义页脚文字')
      wrapper.unmount()
    })

    it('footer slot 优先于 prop', async () => {
      const wrapper = mount(Modal, {
        props: { open: true, footer: 'fallback' },
        slots: { footer: '<div class="custom-footer">slot wins</div>' },
      })
      await nextTick()
      expect(document.body.querySelector('.custom-footer')).not.toBeNull()
      expect(document.body.querySelector(ns.e('footer'))?.textContent).not.toContain('fallback')
      wrapper.unmount()
    })
  })

  describe('after-open-change 事件', () => {
    it('打开 / 关闭都触发 after-open-change，payload 是新状态', async () => {
      const wrapper = mount(Modal, { props: { open: false } })
      await wrapper.setProps({ open: true })
      await nextTick()
      const events = wrapper.emitted('after-open-change')!
      // immediate watch 触发一次 false（初始），打开后再一次 true
      expect(events.length).toBeGreaterThanOrEqual(2)
      expect(events.at(-1)).toEqual([true])

      await wrapper.setProps({ open: false })
      await nextTick()
      const events2 = wrapper.emitted('after-open-change')!
      expect(events2.at(-1)).toEqual([false])
      wrapper.unmount()
    })
  })

  describe('keyboard 别名 close-on-esc', () => {
    it('keyboard=false 禁用 Esc 关闭', async () => {
      const wrapper = mount(Modal, { props: { open: true, keyboard: false } })
      await nextTick()
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      expect(wrapper.emitted('update:open')).toBeUndefined()
      wrapper.unmount()
    })

    it('显式 keyboard 优先于 closeOnEsc', async () => {
      // closeOnEsc=true（默认）但 keyboard=false → 不应关闭
      const wrapper = mount(Modal, { props: { open: true, keyboard: false, closeOnEsc: true } })
      await nextTick()
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      expect(wrapper.emitted('update:open')).toBeUndefined()
      wrapper.unmount()
    })
  })

  describe('keep-alive', () => {
    it('keep-alive=true 关闭后保留内部 DOM', async () => {
      const wrapper = mount(Modal, {
        props: { open: false, keepAlive: true, title: 'KA' },
        slots: { default: '<p class="ka-body">body</p>' },
      })
      await nextTick()
      // 即使 open=false，因 keep-alive 渲染外层 dialog（内部 v-if 控制 wrap 不显示，但 ns.b() 节点存在）
      expect(document.body.querySelector(ns.b())).not.toBeNull()
      wrapper.unmount()
    })

    it('keep-alive=true 时 destroyOnClose 不生效', async () => {
      const wrapper = mount(Modal, {
        props: { open: true, keepAlive: true, destroyOnClose: true },
      })
      await nextTick()
      await wrapper.setProps({ open: false })
      await nextTick()
      // 外层节点仍保留（keep-alive 覆盖 destroyOnClose）
      expect(document.body.querySelector(ns.b())).not.toBeNull()
      wrapper.unmount()
    })
  })

  describe('wrap-class-name', () => {
    it('wrap-class-name 加到根节点', async () => {
      const wrapper = mount(Modal, {
        props: { open: true, wrapClassName: 'my-modal-wrap' },
      })
      await nextTick()
      expect(document.body.querySelector('.my-modal-wrap')).not.toBeNull()
      wrapper.unmount()
    })
  })

  describe('getContainer 函数', () => {
    it('getContainer 返回容器节点时 Teleport 到该节点', async () => {
      const container = document.createElement('div')
      container.id = 'modal-custom-host'
      document.body.appendChild(container)

      const wrapper = mount(Modal, {
        props: { open: true, getContainer: () => container },
      })
      await nextTick()
      expect(container.querySelector(ns.b())).not.toBeNull()
      // body 直接子不再有 modal（被 Teleport 到 container）
      expect(document.body.children[0].id).toBe('modal-custom-host')
      wrapper.unmount()
    })

    it('getContainer 返回 null 时不 Teleport', async () => {
      const wrapper = mount(Modal, {
        props: { open: true, getContainer: () => null },
      })
      await nextTick()
      // 此时直接渲染在 wrapper 内
      expect(wrapper.find(ns.b()).exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('confirmLoading 别名', () => {
    it('confirmLoading=true 等价于 okLoading=true', async () => {
      const wrapper = mount(Modal, { props: { open: true, confirmLoading: true } })
      await nextTick()
      const okBtn = document.body.querySelector(ns.em('btn', 'primary')) as HTMLButtonElement
      expect(okBtn?.disabled).toBe(true)
      expect(okBtn?.querySelector(ns.e('spinner'))).not.toBeNull()
      wrapper.unmount()
    })

    it('显式 confirmLoading 优先于 okLoading', async () => {
      const wrapper = mount(Modal, {
        props: { open: true, confirmLoading: false, okLoading: true },
      })
      await nextTick()
      const okBtn = document.body.querySelector(ns.em('btn', 'primary')) as HTMLButtonElement
      expect(okBtn?.disabled).toBe(false)
      wrapper.unmount()
    })
  })

  describe('transitionName / maskTransitionName', () => {
    it('自定义 transitionName 透传到内部 Transition（运行时 DOM 不可直接验证，断言不报错即可）', async () => {
      const wrapper = mount(Modal, {
        props: { open: true, transitionName: 'my-zoom', maskTransitionName: 'my-fade' },
      })
      await nextTick()
      expect(document.body.querySelector(ns.b())).not.toBeNull()
      wrapper.unmount()
    })
  })
})
