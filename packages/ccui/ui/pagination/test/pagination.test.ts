import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { ConfigProvider } from '../../config-provider'
import enUS from '../../locale/en-US'
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

  it('emits next and prev page changes', async () => {
    const wrapper = mount(Pagination, {
      props: { current: 2, total: 50, pageSize: 10 },
    })

    await wrapper.find(ns.e('prev')).trigger('click')
    expect(wrapper.emitted('update:current')?.[0]).toEqual([1])

    await wrapper.find(ns.e('next')).trigger('click')
    expect(wrapper.emitted('update:current')?.[1]).toEqual([2])
  })

  it('does not emit next on last page or when disabled', async () => {
    const wrapper = mount(Pagination, {
      props: { current: 5, total: 50, pageSize: 10 },
    })

    await wrapper.find(ns.e('next')).trigger('click')
    expect(wrapper.emitted('update:current')).toBeUndefined()

    await wrapper.setProps({ current: 2, disabled: true })
    await wrapper.find(ns.e('next')).trigger('click')
    expect(wrapper.find(ns.m('disabled')).exists()).toBe(true)
    expect(wrapper.emitted('update:current')).toBeUndefined()
  })

  it('renders early and late ellipsis page ranges', () => {
    const early = mount(Pagination, {
      props: { current: 2, total: 200, pageSize: 10 },
    })
    const late = mount(Pagination, {
      props: { current: 18, total: 200, pageSize: 10 },
    })

    expect(early.findAll(ns.em('item', 'ellipsis')).length).toBe(1)
    expect(late.findAll(ns.em('item', 'ellipsis')).length).toBe(1)
  })

  it('changes page size and clamps current page', async () => {
    const wrapper = mount(Pagination, {
      props: {
        current: 10,
        total: 100,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: [10, 50],
      },
    })

    await wrapper.find('select').setValue('50')
    expect(wrapper.emitted('update:pageSize')?.[0]).toEqual([50])
    expect(wrapper.emitted('update:current')?.[0]).toEqual([2])
    expect(wrapper.emitted('change')?.[0]).toEqual([2, 50])
  })

  it('ignores unchanged or invalid page size values', async () => {
    const wrapper = mount(Pagination, {
      props: { current: 1, total: 100, pageSize: 10, showSizeChanger: true },
    })
    const select = wrapper.find('select')

    await select.setValue('10')
    expect(wrapper.emitted('update:pageSize')).toBeUndefined()
  })

  it('renders quick jumper and handles enter key', async () => {
    const wrapper = mount(Pagination, {
      props: { current: 1, total: 100, pageSize: 10, showQuickJumper: true },
    })
    const input = wrapper.find(ns.e('jumper-input'))

    await input.setValue('4')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:current')?.[0]).toEqual([4])

    await input.setValue('-1')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:current')?.length).toBe(1)
  })

  it('renders simple mode and handles simple input change', async () => {
    const wrapper = mount(Pagination, {
      props: { current: 1, total: 100, pageSize: 10, simple: true, size: 'small' },
    })

    expect(wrapper.find(ns.m('simple')).exists()).toBe(true)
    expect(wrapper.find(ns.m('small')).exists()).toBe(true)
    await wrapper.find(ns.e('simple-input')).setValue('3')
    await wrapper.find(ns.e('simple-input')).trigger('change')
    expect(wrapper.emitted('update:current')?.[0]).toEqual([3])
  })

  it('renders zhCN locale by default for total / size-changer / jumper / aria-label', () => {
    const wrapper = mount(Pagination, {
      props: {
        current: 2,
        total: 25,
        pageSize: 10,
        showTotal: true,
        showSizeChanger: true,
        showQuickJumper: true,
      },
    })
    expect(wrapper.find(ns.e('total-text')).text()).toBe('共 25 条')
    expect(wrapper.find('option').text()).toBe('10 条/页')
    expect(wrapper.find(ns.e('jumper')).text()).toContain('跳至')
    expect(wrapper.find(ns.e('jumper')).text()).toContain('页')
    expect(wrapper.find(ns.e('prev')).attributes('aria-label')).toBe('上一页')
    expect(wrapper.find(ns.e('next')).attributes('aria-label')).toBe('下一页')
  })

  it('switches to enUS locale via ConfigProvider', () => {
    const wrapper = mount({
      components: { ConfigProvider, Pagination },
      data() {
        return { enUS }
      },
      template: `
        <ConfigProvider :locale="enUS">
          <Pagination :current="2" :total="25" :page-size="10" :show-total="true" :show-size-changer="true" :show-quick-jumper="true" />
        </ConfigProvider>
      `,
    })
    expect(wrapper.find(ns.e('total-text')).text()).toBe('Total 25 items')
    expect(wrapper.find('option').text()).toBe('10 / page')
    expect(wrapper.find(ns.e('jumper')).text()).toContain('Go to')
    expect(wrapper.find(ns.e('prev')).attributes('aria-label')).toBe('Previous Page')
    expect(wrapper.find(ns.e('next')).attributes('aria-label')).toBe('Next Page')
  })

  it('renders total and custom prev next slots', () => {
    const wrapper = mount(Pagination, {
      props: {
        current: 2,
        total: 25,
        pageSize: 10,
        showTotal: (total: number, range: [number, number]) => `${range[0]}-${range[1]} / ${total}`,
      },
      slots: {
        prev: '<span class="prev-slot">Prev</span>',
        next: '<span class="next-slot">Next</span>',
      },
    })

    expect(wrapper.find(ns.e('total-text')).text()).toBe('11-20 / 25')
    expect(wrapper.find('.prev-slot').exists()).toBe(true)
    expect(wrapper.find('.next-slot').exists()).toBe(true)
  })
})
