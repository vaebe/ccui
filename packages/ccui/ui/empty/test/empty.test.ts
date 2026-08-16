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

  it('forwards root attrs and keeps custom image decorative', () => {
    const wrapper = mount(Empty, {
      attrs: { 'data-testid': 'empty', 'aria-live': 'polite' },
      props: { image: '/empty.png' },
    })

    expect(wrapper.attributes('data-testid')).toBe('empty')
    expect(wrapper.attributes('aria-live')).toBe('polite')
    expect(wrapper.find('img').attributes('alt')).toBe('')
  })

  it('renders image slot instead of the image prop', () => {
    const wrapper = mount(Empty, {
      props: { image: '/unused.png' },
      slots: { image: '<span class="custom-image">custom</span>' },
    })

    expect(wrapper.find('.custom-image').exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(false)
  })
})
