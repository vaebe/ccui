import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Pagination } from '../index'

const ns = useNamespace('pagination', true)

describe('pagination', () => {
  it('renders correct number of pages when total is small', () => {
    const wrapper = mount(Pagination, {
      props: { current: 1, total: 50, pageSize: 10 },
    })
    expect(wrapper.findAll(ns.e('item')).length).toBe(5)
  })

  it('marks active page', () => {
    const wrapper = mount(Pagination, {
      props: { current: 3, total: 50, pageSize: 10 },
    })
    const active = wrapper.find(ns.em('item', 'active'))
    expect(active.exists()).toBe(true)
    expect(active.text()).toBe('3')
  })

  it('emits update:current on click', async () => {
    const wrapper = mount(Pagination, {
      props: { current: 1, total: 50, pageSize: 10 },
    })
    const items = wrapper.findAll(ns.e('item'))
    await items[2].trigger('click')
    expect(wrapper.emitted('update:current')?.[0]).toEqual([3])
    expect(wrapper.emitted('change')?.[0]).toEqual([3, 10])
  })

  it('disables prev button on first page', async () => {
    const wrapper = mount(Pagination, {
      props: { current: 1, total: 50, pageSize: 10 },
    })
    const prev = wrapper.find(ns.e('prev'))
    await prev.trigger('click')
    expect(wrapper.emitted('update:current')).toBeUndefined()
  })

  it('shows ellipsis when many pages', () => {
    const wrapper = mount(Pagination, {
      props: { current: 5, total: 200, pageSize: 10 },
    })
    expect(wrapper.findAll(ns.em('item', 'ellipsis')).length).toBe(2)
  })

  it('hides on single page when hideOnSinglePage is true', () => {
    const wrapper = mount(Pagination, {
      props: { current: 1, total: 5, pageSize: 10, hideOnSinglePage: true },
    })
    expect(wrapper.find(ns.b()).exists()).toBe(false)
  })

  it('renders size changer with options', () => {
    const wrapper = mount(Pagination, {
      props: { current: 1, total: 100, pageSize: 10, showSizeChanger: true },
    })
    const select = wrapper.find('select')
    expect(select.exists()).toBe(true)
    expect(select.findAll('option').length).toBe(4)
  })
})
