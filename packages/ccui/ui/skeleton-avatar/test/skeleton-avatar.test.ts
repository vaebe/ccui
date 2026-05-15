import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { SkeletonAvatar } from '../index'

describe('skeleton-avatar', () => {
  it('默认 circle 形态 + base class', () => {
    const wrapper = mount(SkeletonAvatar)
    expect(wrapper.classes()).toContain('ccui-skeleton-avatar')
    // 默认 circle 不上 modifier
    expect(wrapper.classes()).not.toContain('ccui-skeleton-avatar--square')
  })

  it('size 字符串档位走 modifier class', () => {
    expect(mount(SkeletonAvatar, { props: { size: 'large' } }).classes()).toContain('ccui-skeleton-avatar--large')
    expect(mount(SkeletonAvatar, { props: { size: 'small' } }).classes()).toContain('ccui-skeleton-avatar--small')
  })

  it('size number 走 inline style（width/height/minWidth）', () => {
    const wrapper = mount(SkeletonAvatar, { props: { size: 64 } })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('width: 64px')
    expect(style).toContain('height: 64px')
    expect(style).toContain('min-width: 64px')
    // number 不走 modifier
    expect(wrapper.classes()).not.toContain('ccui-skeleton-avatar--64')
  })

  it('shape=square 应用 --square modifier', () => {
    const wrapper = mount(SkeletonAvatar, { props: { shape: 'square' } })
    expect(wrapper.classes()).toContain('ccui-skeleton-avatar--square')
  })

  it('active=true 应用 --active modifier', () => {
    const wrapper = mount(SkeletonAvatar, { props: { active: true } })
    expect(wrapper.classes()).toContain('ccui-skeleton-avatar--active')
  })

  it('aria-busy / aria-hidden 设置正确', () => {
    const wrapper = mount(SkeletonAvatar)
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })
})
