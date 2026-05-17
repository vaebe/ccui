import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { __resetDeprecatedWarningsForTest } from '../../shared/utils/deprecated'
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

  describe('closable 复合对象', () => {
    it('closable={ disabled: true } 渲染但 click 无效', async () => {
      const wrapper = mount(Drawer, {
        props: { visible: true, closable: { disabled: true } },
      })
      await nextTick()
      const closeBtn = document.body.querySelector(ns.e('close')) as HTMLButtonElement
      expect(closeBtn.disabled).toBe(true)
      closeBtn.click()
      expect(wrapper.emitted('update:visible')).toBeUndefined()
      wrapper.unmount()
    })

    it('closable={ ariaLabel } 自定义 aria-label', async () => {
      const wrapper = mount(Drawer, {
        props: { visible: true, closable: { ariaLabel: '关闭抽屉' } },
      })
      await nextTick()
      const closeBtn = document.body.querySelector(ns.e('close'))
      expect(closeBtn?.getAttribute('aria-label')).toBe('关闭抽屉')
      wrapper.unmount()
    })

    it('close-icon slot 优先于 closeIcon prop', async () => {
      const wrapper = mount(Drawer, {
        props: { visible: true, closable: { closeIcon: 'mdi:close' } },
        slots: { 'close-icon': '<i class="custom-x">X</i>' },
      })
      await nextTick()
      expect(document.body.querySelector('.custom-x')).not.toBeNull()
      wrapper.unmount()
    })
  })

  describe('extra slot', () => {
    it('extra slot 渲染到头部右侧', async () => {
      const wrapper = mount(Drawer, {
        props: { visible: true, title: 'T' },
        slots: { extra: '<button class="extra-btn">操作</button>' },
      })
      await nextTick()
      const extra = document.body.querySelector(ns.e('extra'))
      expect(extra).not.toBeNull()
      expect(extra?.querySelector('.extra-btn')).not.toBeNull()
      wrapper.unmount()
    })

    it('无 extra slot 时不渲染 extra 区', async () => {
      const wrapper = mount(Drawer, { props: { visible: true, title: 'T' } })
      await nextTick()
      expect(document.body.querySelector(ns.e('extra'))).toBeNull()
      wrapper.unmount()
    })
  })

  describe('loading', () => {
    it('loading=true 显示骨架占位 + aria-busy', async () => {
      const wrapper = mount(Drawer, {
        props: { visible: true, loading: true },
        slots: { default: '<p class="real-body">真实内容</p>' },
      })
      await nextTick()
      const skeleton = document.body.querySelector(ns.e('skeleton'))
      expect(skeleton).not.toBeNull()
      expect(skeleton?.getAttribute('aria-busy')).toBe('true')
      // 真实内容不渲染
      expect(document.body.querySelector('.real-body')).toBeNull()
      wrapper.unmount()
    })

    it('loading=false 渲染真实 body', async () => {
      const wrapper = mount(Drawer, {
        props: { visible: true, loading: false },
        slots: { default: '<p class="real-body">x</p>' },
      })
      await nextTick()
      expect(document.body.querySelector('.real-body')).not.toBeNull()
      expect(document.body.querySelector(ns.e('skeleton'))).toBeNull()
      wrapper.unmount()
    })
  })

  describe('footer prop + slot', () => {
    it('footer=null 隐藏 footer', async () => {
      const wrapper = mount(Drawer, { props: { visible: true, footer: null } })
      await nextTick()
      expect(document.body.querySelector(ns.e('footer'))).toBeNull()
      wrapper.unmount()
    })

    it('footer 接 string 渲染纯文本', async () => {
      const wrapper = mount(Drawer, { props: { visible: true, footer: '底部文字' } })
      await nextTick()
      expect(document.body.querySelector(ns.e('footer'))?.textContent).toBe('底部文字')
      wrapper.unmount()
    })

    it('footer slot 优先于 prop', async () => {
      const wrapper = mount(Drawer, {
        props: { visible: true, footer: 'fallback' },
        slots: { footer: '<div class="custom-footer">slot wins</div>' },
      })
      await nextTick()
      expect(document.body.querySelector('.custom-footer')).not.toBeNull()
      wrapper.unmount()
    })

    it('未传 footer 且 showFooter=false 不渲染', async () => {
      const wrapper = mount(Drawer, { props: { visible: true } })
      await nextTick()
      expect(document.body.querySelector(ns.e('footer'))).toBeNull()
      wrapper.unmount()
    })
  })

  describe('after-open-change 事件', () => {
    it('visible 切换时各 emit 一次', async () => {
      const wrapper = mount(Drawer, { props: { visible: false } })
      await wrapper.setProps({ visible: true })
      await nextTick()
      const events = wrapper.emitted('after-open-change')!
      expect(events.at(-1)).toEqual([true])

      await wrapper.setProps({ visible: false })
      await nextTick()
      expect(wrapper.emitted('after-open-change')!.at(-1)).toEqual([false])
      wrapper.unmount()
    })
  })

  describe('keep-alive', () => {
    it('keep-alive=true 关闭后保留外层 DOM', async () => {
      const wrapper = mount(Drawer, {
        props: { visible: false, keepAlive: true },
      })
      await nextTick()
      expect(document.body.querySelector(ns.b())).not.toBeNull()
      wrapper.unmount()
    })
  })

  describe('push 嵌套抽屉', () => {
    it('子抽屉打开时父抽屉 content 加 transform 让位', async () => {
      const Parent = {
        components: { Drawer },
        props: ['childOpen'],
        template: `
          <Drawer :visible="true" placement="right" :size="400">
            <Drawer :visible="childOpen" placement="right" :size="300" />
          </Drawer>
        `,
      }
      const wrapper = mount(Parent, { props: { childOpen: false } })
      await nextTick()
      // 父抽屉内容初始无 transform（除 inline 默认 transition 样式由 CSS 控制，不在 inline style 中）
      const parentContent = document.body.querySelectorAll(`${ns.e('content')}`)[0] as HTMLElement
      expect(parentContent.style.transform).toBe('')

      // 子抽屉打开
      await wrapper.setProps({ childOpen: true })
      await nextTick()
      const parentContentAfter = document.body.querySelectorAll(`${ns.e('content')}`)[0] as HTMLElement
      // placement=right → translateX(-180px)
      expect(parentContentAfter.style.transform).toBe('translateX(-180px)')
      wrapper.unmount()
    })

    it('push={ distance } 自定义让位距离', async () => {
      const Parent = {
        components: { Drawer },
        props: ['childOpen'],
        template: `
          <Drawer :visible="true" placement="right" :push="{ distance: 80 }">
            <Drawer :visible="childOpen" placement="right" />
          </Drawer>
        `,
      }
      const wrapper = mount(Parent, { props: { childOpen: true } })
      await nextTick()
      const parentContent = document.body.querySelectorAll(`${ns.e('content')}`)[0] as HTMLElement
      expect(parentContent.style.transform).toBe('translateX(-80px)')
      wrapper.unmount()
    })

    it('push=false 时父抽屉不让位', async () => {
      const Parent = {
        components: { Drawer },
        props: ['childOpen'],
        template: `
          <Drawer :visible="true" :push="false">
            <Drawer :visible="childOpen" />
          </Drawer>
        `,
      }
      const wrapper = mount(Parent, { props: { childOpen: true } })
      await nextTick()
      const parentContent = document.body.querySelectorAll(`${ns.e('content')}`)[0] as HTMLElement
      expect(parentContent.style.transform).toBe('')
      wrapper.unmount()
    })
  })

  describe('deprecation warn', () => {
    beforeEach(() => {
      __resetDeprecatedWarningsForTest()
    })

    it('showFooter 显式传入触发 deprecation warn 一次', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const w = mount(Drawer, { props: { showFooter: true } })
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('showFooter 已 deprecated'))
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('footer'))
      w.unmount()
      warn.mockRestore()
    })
  })

  describe('可访问性 ARIA', () => {
    it('root 为 role=dialog aria-modal=true，并 aria-labelledby/aria-describedby 指向 title/body', async () => {
      const wrapper = mount(Drawer, {
        props: { visible: true, title: 'Drawer Title' },
        slots: { default: '<p>Body</p>' },
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
      const wrapper = mount(Drawer, {
        props: { visible: true, closable: false },
      })
      await nextTick()
      const root = document.body.querySelector(ns.b()) as HTMLElement
      expect(root.getAttribute('aria-labelledby')).toBeNull()
      wrapper.unmount()
    })
  })

  describe('M-A2 classNames / styles 钩子', () => {
    it('classNames.root 注入到根节点', async () => {
      const wrapper = mount(Drawer, {
        props: { visible: true, classNames: { root: 'my-root' } },
      })
      await nextTick()
      const root = document.body.querySelector('.ccui-drawer.my-root')
      expect(root).not.toBeNull()
      wrapper.unmount()
    })

    it('styles.root 注入到根节点 style', async () => {
      const wrapper = mount(Drawer, {
        props: { visible: true, styles: { root: { color: 'red' } } },
      })
      await nextTick()
      const root = document.body.querySelector('.ccui-drawer') as HTMLElement | null
      expect(root).not.toBeNull()
      expect(root!.getAttribute('style') || '').toContain('red')
      wrapper.unmount()
    })
  })
})
