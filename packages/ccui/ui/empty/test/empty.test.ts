import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Empty } from '../index'

const ns = useNamespace('empty', true)

describe('empty', () => {
  it('renders default description', () => {
    const wrapper = mount(Empty)
    expect(wrapper.find(ns.b()).exists()).toBe(true)
    expect(wrapper.text()).toContain('暂无数据')
  })

  it('renders custom description', () => {
    const wrapper = mount(Empty, { props: { description: '空空如也' } })
    expect(wrapper.text()).toContain('空空如也')
  })

  it('renders custom image src', () => {
    const wrapper = mount(Empty, { props: { image: '/foo.png' } })
    expect(wrapper.find('img').attributes('src')).toBe('/foo.png')
  })

  it('renders footer slot', () => {
    const wrapper = mount(Empty, { slots: { default: '<button>retry</button>' } })
    expect(wrapper.find(ns.e('footer')).exists()).toBe(true)
    expect(wrapper.text()).toContain('retry')
  })
})
