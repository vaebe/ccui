import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Content, Footer, Header, Layout, Sider } from '../index'

const ns = useNamespace('layout', true)
const siderNs = useNamespace('layout-sider', true)

describe('layout', () => {
  it('renders Layout container', () => {
    const wrapper = mount(Layout, { slots: { default: '<div>x</div>' } })
    expect(wrapper.find(ns.b()).exists()).toBe(true)
  })

  it('header / Footer / Content render proper tags', () => {
    const w1 = mount(Header, { slots: { default: 'h' } })
    expect(w1.element.tagName).toBe('HEADER')
    const w2 = mount(Footer, { slots: { default: 'f' } })
    expect(w2.element.tagName).toBe('FOOTER')
    const w3 = mount(Content, { slots: { default: 'c' } })
    expect(w3.element.tagName).toBe('MAIN')
  })

  it('sider renders aside with collapsed state', async () => {
    const wrapper = mount(Sider, { props: { defaultCollapsed: false }, slots: { default: 'menu' } })
    expect(wrapper.element.tagName).toBe('ASIDE')
    expect(wrapper.find(siderNs.m('dark')).exists()).toBe(true)
    await wrapper.setProps({ collapsed: true })
    expect(wrapper.find(siderNs.m('collapsed')).exists()).toBe(true)
  })

  it('sider trigger toggles collapsed', async () => {
    const wrapper = mount(Sider, { props: { collapsible: true }, slots: { default: 'menu' } })
    await wrapper.find(siderNs.e('trigger')).trigger('click')
    expect(wrapper.emitted('update:collapsed')?.[0]).toEqual([true])
  })

  it('layout adds has-sider modifier when Sider is registered', async () => {
    const wrapper = mount({
      components: { Layout, Sider, Content },
      template: `<Layout><Sider>menu</Sider><Content>main</Content></Layout>`,
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find(ns.m('has-sider')).exists()).toBe(true)
  })

  // L-2.21
  it('breakpoint：matchMedia 命中时自动 collapse + 触发 @breakpoint', async () => {
    let mqlEvents: ((e: MediaQueryListEvent) => void)[] = []
    const fakeMql = {
      matches: true, // 初始命中
      addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => mqlEvents.push(cb),
      removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
        mqlEvents = mqlEvents.filter((c) => c !== cb)
      },
    } as unknown as MediaQueryList
    // jsdom 不带 matchMedia；直接挂到 window 上做 stub
    const origMatchMedia = (window as any).matchMedia
    ;(window as any).matchMedia = () => fakeMql

    const wrapper = mount(Sider, {
      props: { breakpoint: 'md', collapsible: true },
      slots: { default: 'menu' },
    })
    await wrapper.vm.$nextTick()
    // 初始命中：emit breakpoint(true) + 自动 collapse
    expect(wrapper.emitted('breakpoint')?.[0]).toEqual([true])
    expect(wrapper.emitted('update:collapsed')?.[0]).toEqual([true])
    expect(wrapper.find(siderNs.m('collapsed')).exists()).toBe(true)

    // 模拟窗口变大，断点解除
    mqlEvents.forEach((cb) => cb({ matches: false } as MediaQueryListEvent))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('breakpoint')?.[1]).toEqual([false])
    expect(wrapper.emitted('update:collapsed')?.at(-1)).toEqual([false])

    ;(window as any).matchMedia = origMatchMedia
  })

  it('breakpoint：受控 collapsed 模式下不覆盖父值（仅 emit 事件）', async () => {
    const fakeMql = {
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList
    const origMatchMedia = (window as any).matchMedia
    ;(window as any).matchMedia = () => fakeMql

    const wrapper = mount(Sider, {
      props: { breakpoint: 'md', collapsed: false, collapsible: true },
      slots: { default: 'menu' },
    })
    await wrapper.vm.$nextTick()
    // emit breakpoint 事件
    expect(wrapper.emitted('breakpoint')?.[0]).toEqual([true])
    // 但受控时不 emit update:collapsed
    expect(wrapper.emitted('update:collapsed')).toBeUndefined()
    // DOM 仍按 props.collapsed=false
    expect(wrapper.find(siderNs.m('collapsed')).exists()).toBe(false)

    ;(window as any).matchMedia = origMatchMedia
  })

  it('zeroWidthTriggerStyle：collapsedWidth=0 + collapsed 时触发器应用 inline style', async () => {
    const wrapper = mount(Sider, {
      props: {
        collapsible: true,
        collapsedWidth: 0,
        defaultCollapsed: true,
        zeroWidthTriggerStyle: { position: 'fixed', top: '16px' },
      },
      slots: { default: 'menu' },
    })
    await wrapper.vm.$nextTick()
    const trigger = wrapper.find(siderNs.e('trigger'))
    expect(trigger.exists()).toBe(true)
    expect(trigger.classes()).toContain('ccui-layout-sider__trigger--zero-width')
    const style = trigger.attributes('style') ?? ''
    expect(style).toContain('position: fixed')
    expect(style).toContain('top: 16px')
  })

  it('zeroWidthTriggerStyle：仅在折叠态生效，展开态不挂', async () => {
    const wrapper = mount(Sider, {
      props: {
        collapsible: true,
        collapsedWidth: 0,
        defaultCollapsed: false,
        zeroWidthTriggerStyle: { position: 'fixed' },
      },
      slots: { default: 'menu' },
    })
    await wrapper.vm.$nextTick()
    const trigger = wrapper.find(siderNs.e('trigger'))
    expect(trigger.classes()).not.toContain('ccui-layout-sider__trigger--zero-width')
    const style = trigger.attributes('style') ?? ''
    expect(style).not.toContain('position: fixed')
  })
})
