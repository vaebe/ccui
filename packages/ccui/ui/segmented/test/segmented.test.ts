import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { formItemInjectionKey } from '../../form/src/form-types'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Segmented } from '../index'

const ns = useNamespace('segmented', true)

describe('segmented', () => {
  it('renders all options', () => {
    const wrapper = mount(Segmented, {
      props: { modelValue: 'a', options: ['a', 'b', 'c'] },
    })
    expect(wrapper.findAll(ns.e('item')).length).toBe(3)
  })

  it('marks selected item', () => {
    const wrapper = mount(Segmented, {
      props: { modelValue: 'b', options: ['a', 'b'] },
    })
    expect(wrapper.findAll(ns.em('item', 'selected')).length).toBe(1)
  })

  it('renders an option icon only when the default slot does not replace the label', () => {
    const wrapper = mount(Segmented, {
      props: { modelValue: 'a', options: [{ label: 'A', value: 'a', icon: 'icon-calendar' }] },
    })

    // `icon` is a documented option field, so the default rendering must not silently discard it.
    const icon = wrapper.findAll('i').find((element) => element.classes().includes('icon-calendar'))
    expect(icon?.classes()).toContain(ns.e('icon').slice(1))
    expect(icon?.attributes('aria-hidden')).toBe('true')
  })

  it('emits update:modelValue on click', async () => {
    const wrapper = mount(Segmented, {
      props: { modelValue: 'a', options: ['a', 'b'] },
    })
    await wrapper.findAll(ns.e('item'))[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
  })

  it('does not switch on disabled option', async () => {
    const wrapper = mount(Segmented, {
      props: {
        modelValue: 'a',
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b', disabled: true },
        ],
      },
    })
    await wrapper.findAll(ns.e('item'))[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('uses a radio group and only emits one change for an input selection', async () => {
    const wrapper = mount(Segmented, {
      props: { modelValue: 'a', options: ['a', 'b'] },
    })
    const inputs = wrapper.findAll('input')

    expect(wrapper.attributes('role')).toBe('radiogroup')
    expect(inputs[0].attributes('name')).toBe(inputs[1].attributes('name'))
    await inputs[1].setValue(true)
    expect(wrapper.emitted('update:modelValue')).toEqual([['b']])
    expect(wrapper.emitted('change')).toEqual([['b']])
  })

  it('moves selection with keyboard navigation while skipping disabled options', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(Segmented, {
      props: {
        modelValue: 'a',
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b', disabled: true },
          { label: 'C', value: 'c' },
        ],
        'onUpdate:modelValue': onUpdate,
      },
      attachTo: document.body,
    })

    await wrapper.find('input').trigger('keydown', { key: 'ArrowRight' })
    expect(onUpdate).toHaveBeenCalledWith('c')
    expect(document.activeElement).toBe(wrapper.findAll('input')[2].element)

    await wrapper.setProps({ modelValue: 'c' })
    await wrapper.find('input').trigger('keydown', { key: 'Home' })
    expect(onUpdate).toHaveBeenLastCalledWith('a')
    wrapper.unmount()
  })

  it('forwards root attributes and validates FormItem on change and leaving the group', async () => {
    const validate = vi.fn()
    const wrapper = mount(Segmented, {
      global: {
        provide: {
          [formItemInjectionKey as symbol]: {
            validate,
            validateStatus: ref('error'),
            messageId: ref('segmented-error'),
          },
        },
      },
      attrs: { id: 'segmented', 'aria-label': '范围', 'aria-describedby': 'help' },
      props: { modelValue: 'a', options: ['a', 'b'] },
      attachTo: document.body,
    })

    expect(wrapper.attributes('id')).toBe('segmented')
    expect(wrapper.attributes('aria-describedby')).toBe('help segmented-error')
    await wrapper.findAll('input')[1].setValue(true)
    await wrapper.trigger('focusout', { relatedTarget: document.body })
    expect(validate).toHaveBeenCalledWith('change')
    expect(validate).toHaveBeenCalledWith('blur')
    wrapper.unmount()
  })
})
