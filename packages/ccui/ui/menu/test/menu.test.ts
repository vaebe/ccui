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
    expect(wrapper.emitted('select')?.[0]).toEqual(['1'])
    expect(wrapper.emitted('update:selectedKeys')?.[0]).toEqual([['1']])
  })

  it('toggles submenu on title click', async () => {
    const wrapper = mount(Menu, { props: { items } })
    await wrapper.find(ns.e('submenu-title')).trigger('click')
    expect(wrapper.emitted('open-change')?.[0]).toEqual([['2']])
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
})
