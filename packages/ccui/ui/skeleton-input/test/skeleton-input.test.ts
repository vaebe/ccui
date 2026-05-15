import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { SkeletonInput } from '../index'

describe('skeleton-input', () => {
  it('默认渲染 span + base class', () => {
    const wrapper = mount(SkeletonInput)
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.classes()).toContain('ccui-skeleton-input')
  })

  it('size large / small 应用 modifier class', () => {
    expect(mount(SkeletonInput, { props: { size: 'large' } }).classes()).toContain('ccui-skeleton-input--large')
    expect(mount(SkeletonInput, { props: { size: 'small' } }).classes()).toContain('ccui-skeleton-input--small')
  })

  it('size=default 不上 modifier', () => {
    expect(mount(SkeletonInput).classes()).not.toContain('ccui-skeleton-input--default')
  })

  it('block=true 应用 --block modifier', () => {
    expect(mount(SkeletonInput, { props: { block: true } }).classes()).toContain('ccui-skeleton-input--block')
  })

  it('active=true 应用 --active modifier', () => {
    expect(mount(SkeletonInput, { props: { active: true } }).classes()).toContain('ccui-skeleton-input--active')
  })
})
