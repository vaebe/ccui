import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { FormErrorList } from '../index'

describe('form-error-list', () => {
  it('errors 列表渲染为 ul > li', () => {
    const wrapper = mount(FormErrorList, {
      props: { errors: ['必填项', '至少 4 字符'] },
    })
    expect(wrapper.element.tagName).toBe('UL')
    expect(wrapper.classes()).toContain('ccui-form-error-list')
    const items = wrapper.findAll('.ccui-form-error-list__item')
    expect(items).toHaveLength(2)
    expect(items[0].text()).toBe('必填项')
    expect(items[1].text()).toBe('至少 4 字符')
  })

  it('错误项 modifier class --error', () => {
    const wrapper = mount(FormErrorList, { props: { errors: ['错误'] } })
    expect(wrapper.find('.ccui-form-error-list__item--error').exists()).toBe(true)
  })

  it('warnings 列表渲染 + --warning modifier', () => {
    const wrapper = mount(FormErrorList, { props: { warnings: ['强度较弱'] } })
    expect(wrapper.find('.ccui-form-error-list__item--warning').exists()).toBe(true)
    expect(wrapper.find('.ccui-form-error-list__item').text()).toBe('强度较弱')
  })

  it('errors + warnings 同时存在：errors 先 warnings 后', () => {
    const wrapper = mount(FormErrorList, {
      props: { errors: ['e1'], warnings: ['w1'] },
    })
    const items = wrapper.findAll('.ccui-form-error-list__item')
    expect(items).toHaveLength(2)
    expect(items[0].text()).toBe('e1')
    expect(items[0].classes()).toContain('ccui-form-error-list__item--error')
    expect(items[1].text()).toBe('w1')
    expect(items[1].classes()).toContain('ccui-form-error-list__item--warning')
  })

  it('help 在 errors / warnings 都为空时显示', () => {
    const wrapper = mount(FormErrorList, { props: { help: '请输入用户名' } })
    expect(wrapper.find('.ccui-form-error-list__item--help').exists()).toBe(true)
    expect(wrapper.find('.ccui-form-error-list__item').text()).toBe('请输入用户名')
  })

  it('help 在 errors 非空时不显示（被错误抢走优先级）', () => {
    const wrapper = mount(FormErrorList, {
      props: { errors: ['错误'], help: '辅助' },
    })
    const items = wrapper.findAll('.ccui-form-error-list__item')
    expect(items).toHaveLength(1)
    expect(items[0].classes()).toContain('ccui-form-error-list__item--error')
  })

  it('全部为空时不渲染（返回 null）', () => {
    const wrapper = mount(FormErrorList)
    // Vue mounted null → 注释占位 / 空 element
    expect(wrapper.find('ul').exists()).toBe(false)
  })

  it('a11y：role=alert + aria-live=polite', () => {
    const wrapper = mount(FormErrorList, { props: { errors: ['错误'] } })
    expect(wrapper.attributes('role')).toBe('alert')
    expect(wrapper.attributes('aria-live')).toBe('polite')
  })

  it('errors prop 动态变化时列表 reactive 更新', async () => {
    const wrapper = mount(FormErrorList, { props: { errors: ['第一条'] } })
    expect(wrapper.findAll('.ccui-form-error-list__item')).toHaveLength(1)
    await wrapper.setProps({ errors: ['第一条', '第二条', '第三条'] })
    expect(wrapper.findAll('.ccui-form-error-list__item')).toHaveLength(3)
    await wrapper.setProps({ errors: [] })
    expect(wrapper.find('ul').exists()).toBe(false)
  })
})
