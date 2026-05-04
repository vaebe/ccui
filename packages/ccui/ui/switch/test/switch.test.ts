import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Switch } from '../index'

const ns = useNamespace('switch', true)

describe('switch', () => {
  it('toggles modelValue on click', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })

  it('reflects checked modifier', () => {
    const wrapper = mount(Switch, { props: { modelValue: true } })
    expect(wrapper.find(ns.m('checked')).exists()).toBe(true)
  })

  it('does not trigger when disabled', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false, disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('renders checked children slot', () => {
    const wrapper = mount(Switch, {
      props: { modelValue: true },
      slots: { checkedChildren: 'ON' },
    })
    expect(wrapper.text()).toContain('ON')
  })

  it('supports custom checked/unchecked values', async () => {
    const wrapper = mount(Switch, {
      props: { modelValue: 'no', checkedValue: 'yes', uncheckedValue: 'no' },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['yes'])
  })
})
