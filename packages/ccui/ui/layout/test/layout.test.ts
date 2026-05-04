import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
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
})
