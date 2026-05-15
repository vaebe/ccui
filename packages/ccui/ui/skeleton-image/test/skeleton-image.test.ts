import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { SkeletonImage } from '../index'

describe('skeleton-image', () => {
  it('默认渲染 span + base class + 内置 SVG 图标', () => {
    const wrapper = mount(SkeletonImage)
    expect(wrapper.classes()).toContain('ccui-skeleton-image')
    expect(wrapper.find('svg.ccui-skeleton-image__svg').exists()).toBe(true)
  })

  it('active=true 应用 --active modifier', () => {
    expect(mount(SkeletonImage, { props: { active: true } }).classes()).toContain('ccui-skeleton-image--active')
  })

  it('SVG 图标 viewBox 与尺寸正确', () => {
    const wrapper = mount(SkeletonImage)
    const svg = wrapper.find('svg.ccui-skeleton-image__svg')
    expect(svg.attributes('viewBox')).toBe('0 0 1098 1024')
    expect(svg.attributes('width')).toBe('48')
    expect(svg.attributes('height')).toBe('48')
  })

  it('aria-busy / aria-hidden 设置正确', () => {
    const wrapper = mount(SkeletonImage)
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })
})
