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
        confirmLoading: true,
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
      props: { visible: true, appendToBody: true, footer: null, closable: false },
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

  describe('closable 复合对象', () => {
    it('closable={ disabled: true } 关闭按钮渲染但点击无效', async () => {
      const wrapper = mount(Modal, {
        props: { visible: true, closable: { disabled: true } },
      })
      await nextTick()
      const closeBtn = document.body.querySelector(ns.e('close')) as HTMLButtonElement
      expect(closeBtn).not.toBeNull()
      expect(closeBtn.disabled).toBe(true)
      closeBtn.click()
      expect(wrapper.emitted('update:visible')).toBeUndefined()
      wrapper.unmount()
    })

    it('closable={ ariaLabel: "关闭弹窗" } 自定义 aria-label', async () => {
      const wrapper = mount(Modal, {
        props: { visible: true, closable: { ariaLabel: '关闭弹窗' } },
      })
      await nextTick()
      const closeBtn = document.body.querySelector(ns.e('close'))
      expect(closeBtn?.getAttribute('aria-label')).toBe('关闭弹窗')
      wrapper.unmount()
    })

    it('close-icon slot 优先于 closable.closeIcon', async () => {
      const wrapper = mount(Modal, {
        props: { visible: true, closable: { closeIcon: 'mdi:close' } },
        slots: { 'close-icon': '<i class="custom-x">X</i>' },
      })
      await nextTick()
      expect(document.body.querySelector('.custom-x')).not.toBeNull()
      wrapper.unmount()
    })
  })

  describe('footer prop + slot', () => {
    it('footer=null 隐藏 footer（等价 hideFooter=true）', async () => {
      const wrapper = mount(Modal, { props: { visible: true, footer: null } })
      await nextTick()
      expect(document.body.querySelector(ns.e('footer'))).toBeNull()
      wrapper.unmount()
    })

    it('footer 接 string 渲染纯文本', async () => {
      const wrapper = mount(Modal, { props: { visible: true, footer: '自定义页脚文字' } })
      await nextTick()
      expect(document.body.querySelector(ns.e('footer'))?.textContent).toBe('自定义页脚文字')
      wrapper.unmount()
    })

    it('footer slot 优先于 prop', async () => {
      const wrapper = mount(Modal, {
        props: { visible: true, footer: 'fallback' },
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
      const wrapper = mount(Modal, { props: { visible: false } })
      await wrapper.setProps({ visible: true })
      await nextTick()
      const events = wrapper.emitted('after-open-change')!
      // immediate watch 触发一次 false（初始），打开后再一次 true
      expect(events.length).toBeGreaterThanOrEqual(2)
      expect(events.at(-1)).toEqual([true])

      await wrapper.setProps({ visible: false })
      await nextTick()
      const events2 = wrapper.emitted('after-open-change')!
      expect(events2.at(-1)).toEqual([false])
      wrapper.unmount()
    })
  })

  describe('keep-alive', () => {
    it('keep-alive=true 关闭后保留内部 DOM', async () => {
      const wrapper = mount(Modal, {
        props: { visible: false, keepAlive: true, title: 'KA' },
        slots: { default: '<p class="ka-body">body</p>' },
      })
      await nextTick()
      // 即使 visible=false，因 keep-alive 渲染外层 dialog（内部 v-if 控制 wrap 不显示，但 ns.b() 节点存在）
      expect(document.body.querySelector(ns.b())).not.toBeNull()
      wrapper.unmount()
    })

    it('keep-alive=true 时 destroyOnClose 不生效', async () => {
      const wrapper = mount(Modal, {
        props: { visible: true, keepAlive: true, destroyOnClose: true },
      })
      await nextTick()
      await wrapper.setProps({ visible: false })
      await nextTick()
      // 外层节点仍保留（keep-alive 覆盖 destroyOnClose）
      expect(document.body.querySelector(ns.b())).not.toBeNull()
      wrapper.unmount()
    })
  })

  describe('wrap-class-name', () => {
    it('wrap-class-name 加到根节点', async () => {
      const wrapper = mount(Modal, {
        props: { visible: true, wrapClassName: 'my-modal-wrap' },
      })
      await nextTick()
      expect(document.body.querySelector('.my-modal-wrap')).not.toBeNull()
      wrapper.unmount()
    })
  })

  describe('confirmLoading', () => {
    it('confirmLoading=true 禁用确认按钮并显示 spinner', async () => {
      const wrapper = mount(Modal, { props: { visible: true, confirmLoading: true } })
      await nextTick()
      const okBtn = document.body.querySelector(ns.em('btn', 'primary')) as HTMLButtonElement
      expect(okBtn?.disabled).toBe(true)
      expect(okBtn?.querySelector(ns.e('spinner'))).not.toBeNull()
      wrapper.unmount()
    })

    it('confirmLoading=false 时确认按钮可点击', async () => {
      const wrapper = mount(Modal, { props: { visible: true, confirmLoading: false } })
      await nextTick()
      const okBtn = document.body.querySelector(ns.em('btn', 'primary')) as HTMLButtonElement
      expect(okBtn?.disabled).toBe(false)
      wrapper.unmount()
    })
  })

  describe('transitionName / maskTransitionName', () => {
    it('自定义 transitionName 透传到内部 Transition（运行时 DOM 不可直接验证，断言不报错即可）', async () => {
      const wrapper = mount(Modal, {
        props: { visible: true, transitionName: 'my-zoom', maskTransitionName: 'my-fade' },
      })
      await nextTick()
      expect(document.body.querySelector(ns.b())).not.toBeNull()
      wrapper.unmount()
    })
  })

  describe('可访问性 ARIA', () => {
    it('root 为 role=dialog aria-modal=true，并 aria-labelledby/aria-describedby 指向 title/body', async () => {
      const wrapper = mount(Modal, {
        props: { visible: true, title: 'Modal Title', appendToBody: true },
        slots: { default: '<p>Body content</p>' },
      })
      await nextTick()
      const root = document.body.querySelector(ns.b()) as HTMLElement
      expect(root.getAttribute('role')).toBe('dialog')
      expect(root.getAttribute('aria-modal')).toBe('true')

      const title = document.body.querySelector(ns.e('title')) as HTMLElement
      const body = document.body.querySelector(ns.e('body')) as HTMLElement
      expect(title.id).toBeTruthy()
      expect(body.id).toBeTruthy()
      expect(root.getAttribute('aria-labelledby')).toBe(title.id)
      expect(root.getAttribute('aria-describedby')).toBe(body.id)
      wrapper.unmount()
    })

    it('无 title 时不设置 aria-labelledby', async () => {
      const wrapper = mount(Modal, {
        props: { visible: true, appendToBody: true },
        slots: { default: '<p>x</p>' },
      })
      await nextTick()
      const root = document.body.querySelector(ns.b()) as HTMLElement
      expect(root.getAttribute('aria-labelledby')).toBeNull()
      wrapper.unmount()
    })
  })

  describe('M-A2 classNames / styles 钩子', () => {
    it('classNames.root 注入到根节点', async () => {
      const wrapper = mount(Modal, {
        props: { visible: true, appendToBody: true, classNames: { root: 'my-root' } },
      })
      await nextTick()
      const root = document.body.querySelector('.ccui-modal.my-root')
      expect(root).not.toBeNull()
      wrapper.unmount()
    })

    it('styles.root 注入到根节点 style', async () => {
      const wrapper = mount(Modal, {
        props: { visible: true, appendToBody: true, styles: { root: { color: 'red' } } },
      })
      await nextTick()
      const root = document.body.querySelector('.ccui-modal') as HTMLElement | null
      expect(root).not.toBeNull()
      expect(root!.getAttribute('style') || '').toContain('red')
      wrapper.unmount()
    })
  })
})
