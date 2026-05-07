import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vite-plus/test'
import { h, nextTick } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Radio, RadioGroup } from '../index'

const ns = useNamespace('radio', true)
const groupNs = useNamespace('radio-group', true)
const baseClass = ns.b()

describe('radio', () => {
  it('dom', async () => {
    const wrapper = shallowMount(Radio)

    expect(wrapper.find(baseClass).exists()).toBeTruthy()

    wrapper.unmount()
  })

  it('renders correctly with label prop', () => {
    const wrapper = mount(Radio, {
      props: {
        label: 'Test Label',
      },
    })

    expect(wrapper.text()).toContain('Test Label')
  })

  it('renders correctly with default slot', () => {
    const wrapper = mount(Radio, {
      slots: {
        default: 'Slot Content',
      },
    })

    expect(wrapper.text()).toContain('Slot Content')
  })

  it('applies active class when checked', async () => {
    const wrapper = mount(Radio, {
      props: {
        modelValue: 'test',
        label: 'test',
      },
    })

    expect(wrapper.find('label').classes()).toContain('active')
  })

  it('applies disabled class when disabled', async () => {
    const wrapper = mount(Radio, {
      props: {
        disabled: true,
      },
    })

    expect(wrapper.find('label').classes()).toContain('disabled')
  })

  it('emits change and update:modelValue events when clicked', async () => {
    const wrapper = mount(Radio, {
      props: {
        label: 'Test',
      },
    })

    await wrapper.find('input').trigger('change')

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('does not emit events when disabled', async () => {
    const wrapper = mount(Radio, {
      props: {
        disabled: true,
        label: 'Test',
      },
    })

    await wrapper.find('input').trigger('change')

    expect(wrapper.emitted('change')).toBeFalsy()
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('shows IconActive when checked', () => {
    const wrapper = mount(Radio, {
      props: {
        modelValue: 'test',
        label: 'test',
      },
    })

    expect(wrapper.findComponent({ name: 'IconActive' }).exists()).toBe(true)
  })

  it('shows IconCircle when not checked', () => {
    const wrapper = mount(Radio, {
      props: {
        modelValue: 'other',
        label: 'test',
      },
    })

    expect(wrapper.findComponent({ name: 'IconCircle' }).exists()).toBe(true)
  })

  it('calls beforeChange function when provided', async () => {
    const beforeChange = vi.fn().mockResolvedValue(true)
    const wrapper = mount(Radio, {
      props: {
        label: 'Test',
        beforeChange,
      },
    })

    await wrapper.find('input').trigger('change')

    expect(beforeChange).toHaveBeenCalledWith('Test')
  })

  it('renders radio group direction and active child', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        modelValue: 'a',
        direction: 'row',
      },
      slots: {
        default: () => [h(Radio, { label: 'a' }), h(Radio, { label: 'b' })],
      },
    })

    expect(wrapper.find(groupNs.b()).classes()).toContain('is-row')
    expect(wrapper.findAll(ns.b()).length).toBe(2)
    expect(wrapper.findAll('label')[0].classes()).toContain('active')
  })

  it('emits selected value from radio group', async () => {
    const wrapper = mount(RadioGroup, {
      props: {
        modelValue: 'a',
      },
      slots: {
        default: () => [h(Radio, { label: 'a' }), h(Radio, { label: 'b' })],
      },
    })

    await wrapper.findAll('input')[1].trigger('change')
    await nextTick()

    expect(wrapper.emitted('change')?.[0]).toEqual(['b'])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
  })

  it('passes disabled and beforeChange through radio group', async () => {
    const beforeChange = vi.fn().mockReturnValue(false)
    const wrapper = mount(RadioGroup, {
      props: {
        modelValue: '',
        disabled: true,
        beforeChange,
      },
      slots: {
        default: () => h(Radio, { label: 'a' }),
      },
    })

    expect(wrapper.find('label').classes()).toContain('disabled')

    await wrapper.find('input').trigger('change')
    expect(beforeChange).not.toHaveBeenCalled()
    expect(wrapper.emitted('change')).toBeUndefined()
  })
})
