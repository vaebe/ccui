import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Flex } from '../index'

const ns = useNamespace('flex', true)

describe('flex', () => {
  it('renders div by default', () => {
    const wrapper = mount(Flex, { slots: { default: '<span>x</span>' } })
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.find(ns.b()).exists()).toBe(true)
  })

  it('vertical direction sets column', () => {
    const wrapper = mount(Flex, { props: { vertical: true }, slots: { default: '<span>x</span>' } })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('flex-direction: column')
  })

  it('preset gap maps to value', () => {
    const wrapper = mount(Flex, { props: { gap: 'small' }, slots: { default: '<span>x</span>' } })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('gap: 8px')
  })

  it('numeric gap', () => {
    const wrapper = mount(Flex, { props: { gap: 12 }, slots: { default: '<span>x</span>' } })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('gap: 12px')
  })
})
