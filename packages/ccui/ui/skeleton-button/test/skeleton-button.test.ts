import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { SkeletonButton } from '../index'

describe('skeleton-button', () => {
  it('默认渲染 span 元素 + base class', () => {
    const wrapper = mount(SkeletonButton)
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.classes()).toContain('ccui-skeleton-button')
  })

  it('size=large / small 应用 modifier class', () => {
    const large = mount(SkeletonButton, { props: { size: 'large' } })
    expect(large.classes()).toContain('ccui-skeleton-button--large')
    const small = mount(SkeletonButton, { props: { size: 'small' } })
    expect(small.classes()).toContain('ccui-skeleton-button--small')
  })

  it('shape circle / round / square 应用 modifier class', () => {
    expect(mount(SkeletonButton, { props: { shape: 'circle' } }).classes()).toContain('ccui-skeleton-button--circle')
    expect(mount(SkeletonButton, { props: { shape: 'round' } }).classes()).toContain('ccui-skeleton-button--round')
    expect(mount(SkeletonButton, { props: { shape: 'square' } }).classes()).toContain('ccui-skeleton-button--square')
  })

  it('block=true 应用 --block modifier', () => {
    const wrapper = mount(SkeletonButton, { props: { block: true } })
    expect(wrapper.classes()).toContain('ccui-skeleton-button--block')
  })

  it('active=true 应用 --active modifier（启用动画）', () => {
    const wrapper = mount(SkeletonButton, { props: { active: true } })
    expect(wrapper.classes()).toContain('ccui-skeleton-button--active')
  })

  it('aria-busy=true（无障碍占位标记）', () => {
    const wrapper = mount(SkeletonButton)
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })
})
