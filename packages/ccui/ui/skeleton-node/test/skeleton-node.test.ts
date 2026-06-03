import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { SkeletonNode } from '../index'

describe('skeleton-node', () => {
  it('默认渲染 span + base class + 默认尺寸', () => {
    const wrapper = mount(SkeletonNode)
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.classes()).toContain('ccui-skeleton-node')
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('width: 160px')
    expect(style).toContain('height: 96px')
  })

  it('width / height 接受 number 转 px', () => {
    const wrapper = mount(SkeletonNode, { props: { width: 200, height: 80 } })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('width: 200px')
    expect(style).toContain('height: 80px')
  })

  it('width / height 接受 css 字符串原样输出', () => {
    const wrapper = mount(SkeletonNode, { props: { width: '50%', height: '10rem' } })
    const style = wrapper.attributes('style') ?? ''
    expect(style).toContain('width: 50%')
    expect(style).toContain('height: 10rem')
  })

  it('default slot 渲染于占位内部', () => {
    const wrapper = mount(SkeletonNode, {
      slots: { default: '<svg class="my-icon" />' },
    })
    expect(wrapper.find('.my-icon').exists()).toBe(true)
  })

  it('active=true 应用 --active modifier', () => {
    expect(mount(SkeletonNode, { props: { active: true } }).classes()).toContain('ccui-skeleton-node--active')
  })
})
