import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
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
})
