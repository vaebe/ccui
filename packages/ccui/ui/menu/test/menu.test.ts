import { mount } from '@vue/test-utils'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Menu } from '../index'
import type { MenuInfo, MenuItem, MenuKey, MenuOpenInfo, MenuProps } from '../index'

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
  it('exports public props, item and event info types', () => {
    expectTypeOf<MenuProps['items']>().toEqualTypeOf<MenuItem[]>()
    expectTypeOf<MenuInfo['key']>().toEqualTypeOf<MenuKey>()
    expectTypeOf<MenuOpenInfo['open']>().toEqualTypeOf<boolean>()
  })

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

  it('invokes a normalized open-change listener exactly once', async () => {
    const onOpenChange = vi.fn()
    const wrapper = mount(Menu, { props: { items, onOpenChange } })

    await wrapper.find(ns.e('submenu-title')).trigger('click')

    expect(onOpenChange).toHaveBeenCalledTimes(1)
    expect(onOpenChange.mock.calls[0][0]).toEqual(['2'])
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

  it('disabled VNode label blocks nested native link navigation and delegated click', () => {
    const host = document.createElement('div')
    document.body.append(host)
    const delegatedClick = vi.fn()
    host.addEventListener('click', delegatedClick)
    const wrapper = mount(Menu, {
      attachTo: host,
      props: {
        items: [{ key: 'disabled-link', disabled: true, label: h('a', { href: '/admin' }, 'Admin') }],
      },
    })
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })

    wrapper.find('a').element.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(true)
    expect(delegatedClick).not.toHaveBeenCalled()
    expect(wrapper.emitted('click')).toBeUndefined()
    wrapper.unmount()
    host.remove()
  })

  it('disabled group/submenu propagates to descendants and capture blocks the target handler', async () => {
    const targetHandler = vi.fn()
    const disabledTree = [
      {
        key: 'group',
        type: 'group' as const,
        label: 'Disabled group',
        disabled: true,
        children: [{ key: 'group-child', label: h('button', { onClick: targetHandler }, 'Group child') }],
      },
      {
        key: 'submenu',
        label: 'Disabled submenu',
        disabled: true,
        children: [{ key: 'submenu-child', label: 'Submenu child' }],
      },
    ]
    const wrapper = mount(Menu, { props: { items: disabledTree, defaultOpenKeys: ['submenu'] } })

    const groupChild = wrapper.find('[data-menu-key="group-child"]')
    const submenuChild = wrapper.find('[data-menu-key="submenu-child"]')
    expect(groupChild.attributes('aria-disabled')).toBe('true')
    expect(submenuChild.attributes('aria-disabled')).toBe('true')

    await wrapper.find('button').trigger('click')
    await groupChild.trigger('keydown', { key: 'Enter' })
    await submenuChild.trigger('click')
    await submenuChild.trigger('keydown', { key: 'Enter' })
    await submenuChild.trigger('keydown', { key: ' ' })

    expect(targetHandler).not.toHaveBeenCalled()
    expect(wrapper.emitted('click')).toBeUndefined()
    expect(wrapper.emitted('select')).toBeUndefined()
    expect(wrapper.emitted('open-change')).toBeUndefined()
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

  it('uses roving tabindex and supports Home/End while skipping disabled items', async () => {
    const wrapper = mount(Menu, { props: { items, defaultOpenKeys: ['2'] } })
    const focusableItems = () => wrapper.findAll('[data-menu-key][tabindex="0"]')

    expect(wrapper.find(ns.b()).attributes('tabindex')).toBeUndefined()
    expect(focusableItems()).toHaveLength(1)
    expect(focusableItems()[0].attributes('data-menu-key')).toBe('1')

    await wrapper.find(ns.b()).trigger('keydown', { key: 'End' })
    await nextTick()
    expect(focusableItems()[0].attributes('data-menu-key')).toBe('3')

    await wrapper.find(ns.b()).trigger('keydown', { key: 'Home' })
    await nextTick()
    expect(focusableItems()[0].attributes('data-menu-key')).toBe('1')
  })

  it('Escape closes the nearest open submenu and returns roving focus to its title', async () => {
    const wrapper = mount(Menu, { props: { items, defaultOpenKeys: ['2'] } })

    await wrapper.find(ns.b()).trigger('keydown', { key: 'ArrowDown' })
    await wrapper.find(ns.b()).trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(wrapper.find('[data-menu-key="2-1"]').attributes('tabindex')).toBe('0')

    await wrapper.find(ns.b()).trigger('keydown', { key: 'Escape' })
    await nextTick()

    expect(wrapper.find(ns.e('sub')).exists()).toBe(false)
    expect(wrapper.find('[data-menu-key="2"]').attributes('tabindex')).toBe('0')
    expect(wrapper.emitted('open-change')?.at(-1)?.[0]).toEqual([])
  })

  it('horizontal arrows stay in menubar roots and ArrowDown enters submenu', async () => {
    const wrapper = mount(Menu, { props: { items, mode: 'horizontal' } })

    await wrapper.find(ns.b()).trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(wrapper.find('[data-menu-key="2"]').attributes('tabindex')).toBe('0')

    await wrapper.find(ns.b()).trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    await nextTick()
    expect(wrapper.find('[data-menu-key="2-1"]').attributes('tabindex')).toBe('0')

    await wrapper.find(ns.b()).trigger('keydown', { key: 'Escape' })
    await nextTick()
    await wrapper.find(ns.b()).trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(wrapper.find('[data-menu-key="3"]').attributes('tabindex')).toBe('0')
  })

  it('popup arrows stay among current siblings and horizontal switching replaces the open root', async () => {
    const popupItems = [
      {
        key: 'a',
        label: 'A',
        children: [
          { key: 'a-1', label: 'A1' },
          { key: 'a-2', label: 'A2', children: [{ key: 'a-2-1', label: 'A21' }] },
        ],
      },
      { key: 'b', label: 'B', children: [{ key: 'b-1', label: 'B1' }] },
    ]
    const wrapper = mount(Menu, { props: { items: popupItems, mode: 'horizontal', defaultOpenKeys: ['a'] } })

    await wrapper.find(ns.b()).trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(wrapper.find('[data-menu-key="a-1"]').attributes('tabindex')).toBe('0')

    await wrapper.find('[data-menu-key="a-1"]').trigger('keydown', { key: 'ArrowUp' })
    await nextTick()
    expect(wrapper.find('[data-menu-key="a-2"]').attributes('tabindex')).toBe('0')

    await wrapper.find('[data-menu-key="a-2"]').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(wrapper.find('[data-menu-key="a-1"]').attributes('tabindex')).toBe('0')

    await wrapper.find('[data-menu-key="a-1"]').trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    await nextTick()
    expect(wrapper.emitted('update:openKeys')?.at(-1)?.[0]).toEqual(['b'])
    expect(wrapper.find('[data-menu-key="b-1"]').attributes('tabindex')).toBe('0')
  })

  it('inline arrows follow visible flat order while popup arrows remain in the sibling layer', async () => {
    const nestedItems = [
      { key: 'before', label: 'Before' },
      {
        key: 'sub',
        label: 'Sub',
        children: [
          { key: 'child-1', label: 'Child 1' },
          { key: 'child-2', label: 'Child 2' },
        ],
      },
      { key: 'after', label: 'After' },
    ]
    const inline = mount(Menu, { props: { items: nestedItems, mode: 'inline', defaultOpenKeys: ['sub'] } })
    await inline.find(ns.b()).trigger('keydown', { key: 'ArrowDown' })
    await inline.find(ns.b()).trigger('keydown', { key: 'ArrowDown' })
    expect(inline.find('[data-menu-key="child-1"]').attributes('tabindex')).toBe('0')

    const popup = mount(Menu, { props: { items: nestedItems, mode: 'vertical', defaultOpenKeys: ['sub'] } })
    await popup.find(ns.b()).trigger('keydown', { key: 'ArrowDown' })
    await popup.find(ns.b()).trigger('keydown', { key: 'ArrowRight' })
    await popup.find('[data-menu-key="child-1"]').trigger('keydown', { key: 'ArrowUp' })
    expect(popup.find('[data-menu-key="child-2"]').attributes('tabindex')).toBe('0')
  })

  it('controlled horizontal focus waits for accepted openKeys and stays on the root when rejected', async () => {
    const controlledItems = [
      { key: 'a', label: 'A', children: [{ key: 'a-1', label: 'A1' }] },
      {
        key: 'b',
        label: 'B',
        children: [
          { key: 'b-1', label: 'B1' },
          { key: 'b-2', label: 'B2' },
        ],
      },
    ]
    const accepted = mount(Menu, {
      attachTo: document.body,
      props: { items: controlledItems, mode: 'horizontal', openKeys: ['a'] },
    })
    await accepted.find(ns.b()).trigger('keydown', { key: 'ArrowDown' })
    await accepted.find('[data-menu-key="a-1"]').trigger('keydown', { key: 'ArrowRight' })
    expect(accepted.find('[data-menu-key="b"]').attributes('tabindex')).toBe('0')
    expect(accepted.find('[data-menu-key="b-1"]').exists()).toBe(false)
    await accepted.find('[data-menu-key="b"]').trigger('keydown', { key: 'ArrowDown' })
    expect(accepted.emitted('update:openKeys')).toHaveLength(1)
    expect(accepted.emitted('update:openKeys')?.[0]?.[0]).toEqual(['b'])

    await accepted.setProps({ openKeys: ['b'] })
    await nextTick()
    await nextTick()
    expect(accepted.find('[data-menu-key="b-1"]').attributes('tabindex')).toBe('0')

    const rejected = mount(Menu, {
      attachTo: document.body,
      props: { items: controlledItems, mode: 'horizontal', openKeys: ['a'] },
    })
    await rejected.find(ns.b()).trigger('keydown', { key: 'ArrowDown' })
    await rejected.find('[data-menu-key="a-1"]').trigger('keydown', { key: 'ArrowRight' })
    await rejected.setProps({ openKeys: ['a'] })
    await nextTick()
    expect(rejected.find('[data-menu-key="b"]').attributes('tabindex')).toBe('0')
    expect(document.activeElement).toBe(rejected.find('[data-menu-key="b"]').element)
    expect(rejected.find('[data-menu-key="b-1"]').exists()).toBe(false)
    accepted.unmount()
    rejected.unmount()
  })

  it('a real external focus after controlled acceptance invalidates the queued child focus', async () => {
    const outside = document.createElement('button')
    document.body.appendChild(outside)
    const controlledItems = [
      { key: 'a', label: 'A', children: [{ key: 'a-1', label: 'A1' }] },
      { key: 'b', label: 'B', children: [{ key: 'b-1', label: 'B1' }] },
    ]
    const wrapper = mount(Menu, {
      attachTo: document.body,
      props: { items: controlledItems, mode: 'horizontal', openKeys: ['a'] },
    })
    await wrapper.find(ns.b()).trigger('keydown', { key: 'ArrowDown' })
    await wrapper.find('[data-menu-key="a-1"]').trigger('keydown', { key: 'ArrowRight' })

    await wrapper.setProps({ openKeys: ['b'] })
    outside.focus()
    await nextTick()
    await nextTick()

    expect(document.activeElement).toBe(outside)
    expect(wrapper.find('[data-menu-key="b"]').attributes('tabindex')).toBe('0')
    expect(wrapper.find('[data-menu-key="b-1"]').attributes('tabindex')).toBe('-1')
    wrapper.unmount()
    outside.remove()
  })

  it('horizontal title Down enters the first child and Up enters the last child', async () => {
    const titleItems = [
      {
        key: 'sub',
        label: 'Sub',
        children: [
          { key: 'first', label: 'First' },
          { key: 'last', label: 'Last' },
        ],
      },
    ]
    const down = mount(Menu, { props: { items: titleItems, mode: 'horizontal' } })
    await down.find(ns.b()).trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(down.find('[data-menu-key="first"]').attributes('tabindex')).toBe('0')

    const up = mount(Menu, { props: { items: titleItems, mode: 'horizontal' } })
    await up.find(ns.b()).trigger('keydown', { key: 'ArrowUp' })
    await nextTick()
    expect(up.find('[data-menu-key="last"]').attributes('tabindex')).toBe('0')
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
    expect(wrapper.find(ns.b()).attributes('tabindex')).toBe('0')
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

  it('controlled selectedKeys/openKeys only emit requests until parent props update', async () => {
    const wrapper = mount(Menu, { props: { items, selectedKeys: [], openKeys: [] } })

    await wrapper.findAll(ns.e('item'))[0].trigger('click')
    await wrapper.find(ns.e('submenu-title')).trigger('click')

    expect(wrapper.find(ns.em('item', 'selected')).exists()).toBe(false)
    expect(wrapper.find(ns.e('sub')).exists()).toBe(false)
    expect(wrapper.emitted('update:selectedKeys')?.at(-1)?.[0]).toEqual(['1'])
    expect(wrapper.emitted('update:openKeys')?.at(-1)?.[0]).toEqual(['2'])

    await wrapper.setProps({ selectedKeys: ['1'], openKeys: ['2'] })
    expect(wrapper.find(ns.em('item', 'selected')).exists()).toBe(true)
    expect(wrapper.find(ns.e('sub')).exists()).toBe(true)
  })

  it('dynamic items removal moves the roving tab stop to the next available item', async () => {
    const wrapper = mount(Menu, { props: { items } })
    await wrapper.find(ns.b()).trigger('keydown', { key: 'End' })
    expect(wrapper.find('[data-menu-key="3"]').attributes('tabindex')).toBe('0')

    await wrapper.setProps({ items: items.slice(0, 2) })
    await nextTick()

    expect(wrapper.findAll('[data-menu-key][tabindex="0"]')).toHaveLength(1)
    expect(wrapper.find('[data-menu-key="1"]').attributes('tabindex')).toBe('0')
  })

  it('dynamic disabled/removal chooses the same-level successor and falls back to the root when none remain', async () => {
    const dynamicItems = [
      { key: 'a', label: 'A' },
      { key: 'b', label: 'B' },
      { key: 'c', label: 'C' },
    ]
    const wrapper = mount(Menu, { props: { items: dynamicItems } })
    await wrapper.find(ns.b()).trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.find('[data-menu-key="b"]').attributes('tabindex')).toBe('0')

    await wrapper.setProps({ items: [dynamicItems[0], { ...dynamicItems[1], disabled: true }, dynamicItems[2]] })
    expect(wrapper.find('[data-menu-key="c"]').attributes('tabindex')).toBe('0')

    await wrapper.setProps({ items: [dynamicItems[0], { ...dynamicItems[1], disabled: true }] })
    expect(wrapper.find('[data-menu-key="a"]').attributes('tabindex')).toBe('0')

    await wrapper.setProps({ items: dynamicItems.map((item) => ({ ...item, disabled: true })) })
    expect(wrapper.findAll('[data-menu-key][tabindex="0"]')).toHaveLength(0)
    expect(wrapper.find(ns.b()).attributes('tabindex')).toBe('0')
    await wrapper.find('[data-menu-key="a"]').trigger('keydown', { key: 'Enter' })
    await wrapper.find('[data-menu-key="a"]').trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('dynamic tab-stop migration moves real focus only when focus was already inside Menu', async () => {
    const host = document.createElement('div')
    const outside = document.createElement('button')
    document.body.append(host, outside)
    const focusItems = [
      { key: 'a', label: 'A' },
      { key: 'b', label: 'B' },
      { key: 'c', label: 'C' },
    ]
    const wrapper = mount(Menu, { attachTo: host, props: { items: focusItems } })
    ;(wrapper.find('[data-menu-key="b"]').element as HTMLElement).focus()
    await wrapper.setProps({ items: [focusItems[0], { ...focusItems[1], disabled: true }, focusItems[2]] })
    await nextTick()
    expect(document.activeElement).toBe(wrapper.find('[data-menu-key="c"]').element)

    await wrapper.setProps({ items: [focusItems[0], { ...focusItems[1], disabled: true }] })
    await nextTick()
    expect(document.activeElement).toBe(wrapper.find('[data-menu-key="a"]').element)

    await wrapper.setProps({ items: focusItems.slice(0, 2).map((item) => ({ ...item, disabled: true })) })
    await nextTick()
    expect(document.activeElement).toBe(wrapper.find(ns.b()).element)

    await wrapper.setProps({ items: focusItems })
    await nextTick()
    outside.focus()
    await wrapper.setProps({ items: focusItems.map((item) => ({ ...item, disabled: true })) })
    await nextTick()
    expect(document.activeElement).toBe(outside)

    wrapper.unmount()
    host.remove()
    outside.remove()
  })

  it('external focus invalidates a queued dynamic replacement focus', async () => {
    const host = document.createElement('div')
    const outside = document.createElement('button')
    document.body.append(host, outside)
    const focusItems = [
      { key: 'a', label: 'A' },
      { key: 'b', label: 'B' },
      { key: 'c', label: 'C' },
    ]
    const wrapper = mount(Menu, { attachTo: host, props: { items: focusItems } })
    ;(wrapper.find('[data-menu-key="b"]').element as HTMLElement).focus()

    await wrapper.setProps({ items: [focusItems[0], { ...focusItems[1], disabled: true }, focusItems[2]] })
    outside.focus()
    await nextTick()

    expect(wrapper.find('[data-menu-key="c"]').attributes('tabindex')).toBe('0')
    expect(document.activeElement).toBe(outside)
    wrapper.unmount()
    host.remove()
    outside.remove()
  })

  it('unmount invalidates a queued dynamic replacement focus', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const focusItems = [
      { key: 'a', label: 'A' },
      { key: 'b', label: 'B' },
      { key: 'c', label: 'C' },
    ]
    const wrapper = mount(Menu, { attachTo: host, props: { items: focusItems } })
    ;(wrapper.find('[data-menu-key="b"]').element as HTMLElement).focus()
    const replacementFocus = vi.spyOn(wrapper.find('[data-menu-key="c"]').element as HTMLElement, 'focus')

    await wrapper.setProps({ items: [focusItems[0], { ...focusItems[1], disabled: true }, focusItems[2]] })
    wrapper.unmount()
    await nextTick()

    expect(replacementFocus).not.toHaveBeenCalled()
    host.remove()
  })

  it('warns for normalized duplicate keys and keeps keyboard lookup on the first item', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const duplicateItems = [
      { key: 1, label: 'First' },
      { key: '1', label: 'Second' },
    ]
    const wrapper = mount(Menu, { props: { items: duplicateItems } })

    expect(warning).toHaveBeenCalledWith(expect.stringContaining('duplicate normalized key "1"'))
    expect(wrapper.findAll('[data-menu-key="1"][tabindex="0"]')).toHaveLength(1)
    await wrapper.find(ns.b()).trigger('keydown', { key: 'ArrowDown' })
    await wrapper.find(ns.b()).trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('select')?.at(-1)?.[0]).toMatchObject({ item: duplicateItems[0] })
    warning.mockRestore()
  })

  it('business keys preserve item component identity across root reorder', async () => {
    let instance = 0
    const StatefulLabel = defineComponent({
      props: { name: { type: String, required: true } },
      setup(labelProps) {
        const id = ++instance
        return () => h('span', { class: `label-${labelProps.name}` }, `${labelProps.name}-${id}`)
      },
    })
    const keyedItems = [
      { key: 'a', label: h(StatefulLabel, { name: 'a' }) },
      { key: 'b', label: h(StatefulLabel, { name: 'b' }) },
    ]
    const wrapper = mount(Menu, { props: { items: keyedItems } })
    const aText = wrapper.find('.label-a').text()
    const bText = wrapper.find('.label-b').text()

    await wrapper.setProps({ items: [...keyedItems].reverse() })

    expect(wrapper.find('.label-a').text()).toBe(aText)
    expect(wrapper.find('.label-b').text()).toBe(bText)
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
    expect(wrapper.find(ns.b()).attributes('tabindex')).toBe('0')
  })

  it('slot-only role=menuitem supports roving boundaries and keyboard activation', async () => {
    const firstClick = vi.fn()
    const secondClick = vi.fn()
    const wrapper = mount(Menu, {
      slots: {
        default: () => [
          h('li', { role: 'menuitem', onClick: firstClick }, 'First'),
          h('li', { role: 'menuitem', onClick: secondClick }, 'Second'),
          h('li', { role: 'menuitem', 'aria-disabled': 'true' }, 'Disabled'),
        ],
      },
    })
    await nextTick()
    const menuitems = wrapper.findAll('[role="menuitem"]')
    expect(menuitems[0].attributes('tabindex')).toBe('0')
    expect(wrapper.find(ns.b()).attributes('tabindex')).toBeUndefined()

    await menuitems[0].trigger('keydown', { key: 'ArrowDown' })
    expect(menuitems[1].attributes('tabindex')).toBe('0')
    await menuitems[1].trigger('keydown', { key: 'Enter' })
    expect(secondClick).toHaveBeenCalledTimes(1)

    await menuitems[1].trigger('keydown', { key: 'Home' })
    expect(menuitems[0].attributes('tabindex')).toBe('0')
    await menuitems[0].trigger('keydown', { key: ' ' })
    expect(firstClick).toHaveBeenCalledTimes(1)
    expect(menuitems[2].attributes('tabindex')).toBe('-1')
  })

  it('slot-only disabled target never falls back to another item for Enter or Space', async () => {
    const enabledClick = vi.fn()
    const disabledClick = vi.fn()
    const wrapper = mount(Menu, {
      attachTo: document.body,
      slots: {
        default: () => [
          h('li', { role: 'menuitem', onClick: enabledClick }, 'Enabled'),
          h('li', { role: 'menuitem', 'aria-disabled': 'true', onClick: disabledClick }, 'Disabled'),
        ],
      },
    })
    await nextTick()
    const disabled = wrapper.find('[aria-disabled="true"]')

    await disabled.trigger('keydown', { key: ' ' })
    ;(disabled.element as HTMLElement).focus()
    await wrapper.find(ns.b()).trigger('keydown', { key: 'Enter' })

    expect(enabledClick).not.toHaveBeenCalled()
    expect(disabledClick).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('nested slot-only menus own only their nearest menuitems and stop handled keys at the inner root', async () => {
    const outerClick = vi.fn()
    const innerFirstClick = vi.fn()
    const innerSecondClick = vi.fn()
    const wrapper = mount(Menu, {
      slots: {
        default: () => [
          h('li', { role: 'menuitem', class: 'outer-item', onClick: outerClick }, 'Outer'),
          h(
            Menu,
            {},
            {
              default: () => [
                h('li', { role: 'menuitem', class: 'inner-first', onClick: innerFirstClick }, 'Inner first'),
                h('li', { role: 'menuitem', class: 'inner-second', onClick: innerSecondClick }, 'Inner second'),
              ],
            },
          ),
        ],
      },
    })
    await nextTick()
    await nextTick()

    expect(wrapper.find('.outer-item').attributes('tabindex')).toBe('0')
    expect(wrapper.find('.inner-first').attributes('tabindex')).toBe('0')
    await wrapper.find('.inner-first').trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.find('.inner-second').attributes('tabindex')).toBe('0')
    expect(wrapper.find('.outer-item').attributes('tabindex')).toBe('0')

    await wrapper.find('.inner-second').trigger('keydown', { key: 'Enter' })
    expect(innerSecondClick).toHaveBeenCalledTimes(1)
    expect(innerFirstClick).not.toHaveBeenCalled()
    expect(outerClick).not.toHaveBeenCalled()
  })

  it('exposes aria roles for menu submenu and menubar', () => {
    const verticalWrapper = mount(Menu, { props: { items, defaultOpenKeys: ['2'] } })
    expect(verticalWrapper.find(ns.b()).attributes('role')).toBe('menu')
    expect(verticalWrapper.find(ns.b()).attributes('aria-orientation')).toBe('vertical')

    const submenuTitle = verticalWrapper.find(ns.e('submenu-title'))
    expect(submenuTitle.attributes('role')).toBe('menuitem')
    expect(submenuTitle.attributes('aria-haspopup')).toBe('menu')
    expect(submenuTitle.attributes('aria-expanded')).toBe('true')
    expect(verticalWrapper.findAll('[role="menuitemradio"]')).not.toHaveLength(0)
    expect(verticalWrapper.find('[role="menuitemradio"]').attributes('aria-checked')).toBe('false')
    expect(verticalWrapper.find('[aria-selected]').exists()).toBe(false)

    const multipleWrapper = mount(Menu, { props: { items, multiple: true, defaultSelectedKeys: ['1'] } })
    expect(multipleWrapper.find('[role="menuitemcheckbox"]').attributes('aria-checked')).toBe('true')

    const horizontalWrapper = mount(Menu, { props: { items, mode: 'horizontal' } })
    expect(horizontalWrapper.find(ns.b()).attributes('role')).toBe('menubar')
    expect(horizontalWrapper.find(ns.b()).attributes('aria-orientation')).toBe('horizontal')
  })
})
