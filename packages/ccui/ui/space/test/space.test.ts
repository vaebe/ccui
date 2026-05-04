import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Space } from '../index'

const ns = useNamespace('space', true)

describe('space', () => {
  it('renders horizontal by default', () => {
    const wrapper = mount(Space, { slots: { default: '<span>a</span><span>b</span>' } })
    expect(wrapper.find(ns.m('horizontal')).exists()).toBe(true)
  })

  it('renders vertical direction', () => {
    const wrapper = mount(Space, {
      props: { direction: 'vertical' },
      slots: { default: '<span>a</span><span>b</span>' },
    })
    expect(wrapper.find(ns.m('vertical')).exists()).toBe(true)
  })

  it('applies size as number', () => {
    const wrapper = mount(Space, { props: { size: 20 }, slots: { default: '<span>a</span>' } })
    const style = wrapper.find(ns.b()).attributes('style') ?? ''
    expect(style).toContain('20px')
  })

  it('renders split slot between items', () => {
    const wrapper = mount(Space, {
      slots: {
        default: '<span>a</span><span>b</span><span>c</span>',
        split: '|',
      },
    })
    const splits = wrapper.findAll(ns.e('split'))
    expect(splits.length).toBe(2)
  })
})
