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

  it('borderless modifier', () => {
    const wrapper = mount(Tag, { props: { bordered: false }, slots: { default: 'x' } })
    expect(wrapper.find(ns.m('borderless')).exists()).toBe(true)
  })
})
