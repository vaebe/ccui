import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { List } from '../index'

const ns = useNamespace('list', true)

describe('list', () => {
  it('renders dataSource items', () => {
    const wrapper = mount(List, {
      props: { dataSource: ['A', 'B', 'C'] },
      slots: {
        renderItem: ({ item }: { item: string }) => h('span', { class: 'cell' }, item),
      },
    })
    expect(wrapper.findAll(ns.e('item')).length).toBe(3)
    expect(wrapper.findAll('.cell').map((w) => w.text())).toEqual(['A', 'B', 'C'])
  })

  it('renders empty placeholder', () => {
    const wrapper = mount(List, {
      props: { dataSource: [] },
    })
    expect(wrapper.find(ns.e('empty')).exists()).toBe(true)
    expect(wrapper.text()).toContain('暂无数据')
  })

  it('shows loading overlay', () => {
    const wrapper = mount(List, {
      props: { dataSource: ['A'], loading: true },
      slots: { renderItem: () => h('span', 'A') },
    })
    expect(wrapper.find(ns.e('loading-overlay')).exists()).toBe(true)
  })

  it('applies bordered modifier', () => {
    const wrapper = mount(List, {
      props: { dataSource: [1], bordered: true },
      slots: { renderItem: () => h('span', '1') },
    })
    expect(wrapper.find(ns.m('bordered')).exists()).toBe(true)
  })

  it('renders header and footer', () => {
    const wrapper = mount(List, {
      props: { dataSource: [] },
      slots: {
        header: () => h('div', { class: 'h' }, 'Header'),
        footer: () => h('div', { class: 'f' }, 'Footer'),
      },
    })
    expect(wrapper.find('.h').text()).toBe('Header')
    expect(wrapper.find('.f').text()).toBe('Footer')
  })
})
