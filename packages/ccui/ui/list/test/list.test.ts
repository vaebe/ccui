import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { List, ListItem } from '../index'

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

  it('renders loadMore slot with footer area', () => {
    const wrapper = mount(List, {
      props: { dataSource: [] },
      slots: {
        loadMore: () => h('button', { class: 'more' }, 'More'),
      },
    })

    expect(wrapper.find(ns.e('footer')).exists()).toBe(true)
    expect(wrapper.find('.more').text()).toBe('More')
  })

  it('applies size layout itemLayout and split modifiers', () => {
    const wrapper = mount(List, {
      props: {
        dataSource: [{ id: 1, title: 'A' }],
        size: 'small',
        layout: 'vertical',
        itemLayout: 'vertical',
        split: false,
        rowKey: 'id',
      },
      slots: {
        renderItem: ({ item }: { item: { title: string } }) => h('span', item.title),
      },
    })

    expect(wrapper.find(ns.m('small')).exists()).toBe(true)
    expect(wrapper.find(ns.m('layout-vertical')).exists()).toBe(true)
    expect(wrapper.find(ns.m('item-vertical')).exists()).toBe(true)
    expect(wrapper.find(ns.m('split')).exists()).toBe(false)
    expect(wrapper.text()).toContain('A')
  })

  it('supports function rowKey and render item index', () => {
    const wrapper = mount(List, {
      props: {
        dataSource: [{ id: 1, title: 'A' }],
        rowKey: (item: unknown, index: number) => `${(item as { id: number }).id}-${index}`,
      },
      slots: {
        renderItem: ({ index }: { index: number }) => h('span', { class: 'index' }, index),
      },
    })

    expect(wrapper.find('.index').text()).toBe('0')
  })

  it('renders custom empty slot', () => {
    const wrapper = mount(List, {
      props: { dataSource: [] },
      slots: {
        empty: () => h('span', { class: 'empty-slot' }, 'No items'),
      },
    })

    expect(wrapper.find('.empty-slot').text()).toBe('No items')
  })

  it('renders list item composed slots', () => {
    const wrapper = mount(ListItem, {
      slots: {
        avatar: () => h('img', { class: 'avatar' }),
        title: () => h('span', 'Title'),
        description: () => h('span', 'Description'),
        default: () => h('span', 'Content'),
        actions: () => h('button', { class: 'action' }, 'Action'),
        extra: () => h('span', { class: 'extra' }, 'Extra'),
      },
    })

    expect(wrapper.find(ns.e('item-avatar')).exists()).toBe(true)
    expect(wrapper.find(ns.e('item-title')).text()).toBe('Title')
    expect(wrapper.find(ns.e('item-desc')).text()).toBe('Description')
    expect(wrapper.find(ns.e('item-content')).text()).toBe('Content')
    expect(wrapper.find('.action').exists()).toBe(true)
    expect(wrapper.find('.extra').exists()).toBe(true)
  })
})
