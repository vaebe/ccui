import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
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
})
