import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Menu } from '../index'

const ns = useNamespace('menu', true)

const items = [
  { key: '1', label: 'Home' },
  {
    key: '2',
    label: 'Group',
    children: [
      { key: '2-1', label: 'Sub 1' },
      { key: '2-2', label: 'Sub 2', disabled: true },
    ],
  },
  { key: 'd', type: 'divider' as const },
  { key: '3', label: 'About' },
]

describe('menu', () => {
  it('renders top-level items', () => {
    const wrapper = mount(Menu, { props: { items } })
    expect(wrapper.findAll(ns.e('item')).length).toBe(2)
    expect(wrapper.findAll(ns.e('submenu')).length).toBe(1)
    expect(wrapper.findAll(ns.e('divider')).length).toBe(1)
  })

  it('selects item on click', async () => {
    const wrapper = mount(Menu, { props: { items, selectedKeys: [] } })
    await wrapper.findAll(ns.e('item'))[0].trigger('click')
    expect(wrapper.emitted('select')?.[0][0]).toMatchObject({ key: '1', keyPath: ['1'], selectedKeys: ['1'] })
    expect(wrapper.emitted('update:selectedKeys')?.[0]).toEqual([['1']])
  })

  it('toggles submenu on title click', async () => {
    const wrapper = mount(Menu, { props: { items } })
    await wrapper.find(ns.e('submenu-title')).trigger('click')
    expect(wrapper.emitted('open-change')?.[0][0]).toEqual(['2'])
    expect(wrapper.emitted('open-change')?.[0][1]).toMatchObject({ key: '2', open: true, openKeys: ['2'] })
  })

  it('renders submenu children when open', async () => {
    const wrapper = mount(Menu, { props: { items, openKeys: ['2'] } })
    expect(wrapper.find(ns.e('sub')).exists()).toBe(true)
    expect(wrapper.findAll(ns.em('item', 'disabled')).length).toBe(1)
  })

  it('does not select on disabled item', async () => {
    const wrapper = mount(Menu, { props: { items, openKeys: ['2'] } })
    const disabled = wrapper.find(ns.em('item', 'disabled'))
    await disabled.trigger('click')
    expect(wrapper.emitted('update:selectedKeys')).toBeUndefined()
  })

  it('supports default selected and open keys', () => {
    const wrapper = mount(Menu, { props: { items, defaultSelectedKeys: ['3'], defaultOpenKeys: ['2'] } })
    expect(wrapper.findAll(ns.em('item', 'selected')).length).toBe(1)
    expect(wrapper.find(ns.e('sub')).exists()).toBe(true)
  })

  it('supports multiple select and deselect', async () => {
    const wrapper = mount(Menu, { props: { items, multiple: true, defaultSelectedKeys: ['1'] } })

    await wrapper.findAll(ns.e('item'))[1].trigger('click')
    expect(wrapper.emitted('update:selectedKeys')?.[0]).toEqual([['1', '3']])
    expect(wrapper.emitted('select')?.[0][0]).toMatchObject({ key: '3', selectedKeys: ['1', '3'] })

    await wrapper.findAll(ns.e('item'))[0].trigger('click')
    expect(wrapper.emitted('update:selectedKeys')?.[1]).toEqual([['3']])
    expect(wrapper.emitted('deselect')?.[0][0]).toMatchObject({ key: '1', selectedKeys: ['3'] })
  })

  it('emits click without selecting when selectable is false', async () => {
    const wrapper = mount(Menu, { props: { items, selectable: false } })

    await wrapper.findAll(ns.e('item'))[0].trigger('click')
    expect(wrapper.emitted('click')?.[0][0]).toMatchObject({ key: '1' })
    expect(wrapper.emitted('select')).toBeUndefined()
    expect(wrapper.emitted('update:selectedKeys')).toBeUndefined()
  })

  it('renders group danger and extra items', () => {
    const wrapper = mount(Menu, {
      props: {
        items: [
          {
            key: 'group',
            type: 'group',
            label: 'Group title',
            children: [
              { key: 'danger', label: 'Danger', danger: true, extra: 'Ctrl+K' },
              { key: 'normal', label: 'Normal' },
            ],
          },
        ],
      },
    })

    expect(wrapper.find(ns.e('group-title')).text()).toBe('Group title')
    expect(wrapper.find(ns.em('item', 'danger')).exists()).toBe(true)
    expect(wrapper.find(ns.e('extra')).text()).toBe('Ctrl+K')
  })

  it('supports hover submenu trigger', async () => {
    const wrapper = mount(Menu, { props: { items, triggerSubMenuAction: 'hover' } })

    await wrapper.find(ns.e('submenu')).trigger('mouseenter')
    expect(wrapper.emitted('open-change')?.[0][0]).toEqual(['2'])
  })

  it('supports keyboard selection', async () => {
    const wrapper = mount(Menu, { props: { items } })

    await wrapper.find(ns.b()).trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('select')?.[0][0]).toMatchObject({ key: '1' })
  })
})
