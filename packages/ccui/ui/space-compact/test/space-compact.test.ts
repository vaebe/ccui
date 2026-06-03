import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { SpaceCompact } from '../index'

describe('space-compact', () => {
  it('默认渲染 div + horizontal modifier', () => {
    const wrapper = mount(SpaceCompact, {
      slots: { default: '<input /><input />' },
    })
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.classes()).toContain('ccui-space-compact')
    expect(wrapper.classes()).toContain('ccui-space-compact--horizontal')
  })

  it('direction=vertical 应用 --vertical modifier', () => {
    const wrapper = mount(SpaceCompact, {
      props: { direction: 'vertical' },
      slots: { default: '<input /><input />' },
    })
    expect(wrapper.classes()).toContain('ccui-space-compact--vertical')
    expect(wrapper.classes()).not.toContain('ccui-space-compact--horizontal')
  })

  it('size large / small 应用 modifier class', () => {
    expect(mount(SpaceCompact, { props: { size: 'large' } }).classes()).toContain('ccui-space-compact--large')
    expect(mount(SpaceCompact, { props: { size: 'small' } }).classes()).toContain('ccui-space-compact--small')
  })

  it('size=middle（默认）不上 modifier', () => {
    const wrapper = mount(SpaceCompact)
    expect(wrapper.classes()).not.toContain('ccui-space-compact--middle')
  })

  it('block=true 应用 --block modifier', () => {
    const wrapper = mount(SpaceCompact, { props: { block: true } })
    expect(wrapper.classes()).toContain('ccui-space-compact--block')
  })

  it('default slot 子节点完整渲染', () => {
    const wrapper = mount(SpaceCompact, {
      slots: {
        default: '<input class="a" /><input class="b" /><input class="c" />',
      },
    })
    expect(wrapper.find('.a').exists()).toBe(true)
    expect(wrapper.find('.b').exists()).toBe(true)
    expect(wrapper.find('.c').exists()).toBe(true)
  })
})
