import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useNamespace } from '../../shared/hooks/use-namespace'
import { Steps } from '../index'

const ns = useNamespace('steps', true)

describe('steps', () => {
  it('renders all items', () => {
    const wrapper = mount(Steps, {
      props: {
        current: 0,
        items: [{ title: 'A' }, { title: 'B' }, { title: 'C' }],
      },
    })
    expect(wrapper.findAll(ns.e('item')).length).toBe(3)
  })

  it('marks finished and process items correctly', () => {
    const wrapper = mount(Steps, {
      props: {
        current: 1,
        items: [{ title: 'A' }, { title: 'B' }, { title: 'C' }],
      },
    })
    expect(wrapper.findAll(ns.em('item', 'finish')).length).toBe(1)
    expect(wrapper.findAll(ns.em('item', 'process')).length).toBe(1)
    expect(wrapper.findAll(ns.em('item', 'wait')).length).toBe(1)
  })

  it('emits update:current on click', async () => {
    const wrapper = mount(Steps, {
      props: {
        current: 0,
        items: [{ title: 'A' }, { title: 'B' }],
      },
    })
    await wrapper.findAll(ns.e('item'))[1].trigger('click')
    expect(wrapper.emitted('update:current')?.[0]).toEqual([1])
  })

  it('does not emit on disabled item', async () => {
    const wrapper = mount(Steps, {
      props: {
        current: 0,
        items: [{ title: 'A' }, { title: 'B', disabled: true }],
      },
    })
    await wrapper.findAll(ns.e('item'))[1].trigger('click')
    expect(wrapper.emitted('update:current')).toBeUndefined()
  })

  it('respects custom item status', () => {
    const wrapper = mount(Steps, {
      props: {
        current: 0,
        items: [{ title: 'A', status: 'error' }, { title: 'B' }],
      },
    })
    expect(wrapper.findAll(ns.em('item', 'error')).length).toBe(1)
  })
})
