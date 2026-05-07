import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Collapse, CollapseItem } from '../index'

const ns = useNamespace('collapse', true)

function makeWrapper(props: Record<string, unknown> = {}) {
  return mount(Collapse, {
    props,
    slots: {
      default: () => [
        h(CollapseItem, { name: '1', title: 'Panel 1' }, { default: () => 'Content 1' }),
        h(CollapseItem, { name: '2', title: 'Panel 2' }, { default: () => 'Content 2' }),
        h(CollapseItem, { name: '3', title: 'Panel 3', disabled: true }, { default: () => 'Content 3' }),
      ],
    },
  })
}

describe('collapse', () => {
  it('renders all items', () => {
    const wrapper = makeWrapper({ modelValue: [] })
    expect(wrapper.findAll(ns.e('item')).length).toBe(3)
  })

  it('marks active item', () => {
    const wrapper = makeWrapper({ modelValue: ['1'] })
    expect(wrapper.findAll(ns.em('item', 'active')).length).toBe(1)
  })

  it('toggles on click', async () => {
    const wrapper = makeWrapper({ modelValue: [] })
    await wrapper.findAll(ns.e('header'))[0].trigger('click')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeDefined()
    expect(emitted?.[0]?.[0]).toEqual(['1'])
  })

  it('respects accordion mode', async () => {
    const wrapper = makeWrapper({ modelValue: '1', accordion: true })
    await wrapper.findAll(ns.e('header'))[1].trigger('click')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted?.[0]?.[0]).toEqual('2')
  })

  it('does not toggle disabled item', async () => {
    const wrapper = makeWrapper({ modelValue: [] })
    await wrapper.findAll(ns.e('header'))[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('exposes aria state and keeps disabled headers out of keyboard flow', async () => {
    const wrapper = makeWrapper({ modelValue: ['1'] })
    const headers = wrapper.findAll(ns.e('header'))

    expect(headers[0].attributes('role')).toBe('tab')
    expect(headers[0].attributes('aria-expanded')).toBe('true')
    expect(headers[0].attributes('tabindex')).toBe('0')
    expect(headers[1].attributes('aria-expanded')).toBe('false')
    expect(headers[2].attributes('tabindex')).toBe('-1')

    await headers[2].trigger('keydown', { key: 'Enter' })
    await headers[2].trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('emits change when toggling an active item closed', async () => {
    const wrapper = makeWrapper({ modelValue: ['1', '2'] })
    await wrapper.findAll(ns.e('header'))[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual(['2'])
    expect(wrapper.emitted('change')?.[0]?.[0]).toEqual(['2'])
  })

  it('toggles with keyboard enter and space', async () => {
    const wrapper = makeWrapper({ modelValue: [] })

    await wrapper.findAll(ns.e('header'))[0].trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual(['1'])

    await wrapper.setProps({ modelValue: ['1'] })
    await wrapper.findAll(ns.e('header'))[0].trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('update:modelValue')?.[1]?.[0]).toEqual([])
  })

  it('updates active item when modelValue prop changes', async () => {
    const wrapper = makeWrapper({ modelValue: [] })
    expect(wrapper.findAll(ns.em('item', 'active')).length).toBe(0)

    await wrapper.setProps({ modelValue: ['2'] })
    await nextTick()

    expect(wrapper.findAll(ns.em('item', 'active')).length).toBe(1)
    expect(wrapper.findAll(ns.e('content'))[0].text()).toBe('Content 2')
  })

  it('supports accordion close to empty value', async () => {
    const wrapper = makeWrapper({ modelValue: '1', accordion: true })
    await wrapper.findAll(ns.e('header'))[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('')
    expect(wrapper.emitted('change')?.[0]?.[0]).toBe('')
  })

  it('applies borderless ghost and icon end modifiers', () => {
    const wrapper = makeWrapper({ modelValue: [], bordered: false, ghost: true, expandIconPosition: 'end' })
    expect(wrapper.find(ns.m('borderless')).exists()).toBe(true)
    expect(wrapper.find(ns.m('ghost')).exists()).toBe(true)
    expect(wrapper.find(ns.m('icon-end')).exists()).toBe(true)
  })

  it('renders custom title slot and hides arrow', () => {
    const wrapper = mount(Collapse, {
      props: { modelValue: ['custom'] },
      slots: {
        default: () =>
          h(
            CollapseItem,
            { name: 'custom', showArrow: false },
            {
              title: () => h('span', { class: 'custom-title' }, 'Custom Title'),
              default: () => 'Custom Content',
            },
          ),
      },
    })

    expect(wrapper.find('.custom-title').text()).toBe('Custom Title')
    expect(wrapper.find(ns.e('arrow')).exists()).toBe(false)
    expect(wrapper.find(ns.e('content')).text()).toBe('Custom Content')
  })
})
