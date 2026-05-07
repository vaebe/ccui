import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vite-plus/test'
import { h, nextTick } from 'vue'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { CheckBox } from '../index'
import CheckBoxGroup from '../src/check-box-group'

const ns = useNamespace('check-box', true)
const groupNs = useNamespace('check-box-group', true)
const baseClass = ns.b()

describe('checkBox', () => {
  it('dom', async () => {
    const wrapper = shallowMount(CheckBox)

    expect(wrapper.find(baseClass).exists()).toBeTruthy()

    wrapper.unmount()
  })

  it('renders correctly with label prop', () => {
    const wrapper = mount(CheckBox, {
      props: {
        label: 'Test Label',
      },
    })

    expect(wrapper.text()).toContain('Test Label')
  })

  it('renders correctly with default slot', () => {
    const wrapper = mount(CheckBox, {
      slots: {
        default: 'Slot Content',
      },
    })

    expect(wrapper.text()).toContain('Slot Content')
  })

  it('applies active class when checked', async () => {
    const wrapper = mount(CheckBox, {
      props: {
        modelValue: true,
      },
    })

    expect(wrapper.find('label').classes()).toContain('active')
  })

  it('applies disabled class when disabled', async () => {
    const wrapper = mount(CheckBox, {
      props: {
        disabled: true,
      },
    })

    expect(wrapper.find('label').classes()).toContain('disabled')
  })

  it('emits change and update:modelValue events when clicked', async () => {
    const wrapper = mount(CheckBox, {
      props: {
        label: 'Test',
      },
    })

    await wrapper.find('input').trigger('change')

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('does not emit events when disabled', async () => {
    const wrapper = mount(CheckBox, {
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
    const wrapper = mount(CheckBox, {
      props: {
        modelValue: true,
      },
    })

    expect(wrapper.findComponent({ name: 'IconActive' }).exists()).toBe(true)
  })

  it('shows IconDefault when not checked', () => {
    const wrapper = mount(CheckBox, {
      props: {
        modelValue: false,
      },
    })

    expect(wrapper.findComponent({ name: 'IconDefault' }).exists()).toBe(true)
  })

  it('applies custom color when provided', () => {
    const wrapper = mount(CheckBox, {
      props: {
        color: '#ff0000',
        modelValue: true,
      },
    })

    const icon = wrapper.find(ns.e('icon'))
    expect(icon.attributes('style')).toContain('fill: #ff0000')
  })

  it('calls beforeChange function when provided', async () => {
    const beforeChange = vi.fn().mockResolvedValue(true)
    const wrapper = mount(CheckBox, {
      props: {
        label: 'Test',
        beforeChange,
      },
    })

    await wrapper.find('input').trigger('change')

    // 验证beforeChange是否被调用
    expect(beforeChange).toHaveBeenCalled()
  })

  it('renders checkbox group direction and slot items', () => {
    const wrapper = mount(CheckBoxGroup, {
      props: {
        modelValue: ['a'],
        direction: 'row',
      },
      slots: {
        default: () => [h(CheckBox, { label: 'a' }), h(CheckBox, { label: 'b' })],
      },
    })

    expect(wrapper.find(groupNs.b()).classes()).toContain('is-row')
    expect(wrapper.findAll(ns.b()).length).toBe(2)
    expect(wrapper.findAll('label')[0].classes()).toContain('active')
  })

  it('emits added values from checkbox group', async () => {
    const wrapper = mount(CheckBoxGroup, {
      props: {
        modelValue: ['a'],
      },
      slots: {
        default: () => [h(CheckBox, { label: 'a' }), h(CheckBox, { label: 'b' })],
      },
    })

    await wrapper.findAll('input')[1].trigger('change')
    await nextTick()

    expect(wrapper.emitted('change')?.[0]).toEqual([['a', 'b']])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a', 'b']])
  })

  it('emits removed values from checkbox group', async () => {
    const wrapper = mount(CheckBoxGroup, {
      props: {
        modelValue: ['a', 'b'],
      },
      slots: {
        default: () => [h(CheckBox, { label: 'a' }), h(CheckBox, { label: 'b' })],
      },
    })

    await wrapper.findAll('input')[0].trigger('change')
    await nextTick()

    expect(wrapper.emitted('change')?.[0]).toEqual([['b']])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['b']])
  })

  it('passes disabled color and beforeChange through checkbox group', async () => {
    const beforeChange = vi.fn().mockReturnValue(false)
    const wrapper = mount(CheckBoxGroup, {
      props: {
        modelValue: [],
        disabled: true,
        color: '#00ff00',
        beforeChange,
      },
      slots: {
        default: () => h(CheckBox, { label: 'a' }),
      },
    })

    expect(wrapper.find('label').classes()).toContain('disabled')
    expect(wrapper.find(ns.e('icon')).attributes('style')).toContain('fill: #00ff00')

    await wrapper.find('input').trigger('change')
    expect(beforeChange).not.toHaveBeenCalled()
    expect(wrapper.emitted('change')).toBeUndefined()
  })
})
