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

  describe('XL-4 ARIA', () => {
    it('未勾选 / 已勾选时 aria-checked 跟随', async () => {
      const w1 = mount(Switch, { props: { modelValue: false } })
      expect(w1.attributes('role')).toBe('switch')
      expect(w1.attributes('aria-checked')).toBe('false')
      const w2 = mount(Switch, { props: { modelValue: true } })
      expect(w2.attributes('aria-checked')).toBe('true')
    })

    it('disabled / loading 时补 aria-disabled / aria-busy', () => {
      const wrapper = mount(Switch, { props: { modelValue: false, disabled: true, loading: true } })
      expect(wrapper.attributes('aria-disabled')).toBe('true')
      expect(wrapper.attributes('aria-busy')).toBe('true')
    })
  })
})
