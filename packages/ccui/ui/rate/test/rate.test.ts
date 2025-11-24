import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Rate } from '../index'

const ns = useNamespace('rate', true)
const baseClass = ns.b()
const iconClass = ns.e('icon')

// 测试辅助函数
function createWrapper(props = {}, slots = {}) {
  return mount(Rate, { props, slots })
}

function createShallowWrapper(props = {}) {
  return shallowMount(Rate, { props })
}

describe('rate', () => {
  it('dom', async () => {
    const wrapper = createShallowWrapper()
    expect(wrapper.find(baseClass).exists()).toBeTruthy()
    wrapper.unmount()
  })

  it('props', async () => {
    const wrapper = createShallowWrapper({ count: 10 })
    expect(wrapper.findAll(iconClass).length).toBe(10)
    wrapper.unmount()
  })

  it('event', async () => {
    const wrapper = createShallowWrapper({ count: 10 })
    expect(wrapper.findAll(iconClass).length).toBe(10)

    const threeIcon = wrapper.findAll(iconClass)[2]
    await threeIcon.trigger('click')
    expect(wrapper.emitted('change')?.[0]).toEqual([3])
    wrapper.unmount()
  })

  it('renders correct number of icons based on count prop', () => {
    const wrapper = createWrapper({ count: 5 })
    expect(wrapper.findAll(iconClass).length).toBe(5)
  })

  it('applies correct width to icons based on modelValue', async () => {
    const wrapper = createWrapper({ modelValue: 3 })
    await wrapper.vm.$nextTick()

    const icons = wrapper.findAll(iconClass)
    expect(icons[0].find(ns.m('active')).attributes('style')).toContain('width: 100%')
    expect(icons[1].find(ns.m('active')).attributes('style')).toContain('width: 100%')
    expect(icons[2].find(ns.m('active')).attributes('style')).toContain('width: 100%')
    expect(icons[3].find(ns.m('active')).attributes('style')).toContain('width: 0%')
  })

  it('emits change and update:modelValue events when clicked', async () => {
    const wrapper = createWrapper({ count: 5 })
    const thirdIcon = wrapper.findAll(iconClass)[2]
    await thirdIcon.trigger('click')

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('change')?.[0]).toEqual([3])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
  })

  it('does not emit events when readOnly is true', async () => {
    const wrapper = createWrapper({ readOnly: true, count: 5 })
    const thirdIcon = wrapper.findAll(iconClass)[2]
    await thirdIcon.trigger('click')

    expect(wrapper.emitted('change')).toBeFalsy()
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('applies custom color when provided', async () => {
    const wrapper = createWrapper({ modelValue: 3, color: '#ff0000' })
    await wrapper.vm.$nextTick()

    const activeIcon = wrapper.find(ns.m('active'))
    expect(activeIcon.attributes('style')).toContain('color: rgb(255, 0, 0)')
    expect(activeIcon.attributes('style')).toContain('#ff0000')
  })

  it('renders info slot when provided', () => {
    const wrapper = createWrapper({}, {
      info: '<div class="info-slot">Info Content</div>',
    })

    expect(wrapper.find('.info-slot').exists()).toBe(true)
    expect(wrapper.find('.info-slot').text()).toBe('Info Content')
  })

  it('resets icon state on mouse leave', async () => {
    const wrapper = createWrapper({ modelValue: 3 })
    await wrapper.vm.$nextTick()

    const fifthIcon = wrapper.findAll(iconClass)[4]
    await fifthIcon.trigger('mousemove')

    const icons = wrapper.findAll(iconClass)
    expect(icons[4].find(ns.m('active')).attributes('style')).toContain('width: 100%')

    await wrapper.trigger('mouseleave')
    expect(icons[4].find(ns.m('active')).attributes('style')).toContain('width: 0%')
  })
})
