import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Rate } from '../index'

const ns = useNamespace('rate', true)
const baseClass = ns.b()
const iconClass = ns.e('icon')

describe('rate', () => {
  it('dom', async () => {
    const wrapper = shallowMount(Rate)

    expect(wrapper.find(baseClass).exists()).toBeTruthy()
    wrapper.unmount()
  })

  it('props', async () => {
    const wrapper = shallowMount(Rate, {
      props: {
        count: 10,
      },
    })

    expect(wrapper.findAll(iconClass).length).toBe(10)

    wrapper.unmount()
  })

  it('event', async () => {
    const wrapper = shallowMount(Rate, {
      props: {
        count: 10,
      },
    })

    expect(wrapper.findAll(iconClass).length).toBe(10)

    const threeIcon = wrapper.findAll(iconClass)[2]
    await threeIcon.trigger('click')
    // change 事件触发,icon 第三个 等于数字3
    expect(wrapper.emitted('change')?.[0]).toEqual([3])
    wrapper.unmount()
  })

  it('renders correct number of icons based on count prop', () => {
    const wrapper = mount(Rate, {
      props: {
        count: 5,
      },
    })

    expect(wrapper.findAll(iconClass).length).toBe(5)
  })

  it('applies correct width to icons based on modelValue', async () => {
    const wrapper = mount(Rate, {
      props: {
        modelValue: 3,
      },
    })

    // 等待组件更新
    await wrapper.vm.$nextTick()

    const icons = wrapper.findAll(iconClass)
    // 前三个图标应该是100%宽度
    expect(icons[0].find(ns.m('active')).attributes('style')).toContain('width: 100%')
    expect(icons[1].find(ns.m('active')).attributes('style')).toContain('width: 100%')
    expect(icons[2].find(ns.m('active')).attributes('style')).toContain('width: 100%')
    // 第四个图标应该是0%宽度
    expect(icons[3].find(ns.m('active')).attributes('style')).toContain('width: 0%')
  })

  it('emits change and update:modelValue events when clicked', async () => {
    const wrapper = mount(Rate, {
      props: {
        count: 5,
      },
    })

    const thirdIcon = wrapper.findAll(iconClass)[2]
    await thirdIcon.trigger('click')

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('change')?.[0]).toEqual([3])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
  })

  it('does not emit events when readOnly is true', async () => {
    const wrapper = mount(Rate, {
      props: {
        readOnly: true,
        count: 5,
      },
    })

    const thirdIcon = wrapper.findAll(iconClass)[2]
    await thirdIcon.trigger('click')

    expect(wrapper.emitted('change')).toBeFalsy()
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('applies custom color when provided', async () => {
    const wrapper = mount(Rate, {
      props: {
        modelValue: 3,
        color: '#ff0000',
      },
    })

    // 等待组件更新
    await wrapper.vm.$nextTick()

    const activeIcon = wrapper.find(ns.m('active'))
    // 检查是否包含颜色样式
    expect(activeIcon.attributes('style')).toContain('color: rgb(255, 0, 0)')
    expect(activeIcon.attributes('style')).toContain('#ff0000')
  })

  it('renders info slot when provided', () => {
    const wrapper = mount(Rate, {
      slots: {
        info: '<div class="info-slot">Info Content</div>',
      },
    })

    expect(wrapper.find('.info-slot').exists()).toBe(true)
    expect(wrapper.find('.info-slot').text()).toBe('Info Content')
  })

  it('resets icon state on mouse leave', async () => {
    const wrapper = mount(Rate, {
      props: {
        modelValue: 3,
      },
    })

    // 等待组件更新
    await wrapper.vm.$nextTick()

    // 模拟鼠标移动到第5个图标
    const fifthIcon = wrapper.findAll(iconClass)[4]
    await fifthIcon.trigger('mousemove')

    // 验证图标状态已更新
    const icons = wrapper.findAll(iconClass)
    expect(icons[4].find(ns.m('active')).attributes('style')).toContain('width: 100%')

    // 模拟鼠标离开
    await wrapper.trigger('mouseleave')

    // 验证图标状态重置为初始值
    expect(icons[4].find(ns.m('active')).attributes('style')).toContain('width: 0%')
  })
})
