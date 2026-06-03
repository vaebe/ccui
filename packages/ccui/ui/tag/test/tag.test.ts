import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Tag } from '../index'

const ns = useNamespace('tag', true)

describe('tag', () => {
  it('renders default content', () => {
    const wrapper = mount(Tag, { slots: { default: 'tag1' } })
    expect(wrapper.find(ns.b()).exists()).toBe(true)
    expect(wrapper.text()).toContain('tag1')
  })

  it('applies preset color modifier', () => {
    const wrapper = mount(Tag, { props: { color: 'success' }, slots: { default: 'ok' } })
    expect(wrapper.find(ns.m('success')).exists()).toBe(true)
  })

  it('applies inline style for custom color', () => {
    const wrapper = mount(Tag, { props: { color: '#ff7875' }, slots: { default: 'x' } })
    const style = wrapper.find(ns.b()).attributes('style') ?? ''
    expect(style).toContain('background-color')
  })

  it('emits close event when closable', async () => {
    const wrapper = mount(Tag, { props: { closable: true }, slots: { default: 'x' } })
    await wrapper.find(ns.e('close')).trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('variant=outlined（默认）渲染 outlined class，无 borderless', () => {
    const wrapper = mount(Tag, { slots: { default: 'x' } })
    expect(wrapper.find(ns.m('variant-outlined')).exists()).toBe(true)
    expect(wrapper.find(ns.m('borderless')).exists()).toBe(false)
  })

  it('variant=filled 渲染 filled class + borderless', () => {
    const wrapper = mount(Tag, { props: { variant: 'filled' }, slots: { default: 'x' } })
    expect(wrapper.find(ns.m('variant-filled')).exists()).toBe(true)
    expect(wrapper.find(ns.m('borderless')).exists()).toBe(true)
  })

  it('variant=solid 渲染 solid class + borderless（无外边框）', () => {
    const wrapper = mount(Tag, { props: { variant: 'solid' }, slots: { default: 'x' } })
    expect(wrapper.find(ns.m('variant-solid')).exists()).toBe(true)
    expect(wrapper.find(ns.m('borderless')).exists()).toBe(true)
  })
})
