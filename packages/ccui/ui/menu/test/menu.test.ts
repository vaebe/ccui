import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
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

  it('applies mode theme collapsed disabled and multiple modifiers', () => {
    const wrapper = mount(Menu, {
      props: {
        items,
        mode: 'horizontal',
        theme: 'dark',
        collapsed: true,
        disabled: true,
        multiple: true,
      },
    })

    expect(wrapper.find(ns.m('horizontal')).exists()).toBe(true)
    expect(wrapper.find(ns.m('dark')).exists()).toBe(true)
    expect(wrapper.find(ns.m('collapsed')).exists()).toBe(true)
    expect(wrapper.find(ns.m('disabled')).exists()).toBe(true)
    expect(wrapper.find(ns.m('multiple')).exists()).toBe(true)
    expect(wrapper.find(ns.b()).attributes('aria-orientation')).toBe('horizontal')
    expect(wrapper.find(ns.b()).attributes('tabindex')).toBeUndefined()
  })

  it('does not select or open when menu is disabled', async () => {
    const wrapper = mount(Menu, {
      props: { items, disabled: true },
    })

    await wrapper.findAll(ns.e('item'))[0].trigger('click')
    await wrapper.find(ns.e('submenu-title')).trigger('click')

    expect(wrapper.emitted('select')).toBeUndefined()
    expect(wrapper.emitted('open-change')).toBeUndefined()
  })

  it('updates selected and open states from v-model prop changes', async () => {
    const wrapper = mount(Menu, {
      props: { items, selectedKeys: [], openKeys: [] },
    })

    expect(wrapper.find(ns.e('sub')).exists()).toBe(false)
    await wrapper.setProps({ selectedKeys: ['3'], openKeys: ['2'] })
    await nextTick()

    expect(wrapper.find(ns.e('sub')).exists()).toBe(true)
    expect(wrapper.findAll(ns.em('item', 'selected')).length).toBe(1)
    expect(wrapper.find(ns.em('item', 'selected')).text()).toContain('About')
  })

  it('uses inlineCollapsed over collapsed and hides inline submenu content', () => {
    const wrapper = mount(Menu, {
      props: { items, mode: 'inline', collapsed: false, inlineCollapsed: true, defaultOpenKeys: ['2'] },
    })

    expect(wrapper.find(ns.m('collapsed')).exists()).toBe(true)
    expect(wrapper.find(ns.e('sub')).exists()).toBe(false)
  })

  it('force renders hidden submenu content', () => {
    const wrapper = mount(Menu, {
      props: { items, forceSubMenuRender: true },
    })

    expect(wrapper.find(ns.e('sub')).exists()).toBe(true)
    expect(wrapper.find(ns.em('sub', 'hidden')).exists()).toBe(true)
  })

  it('closes hover submenu on mouse leave in non-inline mode', async () => {
    const wrapper = mount(Menu, {
      props: { items, mode: 'vertical', triggerSubMenuAction: 'hover', defaultOpenKeys: ['2'] },
    })

    await wrapper.find(ns.e('submenu')).trigger('mouseleave')

    expect(wrapper.emitted('open-change')?.[0]?.[0]).toEqual([])
    expect(wrapper.emitted('open-change')?.[0]?.[1]).toMatchObject({ key: '2', open: false, openKeys: [] })
  })

  it('keeps hover submenu open on mouse leave in inline mode', async () => {
    const wrapper = mount(Menu, {
      props: { items, mode: 'inline', triggerSubMenuAction: 'hover', defaultOpenKeys: ['2'] },
    })

    await wrapper.find(ns.e('submenu')).trigger('mouseleave')

    expect(wrapper.emitted('open-change')).toBeUndefined()
  })

  it('supports accordion submenu opening among siblings', async () => {
    const accordionItems = [
      { key: 'a', label: 'A', children: [{ key: 'a-1', label: 'A1' }] },
      { key: 'b', label: 'B', children: [{ key: 'b-1', label: 'B1' }] },
    ]
    const wrapper = mount(Menu, {
      props: { items: accordionItems, accordion: true, defaultOpenKeys: ['a'] },
    })

    await wrapper.findAll(ns.e('submenu-title'))[1].trigger('click')

    expect(wrapper.emitted('open-change')?.[0]?.[0]).toEqual(['b'])
  })

  it('moves active item with keyboard arrows and selects focused item', async () => {
    const wrapper = mount(Menu, { props: { items } })

    await wrapper.find(ns.b()).trigger('keydown', { key: 'ArrowDown' })
    await wrapper.find(ns.b()).trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    await wrapper.find(ns.b()).trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('select')?.[0][0]).toMatchObject({ key: '3', keyPath: ['3'] })
  })

  it('opens and closes submenu from keyboard arrows', async () => {
    const wrapper = mount(Menu, { props: { items } })

    await wrapper.find(ns.b()).trigger('keydown', { key: 'ArrowDown' })
    await wrapper.find(ns.b()).trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('open-change')?.[0]?.[0]).toEqual(['2'])

    await wrapper.find(ns.b()).trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('open-change')?.[1]?.[0]).toEqual([])
  })

  it('renders icon title and inline indent style', () => {
    const wrapper = mount(Menu, {
      props: {
        mode: 'inline',
        inlineIndent: 32,
        items: [{ key: 'with-icon', label: 'With icon', title: 'Custom title', icon: 'icon-home' }],
      },
    })

    const item = wrapper.find(ns.e('item'))
    expect(wrapper.find('.icon-home').exists()).toBe(true)
    expect(item.attributes('title')).toBe('Custom title')
    expect(item.attributes('style')).toContain('padding-inline-start: 32px')
  })

  it('renders default slot when items are empty', () => {
    const wrapper = mount(Menu, {
      slots: { default: '<li class="slot-item">Slot item</li>' },
    })

    expect(wrapper.find('.slot-item').text()).toBe('Slot item')
  })

  it('exposes aria roles for menu submenu and menubar', () => {
    const verticalWrapper = mount(Menu, { props: { items, defaultOpenKeys: ['2'] } })
    expect(verticalWrapper.find(ns.b()).attributes('role')).toBe('menu')
    expect(verticalWrapper.find(ns.b()).attributes('aria-orientation')).toBe('vertical')

    const submenuTitle = verticalWrapper.find(ns.e('submenu-title'))
    expect(submenuTitle.attributes('role')).toBe('menuitem')
    expect(submenuTitle.attributes('aria-haspopup')).toBe('menu')
    expect(submenuTitle.attributes('aria-expanded')).toBe('true')

    const horizontalWrapper = mount(Menu, { props: { items, mode: 'horizontal' } })
    expect(horizontalWrapper.find(ns.b()).attributes('role')).toBe('menubar')
    expect(horizontalWrapper.find(ns.b()).attributes('aria-orientation')).toBe('horizontal')
  })
})
