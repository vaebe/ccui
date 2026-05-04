import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Link, Paragraph, Text, Title } from '../index'

const ns = useNamespace('typography', true)

describe('typography', () => {
  it('text renders span with type modifier', () => {
    const wrapper = mount(Text, { props: { type: 'success' }, slots: { default: 'ok' } })
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.find(ns.m('success')).exists()).toBe(true)
  })

  it('paragraph renders div', () => {
    const wrapper = mount(Paragraph, { slots: { default: 'Hello' } })
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.find(ns.m('paragraph')).exists()).toBe(true)
  })

  it('title renders h tag based on level', () => {
    const wrapper = mount(Title, { props: { level: 3 }, slots: { default: 'Title' } })
    expect(wrapper.element.tagName).toBe('H3')
    expect(wrapper.find(ns.m('title-3')).exists()).toBe(true)
  })

  it('link renders anchor with href', () => {
    const wrapper = mount(Link, { props: { href: '/x' }, slots: { default: 'go' } })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/x')
  })

  it('text wraps decorations like strong + code', () => {
    const wrapper = mount(Text, { props: { strong: true, code: true }, slots: { default: 'x' } })
    expect(wrapper.find('strong').exists()).toBe(true)
    expect(wrapper.find('code').exists()).toBe(true)
  })
})
